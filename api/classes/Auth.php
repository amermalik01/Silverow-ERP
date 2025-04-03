<?php
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Variables.php");

class Auth extends Xtreme {

    private $Conn = null;
    private $objGeneral = null;
    private $r_id = 0;
    private $e_id = 0;
    private $m_id = 0;
    private $p_id = 0;
    private $user_type = 0;
    private $company_id = 0;
    private $user_id = 0;

    function __construct() {

        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General();
    }

    function login($attr)
    {
        // project config      	opens ssl extension on and  short_tag on   config php .ini
        $this->objGeneral->mysql_clean($attr); // very important

        $response = array();
        $org_password = $attr['password'];

        // echo '<pre>';print_r($attr);exit;

        if(isset($attr['cust']) &&  $attr['cust']>0){

            $Sql_chk = "SELECT count(id) AS total 
                        FROM cust_portal_settings
                        WHERE crm_id = '".$attr['cust']."' AND 
                              user_email = '".$attr['portalUserName']."' AND 
                              user_password = '".$attr['portalUserPassword']."' AND 
                              company_id = '".$attr['portalCompanyID']."'
                        limit 1";
            // echo $Sql_chk;exit;
            $RS_chk = $this->Conn->Execute($Sql_chk);

            if ($RS_chk->RecordCount() > 0) {
                $validCustPortal = $RS_chk->fields['total'];

                if($validCustPortal > 0){
                    $attr['user_name'] = 'Bia.shan@gmail.com';
                    $attr['password'] = 'Elan500mlx24!!';
                }
            }            
        }

		$attr['password'] = $this->objGeneral->encrypt_password_1($attr['password']);
		// $attr['password'] = $this->objGeneral->encrypt_password_1($attr['password']);
		//echo $attr['password']; exit;        

        $Sql = "SELECT  emp.company_id,
                        emp.id,emp.user_type,
                        emp.user_email,
                        emp.user_password_1,
                        emp.first_name,emp.last_name,  
                        emp.known_as,  
                        emp.allow_login,  
                        emp.department,
                        emp.password_expiry_date,
                        comp.country_id,
                        comp.currency_id,
                        comp.date_format,
                        comp.time_format,
                        comp.timezone,
                        comp.logo as company_logo,
                        comp.name as company_name,
                        currency.code as currency_code,
                        currency.name as currency_name,
                        comp.decimal_range,
                        comp.opp_cycle_limit,
                        comp.oop_cycle_edit_role,
                        comp.oppCycleFreqstartmonth,
                        comp.password_expiry_days,
                        comp.password_reminder_days,
                        comp.password_grace_period,
                        comp.account_lock_attempts,
                        comp.show_sales_add_btn,
                        comp.show_customer_add_btn,
                        comp.show_supplier_add_btn,
                        ela.password_unsuccessful_attempts,
                        ela.id AS emp_activity_id

                 FROM employees as emp
                 JOIN company as comp ON comp.id = emp.user_company
                 LEFT JOIN currency ON currency.id = comp.currency_id
                 LEFT JOIN employee_last_activity as ela ON ela.emp_id = emp.id
                 WHERE  emp.user_email='" . $attr['user_name'] . "' 	AND 
                        emp.user_password_1='" . $attr['password'] . "' AND
                        emp.status = 1
                 LIMIT 1";

        // echo $Sql;exit;

        $RS = $this->Conn->Execute($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            // echo $this->objGeneral->set_token($Row['id']) . "?" . $this->objGeneral->set_token($Row['user_email']) . "?" . $Row['user_password_1'] . "?" .  $this->objGeneral->set_token(current_date_time);exit;

            if ($Row['allow_login'] == 0) {
                $response['ack'] = 2;
                $response['error'] = "Login not allowed, Please contact your administrator";
                $sql_activity = "INSERT INTO employee_activity SET
                                    emp_id = '".$Row['id']."',
                                    company_id = '".$Row['company_id']."',
                                    login_time = UNIX_TIMESTAMP(NOW()),
                                    login_ip = '".$this->objGeneral->getRealIpAddr()."',
                                    is_successful = 3";
                $this->Conn->Execute($sql_activity);
                return $response;
            }

            if ($Row['user_type'] == 0) {
                $response['response'] = 0;
                $response['ack'] = 0;
                $response['error'] = "Invalid login credentials";
                return $response;
            }
            
            $date_diff = $Row['password_expiry_date'] - current_date_time;
            $days_to_expire = round($date_diff / (60 * 60 * 24));
            $days_to_expire = ($days_to_expire == '-0') ? 0 : $days_to_expire;
            $password_grace_period = -1 * $Row['password_grace_period'];
            if($days_to_expire < $password_grace_period && $Row['user_type'] <> 1 && $Row['user_type']==5)
            {
                $response['response'] = 0;
                $response['ack'] = 4;
                $response['error'] = "Password Expired";
                $sql_activity = "INSERT INTO employee_activity SET
                                    emp_id = ".$Row['id'].",
                                    company_id = ".$Row['company_id'].",
                                    login_time = UNIX_TIMESTAMP(NOW()),
                                    login_ip = '".$this->objGeneral->getRealIpAddr()."',
                                    is_successful = 2";
                $this->Conn->Execute($sql_activity);
                return $response;
            }
            if (!empty($Row['company_logo']) && file_exists(APP_PATH.'upload/company_logo_temp/'.$Row['company_logo'])){
                $img_path = getimagesize(APP_PATH.'upload/company_logo_temp/'.$Row['company_logo']);    
                $width = $img_path[0];
                $height = $img_path[1];
            }
            else{
                $width = 0;
                $height = 0;
            }
            
            $clientIp = $this->objGeneral->getRealIpAddr();
            $response['response'] = array(
                "token" => $this->objGeneral->set_token($Row['id']) . "?" . $this->objGeneral->set_token($Row['user_email']) . "?" . $this->objGeneral->set_token($Row['user_password_1']) . "?" .  $this->objGeneral->set_token(current_date_time),
                "id" => $Row['id'],
                "user" => $Row['first_name'] . ' ', //.$Row['last_name'],
                "known_as" => $Row['known_as'] . ' ',
                "user_name" => $Row['user_email'],
                "client_ip" =>  $clientIp,
                "user_type" => $Row['user_type'],
                "deparment" => $Row['department'],
                "country_id" => $Row['country_id'],
                "currency_id" => $Row['currency_id'],
                "currency_code" => $Row['currency_code'],
                "decimal_range" => $Row['decimal_range'],
                "date_format" => $Row['date_format'],
                "time_format" => $Row['time_format'],
                "company_logo" => $Row['company_logo'],
                "company_logo_width" => $width,
                "company_logo_height" => $height,
                "company_id" => $Row['company_id'],
                "company_name" => $Row['company_name'],
                "opp_cycle_limit" => $Row['opp_cycle_limit'],
                "text_limit" => 10,
                "timezone" => $Row['timezone'],
                "oop_cycle_edit_role" => $Row['oop_cycle_edit_role'],
                "oppCycleFreqstartmonth" => $Row['oppCycleFreqstartmonth'],
                "show_sales_add_btn" => $Row['show_sales_add_btn'],
                "show_customer_add_btn" => $Row['show_customer_add_btn'],
                "show_supplier_add_btn" => $Row['show_supplier_add_btn']
            );
            if($Row['emp_activity_id'] != '')
            {
                $Sql_update = "UPDATE employee_last_activity SET 
                                    last_activity_time = UNIX_TIMESTAMP(NOW()), 
                                    last_activity_ip='".$this->objGeneral->getRealIpAddr()."', 
                                    password_unsuccessful_attempts = 0,
                                    ChangedBy = ".$Row['id'].",
                                    ChangedOn = UNIX_TIMESTAMP(NOW())
                                WHERE  
                                emp_id=$Row[id]";
                // echo $Sql_update;exit;
                $RS_update = $this->Conn->Execute($Sql_update);
            }
            else
            {
                $Sql_update = "INSERT INTO employee_last_activity SET 
                                    emp_id=".$Row['id'].",
                                    last_activity_time = UNIX_TIMESTAMP(NOW()), 
                                    last_activity_ip='".$this->objGeneral->getRealIpAddr()."', 
                                    password_unsuccessful_attempts = 0,
                                    AddedBy = ".$Row['id'].",
                                    AddedOn = UNIX_TIMESTAMP(NOW())";
                // echo $Sql_update;exit;
                $RS_update = $this->Conn->Execute($Sql_update);
            }


            define('opp_cycle_limit', 10);
            //define('text_limit',12);
            define('currency_name', $Row['currency_name']);

            if ($Row['user_type'] == 1) {
                $result['user_type'] = 1;
                $response['new_data'][] = $result;

            } else if ($Row['user_type'] == 2 || $Row['user_type'] == 3 || $Row['user_type'] == 4) {
                //  $Sql_new = "SELECT er.role_id,er.module_id ,er.permisions  ,er.employee_id FROM employee_roles  er	WHERE er.employee_id='$Row[id]' AND status=1 "; 
                //check Permision
                $Sql_new = "SELECT c.allow_flag,c.name,c.role_id,c.module_id,c.permisions   
                            FROM ref_user_rights c
                            JOIN employee_roles er on er.role_id=c.role_id
                            LEFT JOIN ref_roles rr on rr.id = c.role_id  
                            where  c.status=1 AND rr.status = 1  AND er.employee_id='".$Row['id']."'	";
                //echo $Sql_new;exit;

                $RS_new = $this->Conn->Execute($Sql_new);
                if ($RS_new->RecordCount() > 0) {
                    while ($Row_right = $RS_new->FetchRow()) {
                        $result = array();
                        $result['user_type'] = $Row['user_type'];

                        $result['allow_flag'] = $Row_right['allow_flag'];
                        $result['name'] = $Row_right['name'];
                        $result['r_id'] = $Row_right['role_id'];
                        $result['m_id'] = $Row_right['module_id'];
                        $result['p_id'] = $Row_right['permisions'];
                        //$result['e_id'] = $Row_right['employee_id']; 
                        $response['new_data'][] = $result;
                    }
                }else{
                    $response['new_data'] = array();
                }
            }

            //check Modules		 ,REPLACE(LTRIM(RTRIM(c.name)), ' ', '_') as nname
            //preg_replace('/[^A-Za-z0-9 !@#$%^&*().]/u','', strip_tags());

            $Sql_module = "SELECT   c.* FROM ref_module c order by  c.id ASC ";
            //echo $Sql_module;exit;

            $rsSql_module = $this->Conn->Execute($Sql_module);

            if ($rsSql_module->RecordCount() > 0) {
                while ($RowSql_module = $rsSql_module->FetchRow()) {
                    $result2 = array();
                    $result2['id'] = $RowSql_module['id'];
                    $result2['name'] = $RowSql_module['name'];
                    $result2['parent_id'] = $RowSql_module['parent_id'];
                    $result2['type'] = $RowSql_module['type'];

                    $response['defualt_array'][] = $result2;
                }
            }
            if($days_to_expire < $Row['password_reminder_days'] && $Row['user_type']==5)
            {
                $response['ack'] = 5;
                
                if($days_to_expire == 0)
                {
                    $response['error'] = "Password will expire today, Please reset your password.";
                }
                else if($days_to_expire < 0)
                {
                    if((-1*$days_to_expire) - $Row['password_grace_period'] > 0) 
                        $response['error'] = "Your grace period is over for Password reset ".(abs($days_to_expire)-$Row['password_grace_period'])." days ago, Please reset your password to avoid any inconvenience";
                    else
                        $response['error'] = "Password expired ".abs($days_to_expire)." days ago, Please reset your password within next ".abs(29 - (-1*$days_to_expire) + 1)." days";
                }
                else
                    $response['error'] = "Password will expire in next ".abs($days_to_expire)." days, Please reset your password.";
            }
            else
            {
                $response['ack'] = 1;
                $response['error'] = NULL;
            }
            
        } else {
            $response['ack'] = 0;
            $response['response'] = 0;
            $response['error'] = "Invalid login credentials";
            
            $Sql1 = "SELECT e.id, e.allow_login, e.status, ela.password_unsuccessful_attempts, c.account_lock_attempts
                        FROM employees as e
                        LEFT JOIN company as c ON c.id = e.user_company 
                        LEFT JOIN employee_last_activity as ela ON ela.emp_id = e.id
                        WHERE 
                            e.user_email='" . $attr['user_name'] . "'";
            // echo $Sql1;exit;
            $RS1 = $this->Conn->Execute($Sql1);
            if ($RS1->RecordCount() > 0) {
                if($RS1->fields['allow_login'] > 0 && $RS1->fields['status'] == 1)
                {
                    if($RS1->fields['password_unsuccessful_attempts'] >= $RS1->fields['account_lock_attempts']-1)
                    {
                        $Sql_update = "UPDATE employees SET 
                                        allow_login = 0 WHERE id=".$RS1->fields['id'].' AND user_type <> 1';
                        $RS_update = $this->Conn->Execute($Sql_update);
                        $response['account_locked'] = 1; 
                        $response['account_lock_attempts'] = $RS1->fields['account_lock_attempts']; 
                    }
                    else
                    {
                        $Sql_update = "UPDATE employee_last_activity SET password_unsuccessful_attempts = password_unsuccessful_attempts + 1
                                        WHERE emp_id=".$RS1->fields['id'];
                        // echo $Sql_update;exit;
                        $RS_update = $this->Conn->Execute($Sql_update);
                        $response['password_attempts'] = $RS1->fields['password_unsuccessful_attempts'] + 1;
                        $response['account_lock_attempts'] = $RS1->fields['account_lock_attempts'];
                    }
                }
                else
                {
                    $response['error'] = "Login not allowed, Please contact your administrator";
                }
            }
            $sql_activity = "INSERT INTO employee_activity SET
                                    user_name = '".$attr['user_name']."',
                                    password = '$org_password',
                                    login_time = UNIX_TIMESTAMP(NOW()),
                                    login_ip = '".$this->objGeneral->getRealIpAddr()."',
                                    is_successful = 4";
            $this->Conn->Execute($sql_activity);
            return $response;
        }

        if (empty($response['defualt_array'])) {//empty($response['new_data']) || 

            $response['response'] = 0;
            $response['ack'] = 3;
            $response['error'] = "No Roles Assigned.";
        }
        $sql_activity = "INSERT INTO employee_activity SET
                                    emp_id = ".$Row['id'].",
                                    company_id = ".$Row['company_id'].",
                                    login_time = UNIX_TIMESTAMP(NOW()),
                                    login_ip = '".$this->objGeneral->getRealIpAddr()."',
                                    is_successful = 1";
        $this->Conn->Execute($sql_activity);
        return $response;
    }

