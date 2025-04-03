<?php

require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Setup.php");

<<<<<<< HEAD
class Task extends Xtreme {
=======
class Task extends Xtreme
{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;
    private $objsetup = null;

<<<<<<< HEAD
    function __construct($user_info = array()) {
=======
    function __construct($user_info = array())
    {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->objsetup = new Setup($user_info);
        $this->arrUser = $user_info;
    }

<<<<<<< HEAD
   function delete_update_status($table_name, $column, $id)
=======
    function delete_update_status($table_name, $column, $id)
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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
<<<<<<< HEAD
        /*	$uploads_dir = UPLOAD_PATH.'sales/';
        $Sql1 = "SELECT *
                FROM document
                WHERE id='".$attr['id']."'
                LIMIT 1";
        $Row = $this->objsetup->CSI($Sql1)->FetchRow();
        if($Row[file] != '')
                unlink($uploads_dir.$Row[file]);
*/
=======
        // 	$uploads_dir = UPLOAD_PATH.'sales/';
        // $Sql1 = "SELECT *
        //         FROM document
        //         WHERE id='".$attr['id']."'
        //         LIMIT 1";
        // $Row = $this->objsetup->CSI($Sql1)->FetchRow();
        // if($Row[file] != '')
        //         unlink($uploads_dir.$Row[file]);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        return $response;
    }

    function get_data_by_id($table_name, $id)
    {
<<<<<<< HEAD
        if (empty($id)){
=======
        if (empty($id)) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['ack'] = 0;
            $response['error'] = "No record selected!";
            $response['response'] = [];
            return $response;
        }

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
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
<<<<<<< HEAD


    }

  
//--------------Task Module------------------------

    function getAllStatus() {
=======
    }


    //--------------Task Module------------------------

    function getAllStatus()
    {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        return; // removing table task_status from db as it is not being used

        $Sql = "SELECT * FROM task_status WHERE status=1";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
<<<<<<< HEAD
        
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $response['response'][] = array('id' => $Row['id'],'name' => $Row['name']);
             }
        $response['ack'] = 1;
		$response['error'] = NULL;
=======

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $response['response'][] = array('id' => $Row['id'], 'name' => $Row['name']);
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        } else {
            $response['response'] = array();
        }
        return $response;
    }

<<<<<<< HEAD
    function getCompanyEmployees() {
=======
    function getCompanyEmployees()
    {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $Sql = "SELECT e.id,e.first_name,e.last_name,e.job_title,e.user_code,e.department,e.user_email
                FROM employees AS e
                LEFT JOIN company AS c ON c.id=e.user_company 
                WHERE e.status=1 AND
                (e.user_company=" . $this->arrUser['company_id'] . " 
                OR c.parent_id=" . $this->arrUser['company_id'] . ")
                ORDER BY e.id DESC";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
<<<<<<< HEAD
       
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $response['response'][] = array('id' => $Row['id'], 
                                                'first_name' => $Row['first_name'], 
                                                'last_name' => $Row['last_name'], 
                                                'job_title' => $Row['job_title'],
                                                'user_code' => $Row['user_code'],
                                                'department' => $Row['department'],
                                                'user_email' => $Row['user_email']
            );
            }
            $response['ack'] = 1;
            $response['error'] = NULL;} 
        else {
            $response['response'] = array();
            $response['ack'] = 0; 
=======

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $response['response'][] = array(
                    'id' => $Row['id'],
                    'first_name' => $Row['first_name'],
                    'last_name' => $Row['last_name'],
                    'job_title' => $Row['job_title'],
                    'user_code' => $Row['user_code'],
                    'department' => $Row['department'],
                    'user_email' => $Row['user_email']
                );
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }
        return $response;
    }

