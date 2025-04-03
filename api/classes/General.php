<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/QueryMaster.php");

class General extends Xtreme
{
    private $Conn = null;
    public static $my_static = 'foo';
    private $arrUser = null;
    private $objQueryMaster = null;

    function __construct($user_info = array())
    {
        /* if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) ob_start("ob_gzhandler"); else ob_start();

          // var_dump(gzcompress($testclass));
          //gzcompress a string
          $compressed   = gzcompress('Compress me', 9);
          echo $compressed."<br />";
          //gzuncompress a string
          $uncompressed = gzuncompress($compressed);
          echo $uncompressed."<br />";
         */
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->arrUser = $user_info;
        $this->objQueryMaster = new QueryMaster($user_info);
    }

    function count_result($table, $unit, $id)
    {
        $sql_total = "SELECT  count(id) as total	FROM $table    WHERE  $unit = $id  Limit 1";
        $rs_count = $this->objQueryMaster->CSI($sql_total);
        return $rs_count->fields['total'];
    }

    function mysql_clean(&$attr)
    {
        if (is_scalar($attr)) {
            require_once(SERVER_PATH . "/classes/Encoding.php");
            $objEncoding = new Encoding();
            $attr = $objEncoding->fixUTF8($attr);
            $attr = trim(addslashes(stripslashes($attr)));
        }
        else if (is_array($attr) || is_object($attr)){
            foreach ($attr as $key => &$value) {
                $this->mysql_clean($value);
            }
        }
    }

    function clean_single_variable($string)
    {
        return trim(addslashes(strip_tags($string)));
        //return trim(stripslashes(strip_tags($string)));
    }

    function get_unique_id_from_db($string)
    {
        $Sql1 = "Select UUID() as unique_id LIMIT 1";
        //echo $Sql1;exit;
        $RS = $this->objQueryMaster->CSI($Sql1);
        return $RS->fields['unique_id'];
    }

	function encrypt_password_1($password){
        // $hashed = crypt($password, '$6$rounds=5000'.SECRET_SALT); 
        $hashed = crypt($password, '$2y$12$'.SECRET_SALT);
        return $hashed;
    }

	function encrypt_password($password){
		$key = hash('sha256', SECRET_KEY);
        $iv = substr(hash('sha256', SECRET_IV), 0, 16);
        $output = openssl_encrypt($password, SECRET_METHOD, $key, 0, $iv);
        $output = base64_encode($output);
        return $output;
	}
	
	function decrypt_password($string){
        // at this point, we are not using this function anymore. Any login information is encrypted and then matched.
        // return $string;
        $key = hash('sha256', SECRET_KEY);
        $iv = substr(hash('sha256', SECRET_IV), 0, 16);
        $output = openssl_decrypt(base64_decode($string), SECRET_METHOD, $key, 0, $iv);
        return $output;
    }
		
    function set_token($string)
    {
        $key = hash('sha256', SECRET_KEY);
        $iv = substr(hash('sha256', SECRET_IV), 0, 16);
        $output = openssl_encrypt($string, SECRET_METHOD, $key, 0, $iv);
        $output = base64_encode($output);
        return $output;
    }

    function get_token($string)
    {
        $key = hash('sha256', SECRET_KEY);
        $iv = substr(hash('sha256', SECRET_IV), 0, 16);
        $output = openssl_decrypt(base64_decode($string), SECRET_METHOD, $key, 0, $iv);
        return $output;
    }

    function remove_empty_values($data_basic)
    {
        // echo "UPDATE employees SET ";
        $data_specific = array();
        foreach ($data_basic as $key => $value) {
            //  if (isset($value) && !empty($value))
            if (empty($value)) {
                $data_specific[$key] = NULL;
            } else {
                $data_specific[$key] = $value;
                //echo $key."='".$value."',";
            }
        }
        //convert array into string
        //$keys = http_build_query($data_specific,',');
        //$keyss = str_replace(  array('&'),',',$keys);
        return $data_specific;
        // echo "WHERE id = ".$employee_id."  Limit 1";
    }

    function run_query_exception($Sql)
    {
        try { //'success';
            $RS = $this->objQueryMaster->CSI($Sql);
            if ($RS && $this->Conn->Affected_Rows() > 0) {
                $response['id'] = $this->Conn->Insert_ID();;
                $response['ack'] = 1;
                $response['tab_change'] = 'tab_doc';
                $response['error'] = NULL;
            }
            if (!$RS && $this->Conn->Affected_Rows() == 0)
                throw new Exception("Record Already Exists");
        } //catch exception
        catch (Exception $e) { //'error';
            $response['ack'] = 0;
            $response['error'] = $e->getMessage();
        }
        return $response;
    }

    function emptyToZero($input){
        // written by Ahmad, purpose is to convert integar values from empty to 0 to make it acceptable for Database
        if (trim($input) == ""){
            return 0;
        }
        else return $input;
    }

    function any_query_exception($Sql)
    {
        try {
            $RS = $this->objQueryMaster->CSI($Sql);
            // if ($RS && $this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            // }
            if (!$RS && $this->Conn->Affected_Rows() == 0)
                throw new Exception("Record not Update");
        } //catch exception
        catch (Exception $e) {
            $response['ack'] = 0;
            $response['error'] = $e->getMessage();
        }
        return $response;
    }

    function module_item_prefix($id)
    {
        $count_id = strlen($id);
        switch ($count_id) {
            case 1:
                $id = '00' . $id;
                break;
            case 2:
                $id = '0' . $id;
                break;
            default :
                $id = $id;
                break;
        }
        return $id;
    }

    function set_db_date_format($date)
    {
        $set_date = date('Y-m-d');
        if (!empty($date)) {
            if (intval(strpos($date, '/')) > 0) {
                $strDate = str_replace('/', '-', $date);
                $set_date = date("Y-m-d", strtotime($strDate));
            } else if (intval(strpos($date, 'Z')) > 0) {
                $strDate = date("Y-m-d", strtotime($date));
                $strDate = strtotime($strDate);
                $set_date = date('Y-m-d', strtotime("+1 day", $strDate));
            } else if (is_numeric($date)) {
                $set_date = date("Y-m-d", $date);
            } else {
                $set_date = $date;
            }
        }
        return $set_date;
    }

    function convert_date($date)
    {
        $timezone = 'Europe/London';
        
        if ($date) {

            $start_date = date('Y-m-d');

            if (!empty($date)) {
                
                if (strpos($date, '/') == true) {
                    $date2 = str_replace('/', '-', $date);
                    $start_date = date("Y-m-d h:i:s", strtotime($date2));
                } else
                    $start_date = $date;
            }
            // return $date = strtotime($start_date . ' ' . $timezone);
            
            $date = strtotime($start_date);
            $date = floor($date/86400)*86400;
            return $date; 
            
        } else
            return $date = 0;
            
        return $date;
    }

    function convertStartDate($date)
    {
        $timezone = 'Europe/London';
        
        if ($date) {
            $start_date = date('Y-m-d');

            if (!empty($date)) {

                if (strpos($date, '/') == true) {
                    $date2 = str_replace('/', '-', $date);

                //    echo  $start_date = date("Y-m-d h:i:s", strtotime($date2. ' 12:00:00 A'));
                   /* echo  $start_date = date("Y-m-d h:i:s A", strtotime($date2. ' 12:00:00'));
                   echo '<br/>';
                   echo  $start_date2 = date("Y-m-d h:i:s A", strtotime($date2. ' 23:59:59'));

                   echo '<br/>'; */

                  return $start_date2 = date("Y-m-d", strtotime($date2));

                    // echo $start_date = gmdate('Y-m-d 00:00:00',strtotime($date2));
                } else
                    $start_date = $date;
            }
            // $date = strtotime($start_date. ' ' . $timezone);
            // echo '<br/>';
            // $date = strtotime($start_date. ' ' . $timezone);

            // return $date = strtotime($start_date . ' 00:00:00');
            // return $date = strtotime($start_date. ' ' . $timezone);
            return $date = strtotime($start_date2);

        } else
            return $date = 0;
            
        return $date;
    }

    function convertEndDate($date)
    {
        $timezone = 'Europe/London';        

        if ($date) {
            $end_date = date('Y-m-d');

            if (!empty($date)) {
                if (strpos($date, '/') == true) {
                    $date2 = str_replace('/', '-', $date);

                    // $end_date = date("Y-m-d h:i:s", strtotime($date2. ' 11:59:59 P'));
                   return $end_date = date("Y-m-d", strtotime($date2));
                } else
                    $end_date = $date;
            }
            
            // echo '<br/>';
        //    echo  $date = strtotime($end_date);exit;
        //    echo  $date = strtotime($end_date. ' ' . $timezone);exit;
            // return $date = strtotime($end_date . ' ' . $timezone);
            return $date = strtotime($end_date);

        } else
            return $date = 0;
            
        return $date;
    }