    function is_valid($token) {
        $this->objGeneral->mysql_clean($token);

        $token_array = explode("?", $token);
        $id = $this->objGeneral->get_token($token_array[0]);
        $user_name = $this->objGeneral->get_token($token_array[1]);
        $password = $this->objGeneral->get_token($token_array[2]);
        $time = $this->objGeneral->get_token($token_array[3]);
        
        /* $Sql = "SELECT e.id, e.user_company, e.user_type,e.first_name,e.last_name ,e.company_id,er.role_id
          ,er.module_id ,er.permisions  ,er.employee_id  FROM	employees  e
          LEFT JOIN employee_roles as er ON er.employee_id = e.id
          WHERE e.id='$id' AND e.user_email='$user_name' LIMIT 1"; */

        $Sql = "SELECT  e.id, e.user_company, e.user_type,e.first_name,e.user_code,
                        e.last_name,e.company_id, ela.last_activity_time, 
                        ela.last_activity_ip,c.name AS companyName
                FROM employees  e
                LEFT JOIN company AS c on c.id = e.company_id 
                LEFT JOIN employee_last_activity AS ela ON ela.emp_id = e.id
                WHERE e.user_email='$user_name' and e.user_password_1='".$password."'";
        // echo $Sql;exit;
        $RS = $this->Conn->Execute($Sql);
        
        if ($RS->RecordCount() == 1) {
            /* if ($fromNode){
                return array(
                    "id" => $RS->fields['id'],
                    "company_id" => $RS->fields['company_id'],
                    "user_type" => $RS->fields['user_type'],
                    "companyName" => $RS->fields['companyName'],
                    "user_no" => $RS->fields['user_code'],
                    "user_name" => $RS->fields['first_name'] . ' ' . $RS->fields['last_name'],
                    "user" => $RS->fields['first_name']
                );
            }
            else{ */
                if($RS->fields['last_activity_time'] + 1440 < current_date_time)// && $user_name != 'Bia.shan@gmail.com'
                {
                    return 2;
                }
                else
                {
                    $Sql_update = "UPDATE employee_last_activity SET last_activity_time = ".current_date_time.", last_activity_ip='".$this->objGeneral->getRealIpAddr()."'
                            WHERE emp_id='$id'";
                    $RS_update = $this->Conn->Execute($Sql_update);
                }

                return array(
                    "id" => $RS->fields['id'],
                    "company_id" => $RS->fields['company_id'],
                    "user_type" => $RS->fields['user_type'],
                    "companyName" => $RS->fields['companyName'],
                    "user_no" => $RS->fields['user_code'],
                    "user_name" => $RS->fields['first_name'] . ' ' . $RS->fields['last_name'],
                    "user" => $RS->fields['first_name']
                );
            // }
        }
        else
            return 0;
    }