<<<<<<< HEAD
    function get_notifiable_tasks ($attr) {
=======
    function get_notifiable_tasks($attr)
    {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        /* SELECT 
                    *
                FROM
                    sr_tasks_view
                WHERE
                    reminder IS NOT NULL AND reminder <> 0
                        AND reminder <> ''
                        AND reminderUnit IS NOT NULL
                        AND reminderUnit <> 0
                        AND reminderUnit <> ''
                        AND notified = 0
                        AND reminderTime > UNIX_TIMESTAMP()
                        AND reminderTime < UNIX_TIMESTAMP(NOW() + INTERVAL 1 DAY)
                AND company_id=" . $this->arrUser['company_id'] . "
                order by datetime DESC*/


        $Sql = "SELECT 
                    *
                FROM
                    sr_tasks_view
<<<<<<< HEAD
                WHERE notified = 0 AND user_id = ".$this->arrUser['id']." AND company_id=" . $this->arrUser['company_id'] . "
                order by datetime DESC";//AND d.assign_to = " . $this->arrUser['id'] . " 
                // echo $Sql;exit;
=======
                WHERE notified = 0 AND user_id = " . $this->arrUser['id'] . " AND company_id=" . $this->arrUser['company_id'] . "
                order by datetime DESC"; //AND d.assign_to = " . $this->arrUser['id'] . " 
        // echo $Sql;exit;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['formattedDate'] = $this->objGeneral->convert_unix_into_date($Row['date']);
<<<<<<< HEAD
                $result = $Row;						
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
		    $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
		    $response['error'] = NULL;
            $response['response'] = array();
        }
        return $response;


    }

    function get_task($attr) {
    //    print_r($attr);exit;
        // $this->objGeneral->mysql_clean($attr);
        if($attr['module_name']=='crm_retailer'){
            $attr['module_name'] = 'crm';
        }
        $where_clause = "";
        if (!empty($attr['module_name'])){
            $where_clause .= " AND module = '$attr[module_name]' ";
        }

        if (!empty($attr['record_id'])){
=======
                $result = $Row;
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = array();
        }
        return $response;
    }

    function get_task($attr)
    {
        //    print_r($attr);exit;
        // $this->objGeneral->mysql_clean($attr);
        if ($attr['module_name'] == 'crm_retailer') {
            $attr['module_name'] = 'crm';
        }
        $where_clause = "";
        if (!empty($attr['module_name'])) {
            $where_clause .= " AND module = '$attr[module_name]' ";
        }

        if (!empty($attr['record_id'])) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $where_clause .= " AND record = $attr[record_id] ";
        }

        $Sql = "SELECT *
                FROM sr_tasks_view
<<<<<<< HEAD
                where " . $where . "  
                company_id=" . $this->arrUser['company_id'] . "
                and user_id = " . $this->arrUser['id'] . "
                $where_clause
                order by datetime ASC";//AND d.assign_to = " . $this->arrUser['id'] . " 
                // echo $Sql;exit;

        if ($attr['countOnly']){
            $Sql = "SELECT count(id) as recordCount
                FROM sr_tasks_view
                where " . $where . "  
                company_id=" . $this->arrUser['company_id'] . "
=======
                where  company_id=" . $this->arrUser['company_id'] . "
                and user_id = " . $this->arrUser['id'] . "
                $where_clause
                order by datetime ASC"; //AND d.assign_to = " . $this->arrUser['id'] . " 
        // echo $Sql;exit;

        if ($attr['countOnly']) {
            $Sql = "SELECT count(id) as recordCount
                FROM sr_tasks_view
                where  company_id=" . $this->arrUser['company_id'] . "
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                and user_id = " . $this->arrUser['id'] . "
                $where_clause
                order by datetime ASC";
        }

        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

<<<<<<< HEAD
        if ($attr['countOnly']){
=======
        if ($attr['countOnly']) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $response['q'] = '';
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] =  $RS->FetchRow()['recordCount'];
            return $response;
        }
<<<<<<< HEAD
 
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                // $Row['date'] = $this->objGeneral->convert_unix_into_date($Row['date']);
                // $result['id'] = $Row['id'];
                // $result['name'] = $Row['t_title'];
                // $result['t_description'] = strip_tags($Row['t_description']);
<<<<<<< HEAD
                if ($Row['module'] == ''){
=======
                if ($Row['module'] == '') {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $Row['module'] = 'N/A';
                }
                $Row['tempDate'] = $Row['date'];
                // $result['t_time'] = $Row['t_time'];
                // $result['t_date'] = $Row['t_date'];
                // // 
                // $result['e_time'] = $Row['e_time'];
                // $result['t_time'] = $Row['t_time'];
                // $result['assign_to'] = $Row['assign_to'];
                // $result['t_image'] = $Row['t_image'];
                // $result['t_status'] = $Row['t_status'];
                $result = $Row;
<<<<<<< HEAD
																// $result['t_date'] = $this->objGeneral->convert_unix_into_date($Row['t_date']);
																	
=======
                // $result['t_date'] = $this->objGeneral->convert_unix_into_date($Row['t_date']);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $response['response'][] = $result;
            }
            $response['total'] = count($response['response']);
            $response['ack'] = 1;
<<<<<<< HEAD
		    $response['error'] = NULL;
        } else {
            $response['total'] = 0;
            $response['ack'] = 1;
		    $response['error'] = NULL;
=======
            $response['error'] = NULL;
        } else {
            $response['total'] = 0;
            $response['ack'] = 1;
            $response['error'] = NULL;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['response'] = array();
        }
        return $response;
    }