    function convertUnixIntoYMD_FormateDate($date)
    {        
        // ini_set('date.timezone', 'Europe/London');
        // date_default_timezone_set('Europe/London');
        $timezone = 'Europe/London';
        if (abs($date) > 0){
            global $input;
            $serverOffset = date('Z');
            $date = $date + ($serverOffset * -1);
            $date = $date + (($input->interceptorHeaders->timezone * 60) * -1);
            return date('Y-m-d', $date);// . ' ' . $timezone);
        }            
        else
            return '';
    }

    function convert_unix_into_date($date)
    {        
        // ini_set('date.timezone', 'Europe/London');
        // date_default_timezone_set('Europe/London');
        $timezone = 'Europe/London';
        if (abs($date) > 0){
            global $input;
            $serverOffset = date('Z');
            $date = $date + ($serverOffset * -1);
            $date = $date + (($input->interceptorHeaders->timezone * 60) * -1);
            return date('d/m/Y', $date);// . ' ' . $timezone);
        }            
        else
            return '';
    }

    function convert_unix_into_datetime($date)
    {        
        $timezone = 'Europe/London';

        if (abs($date) > 0) {
            global $input;
            $serverOffset = date('Z');
            $date = $date + ($serverOffset * -1);
            $date = $date + (($input->interceptorHeaders->timezone * 60) * -1);
            return date('d/m/Y - H:i:s', $date);// . ' ' . $timezone);
        }
        else
            return '';
    }

    function convertUnixDateIntoConvDate($date)
    {
        if ($date > 0){
            if (strpos($date, '/') == true) {
                $date2 = str_replace('/', '-', $date);
                return date("Y-m-d", strtotime($date2));
            }
        } 
        else
            return '';
    }

    function save_query_format($str, $type)
    {
        if ($type == 1)
            $newstr = addslashes($str);
        else if ($type == 2)
            $newstr = stripslashes($str);
        return $newstr;
    }

    function get_convert_price($standard_price, $currency_id, $or_date, $company_id)
    {
        $Sql = "SELECT d.conversion_rate  
                FROM currency_histroy d
                left  JOIN company on company.id=d.company_id
                WHERE d.currency_id=$currency_id AND  
                     (d.start_date <= '" . $this->convert_date($or_date) . "')	AND 
                     (d.company_id='" . $company_id . "' or  
                      company.parent_id='" . $company_id . "')
                order by d.start_date DESC, d.action_date desc
                LIMIT 1  ";

        //echo $Sql; exit;
        //	and  ('" . $this->convert_date($or_date)	. "' between d.start_date and d.end_date)				
        $rs_count = $this->objQueryMaster->CSI($Sql);

        if ($rs_count->RecordCount() > 0) {
            if (!empty($standard_price))
                $rate = $standard_price / $rs_count->fields['conversion_rate'];
            else
                $rate = $rs_count->fields['conversion_rate'];
        } else
            $rate = 0;
        return $rate;
    }

    // new function
    function set_sync_data_general_location($arr_attr, $crm_id, $type, $company_id)
    {
        $add_sub_query = "";

        if ($arr_attr['is_billing_address'] != 0 || $arr_attr['is_shipping_address'] != 0 || $arr_attr['is_invoice_address'] != 0) {

            if ($arr_attr['is_billing_address'] != 0)
                $add_sub_query = "is_billing_address=0 ,";

            if ($arr_attr['is_shipping_address'] != 0)
                $add_sub_query .= "is_shipping_address=0 ,";

            if ($arr_attr['is_invoice_address'] != 0)
                $add_sub_query .= "is_invoice_address=0 ,";

            $add_sub_query = substr($add_sub_query, 0, strlen($add_sub_query) - 1);

            $Sql1 = "UPDATE crm_alt_depot 
                                SET  
                                    " . $add_sub_query . " 
                                WHERE crm_id= '" . $crm_id . "'  and 
                                      company_id='" . $company_id . "'";

            $RS = $this->objQueryMaster->CSI($Sql1);
            if ($type == 2) {
                $Sql1 = "UPDATE crm  SET  " . $add_sub_query . " WHERE  id= '" . $crm_id . "'  and company_id='" . $company_id . "' limit 1";
                $RS = $this->objQueryMaster->CSI($Sql1);
            }
        }
        return true;
    }