    function is_permitted($permissionName, $moduleName, $employeeId){
        //check if user is administrator
        $Sql = "SELECT user_type FROM employees WHERE id='".$employeeId."'";
        $RS = $this->Conn->Execute($Sql);
        if ($RS->fields[0] == 1 || $RS->fields[0] == 2) // user is admin
        return true;

        $permissionId = "";
        if ($permissionName == "Add") $permissionId = 1;
        else if ($permissionName == "Edit") $permissionId = 2;
        else if ($permissionName == "View") $permissionId = 3;
        else if ($permissionName == "Delete") $permissionId = 4;
        else if ($permissionName == "Approved") $permissionId = 5;
        else if ($permissionName == "Convert") $permissionId = 6;
        //$employeeId = 83;
        $Sql_new = "SELECT c.allow_flag,c.name,c.role_id,c.module_id,c.permisions   
                            FROM ref_user_rights c
                            JOIN employee_roles er on er.role_id=c.role_id  
                            where  c.status=1 AND c.name='".$moduleName."' AND c.permisions LIKE '%".$permissionId."%'  AND er.employee_id='".$employeeId."' LIMIT 1	";
                            //echo $Sql_new;exit;
                $RS_new = $this->Conn->Execute($Sql_new);
                if ($RS_new->RecordCount() > 0) {
                    return true;
                }
                else{
                    return false;
                }
    }