<<<<<<< HEAD
    function markChecked($attr) {
        $attr = $attr['task'];
        // print_r($attr);exit;
        if ($attr->status != 2){
            $what = " status = 3, notified = 1 ";
        }
        else{
            $what = " status = 2, notified = 0 ";
        }
        if ($attr->id){
=======
    function markChecked($attr)
    {
        $attr = $attr['task'];
        // print_r($attr);exit;
        if ($attr->status != 2) {
            $what = " status = 3, notified = 1 ";
        } else {
            $what = " status = 2, notified = 0 ";
        }
        if ($attr->id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $Sql = "UPDATE employee_task
                        SET
                        $what where id = " . $attr->id . " ";
            //  echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $response['query'] = $Sql;
            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record can\'t be updated!';
            }

            /* if ($attr->recurrence && $attr->recurrenceUnit){
                $response['ifRecurrence'] = 1;
                $newDate = 0;
                $rec = $attr->recurrence;
                $recUnit = $attr->recurrenceUnit;
                // day, week, month, year
                if ($recUnit == 1){ // day
                    $newDate = $rec * 60 * 60 * 24;
                }
                else if ($recUnit == 2){ // week
                    $newDate = $rec * 60 * 60 * 24 * 7;
                }
                else if ($recUnit == 3){ // month
                    $newDate = $rec * 60 * 60 * 24 * 7 * 30;
                }
                else if ($recUnit == 4){ // year
                    $newDate = $rec * 60 * 60 * 24 * 7 * 30 * 365;
                }

                $SqlRecurrence = "
                    INSERT INTO employee_task (
                    user_id, company_id, status, subject, comments, date, dateActual, time, t_status, assign_to, reminder, reminderUnit, recurrence, recurrenceUnit, module, record, subType, subTypeId, priority, notified
                    ) SELECT user_id, company_id, status, subject, comments, (date + $newDate), dateActual, time, t_status, assign_to, reminder, reminderUnit, recurrence, recurrenceUnit, module, record, subType, subTypeId, priority, 0
                    FROM employee_task WHERE id = " . $attr->id . " ;
                ";
                // echo $SqlRecurrence;exit;
                $RS2 = $this->objsetup->CSI($SqlRecurrence);
                $id = $this->Conn->Insert_ID();
                if ($id){
                    $response['recurrenceTaskAdded'] = $id;
                }
                else{
                    $response['recurrenceTaskAdded'] = "Err";
                }
            } */
<<<<<<< HEAD

=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }
        return $response;
    }

<<<<<<< HEAD
    function deleteTask($attr) {
        // print_r($attr);exit;
            $Sql = "DELETE FROM employee_task where id = " . $attr['id'] . "; ";
            // echo $Sql;
            $RS = $this->objsetup->CSI($Sql);

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record can\'t be Deleted!';
            }

            return $response;
    }

    function mark_task($attr) {
        $attr = $attr['task'];
        
        if ($attr->id){
=======
    function deleteTask($attr)
    {
        // print_r($attr);exit;
        $Sql = "DELETE FROM employee_task where id = " . $attr['id'] . "; ";
        // echo $Sql;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be Deleted!';
        }

        return $response;
    }

    function mark_task($attr)
    {
        $attr = $attr['task'];

        if ($attr->id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $Sql = "UPDATE employee_task
                        SET
                        notified = 1 where id = " . $attr->id . " ";
            // echo $Sql;
            $RS = $this->objsetup->CSI($Sql);

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
<<<<<<< HEAD
                if ($attr->recurrence > 0 && $attr->recurrenceUnit){
=======
                if ($attr->recurrence > 0 && $attr->recurrenceUnit) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $response['ifRecurrence'] = 1;
                    $newDate = $attr->recurrenceDate;

                    $SqlRecurrence = "
                        INSERT INTO employee_task (
                        user_id, company_id, status, subject, date, dateActual, time, t_status, assign_to, reminder, reminderUnit, recurrence, recurrenceUnit, module, record, subType, subTypeId, priority, notified, AddedBy, AddedOn
<<<<<<< HEAD
                        ) SELECT user_id, company_id, status, subject, $newDate, dateActual, time, t_status, assign_to, reminder, reminderUnit, recurrence, recurrenceUnit, module, record, subType, subTypeId, priority, 0, ".$this->arrUser['id'].", ".current_date_time. "
=======
                        ) SELECT user_id, company_id, status, subject, $newDate, dateActual, time, t_status, assign_to, reminder, reminderUnit, recurrence, recurrenceUnit, module, record, subType, subTypeId, priority, 0, " . $this->arrUser['id'] . ", " . current_date_time . "
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        FROM employee_task WHERE id = " . $attr->id . " ;
                    ";
                    //  echo $SqlRecurrence;exit;
                    $RS2 = $this->objsetup->CSI($SqlRecurrence);
                    $id = $this->Conn->Insert_ID();
<<<<<<< HEAD
                    if ($id){
                        $response['recurrenceTaskAdded'] = $id;
                    }
                    else{
                        $response['recurrenceTaskAdded'] = "Err";
                    }
                }   
=======
                    if ($id) {
                        $response['recurrenceTaskAdded'] = $id;
                    } else {
                        $response['recurrenceTaskAdded'] = "Err";
                    }
                }
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record can\'t be updated!';
            }