    function check_duplication_for_location_address($arr_attr, $acc_id, $module_type, $company_id, $update_id, $Recordflag)
    {
        // print_r($update_id);exit;
        $add_sub_query = "";
        $update_case = "";
        if ($update_id > 0)
            $update_case = "and id != $update_id";

        if ($arr_attr['is_billing_address'] != 0 || $arr_attr['is_invoice_address'] != 0) {

            if ($arr_attr['is_billing_address'] != 0 && $arr_attr['is_invoice_address'] != 0) {

                $MultiChkBILLSql = " SELECT depot  
                                     FROM alt_depot   
                                     WHERE  acc_id= '" . $acc_id . "' and status = 1 and 
                                            module_type= '" . $module_type . "' and  
                                            is_billing_address=1  and 
                                            company_id='" . $company_id . "' 
                                            " . $update_case . "  
                                     LIMIT 1";

                //echo $MultiChkBILLSql; exit;
                $MultiChkBILLRS = $this->objQueryMaster->CSI($MultiChkBILLSql);
                $billing_rec = $MultiChkBILLRS->RecordCount();

                if ($billing_rec > 0)
                    $billing_location = $MultiChkBILLRS->fields['depot'];


                $MultiChkPaySql = "  SELECT depot 
                                     FROM alt_depot  
                                     WHERE  acc_id= '" . $acc_id . "' and status = 1 and
                                            module_type= '" . $module_type . "' and  
                                            is_invoice_address=1  and 
                                            company_id='" . $company_id . "' 
                                            " . $update_case . "   
                                     LIMIT 1";
                
                //echo $MultiChkPaySql; exit;
                $MultiChkPayRS = $this->objQueryMaster->CSI($MultiChkPaySql);

                $payment_rec = $MultiChkPayRS->RecordCount();
                if(isset($Recordflag) && $Recordflag==1)
                {
                    $response['billing']=$billing_rec;
                    $response['payment']=$payment_rec;
                    return $response;
                }
                if ($payment_rec > 0)
                    $payment_location = $MultiChkPayRS->fields['depot'];
                    
                if ($billing_rec > 0 && $payment_rec > 0)
                    return $location = "The Billing and Payment options are already selected for '" . $billing_location . "' & '" . $payment_location . "', please untick Billing and Payment for the respective locations  before you can set this location for Billing and Payment";
                elseif ($billing_rec > 0)
                    return $location = "The Billing option is already selected for '" . $billing_location . "',
                                        please untick Billing option for '" . $billing_location . "'
                                        before you can set this location for Billing."; 
                elseif ($payment_rec > 0)
                    return $location = "The Payment option is already selected for '" . $payment_location . "',
                                        please untick payment option for '" . $payment_location . "'
                                        before you can set this location for Payment.";                      
            }

            if ($arr_attr['is_billing_address'] != 0) {

                // $add_sub_query .= " is_billing_address=1 OR";
                $billing_Sql = " SELECT depot  
                                     FROM alt_depot   
                                     WHERE  acc_id= '" . $acc_id . "' and status = 1 and
                                            module_type= '" . $module_type . "' and  
                                            is_billing_address=1  and 
                                            company_id='" . $company_id . "' 
                                            " . $update_case . "  
                                     LIMIT 1";

                $billing_RS = $this->objQueryMaster->CSI($billing_Sql);

                if(isset($Recordflag) && $Recordflag==1)
                    {
                       $response['billing']=$billing_RS->RecordCount();
                       $response['payment']=0;
                       return $response;
                    }   
                if ($billing_RS->RecordCount() > 0)
                    return $location = "The Billing option is already selected for '" . $billing_RS->fields['depot'] . "',
                                        please untick Billing option for '" . $billing_RS->fields['depot'] . "'
                                        before you can set this location for Billing.";
            }

            if ($arr_attr['is_invoice_address'] != 0) {

                $invoice_Sql = "  SELECT depot 
                                     FROM alt_depot  
                                     WHERE  acc_id= '" . $acc_id . "' and status = 1 and
                                            module_type= '" . $module_type . "' and  
                                            is_invoice_address=1  and 
                                            company_id='" . $company_id . "' 
                                            " . $update_case . "   
                                     LIMIT 1";
                $invoice_RS = $this->objQueryMaster->CSI($invoice_Sql);

                if(isset($Recordflag) && $Recordflag==1)
                    {
                       $response['billing']=0;
                       $response['payment']=$invoice_RS->RecordCount();
                       return $response;
                    }   
                if ($invoice_RS->RecordCount() > 0)
                    return $location = "The Payment option is already selected for '" . $invoice_RS->fields['depot'] . "',
                                        please untick payment option for '" . $invoice_RS->fields['depot'] . "'
                                        before you can set this location for Payment.";
            }
        }
        return $location = 0;
    }

    
    function duplication_for_location_address_check($arr_attr, $acc_id, $module_type, $company_id=0, $update_id=0)
    {

        $add_sub_query = "";
        $update_case = "";

        if ($update_id > 0)
            $update_case = "and id != $update_id";

        if ($arr_attr['is_billing_address'] != 0 || $arr_attr['is_invoice_address'] != 0) {
             
            if ($arr_attr['is_billing_address'] != 0 && $arr_attr['is_invoice_address'] != 0) {

                $MultiChkBILLSql = " SELECT depot    
                                    FROM alt_depot   
                                    WHERE   acc_id= '" . $acc_id . "'  and 
                                            module_type= '" . $module_type . "' and 
                                            is_billing_address=1  and 
                                            company_id='" . $company_id . "' 
                                            " . $update_case . "  
                                    LIMIT 1";
                $MultiChkBILLRS = $this->objQueryMaster->CSI($MultiChkBILLSql);
                $billing_rec = $MultiChkBILLRS->RecordCount();

                if ($billing_rec > 0)
                    $billing_location = $MultiChkBILLRS->fields['depot'];


                $MultiChkPaySql = " SELECT depot    
                                    FROM alt_depot  
                                    WHERE   acc_id= '" . $acc_id . "' and 
                                            module_type= '" . $module_type . "' and  
                                            is_invoice_address=1 and 
                                            company_id='" . $company_id . "' 
                                            " . $update_case . "   
                                    LIMIT 1";

                $MultiChkPayRS = $this->objQueryMaster->CSI($MultiChkPaySql);

                $payment_rec = $MultiChkPayRS->RecordCount();
                if ($payment_rec > 0)
                    $payment_location = $MultiChkPayRS->fields['depot'];
                    
                if ($billing_rec > 0 && $payment_rec > 0)
                    return $location = "The Billing and Payment options are already selected for '" . $billing_location . "' & '" . $payment_location . "', please untick Billing and Payment for the respective locations  before you can set this location for Billing and Payment";
                elseif ($billing_rec > 0)
                    return $location = "The Billing option is already selected for '" . $billing_location . "',
                                        please untick Billing option for '" . $billing_location . "'
                                        before you can set this location for Billing."; 
                elseif ($payment_rec > 0)
                    return $location = "The Payment option is already selected for '" . $payment_location . "',
                                        please untick payment option for '" . $payment_location . "'
                                        before you can set this location for Payment."; 

                return $location = 0;
            }

            if ($arr_attr['is_billing_address'] != 0) {

                $billing_Sql = "SELECT depot
                                FROM alt_depot   
                                WHERE   acc_id= '" . $acc_id . "' and
                                        module_type= '" . $module_type . "' and  
                                        is_billing_address=1  and 
                                        company_id='" . $company_id . "' 
                                        " . $update_case . "    
                                LIMIT 1";
                $billing_RS = $this->objQueryMaster->CSI($billing_Sql);

                if ($billing_RS->RecordCount() > 0)
                {
                    if(isset($Recordflag) && $Recordflag==1)
                    {
                       $response['billing']=$billing_RS->RecordCount();
                       $response['payment']=0;
                       return $response;
                    }   
                    return $location = "The Billing option is already selected for '" . $billing_RS->fields['depot'] . "',
                                        please untick Billing option for '" . $billing_RS->fields['depot'] . "'
                                        before you can set this location for Billing.";
                                       
                }
            }            

            if ($arr_attr['is_invoice_address'] != 0) {

                $invoice_Sql = "SELECT depot        
                                FROM alt_depot
                                WHERE   acc_id= '" . $acc_id . "' and 
                                        module_type= '" . $module_type . "' and 
                                        is_invoice_address=1  and 
                                        company_id='" . $company_id . "' 
                                        " . $update_case . "
                                LIMIT 1";
                $invoice_RS = $this->objQueryMaster->CSI($invoice_Sql);

                if ($invoice_RS->RecordCount() > 0){
                    if(isset($Recordflag) && $Recordflag==1)
                    {
                       $response['billing']=0;
                       $response['payment']=$invoice_RS->RecordCount();
                       return $response;
                    }
                    return $location = "The Payment option is already selected for '" . $invoice_RS->fields['depot'] . "',
                                        please untick payment option for '" . $invoice_RS->fields['depot'] . "'
                                        before you can set this location for Payment.";
                }
            }
        }
        return $location = 0;
    } 

    function count_duplicate_in_sql($table, $data, $company_id)
    {
        // BY AHMAD
        // Added BINARY CLAUSE inside below query to make the match case sensitive
        // For example: Payment Method called "bacs" can't be updated to "BACS" because it was a duplicate
        // Now, "bacs" and "BACS" both will be treated as separate entries..
        $sql_total = "SELECT  count(tst.id) as total	
                      FROM $table as tst
                      LEFT JOIN company on company.id=tst.company_id 
                      WHERE $data AND  
                            tst.status=1 AND
                            tst.company_id=" . $company_id . " Limit 1";
        // echo $sql_total;exit;

        $rs_count = $this->objQueryMaster->CSI($sql_total);

        if ($rs_count->fields['total'] > 0) {
            return $total = $rs_count->fields['total'];
        } else
            return 0;
    }

    function getDuplicateRecordID($table, $data, $company_id)
    {
        $sql_total = "SELECT  tst.id as recid	
                      FROM $table as tst
                      LEFT JOIN company on company.id=tst.company_id 
                      WHERE $data AND  
                            tst.status=1 AND
                            (tst.company_id=" . $company_id . " or  
                             company.parent_id=" . $company_id . ")
                      Limit 1";
        // echo $sql_total;exit;

        $rs_count = $this->objQueryMaster->CSI($sql_total);

        if ($rs_count->fields['recid'] > 0) {
            return $total = $rs_count->fields['recid'];
        } else
            return 0;
    }