    function authentocate($token) {
        /* return;

          $host= gethostname();
          var_dump($host);
          echo "<hr>";
          $ip = gethostbyname($host);
          var_dump($ip);
          echo "<hr>";
          echo $_SERVER['REMOTE_ADDR']."<hr>";
          echo "<pre>";
          print_r(getallheaders());
         */
        //exit;
        if (isset($token->perm)){
            $token_array = explode(".", $token->token);
            $id = $this->objGeneral->get_token($token_array[0]);
            $isPermitted = $this->is_permitted($token->perm,$token->mod,$id);

            if (!$isPermitted){
                $response = array();
                $response['ack'] = 0;
                $response['error'] = "Not Permitted";
                $response['Access'] = 0;
                $response['code'] = 401;
                // header('Content-Type: application/json');
                // header("HTTP/1.1 401 Not Permitted");
                echo json_encode($response);
                exit;
            }
            $response = $this->is_valid($token->token);
        }
        else{
            $response = $this->is_valid($token);
        }
        if ($response == 0)// && ($response['user_type'] == SUPER_ADMIN || $response['user_type'] == COMPANY_ADMIN)) 
        {
            $response = array();
            $response['ack'] = 0;
            $response['error'] = "Access token not verified";
            $response['code'] = 204;

            header('Content-Type: application/json');
            header("HTTP/1.1 204 Access token not verified");
            echo json_encode($response);
            exit;
        }
        else if ($response == 2)
        {
            $response = array();
            $response['ack'] = 0;
            $response['error'] = "Access Forbidden";
            $response['code'] = 403;

            header('Content-Type: application/json');
            header("HTTP/1.1 403 Access Forbidden");
            // header('Location: '.WEB_PATH.'/#/user/login');
            echo json_encode($response);
            exit;
        }
        else if ($response == 3)
        {
            $response = array();
            $response['ack'] = 0;
            $response['g_last_activity_ip'] = $GLOBALS['g_last_activity_ip'];
            
            unset($GLOBALS['g_last_activity_ip']);

            $response['error'] = "Unauthorized";
            $response['code'] = 401;

            header('Content-Type: application/json');
            header("HTTP/1.1 401 Unauthorized");
            // header('Location: '.WEB_PATH.'/#/user/login');
            echo json_encode($response);
            exit;
        }
        return 
            $response;

    }