<<<<<<< HEAD


            
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }
        return $response;
    }

<<<<<<< HEAD
    function add_task($arr_attr) {
    
        // echo $this->objGeneral->convert_date($arr_attr['date']);
        // echo "----". $arr_attr['jsDate'];
// exit;
        	$this->objGeneral->mysql_clean($arr_attr);
=======
    function add_task($arr_attr)
    {

        // echo $this->objGeneral->convert_date($arr_attr['date']);
        // echo "----". $arr_attr['jsDate'];
        // exit;
        $this->objGeneral->mysql_clean($arr_attr);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // print_r($arr_attr);exit;
        $id = $arr_attr['id'];
        //$t_description =base64_encode($arr_attr->t_description);
<<<<<<< HEAD
        
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($arr_attr->notify == true) $arr_attr->notify = 1;
        if ($arr_attr->notify == false) $arr_attr->notify = 0;
        if ($arr_attr->t_status == 'completed') $arr_attr->t_status = 1;
        if ($arr_attr->t_status == 'incompleted') $arr_attr->t_status = 0;
        $time = $arr_attr['time'] ? $arr_attr['time'] : null;
        // echo $notify;exit;
        //$status = $arr_attr->status->id;
<<<<<<< HEAD
 
        if($attr['id']>0)   $where_id = "AND tst.id <> '".$attr['id']."'";
						
=======

        if ($arr_attr['id'] > 0)   $where_id = "AND tst.id <> '" . $arr_attr['id'] . "'";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // $data_pass = " tst.t_title='$arr_attr->t_title' $where_id ";
        // $total = $this->objGeneral->count_duplicate_in_sql('employee_task', $data_pass, $this->arrUser['company_id']);
        // if ($total > 0) {
        //     $response['ack'] = 0;
        //     $response['error'] = 'Record Already Exists.';
        //     return $response;
        //     exit;
        //     }
<<<<<<< HEAD
		
        if ($id == 0) {//assign_to='" . $assign_to . "',
=======

        if ($id == 0) { //assign_to='" . $assign_to . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $Sql = "INSERT INTO employee_task
                        SET
                            subject         =   '$arr_attr[subject]',
                            comments        =   '$arr_attr[comments]',
<<<<<<< HEAD
                            date            =   '".$arr_attr['jsDate']."',
                            dateActual      =   '".$this->objGeneral->convertUnixDateIntoConvDate($arr_attr['date'])."',
                            time            =   '$time',
                            reminder        =   '".$this->objGeneral->emptyToZero($arr_attr['reminder'])."',
                            reminderUnit    =   '$arr_attr[reminderUnit]',
                            recurrence      =   '".$this->objGeneral->emptyToZero($arr_attr['recurrence'])."',
=======
                            date            =   '" . $arr_attr['jsDate'] . "',
                            dateActual      =   '" . $this->objGeneral->convertUnixDateIntoConvDate($arr_attr['date']) . "',
                            time            =   '$time',
                            reminder        =   '" . $this->objGeneral->emptyToZero($arr_attr['reminder']) . "',
                            reminderUnit    =   '$arr_attr[reminderUnit]',
                            recurrence      =   '" . $this->objGeneral->emptyToZero($arr_attr['recurrence']) . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            recurrenceUnit  =   '$arr_attr[recurrenceUnit]',
                            priority        =   '$arr_attr[priority]',
                            module          =   '$arr_attr[module]',
                            record          =   '$arr_attr[record]',
<<<<<<< HEAD
                            status          =   '".$this->objGeneral->emptyToZero($arr_attr['status'])."',
                            user_id         =   '".$this->arrUser['id']."',
                            company_id      =   '".$this->arrUser['company_id']."',
                            AddedBy         =   '".$this->arrUser['id']."',
                            AddedOn         =   '".current_date_time."'";
=======
                            status          =   '" . $this->objGeneral->emptyToZero($arr_attr['status']) . "',
                            user_id         =   '" . $this->arrUser['id'] . "',
                            company_id      =   '" . $this->arrUser['company_id'] . "',
                            AddedBy         =   '" . $this->arrUser['id'] . "',
                            AddedOn         =   '" . current_date_time . "'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            //echo $Sql;exit;

            /* $Sql = "INSERT INTO employee_task
                    SET t_title='".$arr_attr->t_title."',
                        t_description='".$t_description."',
                        t_time='$arr_attr->t_time',
                        e_time='$arr_attr->e_time',
                        assign_to='".$assign_to."',
                        module='".$module."',
                        record='".$record."',
                        t_image='$arr_attr->t_image',
                        notify=".$arr_attr->notify.",
                        reminder=".$arr_attr->reminder.",
                        priority='".$arr_attr->priority."',
                        status=1,
                        r_time='$arr_attr->r_time',
                        r_date=".$this->objGeneral->convert_date($arr_attr->r_date).",
                        t_date=".$this->objGeneral->convert_date($arr_attr->t_date).",
                        e_date=".$this->objGeneral->convert_date($arr_attr->e_date).",
                        user_id='".$this->arrUser['id']."',
                        company_id='".$this->arrUser['company_id']."'";
            } else {
            $Sql = "UPDATE employee_task 
                    SET t_title='$arr_attr->t_title',
                        t_description='".$t_description."',
                        t_time='$arr_attr->t_time',
                        assign_to='".$assign_to."',
                        module='".$module."',
                        record=".$record.",
                        e_time='$arr_attr->e_time',
                        t_image='$arr_attr->t_image',
                        notify=".$arr_attr->notify.",
                        reminder=".$arr_attr->reminder.",
                        priority='".$arr_attr->priority."',
                        t_status=".$arr_attr->t_status.",   
                        r_time='$arr_attr->r_time',
                        r_date=".$this->objGeneral->convert_date($arr_attr->r_date).",                     
                        t_date='".$this->objGeneral->convert_date($arr_attr->t_date)."',
                        e_date='".$this->objGeneral->convert_date($arr_attr->e_date)."'
                        WHERE id = $id LIMIT 1"; */
<<<<<<< HEAD
        }
        else{
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $Sql = "UPDATE employee_task
                        SET
                            subject         =   '$arr_attr[subject]',
                            comments        =   '$arr_attr[comments]',
<<<<<<< HEAD
                            date            =   '".$arr_attr['jsDate']."',
                            dateActual      =   '".$this->objGeneral->convertUnixDateIntoConvDate($arr_attr['date'])."',
                            time            =   '$time',
                            reminder        =   '".$this->objGeneral->emptyToZero($arr_attr['reminder'])."',
                            reminderUnit    =   '$arr_attr[reminderUnit]',
                            recurrence      =   '".$this->objGeneral->emptyToZero($arr_attr['recurrence'])."',
=======
                            date            =   '" . $arr_attr['jsDate'] . "',
                            dateActual      =   '" . $this->objGeneral->convertUnixDateIntoConvDate($arr_attr['date']) . "',
                            time            =   '$time',
                            reminder        =   '" . $this->objGeneral->emptyToZero($arr_attr['reminder']) . "',
                            reminderUnit    =   '$arr_attr[reminderUnit]',
                            recurrence      =   '" . $this->objGeneral->emptyToZero($arr_attr['recurrence']) . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            recurrenceUnit  =   '$arr_attr[recurrenceUnit]',
                            priority        =   '$arr_attr[priority]',
                            module          =   '$arr_attr[module]',
                            record          =   '$arr_attr[record]',
<<<<<<< HEAD
                            status          =   '".$this->objGeneral->emptyToZero($arr_attr['status'])."'
                        WHERE id = ".$arr_attr['id']."";
        }

        // echo $Sql;exit;
         
=======
                            status          =   '" . $this->objGeneral->emptyToZero($arr_attr['status']) . "'
                        WHERE id = " . $arr_attr['id'] . "";
        }

        // echo $Sql;exit;

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $RS = $this->objsetup->CSI($Sql);
        if ($id == 0)
            $id = $this->Conn->Insert_ID();
        else if ($this->Conn->Affected_Rows() > 0)
            $id = $arr_attr['id'];
<<<<<<< HEAD
         
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($id > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['id'] = $id;
<<<<<<< HEAD
            
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

<<<<<<< HEAD
//--------------Task Module------------------------
}

?>
=======
    //--------------Task Module------------------------
}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
