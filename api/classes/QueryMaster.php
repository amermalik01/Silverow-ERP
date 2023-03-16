<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");

class QueryMaster extends Xtreme
{

    private $Conn = null;
    private $ConnTrace = null;
    private $arrUser = null;

    function __construct($user_info = array())
    {

        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->ConnTrace = parent::GetTraceConnection();
        $this->arrUser = $user_info;
    }

    function removeWhiteSpace($text)
    {
        $text = preg_replace('/[\t\n\r\0\x0B]/', ' ', $text);
        $text = preg_replace('/([\s])\1+/', ' ', $text);
        $text = trim($text);
        return $text;
    }

    function get_client_ip()
    {
        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if (isset($_SERVER['HTTP_X_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if (isset($_SERVER['HTTP_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if (isset($_SERVER['HTTP_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if (isset($_SERVER['REMOTE_ADDR']))
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }

    function SRTraceLogsSQL($query, $query_response, $type, $timeTaken = 0) // type = 1-> SQL, type = 2 --> everything else
    {
        /* if (defined('dontLog') && dontLog == 1) {
            return;
        } */
        $current_date_time = current_date_time;
        if ($type == SR_TRACE_SQL) {
            $error_code = (isset($query_response['ErrorCode']) && $query_response['ErrorCode'] != '') ? $query_response['ErrorCode'] : 0;
            $warning = (isset($query_response['Warning']) && $query_response['Warning'] != '') ? $query_response['Warning'] : 0;
            $error_message = (isset($query_response['ErrorMessage']) && $query_response['ErrorMessage'] != '') ? $query_response['ErrorMessage'] : "";

            $Sql = "INSERT INTO srtrace SET
                                        input_text = '" . addslashes($query)  . "',
                                        log_level = " . LOG_LEVEL . ",
                                        log_type   = '" . SR_TRACE_SQL . "',
                                        error_message = '" . addslashes($error_message) . "',
                                        error_code = '" . $error_code . "',
                                        date_created = $current_date_time,
                                        user_id = " . $this->arrUser['id'] . ",
                                        time_taken = $timeTaken,
                                        user_ip = '" . $this->get_client_ip() . "',
                                        company_id = " . $this->arrUser['company_id'];

            if (LOG_LEVEL >= LOG_LEVEL_1) {
                // echo $Sql;exit;
                $RS = $this->ConnTrace->execute($Sql);
                $id = $this->ConnTrace->Insert_ID();
                if (!($id > 0)) {
                    $Sql = "INSERT INTO srtrace SET
                                        input_text = '" . $Sql  . "',
                                        log_level = " . LOG_LEVEL . ",
                                        log_type   = '" . SR_TRACE_SQL . "',
                                        error_message = 'Record not inserted for this query',
                                        error_code = '1111',
                                        date_created = $current_date_time,
                                        user_id = " . $this->arrUser['id'] . ",
                                        user_ip = '" . $this->get_client_ip() . "',
                                        company_id = " . $this->arrUser['company_id'];
                    $RS = $this->ConnTrace->execute($Sql);
                    $id = $this->ConnTrace->Insert_ID();
                }
            }
            /* if(LOG_LEVEL >= LOG_LEVEL_3)
            {                
                // echo $Sql;exit;
                $RS = $this->ConnTrace->execute($Sql);
            }
            else if(LOG_LEVEL >= LOG_LEVEL_2 && $warning > 0) // 0=No Logging required, 1=Errors Only, 2=Errors & Warning 3=Everyhting should be logged. This Parameter is read from the config file on user login
            {
                // echo $Sql;exit;
                $RS = $this->ConnTrace->execute($Sql);
            }
            else if(LOG_LEVEL >= LOG_LEVEL_1 && $error_code > 0) // 0=No Logging required, 1=Errors Only, 2=Errors & Warning 3=Everyhting should be logged. This Parameter is read from the config file on user login
            {
                // echo $Sql;exit;
                $RS = $this->ConnTrace->execute($Sql);
            } */
        } else if ($type == 2) // php errors
        {
            // warning, fatal error, notices
        }
        $response['id'] = $id;
        $response['dateTime'] = $current_date_time;
        return $response;
    }

    function SRTraceLogsPHP($srLogTrace)
    {
        /* if (defined('dontLog') && dontLog == 1) {
            return;
        } */
        if (LOG_LEVEL >= $srLogTrace['LOG_LEVEL']) {
            $error_code = (isset($srLogTrace['ErrorCode']) && $srLogTrace['ErrorCode'] != '') ? $srLogTrace['ErrorCode'] : 0;
            $Parameter2 = (isset($srLogTrace['Parameter2']) && $srLogTrace['Parameter2'] != '') ? addslashes($srLogTrace['Parameter2']) : '';
            $Parameter3 = (isset($srLogTrace['Parameter3']) && $srLogTrace['Parameter3'] != '') ? addslashes($srLogTrace['Parameter3']) : '';
            $Parameter4 = (isset($srLogTrace['Parameter4']) && $srLogTrace['Parameter4'] != '') ? addslashes($srLogTrace['Parameter4']) : '';
            $Parameter5 = (isset($srLogTrace['Parameter5']) && $srLogTrace['Parameter5'] != '') ? addslashes($srLogTrace['Parameter5']) : '';
            $Parameter6 = (isset($srLogTrace['Parameter6']) && $srLogTrace['Parameter6'] != '') ? addslashes($srLogTrace['Parameter6']) : '';

            $input_text = (isset($srLogTrace['input_text']) && $srLogTrace['input_text'] != '') ? addslashes($srLogTrace['input_text']) : '';
            $ErrorMessage = (isset($srLogTrace['ErrorMessage']) && $srLogTrace['ErrorMessage'] != '') ? addslashes($srLogTrace['ErrorMessage']) : '';

            $Sql = "INSERT INTO srtrace 
                                    SET
                                        Class = '" . addslashes($srLogTrace['CLASS'])  . "',
                                        Function = '" . addslashes($srLogTrace['Function'])  . "',
                                        Parameter1 = '" . addslashes($srLogTrace['Parameter1'])  . "',
                                        Parameter2 = '" . $Parameter2  . "',
                                        Parameter3 = '" . $Parameter3  . "',
                                        Parameter4 = '" . $Parameter4 . "',
                                        Parameter5 = '" . $Parameter5 . "',
                                        Parameter6 = '" . $Parameter6  . "',
                                        input_text = '" . $input_text . "',
                                        log_level = " . LOG_LEVEL . ",
                                        log_type   = '" . SR_TRACE_PHP . "',
                                        error_message = '" . $ErrorMessage . "',
                                        error_code = '" . $error_code . "',
                                        date_created = UNIX_TIMESTAMP(NOW()),
                                        user_id = " . $this->arrUser['id'] . ",
                                        company_id = " . $this->arrUser['company_id'];
            // echo $Sql;exit;
            $RS = $this->Conn->execute($Sql);
        }
    }

    function terminateWithMessage($msg, $ToasterFlag)
    {


        $response['ack'] = 0;
        $response['error'] = $msg;

        $srLogTrace = array();
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Exit';
        $srLogTrace['ErrorMessage'] = 'Error' . $msg;

        $this->SRTraceLogsPHP($srLogTrace);

        $this->Conn->rollbackTrans();
        $this->Conn->autoCommit = true;

        if ($ToasterFlag == 1) {
            // print_r($response);exit;
            return $response;
        } else {
            echo json_encode($response);
            exit;
        }
    }

    function queryRunner($query)
    {

        $ActualResponse = $this->Conn->execute($query);

        $tempQuery = strtolower($this->removeWhiteSpace($query));

        if ($this->Conn->_connectionID->errno != 0) {
            if ($this->Conn->_connectionID->errno == 1451) {
                $response['Friendly'] = 1;
                $response['friendlyErrorMsg'] = 'There are some dependencies on this object. Please remove them before you delete.';
            }

            $file = debug_backtrace()[2]['file'];
            $line = debug_backtrace()[2]['line'];
            $func = debug_backtrace()[2]['function'];
            $class = debug_backtrace()[2]['class'];
            $response['ResponseObj'] = $this->Conn;
            $response['Ack'] = 0;
            $response['Error'] = 1;
            $response['ErrorCode'] = $this->Conn->_connectionID->errno;
            $response['ErrorMessage'] = $this->Conn->_connectionID->error;
            $response['Query'] = str_replace("\n", "", $query);
            $response['LastCaller'] = debug_backtrace()[1];
            $response['SecondLastCaller'] = debug_backtrace()[2];
            $this->Conn->rollbackTrans();
            $response['ErrorMessage'] = "Error Code: " . $response['ErrorCode'] . "  -- Message: " . $response['ErrorMessage'] . "  -- File: " . $file . " -- Function: " . $func . " -- Line: " . $line . " -- Query: " . $query . " ";
            $response['srTraceData'] = $this->SRTraceLogsSQL($query, $response, 1);
            echo json_encode($response);
            exit;
        }

        $warningCount = $this->Conn->_connectionID->warning_count;

        if ($warningCount > 0) {

            $file = debug_backtrace()[2]['file'];
            $line = debug_backtrace()[2]['line'];
            $func = debug_backtrace()[2]['function'];
            $class = debug_backtrace()[2]['class'];
            $warningResponse = $this->Conn->execute("Show WARNINGS;");
            if ($warningResponse->RecordCount() > 0) {
                while ($Row = $warningResponse->FetchRow()) {
                    if ($Row['Code'] == 1329) continue;
                    $response['ResponseObj'] = $this->Conn;
                    $response['Ack'] = 0;
                    $response['Error'] = 1;
                    $response['Warning'] = 1;
                    $response['ErrorCode'] = $Row['Code'];
                    $response['ErrorMessage'] = "Warning Code: " . $Row['Code'] . " -- Message: " . $Row['Message'] . "-- File: " . $file . " -- Function: " . $func . " -- Line: " . $line . " -- Query: " . $query . " ";
                    $response['Query'] = str_replace("\n", "", $query);
                    $response['LastCaller'] = debug_backtrace()[1];
                    $response['SecondLastCaller'] = debug_backtrace()[2];
                    $response['AllWarnings'][] = $Row;
                    $this->Conn->rollbackTrans();
                    $response['ErrorMessage'] = "Error Code: " . $response['ErrorCode'] . "  -- Message: " . $response['ErrorMessage'] . "  -- File: " . $file . " -- Function: " . $func . " -- Line: " . $line . " -- Query: " . $query . " ";
                    $response['srTraceData'] = $this->SRTraceLogsSQL($query, $response, 1);
                    echo json_encode($response);
                    exit;
                }
            }
        } elseif (strpos($tempQuery, "call ") === 0 && strpos($tempQuery, "@errorno") > 0) {

            // appears to be a call to stored procedure..

            $sql = "select @errorNo,@param1,@param2,@param3,@param4;";

            $checkForErrors = $this->Conn->execute($sql);
            $RowReturnRes = $checkForErrors->FetchRow();

            /* if ($checkForErrors->RecordCount() > 0) {
                print_r($checkForErrors);
            } */

            //echo $RowReturnRes['@errorNo'].'PHP_EOL';

            if ($RowReturnRes['@errorNo'] == 1) {
                $ActualResponse->msg = 1;
                return $ActualResponse;
            } elseif ($RowReturnRes['@errorNo'] > 1) {

                //  print_r($RowReturnRes);exit;
                // check from srerrormsg table using @errorNo and replace @param1

                $checkForErrorsMsg = $this->Conn->execute("select ErrMsg from srerrormsg where ErrNo=" . $RowReturnRes['@errorNo']);
                $ReturnRes = $checkForErrorsMsg->FetchRow();

                $ErrMsg = $ReturnRes['ErrMsg'];

                // echo '<pre>';print_r($ReturnRes);

                $ErrMsg = str_replace('#PARAM1#', $RowReturnRes['@param1'], $ErrMsg);
                $ErrMsg = str_replace('#PARAM2#', $RowReturnRes['@param2'], $ErrMsg);
                $ErrMsg = str_replace('#PARAM3#', $RowReturnRes['@param3'], $ErrMsg);
                $ErrMsg = str_replace('#PARAM4#', $RowReturnRes['@param4'], $ErrMsg);
                // echo $ErrMsg;exit;

                $backResponse = $this->terminateWithMessage($ErrMsg, 1);

                $ActualResponse->msg = 0;
                $ActualResponse->Error = $backResponse['error'];
                return $ActualResponse;
            }
        }
        // else{

        return $ActualResponse;
        // }
    }

    function CSI($query, $permissionModule = null, $permission = null)
    {
        $Sql = "SELECT user_type FROM employees WHERE id='" . $this->arrUser["id"] . "'";
        $RS = $this->queryRunner($Sql);
        if (($RS->fields[0] && $RS->fields[0] != 3) || (empty($permissionModule) || empty($permission))) { // user is admin
            $allowed = true;
        } else {
            $where = " ";
            // echo $permission;exit;
            $permissionArray = explode(",", $permission);
            for ($i = 0; $i < sizeof($permissionArray); $i++) {
                if ($i > 0) {
                    $where .= " OR ";
                }
                $where .= " ur.permisions LIKE '%" . $permissionArray[$i] . "%' ";
            }
            // echo $where;exit;
            $Sql = "SELECT * FROM ref_user_rights ur left join employee_roles er on ur.role_id = er.role_id WHERE ur.name = '" . $permissionModule . "'  AND er.employee_id = " . $this->arrUser["id"] . " AND " . $where . " ;";
            $permissionResponse = $this->queryRunner($Sql);
            if ($permissionResponse->RecordCount() > 0) {
                $allowed = true;
            } else {
                //getting display name for the module to be used in permission denial message
                $moduleDispRespQuery = "SELECT complete_name FROM ref_module where name = '" . $permissionModule . "' ;";
                $moduleDispResp = $this->queryRunner($moduleDispRespQuery);
                if ($moduleDispResp->RecordCount() > 0) {
                    $permissionModuleDisplayName = $moduleDispResp->fields['complete_name'];
                } else {
                    $permissionModuleDisplayName = $permissionModule;
                }
            }
        }

        if ($allowed) {
            $tempQuery = $this->removeWhiteSpace($query);
            $flag = false;

            if (stripos($tempQuery, 'insert into') === 0 && stripos($tempQuery, 'values') === false && stripos($tempQuery, 'select') === false) { // ignoring the multiple insert queries
                if (stripos($tempQuery, 'addedby') === false) {
                    // $tempQuery .= " , AddedBy = ".$this->arrUser["id"];
                    $tempQuery = substr_replace($tempQuery, " AddedBy = " . $this->arrUser["id"] . ", ", stripos($tempQuery, ' set ') + 4, 0); // get the first instance of set
                    $flag = true;
                }
                if (stripos($tempQuery, 'addedon') === false) {
                    // $tempQuery .= " , AddedOn = UNIX_TIMESTAMP (NOW())";
                    $tempQuery = substr_replace($tempQuery, " AddedOn = UNIX_TIMESTAMP (NOW()), ", stripos($tempQuery, ' set ') + 4, 0);

                    $flag = true;
                }
            } else if (stripos($tempQuery, 'update') === 0 && stripos($tempQuery, 'orderscache') === 0) // && strpos($tempQuery, '(select') === false) // ignore updates with select statments
            {
                if (stripos($tempQuery, 'changedby') === false) {
                    $tempQuery = substr_replace($tempQuery, " ChangedBy = " . $this->arrUser["id"] . ", ", stripos($tempQuery, ' set ') + 4, 0); // get the first instance of set
                    $flag = true;
                }
                if (stripos($tempQuery, 'changedon') === false) {
                    $tempQuery = substr_replace($tempQuery, " ChangedOn = UNIX_TIMESTAMP (NOW()), ", stripos($tempQuery, ' set ') + 4, 0);
                    $flag = true;
                }
            }
            // echo $tempQuery;exit; 

            $start_time = microtime(true) * 1000;
            // echo $start_time;exit;

            if ($flag == false) // for other than updated queries
                $response = $this->queryRunner($query);
            else
                $response = $this->queryRunner($tempQuery);

            $end_time = microtime(true) * 1000;
            $duration = (int) ($end_time - $start_time);
            // echo $duration;exit;
            // echo $seconds;exit;

            $tempQuery = strtolower($tempQuery);

            $this->SRTraceLogsSQL($query, '', SR_TRACE_SQL, $duration);
            // print_r($response);

            $targetedTables = array(
                "srm_invoice", "srm_order_return", "product", "gl_account", "alt_contact", "alt_depot", "warehouse_allocation"
            );
            //, "warehouse_allocation" "srm",
            $targetedOperations = array(
                "update", "insert", "delete"
            );
            $capturedId = "";
            $match = false;

            for ($i = 0; $i < sizeof($targetedTables); $i++) {
                for ($j = 0; $j < sizeof($targetedOperations); $j++) {
                    if ($targetedOperations[$j] == "insert") {
                        $insertMatch = strpos($tempQuery, $targetedOperations[$j] . " into " . $targetedTables[$i] . " ");
                        if ($insertMatch === 0 && $insertMatch !== '') {
                            // echo strpos($tempQuery, ($targetedOperations[$j]." into ".$targetedTables[$i])).PHP_EOL."---".PHP_EOL;
                            $match = true;
                            $tablePosition = strpos($tempQuery, $targetedTables[$i]);
                            $operationPosition = trim(strpos($tempQuery, $targetedOperations[$j]));
                        } else {
                            continue;
                        }
                    } else if ($targetedOperations[$j] == "delete") {
                        $deleteMatch = strpos($tempQuery, $targetedOperations[$j] . " from " . $targetedTables[$i] . " ");
                        if ($deleteMatch === 0 && $deleteMatch !== '') {
                            $match = true;

                            // echo strpos($tempQuery, ($targetedOperations[$j]." into ".$targetedTables[$i])).PHP_EOL."---".PHP_EOL;
                            $tablePosition = strpos($tempQuery, $targetedTables[$i]);
                            $operationPosition = trim(strpos($tempQuery, $targetedOperations[$j]));
                        } else {
                            continue;
                        }
                    } else if ($targetedOperations[$j] == "update") {
                        $updateMatch = strpos($tempQuery, $targetedOperations[$j] . " " . $targetedTables[$i] . " ");
                        // echo $targetedOperations[$j]." ".$targetedTables[$i]." ". $updateDeleteMatch.PHP_EOL."----".PHP_EOL;

                        // echo "Match:".$updateDeleteMatch;exit;
                        if ($updateMatch === 0 && $updateMatch !== '') {
                            $match = true;

                            // echo strpos($tempQuery, ($targetedOperations[$j]." into ".$targetedTables[$i])).PHP_EOL."---".PHP_EOL;
                            $tablePosition = strpos($tempQuery, $targetedTables[$i]);
                            $operationPosition = trim(strpos($tempQuery, $targetedOperations[$j]));
                        } else {
                            continue;
                        }
                    }

                    // continue;

                    $targetedTable = $targetedTables[$i];
                    $targetedOperation = $targetedOperations[$j];
                    // echo "Targeted Table: $targetedTable , Targeted Operation: $targetedOperation";

                    if ($tablePosition && ($operationPosition == '0' || ($operationPosition > 0 && $operationPosition != '')) && $tablePosition > $operationPosition) {
                        if ($targetedOperation == "insert") {
                            // echo "Insert id for $query".PHP_EOL.$this->Conn->Insert_ID().PHP_EOL."-------";Insert_ID
                            // $capturedId = $this->Conn->_insertid();
                            $capturedId = $this->Conn->Insert_ID();
                            $AffectedRows = $this->Conn->Affected_Rows();
                            // echo "ID: $capturedId, Affected: $AffectedRows";exit;

                            // echo "insert query executed for $query and returned $capturedId";
                        } else {
                            // echo $query;exit;
                            if ($targetedTable == 'warehouse_allocation') {
                                // exception for warehouse_allocation for delete/update, we need the product table to updated
                                $lastWherePosition = strripos($tempQuery, "where");
                                $whereString = substr($tempQuery, $lastWherePosition, strlen($tempQuery));
                                $matches = "";
                                preg_match('#([.]product_id|[ ]product_id)(\D*)(\d+)#i', $whereString, $matches);
                                $capturedId = $matches[sizeof($matches) - 1];
                                $AffectedRows = $this->Conn->Affected_Rows();
                                // echo $capturedId;exit;
                            } else {
                                $lastWherePosition = strripos($tempQuery, "where");
                                $whereString = substr($tempQuery, $lastWherePosition, strlen($tempQuery));
                                $matches = "";
                                preg_match('#([.]id|[ ]id)(\D*)(\d+)#i', $whereString, $matches);
                                $capturedId = $matches[sizeof($matches) - 1];
                                $AffectedRows = $this->Conn->Affected_Rows();
                            }
                        }
                        // echo "sr_Checksum_".$targetedTable."_".$targetedOperation."_Trigger_SP(".$this->arrUser['company_id'].", ".$this->arrUser['id'].", ". $capturedId .")";
                        //  echo "tmp query: $tempQuery".PHP_EOL."target table: $targetedTable". PHP_EOL. "target operation: $targetedOperation";//exit;
                        if ($capturedId) {
                            $Sql = "CALL sr_Checksum_" . $targetedTable . "_" . $targetedOperation . "_Trigger_SP(" . $this->arrUser['company_id'] . ", " . $this->arrUser['id'] . ", " . $capturedId . ")";
                            //,@errorNo, @param1,@param2, @param3,@param4d
                            /* echo $tempQuery.PHP_EOL;
                            echo $capturedId.PHP_EOL;
                            echo $Sql.PHP_EOL; */
                            // echo $Sql;
                            $r2 = $this->queryRunner($Sql);
                            $this->SRTraceLogsSQL($Sql, '', SR_TRACE_SQL);
                        }

                        if ($targetedOperation == "insert") {
                            $this->Conn->_logsql = true;
                            $this->Conn->lastInsID = $capturedId;
                            $this->Conn->_logsql = true;
                            $this->Conn->_affected = $AffectedRows;
                            $this->Conn->hasAffectedRows = true;
                        } else {
                            $this->Conn->_logsql = true;
                            $this->Conn->_affected = $AffectedRows;
                            $this->Conn->hasAffectedRows = true;
                        }
                    }
                }
            }

            return $response;
        } else {
            switch ($permission) {
                case (1):
                    $permName = "Add";
                    break;
                case (2):
                    $permName = "Edit";
                    break;
                case (3):
                    $permName = "View";
                    break;
                case (4):
                    $permName = "Delete";
                    break;
                case (5):
                    $permName = "Approve";
                    break;
                case (6):
                    $permName = "Convert";
                    break;
                case (7):
                    $permName = "Dispatch";
                    break;
                case (8):
                    $permName = "Post";
                    break;
                case (9):
                    $permName = "Receive";
                    break;
                case ("1,2"):
                    $permName = "Add/Edit";
                    break;
            }
            $response['PermissionName'] = $permName;
            $response['Access'] = 0;
            $response['Ack'] = 0;
            $response['Message'] = "Permission Denied!";
            $response['Query'] = $query;
            $response['Module'] = $permissionModuleDisplayName;
            $response['Permission'] = $permission;
            $response['caller'] = debug_backtrace()[1];
            echo json_encode($response);
            exit;
        }
    }
}