    function forgot_pw($attr) {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT id, user_name, CONCAT(name,' ', lastname) as empName 
                FROM employee 
                WHERE email='" . $attr['email'] . "' 
                LIMIT 1";

        //echo $Sql."<hr>";exit;
        $RS = $this->Conn->Execute($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = array(
                "name" => $Row['empName'],
                "user_name" => $Row['user_name'],
                "id" => $Row['id']
            );
        } else {
            $response['ack'] = 0;
            $response['error'] = "Email doesn't exists in the system!";
        }
        return $response;
    }

    function check_permission($user_data, $mod_dtl_id) {
        //($user_id, $company_id, $mod_dtl_id)

        /* 	$this->objGeneral->mysql_clean($user_id);
          $this->objGeneral->mysql_clean($company_id);
          $this->objGeneral->mysql_clean($mod_dtl_id);
         */

        $this->e_id = $user_data['e_id'];
        $this->m_id = $user_data['m_id'];
        $this->r_id = $user_data['r_id'];
        $this->p_id = $user_data['p_id'];
        $this->user_type = $user_data['user_type'];
        $this->company_id = $user_data['company_id'];
        $this->user_id = $user_data['id'];


        $response = array();

        //$Sql = "SELECT id FROM  permission WHERE 
        //user_id=".$user_id." AND company_id=".$company_id." AND mod_detail_id=".$mod_dtl_id;

        $Sql = "SELECT count(id) as result
                FROM employee_roles as er 
                WHERE company_id=$this->company_id AND 
                      er.module_id=$mod_dtl_id AND 
                      er.employee_id=$this->e_id
                LIMIT 1";

        // AND er.role_id=$this->r_id  AND er.permisions IN( $this->p_id) 
        $RS = $this->Conn->Execute($Sql);
        $total = $RS->fields['result'];

        if ($total == 0) {
            //if($RS->RecordCount()==0){
            $response['ack'] = 0;
            $response['error'] = "You don't have sufficient rights!";
        } else {
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
        //	print_r($response);
        return $response;
    }

    
    function getToken($user_name, $password)
    {
        $response = array();
		$password = $this->objGeneral->encrypt_password_1($password);
		// $password = $this->objGeneral->encrypt_password_1($password);
		//echo $attr['password']; exit;

        $Sql = "SELECT  emp.company_id,
                        emp.id,emp.user_type,
                        emp.user_email,  
                        emp.user_password_1,
                        emp.first_name,emp.last_name 
                 FROM employees as emp
                 JOIN company as comp ON comp.id = emp.user_company
                 LEFT JOIN currency ON currency.id = comp.currency_id
                 WHERE  emp.user_email='" . $user_name . "' 	AND 
                        emp.user_password='" . $password . "' 
                 LIMIT 1";
        // echo $Sql;exit;
        $RS = $this->Conn->Execute($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            if ($Row['user_type'] == 0) {
                $response['response'] = 0;
                $response['ack'] = 0;
                $response['error'] = "Invalid login credentials";
                return $response;
            }
            $tok = "";
            $tok = $this->objGeneral->set_token($Row['id']) . "?" . $this->objGeneral->set_token($Row['user_email']). "?" . $this->objGeneral->set_token($Row['user_password_1']). "?" . $this->objGeneral->set_token(current_date_time);
            
            // echo current_date_time;exit;
            $response['response'] = array(
                "token" => $tok,
                "id" => $Row['id'],
                "user" => $Row['first_name'] . ' ', //.$Row['last_name'],
                "user_name" => $Row['user_email'],
                "user_type" => $Row['user_type'],
                "deparment" => $Row['department']
            );

        }
        return $response;
    }

}

?>