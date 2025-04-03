<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Setup.php");
// require_once(SERVER_PATH . "/classes/Dashboard.php");

class Hr extends Xtreme
{
    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;
    private $r_id = 0;
    private $e_id = 0;
    private $m_id = 0;
    private $p_id = 0;
    private $user_type = 0;
    private $company_id = 0;
    // private $objdashboard = null;

    function __construct($user_info = array())
    {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->arrUser = $user_info;
        $this->objsetup = new Setup($this->arrUser);
        // $this->objdashboard = new Dashboard($this->arrUser);
    }

    function getEmployeeGlobalData($attr)
    {
        $empllastUpdateTime = $attr['empllastUpdateTime'];

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
                {
                    $response['ack'] = 1;
                    $response['error'] = 3;
                    $response['empllastUpdateTime'] = $empllastUpdateTime;
                    return $response;
                }
            }
        }

        $result1 = $this->get_all_hr_department($attr);
        $response['response']['deprtment_arr'] = $result1['response'];

        $result2 = $this->get_hr_employee_type($attr);
        $response['response']['emp_type_arr'] = $result2['response'];

        $attr['deprtment_type'] = 2;
        $result3 = $this->get_employees($attr, 1);//get sales person listing
        $response['response']['salesperson_arr'] = $result3['response'];

        $result4 = $this->get_vat_list($attr);
        $response['response']['arr_vat'] = $result4['response'];
        
        // $result5 = $this->get_vat_group_by_posting_group($attr);
        // $response['response']['arr_vat_post_grp'] = $result5['response'];

        $Sql = "SELECT UNIX_TIMESTAMP(NOW()) AS current_date_time";
        // echo $Sql;exit;
        $RS = $this->Conn->Execute($Sql);
        $response['empllastUpdateTime'] = $RS->fields['current_date_time'];
        
        $response['ack'] = 1;
        $response['error'] = NULL;
        // print_r($response);  exit;
        return $response;
    }

    function get_permissionn($attr)
    {
        //$this->objGeneral->mysql_clean($attr);

        $this->e_id = $this->arrUser['e_id'];
        $this->m_id = $this->arrUser['m_id'];
        $this->r_id = $this->arrUser['r_id'];
        $this->p_id = $this->arrUser['p_id'];
        $this->user_type = $this->arrUser['user_type'];
        $this->company_id = $this->arrUser['company_id'];

        $Sql = "SELECT count(id) as result 
				FROM employee_roles as er 
				WHERE er.employee_id=$this->e_id AND 
                      er.role_id=$this->r_id AND 
                      er.module_id=$this->m_id AND 
                      er.permisions IN( $this->p_id) 
				LIMIT 1";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result = $Row['result'];
            }
        }

        if ($result > 0) {
            return true;
        } else {
            return false;
        }
    }

    // static	
    function delete_update_status($table_name, $column, $id)
    {
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

    function get_data_by_id($table_name, $id)
    {
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

    /*     * ******* Start: Roles ********* */

    function get_parent_module_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = " SELECT id,name
				FROM ref_module
				WHERE parent_id=0
				ORDER BY id ASC ";

        $RS = $this->objsetup->CSI($Sql);
        //echo "<pre>";print_r($Sql);exit;
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_child_module_list($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        $Sql = " SELECT id,name
				FROM ref_module
				WHERE parent_id=" . $arr_attr['id'] . "
				ORDER BY id ASC ";

        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_child_module_list_selected($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $per_data = explode(",", $arr_attr['permisions']);


        $Sql = " SELECT id,name
		FROM ref_module
		WHERE parent_id=" . $arr_attr['id'] . "
		ORDER BY id ASC ";

        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];

                if (in_array($Row['id'], $per_data)) { // if ( is_array($m_id['id']) )//  if ( $per_id == $m_id['id'] )
                    $result['checked'] = TRUE; // $result['check_status'] =TRUE;  
                } else {

                    $result['checked'] = FALSE; // $result['check_status'] = 0;
                }
                $response['response'][] = $result;
            }
        } else {
            $response_1['response'] = array();
        }

        return $response;
        $count = 0;
        $per_data = explode(",", $arr_attr['permisions']);
        foreach ($response_1['response'] as $key => $m_id) {

            if (in_array($m_id['id'], $per_data)) { // if ( is_array($m_id['id']) )//  if ( $per_id == $m_id['id'] )
                $result['id'] = $m_id['id'];
                $result['name'] = $m_id['name'];
                $result['checked'] = 1;
                $response['response'][] = $result;
            } else {  // if ( $per_id != $m_id['id'] )
                $result['id'] = $m_id['id'];
                $result['name'] = $m_id['name'];
                $result['checked'] = 2;
                $response['response'][] = $result;
            }
        }
    }

    /*     * ******* Add Roles to Employee ********* */

    function get_role_to_employee($arr_attr)
    {
        $Sql = "SELECT role_id FROM employee_roles  WHERE employee_id = '".$arr_attr['id']."'  ";

        $RS = $this->objsetup->CSI($Sql);
        $roles = [];
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                array_push($roles, $Row[0]);
                
            }
            $roles = implode(",", $roles);
        }
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
        }
            $response['response'] = $roles;
            $response['ack'] = 1;
            $response['error'] = NULL;

        return $response;
    }

    function get_buckets_to_employee($arr_attr){
        $Sql = "SELECT bucket_id FROM employee_bucket WHERE employee_id = '".$arr_attr['id']."'";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $buckets = [];

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                array_push($buckets, $Row[0]);
                
            }
            $buckets = implode(",", $buckets);
        }

        $response['response'] = $buckets;
        $response['ack'] = 1;
        $response['error'] = NULL;
        
        //print_r($response);exit;
        return $response;
    }

    function add_role_to_employee($arr_attr)
    {
        $Sqli = "DELETE FROM employee_roles   WHERE employee_id= '" . $arr_attr['id'] . "' ";
        //echo  $Sqli;exit;
        $RS = $this->objsetup->CSI($Sqli);


        $check = false;
        $Sql = "INSERT INTO employee_roles (employee_id,role_id,company_id,  user_id,date_added) VALUES ";
        foreach ($arr_attr['rolesdata'] as $item) {

            $Sql .= "(  '" . $arr_attr['id'] . "' ," . $item->id . "  ," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "	,'" . current_date . "' ), ";

            $check = true;
        }
        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        //echo $Sql;exit;
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

    function get_roles($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword']))
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";

        $response = array();

        $Sql = "SELECT   c.id,c.role,c.role_code   FROM  	ref_roles c
		 left JOIN company on company.id=c.company_id 
		where  c.status=1 
		AND (c.company_id=" . $this->arrUser['company_id'] .  ")		 
		" . $where_clause . "
		order by  c.role ASC ";

        //echo 	$Sql;exit;
        $RS = $this->objsetup->CSI($Sql, "human_resource", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                //  $result['code'] = $Row['role_code'];
                $result['name'] = $Row['role'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function get_populated_roles($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT c.id,c.role,c.role_code   
                FROM ref_roles c
                WHERE c.status=1  AND c.company_id=" . $this->arrUser['company_id'] .  "
                ORDER BY c.role ASC ";// AND (select COUNT(1) FROM ref_user_rights rur WHERE rur.role_id = c.id)

        //echo 	$Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                //  $result['code'] = $Row['role_code'];
                $result['name'] = $Row['role'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_role_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT r.* FROM ref_roles AS r
		where  r.id='".$attr['id']."' and company_id=".$this->arrUser['company_id']." 
		LIMIT 1";
        $RS = $this->objsetup->CSI($Sql, "human_resource", sr_ViewPermission);

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
        } else{
            $response['response'] = array();
            $response['bucketFail'] = 1;
        }

        return $response;
    }

    function addWidgetRole ($id){
        $Sql = "SELECT id from widgets;";
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
				foreach ($Row as $key => $value) {
					if (is_numeric($key))
					unset($Row[$key]);
				}
				$ids[] = $Row['id'];
			}
            // print_r($ids);exit;
			if (!empty($ids)){
                foreach ($ids as $key => $value){
                    $Sql2 = "INSERT INTO widgetroles SET widget_id=".$value.", role_id=".$id.", permission=0, company_id=".$this->arrUser['company_id'].", type=1";
                    // echo $Sql2;
                    $RS2 = $this->objsetup->CSI($Sql2);
                }
			} 
		} 
    }

    function addReportRole ($id){
        $Sql = "SELECT id from reports";
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
				foreach ($Row as $key => $value) {
					if (is_numeric($key))
					unset($Row[$key]);
				}
				$ids[] = $Row['id'];
			}
            // print_r($ids);exit;
			if (!empty($ids)){
                foreach ($ids as $key => $value){
                    $Sql2 = "INSERT INTO widgetroles SET widget_id=".$value.", role_id=".$id.", permission=0, company_id=".$this->arrUser['company_id'].", type=2";
                    // echo $Sql2;
                    $RS2 = $this->objsetup->CSI($Sql2);
                }
			} 
		} 
    }

    function add_role($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;        
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = " tst.role='$arr_attr[role]'  ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_roles', $data_pass, $this->arrUser['company_id']);

        if ($total >= 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO ref_roles
                            SET  
                                role='$arr_attr[role]',
                                role_code='$arr_attr[role_code]',
                                status='$arr_attr[statuss]',
                                company_id='" . $this->arrUser['company_id'] . "',
                                user_id='" . $this->arrUser['id'] . "',
                                date_added='" . current_date . "',
                                start_date ='" . $this->objGeneral->convert_date($arr_attr['start_date']) . "',
                                end_date = '" . $this->objGeneral->convert_date($arr_attr['end_date']) . "'";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        $this->addWidgetRole($id);
        $this->addReportRole($id);
        
        //$this->Conn->Affected_Rows()
        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    function update_role($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);
        //print_r($arr_attr);exit;
        $data_pass = " tst.role='$arr_attr[role]' AND tst.id <> '".$arr_attr['id']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_roles', $data_pass, $this->arrUser['company_id']);

        if ($total >= 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE ref_roles
                        SET 
                            role='$arr_attr[role]',
                            role_code='$arr_attr[role_code]',
                            status='$arr_attr[statuss]',
                            start_date ='" . $this->objGeneral->convert_date($arr_attr['start_date']) . "',
                            end_date = '" . $this->objGeneral->convert_date($arr_attr['end_date']) . "'
                        WHERE id = ".$arr_attr['id']." 
                        Limit 1 ";

        ///echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            // $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }

    function deleteWidgetRole($id){
        $Sql = "DELETE FROM widgetroles WHERE role_id=".$id;
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
    }

    function delete_role($attr)
    {
        // print_r($attr);exit;

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);
        // $arr_attr['id'];
        //$Sql = "DELETE FROM roles WHERE id = ".$arr_attr['id']." Limit 1 ";
        $Sql = "UPDATE ref_roles
			SET  
			status=0
			WHERE id = ".$arr_attr['id']." Limit 1";
        // echo $Sql;exit; 

        $RS = $this->objsetup->CSI($Sql);

        
        if ($this->Conn->Affected_Rows() > 0) {
            $this->deleteWidgetRole($arr_attr['id']);
            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }

    function get_user_rights_module_data($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);exit;

        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT r.* FROM ref_module AS r WHERE status = 1 Order by r.group_order, r.order";
        // echo 	$Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['display_name'] = $Row['display_name'];
                $result['complete_name'] = $Row['complete_name'];
                $result['parent_id'] = $Row['parent_id'];
                $result['type'] = $Row['type'];
                $result['valid_permissions'] = $Row['valid_permissions'];
                $result['linkedRecords'] = $Row['linkedRecords'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    /*     * ******* Start: User Rights ********* */

    function get_user_rights_list($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        //print_r($attr);exit;

        $response = array();

        $Sql = "SELECT c.id,c.name,c.status,c.module_id,c.permisions,ref_module.display_name,ref_module.complete_name,ref_module.order    
                FROM  ref_user_rights c
                LEFT JOIN ref_module ON ref_module.id = c.module_id
                WHERE   c.status = 1 AND c.role_id = ".$arr_attr['id']." AND 
                        c.company_id=" . $this->arrUser['company_id'] . "	
		        ORDER BY  c.id DESC ";

        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                //$result['name'] = $Row['name'];
                //$result['name'] = $Row['display_name'];
                $result['Name'] = $Row['complete_name'];
                $result['permissions'] = $Row['permisions'];
                $result['status'] = ($Row['status'] == "1") ? "Active" : "Inactive";
                $result['order'] = $Row['order'];
                $result['module_id'] = $Row['module_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_user_rights_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT r.* FROM ref_user_rights AS r where r.id='".$attr['id']."'	LIMIT 1";
        //echo  $Sql;exit;
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
        } else
            $response['response'] = array();

        //print_r($response);exit;
        return $response;
    }

    function add_user_rights($attr)
    {
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);


        $arr_attr = array();
        $arr_attr = (array)$attr;

        //print_r($arr_attr);exit;

        if ($arr_attr['role_id'] > 0)
            $where_id = " AND tst.id <> '$arr_attr[role_id]' ";


        $data_pass = "  tst.role='" . $arr_attr['role'] . "'  $where_id  ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_roles', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }


        $id = $arr_attr['role_id'];
        $chk = 0;
        $ids = "";

    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;


        $Sqladd = "INSERT INTO ref_user_rights (role_id,name,module_id ,permisions,allow_flag,company_id,  user_id,date_added)
                    VALUES ";
        $SqlEntries = "";            
        if ($arr_attr['role_id']) {
            foreach ($attr['selected'] as $item) {
                //if(count($item->permisions)>0) 
                $sql_total = "SELECT  count(tst.id) as total,tst.id	FROM ref_user_rights as tst LEFT JOIN company on company.id=tst.company_id WHERE tst.role_id= $attr[role_id]  AND tst.module_id= $item->module_id AND  tst.status=1 AND (tst.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") Limit 1";
                //echo $sql_total . "\n";
                $rs_count = $this->objsetup->CSI($sql_total);
                
                if ($rs_count->fields['total'] > 0)
                    $ids .= $rs_count->fields['id'] . ',';
                
                    $SqlEntries .= "( '" . $attr['role_id'] . "','" . $item->name . "','" . $item->module_id . "','" . $item->permisions . "','" . $item->allow_flag . "','" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "','" . current_date . "' ), ";
                
            }

            //echo "-----".$ids."\n";exit;

            $ids = substr($ids, 0, -1);
            //echo $ids;exit;
            $sql_del = "DELETE FROM ref_user_rights WHERE role_id = $id";
            //echo $sql_del;
            if (!empty($ids)){
                //echo "deleted";
                $RSdel = $this->objsetup->CSI($sql_del);

                $srLogTrace = array();

                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_3;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'role_id:'.$id;

                $this->objsetup->SRTraceLogsPHP($srLogTrace);

            }
            if(strlen($SqlEntries) > 0)
            {
                $SqlEntries = substr_replace(substr($SqlEntries, 0, -1), "", -1);
                $Sqladd .= $SqlEntries;
                //echo  $Sqladd;exit;
                $RS = $this->objsetup->CSI($Sqladd);

                $srLogTrace = array();

                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_3;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'role_id:'.$id;

                $this->objsetup->SRTraceLogsPHP($srLogTrace);

            }
            else
            {
                $response['ack'] = 0;
                $response['error'] = 'No data provided for update.';
                return $response;
            }
            //print_r($RS);
        } else {
            $Sql = "UPDATE ref_user_rights SET module_id='$arr_attr[module_id]',name='".$arr_attr['name']."',permisions='$arr_attr[selectedList]' WHERE id = ".$arr_attr['id']."	Limit 1 ";
            	// echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_3;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'role_id:'.$arr_attr['id'];

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

                    
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    function delete_user_rights($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);
        // $arr_attr['id'];;
        //$Sql = "DELETE FROM roles WHERE id = ".$arr_attr['id']." Limit 1 ";
        $Sql = "UPDATE  ref_user_rights
			SET  
			status=0
			WHERE id = ".$arr_attr['id']." Limit 1";
        //print_r($Sql);exit; 

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

    /*     * ******* Start: Permission ********* */

    function get_permision_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT c.id,c.name  
                FROM ref_permisions c
                where c.status=1  " . $where_clause . "
                order by  c.order ASC ";

        //echo 	$Sql;exit;
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
        } else
            $response['response'][] = array();

        return $response;
    }

    function add_permision($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;

        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "   tst.name='".$arr_attr['name']."'   $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_roles', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($arr_attr['id'] == 0) {
            $Sql = "INSERT INTO ref_permisions
                                    SET  
                                        name='".$arr_attr['name']."',
                                        status=1,
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "',
                                        date_added='" . current_date . "'";
        } else {
            $Sql = "UPDATE ref_permisions	SET name='".$arr_attr['name']."' 	WHERE id = ".$arr_attr['id']." Limit 1 ";
        }

        //	echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($arr_attr['id'] == 0)
            $id = $this->Conn->Insert_ID();

        //$this->Conn->Affected_Rows()
        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    /*     * ******* Start: User's Roles ********* */

    function get_user_roles($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);exit;

        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND role_id LIKE '%$attr[role_id]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT id, role_id, company_id
				FROM employee_roles
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";


        //echo $total_records."<hr>";
        $Sql .= $limit_clause;
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['role_id'] = $Row['role_id'];
                $result['company_id'] = $Row['company_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_user_role($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $data_pass = "  tst.role_id='" . $arr_attr['role_id'] . "'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('employee_roles', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "INSERT INTO employee_roles
				SET 
				role_id='".$arr_attr['role_id']."',
				user_id='".$this->arrUser['id']."',
				company_id='".$this->arrUser['company_id']."',
				status='$this->arrUser[status]'";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    function update_user_role($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);


        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "  tst.role_id='" . $arr_attr['role_id'] . "'  $where_id  ";
        $total = $this->objGeneral->count_duplicate_in_sql('employee_roles', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE employee_roles
				SET 
				role_id='$arr_attr[role_id]'
				WHERE id = ".$arr_attr['id']." Limit 1 ";

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

    function delete_user_role($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "Update employee_roles set status=0 WHERE id = ".$arr_attr['id']." Limit 1 ";

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

    function status_user_role($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE employee_roles SET status='$arr_attr[status]' WHERE id = ".$arr_attr['id']." ";

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

    function add_multiple_role_employee($attr)
    {
        $arr_attr = array();
        $arr_attr = (array)$attr;

        $check = false;
        $Sql = "INSERT INTO employee_roles (role_id,employee_id,company_id,  user_id,date_added) VALUES ";
        foreach ($arr_attr['salespersons'] as $item) {


            $sql_total = "SELECT  count(tst.id) as total,tst.id	FROM employee_roles as tst
				LEFT JOIN company on company.id=tst.company_id 
				WHERE tst.role_id=  $arr_attr[role_id]  AND tst.employee_id= '" . $item->id . "'
				 AND  tst.status=1 
				AND (tst.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") Limit 1	";
            $rs_count = $this->objsetup->CSI($sql_total);
            if ($rs_count->fields['total'] == 0) {
                $Sql .= "(  '" . $arr_attr['role_id'] . "' ," . $item->id . "  ," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "	,'" . current_date . "' ), ";
            }

            $check = true;
        }
        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
          //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }

    /*     * ******* End: User's Roles ********* */

    //Bucket Sales Person

    function get_Sale_Person_by_Bucket($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);exit;
        $limit_clause = "";
        $where_clause = "";
        //$where_clause = "AND company_id =".$this->arrUser['company_id'];

        if (!empty($attr['keyword']))
            $where_clause .= " AND first_name LIKE '%$attr[keyword]%' ";

        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();


        $Sql = "SELECT employees.id ,employees.user_code,employees.first_name,employees.last_name,employees.job_title ,departments.name as dname ,
                        ( SELECT cr.name FROM employee_type as cr where cr.id =employees.employee_type ) as emp_type
                from employees 
                left JOIN company on company.id=employees.user_company 
                left JOIN departments on departments.id=employees.department 
                left JOIN crm_salesperson on crm_salesperson.salesperson_id= employees.id
                where (employees.user_company=45 or company.parent_id=45) AND 
                        crm_salesperson.module_id='$attr[bkt_id]' AND  
                        crm_salesperson.type='".$attr['type']."'
                ORDER BY employees.id DESC";
        // echo $Sql;exit;
        //echo $total_records."<hr>";
        $Sql .= $limit_clause;
        //echo $Sql."<hr>";exit;
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
                $result['employee_type'] = $Row['emp_type'];
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

    // Employee
    //--------------------------------------
    function get_employees($attr=array(), $arg=null)
    { 
        // error_reporting(E_ALL);
        $limit_clause = "";
        $where_clause = "";
        $order_by = "";
        $deprt_join = ""; 
        // print_r($attr);exit;

        

        if (!empty($attr['searchKeyword'])) {
            $val = intval(preg_replace("/[^0-9]/", '', $attr['searchKeyword']));
            $where_clause .= " AND ( emp.user_code LIKE '%".$attr['searchKeyword']."%'
			 OR emp.first_name LIKE '%".$attr['searchKeyword']."%'  OR emp.last_name LIKE '%".$attr['searchKeyword']."%'
			 OR emp.job_title LIKE '%".$attr['searchKeyword']."%' ) ";
        }
        // else $attr['searchKeyword'] = {};

        if (!empty($attr['emp_types']))
            {$where_clause .= " AND  emp.employee_type=".$attr['emp_types']." ";}

        if (!empty($attr['deprtments']))
            {$where_clause .= " AND  emp.department LIKE '%".$attr['deprtments']."%' ";}

        if (!empty($attr['admin_emp_chk']))
            {$where_clause .= " AND  emp.emp_type<>1 ";}
        //

        if (isset($attr['filter_status']) || $attr['filter_status'] == "0")
            {$where_clause .= " AND emp.status = " . $attr['filter_status'];}
        else if(isset($attr['show_active_inactive']) || $attr['show_active_inactive'] == "1")
            {$where_clause .= " AND emp.status IN (0, 1)";}
        else
            {$where_clause .= " AND emp.status = 1";}

        $response = array();

        $Sql = "SELECT   emp.* 
                from sr_employee_sel emp
                ".$deprt_join."
                where emp.user_company=" . $this->arrUser['company_id'] . "
                      ".$where_clause."
                      ".$dept_where_clause." ";
                      //echo $Sql;exit;
      //  $order_by = "group by emp.id";

        if ($arg == 1) {$direct_limit = cache_pagination_limit;}
        else {$direct_limit = pagination_limit;}

        if($attr['limit']>0 && isset($attr['searchKeyword']))
            {$attr['searchKeyword']->totalRecords = 9999;}

        //defualt Variable
        $total_limit = 99999;

        if (!empty($attr['sort_column'])) {

            $column = 'emp.' . $attr['sort_column'];
            if ($attr['sort_column'] == 'name')
                $column = 'emp.' . 'first_name';
            else if ($attr['sort_column'] == 'code')
                $column = 'emp.' . 'user_code';
            else if ($attr['sort_column'] == "Department")
                $column = 'dep.' . 'name';
            else if ($attr['sort_column'] == 'Email')
                $column = 'emp.' . 'user_email';
            else if ($attr['sort_column'] == 'Phone')
                $column = 'emp.' . 'work_phone';
            else if ($attr['sort_column'] == 'Mobile')
                $column = 'emp.' . 'mobile_phone';
            else if ($attr['sort_column'] == "employee_type")
                $column = 'empt.' . 'name';

            $order_type = "Order BY " . $column . " $attr[sortform]";
        }
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'emp', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        // $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['user_code'];
                // $result['Employee_Name'] = $Row['first_name'] . ' ' . $Row['last_name'];
                $result['name'] = $Row['first_name'] . ' ' . $Row['last_name'];

                $result['job_title'] = $Row['job_title'];
                $result['Department'] = $Row['dname'];
                $result['Email'] = $Row['user_email'];
                // commented below line for the requirement 
                // $result['internal_ext.'] = $Row['internal_extention'];
                $result['Telephone'] = $Row['work_phone'];
                $result['Mobile'] = $Row['mobile_phone'];
                $result['employee_type'] = $Row['emp_type'];

                if ($Row['allow_login'] == 1)
                    $result['Allow_login'] = "Yes";
                else
                    $result['Allow_login'] = "No";

                $result['status'] = $Row['statusp'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'] = array();


        return $response;
    }

    // Abscence Registration
    //--------------------------------------------

    function get_leaves($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $where_clause = "AND company_id =" . $this->arrUser['company_id'];

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND start_from LIKE '%$attr[keyword]%' ";
        }
        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
            $limit_clause = " LIMIT $attr[start] , $attr[limit]";
        }
        $response = array();

        $Sql = "SELECT id, start_from, end_date, total_days, leave_type, status
				FROM leave
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";
        //exit;
        //echo $total_records."<hr>";
        $Sql .= $limit_clause;
        //echo $Sql."<hr>";
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['role'] = $Row['role'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_leave_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM leave
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
            $response['response'] = array();
        }
        return $response;
    }

    function add_leave($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.role_id='" . $attr['role_id'] . "'  $where_id  ";
        $total = $this->objGeneral->count_duplicate_in_sql('leave', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }


        $Sql = "INSERT INTO leave
				SET employee_id='$attr[employee_id]',start_from='$attr[start_from]',
				end_date='" . $this->objGeneral->convert_date($attr['end_date']) . "',date_return='" . $this->objGeneral->convert_date($attr['date_return']) . "',
				total_days='$attr[total_days]',leave_reason='$attr[leave_reason]',leave_type='$attr[leave_type]',
				reason='$attr[reason]',is_authroztion_absent_taken='$attr[is_authroztion_absent_taken]',
				athority_id='$attr[athority_id]',absent_taken_date='" . $this->objGeneral->convert_date($attr['absent_taken_date']) . "',company_notify_data='$attr[company_notify_data]',notifying_person_id='$attr[notifying_person_id]',				doctor_consult='$attr[doctor_consult]',obtain_certificate='$attr[obtain_certificate]',certificate_file='$attr[certificate_file]',taking_medication='$attr[taking_medication]',medication_file='$attr[medication_file]',side_effect_advised='$attr[side_effect_advised]',side_effect_advised='$attr[side_effect_advised]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }

        return $response;
    }

    function update_leave($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "  tst.role_id='" . $attr['role_id'] . "'  $where_id  ";
        $total = $this->objGeneral->count_duplicate_in_sql('leave', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE leave
				SET employee_id='$attr[employee_id]',start_from='$attr[start_from]',end_date='" . $this->objGeneral->convert_date($attr['end_date']) . "',date_return='" . $this->objGeneral->convert_date($attr['date_return']) . "',total_days='$attr[total_days]',leave_reason='$attr[leave_reason]',leave_type='$attr[leave_type]',reason='$attr[reason]',is_authroztion_absent_taken='$attr[is_authroztion_absent_taken]',athority_id='$attr[athority_id]',absent_taken_date='" . $this->objGeneral->convert_date($attr['absent_taken_date']) . "',company_notify_data='$attr[company_notify_data]',notifying_person_id='$attr[notifying_person_id]',doctor_consult='$attr[doctor_consult]',obtain_certificate='$attr[obtain_certificate]',certificate_file='$attr[certificate_file]',taking_medication='$attr[taking_medication]',medication_file='$attr[medication_file]',side_effect_advised='$attr[side_effect_advised]',side_effect_advised='$attr[side_effect_advised]'
				WHERE id = ".$attr['id']." Limit 1 ";

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

    function change_leave_status($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE leave
				SET status='$attr[status]'
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

    function delete_leave($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "DELETE FROM leave
				WHERE id = ".$attr['id']." Limit 1 ";

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

    ############	Start: HR of Tabs  ######

    function get_tabs_hr($attr)
    {
        return; // removing table employee_tabs from db as it is not being used
    }

    function get_tab_by_id($attr)
    {
        return; // removing table employee_tabs from db as it is not being used
    }

    function get_all_tabs($attr)
    {
        return; // removing table employee_tabs from db as it is not being used
    }

    function add_tab($arr_attr)
    {
        return; // removing table employee_tabs from db as it is not being used
    }

    function update_tab($arr_attr)
    {
        return; // removing table employee_tabs from db as it is not being used
    }

    function delete_tab($arr_attr)
    {
        return; // removing table employee_tabs from db as it is not being used
    }

    function status_tab($arr_attr)
    {
        return; // removing table employee_tabs from db as it is not being used
    }

    function sort_tab($arr_attr)
    {
        return; // removing table employee_tabs from db as it is not being used
    }

    ############	Start: HR of Columns ##

    function get_tabs_col($attr)
    {
        return; // removing table employee_tabs from db as it is not being used
    }

    function get_tab_col_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT employee_columns.id, employee_columns.name, employee_columns.sort_id, employee_columns.description, 
                        employee_columns.status, employee_columns.tab_id
                FROM employee_columns 
                where employee_columns.company_id=" . $this->arrUser['company_id'] . " and 
                        employee_columns.id='".$attr['id']."'
                LIMIT 1 ";

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

    function add_tab_col($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $sql_total = "SELECT  count(id) as total	
                      FROM employee_columns 
                      WHERE tab_id='" . $arr_attr['tab_id'] . "' and
                            company_id='" . $this->arrUser['company_id'] . "'";

        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];


        if ($total < HR_MAX_FIELDS) {

            $sql_sort_id = "SELECT  Max(sort_id) as total  
                            FROM employee_columns
                            WHERE company_id='" . $this->arrUser['company_id'] . "' and 
                                    tab_id='" . $arr_attr['tab_id'] . "'";

            $rs_countttt = $this->objsetup->CSI($sql_sort_id);
            $total_sort = $rs_countttt->fields['total'];

            if (empty($total_sort)) {
                $total_s = 1;
            } else {
                $total_s = $total_sort + 1;
            }
            //echo $total_s; 	 

            $Sql = "INSERT INTO employee_columns
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

        $Sql = "UPDATE employee_columns
				SET 
					name='".$arr_attr['name']."',
					description='$arr_attr[description]', 
					status='$arr_attr[status]', 
					tab_id='$arr_attr[tab_id]', 
					sort_id='$arr_attr[sort_id]'
					WHERE id = ".$arr_attr['id']." Limit 1";

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

    function delete_tab_col($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE employee_columns SET status=0 WHERE id = ".$arr_attr['id']." Limit 1";
        $RS = $this->objsetup->CSI($Sql);

        // print_r($Sql);exit;
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

        $Sql = "UPDATE employee_columns SET status='$arr_attr[status]' WHERE id = ".$arr_attr['id']." Limit 1";
        //exit;
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

    function sort_tab_col($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $upslide = strcmp($arr_attr['str'], "up");
        $downslide = strcmp($arr_attr['str'], "down");

        $add = $arr_attr['id'] + 1;
        $sort_id = $arr_attr['sort_id'];
        $sort_post = $sort_id + 1;
        $sort_pre = $sort_id - 1;

        $current = $arr_attr['id'];
        $count = 0;


        if ($upslide == 0) {//&& $arr_attr['index']>=0
            $sql_total = "SELECT  *	FROM employee_columns WHERE sort_id='" . $sort_pre . "' and tab_id='" . $arr_attr['t_id'] . "'";
            $rs_count_start = $this->objsetup->CSI($sql_total);


            if ($rs_count_start->RecordCount() > 0) {


                $Sql = "UPDATE employee_columns SET sort_id = $sort_id WHERE sort_id =  $sort_pre Limit 1 ";
                $RS = $this->objsetup->CSI($Sql);

                $Sql2 = "UPDATE employee_columns SET sort_id = $sort_pre WHERE id = $current Limit 1 ";
                $RS2 = $this->objsetup->CSI($Sql2);

                $count++;
            }
        }

        if ($downslide == 0) { //&& $arr_attr['index']>=0
            $sql_total = "SELECT  *	FROM employee_columns WHERE sort_id='" . $sort_post . "'and tab_id='" . $arr_attr['t_id'] . "'";
            $rs_count_start = $this->objsetup->CSI($sql_total);


            if ($rs_count_start->RecordCount() > 0) {

                $Sql = "UPDATE employee_columns SET sort_id = $sort_id WHERE sort_id = $sort_post and tab_id='" . $arr_attr['t_id'] . "' Limit 1 ";
                $RS = $this->objsetup->CSI($Sql);

                $Sql2 = "UPDATE employee_columns SET sort_id = $sort_post WHERE id = $current and tab_id='" . $arr_attr['t_id'] . "'Limit 1 ";
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

    function get_list_by_tab_id($attr)
    {
        return; // removing table employee_tabs from db as it is not being used
    }

    ############	Start: HR values #### 

    function get_selected_category($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
				FROM employee_columns
				WHERE  status=1 and tab_id='$attr[tab_id]'";

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

    function get_employee_by_id($attr)
    {
        if (empty($attr['id'])) {
            $response['response'] = array();
            return $response;
            exit;
        }

        $Sql = "SELECT * FROM employees	WHERE id='".$attr['id']."' and company_id = '" . $this->arrUser['company_id'] . "' LIMIT 1";
        // echo $Sql;exit;
        if ($attr['id'] == $this->arrUser['id']){
            $RS = $this->objsetup->CSI($Sql);
        }
        else{
            $RS = $this->objsetup->CSI($Sql, "HR", sr_ViewPermission);
        }

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['date_added'] = $this->objGeneral->convert_unix_into_date($Row['date_added']);
            $Row['leave_date'] = $this->objGeneral->convert_unix_into_date($Row['leave_date']);
            $Row['salary_date'] = $this->objGeneral->convert_unix_into_date($Row['salary_date']);
            $Row['salary_date_review'] = $this->objGeneral->convert_unix_into_date($Row['salary_date_review']);
            $Row['mobile_date_assign'] = $this->objGeneral->convert_unix_into_date($Row['mobile_date_assign']);
            $Row['laptop_date_assign'] = $this->objGeneral->convert_unix_into_date($Row['laptop_date_assign']);
            $Row['car_date_assign'] = $this->objGeneral->convert_unix_into_date($Row['car_date_assign']);
            $Row['car_date_return'] = $this->objGeneral->convert_unix_into_date($Row['car_date_return']);
            $Row['laptop_return_date_assign'] = $this->objGeneral->convert_unix_into_date($Row['laptop_return_date_assign']);
            $Row['mobile_return_date_assign'] = $this->objGeneral->convert_unix_into_date($Row['mobile_return_date_assign']);

            $Row['commission_effective_date'] = $this->objGeneral->convert_unix_into_date($Row['commission_effective_date']);

            $Row['er_start_date'] = $this->objGeneral->convert_unix_into_date($Row['er_start_date']);
            $Row['er_end_date'] = $this->objGeneral->convert_unix_into_date($Row['er_end_date']);
            $Row['er_change_date'] = $this->objGeneral->convert_unix_into_date($Row['er_change_date']);
            $Row['ee_start_date'] = $this->objGeneral->convert_unix_into_date($Row['ee_start_date']);
            $Row['ee_change_date'] = $this->objGeneral->convert_unix_into_date($Row['ee_change_date']);
            $Row['ee_end_date'] = $this->objGeneral->convert_unix_into_date($Row['ee_end_date']);
            $Row['tablet_date_assign'] = $this->objGeneral->convert_unix_into_date($Row['tablet_date_assign']);
            $Row['tablet_return_date_assign'] = $this->objGeneral->convert_unix_into_date($Row['tablet_return_date_assign']);
            $Row['case_date'] = $this->objGeneral->convert_unix_into_date($Row['case_date']);
            $Row['status_date'] = $this->objGeneral->convert_unix_into_date($Row['status_date']);
            $Row['status_inactive_date'] = $this->objGeneral->convert_unix_into_date($Row['status_inactive_date']);
            $Row['date_of_birth'] = $this->objGeneral->convert_unix_into_date($Row['date_of_birth']);
			$Row['user_password'] = "Y0u sh@uldn't be doing this..";
			$Row['user_password_prev'] = $Row['user_password'];

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else{
            $response['response'] = array();
            $response['bucketFail'] = 1;
        }

        // print_r($response);exit;
        return $response;
    }

    function get_all_comapanies($attr)
    {
        // echo 'dd';
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT id, name FROM company where status=1 and user_id=" . $this->arrUser['id'];

        $RS = $this->objsetup->CSI($Sql);
        // echo "<pre>";print_r($Sql);exit;


        if ($RS->RecordCount() > 0) {
            //$Row = $RS->FetchRow();
            while ($Row = $RS->FetchRow()) {
                // echo "<pre>";print_r($Row);
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_hr_value_employess($attr)
    {
        return; // removing table employee_values from db as it is not being used
    }

    function get_hr_value_by_defined($attr)
    {
        return; // removing table employee_values from db as it is not being used        
    }

    function get_hr_value_by_undefined($attr)
    {
        return; // removing table employee_values from db as it is not being used        
    }

    function get_cols_values($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT  employee_columns.employee_type,employee_columns.sort_id,employee_columns.tab_id,employee_columns.name,
                        employee_columns.id ,employee_columns.display_label ,employee_columns.display_type ,employee_columns.display_require
                        FROM employee_columns
                        LEFT JOIN company on company.id=employee_columns.company_id
                        where   employee_columns.status=1  and

                        employee_columns.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . "
                        and tab_id=$attr[tab_id] AND employee_columns.status=1

                        ORDER BY employee_columns.sort_id DESC"; //NOT IN(1,2,3,4,5) // AND employee_columns.employee_type =0
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['tab_id'] = $Row['tab_id'];
                $result['employee_type'] = $Row['employee_type'];

                $result['is_label'] = $Row['display_label'];
                $result['is_type'] = $Row['display_type'];
                $result['is_required'] = $Row['display_require'];
                $result['value'] = 'aa';
                /* if ($total) {
                  $result['value'] = $Row['value'];
                  } */
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function delete_hr_values($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        /* $Sql = "DELETE FROM employee_columns
          WHERE id = ".$arr_attr['id']." Limit 1";
         */

        $Sql = "UPDATE employees SET status=".DELETED_STATUS." , user_email = CONCAT('*deleted*',user_email)  WHERE id = ".$arr_attr['id']."  AND SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 3,0) = 'success'";
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "HR_generalTab", sr_DeletePermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $Sql1 = "SELECT SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 3,0) AS error_msg";
            $RS1 = $this->objsetup->CSI($Sql1);
            $response['error'] = $RS1->fields['error_msg'];
        }

        return $response;
    }

    function get_tab_val_id($attr)
    {
        return; // removing table employee_values from db as it is not being used
    }

    function get_companies($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT c.id, c.name FROM company  c
		 where   c.id=" . $this->arrUser['company_id'] . " 
		 Limit 1";  //or c.parent_id=".$this->arrUser['company_id']." 

        /* $Sql = "SELECT id, name FROM company  c 
          where  status =1 and c.id=".$this->arrUser['company_id']." or c.parent_id=".$this->arrUser['company_id']."
          order by id DESC " ;

         */
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

        /* if($RS->RecordCount()>0){
          //$Row = $RS->FetchRow();
          while($Row = $RS->FetchRow()){
          // echo "<pre>";print_r($Row);
          $result['id'] = $Row['id'];
          $result['name'] = $Row['name'];
          $response['response'][] = $result;
          }

          }else{
          $response['response'] = array();
          } */
        //print_r($response );exit; 
        return $response;
    }

    function get_vat_list($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        /* $Sql = "SELECT c.id, c.vat_name,c.vat_value FROM  vat  c
          left JOIN company on company.id=c.company_id
          where c.status =1 and
          c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . "
          order by c.id DESC "; */

        $Sql = "SELECT c.id, c.ref_id, c.vat_name,c.vat_value
                FROM  vat  c 
                where c.status =1  AND company_id='" . $this->arrUser['company_id'] . "'
                order by c.id ASC ";
                /* AND 
                      c.company_id=" . $this->arrUser['company_id'] . "   */
        //c.user_id=".$this->arrUser['id']."
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['ref_id'] = $Row['ref_id'];
                $result['name'] = $Row['vat_name'];
                $result['vat_value'] = $Row['vat_value'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_vat_group_by_posting_group($attr)
    {
        $posting_group_id = ($attr['posting_group_id'] != '') ? " $attr[posting_group_id] " : "0";
        $Sql = "SELECT vat.id,
                        c.vat as vat_value, 
                        vat.vat_name,
                        vat.ref_id,
                        postgrp.id as post_grp
                FROM vat_posting_grp_setup as c 
                left join ref_posting_group as postgrp on postgrp.id=c.postingGrpID
                left join vat on vat.id=c.vatRateID
                where postgrp.id = $posting_group_id AND postgrp.company_id='" . $this->arrUser['company_id'] . "' AND 
                      c.company_id='" . $this->arrUser['company_id'] . "'";
                /* AND 
                      c.company_id=" . $this->arrUser['company_id'] . "   */
        //c.user_id=".$this->arrUser['id']."

        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['ref_id'] = $Row['ref_id'];
                $result['name'] = $Row['vat_name'];
                $result['vat_value'] = $Row['vat_value'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_vat_group_by_posting_groupByCompanyID($attr,$companyID)
    {
        $posting_group_id = ($attr['posting_group_id'] != '') ? " $attr[posting_group_id] " : "0";
        $Sql = "SELECT vat.id,
                        c.vat as vat_value, 
                        vat.vat_name,
                        vat.ref_id,
                        postgrp.id as post_grp
                FROM vat_posting_grp_setup as c 
                left join ref_posting_group as postgrp on postgrp.id=c.postingGrpID
                left join vat on vat.id=c.vatRateID
                where postgrp.id = $posting_group_id AND postgrp.company_id='" . $companyID . "' AND 
                      c.company_id='" . $companyID . "'";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['ref_id'] = $Row['ref_id'];
                $result['name'] = $Row['vat_name'];
                $result['vat_value'] = $Row['vat_value'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_hr_listing($attr)
    {
        //print_r($attr);exit;
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;

        $where_clause = $this->objGeneral->flexiWhereRetriever("emp.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("emp.",$attr,$fieldsMeta);

        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("HR",$this->arrUser);
        }
            
            //echo $order_clause;exit;
        $response = array();
        $Sql = "SELECT   * from sr_employee_sel emp where emp.company_id=" . $this->arrUser['company_id'] . "
		" . $where_clause . " 
        ";  
        
        /* $subQueryForBuckets = " SELECT  emp.id
                                    FROM employees emp
                                    WHERE emp.company_id=" . $this->arrUser['company_id'] . "";

        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 1);
        $Sql .= " AND (emp.id IN ($subQueryForBuckets)) "; */
        //echo $Sql ;exit;
        // (or  company.parent_id=" . $this->arrUser['company_id'] . ")

        if ($arg == 1) $direct_limit = cache_pagination_limit;
        else $direct_limit = pagination_limit;

        //defualt Variable
        $total_limit = $direct_limit;

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
           $total_limit = $attr['pagination_limits'];
        $column = 'emp.' . 'id';
        

        if ($order_clause == "")
        $order_type = "Order BY " . $column . " DESC";
        else $order_type = $order_clause;


        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'emp', $order_type);
        // $RS = $this->objsetup->CSI($response['q']);
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('HR');$response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;

        $RS = $this->objsetup->CSI($response['q'], "HR", sr_ViewPermission);
        
        
        //echo $response['q'];exit;
        //$RS = $this->objsetup->CSI($Sql);


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

    function get_employee_log_by_id($attr)
    {
        return; // removing table employees_log from db as it is not being used
    }

    function update_hr_general($arr_attr, $input)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $company_id = $this->arrUser['company_id'];
        $employee_id = 0;
        // print_r($arr_attr);exit;

        $account_setting = (isset($arr_attr->account_setting) && $arr_attr->account_setting!='')?$arr_attr->account_setting:0;

        $where2 = '';
        
        if ($arr_attr->allow_logins > 0 && !$account_setting) {

            $max_allow_user_SQL = "select num_user_login from company where id='" . $this->arrUser['company_id'] . "' limit 1";
            $rs_max_allow_user_SQL = $this->objsetup->CSI($max_allow_user_SQL);
            //echo $rs_max_allow_user_SQL;exit;
            $max_num_user_login = $rs_max_allow_user_SQL->fields['num_user_login'];

            if($arr_attr->id)
                $where2 ="AND id <> '". $arr_attr->id ."'";


            $sel_allow_user_SQL = "select count(id) as total from employees where allow_login=1 ".$where2." and status <> -1 and user_type <> 1 and company_id='" . $this->arrUser['company_id'] . "'";
            //echo $sel_allow_user_SQL;exit;
            $rs_sel_allow_user_SQL = $this->objsetup->CSI($sel_allow_user_SQL);

            $sel_num_user_login = $rs_sel_allow_user_SQL->fields['total'];
            // echo $sel_num_user_login.PHP_EOL;
            // echo "Max: ".$max_num_user_login;exit;
            //echo $arr_attr->user_type;exit;
            //echo $sel_num_user_login;exit;
            
            if ($sel_num_user_login >= $max_num_user_login) {
                //echo "$sel_num_user_login - $max_num_user_login";
                $arr_attr->allow_logins = 0;
                //$response['ack'] = 0;
                $allow_login_exceeding = 1;
                //$response['error'] = 'Max Number of Users for login limit Exceeds';
                //return $response;
            }
        }

        //print_r($arr_attr);exit;
        if ($arr_attr->user_ids == 1){
            // count administrators..
            // user_type='1' is 1 for super admin (Asked from amer)
            $count_admin_user_SQL = "select count(id) as total from employees where user_type='1' and company_id='" . $this->arrUser['company_id'] . "'";
            //echo $count_admin_user_SQL;exit;
            $rs_count_admin_user_SQL = $this->objsetup->CSI($count_admin_user_SQL);
            $admin_users_count = $rs_count_admin_user_SQL->fields['total'];

            if ($admin_users_count > 2) {
                $response['ack'] = 0;
                $response['error'] = 'Max Number of Administrators limit Exceeds';
                return $response;
            }
        }

        $tab_change = $lastExpenseID = "";


        $counter_copy = 0;
        foreach ($input as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id")
                $employee_id = $val;
        }
        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;
        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $new = 'Add';
        $new_msg = 'Inserted';


        if ($employee_id > 0)
            $where_id = " AND tst.id <> '$employee_id' ";
        /*or (tst.first_name='" . $arr_attr->first_name . "'
		 and tst.middle_name='" . $arr_attr->middle_name . "' 	 and tst.last_name='" . $arr_attr->last_name . "' )*/


        $data_pass = " tst.user_email='" . $arr_attr->user_email . "' $where_id  ";
        $emailCheckSql = "SELECT COUNT(id) as total FROM employees as tst WHERE $data_pass;";
        //echo $emailCheckSql;exit;
        $total = $this->objsetup->CSI($emailCheckSql)->fields['total'];
        //print_r($total);exit;
        //$total = $this->objGeneral->count_duplicate_in_sql('employees', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;

            /* if (!($employee_id > 0))
            {
                $updateSeqSql = "UPDATE  ref_module_category_value 
                                            SET 
                                                last_sequence_num = last_sequence_num-1
                             WHERE module_code_id =9 AND 
                                   company_id='" . $this->arrUser['company_id'] . "' AND 
                                   last_sequence_num>0";

                //echo $updateSeqSql;exit;
                $updateSeqRS = $this->objsetup->CSI($updateSeqSql, 'HR', sr_AddPermission);
            } */

            $response['error'] = 'Email Already Exists!';
            return $response;
        }

        $data_pass = " tst.user_code='" . $arr_attr->user_code . "' $where_id  ";
        $total = $this->objGeneral->count_duplicate_in_sql('employees', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {

            /* if (!($employee_id > 0))
            {
                $updateSeqSql = "UPDATE  ref_module_category_value 
                                            SET 
                                                last_sequence_num = last_sequence_num-1
                             WHERE module_code_id =9 AND 
                                   company_id='" . $this->arrUser['company_id'] . "' AND 
                                   last_sequence_num>0";

                //echo $updateSeqSql;exit;
                $updateSeqRS = $this->objsetup->CSI($updateSeqSql, 'HR', sr_AddPermission);
            } */

            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
		
		$password_expiry_reset = (strlen($arr_attr->user_password) > 0 && $arr_attr->user_password != $arr_attr->user_password_prev) ?  'password_expiry_date = UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 90 DAY)),' : '';
        // echo $password_expiry_reset;exit;

        $workingHours = (isset($arr_attr->working_hours) && $arr_attr->working_hours!='')?$arr_attr->working_hours:0;

        $contract_end_date = (isset($arr_attr->contract_end_date) && $arr_attr->contract_end_date!='')?$arr_attr->contract_end_date:0;

        $user_type = (isset($arr_attr->user_ids) && $arr_attr->user_ids!='')?$arr_attr->user_ids:0;

        $employee_types = (isset($arr_attr->employee_types) && $arr_attr->employee_types!='')?$arr_attr->employee_types:0;

        $cause_of_inactivity = (isset($arr_attr->cause_of_inactivity) && $arr_attr->cause_of_inactivity!='')?$arr_attr->cause_of_inactivity:0;

        $job_status_id = (isset($arr_attr->job_status_id) && $arr_attr->job_status_id!='')?$arr_attr->job_status_id:0;
        $start_date = (isset($arr_attr->start_date) && $arr_attr->start_date!='')?$arr_attr->start_date:0;
        $leave_date = (isset($arr_attr->leave_date) && $arr_attr->leave_date!='')?$arr_attr->leave_date:0;
        $status_date = (isset($arr_attr->status_date) && $arr_attr->status_date!='')?$arr_attr->status_date:0;
        $case_date = (isset($arr_attr->case_date) && $arr_attr->case_date!='')?$arr_attr->case_date:0;
        $status_inactive_date = (isset($arr_attr->status_inactive_date) && $arr_attr->status_inactive_date!='')?$arr_attr->status_inactive_date:0;
        $line_manager_name_id = (isset($arr_attr->line_manager_name_id) && $arr_attr->line_manager_name_id!='')?$arr_attr->line_manager_name_id:0;

        $ethical_origin_id = $arr_attr->ethical_origin->id;
        $otherReligion = (isset($arr_attr->religions) && $arr_attr->religions!='')?$arr_attr->religions:0;
        $genderId = (isset($arr_attr->gender_id) && $arr_attr->gender_id!='')?$arr_attr->gender_id:0;
        $children = (isset($arr_attr->children) && $arr_attr->children!='')?$arr_attr->children:0;
        $marStatusId = (isset($arr_attr->mar_status_id) && $arr_attr->mar_status_id!='')?$arr_attr->mar_status_id:0;  
        $bonus = (isset($arr_attr->bonus) && $arr_attr->bonus!='')?$arr_attr->bonus:0;  
        $commission = (isset($arr_attr->commission) && $arr_attr->commission!='')?$arr_attr->commission:0;  
        $post_code_country = (isset($arr_attr->post_code_countrys) && $arr_attr->post_code_countrys!='')?$arr_attr->post_code_countrys:225;  
		
            
        if ($employee_id == 0) {
            $password = $arr_attr->user_password;
            $arr_attr->user_password = $this->objGeneral->encrypt_password($password);
            $arr_attr->user_password_1 = $this->objGeneral->encrypt_password_1($password);
            $counter_copy++;
            //print_r($arr_attr);exit;
            // removed following line from below query by ahmad
            // user_no='" . $arr_attr->user_no . "',
            //$lineManagerNameId = (isset($arr_attr->line_manager_name_id) && $arr_attr->line_manager_name_id!='')?$arr_attr->line_manager_name_id:0;
            

            $password_attempts = "";
            
            $Sql = "INSERT INTO employees
                                SET
                                    user_code=(SELECT SR_GetNextSeq('employees', '" . $this->arrUser['company_id'] . "', 0, 0)),
                                    emp_picture='" . $arr_attr->emp_picture . "',
                                    user_email='" . $arr_attr->user_email . "',
                                    user_password='" . $arr_attr->user_password . "',
                                    user_password_1='" . $arr_attr->user_password_1 . "',
                                    email_password='" . $arr_attr->email_password . "',
                                    user_company='" . $this->arrUser['company_id'] . "',
                                    user_type='" . $user_type . "',
                                    allow_login='" . $this->objGeneral->emptyToZero($arr_attr->allow_logins) . "',
                                    job_title='" . $arr_attr->job_title . "',
                                    first_name='" . $arr_attr->first_name . "',
                                    last_name='" . $arr_attr->last_name . "',
                                    middle_name='" . $arr_attr->middle_name . "',
                                    known_as='" . $arr_attr->known_as . "' ,
                                    department='" . $this->objGeneral->emptyToZero($arr_attr->department) . "',
                                    contract_end_date = '" . $contract_end_date . "',
                                    area='" . $arr_attr->area . "',
                                    roles='" . $arr_attr->roles . "',
                                    employee_type='" . $employee_types . "',
                                    cause_of_inactivity='" . $cause_of_inactivity . "',
                                    working_hours='" . $workingHours . "',
                                    job_status_id='" . $job_status_id . "',
                                    reason_of_leaving='" . $arr_attr->reason_of_leavings . "',
                                    other_leave='" . $arr_attr->other_leave . "',
                                    other_case='" . $arr_attr->other_case . "',
                                    status='" . $arr_attr->statuss . "' ,
                                    start_date= '" . $this->objGeneral->convert_date($start_date) . "',
                                    leave_date='" . $this->objGeneral->convert_date($leave_date) . "',
                                    status_date='" . $this->objGeneral->convert_date($status_date) . "',
                                    case_date='" . $this->objGeneral->convert_date($case_date ) . "',
                                    line_manager_name='" . $arr_attr->line_manager_name . "',
                                    line_manager_name_id='" . $line_manager_name_id . "',
                                    status_inactive_date=  '" . $this->objGeneral->convert_date($status_inactive_date) . "',
                                    emp_gender_id ='" . $genderId . "',
                                    mar_status_id ='" . $marStatusId . "',
                                    children ='" . $children . "',
                                    ethical_origin='" . $ethical_origin_id . "',
                                    other_religion='" . $otherReligion . "',
                                    bonus='" . $bonus . "',
                                    commission='" . $commission . "', 
                                    post_code_country='" . $post_code_country . "', 
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    user_id='" . $this->arrUser['id'] . "',
                                    date_added='" . current_date . "',
                                    password_expiry_date = UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 90 DAY)),
                                    password_unsuccessful_attempts = 0
                                    ";

            // status_date='" . strtotime($arr_attr->status_date) . "',
            //echo $Sql;exit;
            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql, "HR", sr_AddPermission);
            $employee_id = $this->Conn->Insert_ID();
            $new = 'insert';



           /*  $widgetQueries = $this->objdashboard->getWidgetContents();
            // print_r($widgetQueries);exit;

            $widgetSql = "SELECT * FROM widgets;";

                $widgetRS = $this->objsetup->CSI($widgetSql);
                $newWidgetQueries = array(1);
                unset($newWidgetQueries[0]);
                if ($widgetRS->RecordCount() > 0) {
                    while ($Row = $widgetRS->FetchRow()) {
                        foreach($Row as $key => $value) {
                            if (is_numeric($key)) unset($Row[$key]);
                        }
                    $SQL = "MONTH(FROM_UNIXTIME(".$Row['field'].")) = MONTH(CURDATE())";
                    $sprintf = sprintf($widgetQueries[$Row['id']],$SQL);
                    // echo $sprintf;exit;
                    // print_r($Row);exit;
                    array_push($newWidgetQueries,$sprintf);
                        $res[] = $Row;
                    }
                }
                // print_r($res);exit;
                foreach ($res as $key => $value){
                    // $str .= "(".$this->arrUser['company_id'].",".$value['id'].",".$employee_id.",0,".$key.",'".$newWidgetQueries[$key+1]."'),";
                    $strArray[] = sprintf("(%d,%d,%d,%d,%d,'%s','%s','%s','%d')",$this->arrUser['company_id'],$value['id'],$employee_id,0,$key,$newWidgetQueries[$key+1],date("Y"),date("m"),2);
                }
                // $str = substr($str, 0, -1);
                $str = implode(",",$strArray);
                // echo $str;exit;

                $widgetUsersSql = "INSERT INTO widgetuser (company_id,widget_id,user_id,active,pos,query,years,months,current) VALUES ".$str;
                // echo $widgetUsersSql;exit;
                $RSwidgetUsersSql = $this->objsetup->CSI($widgetUsersSql); */

        } else {

            $new = 'Edit';
            $new_msg = 'Updated';
            $counter_copy++;

            if ($arr_attr->case_of_inactivitys == ''){
                $arr_attr->case_of_inactivitys = 0;
            }

            /*

            if ($arr_attr->employee_types == ''){
                $arr_attr->employee_types = 0;
            } */

            //$lineManagerNameId = (isset($arr_attr->line_manager_name_id) && $arr_attr->line_manager_name_id!='')?$arr_attr->line_manager_name_id:0;
            // $workingHours = (isset($arr_attr->working_hours) && $arr_attr->working_hours!='')?$arr_attr->working_hours:0;
            if($arr_attr->allow_logins > 0)
            {
                $password_attempts = " password_unsuccessful_attempts = 0, ";
            }


            $updatePassword = "";

            if ($arr_attr->user_password != "Y0u sh@uldn\'t be doing this.."){
                // echo $arr_attr->user_password;exit;
                $password = $arr_attr->user_password;
                $arr_attr->user_password = $this->objGeneral->encrypt_password($password);
                $arr_attr->user_password_1 = $this->objGeneral->encrypt_password_1($password);
                $updatePassword = "user_password='" . $arr_attr->user_password . "', user_password_1 ='".$arr_attr->user_password_1."', ";
            }


            $Sql = "UPDATE employees
                           SET
                                emp_picture='" . $arr_attr->emp_picture . "',
                                user_email='" . $arr_attr->user_email . "',
                                last_name='" . $arr_attr->last_name . "',
                                $updatePassword
                                email_password='" . $arr_attr->email_password . "',
                                user_type='" . $user_type . "',
                                allow_login='" . $this->objGeneral->emptyToZero($arr_attr->allow_logins) . "',$password_attempts
                                job_title='" . $arr_attr->job_title . "' ,
                                first_name='" . $arr_attr->first_name . "' ,
                                middle_name='" . $arr_attr->middle_name . "',
                                known_as='" . $arr_attr->known_as . "' ,
                                department='" . $this->objGeneral->emptyToZero($arr_attr->department) . "' ,
                                contract_end_date = '" . $contract_end_date . "',
                                area='" . $arr_attr->area . "',
                                roles='" . $arr_attr->roles . "',
                                employee_type='" . $employee_types . "',
                                cause_of_inactivity='" . $arr_attr->cause_of_inactivity . "',
                                working_hours='" . $workingHours . "',
                                reason_of_leaving='" . $arr_attr->reason_of_leavings . "',
                                job_status_id='" . $job_status_id . "',
                                other_leave='" . $arr_attr->other_leave . "',
                                other_case='" . $arr_attr->other_case . "',
                                status= '" . $arr_attr->statuss . "' ,
                                start_date='" . $this->objGeneral->convert_date($arr_attr->start_date) . "',
                                leave_date='" . $this->objGeneral->convert_date($arr_attr->leave_date) . "',
                                status_date='" . $this->objGeneral->convert_date($arr_attr->status_date) . "',
                                case_date='" . $this->objGeneral->convert_date($arr_attr->case_date) . "',
                                line_manager_name='" . $arr_attr->line_manager_name . "',
                                line_manager_name_id='" . $line_manager_name_id . "',
                                $password_expiry_reset
                                status_inactive_date='" . $this->objGeneral->convert_date($arr_attr->status_inactive_date) . "'
                                
                                WHERE id = " . $employee_id . "
                                Limit 1";
            
            //  echo $Sql;exit;

            // $RSProducts = $this->objsetup->CSI($Sql);
            if ($account_setting){
                $RSProducts = $this->objsetup->CSI($Sql);
            }
            else{
                $RSProducts = $this->objsetup->CSI($Sql, "HR_generalTab", sr_EditPermission);
            }
            if(is_array($RSProducts) && $RSProducts['Error'] == 1){
                return $RSProducts;
            }
            else if (is_array($RSProducts) && $RSProducts['Access'] == 0){
                return $RSProducts;
            }

            if ($arr_attr->statuss != 1 && $arr_attr->status_inactive_date != "")
                $end_date2 = $arr_attr->status_inactive_date;
            else
                $end_date2 = current_date;
        }

        //echo $Sql; exit;
        // if($counter_copy > 0)$this->copy_employee_log($arr_attr,$employee_id);
        

        /* Below Code will add departments for current employee inside hr_selected_departments table. */
        $Sql = "DELETE FROM hr_selected_departments
        WHERE hr_id='$employee_id' AND company_id=" . $this->arrUser['company_id'] . ";\n";
        $R = $this->objsetup->CSI($Sql);

        $deptArr = explode(",",$arr_attr->department);
        if (sizeof($deptArr) && !empty($deptArr[0])){
            for ($i = 0; $i<sizeof($deptArr); $i++){
                $Sql = "INSERT INTO hr_selected_departments
                        set
                            hr_id='$employee_id',
                            company_id='" . $this->arrUser['company_id'] . "',
                            department_id='$deptArr[$i]'";
                            $R = $this->objsetup->CSI($Sql);
                            //echo $Sql;
            }
        }
        /* Below Code will add roles for current employee inside employee_roles table. */
        $Sql = "DELETE FROM employee_roles
        WHERE employee_id='$employee_id' AND company_id=" . $this->arrUser['company_id'] . ";\n";
        //echo $Sql;
        $R = $this->objsetup->CSI($Sql);
        $roleArr = explode(",",$arr_attr->roles);
        for ($i = 0; $i<sizeof($roleArr); $i++){
            if ($roleArr[$i] == '')
            continue;
            $Sql = "INSERT INTO employee_roles
                    set
                        employee_id='$employee_id',
                        company_id='" . $this->arrUser['company_id'] . "',
                        user_id ='". $this->arrUser['id'] ."',
                        
                        role_id='$roleArr[$i]';\n";
                        //echo $Sql;
                        //date_added ='". current_date ."',
                        //status ='1',
                        $R = $this->objsetup->CSI($Sql);
        }
        //exit;

        
        $message = "Record  $new_msg Successfully. ";

        if ($employee_id > 0) {
            $response['employee_id'] = $employee_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $message;
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
            $response['last_expense_id'] = $lastExpenseID;
            if ($allow_login_exceeding){
                $response['allow_login_exceeding'] = 1;
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = $message;
        }

        return $response;
    }

    function updateAccountSettings($arr_attr, $input)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $employee_id = 0;
        //echo '<pre>'; print_r($arr_attr); exit;

        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;

        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;
		
		$password_expiry_reset = (strlen($arr_attr->user_password) > 0 && $arr_attr->user_password != $arr_attr->user_password_prev)?'password_expiry_date = UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 90 DAY)),' : '';

        $updatePassword = "";
        $resetPassword = 0;

        if ($arr_attr->user_password != "Y0u sh@uldn\'t be doing this.."){
            $password = $arr_attr->user_password;
            $arr_attr->user_password = $this->objGeneral->encrypt_password($password);
            $arr_attr->user_password_1 = $this->objGeneral->encrypt_password_1($password);
            $updatePassword = "user_password='" . $arr_attr->user_password . "', user_password_1 ='".$arr_attr->user_password_1."', ";
            $resetPassword = 1;
        }

        $Sql = "UPDATE employees
                        SET
                            $updatePassword
                            $password_expiry_reset
                            known_as='" . $arr_attr->known_as . "'                                
                WHERE id = " . $employee_id . "
                Limit 1";
        
        //echo $Sql;exit;
        $RSProducts = $this->objsetup->CSI($Sql);
        
        if(is_array($RSProducts) && $RSProducts['Error'] == 1){
            return $RSProducts;
        }
        else if (is_array($RSProducts) && $RSProducts['Access'] == 0){
            return $RSProducts;
        }

        if ($employee_id > 0) {
            $response['employee_id'] = $employee_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = "Record Updated Successfully. ";
            $response['info'] = 'Edit';
            $response['resetPassword'] = $resetPassword;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = "Record Updated Successfully. ";
        }

        return $response;
    }

    function copy_employee_log($arr_attr, $employee_id)
    {
    }

    function update_hr_contact($arr_attr, $input)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $tab_change = $lastExpenseID = "";

        $counter_copy = 0;

        foreach ($input as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id")
                $employee_id = $val;
        }

        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;

        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $new = 'Add';
        $new_msg = 'Inserted';

        $post_code_country = (isset($arr_attr->post_code_countrys) && $arr_attr->post_code_countrys!='')?$arr_attr->post_code_countrys:225; 

        $Sql = "UPDATE employees
                            SET
                              address_1='" . $arr_attr->address_1 . "',
                              address_2='" . $arr_attr->address_2 . "',
                              city='" . $arr_attr->city . "',
                              post_code='" . $arr_attr->post_code . "',
                              post_code_country='" . $post_code_country . "',
                              internal_extention='" . $arr_attr->internal_extention . "',
                              work_phone='" . $arr_attr->work_phone . "',
                              mobile_phone='" . $arr_attr->mobile_phone . "',
                              home_phone='" . $arr_attr->home_phone . "',
                              personal_email='" . $arr_attr->personal_email . "',
                              work_email='" . $arr_attr->work_email . "',
                              skype_id='" . $arr_attr->skype_id . "',
                              linked_id='" . $arr_attr->linked_id . "',
                              country='" . $arr_attr->country . "',

                              hr_account_name='" . $arr_attr->hr_account_name . "',
                              hr_sort_code='" . $arr_attr->hr_sort_code . "',
                              hr_account_no='" . $arr_attr->hr_account_no . "',
                              hr_bill_bank_name='" . $arr_attr->hr_bill_bank_name . "',
                              hr_swift_no='" . $arr_attr->hr_swift_no . "',
                              hr_iban='" . $arr_attr->hr_iban . "'

                              WHERE id = " . $employee_id . "
                              Limit 1";
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "HR_contact_Tab", sr_EditPermission);

        if ($this->Conn->Affected_Rows() == 0){
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = $message;
        }
        else{
            $message = "Record  $new_msg Successfully. ";

            if ($employee_id > 0) {
                $response['employee_id'] = $employee_id;
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['msg'] = $message;
                $response['info'] = $new;
                $response['tab_change'] = $tab_change;
                $response['last_expense_id'] = $lastExpenseID;
            }
        }

        return $response;
    }

    function update_hr_personal($arr_attr, $input)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $tab_change = $lastExpenseID = "";
        $counter_copy = 0;

        foreach ($input as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id")
                $employee_id = $val;
        }

        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;

        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $new = 'Add';
        $new_msg = 'Inserted';
        /* print_r($arr_attr->ethical_origin->id);
          exit; */
        $ethical_origin_id = $arr_attr->ethical_origin->id;
        $otherReligion = (isset($arr_attr->religions) && $arr_attr->religions!='')?$arr_attr->religions:0;
        $genderId = (isset($arr_attr->gender_id) && $arr_attr->gender_id!='')?$arr_attr->gender_id:0;
        $children = (isset($arr_attr->children) && $arr_attr->children!='')?$arr_attr->children:0;
        $marStatusId = (isset($arr_attr->mar_status_id) && $arr_attr->mar_status_id!='')?$arr_attr->mar_status_id:0;

        $Sql = "UPDATE employees
                        SET
                        date_of_birth=  '" . $this->objGeneral->convert_date($arr_attr->date_of_birth) . "',
                        next_of_kin='" . $arr_attr->next_of_kin . "',
                        next_of_kin_phone='" . $arr_attr->next_of_kin_phone . "',
                        next_of_kin_email='" . $arr_attr->next_of_kin_email . "',
                        emp_gender_id ='" . $genderId . "',
                        emp_passport ='" . $arr_attr->emp_passport . "',
                        emp_driving_license ='" . $arr_attr->emp_driving_license . "',
                        driving_license_pts ='" . $arr_attr->driving_license_pts . "',
                        mar_status_id ='" . $marStatusId . "',
                        children ='" . $children . "',
                        relation_kin='" . $arr_attr->relation_kin . "',
                        insurance_number='" . $arr_attr->insurance_number . "',
                        next_of_kin_mobile='" . $arr_attr->next_of_kin_mobile . "',
                        ethical_origin='" . $ethical_origin_id . "',
                        religion='" . $arr_attr->religions . "',
                        other_religion='" . $otherReligion . "',
                        other_ethinic='" . $arr_attr->other_ethinic . "',
                        hr_account_name='" . $arr_attr->hr_account_name . "',
                        hr_sort_code='" . $arr_attr->hr_sort_code . "',
                        hr_account_no='" . $arr_attr->hr_account_no . "',
                        hr_bill_bank_name='" . $arr_attr->hr_bill_bank_name . "',
                        hr_bank_address='" . $arr_attr->hr_bank_address . "',
                        hr_swift_no='" . $arr_attr->hr_swift_no . "',
                        hr_iban='" . $arr_attr->hr_iban . "'

                        WHERE id = " . $employee_id . "

                         Limit 1";
        //echo $Sql; exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "HR_personal_Tab", sr_EditPermission);

        //   echo $Sql;exit;

        if ($this->Conn->Affected_Rows() == 0){
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = $message;
        }
        else{
            $message = "Record  $new_msg Successfully. ";

            if ($employee_id > 0) {
                $response['employee_id'] = $employee_id;
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['msg'] = $message;
                $response['info'] = $new;
                $response['tab_change'] = $tab_change;
                $response['last_expense_id'] = $lastExpenseID;
            }
        }

        return $response;
    }

    function update_hr_salary($arr_attr, $input)
    {
        $tab_change = $lastExpenseID = "";
        $counter_copy = 0;

        foreach ($input as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id")
                $employee_id = $val;
        }

        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;

        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $new = 'Add';
        $new_msg = 'Inserted';
        // echo $this->objGeneral->convert_date($arr_attr->commission_effective_date);exit;
        // echo '<pre>';print_r($arr_attr);exit;

        // removed following line from query by ahmad
        // 

        $bonus = (isset($arr_attr->bonus) && $arr_attr->bonus!='')?$arr_attr->bonus:0;
        $commission = (isset($arr_attr->commission) && $arr_attr->commission!='')?$arr_attr->commission:0;
        $salary_type = (isset($arr_attr->salary_type) && $arr_attr->salary_type!='')?$arr_attr->salary_type:0;
        $salary_currency_id = (isset($arr_attr->salary_currency_id) && $arr_attr->salary_currency_id!='')?$arr_attr->salary_currency_id:0;
        $ee_pention = (isset($arr_attr->ee_pention) && $arr_attr->ee_pention!='')?$arr_attr->ee_pention:0;
        $er_pention = (isset($arr_attr->er_pention) && $arr_attr->er_pention!='')?$arr_attr->er_pention:0;
        $entitle_holiday_optis = (isset($arr_attr->entitle_holiday_optis) && $arr_attr->entitle_holiday_optis!='')?$arr_attr->entitle_holiday_optis:0;

        $Sql = "UPDATE employees
                        SET
                          salary='" . $arr_attr->salary . "',
                          salary_currency_id='" . $salary_currency_id . "',
                          salary_type='" . $salary_type . "',
                          over_time_rate='" . $arr_attr->over_time_rate . "',
                          bonus='" . $bonus . "',
                          commission='" . $commission . "',
                          commission_effective_date='" . $this->objGeneral->convert_date($arr_attr->commission_effective_date) . "',
                          ee_pention='" . $ee_pention . "',
                          er_pention='" . $er_pention . "',
                          ee_start_date='" . $this->objGeneral->convert_date($arr_attr->ee_start_date) . "',
                          ee_change_date= '" . $this->objGeneral->convert_date($arr_attr->ee_change_date) . "',
                          ee_end_date=  '" . $this->objGeneral->convert_date($arr_attr->ee_end_date) . "',
                          er_start_date= '" . $this->objGeneral->convert_date($arr_attr->er_start_date) . "',
                          er_change_date= '" . $this->objGeneral->convert_date($arr_attr->er_change_date) . "',
                          er_end_date=	 '" . $this->objGeneral->convert_date($arr_attr->er_end_date) . "',
                          salary_date=  '" . $this->objGeneral->convert_date($arr_attr->salary_date) . "',
                          salary_date_review='" . $this->objGeneral->convert_date($arr_attr->salary_date_review) . "',
                          entitle_holiday_opti='" . $entitle_holiday_optis . "',
                          entitle_holiday='" . $arr_attr->entitle_holiday . "'

                          WHERE id = " . $employee_id . "
                          Limit 1";
        // echo $Sql; exit;
        $salHistorySQLSelect = "select * from salary_history where employee_id='" . $employee_id . "' order by id desc LIMIT 1";

        // $rs_salary = $this->objsetup->CSI($salHistorySQLSelect);
        $rs_salary = $this->objsetup->CSI($salHistorySQLSelect, "HR_salaryTab", sr_EditPermission);
        if(is_array($rs_salary) && $rs_salary['Error'] == 1){
            return $rs_salary;
        }
        else if (is_array($rs_salary) && $rs_salary['Access'] == 0){
            return $rs_salary;
        }
        $hSalary = $rs_salary->fields['salary'];
        //$hrsalary_currency_id = $rs_salary->fields['salary_currency_id'];
        $endDate = $rs_salary->fields['end_date'];
        $lastID = $rs_salary->fields['id'];

        if ($lastID > 0) {

            if ($hSalary != $arr_attr->salary) {// && $endDate == 0

                /* $salHistorySQLUpdate = "update salary_history
                  set
                  end_date='" . current_date . "'
                  where id ='" . $lastID . "'"; */

                $salHistorySQLUpdate = "update salary_history
                                                set
                                                changed_date='" . current_date . "'
                                                where id ='" . $lastID . "'";

                $RSProducts = $this->objsetup->CSI($salHistorySQLUpdate);
                //echo $empHistorySQLInsert." ".$lastID; exit;

                $empHistorySQLInsert = "insert into salary_history
                                              set
                                              employee_id='$employee_id',
                                              salary='" . $arr_attr->salary . "',
                                              salary_currency_id='" . $salary_currency_id . "',
                                              salary_type='" . $salary_type . "',
                                              changed_date='" . current_date . "',
                                              start_date='" . $this->objGeneral->convert_date($arr_attr->salary_date) . "',
                                              end_date='" . $this->objGeneral->convert_date($arr_attr->salary_date_review) . "',
                                              user_id='" . $this->arrUser['id'] . "',
                                              company_id='" . $this->arrUser['company_id'] . "'
                                              ";

                $RSProducts = $this->objsetup->CSI($empHistorySQLInsert);
            }

            // if()
        } else {
            $salHistorySQL = "insert into salary_history
                                          set
                                          employee_id='$employee_id',
                                          salary='" . $arr_attr->salary . "',
                                          salary_currency_id='" . $salary_currency_id . "',
                                          salary_type='" . $salary_type . "',
                                          changed_date='" . current_date . "',
                                          start_date='" . $this->objGeneral->convert_date($arr_attr->salary_date) . "',
                                          end_date='" . $this->objGeneral->convert_date($arr_attr->salary_date_review) . "',
                                          user_id='" . $this->arrUser['id'] . "',
                                          company_id='" . $this->arrUser['company_id'] . "'
                                          ";

            $RSProducts = $this->objsetup->CSI($salHistorySQL);
        }


        $RS = $this->objsetup->CSI($Sql);
        //   echo $Sql;exit;

        if ($this->Conn->Affected_Rows() == 0){
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = $message;
        }
        else{
            $message = "Record  $new_msg Successfully. ";

            if ($employee_id > 0) {
                $response['employee_id'] = $employee_id;
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['msg'] = $message;
                $response['info'] = $new;
                $response['tab_change'] = $tab_change;
                $response['last_expense_id'] = $lastExpenseID;

                if($commission>0){

                    $commissionHistorySql = "SELECT * FROM employees_commission_history 
                                             WHERE employees_id='" . $employee_id . "' AND 
                                                  company_id = '" . $this->arrUser['company_id'] . "'
                                             ORDER BY id desc 
                                             LIMIT 1";
            
                    // echo $commissionHistorySql;exit;
                    // $rsCommissionHistory = $this->objsetup->CSI($commissionHistorySql);
                    $rsCommissionHistory = $this->objsetup->CSI($commissionHistorySql, "HR_salaryTab", sr_EditPermission);
                    if(is_array($rsCommissionHistory) && $rsCommissionHistory['Error'] == 1){
                        return $rsCommissionHistory;
                    }
                    else if (is_array($rsCommissionHistory) && $rsCommissionHistory['Access'] == 0){
                        return $rsCommissionHistory;
                    }

                    $prevCommission = $rsCommissionHistory->fields['commission'];
                    $prevCommission_effective_date = $rsCommissionHistory->fields['commission_effective_date'];

                    if(($prevCommission != $commission) || ($prevCommission_effective_date != $this->objGeneral->convert_date($arr_attr->commission_effective_date))){
                        
                        $addCommissionHistorySQL = "INSERT INTO employees_commission_history
                                                                SET
                                                                    employees_id = '$employee_id',
                                                                    commission = '" . $commission . "',
                                                                    commission_effective_date = '" . $this->objGeneral->convert_date($arr_attr->commission_effective_date) . "',
                                                                    company_id = '" . $this->arrUser['company_id'] . "',
                                                                    AddedBy = '" . $this->arrUser['id'] . "',
                                                                    AddedOn = '" . current_date . "'";

                        // echo $addCommissionHistorySQL;exit;
                        $RSaddCommissionHistory = $this->objsetup->CSI($addCommissionHistorySQL);
                    }
                }
            }
        }

        return $response;
    }

    function update_hr_benefit($arr_attr, $input)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $this->objGeneral->mysql_clean($input);

        $counter_copy = 0;

        foreach ($input as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id")
                $employee_id = $val;
        }

        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;

        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $tabletStatusIds = (isset($arr_attr->tablet_status_ids) && $arr_attr->tablet_status_ids!='')?$arr_attr->tablet_status_ids:0;
            

        $new = 'Add';
        $new_msg = 'Inserted';

        $Sql = "UPDATE employees
                        SET
                            company_car='" . $arr_attr->company_cars . "',
                            company_car_make='" . $arr_attr->company_car_make . "',
                            car_model='" . $arr_attr->car_model . "',
                            car_enngine='" . $arr_attr->car_enngines . "',
                            car_fuel_type='" . $arr_attr->car_fuel_type . "',
                            car_marked_value='" . $arr_attr->car_marked_value . "',
                            car_vin='" . $arr_attr->car_vin . "',
                            car_emisions='" . $arr_attr->car_emisions . "',
                            car_fuel_card='" . $arr_attr->car_fuel_cards . "',
                            car_fuel_card_num='" . $arr_attr->car_fuel_card_num . "',
                            fuel_cost_deduction='" . $arr_attr->fuel_cost_deductions . "',
                            car_date_assign= '" . $this->objGeneral->convert_date($arr_attr->car_date_assign) . "',
                            car_date_return=   '" . $this->objGeneral->convert_date($arr_attr->car_date_return) . "',
                            other_benifits='" . $arr_attr->other_benifits . "',
                            company_laptop_model='" . $arr_attr->company_laptop_models . "',
                            company_laptop_serial='" . $arr_attr->company_laptop_serial . "',
                            laptop_make='" . $arr_attr->laptop_make . "',
                            laptop_model='" . $arr_attr->laptop_model . "',
                            laptop_return_date_assign=  '" . $this->objGeneral->convert_date($arr_attr->laptop_return_date_assign) . "',
                            laptop_date_assign=  '" . $this->objGeneral->convert_date($arr_attr->laptop_date_assign) . "',
                            company_mobile_model='" . $arr_attr->company_mobile_models . "',
                            company_mobile_serial='" . $arr_attr->company_mobile_serial . "',
                            mobile_make='" . $arr_attr->mobile_make . "',
                            mobile_model='" . $arr_attr->mobile_model . "',
                            mobile_date_assign='" . $this->objGeneral->convert_date($arr_attr->mobile_date_assign) . "',
                            mobile_return_date_assign=   '" . $this->objGeneral->convert_date($arr_attr->mobile_return_date_assign) . "',
                            tablet_status_id='" . $tabletStatusIds . "',
                            company_tablet_serial='" . $arr_attr->company_tablet_serial . "',
                            tablet_make='" . $arr_attr->tablet_make . "',
                            tablet_model='" . $arr_attr->tablet_model . "',
                            tablet_date_assign='" . $this->objGeneral->convert_date($arr_attr->tablet_date_assign) . "',
                            tablet_return_date_assign= '" . $this->objGeneral->convert_date($arr_attr->tablet_return_date_assign) . "',
                            piid='" . $arr_attr->piid . "'

                    WHERE id = " . $employee_id . "
                    Limit 1";

        //echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "HR_benefit_Tab", sr_EditPermission);
        

        if ($this->Conn->Affected_Rows() == 0){
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = $message;
        }
        else{

            /* for benefits history */
            $this->current_employees_benefit($arr_attr, $employee_id);

            $message = "Record  $new_msg Successfully. ";

            if ($employee_id > 0) {
                $response['employee_id'] = $employee_id;
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['msg'] = $message;
                $response['info'] = $new;
                $response['tab_change'] = $tab_change;
                $response['last_expense_id'] = $lastExpenseID;
            }
        }

        return $response;
    }

    function current_employees_benefit($arr_attr,$employee_id)
    {
        //echo '<pre>';print_r($arr_attr->car_enngine);exit;
        $this->objGeneral->mysql_clean($arr_attr);

            /* for benefits history */
            // for car
           // echo $arr_attr->company_car;exit;
            if($arr_attr->company_cars==1){

                $current_car = "SELECT is_current 
                                FROM employees_benefits_history 
                                WHERE benefit_type='1' AND 
                                      employee_id=" . $employee_id . " AND 
                                      company_id='" . $this->arrUser['company_id'] . "'  AND 
                                      is_current=1";

                $RS1 = $this->objsetup->CSI($current_car);

                if ($RS1->RecordCount() == 0) {

                    $car_query_ins = "INSERT INTO employees_benefits_history 
                                                        SET  
                                                            benefit_type='1' ,
                                                            employee_id=" . $employee_id . " ,
                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                            company_car='1' ,
                                                            car_make='" . $arr_attr->company_car_make . "' ,
                                                            car_model='" . $arr_attr->car_model . "' ,
                                                            car_vin='" . $arr_attr->car_vin . "' ,
                                                            car_emisions='" . $arr_attr->car_emisions . "' ,
                                                            car_market_value='" . $arr_attr->car_marked_value . "' ,
                                                            car_fuel_type='" . $arr_attr->car_fuel_type . "' ,
                                                            car_engine='" . $arr_attr->car_enngines . "' ,
                                                            car_date_assign= '" . $this->objGeneral->convert_date($arr_attr->car_date_assign) . "' ,
                                                            car_date_return=   '" . $this->objGeneral->convert_date($arr_attr->car_date_return) . "',
                                                            AddedBy = '" .  $this->arrUser['id']. "',
                                                            AddedOn = UNIX_TIMESTAMP(NOW()),
                                                            is_current = 1 ";
                    $this->objsetup->CSI($car_query_ins);

                }else{
                    $car_query_ins = "UPDATE employees_benefits_history 
                                                    SET  
                                                        car_make='" . $arr_attr->company_car_make . "' ,
                                                        car_model='" . $arr_attr->car_model . "' ,
                                                        car_vin='" . $arr_attr->car_vin . "' ,
                                                        car_emisions='" . $arr_attr->car_emisions . "' ,
                                                        car_market_value='" . $arr_attr->car_marked_value . "' ,
                                                        car_fuel_type='" . $arr_attr->car_fuel_type . "' ,
                                                        car_engine='" . $arr_attr->car_enngines . "' ,
                                                        car_date_assign= '" . $this->objGeneral->convert_date($arr_attr->car_date_assign) . "' ,
                                                        car_date_return=   '" . $this->objGeneral->convert_date($arr_attr->car_date_return) . "',
                                                        AddedBy = '" .  $this->arrUser['id']. "',
                                                        AddedOn = UNIX_TIMESTAMP(NOW())
                                        WHERE benefit_type='1' AND 
                                                employee_id=" . $employee_id . " AND 
                                                company_id='" . $this->arrUser['company_id'] . "' AND 
                                                is_current=1 ";

                    $this->objsetup->CSI($car_query_ins);
                }                
            }

            // for fuel card
            if($arr_attr->car_fuel_card==1){  

                $current_fuel = "SELECT is_current 
                                 FROM employees_benefits_history 
                                 WHERE benefit_type='2' AND 
                                       employee_id=" . $employee_id . " AND 
                                       company_id='" . $this->arrUser['company_id'] . "'  AND 
                                       is_current=1";

                $RS2 = $this->objsetup->CSI($current_fuel);

                if ($RS2->RecordCount() == 0) {

                    $fuelcard_query_ins = "INSERT INTO employees_benefits_history 
                                                                SET  
                                                                    benefit_type='2' ,
                                                                    employee_id=" . $employee_id . " ,
                                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                                    car_fuel_card='1' ,
                                                                    car_fuel_card_num='" . $arr_attr->car_fuel_card_num . "',
                                                                    fuel_cost_deduction='" . $arr_attr->fuel_cost_deduction . "',
                                                                    AddedBy = '" .  $this->arrUser['id']. "',
                                                                    AddedOn = UNIX_TIMESTAMP(NOW()),
                                                                    is_current = 1 ";
                    $this->objsetup->CSI($fuelcard_query_ins);

                }else{

                    $fuelcard_query_ins = "UPDATE employees_benefits_history 
                                                        SET                  
                                                            car_fuel_card_num='" . $arr_attr->car_fuel_card_num . "',
                                                            fuel_cost_deduction='" . $arr_attr->fuel_cost_deduction . "',
                                                            AddedBy = '" .  $this->arrUser['id']. "',
                                                            AddedOn = UNIX_TIMESTAMP(NOW())
                                            WHERE benefit_type='2' AND 
                                                  employee_id=" . $employee_id . " AND 
                                                  company_id='" . $this->arrUser['company_id'] . "' AND 
                                                  is_current=1 ";

                    $this->objsetup->CSI($fuelcard_query_ins);
                }               
            }

            // for laptop
            if($arr_attr->company_laptop_models==1){

                $current_laptop = " SELECT is_current 
                                    FROM employees_benefits_history 
                                    WHERE benefit_type='3' AND 
                                          employee_id=" . $employee_id . " AND 
                                          company_id='" . $this->arrUser['company_id'] . "'  AND 
                                          is_current=1";

                $RS3 = $this->objsetup->CSI($current_laptop);

               // echo $RS3->RecordCount();exit;
                if ($RS3->RecordCount() == 0) {  

                    $laptop_query_ins = "INSERT INTO employees_benefits_history 
                                                    SET  
                                                        benefit_type='3' ,
                                                        employee_id=" . $employee_id . " ,
                                                        company_id='" . $this->arrUser['company_id'] . "',
                                                        company_laptop='1' ,
                                                        laptop_serial='" . $arr_attr->company_laptop_serial . "',
                                                        laptop_make='" . $arr_attr->laptop_make . "',
                                                        laptop_model='" . $arr_attr->laptop_model . "',
                                                        laptop_return_date_assign=  '" . $this->objGeneral->convert_date($arr_attr->laptop_return_date_assign) . "',
                                                        laptop_date_assign=  '" . $this->objGeneral->convert_date($arr_attr->laptop_date_assign) . "',
                                                        AddedBy = '" .  $this->arrUser['id']. "',
                                                        AddedOn = UNIX_TIMESTAMP(NOW()),
                                                        is_current = 1 ";

                    $this->objsetup->CSI($laptop_query_ins); 

                }else{

                    $laptop_query_ins = "UPDATE employees_benefits_history 
                                                        SET                  
                                                            laptop_serial='" . $arr_attr->company_laptop_serial . "',
                                                            laptop_make='" . $arr_attr->laptop_make . "',
                                                            laptop_model='" . $arr_attr->laptop_model . "',
                                                            laptop_return_date_assign=  '" . $this->objGeneral->convert_date($arr_attr->laptop_return_date_assign) . "',
                                                            laptop_date_assign=  '" . $this->objGeneral->convert_date($arr_attr->laptop_date_assign) . "',
                                                            AddedBy = '" .  $this->arrUser['id']. "',
                                                            AddedOn = UNIX_TIMESTAMP(NOW())
                                                WHERE benefit_type='3' AND 
                                                      employee_id=" . $employee_id . " AND 
                                                      company_id='" . $this->arrUser['company_id'] . "' AND 
                                                      is_current=1";

                    $this->objsetup->CSI($laptop_query_ins);  
                }              
            }

            // for ipad
            if($arr_attr->tablet_status_ids==1){

                $current_tab = "SELECT is_current 
                                FROM employees_benefits_history 
                                WHERE benefit_type='4' AND 
                                      employee_id=" . $employee_id . " AND 
                                      company_id='" . $this->arrUser['company_id'] . "'  AND 
                                      is_current=1";

                $RS4 = $this->objsetup->CSI($current_tab);

                if ($RS4->RecordCount() == 0) { 

                    $laptop_query_ins = "INSERT INTO employees_benefits_history 
                                                        SET  
                                                            benefit_type='4' ,
                                                            employee_id=" . $employee_id . " ,
                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                            company_tablet='1' ,
                                                            tablet_serial='" . $arr_attr->company_tablet_serial . "',
                                                            tablet_make='" . $arr_attr->tablet_make . "',
                                                            tablet_model='" . $arr_attr->tablet_model . "',
                                                            tablet_date_assign='" . $this->objGeneral->convert_date($arr_attr->tablet_date_assign) . "',
                                                            tablet_return_date_assign= '" . $this->objGeneral->convert_date($arr_attr->tablet_return_date_assign) . "',
                                                            AddedBy = '" .  $this->arrUser['id']. "',
                                                            AddedOn = UNIX_TIMESTAMP(NOW()),
                                                            is_current = 1 ";

                    $this->objsetup->CSI($laptop_query_ins);
                }else{
                    $laptop_query_ins = "UPDATE employees_benefits_history 
                                                SET                 
                                                    tablet_serial='" . $arr_attr->company_tablet_serial . "',
                                                    tablet_make='" . $arr_attr->tablet_make . "',
                                                    tablet_model='" . $arr_attr->tablet_model . "',
                                                    tablet_date_assign='" . $this->objGeneral->convert_date($arr_attr->tablet_date_assign) . "',
                                                    tablet_return_date_assign= '" . $this->objGeneral->convert_date($arr_attr->tablet_return_date_assign) . "',
                                                    AddedBy = '" .  $this->arrUser['id']. "',
                                                    AddedOn = UNIX_TIMESTAMP(NOW())
                                            WHERE benefit_type='4' AND 
                                                  employee_id=" . $employee_id . " AND 
                                                  company_id='" . $this->arrUser['company_id'] . "' AND 
                                                  is_current=1";

                    $this->objsetup->CSI($laptop_query_ins);
                }               
            }

            // for mobile
            if($arr_attr->company_mobile_models==1){

                $current_mob = "SELECT is_current 
                                FROM employees_benefits_history 
                                WHERE benefit_type='5' AND 
                                      employee_id=" . $employee_id . " AND 
                                      company_id='" . $this->arrUser['company_id'] . "' AND 
                                      is_current=1";

                $RS5 = $this->objsetup->CSI($current_mob);

                if ($RS5->RecordCount() == 0) { 

                    $mobile_query_ins = "INSERT INTO employees_benefits_history 
                                                        SET  
                                                            benefit_type='5' ,
                                                            employee_id=" . $employee_id . " ,
                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                            company_mobile='1' ,
                                                            mobile_serial='" . $arr_attr->company_mobile_serial . "',
                                                            mobile_make='" . $arr_attr->mobile_make . "',
                                                            mobile_model='" . $arr_attr->mobile_model . "',
                                                            mobile_date_assign='" . $this->objGeneral->convert_date($arr_attr->mobile_date_assign) . "',
                                                            mobile_return_date_assign=   '" . $this->objGeneral->convert_date($arr_attr->mobile_return_date_assign) . "',
                                                            AddedBy = '" .  $this->arrUser['id']. "',
                                                            AddedOn = UNIX_TIMESTAMP(NOW()),
                                                            is_current = 1";
                    $this->objsetup->CSI($mobile_query_ins);
                    
                }else{

                    $mobile_query_ins = "UPDATE employees_benefits_history 
                                                    SET  
                                                        mobile_serial='" . $arr_attr->company_mobile_serial . "',
                                                        mobile_make='" . $arr_attr->mobile_make . "',
                                                        mobile_model='" . $arr_attr->mobile_model . "',
                                                        mobile_date_assign='" . $this->objGeneral->convert_date($arr_attr->mobile_date_assign) . "',
                                                        mobile_return_date_assign=   '" . $this->objGeneral->convert_date($arr_attr->mobile_return_date_assign) . "',
                                                        AddedBy = '" .  $this->arrUser['id']. "',
                                                        AddedOn = UNIX_TIMESTAMP(NOW())
                                            WHERE benefit_type='5' AND 
                                                  employee_id=" . $employee_id . " AND 
                                                  company_id='" . $this->arrUser['company_id'] . "' AND 
                                                  is_current=1";

                    $this->objsetup->CSI($mobile_query_ins);
                }
            }

        return true;
    }

    function add_employees_benefit_history($arr_attr)
    {
        //echo '<pre>';print_r($arr_attr);exit;
        $this->objGeneral->mysql_clean($arr_attr);

        $employee_id = $arr_attr->employee_id;
        /* for benefits history */
        // for car
        // echo $arr_attr->company_car;exit;

        if($arr_attr->company_car==1){

            $car_query_ins = "UPDATE employees_benefits_history 
                                                SET 
                                                    is_current=0 
                                WHERE employee_id=" . $employee_id . " AND 
                                    is_current=1 AND 
                                    company_car=1";

            $this->objsetup->CSI($car_query_ins);                
        }

        // for fuel card
        if($arr_attr->car_fuel_card==1){

            $fuelcard_query_ins = "UPDATE employees_benefits_history SET is_current=0 WHERE employee_id=" . $employee_id . " AND is_current=1 AND car_fuel_card=1";
            $this->objsetup->CSI($fuelcard_query_ins);               
        }

        // for laptop
        if($arr_attr->company_laptop==1){

            $laptop_query_ins = "UPDATE employees_benefits_history SET is_current=0 WHERE employee_id=" . $employee_id . " AND is_current=1 AND company_laptop=1";
            $this->objsetup->CSI($laptop_query_ins);               
        }

        // for ipad
        if($arr_attr->company_tablet==1){

            $tablet_query_ins = "UPDATE employees_benefits_history SET is_current=0 WHERE employee_id=" . $employee_id . " AND is_current=1 AND company_tablet=1";
            $this->objsetup->CSI($tablet_query_ins);               
        }

        // for mobile
        if($arr_attr->company_mobile==1){

            $mobile_query_ins = "UPDATE employees_benefits_history SET is_current=0 WHERE employee_id=" . $employee_id . " AND is_current=1 AND company_mobile=1";
            $this->objsetup->CSI($mobile_query_ins);
        }
        return true;
    }

    function get_role_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sqll = "SELECT id,name  FROM ref_module  where status=1";
        $RS = $this->objsetup->CSI($Sqll);

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response_module'][] = $result;
            }
        }

        $limit_clause = $where_clause = "";

        $response = array();
        $response2 = array();

        if (!empty($attr['keyword']))
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";

        if (!empty($attr['item_id']))
            $where_clause .= " AND psp.item_id = '$attr[item_id]' ";

        if (!empty($attr['supp_id']))
            $where_clause .= " AND psp.sale_id = '$attr[supp_id]' ";

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT $start_limit, $end_limit ";

        $Sql = "SELECT es.id, es.role_id,es.permisions, es.company_id ,r.role ,m.name as mname
                FROM employee_roles es
                left join roles r on r.id=es.role_id
                left join ref_module m on m.id=es.module_id
                WHERE es.employee_id='".$attr['employee_id']."' and es.status=1";

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'es');
        //echo $response['q'];exit;		
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['Role'] = $Row['role'];
                $result['Module'] = $Row['mname'];

                $per_data = explode(",", $Row['permisions']);

                foreach ($response['response_module'] as $key => $m_id) {
                    if (in_array($m_id['id'], $per_data)) {
                        $result['permisisons'][] = $m_id['name'];
                    }
                }

                $result['status'] = ($Row['status'] == "1") ? "Inactive" : "Active";

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_employeerole_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM employee_roles
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
            $response['response'] = array();
        }
        return $response;
    }

    function update_hr_role($arr_attr, $input)
    {
        $emp_permisions = "";
        $tab_change = $lastExpenseID = "";
        $counter_copy = 0;

        foreach ($input as $key => $val) {
            $converted_array[$key] = $val;

            if ($key == "id")
                $employee_id = $val;
        }

        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;

        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $new = 'Add';
        $new_msg = 'Inserted';

        if ($arr_attr->roles_id > 0)
            $where_id = " AND tst.id <> '$arr_attr->roles_id' ";

        $data_pass = "  tst.role_id='" . $arr_attr->emp_roles . "' and tst.employee_id='" . $employee_id . "' and tst.module_id='" . $arr_attr->module_id . "'  $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('employee_roles', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $tab_change = 'tab_role';
        $role_id_update = $arr_attr->roles_id;

        if ($role_id_update == 0) {

            $Sql = "INSERT INTO employee_roles
                                SET
                                      role_id='" . $arr_attr->emp_roles . "',
                                      module_id='" . $arr_attr->module_ids . "',
                                      permisions='" . $emp_permisions . "',
                                      status=1,
                                      employee_id='" . $employee_id . "',
                                      company_id='" . $this->arrUser['company_id'] . "',
                                      user_id='" . $this->arrUser['id'] . "',
                                      date_added='" . current_date . "'
                                      ";
            $new = 'Add';
            $new_msg = 'Inserted';
        } else {

            $Sql = "UPDATE employee_roles
                           SET
                                role_id='" . $arr_attr->emp_roles . "',
                                module_id='" . $arr_attr->module_ids . "',
                                permisions='" . $emp_permisions . "',
                                status='" . $arr_attr->emp_role_statuss . "'
                                WHERE id = " . $role_id_update . "
                                Limit 1 ";
        }

        $RS = $this->objsetup->CSI($Sql);
        
        $message = "Record  $new_msg Successfully. ";

        if ($employee_id > 0) {
            $response['employee_id'] = $employee_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $message;
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
            $response['last_expense_id'] = $lastExpenseID;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = $message;
        }

        return $response;
    }

    function expences_list($attr)
    {
        $limit_clause = $where_clause = "";
        //$type = (isset($attr['type'])) ? $attr['type'] : 1;
        // $item_id = (isset($attr['item_id'])) ? $attr['item_id'] : 1;
        $response = array();
        $response2 = array();

        if (!empty($attr['keyword']))
            $where_clause .= " AND name LIKE '%".$attr['keyword']."%' ";

        if (!empty($attr['item_id']))
            $where_clause .= " AND psp.item_id = '".$attr['item_id']."' ";

        if (!empty($attr['supp_id']))
            $where_clause .= " AND psp.sale_id = '".$attr['supp_id']."' ";

        $page = (isset($attr['page'])) ? $attr['page'] : 1;
        $start_limit = ($page - 1) * 20;
        $end_limit = $page * 20;

        $limit_clause = " LIMIT ".$start_limit.", ".$end_limit." ";
        // $order_clause = " ORDER BY employee_expenses.id DESC";
        // if (!empty($attr['country_keyword']) && $attr['country_keyword'] != "")       $keyword_clause .= " AND (ar.country LIKE '%$attr[country_keyword]%') ";

        if (empty($attr['all'])) {
            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;
        }
        /* round(SUM(   es.exchange_rate )   *  SUM(   es.amount ) ,2) */

        $Sql = "SELECT employee_expenses.id,
                       employee_expenses.event_name,
                       employee_expenses.event_code,
                       employee_expenses.expense_status,
                       employee_expenses.event_date,

                        (SELECT round(SUM(es.total_sum) ,2)  FROM employee_expenses_detail  es
                        where employee_expenses.employee_id=".$attr['employee_id']." and
                        es.exp_id=employee_expenses.id and es.status=1) as amount,

                        (SELECT round(SUM(epv.amount) ,2)  FROM expense_personel_vehicle  epv
                        where employee_expenses.employee_id=".$attr['employee_id']." and
                        epv.expense_id=employee_expenses.id and epv.status=1) as personalAmount,

                        (SELECT round(SUM(ecv.amount) ,2)  FROM expense_company_vehicle  ecv
                        where employee_expenses.employee_id=".$attr['employee_id']." and
                        ecv.expense_id=employee_expenses.id and ecv.status=1) as companyAmount,

                        COALESCE((SELECT ah.status 
                                    FROM approval_history AS ah 
                                    WHERE  ah.object_id = employee_expenses.id AND
                                            ah.type = 5 AND
                                            ah.company_id = employee_expenses.company_id
                                    ORDER BY ah.id DESC LIMIT 1),-1) as approvalStatus

                FROM employee_expenses
                where   employee_expenses.status IN(1,2) and
                        employee_expenses.employee_id=".$attr['employee_id']." and
                        employee_expenses.company_id=" . $this->arrUser['company_id'] . " ";
       // echo $Sql;exit;

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $order_type = "order by employee_expenses.id DESC";
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'employee_expenses', $order_type);
        // echo $response['q'];exit;		
        // $RS = $this->objsetup->CSI($response['q']);
        if ($attr['employee_id'] == $this->arrUser['id']){
            $RS = $this->objsetup->CSI($response['q']);
        }
        else{
            $RS = $this->objsetup->CSI($response['q'], "HR_expenses_Tab", sr_ViewPermission);
        }

        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                $result['Expense No.'] = $Row['event_code'];
                $result['name'] = $Row['event_name'];
                // $result['amount'] = $Row['amount'] + $Row['personalAmount'] + $Row['companyAmount'];
                $result['Expense_amount'] = $Row['amount'];
                $result['Mileage amount'] = $Row['personalAmount'] + $Row['companyAmount'];
                $result['Mileage amount'] = number_format((float)$result['Mileage amount'], 2, '.', '');
                $result['Expense_amount'] = number_format((float)$result['Expense_amount'], 2, '.', '');
                $result['date'] = $this->objGeneral->convert_unix_into_date($Row['event_date']);
                /* $dt = new DateTime($Row['event_date']);  // convert UNIX timestamp to PHP DateTime
                  $result['event_date'] =$dt->format('d/m/Y');
                 */
                //echo $Row['expense_status'];

                if($Row['approvalStatus'] == 1)
                    $Row['expense_status'] = 1;
                   // if($Row['approvalStatus'] == '-1' || $Row['approvalStatus']>3)
                    $Row['expense_status'] = $Row['approvalStatus'];

                if (($Row['expense_status']) == '-1') {
                    $result['status'] = 'In Progress';
                } else if (($Row['expense_status']) == 0) {
                    $result['status'] = 'Queued For Approval';
                } else if (($Row['expense_status']) == 1) {
                    $result['status'] = 'Awaiting Approval';
                } else if (($Row['expense_status']) == 2) {
                    $result['status'] = 'Approved';
                } else if (($Row['expense_status']) == 3) {
                    $result['status'] = 'Disapproved';
                } else if (($Row['expense_status']) == 4) {
                    $result['status'] = 'Cancel Rejected';
                }else if (($Row['expense_status']) == 5) {
                    $result['status'] = 'Not Responded';
                }else if (($Row['expense_status']) == 6) {
                    $result['status'] = 'Un Locked';
                }else if (($Row['expense_status']) == 7) {
                    $result['status'] = 'On Hold';
                }else {
                    $result['status'] = 'Not defined';
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

    function expence_data_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT ee.id, ee.event_date , ee.event_name , ee.base_currency, ee.event_code , ee.event_name , 
                       ee.event_description,ee.vehicleType, ee.expense_status ,ee.status ,employees.user_code,
                       employees.first_name,company.name as company_name,

                        COALESCE((SELECT ah.status
                                    FROM approval_history AS ah 
                                    WHERE  ah.object_id = ee.id AND
                                            ah.type = 5 AND
                                            ah.company_id = ee.company_id
                                    ORDER BY ah.id DESC LIMIT 1),-1) as approvalStatus
                FROM employee_expenses ee 
                left JOIN employees on employees.id=ee.employee_id 
                left JOIN company on company.id=employees.user_company
                where  ee.id='".$attr['id']."'	
                LIMIT 1 ";
        
       // echo '<pre>'. $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $Row['event_date'] = $this->objGeneral->convert_unix_into_date($Row['event_date']);

           // if($Row['approvalStatus'] == 1) $Row['expense_status'] = 1;
          // if($Row['approvalStatus'] == '-1' || $Row['approvalStatus']>3)
           $Row['expense_status'] = $Row['approvalStatus'];
            
            $Row['status'] = intval($Row['status']);
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        //print_r($response); exit;
        return $response;
    }

    function delete_expences_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE employee_expenses 
                            SET  
                                status=0
                WHERE id = ".$attr['id']." 
                Limit 1";
        // echo $Sql;exit;

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "HR_expenses_Tab", sr_DeletePermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not chnage!';
        }

        return $response;
    }

    function update_hr_expense($arr_attr, $input)
    { 
        $this->objGeneral->mysql_clean($arr_attr);

        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;

        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $new = 'Add';
        $new_msg = 'Inserted';

        $lastExpenseID = '';
        $chekExp = '';
        $tab_change = 'tab_expense';
        $expense_id = ($arr_attr->expense_id != "") ? $arr_attr->expense_id : 0;

        if ($expense_id > 0)
            $where_id = " AND tst.id <> '$expense_id' ";

        $data_pass = " tst.event_name='" . $arr_attr->event_name . "' and tst.employee_id='" . $employee_id . "' and 
                       tst.event_date=   '" . $this->objGeneral->convert_date($arr_attr->event_date) . "' $where_id";

        $total = $this->objGeneral->count_duplicate_in_sql('employee_expenses', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($expense_id == 0) {

            // Insert record into the employee_expenses
            $code_Sql = "SELECT SR_GetNextSeq('employee_expenses','" . $this->arrUser['company_id'] . "','0' ,'0') ";
            $code = $this->objsetup->CSI($code_Sql);

            $event_code = $code->fields[0]; 
            $Sql = "INSERT INTO employee_expenses 
                                    SET
                                        event_date= '" . $this->objGeneral->convert_date($arr_attr->event_date) . "',
                                        expense_status='" . $arr_attr->expense_statuss . "',
                                        base_currency='" . $arr_attr->basecurrencys . "',
                                        event_name='" . $arr_attr->event_name . "',
                                        event_code='" . $event_code . "',
                                        vehicleType='" . $arr_attr->vehicleTypes . "',
                                        event_description='" . $arr_attr->event_description . "',
                                        employee_id='" . $employee_id . "',
                                        status=1,
                                        company_id='" . $this->arrUser['company_id'] . "', 
                                        user_id='" . $this->arrUser['id'] . "'";

            $modulePermission = sr_AddPermission;

        } else {

            $Sql = "UPDATE employee_expenses SET  
							event_date= '" . $this->objGeneral->convert_date($arr_attr->event_date) . "',
							base_currency='" . $arr_attr->basecurrencys . "',
							event_name='" . $arr_attr->event_name . "',
							expense_status='" . $arr_attr->expense_statuss . "',
						    vehicleType='" . $arr_attr->vehicleTypes . "',
							event_description='" . $arr_attr->event_description . "'
                    WHERE id = " . $expense_id . "    
                    Limit 1";

            $modulePermission = sr_EditPermission;
        }

        // echo $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql);

        if ($employee_id == $this->arrUser['id']){
            $RS = $this->objsetup->CSI($Sql);
        }
        else{
            $RS = $this->objsetup->CSI($Sql, "HR_expenses_Tab", $modulePermission);
        }

        if ($expense_id == 0)
            $expense_id = $this->Conn->Insert_ID();

        if ($employee_id > 0) {
            $response['employee_id'] = $employee_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = "Record Inserted Successfully";
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
            $response['id'] = $expense_id;
            $response['code'] = $event_code;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['id'] = $expense_id;
            $response['msg'] = $message;
            $response['code'] = $arr_attr->event_code;
        }

        return $response;
    }

    function sub_expence_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT es.*,currency.name as cname, currency.code AS currencyCode, att.path as imgPath	 
                FROM employee_expenses_detail es 
                left join employee_expenses on employee_expenses.id=es.exp_id 
                left join currency on  currency.id=es.currency 
                left join attachments att on es.exp_image = att.id
                WHERE   es.status=1 and employee_expenses.employee_id='$attr[employee_id]' and  es.exp_id='$attr[expense_id]' 
                order by es.id ASC ";
        // echo $Sql;exit;

        $Sql .= $limit_clause;
        // $RS = $this->objsetup->CSI($Sql);
        if ($attr['employee_id'] == $this->arrUser['id']){
            $RS = $this->objsetup->CSI($Sql);
        }
        else{
            $RS = $this->objsetup->CSI($Sql, "HR_expenses_Tab", sr_ViewPermission);            
        }

        if ($RS->RecordCount() > 0) {

            //	date_default_timezone_set('Europe/Berlin'); 
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                if (($Row['category']) == 1) {
                    $result['catype'] = 'Vehicle';
                } else if (($Row['category']) == 2) {
                    $result['catype'] = 'Accomodation';
                } else if (($Row['category']) == 3) {
                    $result['catype'] = 'Travel';
                } else if (($Row['category']) == 4) {
                    $result['catype'] = 'Communication';
                } else if (($Row['category']) == 5) {
                    $result['catype'] = 'Entertainment';
                } else if (($Row['category']) == 6) {
                    $result['catype'] = 'Food';
                } else if (($Row['category']) == 7) {
                    $result['catype'] = 'Misc';
                }

                $result['crtype'] = $Row['cname'];
                $result['category'] = $Row['category'];
                $result['currency'] = $Row['currency'];
                $result['amount'] = (float)$Row['amount'];
                $result['base_currency'] = $Row['base_currency'];
                $result['exchange_rate'] = (float)$Row['exchange_rate'];
                $result['comments'] = $Row['exchange_rate_comment'];
                $result['exchange_description'] = $Row['exchange_description'];
                $result['currencyCode'] = $Row['currencyCode'];
                 
                $result['imageId'] = $Row['exp_image'];

                if ($result['imageId'] && file_exists($Row['imgPath']))
                    $result['exp_image'] = WEB_PATH . "/" . explode("//", $Row['imgPath'])[1];
                else{
                    $result['exp_image'] = '';
                }

                $result['sort_id'] = $Row['sort_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function subexpence_data_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT * FROM employee_expenses_detail ee  WHERE  ee.id='".$attr['id']."'	and status=1 LIMIT 1 ";
        // $RS = $this->objsetup->CSI($Sql);
        
        if ($attr['employee_id'] == $this->arrUser['id']){
            $RS = $this->objsetup->CSI($Sql);
        }
        else{
            $RS = $this->objsetup->CSI($Sql, "HR_expenses_Tab", sr_ViewPermission);
        }        

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

    function delete_expence_sub($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE employee_expenses_detail 
                        SET
                            status=0
                            WHERE id = ".$attr['id']."
                            Limit 1";

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "HR_expenses_Tab", sr_DeletePermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not deleted!';
        }

        return $response;
    }

    function delete_expence_sub_pv($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        /* $Sql = "DELETE FROM employee_expenses_detail
          WHERE id = ".$attr['id']." Limit 1 "; */

        $Sql = "UPDATE expense_personel_vehicle 
                        SET
                            status=0
                            WHERE id = ".$attr['id']."
                            Limit 1";


        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "HR_expenses_Tab", sr_DeletePermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not chnage!';
        }

        return $response;
    }
    function delete_expence_sub_cv($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        /* $Sql = "DELETE FROM employee_expenses_detail
          WHERE id = ".$attr['id']." Limit 1 "; */

        $Sql = "UPDATE expense_company_vehicle 
                        SET
                            status=0
                            WHERE id = ".$attr['id']."
                            Limit 1";


        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "HR_expenses_Tab", sr_DeletePermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not chnage!';
        }

        return $response;
    }

    function update_hr_subexpense($arr_attr, $input)
    {
        $tab_change = $lastExpenseID = ""; 
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

        $counter_copy = 0;
        foreach ($input as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id")
                $employee_id = $val;
        }
        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;

        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $new = 'Add';
        $new_msg = 'Inserted';

        $expence_id = $arr_attr->expence_id;
        
        foreach ($arr_attr->data as $key => $row) {
            $modulePermission = "";
            // if ($row->amount != '')
            {
                //	 echo $row->category;
                $category = ($row->category != "") ? $row->category : 0;
                $id = ($row->id != "") ? $row->id : 0;
                $imageId = ($row->imageId != "") ? $row->imageId : 0;

                if($id == 0)
                {
                    $SqlSubExpense = "INSERT INTO employee_expenses_detail 
                                                        SET  
                                                            category='" . $category . "',
                                                            currency='" . $row->currency . "',
                                                            amount='" . $row->amount . "',
                                                            exchange_rate='" . $row->exchange_rate . "',
                                                            exchange_rate_comment='" .addslashes( $row->comments ). "',
                                                            exchange_description='" . addslashes($row->exchange_description) . "',
                                                            exp_image='" . $imageId . "',
                                                            total_sum='" . $row->amount/ $row->exchange_rate . "',
                                                            exp_id='" . $expence_id . "',
                                                            employee_id='" . $employee_id . "',
                                                            status=1,
                                                            base_currency =  0,
                                                            invoice_id=0,
                                                            event_sub_date = 0,
                                                            sort_id=$row->sort_id,
                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                            user_id='" . $this->arrUser['id'] . "',
                                                            date_added='" . current_date . "'";
                                                            $modulePermission = sr_AddPermission;
                }
                else
                {
                    $SqlSubExpense = "UPDATE employee_expenses_detail 
                                                        SET  
                                                            category='" . $category . "',
                                                            currency='" . $row->currency . "',
                                                            amount='" . $row->amount . "',
                                                            exchange_rate='" . $row->exchange_rate . "',
                                                            exchange_rate_comment='" . addslashes($row->comments) . "',
                                                            exchange_description='" . addslashes($row->exchange_description) . "',
                                                            exp_image='" . $imageId . "',
                                                            total_sum='" . $row->amount / $row->exchange_rate . "',
                                                            exp_id='" . $expence_id . "',
                                                            employee_id='" . $employee_id . "',
                                                            status=1,
                                                            base_currency =  0,
                                                            invoice_id=0,
                                                            event_sub_date = 0,
                                                            sort_id=$row->sort_id,
                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                            user_id='" . $this->arrUser['id'] . "',
                                                            date_added='" . current_date . "'
                                        WHERE
                                            id = " . $id;
                                                    $modulePermission = sr_EditPermission;

                }
                // echo $SqlSubExpense;exit;
                // $RS = $this->objsetup->CSI($SqlSubExpense);
                //$RS = $this->objsetup->CSI($SqlSubExpense, "HR_expenses_Tab", $modulePermission);
                if ($employee_id == $this->arrUser['id']){
                    $RS = $this->objsetup->CSI($SqlSubExpense);
                }
                else{
                    $RS = $this->objsetup->CSI($SqlSubExpense, "HR_expenses_Tab", $modulePermission);
                }

                $srLogTrace = array();

                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_3;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Adding/Updating Detail';
                $srLogTrace['Parameter2'] = 'Expense ID:'.$arr_attr->expence_id;

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
            }
        }
        //exit; 

        if ($arr_attr->tab_id_2 == 77) {
            $tab_change = 'tab_expense_detail';
            $sub_expense_id = $arr_attr->sub_expense_id;

            if ($sub_expense_id == 0) {

                $sql_total = "SELECT  count(id) as total	FROM employee_expenses_detail
                                      where
                                          invoice_id='" . $arr_attr->data->category->id . "'	and
                                          amount='" . $arr_attr->data->amount . "' and
                                          exp_id='" . $arr_attr->expense_id . "' and
                                          event_sub_date= '" . $this->objGeneral->convert_date($arr_attr->data->event_sub_date) . "'
                                          LIMIT 1 ";

                $rs_count = $this->objsetup->CSI($sql_total);
                $total = $rs_count->fields['total'];

                if ($total > 0) {
                    $response['ack'] = 1;
                    $response['msg'] = 'Record Already Exists.';
                    $response['tab_change'] = $tab_change;
                    return $response;
                } else {

                    // Insert record into the employee_expenses
                    $Sql = "INSERT INTO employee_expenses_detail
                                        SET
                                            category='" . $arr_attr->data->category->id . "' ,
                                            currency='" . $arr_attr->data->currency->id . "',
                                            amount='" . $arr_attr->data->amount . "',
                                            base_currency='" . $arr_attr->data->base_currency . "',
                                            exchange_rate='" . $arr_attr->data->exchange_rate . "',
                                            exchange_rate_comment='" . $arr_attr->data->comments . "',
                                            exchange_description='" . $arr_attr->data->exchange_description . "',
                                            invoice_id='" . $arr_attr->data->invoice_id . "',
                                            exp_id='" . $arr_attr->expense_id . "',
                                            status=1,
                                            event_sub_date= '" . $this->objGeneral->convert_date($arr_attr->data->event_sub_date) . "',
                                            exp_image='" . $arr_attr->data->exp_image . "',
                                            total_sum='" . $arr_attr->data->exchange_rate * $arr_attr->data->amount . "',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            user_id='" . $this->arrUser['id'] . "',
                                            date_added='" . current_date . "'";

                    $new = 'Add';
                    $new_msg = 'Inserted';
                }
            } else {
                $Sql = "UPDATE employee_expenses_detail
                                    SET
                                        category='" . $arr_attr->data->category->id . "' ,
                                        currency='" . $arr_attr->data->currency->id . "',
                                        amount='" . $arr_attr->data->amount . "',
                                        base_currency='" . $arr_attr->data->base_currency . "',
                                        exchange_rate='" . $arr_attr->data->exchange_rate . "',
                                        exchange_rate_comment='" . $arr_attr->data->comments . "',
                                        invoice_id='" . $arr_attr->data->invoice_id . "',
                                        exchange_description='" . $arr_attr->data->exchange_description . "',
                                        total_sum='" . $arr_attr->data->exchange_rate * $arr_attr->data->amount . "',
                                        event_sub_date= '" . $this->objGeneral->convert_date($arr_attr->data->event_sub_date) . "',
                                        exp_image='" . $arr_attr->data->exp_image . "'

                                        WHERE id = " . $sub_expense_id . "    
                                        Limit 1";
            }

           // echo $Sql; exit;
            $RS = $this->objsetup->CSI($Sql);

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_3;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Adding/Updating Detail';
            $srLogTrace['Parameter2'] = 'Expense ID:'.$arr_attr->expence_id;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }
        //echo $Sql;exit;
        $message = "Record  $new_msg Successfully. ";

        if ($employee_id > 0) {
            $response['employee_id'] = $employee_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $message;
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
            $response['last_expense_id'] = $lastExpenseID;
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = $message;
        }

        return $response;
    }

    function get_company_financial_years()
    {

        $Sql = "SELECT year_end_date,year_start_date FROM financial_settings WHERE company_id='" . $this->arrUser['company_id'] . "' LIMIT 1";

        $RS = $this->objsetup->CSI($Sql);

        $result = array();

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['year_end_date'] = $Row['year_end_date'];
                $result['year_start_date'] = $Row['year_start_date'];
            }
        }
        return $result;
    }

    function expence_perlist($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        $finance_year = $this->get_company_financial_years();

        $finance_year_start = $finance_year['year_start_date'];
        $finance_year_end = $finance_year['year_end_date'];

        $response = array();
        $current_year = date("Y");
        $next_year = $current_year + 1;
        $total_calc_milage_Sql = "SELECT IFNULL(SUM(es.actual_miles) ,0)  as total
                                FROM employee_expenses ee, expense_personel_vehicle es
                                where  
                                    ee.id = es.expense_id AND
                                    ee.id <> $attr[expense_id] AND
                                    ee.status = 2 AND
                                    es.status = 1 AND
                                    es.date_of_travel BETWEEN ".strtotime($current_year.'-04-06')." AND ".strtotime($next_year.'-04-06')." AND
                                    es.expense_id <> '$attr[expense_id]' AND
                                    es.employee_id='$attr[employee_id]'  AND
                                    es.company_id=" . $this->arrUser['company_id'];

        // echo $total_calc_milage_Sql;exit;
        // $total_calc_milage_count = $this->objsetup->CSI($total_calc_milage_Sql);

        if ($attr['employee_id'] == $this->arrUser['id']){
            $total_calc_milage_count = $this->objsetup->CSI($total_calc_milage_Sql);
        }
        else{
           $total_calc_milage_count = $this->objsetup->CSI($total_calc_milage_Sql, "HR_expenses_Tab", sr_ViewPermission);
        }       
        
        if(is_array($total_calc_milage_count) && $total_calc_milage_count['Error'] == 1){
            return $total_calc_milage_count;
        }
        else if (is_array($total_calc_milage_count) && $total_calc_milage_count['Access'] == 0){
            return $total_calc_milage_count;
        }
        $calc_milage_total = floatval($total_calc_milage_count->fields['total']);

        $response['calc_milage_total'] = $calc_milage_total;


        $Sql = "SELECT ps.*,(SELECT round(SUM(es.amount) ,2)  as total
			FROM expense_personel_vehicle  es
			where  es.status=1 and	es.expense_id='$attr[expense_id]' and es.status=1) as total
			FROM expense_personel_vehicle as ps
			left JOIN company on company.id=ps.company_id 
			WHERE  ps.status=1 AND ps.employee_id='$attr[employee_id]' AND  ps.expense_id='$attr[expense_id]' 
			AND (ps.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
			order by ps.sort_id ASC";


        $Sql .= $limit_clause;
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['pid'] = $Row['id'];
                $result['pdate_of_travel'] = $this->objGeneral->convert_unix_into_date($Row['date_of_travel']);
                $result['pdescription'] = $Row['description'];
                $result['ppostcodeFrom'] = $Row['postcodeFrom'];
                //$result['pvia'] = $Row['via'];  
                $result['ppostcodeTo'] = $Row['postcodeTo'];
                $result['pmiles'] = $Row['miles'];
                $result['pactual_miles'] = (float)$Row['actual_miles'];
                $result['pmileage_rate'] = $Row['mileage_rate'];
                $result['pvehicleType'] = $Row['vehicleType'];
                $result['pcomment'] = $Row['comment'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }


        return $response;
    }

    function update_hr_exppersonal($arr_attr, $input)
    {
        $tab_change = $lastExpenseID = "";

        $counter_copy = 0;
        foreach ($input as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id")
                $employee_id = $val;
        }
        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;
        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $new = 'Add';
        $new_msg = 'Inserted';

        $expence_id = $arr_attr->expence_id;

        foreach ($arr_attr->data as $key => $row) {
            $modulePermission = "";
            // if ($row->pmiles != '')
            $id = ($row->pid != "") ? $row->pid : 0;
            $sort_id = ($row->sort_id != "") ? $row->sort_id : 0;

            if($id == 0)
            {
                $Sql = "INSERT INTO expense_personel_vehicle SET
                            date_of_travel = '" . $this->objGeneral->convert_date($row->pdate_of_travel) . "', 
                            description = '" . addslashes($row->pdescription) . "',
                            postcodeFrom = '" . $row->ppostcodeFrom . "',
                            postcodeTo = '" . $row->ppostcodeTo . "',
                            miles = '" . $row->pmiles . "',
                            actual_miles = '" . $row->pactual_miles . "',
                            mileage_rate = '" . $row->pmileage_rate . "',
                            amount = '" . $row->pmileage_rate * $row->pactual_miles . "',
                            expense_id = '" . $expence_id . "',
                            employee_id = '" . $employee_id . "',
                            sort_id = '" . $sort_id . "',
                            via = '0',
                            tick_option_from_return='0',
                            status=1,
                            company_id = '" . $this->arrUser['company_id'] . "',
                            user_id = '" . $this->arrUser['id'] . "',
                            date_added = '" . current_date_time . "',
                            vehicleType = '" . $row->pvehicleType . "',
                            comment = '" . addslashes($row->pcomment) . "'";
                            $modulePermission = sr_AddPermission;
                // echo $Sql;exit;
            }
            else
            {
                $Sql = "UPDATE expense_personel_vehicle SET
                            date_of_travel = '" . $this->objGeneral->convert_date($row->pdate_of_travel) . "', 
                            description = '" . addslashes($row->pdescription) . "',
                            postcodeFrom = '" . $row->ppostcodeFrom . "',
                            postcodeTo = '" . $row->ppostcodeTo . "',
                            miles = '" . $row->pmiles . "',
                            actual_miles = '" . $row->pactual_miles . "',
                            mileage_rate = '" . $row->pmileage_rate . "',
                            amount = '" . $row->pmileage_rate * $row->pactual_miles . "',
                            expense_id = '" . $expence_id . "',
                            employee_id = '" . $employee_id . "',
                            sort_id = '" . $sort_id . "',
                            via = '0',
                            tick_option_from_return='0',
                            status=1,
                            company_id = '" . $this->arrUser['company_id'] . "',
                            user_id = '" . $this->arrUser['id'] . "',
                            date_added = '" . current_date_time . "',
                            vehicleType = '" . $row->pvehicleType . "',
                            comment = '" . addslashes($row->pcomment) . "'
                    WHERE id = ".$id;
                    $modulePermission = sr_EditPermission;
                // echo $Sql;exit;
            }
            //  $RS = $this->objsetup->CSI($Sql);
            if ($employee_id  == $this->arrUser['id']){
                $RS = $this->objsetup->CSI($Sql);
            }
            else{
                $RS = $this->objsetup->CSI($Sql, "HR_expenses_Tab", $modulePermission);
            }
        }

        $message = "Record  $new_msg Successfully. ";

        if ($employee_id > 0) {
            $response['employee_id'] = $employee_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $message;
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
            $response['last_expense_id'] = $lastExpenseID;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = $message;
        }

        return $response;
    }

    function comp_expence_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        $finance_year = $this->get_company_financial_years();

        $finance_year_start = $finance_year['year_start_date'];
        $finance_year_end = $finance_year['year_end_date'];

        $response = array();

        $total_calc_milage_Sql = "  SELECT IFNULL(SUM(es.actual_miles) ,0)  as total
                                    FROM employee_expenses ee, expense_company_vehicle es
                                    where  
                                        ee.id = es.expense_id AND
                                        ee.id = $attr[expense_id] AND
                                        ee.status = 2 AND
                                        es.status = 1 AND
                                        es.date_of_travel > ".strtotime(date("Y").'-04-06')." AND
                                        es.expense_id='$attr[expense_id]' AND
                                        es.employee_id='$attr[employee_id]'  AND
                                        es.company_id=" . $this->arrUser['company_id'];

        // echo $total_calc_milage_Sql;exit;
        // $total_calc_milage_count = $this->objsetup->CSI($total_calc_milage_Sql);
        
        if ($attr['employee_id'] == $this->arrUser['id']){
           $total_calc_milage_count = $this->objsetup->CSI($total_calc_milage_Sql);
        }
        else{
          $total_calc_milage_count = $this->objsetup->CSI($total_calc_milage_Sql, "HR_expenses_Tab", sr_ViewPermission);
        }
            if(is_array($total_calc_milage_count) && $total_calc_milage_count['Error'] == 1){
                return $total_calc_milage_count;
            }
            else if (is_array($total_calc_milage_count) && $total_calc_milage_count['Access'] == 0){
                return $total_calc_milage_count;
            }
        $calc_milage_total = floatval($total_calc_milage_count->fields['total']);

        $response['company_calc_milage_total'] = $calc_milage_total;


        $Sql = "SELECT ps.*,(SELECT round(SUM(es.amount) ,2)  as total
                             FROM expense_company_vehicle  es
                             where  es.status=1 and	es.expense_id='$attr[expense_id]' and es.status=1) as total
                FROM expense_company_vehicle as ps
                WHERE  ps.status=1 AND 
                        ps.employee_id='$attr[employee_id]' AND  
                        ps.expense_id='$attr[expense_id]' AND 
                        ps.company_id=" . $this->arrUser['company_id'] . "
                order by ps.sort_id ASC";


        $Sql .= $limit_clause;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['date_of_travel'] = $this->objGeneral->convert_unix_into_date($Row['date_of_travel']);
                $result['description'] = $Row['description'];
                $result['postcodeFrom'] = $Row['postcodeFrom'];

                $result['postcodeTo'] = $Row['postcodeTo'];
                $result['miles'] = $Row['miles'];
                $result['actual_miles'] = (float)$Row['actual_miles'];
                $result['mileage_rate'] = $Row['mileage_rate'];
                $result['fuelType'] = $Row['fuelType'];
                $result['engineType'] = $Row['engineType'];
                $result['comment'] = $Row['comment'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }


        return $response;
    }

    function update_hr_expcompany($arr_attr, $input)
    {
        $tab_change = $lastExpenseID = "";
        $counter_copy = 0;

        foreach ($input as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id")
                $employee_id = $val;
        }

        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;

        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $new = 'Add';
        $new_msg = 'Inserted';
        
        $expence_id = $arr_attr->expence_id;

        foreach ($arr_attr->data as $key => $row) {
            $modulePermission = "";
            // if ($row->actual_miles != '') 
            {
                $id = ($row->id != "") ? $row->id : '';
                $sort_id = ($row->sort_id != "") ? $row->sort_id : 0;
                if($id == 0)
                {
                    $Sql = "INSERT INTO expense_company_vehicle SET  
                                date_of_travel='" . $this->objGeneral->convert_date($row->date_of_travel) . "',
                                description='" .addslashes($row->description) . "',
                                postcodeFrom='" . $row->postcodeFrom . "',
                                via='" . $row->via . "',
                                postcodeTo='" . $row->postcodeTo . "',
                                miles='" . $row->miles . "',
                                actual_miles='" . $row->actual_miles . "',
                                mileage_rate='" . $row->mileage_rate . "',
                                amount='" . $row->mileage_rate * $row->actual_miles . "',
                                fuelType='" . $row->fuelType . "',
                                engineType='" . $row->engineType . "',
                                comment='" . addslashes($row->comment) . "',
                                expense_id='" . $expence_id . "',
                                employee_id='" . $employee_id . "',
                                status=1,
                                tick_option_from_return='0',
                                sort_id='$sort_id',
                                company_id='" . $this->arrUser['company_id'] . "',
                                user_id='" . $this->arrUser['id'] . "',
                                date_added='" . current_date . "'";
                                $modulePermission = sr_AddPermission;
                }
                else
                {
                    $Sql = "UPDATE expense_company_vehicle SET  
                                date_of_travel='" . $this->objGeneral->convert_date($row->date_of_travel) . "',
                                description='" . addslashes($row->description) . "',
                                postcodeFrom='" . $row->postcodeFrom . "',
                                via='" . $row->via . "',
                                postcodeTo='" . $row->postcodeTo . "',
                                miles='" . $row->miles . "',
                                actual_miles='" . $row->actual_miles . "',
                                mileage_rate='" . $row->mileage_rate . "',
                                amount='" . $row->mileage_rate * $row->actual_miles . "',
                                fuelType='" . $row->fuelType . "',
                                engineType='" . $row->engineType . "',
                                comment='" . addslashes($row->comment) . "',
                                expense_id='" . $expence_id . "',
                                employee_id='" . $employee_id . "',
                                status=1,
                                tick_option_from_return='0',
                                sort_id='$sort_id',
                                date_added='" . current_date . "'
                        WHERE id = ".$id;
                                $modulePermission = sr_EditPermission;

                }
                	// echo $Sql;exit; 
                // $RS = $this->objsetup->CSI($Sql);
                if ($employee_id  == $this->arrUser['id']){
               $RS = $this->objsetup->CSI($Sql);
                }
                else{
                $RS = $this->objsetup->CSI($Sql, "HR_expenses_Tab", $modulePermission);
                }
            }
        }

        $message = "Record  $new_msg Successfully. ";

        if ($employee_id > 0) {
            $response['employee_id'] = $employee_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $message;
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
            $response['last_expense_id'] = $lastExpenseID;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = $message;
        }

        return $response;
    }

    //-------------------- Holiday--------------------
    function add_holiday($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //if(current_date < $this->objGeneral->convert_date($attr[holiday_date_from])){
        // check record bw 2 dates 

        $SqlValidateHoliday = " SELECT holiday_date_to,holiday_date_from  
                                FROM hr_holidays
                                WHERE  emp_id='" . $attr['employee_id'] . "' AND status = 1 AND holidayStatus <>3 AND 
                                      ((holiday_date_to >='" . $this->objGeneral->convert_date($attr['holiday_date_to']) . "' AND
                                        holiday_date_from <='" . $this->objGeneral->convert_date($attr['holiday_date_to']) . "') OR  
                                       (holiday_date_to >='" . $this->objGeneral->convert_date($attr['holiday_date_from']) . "' AND  
                                        holiday_date_from <='" . $this->objGeneral->convert_date($attr['holiday_date_from']) . "'))";
        // echo $SqlValidateHoliday; exit;
        $RSH = $this->objsetup->CSI($SqlValidateHoliday);

        if ($RSH->RecordCount() > 0) {

            $response['ack'] = 0;
            $response['error'] = "Holidays in this range are already booked!";
            $response['response'] = array();

        } else {

            $holiday_type  =($attr['holiday_type']) ? $attr['holiday_type']  : 0;
            $holidayYearID  =($attr['holidayYearID']) ? $attr['holidayYearID']  : 0;

            $Sql_empl = "SELECT entitle_holiday FROM employees WHERE id = " . $attr['employee_id'] . "  Limit 1";
        
            $rs_Sql_empl = $this->objsetup->CSI($Sql_empl);
            $employee_total_holidays = $rs_Sql_empl->fields['entitle_holiday'];

            // new code here
            $financialDateQuery = "SELECT holiday_start_month FROM company WHERE id = '".$this->arrUser['company_id']."'";
            $dateResult = $this->objsetup->CSI($financialDateQuery);

            $dateResult = $dateResult->FetchRow();
            $startMonth = $dateResult['holiday_start_month'];

            if($holidayYearID  == 1){

                $year=date("Y");
            
                $startDate  = new DateTime("1-" . $startMonth . "-" .$year);
                $startDate  = strtotime($startDate->format('d-m-Y'));
    
                $endDate    = new DateTime("1-" . ($startMonth == 1 ? 12 : $startMonth - 1) . "-" . ($startMonth == 1 ? $year : $year + 1));
                $endDate->modify('last day of this month');
                $endDate   = strtotime($endDate->format('d-m-Y'));
                //ends here

                $Sql_empl_holidays = "  SELECT SUM(total_holiday) as numtotalHoliday,
                                            SUM(holiday_booked)as numholiday_booked 
                                        FROM hr_holidays as ho
                                        WHERE emp_id = " . $attr['employee_id'] . " AND 
                                                ho.holiday_type='1' AND ho.status='1' AND 
                                                ho.holiday_date_to BETWEEN $startDate AND $endDate AND 
                                                ho.holidayStatus<>'3' AND 
                                                ho.company_id=" . $this->arrUser['company_id'] . " AND 
                                                ho.holiday_nature=1";

                $rs_Sql_empl_holidays = $this->objsetup->CSI($Sql_empl_holidays);
                $employee_total_holidays_availed = $rs_Sql_empl_holidays->fields['numtotalHoliday'];
                $employee_total_holidays_booked = $rs_Sql_empl_holidays->fields['numholiday_booked'];


                $employee_total_holidays_overall_availed = $employee_total_holidays_availed + $employee_total_holidays_booked;
                $sum_of_holidays_requested = $employee_total_holidays_overall_availed + $attr['holiday_booked'] + $attr['holiday_num_days'];
                $remaining_holidays = $employee_total_holidays - $sum_of_holidays_requested;

                if ($sum_of_holidays_requested > $employee_total_holidays && $attr['holiday_nature'] == 1) {
                    $response['ack'] = 0;
                    $response['error'] = "Total Holidays Requested are greater than employee Holidays limit";
                    $response['response'] = array();
                    return $response;
                }

                if ($remaining_holidays < 0 && $attr['holiday_nature'] == 1) {
                    $response['ack'] = 0;
                    $response['error'] = "Total Holidays Requested are greater than employee Holidays limit";
                    $response['response'] = array();
                    return $response;
                }
            }
            else if($holidayYearID  == 2){

                $year = date("Y") + 1;
            
                $startDate  = new DateTime("1-" . $startMonth . "-" .$year);
                $startDate  = strtotime($startDate->format('d-m-Y'));
    
                $endDate    = new DateTime("1-" . ($startMonth == 1 ? 12 : $startMonth - 1) . "-" . ($startMonth == 1 ? $year : $year + 1));
                $endDate->modify('last day of this month');
                $endDate   = strtotime($endDate->format('d-m-Y'));
                //ends here

                $Sql_empl_holidays = "  SELECT SUM(COALESCE(total_holiday,0)) as numtotalHoliday,
                                             SUM(COALESCE(holiday_booked,0)) as numholiday_booked 
                                        FROM hr_holidays as ho
                                        WHERE emp_id = " . $attr['employee_id'] . " AND 
                                                ho.holiday_type='1' AND ho.status='1' AND 
                                                ho.holiday_date_to BETWEEN $startDate AND $endDate AND 
                                                ho.holidayStatus<>'3' AND 
                                                ho.holidayYear = " . $holidayYearID . " AND 
                                                ho.company_id=" . $this->arrUser['company_id'] . " AND 
                                                ho.holiday_nature=1";

                $rs_Sql_empl_holidays = $this->objsetup->CSI($Sql_empl_holidays);
                $employee_total_holidays_availed = $rs_Sql_empl_holidays->fields['numtotalHoliday'];
                $employee_total_holidays_booked = $rs_Sql_empl_holidays->fields['numholiday_booked'];


                $employee_total_holidays_overall_availed = $employee_total_holidays_availed + $employee_total_holidays_booked;
                $sum_of_holidays_requested = $employee_total_holidays_overall_availed + $attr['holiday_booked'] + $attr['holiday_num_days'];
                $remaining_holidays = $employee_total_holidays - $sum_of_holidays_requested;

                if ($sum_of_holidays_requested > $employee_total_holidays && $attr['holiday_nature'] == 1) {
                    $response['ack'] = 0;
                    $response['error'] = "Total Holidays Requested are greater than employee Holidays limit";
                    $response['response'] = array();
                    return $response;
                }

                if ($remaining_holidays < 0 && $attr['holiday_nature'] == 1) {
                    $response['ack'] = 0;
                    $response['error'] = "Total Holidays Requested are greater than employee Holidays limit";
                    $response['response'] = array();
                    return $response;
                }
            }
            

            $SQL = "INSERT INTO hr_holidays 
                                    SET 
                                       emp_id='" . $attr['employee_id'] . "',
                                       holiday_code='" . $attr['holiday_code'] . "',
                                       holidayYear = '" . $holidayYearID . "',
                                       holiday_type='" . $holiday_type . "',
                                       holiday_nature='" . $attr['holiday_nature'] . "',
                                       holidayStatus='" . $attr['holidayStatus'] . "',
                                       remaining_holidays='" . $remaining_holidays . "',
                                       holiday_description='" . $attr['holiday_description'] . "',
                                       holiday_date_from='" . $this->objGeneral->convert_date($attr['holiday_date_from']) . "',
                                       holiday_date_to='" . $this->objGeneral->convert_date($attr['holiday_date_to']) . "',
                                       total_holiday='" . $attr['holiday_num_days'] . "',
                                       status='1',
                                       user_id='" . $this->arrUser['id'] . "',
                                       company_id='" . $this->arrUser['company_id'] . "'";

            //echo $SQL; exit; //total_holiday='" . $totalDay . "',
            // $RSProducts = $this->objsetup->CSI($SQL);
            if ($attr['employee_id'] == $this->arrUser['id']){
                $RSProducts = $this->objsetup->CSI($SQL);
            }
            else{
                $RSProducts = $this->objsetup->CSI($SQL, "HR_holidayTab", sr_AddPermission);
            }

            if(is_array($RSProducts) && $RSProducts['Error'] == 1){
                return $RSProducts;
            }
            else if (is_array($RSProducts) && $RSProducts['Access'] == 0){
                return $RSProducts;
            }

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = "Record saved successfully";
                $response['response'] = array();
                $response['lastInsertID'] = $this->Conn->Insert_ID(); 
            } else {
                $response['ack'] = 0;
                $response['error'] = "Record Not Saved";
                $response['response'] = array();
            }
        }

        return $response;
    }

    function update_holiday($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //if(current_date < $this->objGeneral->convert_date($attr[holiday_date_from])){

        // check record bw 2 dates 
        $SqlValidateHoliday = "SELECT holiday_date_to,holiday_date_from  
                               FROM hr_holidays 
                               WHERE id <>'" . $attr['holiday_id'] . "' AND 
                                     status = 1 AND holidayStatus <> 6 AND 
                                     emp_id='" . $attr['employee_id'] . "' AND 
                                     ((holiday_date_to >='" . $this->objGeneral->convert_date($attr['holiday_date_to']) . "' AND  
                                       holiday_date_from <='" . $this->objGeneral->convert_date($attr['holiday_date_to']) . "') OR 
                                      (holiday_date_to >='" . $this->objGeneral->convert_date($attr['holiday_date_from']) . "' AND  
                                       holiday_date_from <='" . $this->objGeneral->convert_date($attr['holiday_date_from']) . "'))";
        //echo $SqlValidateHoliday; exit;
        $RSH = $this->objsetup->CSI($SqlValidateHoliday);

        if ($RSH->RecordCount() > 0) {

            $response['ack'] = 0;
            $response['lastInsertID'] = $attr['holiday_id']; 
            $response['error'] = "Holidays in this range are already booked!";
            $response['response'] = array();
        } else {

            $Sql_empl = "SELECT entitle_holiday FROM employees WHERE id = " . $attr['employee_id'] . "  Limit 1";
            $rs_Sql_empl = $this->objsetup->CSI($Sql_empl);

            $employee_total_holidays = $rs_Sql_empl->fields['entitle_holiday'];

            //echo "- Employee Total Entitled Holidays " . $employee_total_holidays;
            $Sql_empl_holidays = "SELECT SUM(COALESCE(total_holiday,0)) as numtotalHoliday,
                                         SUM(COALESCE(holiday_booked,0)) as numholiday_booked 
                                  FROM hr_holidays as ho
                                  WHERE emp_id = " . $attr['employee_id'] . " AND 
                                        ho.holiday_type = '1' AND ho.status='1' AND 
                                        ho.id <> " . $attr['holiday_id'] . " AND 
                                        ho.holidayYear = " . $attr['holidayYearID'] . " AND 
                                        ho.holidayStatus <> '3' AND 
                                        ho.holiday_nature = 1 AND 
                                        ho.company_id = " . $this->arrUser['company_id'] . " ";
            //echo $Sql_empl_holidays;exit;

            $rs_Sql_empl_holidays = $this->objsetup->CSI($Sql_empl_holidays);
            $employee_total_holidays_availed = $rs_Sql_empl_holidays->fields['numtotalHoliday'];
            $employee_total_holidays_booked = $rs_Sql_empl_holidays->fields['numholiday_booked'];
            //echo "- Employee Total Holidays Availed " . $employee_total_holidays_availed;
            //echo "- Employee Total Holidays Booked " . $employee_total_holidays_booked;
            

            $employee_total_holidays_overall_availed = $employee_total_holidays_availed + $employee_total_holidays_booked;
            //echo $employee_total_holidays_overall_availed;exit;
            $sum_of_holidays_requested = $employee_total_holidays_overall_availed + $attr['holiday_booked'] + $attr['holiday_num_days'];
            //echo $sum_of_holidays_requested;exit;

            $remaining_holidays = $employee_total_holidays - $sum_of_holidays_requested;
            //echo $remaining_holidays;exit;

            if ($sum_of_holidays_requested > $employee_total_holidays && $attr['holiday_nature'] == 1) {
                $response['ack'] = 0;
                $response['lastInsertID'] = $attr['holiday_id']; 
                $response['error'] = "Total Holidays Requested are greater than employee Holidays limit";
                $response['response'] = array();
                return $response;
            }

            if ($remaining_holidays < 0 && $attr['holiday_nature'] == 1) {
                $response['ack'] = 0;
                $response['lastInsertID'] = $attr['holiday_id']; 
                $response['error'] = "Total Holidays Requested are greater than employee Holidays limit";
                $response['response'] = array();
                return $response;
            }

            // removed following lines from below query
            // holiday_booked='" . $attr[holiday_booked] . "',

            $SQL = "UPDATE hr_holidays 
                            SET 
                               holidayYear = '" . $attr['holidayYearID'] . "',
                               holiday_type = '" . $attr['holiday_type'] . "',
                               holiday_nature='" . $attr['holiday_nature'] . "',
                               holidayStatus='" . $attr['holidayStatus'] . "',
                               remaining_holidays='" . $remaining_holidays . "',
                               holiday_description='" . $attr['holiday_description'] . "',
                               holiday_date_from='" . $this->objGeneral->convert_date($attr['holiday_date_from']) . "',
                               holiday_date_to='" . $this->objGeneral->convert_date($attr['holiday_date_to']) . "',
                               total_holiday='" . $attr['holiday_num_days'] . "'
                    WHERE id='" . $attr['holiday_id'] . "'";
            // echo $SQL; exit;

            //  total_holiday='" . $totalDay . "'
            // $RSProducts = $this->objsetup->CSI($SQL);

            if ($attr['employee_id'] == $this->arrUser['id']){
                $RSProducts = $this->objsetup->CSI($SQL);
            }
            else{
                $RSProducts = $this->objsetup->CSI($SQL, "HR_holidayTab", sr_EditPermission);
            }

            if(is_array($RSProducts) && $RSProducts['Error'] == 1){
                return $RSProducts;
            }
            else if (is_array($RSProducts) && $RSProducts['Access'] == 0){
                return $RSProducts;
            }

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['lastInsertID'] = $attr['holiday_id']; 
                $response['error'] = "Record Updated Successfully";
                $response['response'] = array();
            } else {
                $response['ack'] = 1;
                $response['lastInsertID'] = $attr['holiday_id']; 
                $response['error'] = "Record Updated Successfully";
                $response['response'] = array();
            }
        }
        return $response;
    }

    function holiday_listing($attr)
    {     
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";

        $response = array();
        $financialDateQuery = "SELECT holiday_start_month FROM company where id = '".$this->arrUser['company_id']."'";
        $dateResult = $this->objsetup->CSI($financialDateQuery);

        //print_r($dateResult);exit;
        if ($dateResult->RecordCount() > 0) {
         
            $dateResult = $dateResult->FetchRow();
            $startMonth = $dateResult['holiday_start_month'];
            $period     = $attr['period'];

            if($period == '-1')
            {
                $year = date("Y")-1;
                $yearEnd = date("Y")-1;
            }
            elseif($period == '1')
            {
                $year = date("Y")+1;
                $yearEnd = date("Y")+1;
            }
            elseif($period == '2')
            {
                $year = date("Y")-1;
                $yearEnd = date("Y")+1;
            }
            else{
                $year = date("Y");
                $yearEnd = date("Y");
            }
          
            $startDate  = new DateTime("1-" . $startMonth . "-" .$year);
            //echo "1-" . $startMonth . "-" .$year."  -  startDate".$startDate; exit;
            $startDate  = strtotime($startDate->format('d-m-Y'));
           
            // $startDate = strtotime("1-" . $startMonth . "-" . date("Y"));
            $endDate    = new DateTime("1-" . ($startMonth == 1 ? 12 : $startMonth - 1) . "-" . ($startMonth == 1 ? $yearEnd : $yearEnd + 1));
            $endDate->modify('last day of this month');
            $endDate   = strtotime($endDate->format('d-m-Y'));
            // echo $startDate . " - " . $endDate;exit;

            if($period == '2')
            {
                $year2 = date("Y");

                $startDate2  = new DateTime("1-" . $startMonth . "-" .$year2);
                $startDate2  = strtotime($startDate2->format('d-m-Y'));
                
                $endDate2    = new DateTime("1-" . ($startMonth == 1 ? 12 : $startMonth - 1) . "-" . ($startMonth == 1 ? $year2 : $year2 + 1));
                $endDate2->modify('last day of this month');
                $endDate2   = strtotime($endDate2->format('d-m-Y'));
            }
            else{
                $startDate2  = $startDate;
                $endDate2   = $endDate;
            }

        }
        if (empty($startDate) || empty($endDate)){
            $response['ack'] = 2;
            $response['error'] = "Please set Financial Year in Company settings.";
            $response['response'][] = array();
            return $response;
        }
        // echo $startDate. " - ".$endDate;exit;

        $Sql = "SELECT ho.*, 
                        (SELECT SUM(total_holiday) 
                         FROM hr_holidays 
                         WHERE  status=1 AND emp_id='$attr[employee_id]' AND holiday_nature=2 AND
                                (((FLOOR(holiday_date_from/86400)*86400) >= $startDate2 AND (FLOOR(holiday_date_from/86400)*86400) <= $endDate2) OR
                                 ((FLOOR(holiday_date_to/86400)*86400) >= $startDate2 AND (FLOOR(holiday_date_to/86400)*86400) <= $endDate2))) as sick_leaves,
                        (SELECT SUM(total_holiday) 
                         FROM hr_holidays 
                         WHERE  status=1 AND emp_id='$attr[employee_id]' AND holiday_nature=3 AND
                                (((FLOOR(holiday_date_from/86400)*86400) >= $startDate2 AND (FLOOR(holiday_date_from/86400)*86400) <= $endDate2) OR
                                 ((FLOOR(holiday_date_to/86400)*86400) >= $startDate2 AND (FLOOR(holiday_date_to/86400)*86400) <= $endDate2))) as other_leaves,
                        COALESCE((SELECT ah.status 
                                FROM approval_history AS ah 
                                WHERE  ah.object_id = ho.id AND
                                        (ah.type = 6 OR ah.type = 9) AND
                                        ah.company_id = ho.company_id
                                ORDER BY ah.id DESC LIMIT 1),-1) as approvalStatus
                FROM hr_holidays as ho
                WHERE  ho.status=1 AND ho.holidayStatus <>6 AND ho.emp_id='$attr[employee_id]' AND ho.company_id=" . $this->arrUser['company_id'] ." ";
       // echo '<pre>'. $Sql;exit;
        // left JOIN company on company.id=ho.company_id 
        //$Sql .= $limit_clause;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $order_type = "order by ho.id desc";
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ho', $order_type);
        //echo $response['q'];exit;

        // $RS = $this->objsetup->CSI($response['q']);
        if ($attr['employee_id'] == $this->arrUser['id']){
            $RS = $this->objsetup->CSI($response['q']);
        }
        else{
            $RS = $this->objsetup->CSI($response['q'], "HR_holidayTab", sr_ViewPermission);
        }
        $response['q'] = '';
        $response['totalAvailed'] = 0;
        $response['totalBooked'] = 0;

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $totalDay = 0;
                $day = 0;
                $result = array();
                $result['id'] = $Row['id'];
                $result['Holiday No.'] = $Row['holiday_code'];

                if ($Row['holidayYear'] == '2') {
                    $result['Holiday Year'] = "Next Year";
                }
                else{
                    $result['Holiday Year'] = "Current Year";
                } 

                if ($Row['holiday_nature'] == '1') {
                    $result['holiday type'] = "Annual Leave";
                }
                if ($Row['holiday_nature'] == '2') {
                    $result['holiday type'] = "Sick Leave";
                }
                if ($Row['holiday_nature'] == '3') {
                    $result['holiday type'] = "Other Leave";
                }

                $result['date_from'] = $this->objGeneral->convert_unix_into_date($Row['holiday_date_from']);
                $result['date_to'] = $this->objGeneral->convert_unix_into_date($Row['holiday_date_to']);

                if (($Row['holiday_date_from'] >= $startDate && $Row['holiday_date_to'] <= $endDate) || $Row['holidayYear'] == '2'){
                    // $result['current_year'] = "Yes";
                }
                else{
                    // $result['current_year'] = "No";
                    continue;
                }
                if ($Row['holiday_date_to'] < current_date) {
                    /* $holidayTo=date('Y-m-d',$Row['holiday_date_from']);
                      $holidayFrom=date('Y-m-d',$Row['holiday_date_to']);
                      $date1=date_create($holidayTo);
                      $date2=date_create($holidayFrom);
                      $diff=date_diff($date1,$date2); */
                    $totalDay = $Row['total_holiday'];
                    $result['passed'] = "Yes";
                }
                else{
                    $result['passed'] = "No";
                }

                if((FLOOR($Row['holiday_date_to']/86400)*86400) >= $startDate2 && (FLOOR($Row['holiday_date_to']/86400)*86400) <= current_date && 
                    $Row['holiday_nature'] == '1' && $Row['holidayStatus'] != '3' && $result['Holiday Year'] == "Current Year"){

                    $response['totalAvailed'] += $Row['total_holiday'];
                }

                if((FLOOR($Row['holiday_date_to']/86400)*86400) > current_date && 
                    $Row['holiday_nature'] == '1' && $Row['holidayStatus'] != '3' && $result['Holiday Year'] == "Current Year"){

                    $response['totalBooked'] += $Row['total_holiday'];//(FLOOR($Row['holiday_date_to']/86400)*86400) <= $endDate2 && 
                }
                
                if ($Row['holiday_date_from'] <= current_date && $Row['holiday_date_to'] >= current_date) {
                    //if($Row['holiday_date_from']==current_date){

                    $holidayFrom = date('Y-m-d', $Row['holiday_date_from']);
                    $holidayTo = date('Y-m-d', current_date);
                    $date1 = date_create($holidayFrom);
                    $date2 = date_create($holidayTo);
                    $diff = date_diff($date1, $date2);
                    $totalDay = ($diff->days + 1);
                    $weekendCount = 0;
                    // for ($date = $date2; $date <= $date1; $date->modify('+1 day')) {
                    //     //echo $date->format('l') . "\n";
                    //     $dayName = $date->format('l');
                    //     if ($dayName == "Saturday")
                    //         $weekendCount = $weekendCount + 1;
                    //     if ($dayName == "Sunday")
                    //         $weekendCount = $weekendCount + 1;
                    // }
                    $totalDay = $totalDay - $weekendCount;

                    //}
                    //if($Row['holiday_date_from'] > current_date){
                    /* $holidayTo=date('Y-m-d',$Row['holiday_date_to']);
                      $holidayFrom=date('Y-m-d',$Row['holiday_date_from']);
                      $date1=date_create($holidayTo);
                      $date2=date_create($holidayFrom);
                      $diff=date_diff($date1,$date2); */
                    //$totalDay=0;
                    //}
                }
                
                //$result['used'] = $totalDay;
                $result['No. of Days'] = $Row['total_holiday'];
                //$result['booked'] = $Row['holiday_booked'];
                //$result['Remaining'] = $Row['remaining_holidays'];
                // $result['Remaining'] = $Row['total_holiday'] - $totalDay;

                // {value: "1", name: "Queued For Approval"},
                // {value: "2", name: "Approved"},
                // {value: "3", name: "Disapproved"}

                if($Row['approvalStatus'] == -1)
                    $holidayStatus = -1;
                else if($Row['approvalStatus'] == 1 && $Row['holidayStatus']==0)
                    $holidayStatus = 1;
                else
                    $holidayStatus = $Row['holidayStatus'];

                if ($holidayStatus == '-1'){
                    $holidayStatus = "In Progress";
                }
                elseif ($holidayStatus == '0'){
                    $holidayStatus = "Queued For Approval";
                }
                else if ($holidayStatus == '1'){
                    $holidayStatus = "Awaiting Approval";
                }
                else if ($holidayStatus == '2'){
                    $holidayStatus = "Approved";
                }
                else if ($holidayStatus == '3'){
                    $holidayStatus = "Disapproved";
                } elseif ($holidayStatus == '4'){
                    $holidayStatus = "Queued For Cancellation";
                }
                else if ($holidayStatus == '5'){
                    $holidayStatus = "Awaiting Cancellation";
                }
                else if ($holidayStatus == '6'){
                    $holidayStatus = "Cancelled";
                }               
                
                $result['Status'] = $holidayStatus;
                $result['leaves'] = array('sick_leaves'=>$Row['sick_leaves'],'other_leaves'=>$Row['other_leaves']);

                //$result['description'] = $Row['holiday_description'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }


        return $response;
    }

    function get_holiday_detail($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        // $dateResult = $dateResult->FetchRow();
        //$startDate = $dateResult['year_start_date'];
        // $endDate = $dateResult['year_end_date'];

        $financialDateQueryMonth = "SELECT holiday_start_month 
                                    FROM company 
                                    WHERE id = '".$this->arrUser['company_id']."'";

        $dateResultMonth = $this->objsetup->CSI($financialDateQueryMonth);
        $dateResultMonth = $dateResultMonth->FetchRow();          
        $startMonth = $dateResultMonth['holiday_start_month'];

        $year=date("Y");
        
        $startDate  = new DateTime("1-" . $startMonth . "-" .$year);
        $tempStartDate = $startDate;
        //echo "1-" . $startMonth . "-" .$year."  -  startDate".$startDate; exit;
        $startDate  = strtotime($startDate->format('d-m-Y'));
        
        // $startDate = strtotime("1-" . $startMonth . "-" . date("Y"));
        $endDate    = new DateTime("1-" . ($startMonth == 1 ? 12 : $startMonth - 1) . "-" . ($startMonth == 1 ? $year : $year + 1));
        $endDate->modify('last day of this month');
        $tempEndDate = $endDate;
        $endDate   = strtotime($endDate->format('d-m-Y'));

        if (empty($startDate) || empty($endDate)){
            $response['ack'] = 2;
            $response['error'] = "Please set holiday start month in settings.";
            $response['response'][] = array();
            return $response;
        }

        $response['startDate'] = $tempStartDate->format('d-m-Y');
        $response['endDate'] = $tempEndDate->format('d-m-Y');

        $SqlTotal = "SELECT SUM(total_holiday) as totalHoliday 
                     FROM hr_holidays 
                     WHERE  status='1' AND holiday_type='1' AND 
                            holiday_date_to BETWEEN $startDate AND $endDate AND 
                            holidayStatus<>'3' AND 
                            emp_id='" . $attr['employee_id'] . "'";

        $RSTotal = $this->objsetup->CSI($SqlTotal);
        $RowTotal = $RSTotal->FetchRow();
        $total = $RowTotal['totalHoliday'];
        //echo $total;exit;
        //echo $SqlTotal; exit;

        $Sql = "SELECT total_holiday,holiday_date_to,holiday_date_from  
                FROM hr_holidays 
                WHERE   status='1' AND holidayYear <>2 AND holiday_type='1' AND 
                        holiday_date_to BETWEEN $startDate AND $endDate AND 
                        holidayStatus<>'3' AND 
                        emp_id='" . $attr['employee_id'] . "' AND 
                        holiday_nature=1";
        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $totalDay = 0;
            $day = 0;
            $weekendCount = 0;

            while ($Row = $RS->FetchRow()) {

                $totalDay += $Row['total_holiday'];
            }
            $response['used'] = $totalDay;
        }

        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['response'] = $totalDay;
        return $response;
    }

    function get_holidayStartEndDateLimitsByYear($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $holidayYearID = $attr['holidayYearID'];

        $financialDateQueryMonth = "SELECT holiday_start_month 
                                    FROM company 
                                    WHERE id = '".$this->arrUser['company_id']."'";

        $dateResultMonth = $this->objsetup->CSI($financialDateQueryMonth);
        $dateResultMonth = $dateResultMonth->FetchRow();          
        $startMonth = $dateResultMonth['holiday_start_month'];

        $year=date("Y");

        if($holidayYearID == 2)
            $year = $year+1;
        
        $startDate  = new DateTime("1-" . $startMonth . "-" .$year);
        $tempStartDate = $startDate;
        //echo "1-" . $startMonth . "-" .$year."  -  startDate".$startDate; exit;
        $startDate  = strtotime($startDate->format('d-m-Y'));

        $endDate    = new DateTime("1-" . ($startMonth == 1 ? 12 : $startMonth - 1) . "-" . ($startMonth == 1 ? $year : $year + 1));
        $endDate->modify('last day of this month');
        $tempEndDate = $endDate;
        $endDate   = strtotime($endDate->format('d-m-Y'));

        if (empty($startDate) || empty($endDate)){
            $response['ack'] = 2;
            $response['error'] = "Please set holiday start month in settings.";
            $response['response'][] = array();
            return $response;
        }

        $response['startDate'] = $tempStartDate->format('d-m-Y');
        $response['endDate'] = $tempEndDate->format('d-m-Y');

        $SqlNextYear = "SELECT SUM(total_holiday) as  totalHoliday
                        FROM hr_holidays 
                        WHERE   status='1' AND 
                                holiday_type='1' AND 
                                holidayStatus<>'3' AND 
                                holidayYear = 2 AND 
                                emp_id='" . $attr['employee_id'] . "' AND 
                                holiday_nature=1";
        //echo $SqlNextYear; exit;
        $RSNextYear = $this->objsetup->CSI($SqlNextYear);

        if ($RSNextYear->RecordCount() > 0) {

            $RSNextYear->fields['totalHoliday'];
            $response['nextYeartotalHoliday'] = $RSNextYear->fields['totalHoliday'];
        }
        else{
            $response['nextYeartotalHoliday'] = 0;
        }

        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['response'] = $totalDay;
        return $response;
    }

    function holiday_data_by_id($attr)
    {
        $financialDateQuery = "SELECT holiday_start_month FROM company where id = '".$this->arrUser['company_id']."'";
        $dateResult = $this->objsetup->CSI($financialDateQuery);

        $dateResult = $dateResult->FetchRow();
        $startMonth = $dateResult['holiday_start_month'];

        $year=date("Y");
        
        $startDate  = new DateTime("1-" . $startMonth . "-" .$year);
        $startDate  = strtotime($startDate->format('d-m-Y'));

        $endDate    = new DateTime("1-" . ($startMonth == 1 ? 12 : $startMonth - 1) . "-" . ($startMonth == 1 ? $year : $year + 1));
        $endDate->modify('last day of this month');
        $endDate   = strtotime($endDate->format('d-m-Y'));

        $currentRecTotalHoliday = 0;

        $Sql = "SELECT *
				FROM hr_holidays
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            if ($Row['holiday_date_to'] > $startDate && $Row['holiday_date_from'] < $endDate){
                $Row['current_year'] = "Yes";
            }
            else{
                $Row['current_year'] = "No";
            }

            $Row['holiday_date_from'] = $this->objGeneral->convert_unix_into_date($Row['holiday_date_from']);

            if ($Row['holiday_date_to'] < current_date) {
                $passed = "Yes";
            }
            else{
                $passed = "No";
            }
            
            $Row['holiday_date_to'] = $this->objGeneral->convert_unix_into_date($Row['holiday_date_to']);
            $temp_attr['object_id'] =  $Row['id'];
            $temp_attr['type'] =  6;
            
            $approval_status = $this->objsetup->get_approval_status($temp_attr);
            $counterStatus = count($approval_status['response']);
            //echo $counterStatus;exit;
            //echo $approval_status['response'][$counterStatus-1]['status'];exit;
            if($approval_status['response'][$counterStatus-1]['status'] == 1 && $Row['holidayStatus']==0)
                    $Row['holidayStatus'] = 1;
           
            $currentRecTotalHoliday =  $Row['total_holiday'];

            $response['response'] = $Row;
            $response['response']['startDate'] = date("d-m-Y",$startDate);
            $response['response']['endDate'] = date("d-m-Y",$endDate);
            $response['response']['approval_status'] = $approval_status;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } 
        else {
            $response['response'] = array();
        }

        $SqlTotal = "SELECT SUM(total_holiday) as totalHoliday 
                     FROM hr_holidays 
                     WHERE  holidayStatus <>'3' AND 
                            holiday_date_to BETWEEN $startDate AND $endDate AND 
                            status='1' AND
                            holiday_nature=1  AND 
                            emp_id='" . $attr['employee_id'] . "'";

        //echo $SqlTotal;exit;

        $RSTotal = $this->objsetup->CSI($SqlTotal);
        $RowTotal = $RSTotal->FetchRow();
        $total = $RowTotal['totalHoliday'];

        $SqlNextYear = "SELECT SUM(total_holiday) as  totalHoliday
                        FROM hr_holidays 
                        WHERE   status='1' AND 
                                holiday_type='1' AND 
                                holidayStatus<>'3' AND 
                                holidayYear = 2 AND 
                                emp_id='" . $attr['employee_id'] . "' AND 
                                holiday_nature=1";
        //echo $SqlNextYear; exit;
        $RSNextYear = $this->objsetup->CSI($SqlNextYear);

        if ($RSNextYear->RecordCount() > 0) {

            $RSNextYear->fields['totalHoliday'];
            $response['nextYeartotalHoliday'] = $RSNextYear->fields['totalHoliday'] - $currentRecTotalHoliday;
        }
        else{
            $response['nextYeartotalHoliday'] = 0;
        }

        $SqlA = "SELECT CONCAT(first_name,' ',last_name) AS empName,user_code AS empCode,entitle_holiday AS empEntitleHoliday 
                 FROM employees 
                 WHERE id='" . $attr['employee_id'] . "' 
                 LIMIT 1";
        // echo $SqlA;exit;
        $RSA = $this->objsetup->CSI($SqlA);

        if ($RSA->RecordCount() > 0) {
            $RowA = $RSA->FetchRow();
            foreach ($RowA as $key => $value) {
                if (is_numeric($key))
                    unset($RowA[$key]);
            }

            $response['empName'] = $RowA['empName'];
            $response['empCode'] = $RowA['empCode'];
            $response['empEntitleHoliday'] = $RowA['empEntitleHoliday'];
        }

        $response['response']['used'] = $total;
        $response['response']['passed'] = $passed;
        return $response;
    }

    function delete_holiday_by_id($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        $Sql = "UPDATE hr_holidays
                            SET  
                                status=0
                WHERE id = ".$arr_attr['id']." 
                Limit 1";
        //echo $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "HR_holidayTab", sr_DeletePermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record already changed!';
        }

        return $response;
    }
    

    //--------------------Fuel Cost deduction---------------------
    function add_deduction($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $data_pass = "  tst.emp_id='" . $attr['employee_id'] . "',
                        tst.start_miles='" . $attr['start_miles'] . "',
                        tst.end_miles='" . $attr['end_miles'] . "'  ";

        $total = $this->objGeneral->count_duplicate_in_sql('hr_fuel_cost_deduction', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $SQL = "INSERT INTO hr_fuel_cost_deduction 
                                            SET 
                                                emp_id='" . $attr['employee_id'] . "', 
                                                start_miles='" . $attr['start_miles'] . "', 
                                                end_miles='" . $attr['end_miles'] . "',
                                                fcd_no='" . $attr['fcd_no'] . "',
                                                fcd_code='" . $attr['fcd_code'] . "',
                                                engine_type='" . $attr['engine_types'] . "',
                                                fuel_type='" . $attr['fuel_types'] . "',
                                                status='1',
                                                user_id='" . $this->arrUser['id'] . "',
                                                company_id='" . $this->arrUser['company_id'] . "'";
        //echo $SQL; exit;
        $RSProducts = $this->objsetup->CSI($SQL);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = "Record saved successfully";
            $response['response'] = array();
        } else {
            $response['ack'] = 0;
            $response['error'] = "Record Not Saved";
            $response['response'] = array();
        }

        return $response;
    }

    function update_deduction($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '".$attr['id']."' ";

        $data_pass = "   tst.emp_id='" . $attr['employee_id'] . "',
                         tst.start_miles='" . $attr['start_miles'] . "',
                         tst.end_miles='" . $attr['end_miles'] . "' $where_id";

        $total = $this->objGeneral->count_duplicate_in_sql('hr_fuel_cost_deduction', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $SQL = "UPDATE  hr_fuel_cost_deduction 
                                        SET 
                                            start_miles='" . $attr['start_miles'] . "', 
                                            end_miles='" . $attr['end_miles'] . "',
                                            engine_type='" . $attr['engine_types'] . "',
                                            fuel_type='" . $attr['fuel_types'] . "'
                where id='" . $attr['id'] . "'";
        // echo $SQL; exit;
        $RSProducts = $this->objsetup->CSI($SQL);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = "Record has been Updated";
            $response['response'] = array();
        } else {
            $response['ack'] = 0;
            $response['error'] = "Record Not Saved";
            $response['response'] = array();
        }

        return $response;
    }

    function deduction_data_by_id($attr)
    {
        $Sql = "SELECT *
				FROM hr_fuel_cost_deduction
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
        }
        return $response;
    }

    function deduction_listing($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT de.*
                FROM hr_fuel_cost_deduction as de
                left JOIN company on company.id=de.company_id 
                WHERE  de.status=1 AND de.emp_id='$attr[employee_id]' AND 
                        (de.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                order by de.id desc";

        $Sql .= $limit_clause;
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {

                $result = array();
                $result['id'] = $Row['id'];
                $result['fcd_code'] = $Row['fcd_code'];
                $result['start_miles'] = $Row['start_miles'];
                $result['end_miles'] = $Row['end_miles'];
                if ($Row['engine_type'] == 1)
                    $result['engine_type'] = '1400cc or less';
                if ($Row['engine_type'] == 2)
                    $result['engine_type'] = '1401cc to 2000cc';
                if ($Row['engine_type'] == 3)
                    $result['engine_type'] = '1600cc or less';
                if ($Row['engine_type'] == 4)
                    $result['engine_type'] = '1601cc to 2000cc';
                if ($Row['engine_type'] == 5)
                    $result['engine_type'] = 'Over 2000cc';

                if ($Row['fuel_type'] == 1)
                    $result['fuel_type'] = 'Petrol';
                if ($Row['fuel_type'] == 2)
                    $result['fuel_type'] = 'Diesel';
                if ($Row['fuel_type'] == 3)
                    $result['fuel_type'] = 'LPG';
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function update_hr_deduction($arr_attr, $input)
    {
        $expence_id = "";
        $tab_change = $lastExpenseID = "";
        $counter_copy = 0;

        foreach ($input as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id")
                $employee_id = $val;
        }

        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;
        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $new = 'Add';
        $new_msg = 'Inserted';

        $fcd_id = $arr_attr->deduction_id;

        $Sqld = "DELETE FROM hr_fuel_cost_deduction_detail WHERE expense_id = $expence_id";
        $RS = $this->objsetup->CSI($Sqld);

        $Sql = "INSERT INTO hr_fuel_cost_deduction_detail (date_of_travel,description, postcodeFrom, postcodeTo, miles,actual_miles,mileage_rate,amount,fcd_id,employee_id,status,sort_id,company_id,user_id,date_added,comment) VALUES ";

        foreach ($arr_attr->data as $key => $row) {
            if ($row->fmiles != '') {

                $Sql .= "(  '" . $this->objGeneral->convert_date($row->fdate_of_travel) . "', '" . $row->fdescription . "','" . $row->fpostcodeFrom . "','" . $row->fpostcodeTo . "','" . $row->fmiles . "','" . $row->factual_miles . "','" . $row->fmileage_rate . "','" . $row->fmileage_rate * $row->factual_miles . "','" . $fcd_id . "','" . $employee_id . "','1','" . $row->sort_id . "','" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "',
                '" . current_date . "','" . $row->fcomment . "')  , ";
            }
        }
        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        // echo $Sql; exit; 
        $RS = $this->objsetup->CSI($Sql);

        $message = "Record  $new_msg Successfully. ";

        if ($employee_id > 0) {
            $response['employee_id'] = $employee_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $message;
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
            $response['last_expense_id'] = $lastExpenseID;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = $message;
        }

        return $response;
    }

    ############	Start: HR of department  ######

    function get_hr_department($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT   c.id, c.name,department_category.title  as typename 
            FROM  departments  c  
            left JOIN company on company.id=c.company_id    left JOIN department_category on department_category.id=c.type  where  c.status=1  and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	 group  by  c.name "; //c.user_id=".$this->arrUser['id']."  

        $RS = $this->objsetup->CSI($Sql, "human_resource", sr_ViewPermission);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['type'] = $Row['typename'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['bucketFail'] = 1;
        }
        return $response;
    }

    function get_hr_department_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT   c.id, c.name FROM  departments  c  left JOIN company on company.id=c.company_id 
		where  c.status=1   c.id='".$attr['id']."'  limit 1 "; //c.user_id=".$this->arrUser['id']."   
        $RS = $this->objsetup->CSI($Sql,"human_resource", sr_ViewPermission);

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
        //print_r($response);exit;
        return $response;
    }

    function get_hr_department_by_employee($attr)
    {
        // written by Ahmad
        // $attr should contain 2 params
        // employee ID
        // company ID
        if (!$attr->employee_id){
            return;
        }
        $Sql = "SELECT department_id FROM hr_selected_departments WHERE hr_id=" . $attr->employee_id . " AND company_id=" . $this->arrUser['company_id'];
         //c.user_id=".$this->arrUser['id']." 
        //echo $Sql;exit;  
        $RS = $this->objsetup->CSI($Sql);
        $departments = [];
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                array_push($departments, $Row[0]);
                
            }
            $departments = implode(",", $departments);
        }
        $response['response'] = $departments;
        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function get_all_hr_department($attr)
    {

        $Sql = "SELECT   c.id, c.name FROM  departments  c where  c.status=1  and c.company_id=" . $this->arrUser['company_id'] . " group  by  c.name "; //c.user_id=".$this->arrUser['id']."  

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function add_hr_department($arr_attrs)
    {

        //	$this->objGeneral->mysql_clean($arr_attrs);
        $arr_attr = array();
        foreach ($arr_attrs as $key => $val) {
            $arr_attr[$key] = $val;
        }

        $this->objGeneral->mysql_clean($arr_attr);


        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "    tst.name='" . $arr_attr['name'] . "'  $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('departments', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }


        $id = $arr_attr['id'];
        if ($id == 0) {


            $Sql = "INSERT INTO config_departments SET   name='".$arr_attr['name']."', status='$arr_attr[statuss]',
		code='$arr_attr[code]',  company_id='" . $this->arrUser['company_id'] . "',
		user_id='" . $this->arrUser['id'] . "'";
        } else {


            $Sql = "UPDATE config_departments SET  name='".$arr_attr['name']."', code='$arr_attr[code]',
		 status='$arr_attr[statuss]' 	WHERE id = ".$arr_attr['id']." Limit 1 ";
        }

        //echo $Sql;exit;
        $rs = $this->objsetup->CSI($Sql, "human_resource", sr_ViewPermission);
        $lastInsertid = $this->Conn->Insert_ID();

        if ($this->Conn->Affected_Rows() > 0) {
            // $this->insertDepartmentWidgets($lastInsertid);
            $response['ack'] = 1;
            $response['error'] = NULL;
            return $response;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'error';
            return $response;
        }
    }

    function insertDepartmentWidgets($id)
    {
        $Sql = "SELECT id FROM widgets;";
		// echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);
		// print_r($RS->RecordCount());exit;
		if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
				foreach ($Row as $key => $value) {
					if (is_numeric($key))
					unset($Row[$key]);
				}
				$ids[] = $Row['id'];
			}
            // print_r($ids);exit;

            foreach ($ids as $key => $value){
                // print_r($value);
                $Sql2 = "INSERT INTO widgetdepartment SET widget_id=".$value.",  department_id=".$id.",permission=0, company_id=".$this->arrUser['company_id'].";";
                // echo $Sql2;
                $RS = $this->objsetup->CSI($Sql2);
            }
        }
    }

    function delete_hr_department($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        // $Sql = "DELETE FROM config_departments WHERE id = ".$arr_attr['id']."";
        $Sql = "DELETE FROM config_departments WHERE id = ".$arr_attr['id']." AND SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 26,0) = 'success' ";
            // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql, "human_resource", sr_ViewPermission);

        if ($this->Conn->Affected_Rows() > 0) {
            /* $Sql2 = "DELETE FROM widgetdepartment WHERE department_id = ".$arr_attr['id'].";";
            // echo $Sql2;exit;            
            $RS2 = $this->objsetup->CSI($Sql2); */
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 2;
            $response['error'] = 'Record cannot be deleted.';
        }
        
        // else {
        //     $response['ack'] = 0;
        //     $response['error'] = 'Record already changed!';
        // }


        return $response;
    }

    ############	Start: HR of religion  ######

    function get_hr_religion($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT   c.id, c.name,c.code FROM  employee_religion  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1 
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		group by  c.name "; //c.user_id=".$this->arrUser['id']." 


        $Sql .= $limit_clause;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['code'];
                $result['name'] = $Row['name'];
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

    function get_hr_religion_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
		FROM employee_religion 
		where    employee_religion.id='".$attr['id']."'";

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

    function get_all_hr_religion($attr)
    {

        $Sql = "SELECT   c.id, c.name, c.code FROM  employee_religion  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1 
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		group by  c.name "; //c.user_id=".$this->arrUser['id']." 
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function add_hr_religion($arr_attrs)
    {

        $arr_attr = array();
        foreach ($arr_attrs as $key => $val) {
            $arr_attr[$key] = $val;
        }


        $id = $arr_attr['id'];


        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "    tst.name='" . $arr_attr['name'] . "'  $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('employee_religion', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }


        if ($id == 0) {

            $Sql = "INSERT INTO employee_religion
										SET  
										name='".$arr_attr['name']."',
										status=1,
										code='$arr_attr[code]', 
										company_id='" . $this->arrUser['company_id'] . "',
										user_id='" . $this->arrUser['id'] . "'";
        } else {

            $Sql = "UPDATE employee_religion
							SET 
							name='".$arr_attr['name']."',
							code='$arr_attr[code]' 
							WHERE id = ".$arr_attr['id']." Limit 1 ";
        }

        $rs = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            return $response;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'error';
            return $response;
        }
    }

    function delete_hr_religion($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE employee_religion
			SET  
			status=0
			WHERE id = ".$arr_attr['id']." Limit 1";
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record already changed!';
        }


        return $response;
    }

    function get_religion_type_list($attr)
    {

        $Sql = "SELECT   c.id, c.name, c.code FROM  employee_religion  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1 
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		group by  c.name "; //c.user_id=".$this->arrUser['id']." 
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    ############	 HR of employee type  ######

    function get_hr_employee_type($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();


        $Sql = "SELECT   c.id, c.name,c.code FROM  employee_type  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1 
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		group  by  c.name "; //c.user_id=".$this->arrUser['id']." 


        $Sql .= $limit_clause;
        if ($attr['fromSetup']) {
            $RS = $this->objsetup->CSI($Sql,'human_resource',sr_ViewPermission);
        }
        else {
            $RS = $this->objsetup->CSI($Sql);

        } 


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                // $result['code'] = $Row['code'];
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

    function get_hr_employee_type_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT *
		FROM employee_type 
		where    employee_type.id='".$attr['id']."' and company_id = " . $this->arrUser['company_id'] . "
		LIMIT 1";

        if ($attr['fromSetup']) {
            $RS = $this->objsetup->CSI($Sql,'human_resource',sr_ViewPermission);
        }
        else {
            $RS = $this->objsetup->CSI($Sql);
        } 

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
            $response['bucketFail'] = 1;
        }
        return $response;
    }

    function get_all_hr_employee_type($attr)
    {

        $Sql = "SELECT   c.id, c.name,c.code FROM  employee_type  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1 
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		group  by  c.name "; //c.user_id=".$this->arrUser['id']." 


        $RS = $this->objsetup->CSI($Sql, "human_resource", sr_ViewPermission);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function add_hr_employee_type($arr_attrs)
    {
        $arr_attr = array();

        foreach ($arr_attrs as $key => $val) {
            $arr_attr[$key] = $val;
        }

        $this->objGeneral->mysql_clean($arr_attr);

        $id = $arr_attr['id'];


        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "    tst.name='" . $arr_attr['name'] . "'  $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('employee_type', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($id == 0) {

            $Sql = "INSERT INTO employee_type
										SET  
										name='".$arr_attr['name']."',
										status=1,
										code='$arr_attr[code]', 
										company_id='" . $this->arrUser['company_id'] . "',
										user_id='" . $this->arrUser['id'] . "'";
        } else {
            $Sql = "UPDATE employee_type
							SET 
							name='".$arr_attr['name']."',
							code='$arr_attr[code]' 
							WHERE id = ".$arr_attr['id']." and company_id = " . $this->arrUser['company_id'] . " Limit 1  ";
        }
        //	echo $Sql;exit;
        $rs = $this->objsetup->CSI($Sql, "human_resource", sr_ViewPermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            return $response;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'error';
            return $response;
        }
    }

    function submit_emp_inactive_type_form($arr_attrs)
    {
        $arr_attr = array();

        foreach ($arr_attrs as $key => $val) {
            $arr_attr[$key] = $val;
        }

        $id = $arr_attr['id'];

        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "    tst.name='" . $arr_attr['name'] . "'  $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('employee_cases_of_inactivity', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($id == 0) {


            $Sql = "INSERT INTO employee_cases_of_inactivity
										SET
										name='".$arr_attr['name']."',
										status=1,
										company_id='" . $this->arrUser['company_id'] . "',
										user_id='" . $this->arrUser['id'] . "'";
        } else {
            $Sql = "UPDATE employee_cases_of_inactivity
							SET
							name='".$arr_attr['name']."',
							WHERE id = ".$arr_attr['id']." Limit 1 ";
        }
        //	echo $Sql;exit;
        $rs = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            return $response;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'error';
            return $response;
        }
    }

    function submit_emp_leaving_reason_form($arr_attrs)
    {
        $arr_attr = array();

        foreach ($arr_attrs as $key => $val) {
            $arr_attr[$key] = $val;
        }

        $id = $arr_attr['id'];

        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "    tst.name='" . $arr_attr['name'] . "'  $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('employee_reason_of_leaving', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        if ($id == 0) {


            $Sql = "INSERT INTO employee_reason_of_leaving
										SET
										name='".$arr_attr['name']."',
										status=1,
										company_id='" . $this->arrUser['company_id'] . "',
										user_id='" . $this->arrUser['id'] . "'";
        } else {
            $Sql = "UPDATE employee_reason_of_leaving
							SET
							name='".$arr_attr['name']."',
							WHERE id = ".$arr_attr['id']." Limit 1 ";
        }
        //	echo $Sql;exit;
        $rs = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            return $response;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'error';
            return $response;
        }
    }

    function delete_hr_employee_type($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE employee_type
			SET  
			status=0
            WHERE id = ".$arr_attr['id']." AND SR_CheckTransactionBeforeDelete(".$arr_attr['id'].", ".$this->arrUser['company_id'].", 27,0) = 'success' Limit 1";
            
            // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql, "human_resource", sr_ViewPermission);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else  {
            $response['ack'] = 2;
            $response['error'] = 'Record cannot be deleted.';
        }


        return $response;
    }

    function get_emp_type_list($attr)
    {
        $Sql = "SELECT   c.id, c.name,c.code FROM  employee_type  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1 
		and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		group  by  c.name "; //c.user_id=".$this->arrUser['id']." 

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                //$result['code'] = $Row['code'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_employee_leaving_reasons()
    {

        $Sql = "SELECT   c.id, c.name FROM  employee_reason_of_leaving  c
                    left JOIN company on company.id=c.company_id
                    where  c.status=1
                    and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                    group  by  c.id ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_employee_inactive_type($attr)
    {

        $Sql = "SELECT   c.id, c.name  FROM  cause_of_inactivity  c
                    left JOIN company on company.id=c.company_id
                    where  c.status=1
                    and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                    group  by  c.id ";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    ############	countries   ######

    function get_countries($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT   c.id, LCASE(c.name) as n, c.iso,c.country_account_type  FROM  country  c
		where  c.status=1  		
		group  by  c.name ASC ";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = ucwords($Row['n']);
                $result['code'] = $Row['iso'];
                $result['country_account_type'] = $Row['country_account_type'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        //print_r($response);exit;
        return $response;
    }

    function add_countries($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];

        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "    tst.name='" . strtoupper($arr_attr['name']) . "'  $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('employee_type', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }


        if ($id == 0) {

            $Sql = "INSERT INTO country SET
									name='" . strtoupper($arr_attr['name']) . "' 
									,status=1
									,company_id='" . $this->arrUser['company_id'] . "'
									,user_id='" . $this->arrUser['id'] . "'	";
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        } else {
            $Sql = "UPDATE country SET  
									name='" . strtoupper($arr_attr['name']) . "'
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

    function get_all_employee_purchase_code($attr)
    {

        $response2 = array();
        $response = array();
        $Sql = "SELECT  em.*
                from srm_purchase_code_emp as em
                left JOIN company on company.id=em.company_id 
                where (em.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                    AND em.srm_id ='".$attr['id']."'
                ORDER BY em.id DESC";
                    //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $selected = array();

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $selected[] = $Row['id'];
                $result['id'] = $Row['id'];
                $result['srm_id'] = $Row['srm_id'];
                $result['emp_id'] = $Row['emp_id'];

                $response2['response_selected'][] = $result;
            }
        }
        //print_r($response2['response_selected']);exit;
        $limit_clause = $where_clause = "";

        if ($attr[edit_id] == 2) {
            $where_clause .= "  and (NOT EXISTS (SELECT srm_purchase_code_emp.emp_id FROM srm_purchase_code_emp where 
       		 srm_purchase_code_emp.emp_id= emp.id)) ";
        }

        if (!empty($attr['searchKeyword'])) {
            $val = intval(preg_replace("/[^0-9]/", '', $attr['searchKeyword']));

            if ($val != 0)
                $where_clause .= " AND  emp.user_code LIKE '%$val%'  ";
            else
                $where_clause .= " AND (emp.first_name LIKE '%" . $attr['searchKeyword'] . "%' OR emp.last_name LIKE '%" . $attr['searchKeyword'] . "%')";
        }

        if (!empty($attr['departments']) && $attr['departments'] > 0)
            $where_clause .= " And emp.department ='" . $attr['departments'] . "'";
        if (!empty($attr['employee_types']) && $attr['employee_types'] > 0)
            $where_clause .= " And emp.employee_type ='" . $attr['employee_types'] . "'";
        if (!empty($attr['searchBox']))
            $where_clause .= " AND (emp.first_name LIKE '%" . $attr['searchBox'] . "%' OR emp.last_name LIKE '%" . $attr['searchBox'] . "%' OR emp.user_code LIKE '%" . $attr['searchBox'] . "%')";

        $Sql = "SELECT  emp.id  ,emp.user_code,emp.first_name,emp.last_name,emp.job_title		
		, " . $this->objGeneral->get_nested_query_list('emp_type', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('department', $this->arrUser['company_id']) . "
		from employees as emp
		left JOIN company on company.id=emp.user_company 
		where emp.first_name <> ''AND (emp.user_company=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")"; //	ORDER BY emp.id DESC
        $Sql .= $where_clause;

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'emp');
        //echo $response['q'];exit;		
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        $selected_count = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['user_code'];
                $result['name'] = $Row['first_name'] . ' ' . $Row['last_name'];
                $result['job_title'] = $Row['job_title'];
                $result['department'] = $Row['dname'];
                $result['employee_type'] = $Row['emp_type'];

                /* $value_count=0;
                  foreach ($p_id as $key => $p) {if( $Row['id'] == $p )$value_count++;
                  }
                  $result['checked'] =$value_count;
                 */
                $value_count = 0;
                foreach ($response2['response_selected'] as $key => $m_id) {
                    if ($Row['id'] == $m_id['emp_id']) {
                        $value_count = 1;
                        $selected_count++;
                        $result['checked'] = $value_count;
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

    function add_all_employee_purchase_code($arr_attr)
    {
        // $this->objGeneral->mysql_clean($arr_attr);


        $chk = 0;
        $i = 0;

        $Sqli = "DELETE FROM srm_purchase_code_emp WHERE srm_id = $arr_attr[srm_id]";
        //echo $Sqli;exit;
        $RS = $this->objsetup->CSI($Sqli);
        if ($this->Conn->Affected_Rows() > 0)
            $msg = 'Updated';
        else
            $msg = 'Inserted';

        // print_r($arr_attr);exit;

        $Sql = "INSERT INTO srm_purchase_code_emp (emp_id,srm_id, company_id, user_id,  date_added ,status,AddedBy,AddedOn) VALUES ";

        $emp_ids = explode(",", $arr_attr[emp_id]);

        foreach ($emp_ids as $key => $emp_id) {
            if (is_numeric($emp_id)) {

                $Sql .= "(  '" . $emp_id . "', '" . $arr_attr['srm_id'] . "'
							,'" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "','" . current_date . "'
							,    1 ,'" . $this->arrUser['id'] . "','" . current_date . " )  ";
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

    //status history

    function employee_status_history($attr)
    {
        return; // removing table hr_status from db as it is not being used
    }

    // Last status history

    function employee_last_status_history($attr)
    {
        return; // removing table employee_history from db as it is not being used
    }

    function employee_salary_history($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT salary_history.salary,
                       salary_history.changed_date,
                       salary_history.start_date,
                       salary_history.end_date,
                       employees.first_name as changedby_fname,
                       employees.last_name as changedby_lname,
                       currency.name as currencyname,
                       CASE
                           when salary_history.salary_type = 1 then 'Hourly'
                           when salary_history.salary_type = 2 then 'Weekly'
                           when salary_history.salary_type = 3 then 'Monthly'
                           when salary_history.salary_type = 4 then 'Annual'
                        END as Salary_type

				FROM salary_history
				INNER JOIN employees ON employees.id=salary_history.user_id
				left join currency on currency.id=salary_history.salary_currency_id
				WHERE salary_history.employee_id='".$attr['employee_id']."'
				AND salary_history.company_id='".$attr['company_id']."'";

        /* echo $Sql;
          exit; */

        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['salary'] = $Row['salary'];
                $result['currency'] = $Row['currencyname'];
                $result['salary_type'] = $Row['Salary_type'];
                $result['salary_effective start date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['salary_review end date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $result['changed_on'] = $this->objGeneral->convert_unix_into_date($Row['changed_date']);
                $result['changed_by'] = $Row['changedby_fname'] . " " . $Row['changedby_lname'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    //hr commission history

    function employees_commission_history($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT ech.commission,
                       ech.commission_effective_date,
                       CONCAT(employees.first_name,' ',employees.last_name) AS added_by,
                       ech.AddedOn
                FROM employees_commission_history AS ech
				LEFT JOIN employees ON employees.id = ech.AddedBy
                WHERE ech.employees_id='".$attr['employee_id']."' AND 
                      ech.company_id='" . $this->arrUser['company_id'] . "'";
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result['commission'] = $Row['commission'].'%';
                $result['commission_effective Date'] = $this->objGeneral->convert_unix_into_date($Row['commission_effective_date']);
                $result['added_by'] = $Row['added_by'];
                $result['Added_on'] = $this->objGeneral->convert_unix_into_date($Row['AddedOn']);

                $response['response'][] = $result;
            }

        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function get_other_benefits($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT other_benefits.id,other_benefits.benefit_title,other_benefits.Comments,other_benefits.start_date,other_benefits.end_date, employees.first_name, employees.last_name
				FROM other_benefits
				INNER JOIN employees ON employees.id=other_benefits.user_id
				WHERE other_benefits.employee_id='$attr[employee_id]'
				AND other_benefits.company_id='$attr[company_id]'";

        // $RS = $this->objsetup->CSI($Sql);
        if ($attr['employee_id'] == $this->arrUser['id']){
            $RS = $this->objsetup->CSI($Sql);
        }
        else{
            $RS = $this->objsetup->CSI($Sql, "HR_benefit_Tab", sr_ViewPermission);
        }
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['benefit'] = $Row['benefit_title'];
                $result['Description'] = $Row['Comments'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $result['end_date_temp'] = $Row['end_date'];
                $result['created_by'] = $Row['first_name'] . " " . $Row['last_name'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function add_other_benefits($attr)
    {

        $this->objGeneral->mysql_clean($attr);


        if ($attr['benefit_id'] > 0)
            $where_id = " AND tst.id <> '$attr[benefit_id]' ";

        $data_pass = "   	tst.employee_id='" . $attr['employee_id'] . "'
		 and tst.benefit_title='" . $attr['benefits_title'] . "'   $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('other_benefits', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $modulePermission = "";
        if ($attr['benefit_id'] > 0) {
            $SQL = "UPDATE other_benefits
                        set
                            employee_id='" . $attr['employee_id'] . "',
                            benefit_title='" . $attr['benefits_title'] . "',
                            Comments='" . $attr['comments'] . "',
                            start_date='" . $this->objGeneral->convert_date($attr['start_date']) . "',
                            end_date='" . $this->objGeneral->convert_date($attr['end_date']) . "',
                            user_id='" . $this->arrUser['id'] . "',
                            company_id='" . $attr['company_id'] . "'

                            WHERE id = $attr[benefit_id]
                            ";
                            $modulePermission = sr_EditPermission;

        } else {
            $SQL = "insert into other_benefits
                          set
                            employee_id='" . $attr['employee_id'] . "',
                            benefit_title='" . $attr['benefits_title'] . "',
                            Comments='" . $attr['comments'] . "',
                            start_date='" . $this->objGeneral->convert_date($attr['start_date']) . "',
                            end_date='" . $this->objGeneral->convert_date($attr['end_date']) . "',
                            user_id='" . $this->arrUser['id'] . "',
                            company_id='" . $attr['company_id'] . "'";
                            $modulePermission = sr_AddPermission;

        }

        //echo $SQL; exit;
        // $RSProducts = $this->objsetup->CSI($SQL);
        $RSProducts = $this->objsetup->CSI($SQL, "HR_benefit_Tab", $modulePermission);
            if(is_array($RSProducts) && $RSProducts['Error'] == 1){
                return $RSProducts;
            }
            else if (is_array($RSProducts) && $RSProducts['Access'] == 0){
                return $RSProducts;
            }

        if ($this->Conn->Affected_Rows() > 0) {

            // for other benefit history

                $ob_query = "SELECT * FROM employees_benefits_history 
                WHERE  
                employee_id=" . $attr['employee_id'] . " 
                AND company_id='" . $attr['company_id']. "'
                AND other_benefit_title='" . $attr['benefits_title'] . "'
                AND other_benefit_comments='" . $attr['comments'] . "'
                AND other_benefit_date_assign='" . $this->objGeneral->convert_date($attr['start_date']) . "'
                AND other_benefit_return_date_assign='" . $this->objGeneral->convert_date($attr['end_date']) . "'
                ";

                $RS6 = $this->objsetup->CSI($ob_query);
                // insert record
                if($this->Conn->Affected_Rows()==0){
                    $ob_query_ins = "INSERT INTO employees_benefits_history 
                SET  
                benefit_type='6' ,
                employee_id=" . $attr['employee_id'] . " ,
                company_id='" . $attr['company_id'] . "',
                other_benefit_title='" . $attr['benefits_title'] . "',
                other_benefit_comments='" . $attr['comments'] . "',
                other_benefit_date_assign='" . $this->objGeneral->convert_date($attr['start_date']) . "',
                other_benefit_return_date_assign='" . $this->objGeneral->convert_date($attr['end_date']) . "',
                AddedBy = '" .  $this->arrUser['id']. "',
                AddedOn = UNIX_TIMESTAMP(NOW())
                ";
                $this->objsetup->CSI($ob_query_ins);
                };


            $response['ack'] = 1;
            $response['error'] = "Record Updated Successfully";
            $response['response'] = array();
        } else {
            $response['ack'] = 0;
            $response['error'] = "Record Updated Successfully";
            $response['response'] = array();
        }
        return $response;
    }

    function del_other_benefits($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $SQL = "Delete from other_benefits where id='" . $attr['benefit_id'] . "'";
        // echo $SQL; exit;
        // $RSProducts = $this->objsetup->CSI($SQL);
        $RSProducts = $this->objsetup->CSI($SQL, "HR_benefit_Tab", sr_DeletePermission);
        if(is_array($RSProducts) && $RSProducts['Error'] == 1){
            return $RSProducts;
        }
        else if (is_array($RSProducts) && $RSProducts['Access'] == 0){
            return $RSProducts;
        }


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = "Record Deleted";
            $response['response'] = array();
        } else {
            $response['ack'] = 0;
            $response['error'] = "Record Not Deleted";
            $response['response'] = array();
        }
        return $response;
    }

    function get_employee_benefits_history($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT ebh.*,emp.first_name, emp.last_name
				FROM employees_benefits_history ebh
                INNER JOIN employees emp ON emp.id=ebh.AddedBy
				WHERE ebh.employee_id='$attr[employee_id]'
                AND ebh.company_id='".$this->arrUser['company_id']."'
                AND ebh.benefit_type='".$attr['benefit_type']."'";
       // echo $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];                
                if($attr['benefit_type']==1){
                    $result['car_make'] = $Row['car_make']; 
                    $result['car_model'] = $Row['car_model']; 
                    $result['reg_no'] = $Row['car_vin'];
                    $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['car_date_assign']);
                    $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['car_date_return']);
                }
                if($attr['benefit_type']==2){
                    $result['card_number'] = $Row['car_fuel_card_num']; 
                    $result['cost_deduction'] = ($Row['fuel_cost_deduction']==1) ? "Yes" : "No"; 
                }
                if($attr['benefit_type']==3){
                    $result['laptop_make'] = $Row['laptop_make']; 
                    $result['laptop_model'] = $Row['laptop_model']; 
                    $result['laptop_serial'] = $Row['laptop_serial']; 
                    $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['laptop_date_assign']);
                    $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['laptop_return_date_assign']);
                }
                if($attr['benefit_type']==4){
                    $result['tablet_make'] = $Row['tablet_make']; 
                    $result['tablet_model'] = $Row['tablet_model']; 
                    $result['tablet_serial'] = $Row['tablet_serial']; 
                    $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['tablet_date_assign']);
                    $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['tablet_return_date_assign']);
                }
                if($attr['benefit_type']==5){
                    $result['mobile_make'] = $Row['mobile_make']; 
                    $result['mobile_model'] = $Row['mobile_model']; 
                    $result['mobile_serial'] = $Row['mobile_serial']; 
                    $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['mobile_date_assign']);
                    $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['mobile_return_date_assign']);
                }
                if($attr['benefit_type']==6){
                    $result['title'] = $Row['other_benefit_title']; 
                    $result['comments'] = $Row['other_benefit_comments']; 
                    $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['other_benefit_date_assign']);
                    $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['other_benefit_return_date_assign']);
                }
                $result['created_by'] = $Row['first_name'] . " " . $Row['last_name'];
                $result['created_at'] = $this->objGeneral->convert_unix_into_date($Row['AddedOn']);               
                $response['response'][] = $result;
            }
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function get_company_base_currency($attr)
    {

        //$this->objGeneral->mysql_clean($attr);


        $Sql = "SELECT currency.name,currency.code FROM company cc
		left join currency on currency.id = cc.currency_id 
		where  cc.id=" . $this->arrUser['company_id'] . "  
		Limit 1 ";
        $RS = $this->objsetup->CSI($Sql);

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

    function get_currency_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        $limit_clause = $where_clause = "";


        $Sql = "SELECT currency.name,currency.id ,currency.code FROM company cc
		left join currency on cc.id = currency.company_id 
		where  cc.id=" . $this->arrUser['company_id'] . "  
		order by currency.id DESC ";
        //echo $Sql; exit;

        $Sql .= $limit_clause;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['code'] = $Row['code'];
                //$result['document_path'] =  $Row['document_path'];  
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        // print_r($response);exit;

        return $response;
    }

    function get_all_table($attr)
    {

        if ($_SERVER['HTTP_HOST'] == 'localhost')
            $Sql = "SHOW TABLES FROM navsonso_silver";
        else
            $Sql = "SHOW TABLES FROM navsonso_silver";
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                if ($_SERVER['HTTP_HOST'] == 'localhost')
                    $rsRow = $Row['Tables_in_navsonso_silver'];
                else
                    $rsRow = $Row['Tables_in_navsonso_silver'];

                echo $rsRow;

                //$rsRow == 'crm'
                $response['response'][] = $result;
            }
        }

        return $response;
    }

    //codemark1
    function get_emp_form_details($attr){
        $result1 = $this->get_emp_type_list($attr);
        $response['response']['emp_type_list'] = $result1['response'];
        $result2 = $this->get_employee_inactive_type($attr[0]);
        $response['response']['emp_inactive_type'] = $result2['response'];
        $result3 = $this->get_employee_leaving_reasons($attr[0]);
        $response['response']['emp_leaving_reasons'] = $result3['response'];
        $result4 = $this->get_religion_type_list($attr[0]);
        $response['response']['emp_religion_list'] = $result4['response'];
        $result5 = $this->get_employee_by_id($attr[1]);
        $response['response']['emp_details'] = $result5['response'];
        $result6 = $this->employee_last_status_history($attr[2]);
        $response['response']['emp_last_status_history'] = $result6;
        $result7 = $this->get_populated_roles($attr[3]);
        $response['response']['all_roles'] = $result7['response'];
        $result8 = $this->get_role_to_employee($attr[4]);
        $response['response']['emp_get_role'] = $result8['response'];
        require_once(SERVER_PATH . "/classes/Crm.php");
        $objCrm = new Crm($this->arrUser);
        $result9 = $objCrm->getCRMSalespersons($attr[5]);
        $response['response']['emp_CRM_salesperson'] = $result9['response'];

        $result10 = $this->get_all_hr_department($attr[0]);
        $response['response']['emp_all_hr_depts'] = $result10['response'];

        $attr_emp['limit'] = 999;
        $attr_emp['show_active_inactive'] = 1;
        
        $result11 = $this->get_employees($attr_emp, 1);
        //print_r($result11['response']);exit;
        for ($i = 0; $i < sizeof($result11['response']); $i++){
            foreach($result11['response'][$i] as $key => $value)
            {
                if ($key == "code"){
                    $tempArray = array("Employee No." => $value);
                    $result11['response'][$i] = $tempArray + $result11['response'][$i];
                    unset($result11['response'][$i][$key]);
                }
                
            }
        }
        $response['response']['emp_listings'] = $result11;
        // print_r($response['response']['emp_listings']);
        // exit;

        // $result12 = $this->objsetup->get_hr_territories_list($attr[1]);
        // $response['response']['all_territories'] = $result12;
        

        require_once(SERVER_PATH . "/classes/Crm.php");
        $objCrm = new Crm($this->arrUser);
        $arr_attr['id'] = $attr[1]['id']; 
        // $result13 = $objCrm->getCrmSalesTargetUsingEmpId($arr_attr);
        // $response['response']['salesTarget'] = $result13;

        $result14 = $this->get_hr_department_by_employee($attr[0]);
        $response['response']['selected_dept'] = $result14['response'];

        require_once(SERVER_PATH . "/classes/SalesBucket.php");
        $objSalesBucket = new SalesBucket($this->arrUser);
        $result15 = $objSalesBucket->get_all_buckets();
        $response['response']['viewBuckets'] = $result15['response'];
        $result16 = $this->get_buckets_to_employee($attr[4]);
        $response['response']['emp_get_buckets'] = $result16['response'];

        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($result5['bucketFail']){
            $response['bucketFail'] = 1;
        }
        return $response;
    }

    function update_expenses_setup($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $id = (isset($attr['id']) && $attr['id'] !='')?$attr['id']:0;

        $supplier_id            = ($attr['supplier_id'] != '') ? $attr['supplier_id'] : 0;
        $accomodation_gl_id     = ($attr['accomodation_gl_id'] != '') ? $attr['accomodation_gl_id'] : 0;
        $travel_gl_id           = ($attr['travel_gl_id'] != '') ? $attr['travel_gl_id'] : 0;
        $communication_gl_id    = ($attr['communication_gl_id'] != '') ? $attr['communication_gl_id'] : 0;
        $entertainment_gl_id    = ($attr['entertainment_gl_id'] != '') ? $attr['entertainment_gl_id'] : 0;
        $food_gl_id             = ($attr['food_gl_id'] != '') ? $attr['food_gl_id'] : 0;
        $misc_gl_id             = ($attr['misc_gl_id'] != '') ? $attr['misc_gl_id'] : 0;
        $millage_gl_id          = ($attr['millage_gl_id'] != '') ? $attr['millage_gl_id'] : 0;
        
        
        if($id == 0)
        {
            $Sql = "INSERT INTO expense_form_setup SET 
                        supplier_id = $supplier_id,
                        supplier_code = '$attr[supplier_code]',
                        accomodation_gl_id = $accomodation_gl_id,
                        accomodation_gl_name = '$attr[accomodation_gl_name]',
                        accomodation_gl_code = '$attr[accomodation_gl_code]',
                        travel_gl_id = $travel_gl_id,
                        travel_gl_name = '$attr[travel_gl_name]',
                        travel_gl_code = '$attr[travel_gl_code]',
                        communication_gl_id = $communication_gl_id,
                        communication_gl_name = '$attr[communication_gl_name]',
                        communication_gl_code = '$attr[communication_gl_code]',
                        entertainment_gl_id = $entertainment_gl_id,
                        entertainment_gl_name = '$attr[entertainment_gl_name]',
                        entertainment_gl_code = '$attr[entertainment_gl_code]',
                        food_gl_id = $food_gl_id,
                        food_gl_name = '$attr[food_gl_name]',
                        food_gl_code = '$attr[food_gl_code]',
                        misc_gl_id = $misc_gl_id,
                        misc_gl_name = '$attr[misc_gl_name]',
                        misc_gl_code = '$attr[misc_gl_code]',
                        millage_gl_id = $millage_gl_id,
                        millage_gl_name = '$attr[millage_gl_name]',
                        millage_gl_code = '$attr[millage_gl_code]',
                        company_id = " .  $this->arrUser['company_id']. ",
                        user_id = " .  $this->arrUser['id']. ",
                        AddedBy = " .  $this->arrUser['id']. ",
                        AddedOn = UNIX_TIMESTAMP(NOW())";
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }
        else
        {
            $Sql = "UPDATE expense_form_setup SET 
                        supplier_id = $supplier_id,
                        supplier_code = '$attr[supplier_code]',
                        accomodation_gl_id = $accomodation_gl_id,
                        accomodation_gl_name = '$attr[accomodation_gl_name]',
                        accomodation_gl_code = '$attr[accomodation_gl_code]',
                        travel_gl_id = $travel_gl_id,
                        travel_gl_name = '$attr[travel_gl_name]',
                        travel_gl_code = '$attr[travel_gl_code]',
                        communication_gl_id = $communication_gl_id,
                        communication_gl_name = '$attr[communication_gl_name]',
                        communication_gl_code = '$attr[communication_gl_code]',
                        entertainment_gl_id = $entertainment_gl_id,
                        entertainment_gl_name = '$attr[entertainment_gl_name]',
                        entertainment_gl_code = '$attr[entertainment_gl_code]',
                        food_gl_id = $food_gl_id,
                        food_gl_name = '$attr[food_gl_name]',
                        food_gl_code = '$attr[food_gl_code]',
                        misc_gl_id = $misc_gl_id,
                        misc_gl_name = '$attr[misc_gl_name]',
                        misc_gl_code = '$attr[misc_gl_code]',
                        millage_gl_id = $millage_gl_id,
                        millage_gl_name = '$attr[millage_gl_name]',
                        millage_gl_code = '$attr[millage_gl_code]'
                    WHERE id=$id";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
        }
       
        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function get_expenses_setup($attr)
    {
        $Sql = "SELECT efs.*, s.name AS supplier_name FROM expense_form_setup AS efs, srm AS s
		            WHERE 
                        s.id = efs.supplier_id AND
                        efs.company_id=" . $this->arrUser['company_id'] . " Limit 1";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql,'purchases',sr_ViewPermission);

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
    function convert_expense_to_purchase_order($attr)
    {
        // $this->Conn->beginTrans();
        // $this->Conn->autoCommit = false;
        
        $Sql = "CALL SR_Convert_Expense_To_Purchase_Order(".$attr['id'].", " . $this->arrUser['company_id'] . ", " . $this->arrUser['id'] . ")";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        //echo '<pre>'; print_r($RS->fields['Result']);exit;
        if($RS->fields['Result']==1)
        {
            
            // $this->Conn->commitTrans();
            // $this->Conn->autoCommit = true;

            $response['ack'] = 1;
            $response['purchase_order_id'] = $RS->fields['PurchaseOrderID'];
            $response['error'] =$RS->fields['Message'];
        }
        else
        {   
            $response['ack'] = 0;
            $response['error'] =$RS->fields['Message'];
        } 
        return $response; 
    }
}
?>