    function current_stock_counter($company_id, $type)
    {
        $po = " IFNULL((SELECT sum(wa.quantity * wa.unit_measure_qty) 
                        FROM warehouse_allocation as wa 
                        WHERE wa.purchase_return_status = 0 AND 
                              wa.status = 1 AND 
                              wa.type = 1 AND 
                              wa.purchase_status in (2,3) AND 
                              (wa.raw_material_out IS NULL OR wa.raw_material_out =0) AND   
                              wa.product_id =product.id and 
                              wa.company_id=$company_id),0)";
        
        $poRawMaterialConsumed = " IFNULL((SELECT sum(wa.quantity) 
                                            FROM warehouse_allocation as wa 
                                            WHERE wa.purchase_return_status = 0 AND 
                                                wa.status = 1 AND 
                                                wa.type = 1 AND 
                                                wa.product_id =prd.id AND 
                                                wa.raw_material_out =1 AND 
                                                wa.company_id=$company_id),0)";

        $pr = " IFNULL((SELECT sum(pr.quantity * pr.unit_measure_qty) 
                        FROM warehouse_allocation as pr 
                        WHERE pr.purchase_return_status = 1 AND 
                              pr.status = 1 AND 
                              pr.type = 1 AND 
                              pr.purchase_status IN (2,3) AND 
                              pr.product_id = product.id and 
                              pr.company_id=$company_id ),0)";

        $so = " IFNULL((SELECT sum(so.quantity * so.unit_measure_qty) 
                        FROM warehouse_allocation as so 
                        WHERE so.sale_return_status = 0 AND 
                              so.status = 1 AND 
                              so.type IN (2,3) AND 
                              so.sale_status =2 AND 
                              so.product_id = product.id and 
                              so.company_id=$company_id ),0) "; 
        // only allocated
        $soa = " IFNULL((SELECT sum(so.quantity * so.unit_measure_qty) 
                        FROM warehouse_allocation as so 
                        WHERE so.sale_return_status = 0 AND 
                              so.status = 1 AND 
                              so.type = 2 AND 
                              so.sale_status = 1 AND 
                              so.product_id = product.id and 
                              so.company_id=$company_id ),0) "; 

        $sr = " IFNULL((SELECT sum(sr.quantity * sr.unit_measure_qty) 
                        FROM warehouse_allocation as sr 	
                        WHERE sr.sale_return_status = 1 AND 
                              sr.status = 1 AND 
                              sr.type IN (2,3) AND 
                              sr.sale_status =2 AND 
                              sr.product_id = product.id and 
                              sr.company_id=$company_id ),0) ";

        $ob = " IFNULL((SELECT sum(sr.qty) 
                        FROM opening_balance_stock AS sr 	
                        WHERE sr.postStatus =1 AND 
                              sr.productID = product.id and 
                              sr.company_id=$company_id ),0) ";

        $p_positiveLedgerEntry = " IFNULL((SELECT sum(sr.quantity) 
                                            FROM warehouse_allocation as sr 	
                                            WHERE sr.ledger_type = 1 AND 
                                                sr.status = 1 AND 
                                                sr.type = 3 AND 
                                                sr.journal_status = 2 AND
                                                sr.product_id = product.id and 
                                                sr.company_id=$company_id ),0) ";

        $p_negativeLedgerEntry = " IFNULL((SELECT sum(sr.quantity) 
                                            FROM warehouse_allocation as sr 	
                                            WHERE sr.ledger_type = 2 AND 
                                                sr.status = 1 AND 
                                                sr.type = 3 AND 
                                                sr.journal_status = 2 AND
                                                sr.product_id = product.id AND  
                                                sr.company_id=$company_id ),0) ";

        //define('current_stock'," $po - ($pr  + $so)+ $sr  as current_stock ");
        // return "$po - ($pr  + $so)+ $sr  as current_stock";
        return "$po + $ob + $p_positiveLedgerEntry + $sr - ($poRawMaterialConsumed + $pr + $so + $p_negativeLedgerEntry)  as current_stock";
    }

    function current_stock_counter_warehouse($company_id, $wh_id)
    {
        $po = " IFNULL((SELECT sum(wa.quantity * wa.unit_measure_qty) 
                        FROM warehouse_allocation as wa 
                        WHERE wa.purchase_return_status = 0 AND 
                              wa.status = 1 AND 
                              wa.type = 1 AND 
                              wa.purchase_status in (2,3) AND 
                              wa.product_id =prd.id  AND
                              (prd.rawMaterialProduct IS NULL OR prd.rawMaterialProduct =0) AND                                 
                              wa.warehouse_id = '$wh_id' AND 
                              wa.company_id=$company_id),0)";

        $poRawMaterial = " IFNULL((SELECT sum(wa.quantity * wa.unit_measure_qty) 
                                    FROM warehouse_allocation as wa 
                                    WHERE wa.purchase_return_status = 0 AND 
                                        wa.status = 1 AND 
                                        wa.type = 1 AND 
                                        wa.purchase_status in (2,3) AND 
                                        wa.product_id =prd.id AND 
                                        prd.rawMaterialProduct = 1 AND 
                                        wa.raw_material_out IS NULL AND
                                        wa.warehouse_id = '$wh_id' AND   
                                        wa.company_id=$company_id),0)";

        $poRawMaterialConsumed = " IFNULL((SELECT sum(wa.quantity) 
                                            FROM warehouse_allocation as wa 
                                            WHERE wa.purchase_return_status = 0 AND 
                                                wa.status = 1 AND 
                                                wa.type = 1 AND 
                                                wa.product_id =prd.id AND 
                                                prd.rawMaterialProduct = 1 AND 
                                                wa.raw_material_out =1 AND
                                                wa.warehouse_id = '$wh_id' AND  
                                                wa.company_id=$company_id),0)";

        $pr = " IFNULL((SELECT sum(pr.quantity * pr.unit_measure_qty) 
                        FROM warehouse_allocation as pr 
                        WHERE pr.purchase_return_status = 1 AND 
                              pr.status = 1 AND 
                              pr.type = 1 AND 
                              pr.purchase_status IN (2,3) AND 
                              pr.product_id = prd.id and 
                              pr.warehouse_id = '$wh_id' AND 
                              pr.company_id=$company_id ),0)";
        
        // get all sales order which are only allocated from purchase order/credit note, opening balance is handled directly by allocated_qty
        $so = " IFNULL((SELECT sum(so.quantity * so.unit_measure_qty) 
                        FROM warehouse_allocation as so 
                        WHERE so.sale_return_status = 0 AND 
                              so.status = 1 AND 
                              so.type = 2 AND 
                              (so.opBalncID = 0 OR so.opBalncID IS NULL) AND
                              so.sale_status IN (2,3) AND 
                              so.product_id = prd.id and 
                              so.warehouse_id = '$wh_id' AND 
                              so.company_id=$company_id ),0) "; 

        $sr = " IFNULL((SELECT sum(sr.quantity * sr.unit_measure_qty) 
                        FROM warehouse_allocation as sr 	
                        WHERE sr.sale_return_status = 1 AND 
                              sr.status = 1 AND 
                              sr.type = 2 AND 
                              sr.sale_status IN (2,3) AND 
                              sr.product_id = prd.id and 
                              sr.warehouse_id = '$wh_id' AND 
                              sr.company_id=$company_id ),0) ";

        $ob = " IFNULL((SELECT SUM(sr.qty)-SUM(sr.allocated_qty) 
                        FROM opening_balance_stock as sr 	
                        WHERE
                              sr.productID = prd.id and 
                              sr.warehouseID = '$wh_id' AND 
                              sr.postStatus = 1 AND
                              sr.company_id=$company_id ),0) ";
        
        $ij_positive = " IFNULL((SELECT sum(sr.quantity * sr.unit_measure_qty) 
                        FROM warehouse_allocation as sr 	
                        WHERE sr.ledger_type = 1 AND 
                              sr.status = 1 AND 
                              sr.journal_status = 2 AND 
                              sr.type = 3 AND 
                              sr.product_id = prd.id and 
                              sr.warehouse_id = '$wh_id' AND 
                              sr.company_id=$company_id ),0) ";
        
        // get all sales order which are only allocated from purchase order/credit note, opening balance is handled directly by allocated_qty
        $ij_negative = " IFNULL((SELECT sum(sr.quantity * sr.unit_measure_qty) 
                        FROM warehouse_allocation as sr 	
                        WHERE sr.ledger_type = 2 AND 
                              sr.status = 1 AND 
                              sr.journal_status = 2 AND 
                              sr.type = 3 AND 
                              sr.product_id = prd.id and 
                              (sr.opBalncID = 0 OR sr.opBalncID IS NULL) AND
                              sr.warehouse_id = '$wh_id' AND 
                              sr.company_id=$company_id ),0) ";

        $to_positive = " IFNULL((SELECT sum(sr.quantity * sr.unit_measure_qty) 
                        FROM warehouse_allocation as sr 	
                        WHERE sr.ledger_type = 1 AND 
                              sr.status = 1 AND 
                              sr.journal_status = 2 AND 
                              sr.type = 5 AND 
                              sr.product_id = prd.id and 
                              sr.warehouse_id = '$wh_id' AND 
                              sr.company_id=$company_id ),0) ";
        // get all sales order which are only allocated from purchase order/credit note, opening balance is handled directly by allocated_qty
        $to_negative = " IFNULL((SELECT sum(sr.quantity * sr.unit_measure_qty) 
                        FROM warehouse_allocation as sr 	
                        WHERE sr.ledger_type = 2 AND 
                              sr.status = 1 AND 
                              sr.journal_status = 2 AND 
                              sr.type = 5 AND 
                              sr.product_id = prd.id and 
                              (sr.opBalncID = 0 OR sr.opBalncID IS NULL) AND
                              sr.warehouse_id = '$wh_id' AND 
                              sr.company_id=$company_id ),0) ";

                              
        // echo $ij_negative;exit;
        //define('current_stock'," $po - ($pr  + $so)+ $sr  as current_stock ");
        return " ($po + $poRawMaterial + $sr + $ob + $ij_positive + $to_positive - $poRawMaterialConsumed - $pr - $so - $ij_negative - $to_negative)  as current_stock";
    }

    
    function get_nested_query_list($type, $company_id)
    {
        if ($type == 'cat') {

            $subquery = "(SELECT category.name  FROM category 
                          LEFT JOIN company on company.id=category.company_id 
                          WHERE category.status=1 AND 
                                category.id=prd.category_id  AND  
                                (category.company_id=" . $company_id . " or  
                                 company.parent_id=" . $company_id . ") Limit 1) as category_name";
        } 
        else if ($type == 'brand') {
            $subquery = "(SELECT brand.brandname FROM brand 
                          LEFT JOIN company on company.id=brand.company_id 
                          WHERE brand.id=prd.brand_id AND 
                                brand.status=1 AND
                                (brand.company_id=" . $company_id . " or  
                                 company.parent_id=" . $company_id . ") Limit 1) as brand_name";
        } 
        else if ($type == 'unit') {
            $subquery = "(SELECT units_of_measure.title  FROM units_of_measure 
                          LEFT JOIN company on company.id=units_of_measure.company_id 
                          WHERE  units_of_measure.status=1 AND 
                                 units_of_measure.id=prd.unit_id AND
                                 (units_of_measure.company_id=" . $company_id . " or  
                                  company.parent_id=" . $company_id . ") Limit 1) as unit_name";
        } 
        else if ($type == 'emp_type') {
            $subquery = "(SELECT employee_type.name  
                          FROM employee_type 
                          LEFT JOIN company on company.id=employee_type.company_id 
                          WHERE employee_type.status=1 AND 
                                employee_type.id=emp.employee_type AND
                                (employee_type.company_id=" . $company_id . " or  
                                 company.parent_id=" . $company_id . ") Limit 1) as emp_type";
        } 
        else if ($type == 'department') {
            $subquery = "(SELECT dep.name  
                          FROM departments as dep 
                          LEFT JOIN company on company.id=dep.company_id 
                          WHERE dep.status=1 AND 
                                dep.id=emp.department AND
                                (dep.company_id=" . $company_id . " or  
                                 company.parent_id=" . $company_id . ") Limit 1) as dname";
        } 
        else if ($type == 'region') {
            $subquery = "(SELECT cr.title  
                          FROM crm_region as cr
                          LEFT JOIN company on company.id=cr.company_id 
                          WHERE cr.status=1 AND 
                                cr.id=c.region_id AND
                                (cr.company_id=" . $company_id . " or  
                                 company.parent_id=" . $company_id . ") Limit 1) as region";
        } 
        else if ($type == 'segment') {
            $subquery = "(SELECT cs.title  
                          FROM crm_segment as cs 
                          LEFT JOIN company on company.id=cs.company_id 
                          WHERE cs.status=1 AND 
                                cs.id=c.crm_segment_id AND
                                (cs.company_id=" . $company_id . " or  
                                 company.parent_id=" . $company_id . ") Limit 1) as segment";
        } 
        else if ($type == 'buying_group') {
            $subquery = "(SELECT bs.title  
                          FROM crm_buying_group as bs 
                          LEFT JOIN company on company.id=bs.company_id
                          WHERE bs.status=1 AND 
                                bs.id=c.buying_grp AND
                                (bs.company_id=" . $company_id . " or  
                                company.parent_id=" . $company_id . ") Limit 1) as buying_group";
        } 
        else if ($type == 'country') {
            $subquery = "(SELECT bs.name  
                          FROM country as bs 
                          LEFT JOIN company on company.id=bs.company_id 
                          WHERE bs.status=1 AND 
                                bs.id=c.country_id AND
                                (bs.company_id=" . $company_id . " or  
                                 company.parent_id=" . $company_id . ") Limit 1) as country_name";
        } 
        else if ($type == 'srm_segment') {
            $subquery = "(SELECT cs.title  
                          FROM crm_segment as cs 
                          LEFT JOIN company on company.id=cs.company_id 
                          WHERE cs.status=1 AND 
                                cs.id=c.segment_id AND
                                (cs.company_id=" . $company_id . " or  
                                 company.parent_id=" . $company_id . ") Limit 1) as segment";
        } 
        else if ($type == 'product_status') {
            $subquery = "CASE WHEN prd.status = 1 THEN 'Active' 
                              WHEN prd.status = 0 THEN 'Inactive'
                              WHEN prd.status >1 THEN ( SELECT e.title  
                                                        FROM product_status as e 
                                                        LEFT JOIN company on company.id=e.company_id 
                                                        WHERE  e.id=prd.status and
                                                              (e.company_id=" . $company_id . " or  
                                                               company.parent_id=" . $company_id . ") limit 1)  
                         END AS statusp";
        } 
        else if ($type == 'hr_status') {
            return; // removing table hr_status from db as it is not being used
            $subquery = "CASE WHEN emp.status = 1 THEN 'Active'   
                              WHEN emp.status = 0 THEN 'Inactive'
                              WHEN emp.status >1 THEN ( SELECT e.title  
                                                        FROM hr_status as e 
                                                        LEFT JOIN company on company.id=e.company_id  
                                                        WHERE e.id=emp.status and
                                                             (e.company_id=" . $company_id . " or  
                                                              company.parent_id=" . $company_id . ") limit 1)  
                         END AS statusp";
        } 
        else if ($type == 'srm_status') {
            $subquery = "CASE WHEN c.status = 1 THEN 'Active'   
                              WHEN c.status = 0 THEN 'Inactive'
                              WHEN c.status >1 THEN (SELECT e.title  
                                                     FROM srm_status as e 
                                                     LEFT JOIN company on company.id=e.company_id  
                                                     WHERE  e.id=c.status and 
                                                            (e.company_id=" . $company_id . " or  
                                                             company.parent_id=" . $company_id . ") limit 1)  
                         END AS statusp";
        } else if ($type == 'crm_status') {
            $subquery = "CASE WHEN c.status = 1 THEN 'Active'   
                              WHEN c.status = 0 THEN 'Inactive'
                              WHEN c.status >1 THEN (SELECT e.title 
                                                     FROM crm_status as e 
                                                     LEFT JOIN company on company.id=e.company_id  
                                                     WHERE  e.id=c.status and
                                                            (e.company_id=" . $company_id . " or  
                                                             company.parent_id=" . $company_id . ") limit 1)  
                        END AS statusp";
        }
        return $subquery;
    }


    function pagination_genral($attr, $Sql_query, $response, $dynamic_limit, $alias, $order_type)
    {
        if (isset($attr['searchKeyword']) && isset($attr['searchKeyword']->exportAsCSV)){
            $csvQuery = $Sql_query;
            $csvOrder = " ORDER BY ".$alias.".id ASC ";
            if (!empty($order_type))
                $csvOrder = $order_type;

            $csvQuery .= $csvOrder;
            require_once(SERVER_PATH . "/classes/Setup.php");
            $objsetup = new Setup($this->arrUser);
            $response['csv'] = $objsetup->exportAsCSV($attr,$csvQuery);
        }

        if (isset($attr['searchKeyword']) && $attr['searchKeyword']->totalRecords > 0){
            $dynamic_limit = $attr['searchKeyword']->totalRecords;
        }
        else{
            $dynamic_limit = 50;  // setting pagination limit to 50 if it is not already set..
        }


        if (isset($attr['searchKeyword']))
            $page = $attr['searchKeyword']->selectedPage;

        //pagination_limit
        $sql_total = "SELECT COUNT(*) as total FROM (".$Sql_query.") as tabless";
        //echo $sql_total;
        $rs_count = $this->objQueryMaster->CSI($sql_total);
        $response['total'] = $rs_count->fields['total'];

        $page = (isset($page)) ? $page : 1;
        $offset = ($page - 1) * $dynamic_limit;
        // $offset = $offset != 0 ? $offset + 1: $offset;
        $limit = $dynamic_limit; //$page *

        if ($page > 0)
            $dynamic_limit_clause = " LIMIT ".$offset.", ".$limit."  ";

        if (isset($attr['searchKeyword']) && $attr['searchKeyword']->totalRecords == -1){
            $dynamic_limit_clause = "";
        }

        $order_clause = " ORDER BY ".$alias.".id ASC ";
        if (!empty($order_type))
            $order_clause = $order_type;

        $Sql_query .= $order_clause.$dynamic_limit_clause;
        $response['q'] = $Sql_query;
        // $RS  = $this->objQueryMaster->CSI($Sql_query);
        //echo $response['total'];

        $totalPages = ceil($response['total'] / $dynamic_limit);
        /* echo $totalPages;
          exit; */
        $response['total_pages'] = $totalPages;

        if ($response['total'] > $limit) {

            if ($response['total_pages'] <= 0)
                $end = $response['total'];
            else
                $end = $limit + $offset;
        } else
            $end = $response['total'];

        if ($response['total'] < $end){
            $end = $response['total'];
        }

        if ($end >= 1) $offset++; //this added by Ahmad to show "Showing 1 to n Records" rather than "Showing 0 to n Records".
        $response['total_paging_record'] = " Showing ".$offset." to ".$end." Records"; //entries
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
        } 
        else if ($page == $totalPages - 1 || $page == $totalPages) {
            for ($i = $page - 2, $j = 1; $i <= $totalPages; $i++, $j++) {
                $response['pages'][] = $i;
                if ($j == 5) {
                    break;
                }
            }
        } 
        else if ($totalPages >= 5) {
            $response['pages'] = array($page - 2, $page - 1, $page, $page + 1, $page + 2);
        }
        return $response;
    }

    function preListing($attr, $Sql_query, $response, $dynamic_limit, $alias, $order_type)
    {

        if (isset($attr['searchKeyword']) && isset($attr['searchKeyword']->exportAsCSV)){
            $csvQuery = $Sql_query;
            $csvOrder = " ORDER BY ".$alias.".id ASC ";
            if (!empty($order_type))
                $csvOrder = $order_type;

            $csvQuery .= $csvOrder;
            require_once(SERVER_PATH . "/classes/Setup.php");
            $objsetup = new Setup($this->arrUser);
            $response['csv'] = $objsetup->exportAsCSV($attr,$csvQuery);
        }

        if (isset($attr['searchKeyword']) && $attr['searchKeyword']->totalRecords > 0){
            $dynamic_limit = $attr['searchKeyword']->totalRecords;
        }
        else{
            $dynamic_limit = 50;  // setting pagination limit to 50 if it is not already set..
        }

        if (isset($attr['searchKeyword']))
            $page = $attr['searchKeyword']->selectedPage;

        $page = (isset($page)) ? $page : 1;
        $offset = ($page - 1) * $dynamic_limit;
        // $offset = $offset != 0 ? $offset + 1: $offset;
        $limit = $dynamic_limit; //$page *

        if ($page > 0)
            $dynamic_limit_clause = " LIMIT ".$offset.", ".$limit."  ";

        if (isset($attr['searchKeyword']) && $attr['searchKeyword']->totalRecords == -1){
            $dynamic_limit_clause = "";
        }

        $order_clause = " ORDER BY ".$alias.".id ASC ";
        if (!empty($order_type))
            $order_clause = $order_type;

        // $Sql_query .= "$order_clause $dynamic_limit_clause ";
        $slashedQuery = addcslashes($Sql_query, "'\\");

        $itemCond = ''; 
        $itemWhereClause = ''; 

        if(isset($attr['itemCond']))
            $itemCond = $attr['itemCond']; 

        if(isset($attr['itemWhereClause']))
            $itemWhereClause = $attr['itemWhereClause']; 

        $slashitemWhereClause = addcslashes($itemWhereClause, "'\\");

        

        if($itemCond == 'item')
            $response['q'] =  "CALL sr_Item_Listing(" . $this->arrUser['company_id'] . "," . $this->arrUser['id'] . "," . $this->arrUser['user_type'] . ",'".$slashedQuery."','".$dynamic_limit_clause."','".$order_clause."',null,null,'".$slashitemWhereClause."')";
        else
            $response['q'] =  "CALL sr_genericListing(null,null,null,'".$slashedQuery."','".$dynamic_limit_clause."','".$order_clause."',null,null)";

        // echo $SPCall;exit;
        // $response = $this->objQueryMaster->CSI($SPCall, $moduleName, $modulePermission);
        // return $response;
        // $response['q'] = $Sql_query;
        // $RS  = $this->objQueryMaster->CSI($Sql_query);
        //echo $response['total'];
        return $response;
    }

    function postListing($attr,$response){
        if (isset($attr['searchKeyword']) && $attr['searchKeyword']->totalRecords){
            $dynamic_limit = $attr['searchKeyword']->totalRecords;
        }
        else{
            $dynamic_limit = 50;  // setting pagination limit to 50 if it is not already set..
        }

        if (isset($attr['searchKeyword']))
            $page = $attr['searchKeyword']->selectedPage;    

        $page = (isset($page)) ? $page : 1;
        $offset = ($page - 1) * $dynamic_limit;
        // $offset = $offset != 0 ? $offset + 1: $offset;
        $limit = $dynamic_limit; //$page *
        $totalPages = ceil($response['total']/$dynamic_limit);
        /* echo $totalPages;
          exit; */
        $response['total_pages'] = $totalPages;

        if ($response['total'] > $limit) {

            if ($response['total_pages'] <= 0)
                $end = $response['total'];
            else
                $end = $limit + $offset;
        } else
            $end = $response['total'];

        if ($response['total'] < $end){
            $end = $response['total'];
        }

        if ($end >= 1) $offset++; //this added by Ahmad to show "Showing 1 to n Records" rather than "Showing 0 to n Records".
        $response['total_paging_record'] = " Showing ".$offset." to ".$end." Records"; //entries
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
        } 
        else if ($page == $totalPages - 1 || $page == $totalPages) {
            for ($i = $page - 2, $j = 1; $i <= $totalPages; $i++, $j++) {
                $response['pages'][] = $i;
                if ($j == 5) {
                    break;
                }
            }
        } 
        else if ($totalPages >= 5) {
            $response['pages'] = array($page - 2, $page - 1, $page, $page + 1, $page + 2);
        }
        return $response;
    }

    function generate_pdf_frm_html($path, $html, $randNumber)
    {
        //echo $html;exit;

        $fileName = $randNumber . '_invoice.pdf';

        require_once(SERVER_PATH . '/libraries/tcpdf/tcpdf.php');
        $obj_pdf = new TCPDF('P', PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        $obj_pdf->SetCreator(PDF_CREATOR);
        $title = "";
        $obj_pdf->SetTitle($title);
        $obj_pdf->SetPrintHeader(false);
        $obj_pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));
        $obj_pdf->SetDefaultMonospacedFont('helvetica');
        $obj_pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
        $obj_pdf->SetMargins(PDF_MARGIN_LEFT, 10, PDF_MARGIN_RIGHT);
        $obj_pdf->SetAutoPageBreak(TRUE, 8);
        //$obj_pdf->SetFont('helvetica', '', 9);
        $obj_pdf->setFontSubsetting(false);
        $obj_pdf->AddPage();
        //  ob_start();
        //  $content = ob_get_contents();
        //	ob_end_clean();
        // echo $content;exit;
        // echo SERVER_PATH . '/libraries/tcpdf';
        // error_reporting(E_ALL);
        // ini_set('display_errors', '1');
        //error_reporting(0);
        $obj_pdf->writeHTML($html, true, false, true, false, '');
        $obj_pdf->Output($path . $fileName, 'F');
        $full = $path . $fileName;

        // set_time_limit(0);
        // $this->output_file($path, $fileName, 'application/pdf');


        if (!empty($fileName) && file_exists($full)) {
            // required for IE
            if (ini_get('zlib.output_compression')) {
                ini_set('zlib.output_compression', 'Off');
            }

            // get the file mime type using the file extension
            switch (strtolower(substr(strrchr($full, '.'), 1))) {
                case 'pdf':
                    $mime = 'application/pdf';
                    break;
                case 'zip':
                    $mime = 'application/zip';
                    break;
                case 'jpeg':
                case 'jpg':
                    $mime = 'image/jpg';
                    break;
                default:
                    $mime = 'application/force-download';
            }
            // Define headers
            // header("Cache-Control: public");//private
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');  // required
            header('Expires: 0');  // no cache
            //header('Last-Modified: '.gmdate ('D, d M Y H:i:s', filemtime ($full)).' GMT');
            //header('Cache-Control: private',false);
            header('Content-Type: ' . $mime);
            header("Content-Description: File Transfer");
            header("Content-Disposition: attachment; filename=$full");
            //header("Content-Type: application/zip");
            header('Content-Length: ' . filesize($full));
            //header("Content-Type: application/octet-stream");

            header('Content-Disposition: attachment; filename="' . basename($file_name) . '"');
            header('Content-Transfer-Encoding: binary');
            header('Content-Length: ' . filesize($file_name)); // provide file size
            header('Connection: close');
            //header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            // header('Content-Type: application/x-msexcel; charset=windows-1251; format=attachment;');
            // header("Content-Type: application/stream");
            // file_put_contents($path . $randNumber . '_invoice.pdf', $new_excel);
            //	 echo WEB_PATH . "/upload/mail_attachments/".$fileName;
            //readfile(WEB_PATH . "/upload/mail_attachments/".$fileName); 	exit; 
            // ob_clean(); flush();readfile($full);   exit();
        } else
            echo 'The file does not exist.';
    }

    function generate_pdf_frm_html_mpdf($path, $html, $randNumber)
    {
        require_once(SERVER_PATH . '/libraries/mpdf/mpdf/mpdf.php');
        $objpdf = new mPDF();
        $mpdf = new mPDF('c', 'A4-L', '', '', 5, 25, 45, 37, 10, 10);
        // $mpdf->useOddEven = true;
        // $contents = $header . $contents  ;
        // $mpdf->useOddEven = true; 
        // $mpdf->SetDisplayMode('fullpage');
        // $mpdf->SetHTMLHeader($header);
        // $mpdf->SetHTMLHeader($headerE, 'E');
        // $mpdf->SetWatermarkText('IT');
        //$mpdf->showWatermarkText = true;
        //$stylesheet = file_get_contents($this->config->base_url() . 'asset/admin/css/bootstrap.min.css');
        // $mpdf->WriteHTML($stylesheet, 1);
        // $stylesheet_2 = file_get_contents($this->config->base_url() . 'asset/admin/css/mpdf.css');
        // $mpdf->WriteHTML($stylesheet_2, 1);
        $mpdf->WriteHTML($html);
        // echo $contents;  exit;
        // $mpdf->SetHTMLFooter($footer);
        //  $mpdf->SetHTMLFooter($footerE, 'E');
        // Set a simple Footer including the page number
        //  $mpdf->setFooter('Page:{PAGENO} / {nbpg}');

        $mpdf->debug = true;
        $mpdf->showImageErrors = true;

        $today = date("d-m-Y");
        $file_name = $file_name . "-Of-" . $today . ".pdf";

        $mpdf->Output($file_name, "D");
    }


    function get_db_table()
    {
        if ($_SERVER['HTTP_HOST'] == 'localhost')
            $Sql = "SHOW TABLES FROM navsonso_silver";
        else
            $Sql = "SHOW TABLES FROM navsonso_silver";

        $RS = $this->objQueryMaster->CSI($Sql);

        $sql_total = "SELECT COUNT(*) as total FROM ($Sql) as tabless";
        $rs_count = $this->objQueryMaster->CSI($sql_total);
        $total = $rs_count->fields['total'];

        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                if ($_SERVER['HTTP_HOST'] == 'localhost')
                    $rsRow = $Row['Tables_in_navsonso_silver'];
                else
                    $rsRow = $Row['Tables_in_navsonso_silver'];

                if ($rsRow == 'crm') {
                    $result['name'] = ucfirst(str_replace('_', ' ', $rsRow));
                    $result['id'] = $rsRow;
                    $response['response'][] = $result;
                }
            }
        }
    }

    function flexiOrderRetriever($prefix,$attr,$fieldsMeta){
        //print_r($attr);exit;
        $order_clause = "";
        if (!empty($attr['searchKeyword']) && !empty($attr['searchKeyword']->orderArr[0])){
            $orderElem = $attr['searchKeyword']->orderArr[0];
            $direction = " ASC ";
            if (substr($orderElem,0,1) == "-"){
                $direction = " DESC ";
                $orderElem = ltrim($orderElem, '-');
            }


            foreach ($fieldsMeta as $meta){
                if ($meta['field_name'] == $orderElem){
                    if ($meta['type'] == "append"){
                        $metaAvailable = true;
                        $where_clause .= " order by CONCAT(";
                        $count = 0;
                        foreach ($meta['fields'] as $field){
                            if ($count != 0)
                                $where_clause .= "' ',";
                            $where_clause .= "$emp$field,";
                            $count++;
                        }
                        $where_clause = substr($where_clause, 0, -1);
                        $where_clause .= ") $direction ";
                    }
                    if ($meta['type'] == "substitute"){
                        foreach ($meta['fields'] as $fieldKey => $fieldValue){
                            if ($value == $fieldKey){
                                $value = $fieldValue;
                            }
                        }
                        $metaAvailable = false;
                    }
                }
            }

            if ($metaAvailable){
                $order_clause = $where_clause;
            }
            else{
                
                if($orderElem == 'crm_code' && is_object($attr['searchKeyword']->crm_code))
                $order_clause = " order by (RIGHT(".$prefix.$orderElem.",LENGTH(".$prefix.$orderElem.")-4)) ". $direction;
                else
                $order_clause = " order by ".$prefix.$orderElem." ". $direction;
            }

            //echo $where_clause;exit;





        }
        //echo $order_clause;exit;
        return $order_clause;

    }

    function flexiDefaultFilterRetriever($tableName,$user){
    //print_r($user);exit;
        $where_clause = "";
        require_once(SERVER_PATH . "/classes/Setup.php");
        $objsetup = new Setup($user);
        $metaData = $objsetup->GetTableMetaData($tableName);

            // print_r($metaData['response']);exit;
            foreach($metaData['response']['colMeta'] as $metaRecord)
            {
                $this->mysql_clean($metaRecord); 

                if ($metaRecord['default_filter']){
                    //print_r($metaRecord);
                    if ($metaRecord['filter_type'] == "Exact"){
                        $where_clause .= " AND ".$metaRecord['field_name']." = '".$metaRecord['filter_value']."' ";
                    }
                    else if ($metaRecord['filter_type'] == "Similar"){
                        $where_clause .= " AND ".$metaRecord['field_name']." = '%".$metaRecord['filter_value']."%' ";
                    }
                }
            }
        return $where_clause;
    }

    function flexiWhereRetriever($prefix,$attr,$fieldsMeta,$ifWhereParam=null, $logicalOperator = "AND"){
        //print_r($attr);exit;
        // echo $logicalOperator;exit;
        // if (empty($logicalOperator)) $logicalOperator = "AND";
        // echo $logicalOperator;exit;
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $count = 0;
        
        if (!empty($attr['searchKeyword'])) {
            foreach ($attr['searchKeyword'] as $key => $value) {
                $this->mysql_clean($value);
                $metaAvailable = false;
                if ($key == "orderArr" || $key == 'exportAsCSV' || $key == 'totalRecords' || $key == 'selectedPage' || strpos($key, "button") === 0){
                    // adding strpos for button as button is not the actual name of field, it is a made up name for columns with events
                    continue;
                }
                if (!empty($value) || $value == "0"){
                    //$metaAvailable = true;
                    if (is_object($value)){
                        // if object, it means it is a range like Date or Number with lower and upper values
                        $metaAvailable = true;
                        //echo $value->lowerLimit;exit;
                        if ((!empty($value->lowerLimit) || $value->lowerLimit == "0") && (!empty($value->upperLimit) || $value->upperLimit == "0")) {
                            if (strpos($value->lowerLimit,'/') && strpos($value->upperLimit,'/')){
                                $lowerDate = $this->convert_date($value->lowerLimit);
                                $upperDate = $this->convert_date($value->upperLimit);
                                $where_clause .= $count++ > 0 ? " $logicalOperator " : "" ;
                                $where_clause .= " ".$prefix.$key." BETWEEN $lowerDate AND $upperDate ";
                            }
                            else{
                                if($key == 'crm_code'){
                                    $where_clause .= $count++ > 0 ? " $logicalOperator " : "" ;
                                    
                                    // $lowerLimitString = preg_replace("/[^0-9]/", "", $value->lowerLimit);
                                    // $upperLimitString = preg_replace("/[^0-9]/", "", $value->upperLimit);

                                    if($value->lowerLimit && $value->upperLimit)
                                    $where_clause .= "  (RIGHT(".$prefix.$key.",LENGTH(".$prefix.$key.")-4)) BETWEEN $value->lowerLimit AND $value->upperLimit ";
                                }
                                else{
                                    $where_clause .= $count++ > 0 ? " $logicalOperator " : "" ;
                                    $where_clause .= " ".$prefix.$key." BETWEEN $value->lowerLimit AND $value->upperLimit ";
                                }
                            }
                        }
                        else if (!empty($value->lowerLimit) || $value->lowerLimit == "0") {
                            if (strpos($value->lowerLimit,'/')){
                                $lowerDate = $this->convert_date($value->lowerLimit);
                                $where_clause .= $count++ > 0 ? " $logicalOperator " : "" ;
                                $where_clause .= " ".$prefix.$key." >= $lowerDate ";
                            }
                            else{

                                if($key == 'crm_code'){
                                    $where_clause .= $count++ > 0 ? " $logicalOperator " : "" ;

                                    // $lowerLimitString = preg_replace("/[^0-9]/", "", $value->lowerLimit);

                                    if($value->lowerLimit)
                                    $where_clause .= " (RIGHT(".$prefix.$key.",LENGTH(".$prefix.$key.")-4)) >= $value->lowerLimit ";
                                }
                                else{
                                    $where_clause .= $count++ > 0 ? " $logicalOperator " : "" ;
                                    $where_clause .= " ".$prefix.$key." >= $value->lowerLimit ";
                                }
                            }
                            
                        }
                        else if (!empty($value->upperLimit) || $value->upperLimit == "0") {
                            if (strpos($value->upperLimit,'/')){
                                $upperDate = $this->convert_date($value->upperLimit);
                                $where_clause .= $count++ > 0 ? " $logicalOperator " : "" ;
                                $where_clause .= " ".$prefix.$key." <= $upperDate ";
                            }
                            else{

                                if($key == 'crm_code'){
                                    $where_clause .= $count++ > 0 ? " $logicalOperator " : "" ;

                                    // $upperLimitString = preg_replace("/[^0-9]/", "", $value->upperLimit);
                                    if($value->upperLimit)
                                    $where_clause .= " (RIGHT(".$prefix.$key.",LENGTH(".$prefix.$key.")-4)) <= $value->upperLimit";
                                }
                                else{
                                    $where_clause .= $count++ > 0 ? " $logicalOperator " : "" ;
                                    $where_clause .= " ".$prefix.$key." <= $value->upperLimit ";
                                }
                            }
                        }
                        else if ($value->type == 'drop_down' && !empty($value->value)){
                            if (strpos($value->value,',')){
                                $where_clause .= $count++ > 0 ? " ) AND (" : "" ;
                                //$where_clause .= " $logicalOperator ";
                                $valueArr = explode(",", $value->value);
                                // $bracketCounter++;
                                $where_clause .= " ( ";
                                foreach($valueArr as $val){
                                    if ($val == 'NULL'){
                                        $where_clause .= " ( ".$prefix.$key." = '' OR ".$prefix.$key." is null ) OR ";
                                    }
                                    else{
                                        $where_clause .= " ".$prefix.$key." = '$val' OR ";
                                    }
                                }
                                $where_clause = substr($where_clause, 0, -3);
                                $where_clause .= " )   ";
                                
                            }
                            else{   
                                $where_clause .= $count++ > 0 ? " $logicalOperator " : "" ;
                                if ($value->value == 'NULL'){
                                    $where_clause .= " ( ".$prefix.$key." = '' OR $prefix$key is null ) OR ";                            
                                }
                                else{
                                    $where_clause .= " $prefix$key = '$value->value' OR ";                            
                                }
                                $where_clause = substr($where_clause, 0, -3);
                            }

                        }
                    }
                    else{
                        foreach ($fieldsMeta as $meta){
                            if ($meta['field_name'] == $key){
                                if ($meta['type'] == "append"){
                                    $metaAvailable = true;
                                    $where_clause .= $count++ > 0 ? " $logicalOperator " : "" ;
                                    $where_clause .= " CONCAT(";
                                    foreach ($meta['fields'] as $field){
                                        $where_clause .= "' ',";
                                        $where_clause .= "$emp$field,";
                                    }
                                    $where_clause = substr($where_clause, 0, -1);
                                    $where_clause .= ") LIKE '%".$value."%' ";
                                }
                                if ($meta['type'] == "substitute"){
                                    foreach ($meta['fields'] as $fieldKey => $fieldValue){
                                        if ($value == $fieldKey){
                                            $value = $fieldValue;
                                        }
                                    }
                                    $metaAvailable = false;
                                }
                            }
                        }
                    }
                    
                    //echo "$metaAvailable-----";
                    if (!$metaAvailable){
                        //echo $value;
                        $bracketCounter = 0;
                        if (strpos($value,',')){
                            $where_clause .= $count++ > 0 ? " ) $logicalOperator (" : "" ;
                            //$where_clause .= " AND ";
                            $valueArr = explode(",", $value);
                            $bracketCounter++;
                            foreach($valueArr as $val){
                                
                                $where_clause .= " $prefix$key LIKE '%$val%' OR ";
                            }
                            $where_clause = substr($where_clause, 0, -3);
                            $where_clause = $where_clause . " )";
                            
                        }
                        else{
                            $bracketCounter++;
                            $where_clause .= $count++ > 0 ? " ) $logicalOperator (" : "" ;
                            if ($key == "status" || $key == "statusp"){
                                $where_clause .= " $prefix$key = '$value' ) ";
                            }
                            else{
                                if ($value == "NULL"){
                                    $where_clause .= " $prefix$key = '' OR $prefix$key IS NULL ) ";
                                }
                                else{
                                    $where_clause .= " $prefix$key LIKE '%$value%' ) ";
                                }
                            }
                        }

                        for ($i = 0; $i < $bracketCounter; $i++){
                            $where_clause = "(" . $where_clause;
                        }
                        $bracketCounter = 0;
                    }
                    
                }
                
            }
            // $ifWhereParam for or condition in search result
            if (strlen($where_clause) > 0)
            $where_clause = " AND ( $where_clause  $ifWhereParam)";
            // echo $where_clause;exit;
        }
        return $where_clause;
    }

function getCounter($range_from_length,$length){

        if($range_from_length == 10){
            if($length == 0 || $length == 1) $count = 9; if($length == 2) $count = 8; if($length == 3) $count = 7; if($length == 4) $count = 6; if($length >= 5) $count = 5; if($length >= 6) $count = 4; if($length >= 7) $count = 3; if($length >= 8) $count = 2; if($length >= 9) $count = 1; if($length >= 10) $count = 0;
        }
        
        if($range_from_length == 9){
            if($length == 0 || $length == 1) $count = 8; if($length == 2) $count = 7; if($length == 3) $count = 6; if($length == 4) $count = 5; if($length >= 5) $count = 4; if($length >= 6) $count = 3; if($length >= 7) $count = 2; if($length >= 8) $count = 1; if($length >= 9) $count = 0;
        }
        
        if($range_from_length == 8){
            if($length == 0 || $length == 1) $count = 7; if($length == 2) $count = 6; if($length == 3) $count = 5; if($length == 4) $count = 4; if($length >= 5) $count = 3; if($length >= 6) $count = 2; if($length >= 7) $count = 1; if($length >= 8) $count = 0;
        }
        
        if($range_from_length == 7){
            if($length == 0 || $length == 1) $count = 6; if($length == 2) $count = 5; if($length == 3) $count = 4; if($length == 4) $count = 3; if($length >= 5) $count = 2; if($length >= 6) $count = 1; if($length >= 7) $count = 0;
        }
        
        if($range_from_length == 6){
            if($length == 0 || $length == 1) $count = 5; if($length == 2) $count = 4; if($length == 3) $count = 3; if($length == 4) $count = 2; if($length >= 5) $count = 1; if($length >= 6) $count = 0;
        }
        
        if($range_from_length == 5){
            if($length == 0 || $length == 1) $count = 4; if($length == 2) $count = 3; if($length == 3) $count = 2; if($length == 4) $count = 1; if($length >= 5) $count = 0;
        }
        
        if($range_from_length == 4){
            if($length == 0 || $length == 1) $count = 3; if($length == 2) $count = 2; if($length == 3) $count = 1; if($length == 4) $count = 0;
        }
        
        if($range_from_length == 3){
            if($length == 0 || $length == 1) $count = 2; if($length == 2) $count = 1; if($length == 3) $count = 0;
        }
        
        if($range_from_length == 2){
            if($length == 0 || $length == 1) $count = 1; if($length == 2) $count = 0;
        }
                        
        if($range_from_length == 1){
            if($length == 0 || $length == 1) $count = 0;
        }
                        
        if($range_from_length == 0){
            if($length == 0 ) $count = 0;
        }

        return $count;
    }

    function getRealIpAddr()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
        {
          $ip=parse_url($_SERVER['HTTP_CLIENT_IP'])['host'];
        }
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
        {
          $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        else
        {
          $ip=$_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    
}