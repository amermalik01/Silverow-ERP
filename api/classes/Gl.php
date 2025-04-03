<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Setup.php");
require_once(SERVER_PATH . "/classes/Stock.php");
// require_once(SERVER_PATH . "/classes/Saleswarehouse.php");
require_once(SERVER_PATH . "/classes/Warehouse.php");

class Gl extends Xtreme {

    private $Conn = null;
    // private $ConnReport = null;
    private $objGeneral = null;
    private $arrUser = null;
    private $objsetup = null;

    function __construct($user_info = array()) {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        // $this->ConnReport = parent::GetReportConnection();
        $this->objGeneral = new General($user_info);
        $this->arrUser = $user_info;
        $this->objsetup = new Setup($user_info);
        $this->objStock = new Stock($user_info);
        $this->objWrh = new Warehouse($user_info);
        // $this->objSWrh = new Saleswarehouse($user_info);
    }

    // static    Hello
    function delete_update_status($table_name, $column, $id) {

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
        return $response;
    }

    function get_data_by_id($table_name, $id) {

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

    function getAllGLAccountNo($attr) {

        $Sql = "SELECT  gl.id as glid,
                        gl.accountCode as glaccountCode,
                        gl.displayName as name
                FROM gl_account as gl
                WHERE gl.status=1 and 
                      gl.company_id='" . $this->arrUser['company_id'] . "'
                ORDER BY gl.accountCode";
        // echo $Sql; exit; 

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['gl_no'] = $Row['glaccountCode'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        // exit;
        return $response;
    }

    function getAllGLAccountNoforDetailReport($attr) {

        $Sql = "SELECT  gl.id as glid,
                        gl.accountCode as glaccountCode,
                        gl.displayName as name
                FROM gl_account as gl
                WHERE gl.status=1 AND 
                      gl.accountType = 3 AND
                      gl.company_id='" . $this->arrUser['company_id'] . "'
                ORDER BY gl.accountCode";
        // echo $Sql; exit; 

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['gl_no'] = $Row['glaccountCode'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        // exit;
        return $response;
    }

    function checkGlAccountsSetup($attr) {

        $Sql = "SELECT * FROM gl_account_txn WHERE company_id='" . $this->arrUser['company_id'] . "'  ";
        // echo $Sql; exit; 
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        }else{
            $response['response'][] = array();
        }

        return $response;

    }

    function getAllGlAccounts($attr) {
        // $this->objGeneral->mysql_clean($attr);
        //for rec sql
        /* $Sql = "SELECT  gl.id as glid,
          gl.name as sub_category_name,
          gl.gl_account_ref_id as company_ref_gl_id,
          gl.displayName as categoryDisplayName,
          gl.startRangeCode as gl_code_range_from,
          gl.endRangeCode as gl_code_range_to,
          gl.accountType as glaccountTypeID,
          gl.accountCode as glaccountCode,
          gl.vatRateID as glvatRateID,
          vat.vat_name as glvatRate,
          gl.transcation as gltranscationID,
          ( CASE  WHEN gl.transcation = 1 THEN 'Debit'
          WHEN gl.transcation = 2 THEN 'Credit'
          WHEN gl.transcation = 3 THEN 'Both'
          ELSE 0
          END) AS gltranscation,
          ( CASE  WHEN gl.accountType = 1 THEN 'Category'
          WHEN gl.accountType = 2 THEN 'Sub Category'
          WHEN gl.accountType = 3 THEN 'Posting'
          WHEN gl.accountType = 4 THEN 'End Total'
          WHEN gl.accountType = 5 THEN 'Heading'
          ELSE 0
          END) AS glaccountType,
          gl.allowPosting as glallowPosting,
          parentCAT.name as parentCATname,
          refLink.parent_gl_account_id as parentID,
          refLink.child_gl_account_id as childID,

          (SELECT MAX(totalCreditGLAccount_LCY)
          FROM gl_account_txn AS gl_txn
          WHERE glaccountTypeID <> 4 AND gl_txn.gl_account_id = glid ) AS Credit,

          (SELECT MAX(totalDebitGLAccount_LCY)
          FROM gl_account_txn AS gl_txn
          WHERE glaccountTypeID <> 4 AND gl_txn.gl_account_id = glid ) AS Debit,

          SR_GetEndTotalGlAccount(gl.id,gl.startRangeCode,gl.endRangeCode,gl.company_id,gl.accountType,1) AS TotalCredit,
          SR_GetEndTotalGlAccount(gl.id,gl.startRangeCode,gl.endRangeCode,gl.company_id,gl.accountType,2) AS TotalDebit,

          (SELECT COUNT(id)
          FROM gl_account_txn AS gl_txn
          WHERE gl_txn.gl_account_id = glid)  AS transactions,
          SR_GetGL_CatSubcat(gl.id," . $this->arrUser['company_id'] . ") AS category,
          SR_GetGL_CatSubcat(gl.id," . $this->arrUser['company_id'] . ") AS category,
          SR_GetGL_CatSubcat(gl.id," . $this->arrUser['company_id'] . ") AS category
          FROM gl_account as gl
          left join gl_account_link as refLink on gl.id =refLink.child_gl_account_id
          left join vat on vat.id =gl.vatRateID
          left join gl_account as parentCAT on refLink.parent_gl_account_id =parentCAT.id
          WHERE gl.status=1 and
          gl.company_id='" . $this->arrUser['company_id'] . "'";
          // $Sql .= " GROUP BY gl.id
          // ORDER BY gl.accountCode ASC"; */

        $Sql = "SELECT * FROM gl_accountcache gl WHERE status = 1 AND company_id='" . $this->arrUser['company_id'] . "'  ";
        //$Sql = $this->objsetup->whereClauseAppender($Sql, 65);
        $Sql .= " ORDER BY glaccountCode ASC ";

        // echo $Sql; exit; 
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "charts_of_accounts", sr_ViewPermission);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                // $result['id'] = $Row['glid'];                
                $result['id'] = $Row['id'];
                $result['name'] = $Row['sub_category_name'];
                $result['code'] = $Row['glaccountCode'];
                $result['company_ref_gl_id'] = $Row['company_ref_gl_id'];

                if ($Row['categoryDisplayName'] != "")
                    $result['categoryDisplayName'] = $Row['categoryDisplayName'];
                else
                    $result['categoryDisplayName'] = $Row['sub_category_name'];

                $result['typeID'] = $Row['glaccountTypeID'];
                $result['account_type'] = $Row['glaccountType'];
                $result['gl_no'] = $Row['glaccountCode'];
                $result['vat_Rate'] = $Row['glvatRate'];
                $result['transcation'] = $Row['gltranscation'];
                $result['gltranscationID'] = $Row['gltranscationID'];
                $result['category'] = $Row['parentCATname'];
                $result['parentID'] = $Row['parentID'];
                $result['parentID'] = $Row['parentID'];
                $result['childID'] = $Row['childID'];
                $result['code_range_from'] = $Row['gl_code_range_from'];
                $result['code_range_to'] = $Row['gl_code_range_to'];

                if ($result['typeID'] != '4') {
                    $result['Debit'] = $Row['Debit'];
                    $result['Credit'] = $Row['Credit'];
                } else {
                    $result['Debit'] = $Row['TotalDebit'];
                    $result['Credit'] = $Row['TotalCredit'];
                }


                if ($Row['transactions'] > 0) {
                    $result['transactions'] = $Row['transactions'];
                } else {
                    $Sql2 = "SELECT COUNT(id) as transactions
                             FROM gl_account_txn 
                             WHERE gl_account_id = '" . $result['id'] . "'";
                    // echo $Sql2; exit; 
                    $RS2 = $this->objsetup->CSI($Sql2, "charts_of_accounts", sr_ViewPermission);

                    if ($RS2->RecordCount() > 0) {
                        $Row2 = $RS2->FetchRow();
                        $result['transactions'] = $Row2['transactions'];
                    }
                }

                if ($result['Credit'] > 0)
                    $credit_total = $result['Credit'];
                elseif($result['Credit'] < 0)
                    $Debit_total = ($result['Credit'] * -1);
                else
                    $credit_total = 0;

                if ($result['Debit'] > 0)
                    $Debit_total = $result['Debit'];
                elseif($result['Debit'] < 0)
                    $credit_total = ($result['Debit'] * -1);
                else
                    $Debit_total = 0;

                $total_balance = $Debit_total - $credit_total;

                if ($total_balance >= 0) {
                    $result['total_balance'] = $total_balance;
                    $result['total_balance_type'] = "Debit";
                } else {
                    $result['total_balance'] = ($total_balance * -1);
                    $result['total_balance_type'] = "Credit";
                }

                /* $catSubCat = $Row['category'];
                  $RS3=explode("[]",$catSubCat);

                  if($RS3['0']!='')
                  $result['glCategory'] = $RS3['0'];
                  else
                  $result['glCategory'] = '';

                  if(isset($RS3['2'])!='')
                  $result['glSubCat'] = $RS3['2'];
                  else
                  $result['glSubCat'] = ''; */

                if ($Row['category'] != $Row['sub_category_name'])
                    $result['glCategory'] = $Row['category'];
                if ($Row['subCategory'])
                    $result['glSubCat'] = $Row['subCategory'];
                // $result['glSubCat'] = $Row['subCategory'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total_company_gl_accounts'] = 1;
        } else
            $response['response'][] = array();
        // echo "<pre>";
        // print_r($response);
        // exit;
        return $response;
    }

    function getGlAccountbyID($attr) {
        $this->objGeneral->mysql_clean($attr);
        // print_r($attr);exit;

        // error_reporting(E_ALL);

        $Sql = "SELECT  gl.*,refLink.parent_gl_account_id,
                        (SELECT SR_GetGL_CatSubcat(gl.id," . $this->arrUser['company_id'] . ")) AS catSubCatIDs,
                        (SELECT glDisplay.accountCodeDisplay 
                         FROM gl_account_number_display AS glDisplay 
                         WHERE glDisplay.accountCode = gl.accountCode AND
                               glDisplay.company_id = gl.company_id) AS glNumberDisplayAs
                FROM gl_account as gl
                left join gl_account_link as refLink on gl.id =refLink.child_gl_account_id
                WHERE gl.id=" . $attr['id'] . " limit 1";
        //  echo $Sql; exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "charts_of_accounts", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            $result = array();
            $result['id'] = $Row['id'];
            $result['name'] = $Row['displayName'];
            $result['parent_gl_account_id'] = $Row['parent_gl_account_id'];
            $result['gl_account_ref_id'] = $Row['gl_account_ref_id'];
            $result['accountCode'] = $Row['accountCode'];
            $result['glNumberDisplayAs'] = $Row['glNumberDisplayAs'];
            $result['vatRateID'] = $Row['vatRateID'];
            $result['transcation'] = $Row['transcation'];
            $result['allowPosting'] = $Row['allowPosting'];
            $result['startRangeCode'] = $Row['startRangeCode'];
            $result['endRangeCode'] = $Row['endRangeCode'];
            $result['accountType'] = $Row['accountType'];
            $result['vatBankType'] = $Row['vatBankType'];
            $result['status'] = $Row['status'];

            $catSubCatIDs = $Row['catSubCatIDs'];
            $RS3 = explode("[]", $catSubCatIDs);
            // print_r($Row);exit;

            if ($RS3['1'] != '')
                $result['glCategory'] = $RS3['1'];
            else
                $result['glCategory'] = '';

            if ($RS3['3'] != '')
                $result['glSubCat'] = $RS3['3'];
            else
                $result['glSubCat'] = '';

            $response['response'] = $result;

            $response['Predata'] = $this->getPredataGlAccount();
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        // exit;
        return $response;
    }

    function uploadDefaultGlAccounts($attr) {
        
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

        $glAccountChkFlag = 0;
        $inventorySetup = $attr['inventorySetup'];

        if ($inventorySetup == 0) {
            $response['ack'] = 0;
            $response['error'] = 'Inventory Setup is not Selected!';
            return $response;
        }

        $DupChkSql = "select count(id) as total from gl_account where company_id='" . $this->arrUser['company_id'] . "'";
        $DupChkRS = $this->objsetup->CSI($DupChkSql);
        // echo $DupChkRS->fields['total'];exit;

        if ($DupChkRS->fields['total'] > 16) {
            $response['ack'] = 0;
            $response['error'] = 'Accounts already exist!';
            return $response;
        }
        else{
            $glAccountChkFlag = 1;
        }

        $DelSql = "Delete from gl_account where company_id='" . $this->arrUser['company_id'] . "'";
        $DelRS = $this->objsetup->CSI($DelSql);

        $DelLinksSql = "Delete from gl_account_link where company_id='" . $this->arrUser['company_id'] . "'";
        $DelLinksRS = $this->objsetup->CSI($DelLinksSql);

        if($inventorySetup == 2){

            $Sql = "INSERT INTO 
                        gl_account (gl_account_ref_id,
                                     name,
                                     displayName,
                                     accountCode,
                                     vatRateID,
                                     transcation,
                                     allowPosting,
                                     startRangeCode,
                                     endRangeCode,
                                     accountType,
                                     status,
                                     company_id,
                                     AddedBy,
                                     AddedOn,
                                     ChangedBy,
                                     ChangedOn) 
                        SELECT  glaccountperiodicref.id,
                                glaccountperiodicref.name,
                                glaccountperiodicref.name,
                                glaccountperiodicref.accountCode,
                                glaccountperiodicref.vatRateID,
                                glaccountperiodicref.transcation,
                                glaccountperiodicref.allowPosting,
                                glaccountperiodicref.startRangeCode,
                                glaccountperiodicref.endRangeCode,
                                glaccountperiodicref.accountType,
                                1,
                                " . $this->arrUser['company_id'] . ",
                                '" . $this->arrUser['id'] . "',
                                '" . current_date_time . "',
                                '" . $this->arrUser['id'] . "',
                                '" . current_date_time . "'
                        FROM glaccountperiodicref";

            $RS = $this->objsetup->CSI($Sql);

            $Sql2 = "INSERT INTO 
                        gl_account_link (parent_gl_account_id,
                                     child_gl_account_id,
                                     company_id,
                                     AddedBy,
                                     AddedOn,
                                     ChangedBy,
                                     ChangedOn,
                                     defaultSilverowAccount) 
                        SELECT  (SELECT id 
				                 FROM gl_account 
                                 WHERE 	gl_account_ref_id=parent_gl_account_id AND 
                                        company_id='" . $this->arrUser['company_id'] . "') AS parent_gl_account,
                                (SELECT id 
				                 FROM gl_account 
                                 WHERE 	gl_account_ref_id=child_gl_account_id AND 
                                        company_id='" . $this->arrUser['company_id'] . "') AS child_gl_account,
                                " . $this->arrUser['company_id'] . ",
                                '" . $this->arrUser['id'] . "',
                                '" . current_date_time . "',
                                '" . $this->arrUser['id'] . "',
                                '" . current_date_time . "',
                                1  
                        FROM glaccountlinkperiodicref";

            $RS2 = $this->objsetup->CSI($Sql2);

        }else{

            $Sql = "INSERT INTO 
                        gl_account (gl_account_ref_id,
                                     name,
                                     displayName,
                                     accountCode,
                                     vatRateID,
                                     transcation,
                                     allowPosting,
                                     startRangeCode,
                                     endRangeCode,
                                     accountType,
                                     status,
                                     company_id,
                                     AddedBy,
                                     AddedOn,
                                     ChangedBy,
                                     ChangedOn) 
                        SELECT  glaccountperpetualref.id,
                                glaccountperpetualref.name,
                                glaccountperpetualref.name,
                                glaccountperpetualref.accountCode,
                                glaccountperpetualref.vatRateID,
                                glaccountperpetualref.transcation,
                                glaccountperpetualref.allowPosting,
                                glaccountperpetualref.startRangeCode,
                                glaccountperpetualref.endRangeCode,
                                glaccountperpetualref.accountType,
                                1,
                                " . $this->arrUser['company_id'] . ",
                                '" . $this->arrUser['id'] . "',
                                '" . current_date_time . "',
                                '" . $this->arrUser['id'] . "',
                                '" . current_date_time . "'
                        FROM glaccountperpetualref";

            $RS = $this->objsetup->CSI($Sql);

            $Sql2 = "INSERT INTO 
                        gl_account_link (parent_gl_account_id,
                                     child_gl_account_id,
                                     company_id,
                                     AddedBy,
                                     AddedOn,
                                     ChangedBy,
                                     ChangedOn,
                                     defaultSilverowAccount) 
                        SELECT  (SELECT id 
				                 FROM gl_account 
                                 WHERE 	gl_account_ref_id=parent_gl_account_id AND 
                                        company_id='" . $this->arrUser['company_id'] . "') AS parent_gl_account,
                                (SELECT id 
				                 FROM gl_account 
                                 WHERE 	gl_account_ref_id=child_gl_account_id AND 
                                        company_id='" . $this->arrUser['company_id'] . "') AS child_gl_account,
                                " . $this->arrUser['company_id'] . ",
                                '" . $this->arrUser['id'] . "',
                                '" . current_date_time . "',
                                '" . $this->arrUser['id'] . "',
                                '" . current_date_time . "',
                                1  
                        FROM glaccountlinkperpetualref";

            $RS2 = $this->objsetup->CSI($Sql2);

        }        

        if ($this->Conn->Affected_Rows() > 0 || $glAccountChkFlag == 1) {
            // $response['ack'] = 1;
            // $response['error'] = NULL;  

            $addCatSubCatSql = "UPDATE gl_account AS gl
                                    SET
                                        category = SUBSTRING_INDEX(SR_GetGL_Category(gl.id,gl.company_id), '[]', 1),
                                        categoryID = SUBSTRING_INDEX(SR_GetGL_Category(gl.id,gl.company_id), '[]', -1),
                                        subCategory = SUBSTRING_INDEX(SR_GetGL_SubCategory(gl.id,gl.company_id), '[]', 1),
                                        subCategoryID = SUBSTRING_INDEX(SR_GetGL_SubCategory(gl.id,gl.company_id), '[]', -1)
                                WHERE (gl.category IS NULL OR gl.subCategory IS NULL) AND 
                                       gl.company_id ='" . $this->arrUser['company_id'] . "'";

            $addCatSubCatRS = $this->Conn->execute($addCatSubCatSql);          

            $DelCacheSql = "DELETE FROM gl_accountcache WHERE company_id ='" . $this->arrUser['company_id'] . "'";
            $DelCacheRS = $this->objsetup->CSI($DelCacheSql);

            $BuildCacheSql = "INSERT INTO gl_accountcache 
                              SELECT *,'" . date("Y-m-d H:i:s") . "'
                              FROM sr_gl_account_sel 
                              WHERE company_id ='" . $this->arrUser['company_id'] . "'";

            $BuildCacheRS = $this->objsetup->CSI($BuildCacheSql);

            //for fresh gl categories rec sql
            $Sql = "SELECT  gl.id as glid,
                            gl.name as sub_category_name,
                            gl.gl_account_ref_id as company_ref_gl_id,                            
                            gl.accountType as glaccountType,
                            gl.displayName as categoryDisplayName,
                            gl.startRangeCode as gl_code_range_from,
                            gl.endRangeCode as gl_code_range_to,
                            parentCAT.name as parentCATname,                            
                            refLink.parent_gl_account_id as parentID,
                            refLink.child_gl_account_id as childID
                    FROM gl_account as gl
                    left join gl_account_link as refLink on gl.id =refLink.child_gl_account_id
                    left join gl_account as parentCAT on refLink.parent_gl_account_id =parentCAT.id
                    WHERE gl.accountType IN(1,2) AND
                          gl.status=1 and 
                          gl.company_id='" . $this->arrUser['company_id'] . "' 
                    GROUP BY gl.id";

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['glid'];
                    $result['name'] = $Row['sub_category_name'];
                    $result['company_ref_gl_id'] = $Row['company_ref_gl_id'];

                    if ($Row['categoryDisplayName'] != "")
                        $result['categoryDisplayName'] = $Row['categoryDisplayName'];
                    else
                        $result['categoryDisplayName'] = $Row['sub_category_name'];

                    $result['gl_parent'] = $Row['glaccountType'];
                    $result['parentID'] = $Row['parentID'];
                    $result['childID'] = $Row['childID'];
                    $result['code_range_from'] = $Row['gl_code_range_from'];
                    $result['code_range_to'] = $Row['gl_code_range_to'];
                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['total_company_gl_accounts'] = 1;
                $this->Conn->commitTrans();
                $this->Conn->autoCommit = true;

                $srLogTrace = array();

                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['ErrorMessage'] = '';

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                
            }
            else {
                $response['ack'] = 0;
                $response['error'] = 'Record not uploaded!';
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not uploaded!';
        }
        return $response;
    }

    function get_account_cat_name($attr) {

        // $account_type = implode(',', $attr['cat_id']);
        $where_clause = ""; 
        $cat_id = (isset($attr['cat_id']) && $attr['cat_id'] != '') ? $attr['cat_id'] : 0;

        $cats = '';
        $catsFromTotal = 0;
        
        if (is_array($cat_id)) {

            $cats = "  AND glLink.parent_gl_account_id IN (";

            foreach ($cat_id as $index => $cat) {
                $Sql2 = "SELECT id  
                     From gl_account 
                     where gl_account_ref_id=".$cat." and 
                           company_id=" . $this->arrUser['company_id'] . " AND status =1
                     limit 1 ";
                // echo $Sql2; exit;

                $RS2 = $this->objsetup->CSI($Sql2, 'finance', sr_ViewPermission);

                if ($RS2->RecordCount() > 0) {

                    $Row = $RS2->FetchRow();
                    $categoryID = $Row['id'];
                    $catsFromTotal++;
                }

                $cats .= $categoryID;

                if ($index < count($cat_id) - 1) {
                    $cats.=", ";
                }
            }

            $cats .= ")";

        } else if ($cat_id > 0) {
            $Sql2 = "SELECT id  
                     From gl_account 
                     where gl_account_ref_id=".$cat_id." and 
                           company_id=" . $this->arrUser['company_id'] . " AND status =1
                     limit 1 ";
            // echo $Sql2; exit;

            $RS2 = $this->objsetup->CSI($Sql2);

            if ($RS2->RecordCount() > 0) {

                $Row = $RS2->FetchRow();
                $categoryID = $Row['id'];
                $catsFromTotal++;

                $cats = "  AND glLink.parent_gl_account_id IN (".$categoryID.")";
            }
        }
        // echo $cats;exit;

        if($catsFromTotal == 0){
            $cats = '';
        }

        if ($cat_id > 0)
            $where_clause = " AND ((gl.allowPosting=1 AND gl.accountType=3) OR gl.accountType=5 ) " . $cats;
        else
            $where_clause = " AND gl.allowPosting=1 AND gl.accountType=3";

        // $where_clause .= " AND (company_gl_accounts.parent_cat_id IN (" . $account_type . ") OR company_gl_accounts.subcat_id IN(" . $account_type . "))";

        $response = array();

        // $subQuery = "select id from gl_accountcache where company_id='" . $this->arrUser['company_id'] . "'";
        // $subQuery = $this->objsetup->whereClauseAppender($subQuery, 65);
        // gl.status=1 AND   
        $Sql = "SELECT  gl.id,
                        gl.vatRateID,
                        gl.displayName,
                        gl.accountCode,
                        (SELECT glDis.accountCodeDisplay 
                         FROM gl_account_number_display AS glDis
                         WHERE glDis.accountCode = gl.accountCode AND
                               glDis.company_id = gl.company_id
                         LIMIT 1) AS accountCodeDisplay,
                        gl.accountType,
                        gl.status,
                        glLink.child_gl_account_id
                FROM gl_account_link AS glLink
                left JOIN gl_account gl on gl.id=glLink.child_gl_account_id
                where                                            
                        glLink.company_id=" . $this->arrUser['company_id'] . " " . $where_clause . " AND gl.status =1
                group by gl.accountCode                      
                Order by gl.accountCode ASC";// gl.id IN ($subQuery)   AND  

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['displayName'];
                $result['code'] = $Row['accountCode'];

                if($Row['accountCodeDisplay'])
                    $result['code'] = $Row['accountCodeDisplay'];

                $result['vat_id'] = $Row['vatRateID'];
                $result['status'] = (int) $Row['status'];

                if ($Row['accountType'] == 3)
                    $response['response'][] = $result;

                $child_gl_account_id = $Row['child_gl_account_id'];

                if ($Row['accountType'] == 5 && $cat_id > 0) {
                    while ($child_gl_account_id > 0) {

                        $result2 = array();
                        $subQuery = "select id from gl_accountcache where company_id='" . $this->arrUser['company_id'] . "'";
                        //$subQuery = $this->objsetup->whereClauseAppender($subQuery, 65);

                        $Sql2 = "SELECT gl.id,
                                        gl.vatRateID,
                                        gl.displayName,
                                        gl.accountCode,
                                        (SELECT glDis.accountCodeDisplay 
                                         FROM gl_account_number_display AS glDis
                                         WHERE glDis.accountCode = gl.accountCode AND
                                                glDis.company_id = gl.company_id
                                         LIMIT 1) AS accountCodeDisplay,
                                        gl.accountType,
                                        glLink.child_gl_account_id
                                FROM gl_account_link AS glLink
                                left JOIN gl_account gl on gl.id=glLink.child_gl_account_id
                                where   gl.status=1 and gl.id IN (".$subQuery.")   AND 
                                        ((gl.allowPosting=1 AND gl.accountType=3) OR gl.accountType=5 ) AND
                                        glLink.parent_gl_account_id= '" . $child_gl_account_id . "' and
                                        glLink.company_id=" . $this->arrUser['company_id'] . " 
                                group by gl.accountCode 
                                Order by gl.accountCode ASC";

                        // echo $Sql2; //exit;
                        $RS2 = $this->objsetup->CSI($Sql2);

                        if ($RS2->RecordCount() > 0) {
                            while ($Row2 = $RS2->FetchRow()) {
                                $result2['id'] = $Row2['id'];
                                $result2['name'] = $Row2['displayName'];
                                $result2['code'] = $Row2['accountCode'];

                                if($Row2['accountCodeDisplay'])
                                    $result2['code'] = $Row2['accountCodeDisplay'];
                                    
                                $result2['vat_id'] = $Row2['vatRateID'];

                                if ($Row2['accountType'] == 3)
                                    $response['response'][] = $result2;

                                $child_gl_account_id = $Row2['child_gl_account_id'];
                            }
                        } else
                            $child_gl_account_id = 0;
                    }
                }
            }
            $response['ack'] = 1;
            $response['error'] = '';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No Record Found';
        }//exit;
        return $response;
    }

    /*     * *********** Account Heading ************* */

    function get_gl_accounts_heading_by_name($attr) {

        $response = array();

        $Sql = "SELECT  gl.id,
                        gl.displayName,
                        gl.accountCode,
                        gl.accountType
                    FROM gl_account AS gl
                    WHERE   gl.status=1 AND                                                
                        gl.company_id=" . $this->arrUser['company_id'] . " AND 
                        gl.accountType=5                      
                    ORDER BY gl.accountCode ASC";

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['displayName'];
                $result['code'] = $Row['accountCode'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = '';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No Record Found';
        }
        return $response;
    }

    function get_gl_accounts_heading_by_cat_id($attr) {

        $response = array();
        $cat_id = (isset($attr['cat_id']) && $attr['cat_id'] != '') ? $attr['cat_id'] : 0;

        $cats = "";
        if (is_array($cat_id)) {
            foreach ($cat_id as $index => $cat) {
               $cats .= $cat;
                if ($index < count($cat_id) - 1) {
                    $cats.=", ";
                }
            }
        } else {
            $cats .= $cat;
        }
        $where = "";
        if(strlen($cats) > 0)
        {
            $where = " AND gl.categoryID IN (SELECT id FROM `gl_account` WHERE gl_account_ref_id IN (".$cats.")) ";
        }
        $Sql = "SELECT  gl.id,
                        gl.vatRateID,
                        gl.displayName,
                        gl.accountCode,
                        gl.accountType
                FROM gl_account AS gl
                WHERE   
			        gl.company_id=" . $this->arrUser['company_id'] . " AND 
                    ((gl.allowPosting=1 AND gl.accountType=3) OR gl.accountType=5 )  
                    ".$where."
                ORDER BY gl.accountCode ASC
                ";

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['G/L No.'] = $Row['accountCode'];
                $result['G/L Name'] = $Row['displayName'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = '';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No Record Found';
        }
        return $response;
    }

    /*     * *********** Start: Account Heads Table ************* */

    /* function get_gl_account_debit_credit_by_id($attr) {

        $where = " gat.company_id = " . $this->arrUser['company_id'];

        $exportToCSV = $attr['exportToCSV'];

        if ($attr['account_type'] == '4') {

            if ($attr['range_from'] == '' || $attr['range_to'] == '') {
                $response['ack'] = 1;
                $response['response'] = array();
                return $response;
            } else
                $where .= " AND gat.gl_account_code BETWEEN  $attr[range_from] AND $attr[range_to] ";

        } else
            $where .= " AND gat.gl_account_id = $attr[account_id] ";
        
        ini_set("memory_limit","512M");

        if($exportToCSV == 1){

            $CSVDataTitle = array();
            $CSVDataTitle['posting_date'] = $this->arrUser['companyName'];
            $response['CSVData'][] = $CSVDataTitle;

            $CSVDataTitle = array();
            $CSVDataTitle['posting_date'] = $attr['acc_code'].' - '.$attr['acc_name'];
            $response['CSVData'][] = $CSVDataTitle;

            $CSVDataTitle = array();
            $response['CSVData'][] = $CSVDataTitle;
            
            $CSVDataTitle = array();
            $CSVDataTitle['posting_date'] = 'Posting Date';
            $CSVDataTitle['doctype'] = 'Doc. Type';
            $CSVDataTitle['invoice_code'] = 'Doc. No.';
            $CSVDataTitle['gl_account_no'] = 'G/L No.';
            $CSVDataTitle['source_no'] = 'Source No.';
            $CSVDataTitle['Description'] = 'Description';
            $CSVDataTitle['PostingGroup'] = 'Posting Group';
            $CSVDataTitle['debit'] = 'Debit';			
            $CSVDataTitle['credit'] = 'Credit';
            $CSVDataTitle['Amount'] = 'Amount';
            $CSVDataTitle['BalancingAccountType'] = 'Balancing Account Type';
            $CSVDataTitle['BalAccNo'] = 'Bal. Acc. No.';
            $CSVDataTitle['BalancingAccountName'] = 'Balancing Account Name';
            $CSVDataTitle['PostedBy'] = 'Posted By';
            $CSVDataTitle['entry_no'] = 'Entry No.';
            $response['CSVData'][] = $CSVDataTitle;

            $CSVDataTitle = array();
            $response['CSVData'][] = $CSVDataTitle;
        }

        $Sql = "SELECT 
                    gat.id, 
                    gat.object_id as order_id,
                    gat.invoice_dateUnConv as posting_date,
                    gat.type_description  AS docType,
                    gat.gl_account_code,
                    gat.object_no AS source_no,
                    gat.object_name AS description, 
                    gat.object_code AS invoice_code,
                    gat.postingGrp AS posting_grp,
                    gat.VAT_amount AS vat_amount,
                    gat.debit_amount_LCY AS debit_amount,
                    gat.credit_amount_LCY AS credit_amount,
                    (case when (gat.type=1 || gat.type=2) THEN 'Customer'
                          when (gat.type=3 || gat.type=4) THEN 'Supplier'  
                          WHEN (gat.type=5 || gat.type=6 || gat.type=7 || gat.type=8 || gat.type=9 || gat.type=10 || gat.type=11) THEN 'Ledger' 
                          END) AS `account_type`, 
                    gat.balanceAccountNumber AS bal_account_number,
                    gat.balanceAccountName AS bal_account_name,
                    gat.postedBy AS posted_by,
                    gat.financeCharges AS finance_charges,
                    gat.transaction_id AS entry_no
                    FROM gl_account_txn AS gat
                    WHERE
                        $where
                    ORDER BY posting_date, entry_no ASC";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $Row['credit_amount'] = round($Row['credit_amount'], 2);
                $Row['debit_amount'] = round($Row['debit_amount'], 2);

                if (floatval($Row['credit_amount']) < 0) {
                    $Row['debit_amount'] = ($Row['credit_amount'] * -1);
                    $Row['credit_amount'] = 0;
                } else if (floatval($Row['debit_amount']) < 0) {
                    $Row['credit_amount'] = ($Row['debit_amount'] * -1);
                    $Row['debit_amount'] = 0;
                }

                // $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $Row['posting_date'] = date("d/m/Y", strtotime($Row['posting_date']));


                if($exportToCSV == 1){

                    $CSVDataRec = array();                    
                    $CSVDataRec['posting_date'] = $Row['posting_date'];
                    $CSVDataRec['doctype'] = $Row['docType'];
                    $CSVDataRec['invoice_code'] = $Row['invoice_code'];
                    $CSVDataRec['gl_account_no'] = $Row['gl_account_code'];
                    $CSVDataRec['source_no'] = $Row['source_no'];
                    $CSVDataRec['Description'] = $Row['description'];
                    $CSVDataRec['PostingGroup'] = $Row['posting_grp'];

                    $CSVDataRec['debit'] = number_format((float)$Row['debit_amount'], 2, '.', '');			
                    $CSVDataRec['credit'] = number_format((float)$Row['credit_amount'], 2, '.', '');

                    if (floatval($Row['debit_amount']) > 0) {

                        $CSVDataRec['Amount'] = number_format((float)$Row['debit_amount'], 2, '.', '');

                    } else if (floatval($Row['credit_amount']) > 0) {

                        $CSVDataRec['Amount'] = (number_format((float)$Row['credit_amount'], 2, '.', '') * -1);
                    }
                    else{
                        $CSVDataRec['Amount'] = '';                        
                    }
                    
                    $CSVDataRec['BalancingAccountType'] = $Row['account_type'];
                    $CSVDataRec['BalAccNo'] = $Row['bal_account_number'];
                    $CSVDataRec['BalancingAccountName'] = $Row['bal_account_name'];
                    $CSVDataRec['PostedBy'] = $Row['posted_by'];
                    $CSVDataRec['entry_no'] = $Row['entry_no'];

                    $response['CSVData'][] = $CSVDataRec;          
                } 


                $response['response'][] = $Row;                                
            }

            if($exportToCSV == 1){  

                 require_once(SERVER_PATH . "/classes/ReportCrm.php");
                $objReportCrm = new ReportCrm($this->arrUser);

                $response['filename']=  APP_PATH . "Reports/".$attr['acc_code']."_GL_Account_".$this->arrUser['company_id'].".csv";
                $objReportCrm->createCSVfile($response);
                $response['filename'] = WEB_PATH . "/Reports/".$attr['acc_code']."_GL_Account_".$this->arrUser['company_id'].".csv";               
            }          

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['response'] = array();
        }

        ini_set("memory_limit","128M");
        return $response;
    } */

    /* function get_gl_account_debit_credit_by_id($attr) {

        $searchKeyword = '';
        $searchKeyword = $attr['searchKeyword'];

        $tempWhere = '';

        if($searchKeyword != ''){
            $tempWhere = " WHERE c.invoice_code LIKE '%".$searchKeyword."%'";
        }

        // print_r($_SESSION);exit;


        $where = " gat.company_id = " . $this->arrUser['company_id'];    
        $response = "";

        $Sql1 = " SELECT accountCode FROM gl_account WHERE id = $attr[account_id] AND company_id = " . $this->arrUser['company_id'];
        // echo $Sql1;exit;

        // $rs1 = $this->Conn->Execute($Sql1);
        $rs1 = $this->ConnReport->Execute($Sql1);
        $accountCode = $rs1->fields['accountCode'];   

        $tblCacheName = 'tempCache_'.$accountCode.'_' . $this->arrUser['company_id'].'_' .$this->arrUser['id'];
        
        $sql_total = "SELECT COUNT(*) AS total 
                      FROM information_schema.tables 
                      WHERE table_name = '".$tblCacheName."'";
        //echo $sql_total;
        $rs_count = $this->ConnReport->Execute($sql_total);
        $cacheTblExists = $rs_count->fields['total']; 

        if($cacheTblExists == 0){
            $attr['page'] = 1;
        }

        // if(isset($_SESSION[$tblCacheName]) && $_SESSION[$tblCacheName] == $tblCacheName){
        if($cacheTblExists > 0){

            $Sql = "SELECT * FROM ".$tblCacheName." AS c $tempWhere";
            // echo $Sql;exit;
        }
        else{     
            // $_SESSION['gl_account_code'] = '';   
            //unset($_SESSION[$tblCacheName]);  

            // $_SESSION[$tblCacheName] = $tblCacheName;   

            if ($attr['account_type'] == '4') {

                if ($attr['range_from'] == '' || $attr['range_to'] == '') {
                    $response['ack'] = 1;
                    $response['response'] = array();
                    return $response;
                } else
                    $where .= " AND gat.gl_account_code BETWEEN  $attr[range_from] AND $attr[range_to] ";

            } else
                $where .= " AND gat.gl_account_id = $attr[account_id] ";
            
            // ini_set("memory_limit","512M");

            // echo '<pre>';
            // print_r($GLOBALS);
            // print_r($_SESSION);

            // $DropSql = "DROP TABLE IF EXISTS ".$tblCacheName."; ";
            // echo $DropSql;exit;

            // $RsDrop = $this->objsetup->CSI($DropSql);  //TEMPORARY 

            // $InsertCacheTblSql = "INSERT INTO TempCacheTableManage
            //                                 SET 
            //                                     tempTableName = '".$tblCacheName."',
            //                                     company_id = '" . $this->arrUser['company_id'] . "',
            //                                     user_id = '" . $this->arrUser['id'] . "',
            //                                     AddedBy = '" . $this->arrUser['id'] . "',
            //                                     AddedOn = '" . current_date . "'";
            // echo $InsertCacheTblSql;exit;

            // $this->objsetup->CSI($InsertCacheTblSql);  //TEMPORARY

            $Sql2 = "CREATE  TABLE ".$tblCacheName." ENGINE=MEMORY
                     SELECT 
                            gat.id, 
                            gat.object_id as order_id,
                            gat.invoice_dateUnConv as posting_date,
                            gat.type_description  AS docType,
                            gat.gl_account_code,
                            gat.object_no AS source_no,
                            gat.object_name AS description, 
                            gat.object_code AS invoice_code,
                            gat.postingGrp AS posting_grp,
                            gat.VAT_amount AS vat_amount,
                            gat.debit_amount_LCY AS debit_amount,
                            gat.credit_amount_LCY AS credit_amount,
                            (case when (gat.type=1 || gat.type=2) THEN 'Customer'
                                when (gat.type=3 || gat.type=4) THEN 'Supplier'  
                                WHEN (gat.type=5 || gat.type=6 || gat.type=7 || gat.type=8 || gat.type=9 || gat.type=10 || gat.type=11) THEN 'Ledger' 
                                END) AS `account_type`, 
                            gat.balanceAccountNumber AS bal_account_number,
                            gat.balanceAccountName AS bal_account_name,
                            gat.postedBy AS posted_by,
                            gat.financeCharges AS finance_charges,
                            gat.transaction_id AS entry_no
                     FROM gl_account_txn AS gat
                     WHERE
                        $where
                     ORDER BY posting_date, entry_no ASC";
            // echo $Sql2;exit;

            // $RSOriginal = $this->objsetup->CSI($Sql2);
            $RSOriginal = $this->ConnReport->execute($Sql2);

            // $response['totalRec'] = $RSOriginal->RecordCount();

            // $totalRec = $RSOriginal->RecordCount();

            // if($totalRec > 0){
            //     $totalPages = $totalRec/pagination_limit;
            // } 

            // $_SESSION['gl_account_code'] = $gl_account_code; 
            
            // $attr['page'] = 1;

            $Sql = "SELECT * FROM ".$tblCacheName." AS c $tempWhere";
            // echo $Sql;exit;
        }

        $order_by = 'ORDER BY id ASC ';

        $total_limit = pagination_limit;  

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->paginationQuery($attr['page'], $Sql, $response, $total_limit, 'c', $order_by);

        // $RS = $this->objsetup->CSI($Sql)

        $RS = $this->ConnReport->execute($response['q']);
        // $RS = $this->ConnReport->execute($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $gl_account_code = $Row['gl_account_code'];

                $Row['credit_amount'] = round($Row['credit_amount'], 2);
                $Row['debit_amount'] = round($Row['debit_amount'], 2);

                if (floatval($Row['credit_amount']) < 0) {
                    $Row['debit_amount'] = ($Row['credit_amount'] * -1);
                    $Row['credit_amount'] = 0;
                } else if (floatval($Row['debit_amount']) < 0) {
                    $Row['credit_amount'] = ($Row['debit_amount'] * -1);
                    $Row['debit_amount'] = 0;
                }

                $Row['posting_date'] = date("d/m/Y", strtotime($Row['posting_date']));
                $response['response'][] = $Row;                                
            } 

            // $_SESSION['totalRecords'] = $totalRec;
            // $_SESSION['totalPages'] = $totalPages;

            //echo '<pre>';print_r($_SESSION); exit;     

            $response['ack'] = 1;
            $response['error'] = NULL;
            // $response['totalRecords'] = $totalRec;
            // $response['pagination_limit'] = pagination_limit;
            // $response['totalPages'] = $totalPages;
        } else {
            $response['ack'] = 1;
            $response['response'] = array();
        }

        // ini_set("memory_limit","128M");
        return $response;
    } */

    /*     
    function get_gl_account_debit_credit_by_id($attr) {

        $searchKeyword = '';
        $searchKeyword = $attr['searchKeyword'];

        $tempWhere = '';

        if($searchKeyword != ''){
            $tempWhere = " WHERE c.invoice_code LIKE '%".$searchKeyword."%'";
        }

        $where = " gat.company_id = " . $this->arrUser['company_id'];    
        $response = "";

        $Sql1 = " SELECT accountCode FROM gl_account WHERE id = $attr[account_id] AND company_id = " . $this->arrUser['company_id'];
        // echo $Sql1;exit;

        $rs1 = $this->ConnReport->Execute($Sql1);
        $accountCode = $rs1->fields['accountCode'];   

        $tblCacheName = 'tempCache_'.$accountCode.'_' . $this->arrUser['company_id'].'_' .$this->arrUser['id'];
        
        $sql_total = "SELECT COUNT(*) AS total 
                      FROM information_schema.tables 
                      WHERE table_name = '".$tblCacheName."'";
        //echo $sql_total;
        $rs_count = $this->ConnReport->Execute($sql_total);
        $cacheTblExists = $rs_count->fields['total']; 

        if($cacheTblExists == 0){
            $attr['page'] = 1;
        }

        if($cacheTblExists > 0){
            $response['fromCache'] = 1;
            $Sql = "SELECT * FROM ".$tblCacheName." AS c $tempWhere";
            // echo $Sql;exit;
        }
        else{ 
            $response['fromCache'] = 0;   

            if ($attr['account_type'] == '4') {

                if ($attr['range_from'] == '' || $attr['range_to'] == '') {
                    $response['ack'] = 1;
                    $response['response'] = array();
                    return $response;
                } else
                    $where .= " AND gat.gl_account_code BETWEEN  $attr[range_from] AND $attr[range_to] ";

            } else
                $where .= " AND gat.gl_account_id = $attr[account_id] ";

            $Sql2 = "CREATE  TABLE ".$tblCacheName." ENGINE=MEMORY
                     SELECT 
                            gat.id, 
                            gat.object_id as order_id,
                            gat.invoice_dateUnConv as posting_date,
                            gat.type_description  AS docType,
                            gat.gl_account_code,
                            gat.object_no AS source_no,
                            gat.object_name AS description, 
                            gat.object_code AS invoice_code,
                            gat.postingGrp AS posting_grp,
                            gat.VAT_amount AS vat_amount,
                            gat.debit_amount_LCY AS debit_amount,
                            gat.credit_amount_LCY AS credit_amount,
                            (case when (gat.type=1 || gat.type=2) THEN 'Customer'
                                when (gat.type=3 || gat.type=4) THEN 'Supplier'  
                                WHEN (gat.type=5 || gat.type=6 || gat.type=7 || gat.type=8 || gat.type=9 || gat.type=10 || gat.type=11) THEN 'Ledger' 
                                END) AS `account_type`, 
                            gat.balanceAccountNumber AS bal_account_number,
                            gat.balanceAccountName AS bal_account_name,
                            gat.postedBy AS posted_by,
                            gat.financeCharges AS finance_charges,
                            gat.transaction_id AS entry_no
                     FROM gl_account_txn AS gat
                     WHERE
                        $where
                     ORDER BY posting_date, entry_no ASC";
            // echo $Sql2;exit;

            $RSOriginal = $this->ConnReport->execute($Sql2);

            $Sql = "SELECT * FROM ".$tblCacheName." AS c $tempWhere";
            // echo $Sql;exit;
        }

        $order_by = 'ORDER BY id ASC ';

        $total_limit = pagination_limit;  

        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->paginationQuery($attr['page'], $Sql, $response, $total_limit, 'c', $order_by);

        $RS = $this->ConnReport->execute($response['q']);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $gl_account_code = $Row['gl_account_code'];

                $Row['credit_amount'] = round($Row['credit_amount'], 2);
                $Row['debit_amount'] = round($Row['debit_amount'], 2);

                if (floatval($Row['credit_amount']) < 0) {
                    $Row['debit_amount'] = ($Row['credit_amount'] * -1);
                    $Row['credit_amount'] = 0;
                } else if (floatval($Row['debit_amount']) < 0) {
                    $Row['credit_amount'] = ($Row['debit_amount'] * -1);
                    $Row['debit_amount'] = 0;
                }

                $Row['posting_date'] = date("d/m/Y", strtotime($Row['posting_date']));
                $response['response'][] = $Row;                                
            }     

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['response'] = array();
        }
        return $response;
    }
     */

    function get_gl_account_debit_credit_by_id($attr) {

        $searchKeyword = '';
        $searchKeyword = $attr['searchKeyword'];

        $tempWhere = '';

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        /* if($searchKeyword != ''){
            // $tempWhere = " WHERE c.invoice_code LIKE '%".$searchKeyword."%'";
            $tempWhere = " AND tbl.invoice_code LIKE '%".$searchKeyword."%'";
        } */
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        $where = " tbl.company_id = " . $this->arrUser['company_id'];    
        $response = array();
 

        if ($attr['account_type'] == '4') {

            if ($attr['range_from'] == '' || $attr['range_to'] == '') {
                $response['ack'] = 1;
                $response['response'] = array();
                return $response;
            } else
                $where .= " AND tbl.gl_account_id IN (SELECT gl.id 
                                                        FROM gl_account AS gl 
                                                        WHERE gl.company_id = '".$this->arrUser['company_id']."' AND 
                                                              gl.status =1 AND 
                                                              gl.accountcode BETWEEN ".$attr['range_from']." AND ".$attr['range_to']." )";
                
                //AND tbl.gl_account_code BETWEEN  $attr[range_from] AND $attr[range_to] 

        } else
            $where .= " AND tbl.gl_account_id = $attr[account_id] ";

        $Sqla = "SELECT (COALESCE(SUM(ROUND(tbl.debit_amount_LCY,2)),0) - COALESCE(SUM(ROUND(tbl.credit_amount_LCY,2)),0)) AS AMOUNT
				 FROM (SELECT gat.type_description AS docType,
                              gat.company_id,
                              gat.gl_account_id,
                              gat.gl_account_code,
                              gat.object_code AS invoice_code,
                              gat.postingGrp AS posting_grp,
                              gat.VAT_amount AS vat_amount,

                              (CASE WHEN gat.debit_amount_LCY > 0 THEN gat.debit_amount_LCY 
                                    WHEN gat.credit_amount_LCY < 0 THEN (gat.credit_amount_LCY)*(-1)
                                ELSE NULL END) AS debit_amount_LCY,
                              (CASE WHEN gat.credit_amount_LCY > 0 THEN gat.credit_amount_LCY
                                    WHEN gat.debit_amount_LCY < 0 THEN (gat.debit_amount_LCY)*(-1)
                                    ELSE NULL END) AS credit_amount_LCY,
                              (CASE WHEN gat.debit_amount_LCY > 0 THEN gat.debit_amount_LCY 
                                    WHEN gat.credit_amount_LCY < 0 THEN (gat.credit_amount_LCY)*(-1)
                                ELSE NULL END) AS debit_amount,
                              (CASE WHEN gat.credit_amount_LCY > 0 THEN gat.credit_amount_LCY
                                    WHEN gat.debit_amount_LCY < 0 THEN (gat.debit_amount_LCY)*(-1)
                                    ELSE NULL END) AS credit_amount,
                              (CASE WHEN(gat.debit_amount_LCY <>0) THEN gat.debit_amount_LCY
                                    WHEN(gat.credit_amount_LCY >0) THEN (gat.credit_amount_LCY)*(-1)
                                    WHEN(gat.credit_amount_LCY <0) THEN gat.credit_amount_LCY
                                    END) AS amount,
                              gat.object_no AS source_no,
                              gat.object_name AS description,
                              gat.invoice_date as posting_date,
                             (CASE WHEN (gat.type=1 OR gat.type=2) THEN 'Customer'
                                   WHEN (gat.type=3 OR gat.type=4) THEN 'Supplier'  
                                   WHEN (gat.type=5 OR gat.type=6 OR gat.type=7 OR gat.type=8 OR gat.type=9 OR gat.type=10 OR gat.type=11) THEN 'Ledger' 
                                   END) AS `account_type`, 
                              gat.balanceAccountNumber AS bal_account_number,
                              gat.balanceAccountName AS bal_account_name,
                              gat.postedBy AS posted_by,
                              gat.transaction_id AS entry_no
                       FROM gl_account_txn AS gat 
                       WHERE gat.company_id = " . $this->arrUser['company_id'].") AS tbl
                 WHERE ".$where." ".$where_clause." ";
        // echo $Sqla;exit;

        $RSa = $this->objsetup->CSI($Sqla);

        if ($RSa->RecordCount() > 0) {
            $Rowa = $RSa->FetchRow();
            $totalAmount = number_format($Rowa['AMOUNT'], 2);  
        }

        $Sql = "SELECT * FROM (SELECT
                        gat.id, 
                        gat.object_id as order_id,
                        gat.invoice_date as posting_date,
                        gat.type_description  AS docType,
                        gat.gl_account_code,
                        gat.object_no AS source_no,
                        gat.object_name AS description, 
                        (CASE WHEN (gat.type=5) THEN (SELECT pd.document_no FROM payment_details AS pd WHERE pd.id = gat.ref_id)   
                              ELSE gat.object_code
                            END) AS `invoice_code`, 
                        gat.postingGrp AS posting_grp,
                        gat.VAT_amount AS vat_amount,
                        (CASE WHEN gat.debit_amount_LCY > 0 THEN gat.debit_amount_LCY 
                              WHEN gat.credit_amount_LCY < 0 THEN (gat.credit_amount_LCY)*(-1)
                         ELSE NULL END) AS debit_amount,
                        (CASE WHEN gat.credit_amount_LCY > 0 THEN gat.credit_amount_LCY
                              WHEN gat.debit_amount_LCY < 0 THEN (gat.debit_amount_LCY)*(-1)
                              ELSE NULL END) AS credit_amount,
                        (CASE WHEN(gat.debit_amount_LCY <>0) THEN gat.debit_amount_LCY
                              WHEN(gat.credit_amount_LCY >0) THEN (gat.credit_amount_LCY)*(-1)
                              WHEN(gat.credit_amount_LCY <0) THEN gat.credit_amount_LCY
                              END) AS amount,
                        gat.company_id,
                        gat.gl_account_id,
                        (CASE WHEN (gat.type=1 OR gat.type=2) THEN 'Customer'
                            WHEN (gat.type=3 OR gat.type=4) THEN 'Supplier'  
                            WHEN (gat.type=5 OR gat.type=6 OR gat.type=7 OR gat.type=8 OR gat.type=9 OR gat.type=10 OR gat.type=11) THEN 'Ledger' 
                            END) AS `account_type`, 
                        gat.balanceAccountNumber AS bal_account_number,
                        gat.balanceAccountName AS bal_account_name,
                        gat.postedBy AS posted_by,
                        gat.financeCharges AS finance_charges,
                        gat.transaction_id AS entry_no,
                        gat.DebitorCreditSign AS DebitorCreditSign
                    FROM gl_account_txn AS gat
                    WHERE gat.company_id = " . $this->arrUser['company_id'].") as tbl
                    WHERE 1 and ".$where." ".$tempWhere." ".$where_clause." ";
        // echo $Sql;exit;

        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        
        if ($order_clause == "")
            $order_type = " Order BY tbl.posting_date DESC ";//Order BY tbl.id ASC
        else
            $order_type = $order_clause;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                // $gl_account_code = $Row['gl_account_code'];

                // $Row['credit_amount'] = round($Row['credit_amount'], 2);
                // $Row['debit_amount'] = round($Row['debit_amount'], 2);

                /* if($Row['debit_amount']>0)
                    $Row['amount'] = $Row['debit_amount'];    

                if($Row['credit_amount']>0)
                    $Row['amount'] = ($Row['credit_amount'] * -1);   */

                if(floatval($Row['amount']) == 0)
                {
                    if($Row['DebitorCreditSign'] == 'C')
                    {
                        $Row['credit_amount'] = '0';
                    }
                    else
                    {
                        $Row['debit_amount'] = '0';
                    }
                    $Row['amount'] = '0';
                }
                
                /* if (floatval($Row['credit_amount']) < 0) {
                    $Row['debit_amount'] = ($Row['credit_amount'] * -1);                    
                    // $Row['debit_amount'] = number_format($Row['debit_amount'], 2);  

                    $Row['credit_amount'] = 0;
                } else if (floatval($Row['debit_amount']) < 0) {
                    $Row['credit_amount'] = ($Row['debit_amount'] * -1);
                    // $Row['credit_amount'] = number_format($Row['credit_amount'], 2);
                    $Row['debit_amount'] = 0;
                } */

                /* if($Row['debit_amount']>0)
                    $Row['debit_amount'] = number_format($Row['debit_amount'], 2);                 
                
                if($Row['credit_amount']>0)
                    $Row['credit_amount'] = number_format($Row['credit_amount'], 2); 
                  */             
                // $Row['amount'] = number_format($Row['amount'], 2);             

                // $Row['posting_date'] = date("d/m/Y", strtotime($Row['posting_date']));
                // $Row['posting_date'] = $Row['posting_date'];
                $response['response'][] = $Row;                                
            }     

            $response['totalAmount'] = $totalAmount;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['totalAmount'] = 0;
            $response['response'] = array();
        }
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("GLActivity");
        return $response;
    }


    function paginationQuery($page, $Sql_query, $response, $dynamic_limit, $alias, $order_type)
    {
        //pagination_limit
         $sql_total = "SELECT COUNT(*) as total FROM (".$Sql_query.") as tabless";
        //echo $sql_total;
        // $rs_count = $this->ConnReport->Execute($sql_total);
        $rs_count = $this->objsetup->CSI($sql_total);
        $response['total'] = $rs_count->fields['total'];      

        $page = (isset($page)) ? $page : 1;
        $offset = ($page - 1) * $dynamic_limit;
        // $offset = $offset != 0 ? $offset + 1: $offset;
        $limit = $dynamic_limit; //$page *

        if ($page > 0)
            $dynamic_limit_clause = "LIMIT ".$offset.", ".$limit." ";

        $order_clause = " ORDER BY ".$alias.".id ASC";

        if (!empty($order_type))
            $order_clause = $order_type;

        $Sql_query .= $order_clause.$dynamic_limit_clause;
        $response['q'] = $Sql_query;
        // $RS  = $this->Conn->Execute($Sql_query);
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

    function generate_glAccountCSVbyID($attr) {

        $where = " tbl.company_id = " . $this->arrUser['company_id'];

        $searchKeyword = '';
        $searchKeyword = $attr['searchKeyword'];

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        $exportToCSV = $attr['exportToCSV'];

        if ($attr['account_type'] == '4') {

            if ($attr['range_from'] == '' || $attr['range_to'] == '') {
                $response['ack'] = 1;
                $response['response'] = array();
                return $response;
            } else
                $where .= " AND tbl.gl_account_code BETWEEN  ".$attr['range_from']." AND ".$attr['range_to']." ";

        } else
            $where .= " AND tbl.gl_account_id = ".$attr['account_id'];
        

        if($exportToCSV == 1){

            $CSVDataTitle = array();
            $CSVDataTitle['posting_date'] = $this->arrUser['companyName'];
            $response['CSVData'][] = $CSVDataTitle;

            $CSVDataTitle = array();
            $CSVDataTitle['posting_date'] = $attr['acc_code'].' - '.$attr['acc_name'];
            $response['CSVData'][] = $CSVDataTitle;

            $CSVDataTitle = array();
            $response['CSVData'][] = $CSVDataTitle;
            
            $CSVDataTitle = array();
            $CSVDataTitle['posting_date'] = 'Posting Date';
            $CSVDataTitle['doctype'] = 'Doc. Type';
            $CSVDataTitle['invoice_code'] = 'Doc. No.';
            $CSVDataTitle['gl_account_no'] = 'G/L No.';
            $CSVDataTitle['source_no'] = 'Source No.';
            $CSVDataTitle['Description'] = 'Description';
            $CSVDataTitle['PostingGroup'] = 'Posting Group';
            $CSVDataTitle['debit'] = 'Debit';			
            $CSVDataTitle['credit'] = 'Credit';
            $CSVDataTitle['Amount'] = 'Amount';
            $CSVDataTitle['BalancingAccountType'] = 'Balancing Account Type';
            $CSVDataTitle['BalAccNo'] = 'Bal. Acc. No.';
            $CSVDataTitle['BalancingAccountName'] = 'Balancing Account Name';
            $CSVDataTitle['PostedBy'] = 'Posted By';
            $CSVDataTitle['entry_no'] = 'Entry No.';
            $response['CSVData'][] = $CSVDataTitle;

            $CSVDataTitle = array();
            $response['CSVData'][] = $CSVDataTitle;
            
            require_once(SERVER_PATH . "/classes/ReportCrm.php");
            $objReportCrm = new ReportCrm($this->arrUser);

            $response['filename']=  APP_PATH . "Reports/".$attr['acc_code']."_GL_Account_".$this->arrUser['company_id'].".csv";
            $objReportCrm->createCSVfile2($response);

            $CSVRecCounter = 0;
            $response['CSVData'] = array();
        }

        $Sql = "SELECT * FROM (SELECT 
                    gat.id, 
                    gat.object_id as order_id,
                    gat.invoice_date as posting_date,
                    gat.type_description  AS docType,
                    gat.gl_account_code,
                    gat.object_no AS source_no,
                    gat.object_name AS description, 
                    gat.object_code AS invoice_code,
                    gat.postingGrp AS posting_grp,
                    gat.VAT_amount AS vat_amount,
                    gat.debit_amount_LCY AS debit_amount,
                    gat.credit_amount_LCY AS credit_amount,
                    (CASE WHEN(gat.debit_amount_LCY >0) THEN gat.debit_amount_LCY
                          WHEN(gat.credit_amount_LCY >0) THEN gat.credit_amount_LCY
                          END) AS amount,
                    gat.company_id,
                    gat.gl_account_id,
                    (case when (gat.type=1 OR gat.type=2) THEN 'Customer'
                          when (gat.type=3 OR gat.type=4) THEN 'Supplier'  
                          WHEN (gat.type=5 OR gat.type=6 OR gat.type=7 OR gat.type=8 OR gat.type=9 OR gat.type=10 OR gat.type=11) THEN 'Ledger' 
                          END) AS `account_type`, 
                    gat.balanceAccountNumber AS bal_account_number,
                    gat.balanceAccountName AS bal_account_name,
                    gat.postedBy AS posted_by,
                    gat.financeCharges AS finance_charges,
                    gat.transaction_id AS entry_no
                FROM gl_account_txn AS gat) as tbl
                WHERE 1 and ".$where.$where_clause;
                    // WHERE
                    //     $where
                    // ORDER BY posting_date, entry_no ASC";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                // $CSVDataRec = array();

                $gl_account_code = $Row['gl_account_code'];

                /* $Row['credit_amount'] = round($Row['credit_amount'], 2);
                $Row['debit_amount'] = round($Row['debit_amount'], 2);

                if (floatval($Row['credit_amount']) < 0) {
                    $Row['debit_amount'] = ($Row['credit_amount'] * -1);
                    $Row['credit_amount'] = 0;
                } else if (floatval($Row['debit_amount']) < 0) {
                    $Row['credit_amount'] = ($Row['debit_amount'] * -1);
                    $Row['debit_amount'] = 0;
                } */

                if($Row['debit_amount']>0)
                    $Row['amount'] = $Row['debit_amount'];    

                if($Row['credit_amount']>0)
                    $Row['amount'] = ($Row['credit_amount'] * -1);  

                if (floatval($Row['credit_amount']) < 0) {

                    $Row['debit_amount'] = ($Row['credit_amount'] * -1);  
                    $Row['credit_amount'] = 0;

                } else if (floatval($Row['debit_amount']) < 0) {

                    $Row['credit_amount'] = ($Row['debit_amount'] * -1);
                    $Row['debit_amount'] = 0;

                }

                // $Row['posting_date'] = date("d/m/Y", strtotime($Row['posting_date']));
                $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);

                if($exportToCSV == 1){

                    $CSVDataRec = array();                    
                    $CSVDataRec['posting_date'] = $Row['posting_date'];
                    $CSVDataRec['doctype'] = $Row['docType'];
                    $CSVDataRec['invoice_code'] = $Row['invoice_code'];
                    $CSVDataRec['gl_account_no'] = $Row['gl_account_code'];
                    $CSVDataRec['source_no'] = $Row['source_no'];
                    $CSVDataRec['Description'] = $Row['description'];
                    $CSVDataRec['PostingGroup'] = $Row['posting_grp'];

                    $CSVDataRec['debit'] = number_format((float)$Row['debit_amount'], 2, '.', '');			
                    $CSVDataRec['credit'] = number_format((float)$Row['credit_amount'], 2, '.', '');

                    if (floatval($Row['debit_amount']) > 0) {

                        $CSVDataRec['Amount'] = number_format((float)$Row['debit_amount'], 2, '.', '');

                    } else if (floatval($Row['credit_amount']) > 0) {

                        $CSVDataRec['Amount'] = (number_format((float)$Row['credit_amount'], 2, '.', '') * -1);
                    }
                    else{
                        $CSVDataRec['Amount'] = '';                        
                    }
                    
                    $CSVDataRec['BalancingAccountType'] = $Row['account_type'];
                    $CSVDataRec['BalAccNo'] = $Row['bal_account_number'];
                    $CSVDataRec['BalancingAccountName'] = $Row['bal_account_name'];
                    $CSVDataRec['PostedBy'] = $Row['posted_by'];
                    $CSVDataRec['entry_no'] = $Row['entry_no'];

                    $response['CSVData'][] = $CSVDataRec; 

                    if($CSVRecCounter>1000 || $CSVRecCounter == 0) {
                        $CSVRecCounter = 0;

                        $objReportCrm->createCSVFileAppend($response);
                        $response['CSVData'] = array();
                    }

                    $CSVRecCounter++;         
                }                              
            }

            if($CSVRecCounter>0){
                $CSVRecCounter = 0;

                $objReportCrm->createCSVFileAppend($response);
                $response['CSVData'] = array();
            }

            $response['filename'] = WEB_PATH . "/Reports/".$attr['acc_code']."_GL_Account_".$this->arrUser['company_id'].".csv";    

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['response'] = array();
        }

        return $response;
    }

    function deleteGlAccountTempTable($attr) {


        /* $tblCacheName = 'tempCache_'.$attr['acc_code'].'_' . $this->arrUser['company_id'].'_' .$this->arrUser['id'];

        // $_SESSION[$tblCacheName] = '';
        $DropSql = "DROP TABLE IF EXISTS ".$tblCacheName."; ";
        // echo $DropSql;exit;
        
        // $this->ConnReport->execute($DropSql); 
        $this->objsetup->CSI($DropSql); */

        /* $DeleteSql = "DELETE FROM TempCacheTableManage 
                      WHERE tempTableName= '".$tblCacheName."' AND 
                            company_id= '".$this->arrUser['company_id']."' AND
                            user_id= '".$this->arrUser['id']."' ";
        // echo $DeleteSql;exit;
        
        $this->objsetup->CSI($DeleteSql);  */

        /* if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        } */

        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;

    }


    function get_child_sum($check_referenc, $reference_id, $arr) {
        $amount = 0;
        while ($Row2 = $arr->FetchRow()) {
            if (($Row2['reference_id'] > 0 && $Row2['check_reference'] == 0) && ($reference_id == $Row2['reference_id']))
                $amount += $Row2['amount']; //convert_amount
        }
        return $amount;
    }

    function get_accounts_popup($attr) {
        $this->objGeneral->mysql_clean($attr);


        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND p.name LIKE '%".$attr['keyword']."%' ";
        }
        if (empty($attr['all'])) {

            if (empty($attr['start']))
                $attr['start'] = 0;

            if (empty($attr['limit']))
                $attr['limit'] = 10;

            $limit_clause = " LIMIT ".$attr['start']." , ".$attr['limit']."";
        }
        $response = array();

        $Sql = "SELECT  account_heads.id, 
                        account_heads.number, 
                        account_heads.name,
                        account_heads.posting_type,
                        account_heads.transcation_type,
                        account_heads.account_type,
                        account_heads.total,
                        account_heads.status,
                        gl_category.name as category_gl,
                        account_category.name as cat_name,
                        vat.vat_name as vname
                FROM account_heads  
                LEFT JOIN account_category ON account_category.id = account_heads.category_id
                LEFT JOIN gl_category on gl_category.id=account_category.parent_id 
                LEFT JOIN vat on vat.id=account_heads.vat_list_id 
                where account_heads.status=1 and 
                      account_heads.company_id=" . $this->arrUser['company_id'] . "
                order by account_heads.number DESC";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['item_code'] = $Row['number'];
                $result['description'] = $Row['name'];
                $result['category_name'] = $Row['cat_name'];
                $result['unit_of_measure_name'] = '';
                $result['vname'] = $Row['vname'];
                $result['standard_price'] = '';
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_parent($attr) {
        $where_clause = "";
        $response = array();

        $sql_total = "  SELECT account_category.id, account_category.name
                        FROM account_category 
                        left  JOIN gl_category on gl_category.id=account_category.parent_id 
                        where  gl_category.id='".$attr['id']."'";  //account_category.gl_category_id 


        $RS = $this->objsetup->CSI($sql_total);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response_new'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response_new'][] = array();
        }

        if (!empty($attr['parent_id'])) {
            $where_clause .= " AND gl_category_id = '".$attr['parent_id']."' AND category_id = '".$attr['cid']."' ";
        }

        $sql_total = "  SELECT MAX(ef.number) AS total
                        FROM account_heads ef
                        WHERE ef.status=1    ".$where_clause."
                        and ef.company_id=" . $this->arrUser['company_id'] . " ";

        $rs_count = $this->objsetup->CSI($sql_total);
        $name = 10 + $rs_count->fields['total'];

        if (empty($rs_count->fields['total'])) {

            $sql_total = "  SELECT ef.start_amount AS total
                            FROM gl_category ef
                            LEFT JOIN account_category ON account_category.parent_id = ef.id
                            WHERE ef.status=1    AND ef.id = '".$attr['id']."' ";

            $rs_count = $this->objsetup->CSI($sql_total);
            $name = $rs_count->fields['total'];
        }
        $response['code'] = '' . $name;

        $response['response']['code'] = '' . $name;
        return $response;
    }

    function get_list_one($attr) {
        $this->objGeneral->mysql_clean($attr);

        $where_clause = "";
        $response = array();

        if (!empty($attr['pid'])) {
            $where_clause .= " AND parent_id = '".$attr['pid']."' ";
        }
        if (!empty($attr['id'])) {
            $where_clause .= " AND category_id = '".$attr['id']."' ";
        }

        $sql_total = "  SELECT id, name ,number,parent_id
                        FROM account_heads 
                        where  status=1 ".$where_clause." ";

        $RS = $this->objsetup->CSI($sql_total);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'] . " - " . $Row['number'];
                $result['parent_id'] = $Row['parent_id'];
                $response['response_one'][] = $result;
                $response['response_two'][] = $result;
                $response['response_three'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response_one'][] = array();
            $response['response_two'][] = array();
            $response['response_three'][] = array();
        }
        return $response;
    }

    function add_account_heads($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);


        if (!empty($arr_attr['id'])) {
            $gl_id = $arr_attr['id'];
        }

        $parent = 0;
        $level = 0;
        if (!empty($arr_attr['category_id']))
            $parent = $arr_attr['category_id'];

        if (!empty($arr_attr['level_one'])) {
            $level = 1;
            $parent = $arr_attr['level_one'];
        }
        if (!empty($arr_attr['level_second'])) {
            $level = 2;
            $parent = $arr_attr['level_second'];
        }
        if (!empty($arr_attr['level_third'])) {
            $level = 3;
            $parent = $arr_attr['level_third'];
        }

        $sql_total = "SELECT  count(id) as total	FROM gl_category
                        where    company_id='" . $this->arrUser['company_id'] . "'
                        and status=1 and  ".$arr_attr['number']." BETWEEN start_amount AND end_amount  ";

        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];
        if ($total == 0) {
            $response['error'] = NULL;
            $response['ack'] = 0;
            $response['msg'] = 'Number is Not Exists in GL Category!';
            return $response;
        }

        if ($gl_id == 0) {
            $sql_total = "SELECT  count(id) as total	FROM account_heads where
				number='".$arr_attr['number']."' and ef.company_id=" . $this->arrUser['company_id'] . "  LIMIT 1 ";
            //and name='".$arr_attr['name']."'
            $rs_count = $this->objsetup->CSI($sql_total);
            $total = $rs_count->fields['total'];

            if ($total > 0) {
                $response['ack'] = 0;
                $response['msg'] = 'Record Already Exists.';
                return $response;
            } else {
                $Sql = "INSERT INTO account_heads
								    SET 
                                        category_id='$arr_attr[category_id]',
                                        gl_category_id='$arr_attr[gl_category_id]',
                                        parent_id='$parent',
                                        level='$level',
                                        number='$arr_attr[number]',
                                        range_from='$arr_attr[range_from]',
                                        range_to='$arr_attr[range_to]',
                                        account_type='$arr_attr[account_types]',
                                        company_account='$arr_attr[company_accounts]',
                                        name='".$arr_attr['name']."', 
                                        posting_type= '$arr_attr[posting_type]',
                                        transcation_type= '$arr_attr[transcation_type]', 
                                        vat_list_id='$arr_attr[vat_list_id]'  ,
                                        level_one='$arr_attr[level_one]'  ,
                                        level_second='$arr_attr[level_second]'  ,
                                        level_third='$arr_attr[level_third]'   ,
                                        status=1,
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "',
                                        date_added='" . current_date . "'";
                //$RS = $this->objsetup->CSI($Sql);
                //$gl_id = $this->Conn->Insert_ID();
                $new_msg = 'Add';
            }
        } else {

            $Sql = "UPDATE account_heads 
                                    SET
                                        category_id='$arr_attr[category_id]',
                                        gl_category_id='$arr_attr[gl_category_id]',
                                        parent_id='$parent',
                                        level='$level',
                                        number='$arr_attr[number]',
                                        name='".$arr_attr['name']."', 
                                        posting_type= '$arr_attr[posting_type]',
                                        transcation_type= '$arr_attr[transcation_type]',
                                        range_from='$arr_attr[range_from]',
                                        range_to='$arr_attr[range_to]',
                                        account_type='$arr_attr[account_types]',
                                        company_account='$arr_attr[company_accounts]',
                                        vat_list_id='$arr_attr[vat_list_id]'  ,
                                        level_one='$arr_attr[level_one]'  ,
                                        level_second='$arr_attr[level_second]'  ,
                                        level_third='$arr_attr[level_third]'  ,
                                        status='$arr_attr[status]'  
                                    WHERE id = " . $gl_id . "  Limit 1";
            $new_msg = 'Edit';
        }

        $RS = $this->objsetup->CSI($Sql);
        //echo $Sql;exit;

        $message = "Record  $new_msg .";
        if ($this->Conn->Affected_Rows() > 0) {
            //$response['gl_id'] = $gl_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $message;
            $response['info'] = $new_msg;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not Updated!';
            $response['msg'] = $message;
        }

        return $response;
    }

    function get_accounts_gl($attr) {
        $this->objGeneral->mysql_clean($attr);

        $response = array();

        $limit_clause = $where_clause = "";


        $Sql = "SELECT  account_heads.id, 
                        account_heads.number, 
                        account_heads.name,
                        account_heads.posting_type,
                        account_heads.transcation_type,
                        account_heads.account_type,
                        account_heads.total,
                        account_heads.status,
                        gl_category.name as category_gl,
                        account_category.name as cat_name,
                        vat.vat_name as vname
                FROM account_heads  
                LEFT JOIN account_category ON account_category.id = account_heads.category_id
                LEFT  JOIN gl_category on gl_category.id=account_category.parent_id 
                LEFT  JOIN vat on vat.id=account_heads.vat_list_id 
                where account_heads.status=1 and 
                      account_heads.company_id=" . $this->arrUser['company_id'] . "
                order by account_heads.number DESC";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                //$result['account_code'] = $Row['gl_code'];
                $result['G/L Code'] = $Row['number'];
                $result['number'] = $Row['number'];
                $result['desription'] = ucwords($Row['name']);
                $result['category'] = $Row['category_gl'];
                $result['sub_category'] = $Row['cat_name'];
                $result['VAT_Rate'] = $Row['vname'];

                $result['net_change'] = '';
                $result['date_balance'] = '';
                $result['balance'] = '';

                if ($Row['balance'] != 0)
                    $result['balance'] = $Row['balance'];
                    
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        //return $response;


        $sql_total = "  SELECT gl_category.id, gl_category.name 
                        FROM gl_category
                        where  gl_category.status=1 ";
        $RS = $this->objsetup->CSI($sql_total);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response_category'][] = $result;
            }
        } else {
            $response['response_category'][] = array();
        }

        $limit_clause = $where_clause = "";

        if (!empty($attr['keyword'])) {
            $where_clause .= " AND p.name LIKE '%".$attr['keyword']."%' ";
        }
        if (empty($attr['all'])) {

            if (empty($attr['start']))
                $attr['start'] = 0;
            if (empty($attr['limit']))
                $attr['limit'] = 10;

            $limit_clause = " LIMIT ".$attr['start']." , ".$attr['limit']."";
        }

        $Sql = "SELECT  account_heads.id, 
                        account_heads.number, 
                        account_heads.name, 
                        account_heads.category_id,
                        account_heads.gl_category_id		
                FROM account_heads  
                where account_heads.status=1 and 
                      account_heads.company_id=" . $this->arrUser['company_id'] . "
                order by account_heads.number DESC";
        //	echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'] . '-' . $Row['number'];
                $result['category_id'] = $Row['category_id'];
                $result['gl_category_id'] = $Row['gl_category_id'];

                $response['response_account'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        //print_r($response);exit;
        return $response;
    }

    function get_account_heads() {

        $Sql = "SELECT * FROM account_heads";
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->GetArray();

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function get_account_heads_type_id($attr) {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT  account_heads.id,
                        account_heads.number,
                        account_heads.name,
                        account_heads.posting_type
                FROM account_heads
                where  account_heads.category_id='".$attr['type_id']."' and 
                    account_heads.status=1 and 
                    account_heads.company_id=" . $this->arrUser['company_id'] . "
                order by account_heads.id DESC"; //account_heads.posting_type='$attr[type_id]'
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['number'] = $Row['number'];
                $result['name'] = $Row['name'];
                //	$result['posting_type'] = ($Row['posting_type'] == 1)?"BALANCE SHEET":"Profit & Loass";
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_new_number($attr) {
        $where_clause = "";

        if (!empty($attr['parent_id'])) {
            $where_clause .= " AND gl_category_id = '$attr[parent_id]'  ";
        }

        if (!empty($attr['cid'])) {
            $where_clause .= " AND  category_id = '$attr[cid]' ";
        }


        $sql_total = "  SELECT MAX(ef.number) AS total
                        FROM account_heads ef
                        WHERE ef.status=1 $where_clause and 
                              ef.company_id=" . $this->arrUser['company_id'] . " ";

        $rs_count = $this->objsetup->CSI($sql_total);
        $name = 10 + $rs_count->fields['total'];

        if (empty($rs_count->fields['total'])) {
            $sql_total = "SELECT ef.start_amount AS total
			FROM gl_category ef
			LEFT JOIN account_category ON account_category.parent_id = ef.id
			WHERE ef.status=1    AND ef.id = '$attr[cid]' ";
            $rs_count = $this->objsetup->CSI($sql_total);
            $name = $rs_count->fields['total'];
        }
        $response['code'] = '' . $name;

        $response['response']['code'] = '' . $name;
        return $response;
    }

    function get_accounts_history($attr) {

        $sql_total = "  SELECT ac.*,tp.name as  tname
                        FROM accounts ac
                        JOIN account_heads ah on ah.id=ac.gl_id  
                        JOIN accounts_type tp on tp.id=ac.type  
                        where ac.status=1  and  ac.gl_id='".$attr['id']."'
                        order by ac.id DESC";
        $RS = $this->objsetup->CSI($sql_total);
        // echo $sql_total;exit;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['order_no'] = $Row['order_no'];
                $result['type'] = $Row['tname'];
                $result['tran_type'] = ($Row['tran_type'] == "1") ? "Credit" : "Debit";
                $result['amount'] = $Row['amount'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['_new'][] = array();
        }

        return $response;
    }

    /*     * *********** End: Account Heads Table ************* */

    function get_gl_popup($attr) {
        $limit_clause = $where_clause = "";

        $response = array();
        $total = "";

        $Sql = "SELECT gle.posting_date,gle.account_head,gle.description,gle.code,gle.source_id,gle.business_posting_title,gle.product_posting_title,gle.amount,gle.type,gle.order_id
                FROM general_ledger_entry gle
                left  JOIN company on company.id=gle.company_id 
                where gle.account_head =" . $attr['id'] . " and
                    (gle.company_id=" . $this->arrUser['company_id'] . " or 
                    company.parent_id=" . $this->arrUser['company_id'] . ")
                order by gle.id DESC"; //gle.status=1 and
        // print_r($Sql);exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $result['account_head'] = $Row['account_head'];
                $result['description'] = $Row['description'];
                $result['document_no'] = $Row['code'];
                $result['source_no'] = $Row['source_id'];
                $result['business_posting_title'] = $Row['business_posting_title'];
                $result['product_posting_title'] = $Row['product_posting_title'];
                $result['amount'] = $Row['amount'];
                $result['entry_no'] = $Row['order_id'];
                $result['type'] = $Row['type'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        foreach ($response['response'] as $row) {
            $total += $row[amount];
        }
        $response['total_final'] += $total;
        return $response;
    }

    /*     * *********** Goods-Received-account ************* */

    function getGoodsReceivedAccount($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "SELECT  goods_received_gl_account	
                FROM financial_settings
                WHERE company_id=" . $this->arrUser['company_id'] . "
                Limit 1";
        //echo $Sql; exit;
        $RS2 = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS2->RecordCount() > 0) {

            $Row2 = $RS2->FetchRow();
            $response['ack'] = 1;

            $response['goods_received_gl_account'] = $Row2['goods_received_gl_account'];

            if($Row2['goods_received_gl_account']>0)
                $response['goods_received_gl_account_code'] = $this->get_glaccount_byid($Row2['goods_received_gl_account']);
            else
                $response['goods_received_gl_account_code'] = '';

        } else {
            $response['response'] = array();
        }

        return $response;
    }

    /*     * *********** VAT-posting-account ************* */

    function getVatPostingAccount($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "SELECT  VatPosting_gl_account	
                FROM financial_settings
                WHERE company_id=" . $this->arrUser['company_id'] . "
                Limit 1";
        //echo $Sql; exit;
        $RS2 = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS2->RecordCount() > 0) {

            $Row2 = $RS2->FetchRow();
            $response['ack'] = 1;

            $response['VatPosting_gl_account'] = $Row2['VatPosting_gl_account'];

            if($Row2['VatPosting_gl_account']>0)
                $response['VatPosting_gl_account_code'] = $this->get_glaccount_byid($Row2['VatPosting_gl_account']);
            else
                $response['VatPosting_gl_account_code'] = '';
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function getVatPostingAccount_new($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "SELECT  VatPosting_gl_account_sale,VatPosting_gl_account_purchase,VatPosting_gl_account_imp,VatPosting_gl_account_pay	
                FROM financial_settings
                WHERE company_id=" . $this->arrUser['company_id'] . "
                Limit 1";
        //echo $Sql; exit;
        $RS2 = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS2->RecordCount() > 0) {

            $Row2 = $RS2->FetchRow();
            $response['ack'] = 1;

            $response['VatPosting_gl_account_sale'] = $Row2['VatPosting_gl_account_sale'];
            $response['VatPosting_gl_account_purchase'] = $Row2['VatPosting_gl_account_purchase'];
            $response['VatPosting_gl_account_imp'] = $Row2['VatPosting_gl_account_imp'];
            $response['VatPosting_gl_account_pay'] = $Row2['VatPosting_gl_account_pay'];

            $response['vatPostingAccount_code_sale']='';
            $response['vatPostingAccount_code_purchase']='';
            $response['vatPostingAccount_code_imp']='';
            $response['vatPostingAccount_code_pay']='';

            if($Row2['VatPosting_gl_account_sale']>0)
                $response['vatPostingAccount_code_sale'] = $this->get_glaccount_byid($Row2['VatPosting_gl_account_sale']);
            
            if($Row2['VatPosting_gl_account_purchase']>0)
                $response['vatPostingAccount_code_purchase'] = $this->get_glaccount_byid($Row2['VatPosting_gl_account_purchase']);
            
            if($Row2['VatPosting_gl_account_imp']>0)
                $response['vatPostingAccount_code_imp'] = $this->get_glaccount_byid($Row2['VatPosting_gl_account_imp']);
            
            if($Row2['VatPosting_gl_account_pay']>0)
                $response['vatPostingAccount_code_pay'] = $this->get_glaccount_byid($Row2['VatPosting_gl_account_pay']);
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_glaccount_byid($acc_id) {
        $Sql = "SELECT accountCode,displayName
				FROM gl_account
				WHERE id='".$acc_id."'
				LIMIT 1";

        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            return $Row["accountCode"] . " - " . $Row["displayName"];
        }
        return 0;
    }

    function changeGoodsReceivedAccount($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        $goodsReceivedAccount = (isset($arr_attr['goodsReceivedAccount']) && $arr_attr['goodsReceivedAccount']!='')?$arr_attr['goodsReceivedAccount']:'Null';

        // echo "<pre>";
        // print_r($arr_attr); exit;

        $Sql1 = "SELECT id FROM financial_settings where company_id=" . $this->arrUser['company_id'];
        $RS1 = $this->objsetup->CSI($Sql1);

        if ($RS1->RecordCount() > 0) {
            $Sql = "UPDATE financial_settings
                                SET 
                                    goods_received_gl_account=$goodsReceivedAccount
                                    where company_id=" . $this->arrUser['company_id'] . " ";
            //echo $Sql; exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record not updated!';
            }
        }
        else{
            $response['ack'] = 0;
            $response['error'] = 'Company finance settings are missing!';
        }

        return $response;
    }

    function changeVatPostingAccount($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        // echo "<pre>";
        // print_r($arr_attr); exit;

        $vatPostingAccount = (isset($arr_attr['vatPostingAccount']) && $arr_attr['vatPostingAccount']!='')?$arr_attr['vatPostingAccount']:'Null';

        $Sql1 = "SELECT id FROM financial_settings where company_id=" . $this->arrUser['company_id'];
        $RS1 = $this->objsetup->CSI($Sql1);

        if ($RS1->RecordCount() > 0) {

            $Sql = "UPDATE financial_settings
                                SET 
                                    VatPosting_gl_account=".$vatPostingAccount."
                                    where company_id=" . $this->arrUser['company_id'] . " ";
            //echo $Sql; exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record not updated!';
            }
        }
        else{
            $response['ack'] = 0;
            $response['error'] = 'Company finance settings are missing!';
        }

        return $response;
    }

    function changeVatPostingAccount_new($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        // echo "<pre>";
        // print_r($arr_attr); exit;

        $vatPostingAccount_sale = (isset($arr_attr['vatPostingAccount_sale']) && $arr_attr['vatPostingAccount_sale']!='')?$arr_attr['vatPostingAccount_sale']:'Null';
        $vatPostingAccount_purchase = (isset($arr_attr['vatPostingAccount_purchase']) && $arr_attr['vatPostingAccount_purchase']!='')?$arr_attr['vatPostingAccount_purchase']:'Null';
        $vatPostingAccount_imp = (isset($arr_attr['vatPostingAccount_imp']) && $arr_attr['vatPostingAccount_imp']!='')?$arr_attr['vatPostingAccount_imp']:'Null';
        $vatPostingAccount_pay = (isset($arr_attr['vatPostingAccount_pay']) && $arr_attr['vatPostingAccount_pay']!='')?$arr_attr['vatPostingAccount_pay']:'Null';

        $Sql1 = "SELECT id FROM financial_settings where company_id=" . $this->arrUser['company_id'];
        $RS1 = $this->objsetup->CSI($Sql1);

        if ($RS1->RecordCount() > 0) {

            $Sql = "UPDATE financial_settings
                                SET 
                                VatPosting_gl_account_sale=".$vatPostingAccount_sale.",
                                VatPosting_gl_account_purchase=".$vatPostingAccount_purchase.",
                                VatPosting_gl_account_imp=".$vatPostingAccount_imp.",
                                VatPosting_gl_account_pay=".$vatPostingAccount_pay."
                                    where company_id=" . $this->arrUser['company_id'] . " ";
            //echo $Sql; exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record not updated!';
            }
        }
        else{
            $response['ack'] = 0;
            $response['error'] = 'Company finance settings are missing!';
        }

        return $response;
    }

    /*     * *********** Opening-Balnaces-account ************* */

    function getOpeningBalanceSetupAccount($arr_attr) {
        // $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "SELECT  stock_gl_account,opening_balance_gl_account	
                FROM financial_settings
                WHERE company_id=" . $this->arrUser['company_id'] . "
                Limit 1";
        // echo $Sql; exit;
        $RS2 = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS2->RecordCount() > 0) {

            $Row2 = $RS2->FetchRow();
            $response['ack'] = 1;

            $response['stock_gl_account'] = $Row2['stock_gl_account'];

            if($Row2['stock_gl_account']>0)
                $response['stock_gl_account_code'] = $this->get_glaccount_byid($Row2['stock_gl_account']);
            else
                $response['stock_gl_account_code'] = '';

            $response['opening_balance_gl_account'] = $Row2['opening_balance_gl_account'];

            if($Row2['opening_balance_gl_account']>0)
                $response['opening_balance_gl_account_code'] = $this->get_glaccount_byid($Row2['opening_balance_gl_account']);
            else
                $response['opening_balance_gl_account_code'] = '';
        } else {
            $response['response'] = array();
        }
        // print_r($response); exit;

        return $response;
    }

    function changeOpeningBalanceSetupAccount($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        $stock_gl_account = (isset($arr_attr['stock_gl_account']) && $arr_attr['stock_gl_account']!='')?$arr_attr['stock_gl_account']:'Null';
        $opening_balance_gl_account = (isset($arr_attr['opening_balance_gl_account']) && $arr_attr['opening_balance_gl_account']!='')?$arr_attr['opening_balance_gl_account']:'Null';

        $Sql1 = "SELECT id FROM financial_settings where company_id=" . $this->arrUser['company_id'];
        $RS1 = $this->objsetup->CSI($Sql1);

        if ($RS1->RecordCount() > 0) {

            $Sql = "UPDATE financial_settings
                                SET 
                                    stock_gl_account=".$stock_gl_account.",
                                    opening_balance_gl_account=".$opening_balance_gl_account."
                                    where company_id=" . $this->arrUser['company_id'] . " ";
            //echo $Sql; exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 1;
                $response['error'] = 'Record not updated!';
            }
        }
        else{
            $response['ack'] = 0;
            $response['error'] = 'Company finance settings are missing!';
        }

        return $response;
    }

    /*     * *********** Change-VAT-liability-account ************* */

    function changeVATliabilityAccount($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        // echo "<pre>";
        // print_r($arr_attr); exit;
        
        $vat_lieability_receve_gl_account = (isset($arr_attr['vat_lieability_receve_gl_account']) && $arr_attr['vat_lieability_receve_gl_account']!='')?$arr_attr['vat_lieability_receve_gl_account']:'Null';

        $Sql1 = "SELECT id FROM financial_settings where company_id=" . $this->arrUser['company_id'];
        $RS1 = $this->objsetup->CSI($Sql1);

        if ($RS1->RecordCount() > 0) {

            $Sql = "UPDATE financial_settings
                                SET 
                                    vat_lieability_receve_gl_account = ".$vat_lieability_receve_gl_account."
                                    where company_id=" . $this->arrUser['company_id'] . " ";
            //echo $Sql; exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record not updated!';
            }
        }
        else{
            $response['ack'] = 0;
            $response['error'] = 'Company finance settings are missing!';
        }

        return $response;
    }

    /*     * *********** Change-Inventory-Setup-Type ************* */

    function changeInventorySetupType($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        // echo "<pre>";
        // print_r($arr_attr); exit;

        $sql_total = "SELECT  count(id) as total	
                      FROM financial_settings
                      WHERE company_id=" . $this->arrUser['company_id'] . "
                      Limit 1";

        // echo $sql_total;exit;
        $rs_count = $this->objsetup->CSI($sql_total);

        if ($rs_count->fields['total'] > 0) {

            $Sql = "UPDATE financial_settings
                            SET 
                                vat_sales_type='".$arr_attr['cattype']."'
                                where company_id=" . $this->arrUser['company_id'] . " ";
        } else {

            $response['ack'] = 0;
            $response['error'] = 'Add Basics Financial settings in company First!';
            return $response;

            /* $Sql = "INSERT INTO financial_settings
              SET
              company_id = '".$this->arrUser['company_id']."',
              vat_sales_type = '".$arr_attr['cattype']."'"; */
        }

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Updated Successfully';
        }

        return $response;
    }

    /*     * *********** Start: General Ledger Posting Table ************* */

    function add_general_ledger_posting($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "INSERT INTO general_ledger_posting
                                        SET 
                                            account_head='$arr_attr[account_head]',
                                            g_posting_type='$arr_attr[g_posting_type]', 
                                            gen_bus_posting='$arr_attr[gen_bus_posting]', 
                                            vat_bus_posting='$arr_attr[vat_bus_posting]', 
                                            gen_prod_posting='$arr_attr[gen_prod_posting]', 
                                            vat_prod_posting='$arr_attr[vat_prod_posting]'";
        //exit;
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

    function update_general_ledger_posting($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);

        $Sql = "UPDATE general_ledger_posting
                            SET 
                                account_head='$arr_attr[account_head]',
                                g_posting_type='$arr_attr[g_posting_type]', 
                                gen_bus_posting='$arr_attr[gen_bus_posting]', 
                                vat_bus_posting='$arr_attr[vat_bus_posting]', 
                                gen_prod_posting='$arr_attr[gen_prod_posting]', 
                                vat_prod_posting='$arr_attr[vat_prod_posting]'
                            WHERE id = ".$arr_attr['id']." 
                            Limit 1 ";

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

    function get_ledger_posting_heads_by_id($attr) {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT * FROM general_ledger_posting WHERE gl_id='".$attr['id']."'  LIMIT 1";
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

    /*     * *********** End: General Ledger Posting Table ************* */

    function get_enum_values($attr) {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT *
				FROM account_heads
				WHERE $attr[colum_name]='$attr[values]'
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

    /*     * *********** Start: Generating Tree Module ************* */

    function get_total_amount() {

        $Sql = "SELECT SUM(`amount`) as total, account_head
				FROM general_ledger_entry
				GROUP BY account_head";
        //exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->GetArray();

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function acc_head_and_gen_ledg_post($company_id) {
        $this->objGeneral->mysql_clean($company_id);
        $Sql = "SELECT * 
                FROM (`account_heads`)
                LEFT JOIN `general_ledger_posting` ON `account_heads`.`number` = `general_ledger_posting`.`account_head` 
                WHERE account_heads.`company_id` = '" . $company_id . "'  
                ORDER BY `account_heads`.`number` DESC";
        //exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->GetArray();

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    /*     * *********** End: Generating Tree Module ************* */

    /* =========================================== */
    /* 			New GL Module functions Start 	 */
    /* =========================================== */

    function getPredataGlAccount($attr=null) {

        $Sql = "SELECT id,displayName,accountCode,startRangeCode,endRangeCode 
                FROM gl_account
                where accountType=1 AND 
                      company_id=" . $this->arrUser['company_id'] . " and 
                      status=1 
                order by accountCode";

        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "charts_of_accounts", sr_AddEditPermission);


        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                // $result['name'] = $Row['displayName'];
                $result['name'] = $Row['displayName'] . " - " . $Row['accountCode'];
                $result['startRangeCode'] = $Row['startRangeCode'];
                $result['endRangeCode'] = $Row['endRangeCode'];
                $response['categories'][] = $result;
            }

            $Sql2 = "SELECT id,displayName,accountCode,startRangeCode,endRangeCode 
                    FROM gl_account
                    where accountType=2 AND 
                          company_id=" . $this->arrUser['company_id'] . " AND 
                          status=1 
                    order by accountCode";

            $RS2 = $this->objsetup->CSI($Sql2);

            if ($RS2->RecordCount() > 0) {
                while ($Row2 = $RS2->FetchRow()) {
                    $result2 = array();
                    $result2['id'] = $Row2['id'];
                    // $result2['name'] = $Row2['displayName'];
                    $result2['name'] = $Row2['displayName'] . " - " . $Row2['accountCode'];
                    $result2['startRangeCode'] = $Row2['startRangeCode'];
                    $result2['endRangeCode'] = $Row2['endRangeCode'];
                    $response['subCategories'][] = $result2;
                }
            }


            $Sql3 = "SELECT id,displayName,accountCode,startRangeCode,endRangeCode 
                    FROM gl_account
                    where accountType=5 AND 
                          company_id=" . $this->arrUser['company_id'] . " AND 
                          status=1 
                    order by accountCode";

            $RS3 = $this->objsetup->CSI($Sql3);

            if ($RS3->RecordCount() > 0) {
                while ($Row3 = $RS3->FetchRow()) {
                    $result3 = array();
                    $result3['id'] = $Row3['id'];
                    // $result3['name'] = $Row3['displayName'];
                    $result3['name'] = $Row3['displayName'] . " - " . $Row3['accountCode'];
                    $result3['startRangeCode'] = $Row3['startRangeCode'];
                    $result3['endRangeCode'] = $Row3['endRangeCode'];
                    $response['Headings'][] = $result3;
                }
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function getSubCategoriesByParentID($attr) {
        $this->objGeneral->mysql_clean($attr);

        /*$Sql = "SELECT  gl.id as glid,
                        gl.displayName as gldisplayName
                FROM gl_account_link as refLink
                left join gl_account as gl on gl.id =refLink.child_gl_account_id 
                where refLink.parent_gl_account_id=" . $attr["id"] . " and  
                      refLink.company_id=" . $this->arrUser['company_id'] . "  and 
                      gl.accountType=2  and 
                      gl.status=1 
                ORDER BY gl.accountCode ASC";*/
        
        $Sql = "SELECT id, name,accountCode,startRangeCode,endRangeCode
                      FROM gl_account
		              WHERE  status=1 AND 
                             categoryID = '".$attr['id']."' AND 
                             company_id=" . $this->arrUser['company_id'] . "  AND
                             accountType =2";

        // echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                // $result['id'] = $Row['glid'];
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'] . " - " . $Row['accountCode'];
                // $result['name'] = $Row['gldisplayName'];
                $result['startRangeCode'] = $Row['startRangeCode'];
                $result['endRangeCode'] = $Row['endRangeCode'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function add_new_account($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);
        // echo "<pre>";
        //  print_r($arr_attr);exit; 

        $catgeory = (isset($arr_attr['catgeorys']) && $arr_attr['catgeorys'] != '') ? $arr_attr['catgeorys'] : 0;
        $subCatgegory = (isset($arr_attr['subCatgegorys']) && $arr_attr['subCatgegorys'] != '') ? $arr_attr['subCatgegorys'] : 0;
        $heading = (isset($arr_attr['headings']) && $arr_attr['headings'] != '') ? $arr_attr['headings'] : 0;
        $allow_posting = (isset($arr_attr['allow_postings']) && $arr_attr['allow_postings'] != '') ? $arr_attr['allow_postings'] : 0;
        $account_type = (isset($arr_attr['account_types']) && $arr_attr['account_types'] != '') ? $arr_attr['account_types'] : 0;
        $transcation_types = (isset($arr_attr['transcation_type']) && $arr_attr['transcation_type'] != '') ? $arr_attr['transcation_type'] : 0;
        $statusid = (isset($arr_attr['status']) && $arr_attr['status'] != '') ? $arr_attr['status'] : 0;
        $vat_list_ids = (isset($arr_attr['vat_list_id']) && $arr_attr['vat_list_id'] != '') ? $arr_attr['vat_list_id'] : 0;
        $vataccount = (isset($arr_attr['vataccounts']) && $arr_attr['vataccounts'] != '') ? $arr_attr['vataccounts'] : 0;

        $startRangeCode = (isset($arr_attr['startRangeCode']) && $arr_attr['startRangeCode'] != '') ? $arr_attr['startRangeCode'] : 0;
        $endRangeCode = (isset($arr_attr['endRangeCode']) && $arr_attr['endRangeCode'] != '') ? $arr_attr['endRangeCode'] : 0;

        //Update ID
        $updateID = (isset($arr_attr['id']) && $arr_attr['id'] != '') ? $arr_attr['id'] : 0;

        if($statusid == 0 || $statusid == 3){

            if ($account_type == '4') {

                if ($startRangeCode == 0 || $endRangeCode == 0) {
                    $response['error'] = NULL;
                    $response['ack'] = 0;
                    $response['error'] = 'Range Not Defined!';
                    return $response;
                } else
                    $where .= " AND gat.gl_account_code BETWEEN  ".$startRangeCode." AND ".$endRangeCode." ";

            } else
                $where .= " AND gat.gl_account_id = ".$updateID." ";


            $sql1 = "SELECT  count(id) as total
                     FROM gl_account_txn AS gat
                     WHERE gat.company_id = " . $this->arrUser['company_id']." ".$where." ";
            // echo $sql1; exit;

            $rs1 = $this->objsetup->CSI($sql1);
            $total1 = $rs1->fields['total'];

            if ($total1 > 0) {
                $response['error'] = NULL;
                $response['ack'] = 0;
                $response['error'] = 'There Are Transaction Exists Against This G/L Account!';
                return $response;
            }
        }

        if ($heading > 0)
            $parent_gl_account_id = $heading;
        elseif ($subCatgegory > 0)
            $parent_gl_account_id = $subCatgegory;
        elseif ($catgeory > 0)
            $parent_gl_account_id = $catgeory;

        $sql_total = "SELECT  count(id) as total
                        FROM gl_account
                        where id='" . $parent_gl_account_id . "' and  
                              company_id=" . $this->arrUser['company_id'] . "  and 
                              status=1 and  
                              '" .$arr_attr['number']. "' BETWEEN startRangeCode AND endRangeCode";
        // echo $sql_total;
        // exit;

        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];

        if ($total == 0) {
            $response['error'] = NULL;
            $response['ack'] = 0;
            $response['error'] = 'G/L Number does not lies in expected range!';
            return $response;
        }

        if ($updateID > 0)
            $update_check = "  AND tst.id <> " . $updateID . " ";

        $data_pass = " tst.accountCode='" . $arr_attr['number'] . "' 
                       $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('gl_account', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Account No. already exist!';
            return $response;
        }

        if ($updateID > 0) {
            $Sql = "UPDATE gl_account 
                                    SET
                                        name='" . $arr_attr['name'] . "',
                                        displayName='" . $arr_attr['name'] . "',
                                        accountCode='" . $arr_attr['number'] . "',
                                        vatRateID='" . $vat_list_ids . "',
                                        transcation='" . $transcation_types . "',
                                        allowPosting='" . $allow_posting . "',
                                        startRangeCode='" . $startRangeCode . "',
                                        endRangeCode='" . $endRangeCode . "',
                                        accountType='" . $account_type . "',
                                        vatBankType='" . $vataccount . "',
                                        status='" . $statusid . "',
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())
                                    where id='" . $updateID . "'  
                                    LIMIT 1";

            // echo $Sql; exit;
            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql, "charts_of_accounts", sr_EditPermission);

            $sql_total2 = "SELECT  count(parent_gl_account_id) as total
                            FROM gl_account_link
                            where child_gl_account_id='" . $updateID . "' and  
                                  company_id=" . $this->arrUser['company_id'] . "";

            // echo $sql_total2;exit;
            $rs_count2 = $this->objsetup->CSI($sql_total2);
            $recExist = $rs_count2->fields['total'];

            if ($recExist >0) {

                $Sql2 = "UPDATE gl_account_link
                                SET
                                    parent_gl_account_id='" . $parent_gl_account_id . "',
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())
                                WHERE child_gl_account_id = '" . $updateID . "' AND 
                                        company_id = '" . $this->arrUser['company_id'] . "'
                                LIMIT 1";
                
                // echo $Sql2;exit;
                $RS2 = $this->objsetup->CSI($Sql2);
            }
            else{
                $Sql2 = "INSERT INTO gl_account_link
                                SET
                                    parent_gl_account_id='" . $parent_gl_account_id . "',
                                    child_gl_account_id='" . $updateID . "',
                                    company_id= '" . $this->arrUser['company_id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())";

                $RS2 = $this->objsetup->CSI($Sql2);

            }         

            $addCatSubCatSql = "UPDATE gl_account AS gl
                                    SET
                                        category = SUBSTRING_INDEX(SR_GetGL_Category(gl.id,gl.company_id), '[]', 1),
                                        categoryID = SUBSTRING_INDEX(SR_GetGL_Category(gl.id,gl.company_id), '[]', -1),
                                        subCategory = SUBSTRING_INDEX(SR_GetGL_SubCategory(gl.id,gl.company_id), '[]', 1),
                                        subCategoryID = SUBSTRING_INDEX(SR_GetGL_SubCategory(gl.id,gl.company_id), '[]', -1)
                                WHERE gl.id='" . $updateID . "' AND
                                      gl.company_id ='" . $this->arrUser['company_id'] . "'";

            $addCatSubCatRS = $this->Conn->execute($addCatSubCatSql);          

            $DelCacheSql = "DELETE FROM gl_accountcache WHERE id='" . $updateID . "' AND company_id ='" . $this->arrUser['company_id'] . "'";
            $DelCacheRS = $this->objsetup->CSI($DelCacheSql);

            $BuildCacheSql = "INSERT INTO gl_accountcache 
                              SELECT *,'" . date("Y-m-d H:i:s") . "'
                              FROM sr_gl_account_sel 
                              WHERE glid='" . $updateID . "' AND company_id ='" . $this->arrUser['company_id'] . "'";

            $BuildCacheRS = $this->objsetup->CSI($BuildCacheSql);

        } else {

            $Sql = "INSERT INTO gl_account
                                SET
                                    name='" . $arr_attr['name'] . "',
                                    displayName='" . $arr_attr['name'] . "',
                                    accountCode='" . $arr_attr['number'] . "',
                                    vatRateID='" . $vat_list_ids . "',
                                    transcation='" . $transcation_types . "',
                                    allowPosting='" . $allow_posting . "',
                                    startRangeCode='" . $startRangeCode . "',
                                    endRangeCode='" . $endRangeCode . "',
                                    accountType='" . $account_type . "',
                                    vatBankType='" . $vataccount . "',
                                    status='" . $statusid . "',
                                    company_id= '" . $this->arrUser['company_id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())";

            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql, "charts_of_accounts", sr_AddPermission);

            $id = $this->Conn->Insert_ID();

            if ($id > 0) {
                $Sql2 = "INSERT INTO gl_account_link
                                SET
                                    parent_gl_account_id='" . $parent_gl_account_id . "',
                                    child_gl_account_id='" . $id . "',
                                    company_id= '" . $this->arrUser['company_id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())";

                $RS2 = $this->objsetup->CSI($Sql2);

                $addCatSubCatSql = "UPDATE gl_account AS gl
                                        SET
                                            category = SUBSTRING_INDEX(SR_GetGL_Category(gl.id,gl.company_id), '[]', 1),
                                            categoryID = SUBSTRING_INDEX(SR_GetGL_Category(gl.id,gl.company_id), '[]', -1),
                                            subCategory = SUBSTRING_INDEX(SR_GetGL_SubCategory(gl.id,gl.company_id), '[]', 1),
                                            subCategoryID = SUBSTRING_INDEX(SR_GetGL_SubCategory(gl.id,gl.company_id), '[]', -1)
                                    WHERE gl.id='" . $id . "' AND
                                          gl.company_id ='" . $this->arrUser['company_id'] . "'";

                $addCatSubCatRS = $this->Conn->execute($addCatSubCatSql);          

                $DelCacheSql = "DELETE FROM gl_accountcache WHERE id='" . $id . "' AND company_id ='" . $this->arrUser['company_id'] . "'";
                $DelCacheRS = $this->objsetup->CSI($DelCacheSql);

                $BuildCacheSql = "INSERT INTO gl_accountcache 
                                  SELECT *,'" . date("Y-m-d H:i:s") . "'
                                  FROM sr_gl_account_sel 
                                  WHERE glid='" . $id . "' AND company_id ='" . $this->arrUser['company_id'] . "'";

                $BuildCacheRS = $this->objsetup->CSI($BuildCacheSql);
            }
        }
        // echo $Sql; exit;

        if ($this->Conn->Affected_Rows() > 0) {

            /* if ($updateID > 0) {
                $Sql3 = "CALL sr_Checksum_gl_account_update_Trigger_SP('" . $this->arrUser['company_id'] . "','" . $updateID . "','0')";
                $RS3 = $this->objsetup->CSI($Sql3);
            } else {
                $Sql3 = "CALL sr_gl_account_link_insert_Trigger_SP('" . $this->arrUser['company_id'] . "','" . $id . "','0')";
                $RS3 = $this->objsetup->CSI($Sql3);
            } */

            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;

            if ($arr_attr['id'] > 0) {
                $response['ack'] = 2;
                $response['error'] = 'Record Updated Successfully';
            } else
                $response['error'] = 'Record Not Inserted!';
        }

        $data_pass = " tst.accountCode='" . $arr_attr['number'] . "' ";
        $total = $this->objGeneral->count_duplicate_in_sql('gl_account_number_display', $data_pass, $this->arrUser['company_id']);

        if ($total >0) {

            if($arr_attr['glNumberDisplayAs'] !=''){
               $Sql2 = "UPDATE gl_account_number_display 
                                    SET
                                        accountCodeDisplay='" . $arr_attr['glNumberDisplayAs'] . "',
                                        ChangedBy='" . $this->arrUser['id'] . "',
                                        ChangedOn=UNIX_TIMESTAMP (NOW())
                                    where id='" . $updateID . "'  
                                    LIMIT 1";

                // echo $Sql2; exit;
                $RS2 = $this->objsetup->CSI($Sql2, "charts_of_accounts", sr_EditPermission);
            }
            else{
                $DelSql = " DELETE FROM gl_account_number_display 
                            WHERE accountCode='".$arr_attr['number']."' AND 
                                  company_id ='".$this->arrUser['company_id']."'";

                $DelRS = $this->objsetup->CSI($DelSql);
            }
        }
        elseif($arr_attr['glNumberDisplayAs'] !=''){
            $Sql2 = "INSERT INTO gl_account_number_display
                                SET
                                    
                                    accountCode='" . $arr_attr['number'] . "',
                                    accountCodeDisplay='" . $arr_attr['glNumberDisplayAs'] . "',
                                    status='1',
                                    company_id= '" . $this->arrUser['company_id'] . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    AddedOn=UNIX_TIMESTAMP (NOW()),
                                    ChangedBy='" . $this->arrUser['id'] . "',
                                    ChangedOn=UNIX_TIMESTAMP (NOW())";

            $RS2 = $this->objsetup->CSI($Sql2, "charts_of_accounts", sr_AddPermission);
        }

        return $response;
    }

    function getGlHeading($attr){
        $this->objGeneral->mysql_clean($attr);        

        $sql = "SELECT id, name,accountCode,startRangeCode,endRangeCode
                      FROM gl_account
		              WHERE  status=1 AND 
                             categoryID = '".$attr['pid']."' AND 
                             subCategoryID = '".$attr['id']."' AND 
                             company_id=" . $this->arrUser['company_id'] . "  AND
                             accountType =5";

        // echo $sql;exit; 

        $RS = $this->objsetup->CSI($sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'] . " - " . $Row['accountCode'];
                $result['startRangeCode'] = $Row['startRangeCode'];
                $result['endRangeCode'] = $Row['endRangeCode'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_level_list($attr) {
        $this->objGeneral->mysql_clean($attr);

        $where_clause = "";

        if (!empty($attr['pid'])) {
            $where_clause .= " AND gla.parent_cat_id = '".$attr['pid']."' ";
        }
        if (!empty($attr['id'])) {
            $where_clause .= " AND gla.subcat_id = '".$attr['id']."' ";
        }

        $sql_total = "SELECT gla.id, gla.name,gla.account_code,gla.parent_cat_id
                      FROM company_gl_accounts as gla
                      left  JOIN company on company.id=gla.company_id
		              where  gla.status=1 and 
                             gla.company_id=" . $this->arrUser['company_id'] . " 	
                             ".$where_clause." ";
        /* echo $sql_total;
          exit; */
        //or  company.parent_id=" . $this->arrUser['company_id'] . ")
        $RS = $this->objsetup->CSI($sql_total);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'] . " - " . $Row['account_code'];
                $result['parent_id'] = $Row['parent_cat_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_gl_account_by_id($attr) {
        $this->objGeneral->mysql_clean($attr);

        $sql_ = "SELECT * FROM company_gl_accounts where id=" . $attr["gl_id"];
        $RS_account = $this->objsetup->CSI($sql_);
        // echo $sql_;exit;

        if ($RS_account->RecordCount() > 0) {

            while ($Row = $RS_account->FetchRow()) {
                $response['response_account'] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not Added!';
        }
        return $response;
    }

    function edit_gl_account($arr_attr) {
        $this->objGeneral->mysql_clean($arr_attr);
        /* echo "<pre>";
          print_r($arr_attr["gl_id"]);exit; */

        $gl_rec = $arr_attr["gl_id"];

        $parent_catid = 0;
        $sub_catid = 0;
        $level = 0;
        $code_num = 0;

        if (!empty($arr_attr['gl_category_id']))
            $parent_catid = $arr_attr['gl_category_id'];

        if (!empty($arr_attr['category_id']))
            $sub_catid = $arr_attr['category_id'];
        else
            $sub_catid = $arr_attr['gl_category_id'];

        if (!empty($arr_attr['number']))
            $code_num = $arr_attr['number'];

        if (!empty($arr_attr['level_one']))
            $level_one = $arr_attr['level_one'];

        $sql_total = "SELECT  count(gl.id) as total
                      FROM company_gl as gl
                      left  JOIN company on company.id=gl.company_id
                      where gl.ref_gl_id='" . $sub_catid . "' and  
                            gl.company_id=" . $this->arrUser['company_id'] . "  and 
                            gl.status=1 and  $arr_attr[number] BETWEEN gl.code_range_from AND gl.code_range_to  ";
        //echo $sql_total;exit;
        //(or  company.parent_id=" . $this->arrUser['company_id'] . ")
        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];

        if ($total == 0) {
            $response['error'] = NULL;
            $response['ack'] = 0;
            $response['error'] = 'Code Number Not Exists in GL Category!';
            return $response;
        }

        $sql_total = "SELECT  gla.id,count(gla.id) as total
                      FROM company_gl_accounts as gla
                      left  JOIN company on company.id=gla.company_id
		              where  gla.status=1 and 
                             gla.account_code=" . $code_num . " and 
                             gla.company_id=" . $this->arrUser['company_id'] . "  
                      LIMIT 1 ";
        /* echo $sql_total;
          exit; */
        //or  company.parent_id=" . $this->arrUser['company_id'] . ")
        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];
        $id_gl = $rs_count->fields['id'];

        if ($total > 0 && $gl_rec != $id_gl) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        } else {
            $Sql = "UPDATE company_gl_accounts 
                                    SET
                                        parent_cat_id='" . $parent_catid . "',
                                        subcat_id='" . $sub_catid . "',
                                        name='" . $arr_attr['name'] . "',
                                        account_code='" . $code_num . "',
                                        vat_rate_id='" . $arr_attr['vat_list_id'] . "',
                                        transcation='" . $arr_attr['transcation_type'] . "',
                                        parent_id='" . $arr_attr['level_one'] . "',
                                        allow_posting='" . $arr_attr['allow_posting'] . "',
                                        total_start_range_code='" . $arr_attr['total_start_range_code'] . "',
                                        total_end_range_code='" . $arr_attr['total_end_range_code'] . "',
                                        account_type='" . $arr_attr['account_types'] . "',
                                        cash_bank_type='" . $arr_attr['company_account'] . "',
                                        oppening_balance='" . $arr_attr['opening_balnc'] . "',
                                        status='" . $arr_attr['status'] . "'
                                    where id='" . $gl_rec . "'  
                                    LIMIT 1";
        }

        $RS = $this->objsetup->CSI($Sql);
        //echo $Sql;exit;
        //$message = "Record  $new_msg .";
        if ($this->Conn->Affected_Rows() > 0) {
            //$response['gl_id'] = $gl_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not Updated!';
        }
        return $response;
    }

    function add_gl_accounts_by_new_company($attr) {
        $this->objGeneral->mysql_clean($attr);

        $new_company_id = $attr["id"];

        $company_gl_error_counter = 0;
        $company_gl_accounts_error_counter = 0;

        $response['response'][] = array();


        $Sql_ref_gl = "SELECT  * FROM ref_gl";
        //echo $Sql_ref_gl; exit;

        $RS_ref_g = $this->objsetup->CSI($Sql_ref_gl);

        if ($RS_ref_g->RecordCount() > 0) {

            while ($Row_ref_g = $RS_ref_g->FetchRow()) {

                $category_name = $Row_ref_g['category_name'];
                $parent_id = $Row_ref_g['parent_id'];
                $code = $Row_ref_g['code'];
                $code_range_from = $Row_ref_g['code_range_from'];
                $code_range_to = $Row_ref_g['code_range_to'];
                $optional = $Row_ref_g['optional'];
                $status = $Row_ref_g['status'];
                $old_ref_gl_id = $Row_ref_g['id'];


                $Sql_company_gl = "SELECT  count(id) as total 
                                   FROM company_gl  
                                   where category_name='" . $category_name . "' and 
                                         code='" . $code . "' and 
                                         company_id='" . $new_company_id . "'";

                $RS_company_gl = $this->objsetup->CSI($Sql_company_gl);
                $total_company_gl = $RS_company_gl->fields['total'];

                if ($total_company_gl > 0) {
                    //$company_gl_error_counter++;
                    $response['ack'] = 1;
                    $response['error'] = NULL;
                    $response['company_gl_error'] = "Duplicate Code '" . $code . "' with Category Name '" . $category_name . "'";
                    return $response;
                } else {
                    $Sql_add_company_gl = "INSERT INTO company_gl
                                                        SET
                                                            ref_gl_id='" . $old_ref_gl_id . "',
                                                            category_name='" . $category_name . "',
                                                            parent_id='" . $parent_id . "',
                                                            code='" . $code . "',
                                                            code_range_from='" . $code_range_from . "',
                                                            code_range_to='" . $code_range_to . "',
                                                            optional='" . $optional . "',
                                                            company_id='" . $new_company_id . "',
                                                            status='" . $status . "'";

                    $RS_add_company_gl = $this->objsetup->CSI($Sql_add_company_gl);
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['company_gl_error_counter'] = $company_gl_error_counter;
        } else
            $response['response'][] = array();

        //   ======================

        $Sql_gl_accounts = "SELECT  * FROM gl_accounts";
        //echo $Sql_gl_accounts; exit;

        $RS_gl_accounts = $this->objsetup->CSI($Sql_gl_accounts);

        if ($RS_gl_accounts->RecordCount() > 0) {

            while ($Row_gl_accounts = $RS_gl_accounts->FetchRow()) {

                $parent_cat_id = $Row_gl_accounts['parent_cat_id'];
                $sub_catid = $Row_gl_accounts['subcat_id'];
                $name = $Row_gl_accounts['name'];
                $account_code = $Row_gl_accounts['account_code'];
                $vat_rate_id = $Row_gl_accounts['vat_rate_id'];
                $transcation = $Row_gl_accounts['transcation'];
                $parent_id = $Row_gl_accounts['parent_id'];
                $allow_posting = $Row_gl_accounts['allow_posting'];
                $account_type = $Row_gl_accounts['account_type'];
                $cash_bank_type = $Row_gl_accounts['cash_bank_type'];
                $oppening_balance = $Row_gl_accounts['oppening_balance'];
                $status = $Row_gl_accounts['status'];
                $old_ref_gl_account_id = $Row_gl_accounts['id'];

                $Sql_company_gl_accounts = "SELECT  count(id) as total 
                                            FROM company_gl_accounts  
                                            where name='" . $name . "' and 
                                                  account_code='" . $account_code . "' and 
                                                  company_id='" . $new_company_id . "'";

                $RS_company_gl_accounts = $this->objsetup->CSI($Sql_company_gl_accounts);

                $total_company_gl_accounts = $RS_company_gl_accounts->fields['total'];

                if ($total_company_gl_accounts > 0) {

                    // $company_gl_accounts_error_counter++;

                    $response['ack'] = 1;
                    $response['error'] = NULL;
                    $response['company_gl_accounts_error'] = "Duplicate Account Code '" . $account_code . "' with Description Name '" . $name . "'";
                    return $response;
                } else {

                    $Sql_add_company_gl_accounts = "INSERT INTO company_gl_accounts
                                                                    SET
                                                                        ref_gl_account_id='" . $old_ref_gl_account_id . "',
                                                                        parent_cat_id='" . $parent_cat_id . "',
                                                                        subcat_id='" . $sub_catid . "',
                                                                        name='" . $name . "',
                                                                        account_code='" . $account_code . "',
                                                                        vat_rate_id='" . $vat_rate_id . "',
                                                                        transcation='" . $transcation . "',
                                                                        parent_id='" . $parent_id . "',
                                                                        allow_posting=1,
                                                                        account_type='" . $account_type . "',
                                                                        cash_bank_type='" . $cash_bank_type . "',
                                                                        oppening_balance='" . $oppening_balance . "',
                                                                        status='" . $status . "',
                                                                        user_id= '" . $this->arrUser['id'] . "',
                                                                        company_id= '" . $new_company_id . "',
                                                                        date_added='" . current_date . "',
                                                                        AddedBy='" . $this->arrUser['id'] . "',
                                                                        AddedOn='" . current_date . "'";
                    $RS_add_company_gl_accounts = $this->objsetup->CSI($Sql_add_company_gl_accounts);
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['company_gl_accounts_error_counter'] = $company_gl_accounts_error_counter;
        } else
            $response['response'][] = array();
        return $response;
    }

    /* =========================================== */
    /* 			New GL Module functions End 	 */
    /* =========================================== */

    /* ========================================================== */
    /* 			GL Module functions from setup for codes Start 	 */
    /* ========================================================== */

    function get_all_ref_cat_list($attr) {
        $this->objGeneral->mysql_clean($attr);

        $Sql_company_gl = "SELECT  count(id) as total 
                           FROM gl_account  
                           where company_id='" . $this->arrUser['company_id'] . "'";

        $RS_company_gl = $this->objsetup->CSI($Sql_company_gl);
        $total_company_gl = $RS_company_gl->fields['total'];

        if ($total_company_gl > 0) {

            //for rec sql
            $Sql = "SELECT  gl.id as glid,
                            gl.name as sub_category_name,
                            gl.gl_account_ref_id as company_ref_gl_id,                            
                            gl.accountType as glaccountType,
                            gl.displayName as categoryDisplayName,
                            gl.startRangeCode as gl_code_range_from,
                            gl.endRangeCode as gl_code_range_to,
                            parentCAT.name as parentCATname,                            
                            refLink.parent_gl_account_id as parentID,
                            refLink.child_gl_account_id as childID
                    FROM gl_account as gl
                    left join gl_account_link as refLink on gl.id =refLink.child_gl_account_id
                    left join gl_account as parentCAT on refLink.parent_gl_account_id =parentCAT.id
                    WHERE gl.accountType IN(1,2) AND
                          gl.status=1 and 
                          gl.company_id='" . $this->arrUser['company_id'] . "' 
                    GROUP BY gl.id
                    ORDER BY gl.accountCode ASC";
        } else {

            $Sql = "SELECT  gl.id as glid,
                            gl.name as sub_category_name,
                            '' as company_ref_gl_id,
                            gl.accountType as glaccountType,
                            gl.startRangeCode as gl_code_range_from,
                            gl.endRangeCode as gl_code_range_to,
                            parentCAT.name as parentCATname,                            
                            refLink.parent_gl_account_id as parentID,
                            refLink.child_gl_account_id as childID
                    FROM gl_account_ref as gl
                    left join gl_account_link_ref as refLink on gl.id =refLink.child_gl_account_id
                    left join gl_account_ref as parentCAT on refLink.parent_gl_account_id =parentCAT.id
                    WHERE gl.accountType IN(1,2) ORDER BY glid ASC";
        }
        // echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['glid'];
                $result['name'] = $Row['sub_category_name'];
                $result['company_ref_gl_id'] = $Row['company_ref_gl_id'];

                if ($Row['categoryDisplayName'] != "")
                    $result['categoryDisplayName'] = $Row['categoryDisplayName'];
                else
                    $result['categoryDisplayName'] = $Row['sub_category_name'];

                $result['gl_parent'] = $Row['glaccountType'];
                $result['parentID'] = $Row['parentID'];
                $result['childID'] = $Row['childID'];
                $result['code_range_from'] = $Row['gl_code_range_from'];
                $result['code_range_to'] = $Row['gl_code_range_to'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total_company_gl_accounts'] = 1;
        } else
            $response['response'][] = array();
        return $response;
    }

    function add_new_cat_list($attr) {
        
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
        
        $catRecords = $attr["newcategories_list"];
        // echo "<pre>";   print_r($catRecords);exit;        
        //$company_id = 53;
        $company_id = $this->arrUser['company_id'];
        $response['response'] = array();

        $id = '';
        $newParentID = '';

        foreach ($catRecords as $catRecord) {

            $category_name = $catRecord->name;
            $categoryDisplayName = $catRecord->categoryDisplayName;
            $parent_id = $catRecord->gl_parent;
            $code_range_from = $catRecord->code_range_from;
            $code_range_to = $catRecord->code_range_to;
            $status = $catRecord->status;
            $old_ref_gl_id = $catRecord->id;
            $company_ref_gl_id = $catRecord->company_ref_gl_id;

            $where_cond1 = "";

            if ($company_ref_gl_id > 0)
                $where_cond1 = " gl.gl_account_ref_id <> '" . $company_ref_gl_id . "'";
            else
                $where_cond1 = " gl.gl_account_ref_id <> '" . $old_ref_gl_id . "'";

            if ($parent_id > 1) {
                $duplicationChkSql = " SELECT  count(id) as total
                                        FROM gl_account as gl
                                        left join gl_account_link as Link on gl.id =Link.child_gl_account_id    
                                        where gl.company_id='" . $company_id . "' AND  
                                              gl.accountType='" . $parent_id . "' AND 
                                              " . $where_cond1 . " AND 
                                              Link.parent_gl_account_id='" . $newParentID . "' AND
                                              ((".$code_range_from." BETWEEN gl.startRangeCode AND gl.endRangeCode) OR 
                                               (".$code_range_to." BETWEEN gl.startRangeCode AND gl.endRangeCode))";

                // echo $duplicationChkSql;exit; 
                $duplicationchkSqlcount = $this->objsetup->CSI($duplicationChkSql);
                $duplicationchkTotal = $duplicationchkSqlcount->fields['total'];

                if ($duplicationchkTotal > 0) {
                    $response['ack'] = 0;
                    $response['error'] = 'No. Range From "' . $code_range_from . '" or No. Range To"' . $code_range_to . '" for Category "' . $category_name . '" overlaps the previously defined G/L Category range. Update only one range at a time.';
                    return $response;
                    // break;
                }

                $parent_cat_chk_sql = " SELECT  count(id) as total
                                        FROM gl_account as gl   
                                        where gl.id='" . $newParentID . "' AND
                                              ((".$code_range_from." BETWEEN gl.startRangeCode AND gl.endRangeCode) AND 
                                               (".$code_range_to." BETWEEN gl.startRangeCode AND gl.endRangeCode))";

                // echo $parent_cat_chk_sql;//exit; 
                $parent_cat_chk_sql_count = $this->objsetup->CSI($parent_cat_chk_sql);
                $parent_cat_chk_total = $parent_cat_chk_sql_count->fields['total'];

                if ($parent_cat_chk_total == 0) {
                    $response['ack'] = 0;
                    $response['error'] = 'No. Range from "' . $code_range_from . '" or No. Range To  "' . $code_range_to . '" for Category "' . $category_name . '" does not lies in its parent G/L Category range.';
                    return $response;
                    // break;
                }
            } else {
                $child_cat_chk_sql = "  SELECT  count(gl.id) as total
                                        FROM gl_account as gl
                                        where gl.company_id='" . $company_id . "' AND  
                                              gl.accountType=1 AND
                                              " . $where_cond1 . " AND  
                                              ((".$code_range_from." BETWEEN gl.startRangeCode AND gl.endRangeCode) or 
                                               (".$code_range_to." BETWEEN gl.startRangeCode AND gl.endRangeCode))";

                // echo $child_cat_chk_sql;exit;
                $child_cat_chk_sql_count = $this->objsetup->CSI($child_cat_chk_sql);
                $child_cat_chk_total = $child_cat_chk_sql_count->fields['total'];


                if ($child_cat_chk_total > 0) {
                    $response['ack'] = 0;
                    $response['error'] = 'No. Range From "' . $code_range_from . '" or No. Range To  "' . $code_range_to . '" for Category "' . $category_name . '" overlaps the previously defined G/L parent Category Range.';
                    return $response;
                    // break;
                }
            }

            if ($company_ref_gl_id > 0) {

                $Sql_update_company_gl = "UPDATE gl_account
                                                        SET
                                                            gl_account_ref_id='" . $company_ref_gl_id . "',
                                                            name='" . $category_name . "',
                                                            displayName='" . $categoryDisplayName . "',
                                                            accountCode='" . $code_range_from . "',
                                                            accountType='" . $parent_id . "',
                                                            startRangeCode='" . $code_range_from . "',
                                                            endRangeCode='" . $code_range_to . "',
                                                            ChangedBy='" . $this->arrUser['id'] . "',
                                                            ChangedOn=UNIX_TIMESTAMP (NOW())
                                                        where id='" . $old_ref_gl_id . "'";

                //  echo $Sql_update_company_gl;//exit;
                $RS_update_company_gl = $this->objsetup->CSI($Sql_update_company_gl);

                if (!($parent_id > 1))
                    $newParentID = $old_ref_gl_id;

                //if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['msg'] = "Records Updated Successfully";
                //}                
            }
            else {
                $Sql_add_company_gl = "INSERT INTO gl_account 
                                                        SET
                                                            gl_account_ref_id='" . $old_ref_gl_id . "',
                                                            name='" . $category_name . "',
                                                            displayName='" . $categoryDisplayName . "',
                                                            accountCode='" . $code_range_from . "',
                                                            accountType='" . $parent_id . "',
                                                            startRangeCode='" . $code_range_from . "',
                                                            endRangeCode='" . $code_range_to . "',
                                                            company_id='" . $company_id . "',
                                                            status=1,
                                                            AddedBy='" . $this->arrUser['id'] . "',
                                                            AddedOn=UNIX_TIMESTAMP (NOW()),
                                                            ChangedBy='" . $this->arrUser['id'] . "',
                                                            ChangedOn=UNIX_TIMESTAMP (NOW())";
                //  echo $Sql_add_company_gl;exit;
                $RS_add_company_gl = $this->objsetup->CSI($Sql_add_company_gl);
                $id = $this->Conn->Insert_ID();

                if ($parent_id > 1) {

                    $SqlAddCompanyglLink = "INSERT INTO gl_account_link
                                                            SET
                                                                parent_gl_account_id='" . $newParentID . "',
                                                                child_gl_account_id='" . $id . "',
                                                                company_id='" . $company_id . "',
                                                                AddedBy='" . $this->arrUser['id'] . "',
                                                                AddedOn=UNIX_TIMESTAMP (NOW()),
                                                                ChangedBy='" . $this->arrUser['id'] . "',
                                                                ChangedOn=UNIX_TIMESTAMP (NOW())";
                    //  echo $SqlAddCompanyglLink;exit;
                    $RsAddCompanyglLink = $this->objsetup->CSI($SqlAddCompanyglLink);
                } else
                    $newParentID = $id;

                $response['ack'] = 1;
                $response['msg'] = "Records Added Successfully";
            }
        }
        // exit;

        if ($response['ack'] == 1) {
            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = '$id:'.$id;
            $srLogTrace['ErrorMessage'] = '';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            
            //for fresh gl categories rec sql
            $Sql = "SELECT  gl.id as glid,
                            gl.name as sub_category_name,
                            gl.gl_account_ref_id as company_ref_gl_id,                            
                            gl.accountType as glaccountType,
                            gl.displayName as categoryDisplayName,
                            gl.startRangeCode as gl_code_range_from,
                            gl.endRangeCode as gl_code_range_to,
                            parentCAT.name as parentCATname,                            
                            refLink.parent_gl_account_id as parentID,
                            refLink.child_gl_account_id as childID
                    FROM gl_account as gl
                    left join gl_account_link as refLink on gl.id =refLink.child_gl_account_id
                    left join gl_account as parentCAT on refLink.parent_gl_account_id =parentCAT.id
                    WHERE gl.accountType IN(1,2) AND
                        gl.status=1 and 
                        gl.company_id='" . $this->arrUser['company_id'] . "' 
                    GROUP BY gl.id";

            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['glid'];
                    $result['name'] = $Row['sub_category_name'];
                    $result['company_ref_gl_id'] = $Row['company_ref_gl_id'];

                    if ($Row['categoryDisplayName'] != "")
                        $result['categoryDisplayName'] = $Row['categoryDisplayName'];
                    else
                        $result['categoryDisplayName'] = $Row['sub_category_name'];

                    $result['gl_parent'] = $Row['glaccountType'];
                    $result['parentID'] = $Row['parentID'];
                    $result['childID'] = $Row['childID'];
                    $result['code_range_from'] = $Row['gl_code_range_from'];
                    $result['code_range_to'] = $Row['gl_code_range_to'];
                    $response['response'][] = $result;
                }

                $response['total_company_gl_accounts'] = 1;
            }
        }

        return $response;
    }

    function add_gl_cat_by_new_company($attr) {
        return false;
        $this->objGeneral->mysql_clean($attr);
        $new_company_id = $this->arrUser['company_id'];

        $company_gl_error_counter = 0;
        $company_gl_accounts_error_counter = 0;
        $response['response'][] = array();

        $Sql_ref_gl = "SELECT  * FROM ref_gl";
        //echo $Sql_ref_gl; exit;

        $RS_ref_g = $this->objsetup->CSI($Sql_ref_gl);

        if ($RS_ref_g->RecordCount() > 0) {

            while ($Row_ref_g = $RS_ref_g->FetchRow()) {

                $category_name = $Row_ref_g['category_name'];
                $parent_id = $Row_ref_g['parent_id'];
                $code = $Row_ref_g['code'];
                $code_range_from = $Row_ref_g['code_range_from'];
                $code_range_to = $Row_ref_g['code_range_to'];
                $optional = $Row_ref_g['optional'];
                $status = $Row_ref_g['status'];
                $old_ref_gl_id = $Row_ref_g['id'];

                $Sql_company_gl = " SELECT  count(id) as total 
                                    FROM company_gl  
                                    where category_name='" . $category_name . "' and 
                                          code='" . $code . "' and 
                                          company_id='" . $new_company_id . "'";

                $RS_company_gl = $this->objsetup->CSI($Sql_company_gl);
                $total_company_gl = $RS_company_gl->fields['total'];

                if ($total_company_gl > 0) {
                    //$company_gl_error_counter++;
                    $response['ack'] = 1;
                    $response['error'] = NULL;
                    $response['company_gl_error'] = "Duplicate Code '" . $code . "' with Category Name '" . $category_name . "'";
                    return $response;
                } else {

                    $Sql_add_company_gl = "INSERT INTO company_gl
                                                        SET
                                                            ref_gl_id='" . $old_ref_gl_id . "',
                                                            category_name='" . $category_name . "',
                                                            categoryDisplayName='" . $category_name . "',
                                                            parent_id='" . $parent_id . "',
                                                            code='" . $code . "',
                                                            code_range_from='" . $code_range_from . "',
                                                            code_range_to='" . $code_range_to . "',
                                                            optional='" . $optional . "',
                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                            status='" . $status . "'";

                    $RS_add_company_gl = $this->objsetup->CSI($Sql_add_company_gl);
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['company_gl_error_counter'] = $company_gl_error_counter;
        } else
            $response['response'][] = array();

        return $response;
    }

    /* ========================================================== */
    /* 			GL Module functions from setup for codes End 	 */
    /* ========================================================== */


    /* ========================================================== */
    /* 			GL Accounts Credit Debit Details 	            */
    /* ========================================================== */

    //-------Gl template-----------------------------------------

    function get_template_gl_list($attr) {
        /* global $objFilters;
          return $objFilters->get_module_listing(53, "charges",$attr[column],$attr[value]); */
          

        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        

        $response = array();
        
        $Sql = "SELECT   c.id, c.name, c.description  FROM  gl_template  c
                where  c.status=1 AND
                        c.type = ".$attr['journal_type']." AND
                       c.company_id=" . $this->arrUser['company_id'] . "	 
                order by  c.id";
        // echo	$Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function add_template_gl($attr) {

        $id = ($attr['id'] != '') ? $attr['id'] : 0;
        
        $data_pass = "  tst.name = '" . addslashes($attr['name'])."'   ";
        if ($id > 0)
            $data_pass .= " AND tst.id <> '".$attr['id']."' ";

        $total = $this->objGeneral->count_duplicate_in_sql('gl_template', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        
        if($id == 0)
        {
            $Sql = "INSERT INTO gl_template 
                                SET 
                                    name = '" . addslashes($attr['name'])."',
                                    description = '$attr[description]',
                                    type = $attr[journal_type],
                                    user_id='" . $this->arrUser['id'] . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    date_created = '" . current_date . "'";
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }
        else
        {
            $Sql = "UPDATE gl_template 
                            SET 
                                name = '" . addslashes($attr['name'])."', 
                                description = '$attr[description]'
                            WHERE id = $id
                            LIMIT 1";
            $RS = $this->objsetup->CSI($Sql);
            
        }
        // echo $Sql;exit;
        if ($this->Conn->Affected_Rows() > 0 || $id>0) {
        
            $delete_sql = "DELETE FROM gl_template_details WHERE template_id = $id";
            $delete_RS = $this->objsetup->CSI($delete_sql);


            $Sql_lines = "INSERT INTO gl_template_details(template_id, document_type, document_no, 
                                                    transaction_type, account_id, account_no, 
                                                    account_name, company_id, user_id, debit_amount, credit_amount,
                                                    posting_group_id, currency_id,
                                                    balancing_account_id,balancing_account_name,balancing_account_code, 
                                                    AddedBy, AddedOn) VALUES ";
            foreach ($attr['journal_lines'] as $item) {

                $document_type      = ($item->doc_type->id != '') ? $item->doc_type->id : 0;
                $transaction_type   = ($item->module_type->value != '') ? $item->module_type->value : 0;
                $account_id         = ($item->account_id != '') ? $item->account_id : 0;
                $credit_amount      = ($item->credit_amount != '') ? $item->credit_amount : 0;
                $debit_amount       = ($item->debit_amount != '') ? $item->debit_amount : 0;
                $posting_group_id   = (isset($item->posting_group_id) && $item->posting_group_id != '') ? $item->posting_group_id : '0';
                $currency_id        = (isset($item->currency_id) && $item->currency_id->id != '') ? $item->currency_id->id : '0';

                $balancing_account_id= ($item->balancing_account_id != '') ? $item->balancing_account_id : 0;

                $Sql_lines .= "($id, $document_type,  '" . addslashes($item->document_no) . "',  
                            $transaction_type, $account_id , '" . addslashes($item->account_no) . "',
                            '" . addslashes($item->account_name) . "', '" . $this->arrUser['company_id'] . "', '" . $this->arrUser['id'] . "', $debit_amount, $credit_amount,
                            $posting_group_id, $currency_id,
                            $balancing_account_id, '" . addslashes($item->balancing_account_name) . "','" . addslashes($item->balancing_account_code) . "',
                            '" . $this->arrUser['id'] . "', UNIX_TIMESTAMP (NOW()) ),";
            }
            $Sql_lines = substr($Sql_lines, 0, -1);
            $lines_RS = $this->objsetup->CSI($Sql_lines);
            
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            $response['ack'] = 1;
        }
        
        $response['template_id'] = $id;
        $response['error'] = NULL;
        $response['ack'] = 1;
        $response['error'] = 'Record Inserted Successfully';
        return $response;
    }

    function delete_template_gl($attr) {
        $this->objGeneral->mysql_clean($attr);
        $journal_id = ($attr['journal_id'] != '') ? $attr['journal_id'] : 0;
        $id = ($attr['id'] != '') ? $attr['id'] : 0;

        $Sql = "DELETE FROM gl_template WHERE id = $id AND company_id = " . $this->arrUser['company_id'] . " LIMIT 1";
        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {

            $Sql_update = "UPDATE gl_journal_receipt SET template_id = 0 WHERE id= $journal_id AND company_id = " . $this->arrUser['company_id'];
            $RS_update = $this->objsetup->CSI($Sql_update);

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
        }
        return $response;
    }

    function change_template($attr)
    {
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        $journal_id = ($attr['journal_id'] != '') ? $attr['journal_id'] : 0;
        $id = ($attr['id'] != '') ? $attr['id'] : 0;

        $Sql_delete="DELETE FROM payment_details WHERE parent_id = $journal_id AND 
                        (SELECT type FROM gl_journal_receipt AS gjr WHERE gjr.id=$journal_id LIMIT 1) = 1 AND company_id = " . $this->arrUser['company_id'];
        $RS1 = $this->objsetup->CSI($Sql_delete);

        $Sql = "INSERT INTO payment_details (parent_id,
                            transaction_type ,
                            document_type,
                            document_no,
                            company_id ,
                            user_id,
                            account_id,
                            account_no,
                            account_name,
                            posting_date,
                            created_date,
                            currency_id,
                            posting_group_id,
                            debit_amount,
                            credit_amount,
                            converted_price,
                            converted_currency_id,
                            cnv_rate,
                            balancing_account_id,
                            balancing_account_code,
                            balancing_account_name,
                            status,
                            posting_dateUnConv,
                            AddedBy,
                            AddedOn)
                SELECT $journal_id, transaction_type ,
                            document_type,
                            document_no,
                            ".$this->arrUser['company_id']." ,
                            ".$this->arrUser['id']." ,
                            account_id,
                            account_no,
                            account_name,
                            NULL,
                            UNIX_TIMESTAMP (NOW()),
                            currency_id,
                            posting_group_id,
                            debit_amount,
                            credit_amount,
                            (CASE WHEN debit_amount > 0 THEN debit_amount ELSE credit_amount END),
                            0,
                            1,
                            balancing_account_id,
                            balancing_account_code,
                            balancing_account_name,
                            1,
                            NULL,
                            ".$this->arrUser['id']." ,
                            UNIX_TIMESTAMP (NOW())
                FROM gl_template_details AS gtd
                WHERE gtd.template_id  = $id AND 
                    (SELECT type FROM gl_journal_receipt AS gjr WHERE gjr.id=$journal_id LIMIT 1) = 1 AND
                    gtd.company_id = " . $this->arrUser['company_id'];

        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {

            $Sql_update = "UPDATE gl_journal_receipt SET template_id = $id WHERE id= $journal_id AND company_id = " . $this->arrUser['company_id'];
            $RS_update = $this->objsetup->CSI($Sql_update);

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
        }
        return $response;
    }
    /* =============GL Journal    ============================================= */

    function delete_invoice_receipt_payment($arr_attr) {

        $Sql = "DELETE FROM gl_journal_receipt_person 	WHERE id = ".$arr_attr['id']." Limit 1 ";
        echo $Sql;
        exit;
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

    function get_all_account($attr) {

        $this->objGeneral->mysql_clean($attr);
        /* $account_type = implode(',', $attr['cat_id']);
          if (!empty($account_type)) $where_clause .= " AND (company_gl_accounts.parent_cat_id IN (" . $account_type . ") OR company_gl_accounts.subcat_id IN(" . $account_type . "))"; */

        $response = array();
        $where_clause = "";


        if (!empty($attr['account_list_type']))
            $where_clause .= " AND  account_type= ".$attr['account_list_type']." ";

        if (!empty($attr['searchKeyword'])) {
            $val = intval(preg_replace("/[^0-9]/", '', $attr['searchKeyword']));

            if ($val != 0)
                $where_clause .= " AND  ac.account_code LIKE '%".$val."%'  ";
            else
                $where_clause .= "   AND ac.name LIKE '%".$attr['searchKeyword']."%'";
        }

        $Sql = "SELECT  ac.id,ac.ref_gl_account_id,ac.name,ac.account_code
                FROM company_gl_accounts as ac
                where ac.status=1 AND  
                      ac.company_id=" . $this->arrUser['company_id'] . "
                      " . $where_clause . " ".$where_clause."
                Order by ac.account_code ASC";

        $Sql = "SELECT  ac.id,ac.gl_account_ref_id,ac.name,ac.accountCode
                FROM gl_account AS ac
                WHERE ac.status=1 AND  
                      ac.company_id=" . $this->arrUser['company_id'] . "
                ORDER BY ac.accountCode ASC";


        // echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['ref_id'] = $Row['gl_account_ref_id'];
                $result['name'] = $Row['name'];
                $result['code'] = $Row['accountCode'];
                //   $result['level'] = 1;
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = '';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'No Record Found';
        }
        return $response;
    }

    function get_gl_main_list($attr) {
        //$this->objGeneral->mysql_clean($attr);
        $where = "";

        if (!empty($attr['search_code']))
            $where .= "AND c.acc_code='".$attr['search_code']."' ";

        if (!empty($attr['type']))
            $where .= "AND c.type='".$attr['type']."' ";

        $Sql = "SELECT   c.id,c.acc_code,c.acc_description,c.journal_date
                FROM  gl_journal_main  c
                where  c.status=1  AND 
                       c.company_id=" . $this->arrUser['company_id'] . "
                       ".$where."
                order by c.id ASC";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['acc_code'];
                $result['name'] = $Row['acc_description'];
                $result['Date'] = $this->objGeneral->convert_unix_into_date($Row['journal_date']);

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        return $response;
    }

    function get_gl_main_by_id($attr) {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        $Sql = "SELECT * FROM gl_journal_main WHERE id=".$attr['id']." LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['journal_date'] = $this->objGeneral->convert_unix_into_date($Row['journal_date']);
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function add_gl_main_list($attr) {

        $id = $attr['id'];
        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "' ";

        $data_pass = "  tst.acc_code='" . $attr['acc_code'] . "'  and 
                        tst.status=1 and  
                        tst.type=1   
                        $update_check ";

        $total = $this->objGeneral->count_duplicate_in_sql('gl_journal', $data_pass, $this->arrUser['company_id']);
        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists. ';
            return $response;
        }

        if ($id == 0) {
            $msg = 'Inserted';
            $Sql = "INSERT INTO gl_journal_main (acc_description,create_date ,journal_date,acc_no,acc_code,company_id,  user_id,type,template_id) VALUES ";
            $Sql .= "(  	 '" . $attr[acc_description] . "' ,'" . current_date . "','" . $this->objGeneral->convert_date($attr['journal_date']) . "' ,'" . $attr[acc_no] . "','" . $attr[acc_code] . "' 	,'" . $this->arrUser['company_id'] . "'," . "'" . $this->arrUser['id'] . "',1 ,'" . $attr[template_id]->id . "' ) ";
        } else {
            $msg = 'Update';
            $Sql = "UPDATE gl_journal_main 
                                SET 
                                    acc_description='" . $attr[acc_description] . "' ,
                                    journal_date='" . $this->objGeneral->convert_date($attr['journal_date']) . "',
                                    template_id='" . $attr[template_id]->id . "'
                                WHERE id = $id 
                                Limit 1 ";
        }
        //echo  $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($id == 0)
            $id = $this->Conn->Insert_ID();
        //$this->Conn->Affected_Rows()
        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = 'Record ' . $msg;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not .' . $msg;
        }
        return $response;
    }

    function get_gl_journal($attr) {
        //$this->objGeneral->mysql_clean($attr);
        $where = "";

        if (!empty($attr[parent_id]))
            $where .= "AND c.parent_id=$attr[parent_id] ";
        if (!empty($attr[parent_id]))
            $where .= "AND c.type=1 ";


        if (!empty($attr[temp_id])) {
            $tb = $attr[tb];
            $Sql = "SELECT  c.*,
                            CASE  WHEN c.tran_type = 1 THEN 'Credit' 
                                  WHEN c.tran_type = 2 THEN 'Debit'  
                            END AS transaction
                    FROM  gl_journal c
                    JOIN company on company.id=c.company_id 
                    JOIN  gl_journal_main jm on jm.id=c.parent_id 
                    where  c.status=1  AND 
                           (c.company_id=" . $this->arrUser['company_id'] . " or  
                            company.parent_id=" . $this->arrUser['company_id'] . ") AND 
                           jm.template_id=$attr[temp_id]		
                    Order by c.id ASC";
        } else {

            $Sql = "SELECT  c.*, 
                            CASE  WHEN c.tran_type = 1 THEN 'Credit' 
                                  WHEN c.tran_type = 2 THEN 'Debit'  
                            END AS transaction
                    FROM   gl_journal c
                    JOIN company on company.id=c.company_id 
                    where  c.status=1  AND 
                           (c.company_id=" . $this->arrUser['company_id'] . " or  
                            company.parent_id=" . $this->arrUser['company_id'] . ") 
                            $where
                    Order by c.id ASC";
        }

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['debit_amount'] = $Row['debit_amount'];
                $result['acc_description'] = $Row['acc_description'];
                $result['credit_amount'] = $Row['credit_amount'];
                $result['tran_type'] = $Row['tran_type'];
                $result['transaction'] = $Row['transaction'];
                $result['account_code'] = $Row['account_code'];
                $result['account_id'] = $Row['account_id'];
                $result['module_type'] = $Row['module_type'];
                //	$result['type'] = $Row['type'];
                $result['converted_price'] = $Row['converted_price'];
                $result['currency_id'] = $Row['currency_id'];
                $result['acc_code'] = $Row['acc_code'];
                $result['parent_id'] = $Row['parent_id'];
                $result['date'] = $this->objGeneral->convert_unix_into_date($Row['journal_date']);
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_jl_journal_by_id($attr) {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";
        $response = array();


        $Sql = "SELECT *   FROM   gl_journal  WHERE id=".$attr['id']." LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['journal_date'] = $this->objGeneral->convert_unix_into_date($Row['journal_date']);
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function add_gl_journal($attr) {

        $chk = 0;
        // $Sqli = "DELETE FROM gl_journal WHERE parent_id= '" .$attr[parent_id]. "' ";
        $Sqli = "UPDATE gl_journal SET  status= 0	 WHERE parent_id = '" . $attr['parent_id'] . "' ";

        $RS = $this->objsetup->CSI($Sqli);
        if ($this->Conn->Affected_Rows() > 0)
            $msg = 'Updated';
        else
            $msg = 'Inserted';

        $Sql = "INSERT INTO gl_journal(credit_amount,debit_amount,tran_type,account_code,account_id,acc_description,module_type,type,currency_id,converted_price,journal_date,company_id,  user_id,create_date,acc_code,parent_id) VALUES ";
        foreach ($attr['selectdata'] as $item) {
            if ($item->credit_amount > 0 || $item->debit_amount > 0) {
                if (($item->credit_amount > 0))
                    $type = 1;
                else if (($item->debit_amount > 0))
                    $type = 2;

                $Sql .= "(  '" . $item->credit_amount . "','" . $item->debit_amount . "','" . $type . "','" . $item->account_code . "','" . $item->account_id . "'	,'" . $item->acc_description . "','" . $item->module_type->value . "','" . $attr['type'] . "','" . $item->currency_id->id . "','" . $item->converted_price . "','" . $this->objGeneral->convert_date($item->journal_date) . "' ,'" . $this->arrUser['company_id'] . "'," . "'" . $this->arrUser['id'] . "','" . current_date . "','" . $item->acc_code . "','" .
                        $attr[parent_id] . "'  ),";
            }
        }
        $Sql = substr($Sql, 0, -1);
        //echo   $Sql ;exit;
        $RS = $this->objsetup->CSI($Sql);
        // $response['id'] = $this->Conn->Insert_ID();

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = 'Record ' . $msg;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not .' . $msg;
        }
        return $response;
    }

    function convert_posting($attr) {
        $this->objGeneral->mysql_clean($attr);

        $response = array();

        $ids = "";
        $sql_pr = "";
        $sql_fr = "";


        $Sql = "SELECT  ac.id,
                        ac.account_id,
                        ac.tran_type,
                        CASE WHEN ac.tran_type = 1 THEN ac.credit_amount  
                             WHEN ac.tran_type = 2 THEN ac.debit_amount   
                        END AS amount
		FROM gl_journal as ac
        where ac.status=1  AND 
              ac.company_id=" . $this->arrUser['company_id'] . " AND 
              ac.type=1 ";

        $RS = $this->objsetup->CSI($Sql);

        $Sql_accounts = "INSERT INTO account_entry (amount, module_id, gl_id,tran_type,module_type,status, user_id, create_date,company_id) VALUES ";

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                $ids .= $Row['id'] . ',';
                $Sql_accounts .= "(  '" . $Row['amount'] . "','" . $Row['id'] . "','" . $Row['account_id'] . "'
				,'" . $Row['tran_type'] . "'	,5,1," . "'" . $this->arrUser['id'] . "','" . current_date . "','" . $this->arrUser['company_id'] . "' ),";
            }
            $response['error'] = '';
            $response['ack'] = 1;
        }

        $sql_pr .= "UPDATE gl_journal_main SET type=2 WHERE id ='".$attr['parent']."' Limit 1";
        // echo $sql_pr;exit;
        $rsl_pr = $this->objsetup->CSI($sql_pr);

        $ids = substr($ids, 0, -1);
        $sql_fr .= "UPDATE gl_journal SET type=2 WHERE id IN (".$ids.") and status=1";
        // echo $sql_fr;exit;
        $sql_fr = $this->objsetup->CSI($sql_fr);

        $Sql_accounts = substr($Sql_accounts, 0, -1);
        //echo $Sql_accounts;exit;
        $RS_accounts = $this->objsetup->CSI($Sql_accounts);


        return $response;
    }

    function get_invoice_receipt($arr_attr) {

        $Sql = "SELECT * 
                FROM gl_journal_receipt_person 
                WHERE   type = '".$arr_attr['type']."' AND
                        module_id = '".$arr_attr['id']."' AND
                        parent_id = '".$arr_attr['parent_id']."' AND
                        end_date=0 ";

        $RS = $this->objsetup->CSI($Sql);

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
        return $response;
    }

    function add_invoice_receipt($arr_attr) {
        $ids = "";
        if (empty($arr_attr['invoice_id']))
            $arr_attr['invoice_id'] = 0;

        $check = false;
        $Sqla = "INSERT INTO gl_journal_receipt_allocation (module_id,
                                                            type,
                                                            company_id, 
                                                            user_id,
                                                            parent_id,
                                                            start_date,
                                                            amount,
                                                            doc_type,
                                                            cust_id, 
                                                            invoice_id,
                                                            converted_price) VALUES ";

        $Sqla .= "(  '" . $arr_attr['id'] . "'  ,
                    " . $arr_attr['type_allocatin'] . "  ,
                    " . $this->arrUser['company_id'] . " ,
                    " . $this->arrUser['id'] . ",
                    '" . $arr_attr['parent_id'] . "' ,
                    '" . current_date . "' ,
                    " . $arr_attr['total_allocatin'] . ",
                    '" . $arr_attr['doc_type'] . "',
                    '" . $arr_attr['cust_id'] . "',
                    '" . $arr_attr['invoice_id'] . "','')  ";
        // echo $Sqla;exit;
        if ($arr_attr['type_allocatin'] == 1)
            $RS = $this->objsetup->CSI($Sqla);

        $Sql = "INSERT INTO gl_journal_receipt_person (module_id,
                            salesperson_id,
                            type,
                            company_id,
                             user_id,
                             parent_id,
                             start_date,
                             amount,doc_type,
                             cust_id,converted_price) VALUES ";

        foreach ($arr_attr['selected'] as $item) {
            $ids .= $item->id . ",";
            $Sql .= "(  '" . $item->id . "' ,
                    " . $item->sale_person_id . " ,
                    " . $arr_attr['type'] . "  ,
                    " . $this->arrUser['company_id'] . " ,
                    " . $this->arrUser['id'] . ",
                    '" . $arr_attr['parent_id'] . "' ,
                    '" . current_date . "' ," . $item->amount . ",
                    '" . $arr_attr['doc_type'] . "',
                    '" . $arr_attr['cust_id'] . "',
                    '" . $item->converted_price . "'), ";
            $check = true;
        }

        $ids = substr($ids, 0, -1);
        $where_id = " AND module_id IN ( $ids )";

        /* $sql_del = "DELETE FROM gl_journal_receipt_person WHERE parent_id='$arr_attr[parent_id]' AND type='".$arr_attr['type']."'  AND doc_type='$arr_attr[doc_type]' $where_id ";
          //echo $sql_del;exit;
          $rsql_del = $this->objsetup->CSI($sql_del); */

        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        // echo $Sql;exit;
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

    function get_journal_allocated_cust($attr) {

        //$this->objGeneral->mysql_clean($attr);
        $response = array();
        $limit_clause = "";
        $where_clause2 = "And ( d.amount- IFNULL((  SELECT sum(wa.amount) 
                                                    FROM gl_journal_receipt_allocation as wa 
                                                    WHERE wa.type =2 AND  
                                                          wa.allocate_id =d.id And 
                                                          d.allocate_type=2 ) ,0)  >0)";

        $Sql = "SELECT d.id as allocate_id, 
                       d.start_date as journal_date, 
                       d.invoice_id, 
                       d.amount,
                       null as payed,
                       (d.amount ) - IFNULL((SELECT sum(wa.amount) 
                                             FROM gl_journal_receipt_allocation as wa 
                                             WHERE wa.type =2 AND  
                                                   wa.allocate_id =d.id),0) as remaining
		        FROM  gl_journal_receipt_allocation d
                where  d.type=1  AND 
                       d.allocate_type=2  AND d.cust_id  = '$attr[cust_id]'
		$where_clause2
		Order by d.id DESC";
        //echo $Sql; exit;
        /* 	$Sql = "SELECT d.id,d.journal_date, (d.credit_amount+ d.debit_amount) as amount
          ,  IFNULL( (	 SELECT sum(wa.amount) FROM gl_journal_receipt_person as wa WHERE wa.type = 1  AND wa.cust_id = '$attr[sell_to_cust_id]'  AND wa.parent_id ='$attr[parent_id]'  And wa.cust_id =d.account_id
          )+ ( SELECT sum(wa.amount) FROM gl_journal_receipt_refund as wa WHERE wa.type = 1  AND wa.cust_id = '$attr[sell_to_cust_id]'  AND wa.parent_id ='$attr[parent_id]'   And wa.cust_id =d.account_id)   ,0) as payed
          ,(d.credit_amount + d.debit_amount) - IFNULL( ( SELECT sum(wa.amount) FROM gl_journal_receipt_person as wa WHERE wa.type = 1 AND wa.cust_id =  '$attr[cust_id]'  AND wa.parent_id =  '$attr[parent_id]' And wa.cust_id =d.account_id)   ,0)  as remaining
          FROM  gl_journal_receipt_detail   d
          left  JOIN company on company.id=d.company_id
          where  d.status=1    And d.parent_id ='$attr[parent_id]'  AND d.account_id  = '$attr[sell_to_cust_id]'
          AND ( d.company_id=" . $this->arrUser['company_id'] . " 	or  company.parent_id=" . $this->arrUser['company_id'] . ")
          Order by d.id DESC";
          /*	+ ( SELECT sum(wa.amount) FROM gl_journal_receipt_refund as wa WHERE wa.type = 1 AND wa.cust_id = '$attr[cust_id]' AND wa.parent_id ='$attr[parent_id]'And wa.cust_id =d.account_id ) */
        // echo $Sql;exit;



        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['invoice_id'];
                $result['allocate_id'] = $Row['allocate_id'];
                $result['journal_date'] = $this->objGeneral->convert_unix_into_date($Row['journal_date']);
                $result['grand_total'] = $Row['amount'];
                $result['payed'] = $Row['payed'];
                $result['outstanding'] = $Row['remaining'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_refund($attr) {
        $add = "";
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        if (!empty($attr['Serachkeyword'])) {
            $val = intval(preg_replace("/[^0-9]/", '', $attr['Serachkeyword']));
            //	 $where_clause .= " AND  (d.invoice_no LIKE '%$val%'  OR d.sell_to_cust_name LIKE '%$attr[Serachkeyword]%' )";
            if ($val != 0)
                $where_clause .= "   "; //AND  d.invoice_no LIKE '%$val%'
            else
                $where_clause .= "   AND d.sell_to_cust_name LIKE '%$attr[Serachkeyword]%'";
        }

        if ($attr['type'] == 3)
            $where_clause = "AND d.type in (".$attr['type'].")"; // AND d.order_no LIKE '%$val%'
        else
            $where_clause = "AND d.type in (2,".$attr['type'].")";    //AND d.invoice_no LIKE '%$val%'

        if (!empty($attr[sell_to_cust_id])) {
            $where_clause2 = "AND d.sell_to_cust_id  = '$attr[sell_to_cust_id]' AND  
                                  d.grand_total- IFNULL(( SELECT sum(wa.amount) 
                                                          FROM gl_journal_receipt_person as wa 
                                                          WHERE wa.type = 1 AND wa.salesperson_id = d.id ),0)";
        }

        $Sql = "SELECT  d.*	, 
                        d.grand_total- IFNULL(( SELECT sum(wa.amount) 
                                                FROM gl_journal_receipt_person as wa 
                                                WHERE wa.type = 1 AND 
                                                      wa.salesperson_id = d.id ),0) as outstanding 
		        FROM srm_invoice  d
                left  JOIN company on company.id=d.company_id  
                where  d.status=1  $add and 
                       (d.company_id=" . $this->arrUser['company_id'] . " or  
                        company.parent_id=" . $this->arrUser['company_id'] . ")
                        " . $where_clause2 . "  " . $where_clause . "
		        Order by d.id DESC";

        //left  JOIN country cu on cu.id=d.comm_book_in_no
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['grand_total'] = $Row['grand_total'];
                $result['code'] = $Row['invoice_code'];

                if ($attr['type'] == 3)
                    $result['code'] = $Row['order_code'];

                $result['name'] = $Row['sell_to_cust_name'];
                $result['address_1'] = $Row['sell_to_address'];
                $result['address_2'] = $Row['sell_to_address2'];
                $result['city'] = $Row['sell_to_city'];
                $result['county'] = $Row['sell_to_county'];
                $result['country'] = $Row['comm_book_in_no']; // $Row['cuname'];
                $result['contact_person'] = $Row['sell_to_contact_no'];

                if ($attr[more_fields] == '1') {
                    $result['postcode'] = $Row['sell_to_post_code'];
                    $result['phone'] = $Row['sell_to_contact_no'];
                    $result['email'] = $Row['email'];
                    $result['fax'] = $Row['fax'];
                    $result['purchase_code'] = $Row['purchase_code'];

                    $result['cust_phone'] = $Row['cust_phone'];
                    $result['cust_fax'] = $Row['cust_fax'];
                    $result['cust_email'] = $Row['cust_email'];
                    $result['supp_order_no'] = $Row['supp_order_no'];

                    $result['requested_delivery_date'] = $this->objGeneral->convert_unix_into_date($Row['requested_delivery_date']);
                    $result['invoice_date'] = $this->objGeneral->convert_unix_into_date($Row['invoice_date']);
                    $result['order_date'] = $this->objGeneral->convert_unix_into_date($Row['order_date']);
                    $result['comm_book_in_no'] = $Row['comm_book_in_no'];
                    $result['order_list_name'] = $Row['order_list_name'];
                    //$result['anumber'] = $Row['account_payable_number'];
                    //$result['pnumber'] = $Row['purchase_code_number'];
                    //$result['payment_method'] = $Row['payment_method_id'];
                    //$result['payment_term'] = $Row['payment_terms_id'];
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

    function add_refund($arr_attr) {
        $ids = "";
        // print_r($arr_attr);exit;
        $check = false;

        $Sqla = "INSERT INTO gl_journal_receipt_allocation (module_id,invoice_id,type,company_id, user_id,parent_id,start_date,amount,doc_type,cust_id,allocate_id,converted_price) VALUES ";

        $Sql = "INSERT INTO gl_journal_receipt_refund (module_id,salesperson_id,type,company_id, user_id,parent_id,start_date,amount,doc_type,cust_id,converted_price) VALUES ";

        foreach ($arr_attr['selected'] as $item) {
            $ids .= $item->id . ",";
            $Sql .= "(  '" . $arr_attr['id'] . "' ," . $item->id . " ," . $arr_attr['type'] . "  ," . $this->arrUser['company_id'] . " ," . $this->arrUser['id'] . ",'" . $arr_attr['parent_id'] . "' ,'" . current_date . "' ," . $item->amount . ",'" . $arr_attr['doc_type'] . "','" . $arr_attr['cust_id'] . "', '" . $item->converted_price . "	'), ";
            $check = true;
            if ($arr_attr['type_allocatin'] == 2)
                $Sqla .= "(  '" . $arr_attr['id'] . "' ," . $item->id . " ," . $arr_attr['type_allocatin'] . "  ," . $this->arrUser['company_id'] . " ," . $this->arrUser['id'] . ",'" . $arr_attr['parent_id'] . "' ,'" . current_date . "'  ," . $item->total_allocatin . ",'" . $arr_attr['doc_type'] . "','" . $arr_attr['cust_id'] . "'," . $item->allocate_id . "	,	 '" . $item->converted_price . "	'), ";
        }

        $ids = substr($ids, 0, -1);
        $where_id = " AND module_id IN ( $ids )";

        $sql_del = "DELETE FROM gl_journal_receipt_refund WHERE parent_id='$arr_attr[parent_id]' AND type='".$arr_attr['type']."'  AND doc_type='$arr_attr[doc_type]' $where_id ";
        $rsql_del = $this->objsetup->CSI($sql_del);

        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        $RS = $this->objsetup->CSI($Sql);


        $Sqla = substr_replace(substr($Sqla, 0, -1), "", -1);
        if ($arr_attr['type_allocatin'] == 2)
            $RS = $this->objsetup->CSI($Sqla);


        if ($check) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_gl_main_list_receipt($attr)
    {
        $moduleForPermission = "";

        $response = array();

        if ($attr['module_type'] == 0) {
            $moduleForPermission = "general_journal";
        } 
        else if ($attr['module_type'] == 1) {
            $moduleForPermission = "customer_journal";
        } 
        else if ($attr['module_type'] == 2) {
            $moduleForPermission = "supplier_journal";
        } 
        else if ($attr['module_type'] == 3) {
            $moduleForPermission = "item_journal";
        }


        $where = "";
        //$this->objGeneral->mysql_clean($attr);
        if (!empty($attr['search_code']))
            $where .= "AND c.acc_code='".$attr['search_code']."' ";

        if (isset($attr['type']))
            $where .= "AND c.type='".$attr['type']."' ";

        if (isset($attr['module_type']))
            $where .= "AND c.module_type='".$attr['module_type']."' ";

        if (isset($attr['sub_module_type']))
            $where .= "AND c.sub_module_type='".$attr['sub_module_type']."' ";


        // print_r($attr);exit;
        $Sql = "SELECT c.id,c.acc_code,c.acc_description,c.journal_date,
                    CONCAT(emp.first_name,' ',emp.last_name) as empname, create_date,
                    posted_by_name, posted_on
                FROM gl_journal_receipt  c
                LEFT JOIN employees as emp on emp.id= c.user_id
                where  c.status=1  AND 
                       c.company_id=" . $this->arrUser['company_id'] . "
                        ".$where."
                order by c.id DESC";
        // echo $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql); 
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['no.'] = $Row['acc_code'];
                // $result['name'] = $Row['acc_description'];                

                if (isset($attr['type']) && $attr['type'] == 2){
                    $result['posted_by'] = $Row['posted_by_name'];
                    $result['posted_on'] = $this->objGeneral->convert_unix_into_datetime($Row['posted_on']);
                }
                else{
                    $result['created_by'] = $Row['empname'];
                    $result['created_date'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);
                }

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();


        return $response;
    }


    function get_gl_main_by_id_receipt($attr) {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        if ($attr['id'] > 0) {
            $Sql = "SELECT * FROM gl_journal_receipt WHERE id='".$attr['id']."' AND company_id =" . $this->arrUser['company_id'] . " LIMIT 1";
            $RS = $this->objsetup->CSI($Sql);
            $response['ack'] = 1;
            $response['error'] = NULL;
            if ($RS->RecordCount() > 0) {
                $Row = $RS->FetchRow();
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $Row['journal_date'] = $this->objGeneral->convert_unix_into_date($Row['journal_date']);

                $currency_arr_local = $this->objsetup->get_currencies_list();
                $Row['currency_arr_local']= $currency_arr_local['response'];

                $response['response'] = $Row;
            } else {
                $response['response'] = array();
            }
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function glRecordTypeById($id) {
        //0=gl,1=customer,2=supplier,,3=item, 4= Opening Balances

        $moduleName = "";

        if ($id > 0) {
            $Sql = "SELECT module_type FROM gl_journal_receipt WHERE id = $id;";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $typeId = $RS->fields['module_type'];

            if ($typeId == 0) {
                $moduleName = "general";
            } else if ($typeId == 1) {
                $moduleName = "customer";
            } else if ($typeId == 2) {
                $moduleName = "supplier";
            } else if ($typeId == 3) {
                $moduleName = "item";
            } else if ($typeId == 4) {
                $moduleName = "";
            }
        }
        return $moduleName;
    }

    function add_gl_main_list_receipt($attr) {
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

        if ($attr['id']) {
            $moduleName = $this->glRecordTypeById($attr['id']);
        }
        $moduleForPermission = $moduleName ? $moduleName . "_journal" : "";
        $modulePermission = "";
        $id = $attr['id'];
        $update_check = '';

        if ($id > 0)
            $update_check = " AND tst.id <> '" . $id . "'";

        $data_pass = "  tst.acc_code='" . $attr['acc_code'] . "'  and 
                        tst.module_type='" . $attr['module_type'] . "' and
                        tst.status=1 and  
                        tst.type=1  $update_check ";

        $total = $this->objGeneral->count_duplicate_in_sql('gl_journal_receipt', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
             $response['ack'] = 0;
              $response['error'] = 'Record Already Exists. ';
              return $response; 
            // $this->objsetup->terminateWithMessage("Record Already Exists.");
        }

        // $acc_no = ($attr['acc_no'] != '') ? $attr['acc_no'] : '0';
        $acc_no = (isset($attr['acc_no']) && $attr['acc_no'] != '') ? $attr['acc_no'] : 0;
        $template_id = ($attr['template_id'] != '') ? $attr['template_id'] : 0;
        $module_type = (isset($attr['module_type']) && $attr['module_type'] != '') ? $attr['module_type'] : 0;
        $sub_module_type = (isset($attr['sub_module_type']) && $attr['sub_module_type'] != '') ? $attr['sub_module_type'] : 0;

        if ($id == 0) {
            $modulePermission = sr_AddPermission;
            $msg = 'Inserted';
            $Sql = "INSERT INTO gl_journal_receipt 
                                        SET 
                                            acc_description='" . $attr['acc_description'] . "' ,
                                            create_date='" . current_date . "',
                                            journal_date='" . $this->objGeneral->convert_date($attr['journal_date']) . "',
                                            acc_no='" . $acc_no . "',
                                            acc_code='" . $attr['acc_code'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "',  
                                            user_id='" . $this->arrUser['id'] . "',
                                            type=1,
                                            template_id='" . $template_id . "',
                                            module_type= '" . $module_type . "',
                                            transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 2),
                                            sub_module_type= '" . $sub_module_type . "'";
        } else {
            $modulePermission = sr_AddEditPermission;
            $msg = 'Update';
            /* commented this part
              module_type='" . $module_type . "',
              sub_module_type= '" . $sub_module_type . "'
             */
            $Sql = "UPDATE gl_journal_receipt 
                                SET 
                                    acc_description='" . $attr['acc_description'] . "',
                                    journal_date='" . $this->objGeneral->convert_date($attr['journal_date']) . "',
                                    template_id='" . $template_id . "'
                                    
                                WHERE id = $id 
                                Limit 1 ";
        }
        // echo  $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, $moduleForPermission, $modulePermission);


        if ($id == 0)
            $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            /* $response['ack'] = 1;
              $response['id'] = $id;
              $response['error'] = 'Record ' . $msg; */
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
            
           // return $response;
        } else {
             $response['ack'] = 0;
              $response['error'] = 'Record Not .' . $msg; 
            // $this->objsetup->terminateWithMessage('Record Not .' . $msg);
        }
        $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        
        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Exit';
        $srLogTrace['ErrorMessage'] = "";
        $this->objsetup->SRTraceLogsPHP($srLogTrace);
         return $response;
    }

    function get_jl_journal_by_id_receipt($attr) {
        $this->objGeneral->mysql_clean($attr);
        $limit_clause = $where_clause = "";
        $response = array();

        $Sql = "SELECT * FROM gl_journal_receipt_detail  WHERE id=".$attr['id']." LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['journal_date'] = $this->objGeneral->convert_unix_into_date($Row['journal_date']);
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_gl_journal_receipt($attr) {
        //$this->objGeneral->mysql_clean($attr);
        $where = "";
        /*
          if (!empty($attr[parent_id]))
          $where .= "AND c.parent_id=$attr[parent_id] ";



          if (!empty($attr[temp_id])) {
          $Sql = "SELECT   c.*,
          IFNULL(( SELECT sum(wa.amount)
          FROM gl_journal_receipt_person as wa
          WHERE   wa.cust_id=c.account_id ),0) as allocated ,
          CASE  WHEN c.tran_type = 1 THEN 'Credit'
          WHEN c.tran_type = 2 THEN 'Debit'
          END AS transaction
          FROM  gl_journal_receipt_detail c
          JOIN company on company.id=c.company_id
          JOIN gl_journal_receipt jm on jm.id=c.parent_id
          where  c.status=1  AND
          (c.company_id=" . $this->arrUser['company_id'] . " or
          company.parent_id=" . $this->arrUser['company_id'] . ") AND
          jm.template_id=$attr[temp_id]
          Order by c.id ASC  ";
          } else {

          $Sql = "SELECT  c.*,
          CASE  WHEN c.tran_type = 1 THEN 'Credit'
          WHEN c.tran_type = 2 THEN 'Debit'
          END AS transaction,
          IFNULL(( SELECT sum(wa.amount)
          FROM gl_journal_receipt_person as wa
          WHERE   wa.cust_id=c.account_id ),0) as allocated
          FROM   gl_journal_receipt_detail c
          JOIN company on company.id=c.company_id
          where  c.status=1  AND
          (c.company_id=" . $this->arrUser['company_id'] . " or
          company.parent_id=" . $this->arrUser['company_id'] . ")
          $where
          Order by c.id ASC  ";
          } */

        // pd.status, gjr.type ==> 1- Default. 2- Posted
        $Sql = "SELECT pd.* FROM payment_details AS pd, gl_journal_receipt AS gjr 
                WHERE 
                    pd.parent_id = gjr.id AND
                    gjr.id = $attr[parent_id] AND
                    pd.parent_id = $attr[parent_id] AND 
                    pd.status = gjr.type AND
                    gjr.company_id =" . $this->arrUser['company_id']."
                ORDER BY pd.id";
        // echo    $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                /* $result = array();
                  $result['id'] = $Row['id'];
                  $result['acc_description'] = $Row['acc_description'];

                  $result['debit_amount'] = $Row['debit_amount'];
                  $result['credit_amount'] = $Row['credit_amount'];
                  $result['tran_type'] = $Row['tran_type'];
                  $result['transaction'] = $Row['transaction'];
                  $result['account_code'] = $Row['account_code'];
                  $result['account_id'] = $Row['account_id'];
                  $result['module_type'] = $Row['module_type'];
                  $result['type'] = $Row['type'];
                  $result['converted_price'] = $Row['converted_price'];
                  $result['currency_id'] = $Row['currency_id'];
                  $result['acc_code'] = $Row['acc_code'];
                  $result['parent_id'] = $Row['parent_id'];
                  $result['journal_date'] = $this->objGeneral->convert_unix_into_date($Row['journal_date']);

                  $result['balance_code'] = $Row['balance_code'];
                  $result['balance_id'] = $Row['balance_id'];
                  $result['posting_group_id'] = $Row['posting_group_id'];
                  $result['doc_type'] = $Row['doc_type'];
                  $result['converted_price'] = $Row['converted_price'];
                  $result['cnv_rate'] = $Row['cnv_rate'];

                  $result['allocated'] = ($Row['debit_amount'] + $Row['credit_amount']) - $Row['allocated']; */

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['posting_date'] = trim($this->objGeneral->convert_unix_into_date($Row['posting_date']));

                if($this->arrUser['company_id'] == 133){

                    // PBI: Requirment In GL For Vat GL Calculation in Vat column instead of general calculation. 
                    $sqlvat = " SELECT gl1.id AS gl1ID,gl1.accountCode AS gl1AccountCode,
                                    gl2.id AS gl2ID,gl2.accountCode AS gl2AccountCode,
                                    gl3.id AS gl3ID,gl3.accountCode AS gl3AccountCode
                                FROM financial_settings AS fs 
                                LEFT JOIN gl_account AS gl1 ON gl1.id = fs.VatPosting_gl_account_sale
                                LEFT JOIN gl_account AS gl2 ON gl2.id = fs.VatPosting_gl_account_purchase
                                LEFT JOIN gl_account AS gl3 ON gl3.id = fs.VatPosting_gl_account_imp
                                WHERE fs.company_id='" . $this->arrUser['company_id'] . "' AND 
                                    gl1.company_id='" . $this->arrUser['company_id'] . "' AND
                                    gl2.company_id='" . $this->arrUser['company_id'] . "' AND
                                    gl3.company_id='" . $this->arrUser['company_id'] . "'  ";

                }
                else{
                
                    // PBI: Requirment In GL For Vat GL Calculation in Vat column instead of general calculation. 
                    $sqlvat = "SELECT startRangeCode,endRangeCode 
                                FROM gl_account 
                                WHERE id = (SELECT VatPosting_gl_account 
                                                FROM financial_settings
                                                WHERE company_id='" . $this->arrUser['company_id'] . "')";
                }
                $RSV = $this->objsetup->CSI($sqlvat);
                
                if ($RSV->RecordCount() > 0) {
                    while ($RowVat = $RSV->FetchRow()) {
                        foreach ($RowVat as $key => $value) {
                            if (is_numeric($key))
                                unset($RowVat[$key]);
                        }

                        if($this->arrUser['company_id'] == 133){
                            $Row['vatRange']['gl1AccountCode'] = $RowVat['gl1AccountCode'];
                            $Row['vatRange']['gl2AccountCode'] = $RowVat['gl2AccountCode'];
                            $Row['vatRange']['gl3AccountCode'] = $RowVat['gl3AccountCode'];
                        }
                        else{ 
                            //  print_r($RowVat);
                            $Row['vatRange']['startRangeCode'] = $RowVat['startRangeCode'];
                            $Row['vatRange']['endRangeCode'] = $RowVat['endRangeCode'];
                        }
                    }
                }

                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        return $response;
    }

    function get_gl_journal_receipt_item($attr) {

        //$this->objGeneral->mysql_clean($attr);
        $where = "";

        $Sql = "SELECT *, (SELECT IFNULL(SUM(wh.quantity), 0) 
                            FROM warehouse_allocation as wh 
                            WHERE ijd.company_id =" . $this->arrUser['company_id'] . " AND 
                                wh.type = 3 AND wh.order_id=ijd.parent_id AND
                                wh.warehouse_id = ijd.warehouse AND  
                                wh.item_journal_detail_id = ijd.id) AS allocated_stock
                    FROM item_journal_details AS ijd
                    WHERE ijd.parent_id = ".$attr['parent_id']."  AND ijd.company_id =" . $this->arrUser['company_id'] . " AND status >0";
        // echo    $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['posting_date'] = trim($this->objGeneral->convert_unix_into_date($Row['posting_date']));

                $attr['product_id'] = $Row['item_id'];
                // $Row['arr_warehouse'] = $this->objStock->get_all_product_warehouses($attr);

                $t_attr['wrh_id'] = $Row['warehouse'];
                $t_attr['prod_id'] = $Row['item_id'];


                /* $temp_attr['item_id'] = $Row['item_id'];
                $temp_attr['order_id'] = $Row['parent_id'];
                $temp_attr['wh_id'] = $Row['warehouse'];
                $temp_attr['item_journal'] = 1;
                $temp_attr['item_journal_detail_id'] = $Row['id']; */
                if($Row['stock_check'] > 0)
                    $Row['arr_location'] = $this->objWrh->get_sel_warehouse_loc_in_stock_alloc($t_attr);
                else    
                    $Row['arr_location'] = array();

                // $Row['item_stock_allocation'] = $this->objSWrh->get_order_stock_allocation($temp_attr);
                // $Row['arr_units'] = $this->objStock->get_unit_setup_list_category_by_item($attr);


                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        return $response;
    }

    function add_gl_journal_receipt($attr) {

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

        $moduleName = $this->glRecordTypeById($attr['parent_id']);
        $moduleForPermission = $moduleName ? $moduleName . "_journal" : "";

        // print_r($attr['selectdata']);exit;
        foreach ($attr['selectdata'] as $item) {
            $modulePermission = "";
            $account_id = (isset($item->account_id) && $item->account_id != '') ? $item->account_id : '0';
            $converted_price = (isset($item->converted_price) && floatval($item->converted_price) > 0) ? Round($item->converted_price,2) : '0';
            $debit_amount = (isset($item->debit_amount) && $item->debit_amount != '') ? Round($item->debit_amount,2) : 'NULL';
            $credit_amount = (isset($item->credit_amount) && $item->credit_amount != '') ? Round($item->credit_amount,2) : 'NULL';
            $transaction_type = (isset($item->transaction_type) && $item->transaction_type != '') ? $item->transaction_type : '0';
            $document_type = (isset($item->document_type) && $item->document_type != '') ? $item->document_type : '0';
            $balancing_account_id = (isset($item->balancing_account_id) && $item->balancing_account_id != '') ? $item->balancing_account_id : '0';
            $cnv_rate = (isset($item->cnv_rate) && $item->cnv_rate != '') ? $item->cnv_rate : '0';
            $converted_currency_id = (isset($item->converted_currency_id) && $item->converted_currency_id != '') ? $item->converted_currency_id : '0';
            $posting_date = $this->objGeneral->convert_date($item->posting_date);
            $id = (isset($item->id) && $item->id != '') ? $item->id : '0';
            $posting_group_id = (isset($item->posting_group_id) && $item->posting_group_id != '') ? $item->posting_group_id : '0';
            $currency_id = (isset($item->currency_id) && $item->currency_id->id != '') ? $item->currency_id->id : '0';
            $document_no = addslashes($item->document_no);
            $account_no = addslashes($item->account_no);
            $account_name = addslashes($item->account_name);
            $balancing_account_code = addslashes($item->balancing_account_code);
            $balancing_account_name = addslashes($item->balancing_account_name);

            if ($id == 0) {
                $modulePermission = sr_AddPermission;
                $Sql = "INSERT INTO payment_details
                            (parent_id,
                            transaction_type,
                            document_type,
                            document_no,
                            company_id,
                            user_id,
                            account_id,
                            account_no,
                            account_name,
                            posting_date,
                            created_date,
                            currency_id,
                            posting_group_id,
                            debit_amount,
                            credit_amount,
                            converted_price,
                            converted_currency_id,
                            cnv_rate,
                            balancing_account_id,
                            balancing_account_code,
                            balancing_account_name,
                            status,
                            posting_dateUnConv)
                        SELECT 
                            \"$attr[parent_id]\",
                             $transaction_type,
                             $document_type,
                             \"$document_no\",
                             " . $this->arrUser['company_id'] . ",
                             " . $this->arrUser['id'] . ",
                             $account_id,
                             \"$account_no\",
                             \"$account_name\",
                             \"$posting_date\",
                            " . current_date . " ,
                             " . $currency_id . ",
                             " . $posting_group_id . ",
                             $debit_amount,
                             $credit_amount,
                             $converted_price,
                            $converted_currency_id,
                             $cnv_rate,
                              $balancing_account_id,
                            \"$balancing_account_code\",
                            \"$balancing_account_name\",
                            1,
                            DATE_FORMAT(FROM_UNIXTIME($posting_date), '%Y-%m-%d')
                        FROM widgetone
                        WHERE
                            (SELECT type FROM gl_journal_receipt AS gjr WHERE gjr.id=$attr[parent_id] LIMIT 1) = 1 
                        LIMIT 1";
                // echo $Sql;exit;
            } else {

                $modulePermission = sr_AddEditPermission;
                $Sql = "UPDATE payment_details SET
                            transaction_type =  $transaction_type,
                            document_type =  $document_type,
                            document_no =  '" . addslashes($item->document_no) . "',
                            account_id =  $account_id,
                            account_no =  '" . addslashes($item->account_no) . "',
                            account_name =  '" . addslashes($item->account_name) . "',
                            posting_date =  '" . $posting_date . "',
                            currency_id =  " . $currency_id . ",
                            posting_group_id =  " . $posting_group_id . ",
                            debit_amount =  $debit_amount,
                            credit_amount =  $credit_amount,
                            converted_price =  $converted_price,
                            converted_currency_id = $converted_currency_id,
                            cnv_rate =  $cnv_rate,
                            balancing_account_id =   $balancing_account_id,
                            balancing_account_code = '" . addslashes($item->balancing_account_code) . "',
                            balancing_account_name = '" . addslashes($item->balancing_account_name) . "',
                            posting_dateUnConv = DATE_FORMAT(FROM_UNIXTIME($posting_date), '%Y-%m-%d')
                            WHERE id = $id AND status = 1 AND
                            (SELECT type FROM gl_journal_receipt AS gjr WHERE gjr.id=$attr[parent_id] LIMIT 1) = 1 
                                AND company_id = " . $this->arrUser['company_id']." LIMIT 1";
            }
            // echo $Sql;exit;
            // $RS = $this->objsetup->CSI($Sql);
            $RS = $this->objsetup->CSI($Sql, $moduleForPermission, $modulePermission);
        }

        /* $response['ack'] = 1;
          $response['error'] = 'Record Updated Successfully';
          return $response; */
        $response['ack'] = 1;
        $response['error'] = 'Record Updated Successfully';
        $this->Conn->commitTrans();
        $this->Conn->autoCommit = true;
        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'parent_id:' . $attr['parent_id'];
        $srLogTrace['ErrorMessage'] = '';

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
        return $response;


        /* if ($this->Conn->Affected_Rows() > 0) {
          $response['ack'] = 1;
          $response['error'] = 'Record ' . $msg;
          } else {
          $response['ack'] = 0;
          $response['error'] = 'Record Not .' . $msg;
          } */
    }

    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // opening balance stock start

    function addOpeningBalanceStock($attr) {
        /* echo "<pre>";
          print_r($attr['items']); exit; */

        $this->objGeneral->mysql_clean($attr);

        foreach ($attr['items'] as $item) {
            $productID = (isset($item->id) && $item->id != '') ? $item->id : 0;
            $warehouseID = (isset($item->warehouses->id) && $item->warehouses->id != '') ? $item->warehouses->id : 0;

            if($warehouseID == 0)
                $warehouseID = (isset($item->warehouseID) && $item->warehouseID != '') ? $item->warehouseID : 0;

            $storageLocID = (isset($item->storageLoc->id) && $item->storageLoc->id != '') ? $item->storageLoc->id : 0;
            // $prodStorageLocID = (isset($item->wh_id) && $item->wh_id != '') ? $item->wh_id : 0;
            $prodStorageLocID = (isset($item->prodStorageLocID) && $item->prodStorageLocID != '') ? $item->prodStorageLocID : 0;
            $qty = (isset($item->qty) && $item->qty != '') ? $item->qty : 0;
            $standard_price = (isset($item->standard_price) && $item->standard_price != '') ? Round($item->standard_price,3) : 0;
            $calcAmount = (isset($item->calcAmount) && $item->calcAmount != '') ? Round($item->calcAmount,2) : 0;
            $balancing_account_id = ($item->balancing_account_id != '') ? $item->balancing_account_id : 'NULL';
            $cnv_rate = ($item->cnv_rate != '') ? $item->cnv_rate : 1;
            $converted_currency_id = (isset($item->converted_currency_id) && $item->converted_currency_id != '') ? $item->converted_currency_id : '0';
            $currency_id = (isset($item->currency_id) && $item->currency_id != '') ? $item->currency_id : 'NULL';
            $converted_price = (isset($item->converted_price) && $item->converted_price != '') ? $item->converted_price : '0';

            $posting_date = $this->objGeneral->convert_date($item->posting_date);
            $prod_date = $this->objGeneral->convert_date($item->prod_date);
            $date_received = $this->objGeneral->convert_date($item->date_received);
            $use_by_date = $this->objGeneral->convert_date($item->use_by_date);

            $updateID = (isset($item->updateID) && $item->updateID != '') ? $item->updateID : '0';
            $uomID = (isset($item->uomID) && $item->uomID != '') ? $item->uomID : '0';
            $stock_check = (isset($item->stock_check) && $item->stock_check != '') ? $item->stock_check : '0';

            /*
              parent_id = '" . $attr['parent_id'] . "', */

            if ($updateID == 0) {
                $Sql = "INSERT INTO  opening_balance_stock 
                                            SET
                                                productID = '" . $productID . "',
                                                ItemNo='" . $item->product_code . "',
                                                description='" . $item->product_name . "',
                                                warehouseID = '" . $warehouseID . "',
                                                storageLocID = '" . $storageLocID . "',
                                                prodStorageLocID = '" . $prodStorageLocID . "',
                                                qty = '" . $qty . "',
                                                price = '" . $standard_price . "',
                                                debit_amount = '" . $calcAmount . "',
                                                posting_date =  '" . $posting_date . "',
                                                created_date = '" . current_date . "' ,
                                                currency_id =  " . $currency_id . ",
                                                converted_price =  '" . $converted_price . "',
                                                converted_currency_id = '" . $converted_currency_id . "',
                                                cnv_rate =  1,
                                                balancing_account_id =   " . $balancing_account_id . ",

                                                prod_date =   '" . $prod_date . "',
                                                date_received =   '" . $date_received . "',
                                                use_by_date =   '" . $use_by_date . "',
                                                container_no='" . $item->container_no . "',
                                                batch_no='" . $item->batch_no . "',
                                                stock_check='" . $stock_check . "',
                                                comm_book_in_no='" . $item->comm_book_in_no . "',

                                                uom='" . $item->uom . "',
                                                uomID =   '" . $uomID . "',

                                                status = 1,
                                                user_id =  '" . $this->arrUser['id'] . "',
                                                company_id =  '" . $this->arrUser['company_id'] . "'";
            } else {
                $Sql = "UPDATE opening_balance_stock 
                                        SET
                                                productID = '" . $productID . "',
                                                ItemNo='" . $item->product_code . "',
                                                description='" . $item->product_name . "',
                                                warehouseID = '" . $warehouseID . "',
                                                storageLocID = '" . $storageLocID . "',
                                                prodStorageLocID = '" . $prodStorageLocID . "',
                                                qty = '" . $qty . "',
                                                price = '" . $standard_price . "',
                                                debit_amount = '" . $calcAmount . "',
                                                posting_date =  '" . $posting_date . "',
                                                currency_id =  " . $currency_id . ",
                                                converted_price =  '" . $converted_price . "',
                                                converted_currency_id = '" . $converted_currency_id . "',
                                                cnv_rate =  1,

                                                prod_date =   '" . $prod_date . "',
                                                date_received =   '" . $date_received . "',
                                                use_by_date =   '" . $use_by_date . "',
                                                container_no='" . $item->container_no . "',
                                                batch_no='" . $item->batch_no . "',
                                                stock_check='" . $stock_check . "',
                                                comm_book_in_no='" . $item->comm_book_in_no . "',
                                                uom='" . $item->uom . "',
                                                uomID =   '" . $uomID . "',

                                                balancing_account_id =   " . $balancing_account_id . "
                                        WHERE id = ".$updateID." ";
            }
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
        }
        // echo $Sql;exit;

        $response['ack'] = 1;
        $response['error'] = 'Record Updated Successfully';
        return $response;
    }

    function getOpeningBalanceStock($attr) {
        // $parent_id = $attr['parent_id'];

        $Sql = "SELECT * 
                FROM opening_balance_stock 
                WHERE company_id = '" . $this->arrUser['company_id'] . "' AND status = 1";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql, "finance", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['posting_date'] = trim($this->objGeneral->convert_unix_into_date($Row['posting_date']));

                $Row['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                $Row['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                $Row['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);

                if($Row['warehouseID']>0){
                    $arrWarehouse = self::getWarehouseLinktoItemWithAvailableQty($Row); 
                    $arrStorageLoc = self::getStorageLocLinktoItem($Row);  
                    
                    $Row['arr_warehouse'] = $arrWarehouse['response'];
                    $Row['arrStorageLoc'] = $arrStorageLoc['response'];
                    
                }
                                  

                $Row['updateID'] = $Row['id'];
                $Row['wh_id'] = $Row['prodStorageLocID'];

                $response['response'][] = $Row;
            }

            // require_once(SERVER_PATH . "/classes/Stock.php");
            // $this->objstock = new Stock($this->arrUser);
            // $result13 = $this->objstock->getAllProductsList($attr);
            // $response['prooduct_arr'] = $result13['response']; 

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        return $response;
    }

    function deleteOpeningBalncStockItem($attr) {
        $id = $attr['id'];

        $Sql = "DELETE FROM opening_balance_stock
                WHERE id = ".$id." and postStatus IS NULL Limit 1";
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

    function getWarehouseLinktoItemWithAvailableQty($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $postStatus = $attr['postStatus'];

        if($postStatus>0){
            $avialableQtyChk = '0  AS available_quantity,';
        }else{
            $avialableQtyChk = 'SR_CURRENT_OR_AVAILABLE_STOCK_byWarehouse(`c`.`item_id`,`c`.`warehouse_id`,`c`.`company_id`,2)  AS available_quantity,';
        }

        $Sql = "SELECT
                    `c`.`warehouse_id`          AS `wh_warehouse_id`,
                    `wrh`.`name`                AS `wh_warehouse`,
                    `wrh`.`wrh_code`            AS `wh_wrh_code`,
                    `c`.`default_warehouse`     AS `wh_default_warehouse`,
                    `c`.`company_id`            AS `wh_company_id`,
                    `c`.`item_id`               AS `wh_item_id`,
                    `c`.`status`                AS `wh_status`,
                    `c`.`id`                    AS `wh_id`,
                    0  AS `total_quantity`,
                    ".$avialableQtyChk."
                    0  AS `sold_quantity`,
                    0  AS `allocated_quantity`
                FROM `product_warehouse_location` `c`
                LEFT JOIN `warehouse` `wrh` ON `wrh`.`id` = `c`.`warehouse_id`
                WHERE `wrh`.`status` = 1 AND  wrh.company_id=" . $this->arrUser['company_id'] . " AND  `c`.`item_id`=" . $attr['productID'] . "
                 GROUP BY `c`.`warehouse_id`
                 order by c.id ASC ";

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $temp['id']   = $Row['wh_warehouse_id'];
                $temp['name'] = $Row['wh_wrh_code'] . '-' . $Row['wh_warehouse'];                        
                $temp['total_quantity']         = $Row['total_quantity'];
                $temp['sold_quantity']          = $Row['sold_quantity'];
                $temp['available_quantity']     = $Row['available_quantity'];
                $temp['allocated_quantity']     = $Row['allocated_quantity'];
                $temp['wh_status']              = $Row['wh_status'];

                if ($Row['wh_default_warehouse'] > 0) {
                    $temp['default_wh'] = $Row['wh_warehouse_id'];
                }
                $response['response'][]= $temp;           
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

    function getWarehouseLinktoItem($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        $Sql = "SELECT
                    `c`.`warehouse_id`          AS `wh_warehouse_id`,
                    `wrh`.`name`                AS `wh_warehouse`,
                    `wrh`.`wrh_code`            AS `wh_wrh_code`,
                    `c`.`default_warehouse`     AS `wh_default_warehouse`,
                    `c`.`company_id`            AS `wh_company_id`,
                    `c`.`item_id`               AS `wh_item_id`,
                    `c`.`status`                AS `wh_status`,
                    `c`.`id`                    AS `wh_id`,
                    `SR_CURRENT_OR_AVAILABLE_STOCK_byWarehouse`(
                    `c`.`item_id`,`c`.`warehouse_id`,`c`.`company_id`,1)  AS `total_quantity`,
                    `SR_CURRENT_OR_AVAILABLE_STOCK_byWarehouse`(
                    `c`.`item_id`,`c`.`warehouse_id`,`c`.`company_id`,2)  AS `available_quantity`,
                    `SR_CURRENT_OR_AVAILABLE_STOCK_byWarehouse`(
                    `c`.`item_id`,`c`.`warehouse_id`,`c`.`company_id`,7)  AS `sold_quantity`,
                    `SR_CURRENT_OR_AVAILABLE_STOCK_byWarehouse`(
                    `c`.`item_id`,`c`.`warehouse_id`,`c`.`company_id`,3)  AS `allocated_quantity`
                FROM `product_warehouse_location` `c`
                LEFT JOIN `warehouse` `wrh` ON `wrh`.`id` = `c`.`warehouse_id`
                WHERE `wrh`.`status` = 1 AND  wrh.company_id=" . $this->arrUser['company_id'] . " AND  `c`.`item_id`=" . $attr['productID'] . "
                 GROUP BY `c`.`warehouse_id`
                 order by c.id ASC ";

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $temp['id']   = $Row['wh_warehouse_id'];
                $temp['name'] = $Row['wh_wrh_code'] . '-' . $Row['wh_warehouse'];                        
                $temp['total_quantity']         = $Row['total_quantity'];
                $temp['sold_quantity']          = $Row['sold_quantity'];
                $temp['available_quantity']     = $Row['available_quantity'];
                $temp['allocated_quantity']     = $Row['allocated_quantity'];
                $temp['wh_status']              = $Row['wh_status'];

                if ($Row['wh_default_warehouse'] > 0) {
                    $temp['default_wh'] = $Row['wh_warehouse_id'];
                }
                $response['response'][]= $temp;           
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

    function getStorageLocLinktoItem($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $response = array();

        /* $Sql = "SELECT  c.id,c.title,c.dimensions_id,c.parent_id,c.bin_cost,
                        curr.code as crname,
                        dim.title as dimtitle,
                        ((SELECT COUNT(uom_setup.id) 
                         FROM units_of_measure_setup uom_setup 
                         WHERE  uom_setup.product_id='".$attr['productID']."' AND 
                                uom_setup.cat_id=c.dimensions_id) +
                        (SELECT COUNT(product.unit_id) 
                         FROM product 
                         WHERE  product.id='".$attr['productID']."' AND 
                                product.unit_id=c.dimensions_id))  as UOMexist,
                        (SELECT pwl.id 
                         FROM product_warehouse_location as pwl 
                         WHERE  pwl.item_id='".$attr['productID']."' AND 
                                pwl.warehouse_id='".$attr['warehouseID']."' AND 
                                pwl.company_id='" . $this->arrUser['company_id'] . "' AND
                                pwl.status=1 AND
                                pwl.warehouse_loc_id = c.id
                         LIMIT 1 )  as pwlID,

                        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                            WHEN c.cost_type_id = 2 THEN 'Daily'
                            WHEN c.cost_type_id = 3 THEN 'Weekly'
                            WHEN c.cost_type_id = 4 THEN 'Monthly'
                            WHEN c.cost_type_id = 5 THEN 'Annually'
                            END AS cost_type
                From warehouse_bin_location  c
                left JOIN currency as curr on curr.id=c.currency_id
                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                where  c.warehouse_id=$attr[warehouseID] and 
                       c.status=1 and
                       c.parent_id=0 and
                       c.company_id=" . $this->arrUser['company_id'] . " AND
                       (SELECT pwl.id 
                         FROM product_warehouse_location as pwl 
                         WHERE  pwl.item_id='".$attr['productID']."' AND 
                                pwl.warehouse_id='".$attr['warehouseID']."' AND 
                                pwl.company_id='" . $this->arrUser['company_id'] . "' AND
                                pwl.status=1 AND
                                pwl.warehouse_loc_id = c.id
                         LIMIT 1 ) >0
                 order by c.id ASC ";
                 //='".$attr['unit_id']."' and 

        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                if($Row['UOMexist']>0){
                    if ($Row['bin_cost'] > 0)
                        $result['Storage_location'] = $Row['title'] . "(" . $Row['crname'] . " " . $Row['bin_cost'] . ", " . $Row['dimtitle'] . ", " . $Row['cost_type'] . ")";
                    else
                        $result['Storage_location'] = $Row['title'];

                    $result['pwlID'] = $Row['pwlID'];
                    $response['response'][] = $result;
                }              

                $Sql_subparent = "SELECT c.id,c.title,c.dimensions_id,c.parent_id,c.bin_cost,
                                         curr.code as crname,dim.title as dimtitle,
                                         ((SELECT COUNT(uom_setup.id) 
                                          FROM units_of_measure_setup uom_setup 
                                          WHERE uom_setup.product_id='".$attr['productID']."' AND 
                                                uom_setup.cat_id=c.dimensions_id) +
                                            (SELECT COUNT(product.unit_id) 
                                            FROM product 
                                            WHERE  product.id='".$attr['productID']."' AND 
                                                    product.unit_id=c.dimensions_id)) as UOMexist,
                                        (SELECT pwl.id 
                                         FROM product_warehouse_location as pwl 
                                         WHERE  pwl.item_id='".$attr['productID']."' AND 
                                                pwl.warehouse_id='".$attr['warehouseID']."' AND 
                                                pwl.company_id='" . $this->arrUser['company_id'] . "' AND
                                                pwl.status=1 AND
                                                pwl.warehouse_loc_id = c.id
                                         LIMIT 1 )  as pwlID,
                                          CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                WHEN c.cost_type_id = 2 THEN 'Daily'
                                                WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                WHEN c.cost_type_id = 5 THEN 'Annually'
                                                END AS cost_type
                                    From warehouse_bin_location  c
                                    left JOIN currency as curr on curr.id=c.currency_id
                                    left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                    where   c.warehouse_id=$attr[warehouseID] AND 
                                            c.status=1 AND
                                            c.parent_id='" . $Row['id'] . "' AND
                                            c.company_id=" . $this->arrUser['company_id'] . " AND
                                            (SELECT pwl.id 
                                                FROM product_warehouse_location as pwl 
                                                WHERE  pwl.item_id='".$attr['productID']."' AND 
                                                        pwl.warehouse_id='".$attr['warehouseID']."' AND 
                                                        pwl.company_id='" . $this->arrUser['company_id'] . "' AND
                                                        pwl.status=1 AND
                                                        pwl.warehouse_loc_id = c.id
                                                LIMIT 1 ) >0
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

                            $result['pwlID'] = $Row['pwlID'];
                            $response['response'][] = $result;
                        }

                        $Sql_sub_subparent = "SELECT c.id,c.title,c.dimensions_id,c.parent_id,
                                                     c.bin_cost,curr.code as crname,
                                                     dim.title as dimtitle,
                                                     ((SELECT COUNT(uom_setup.id) 
                                                      FROM units_of_measure_setup uom_setup 
                                                      WHERE uom_setup.product_id='".$attr['productID']."' AND 
                                                            uom_setup.cat_id=c.dimensions_id) +
                                                    (SELECT COUNT(product.unit_id) 
                                                    FROM product 
                                                    WHERE  product.id='".$attr['productID']."' AND 
                                                            product.unit_id=c.dimensions_id)) as UOMexist,
                                                    (SELECT pwl.id 
                                                     FROM product_warehouse_location as pwl 
                                                     WHERE  pwl.item_id='".$attr['productID']."' AND 
                                                            pwl.warehouse_id='".$attr['warehouseID']."' AND 
                                                            pwl.company_id='" . $this->arrUser['company_id'] . "' AND
                                                            pwl.status=1 AND
                                                            pwl.warehouse_loc_id = c.id
                                                     LIMIT 1 )  as pwlID,
                                                      CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                            WHEN c.cost_type_id = 2 THEN 'Daily'
                                                            WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                            WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                            WHEN c.cost_type_id = 5 THEN 'Annually'
                                                       END AS cost_type
                                                From warehouse_bin_location  c
                                                left JOIN currency as curr on curr.id=c.currency_id
                                                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                where   c.warehouse_id=$attr[warehouseID] and 
                                                        c.status=1 and 
                                                        c.parent_id=" . $Row_subparent['id'] . " and
                                                        c.company_id=" . $this->arrUser['company_id'] . " AND
                                                        (SELECT pwl.id 
                                                            FROM product_warehouse_location as pwl 
                                                            WHERE  pwl.item_id='".$attr['productID']."' AND 
                                                                    pwl.warehouse_id='".$attr['warehouseID']."' AND 
                                                                    pwl.company_id='" . $this->arrUser['company_id'] . "' AND
                                                                    pwl.status=1 AND
                                                                    pwl.warehouse_loc_id = c.id
                                                            LIMIT 1 ) >0
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

                                    $result['pwlID'] = $Row['pwlID'];
                                    $response['response'][] = $result;
                                }


                                $Sql_sub_subparent2 = "SELECT c.id,c.title,c.dimensions_id,c.bin_cost,
                                                              c.parent_id,curr.code as crname,
                                                              dim.title as dimtitle,
                                                              ((SELECT COUNT(uom_setup.id) 
                                                               FROM units_of_measure_setup uom_setup 
                                                               WHERE uom_setup.product_id='".$attr['productID']."' AND 
                                                                     uom_setup.cat_id=c.dimensions_id) +
                                                                (SELECT COUNT(product.unit_id) 
                                                                FROM product 
                                                                WHERE  product.id='".$attr['productID']."' AND 
                                                                        product.unit_id=c.dimensions_id)) as UOMexist,
                                                                (SELECT pwl.id 
                                                                 FROM product_warehouse_location as pwl 
                                                                 WHERE  pwl.item_id='".$attr['productID']."' AND 
                                                                        pwl.warehouse_id='".$attr['warehouseID']."' AND 
                                                                        pwl.company_id='" . $this->arrUser['company_id'] . "' AND
                                                                        pwl.status=1 AND
                                                                        pwl.warehouse_loc_id = c.id 
                                                                 LIMIT 1)  as pwlID,
                                                                CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                                    WHEN c.cost_type_id = 2 THEN 'Daily'
                                                                    WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                                    WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                                    WHEN c.cost_type_id = 5 THEN 'Annually'
                                                                    END AS cost_type
                                                        From warehouse_bin_location  c
                                                        left JOIN currency as curr on curr.id=c.currency_id
                                                        left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                        where   c.warehouse_id=$attr[warehouseID] and 
                                                                c.status=1 and 
                                                                c.parent_id=" . $Row_sub_subparent['id'] . " and
                                                                c.company_id=" . $this->arrUser['company_id'] . " AND
                                                                (SELECT pwl.id 
                                                                    FROM product_warehouse_location as pwl 
                                                                    WHERE  pwl.item_id='".$attr['productID']."' AND 
                                                                            pwl.warehouse_id='".$attr['warehouseID']."' AND 
                                                                            pwl.company_id='" . $this->arrUser['company_id'] . "' AND
                                                                            pwl.status=1 AND
                                                                            pwl.warehouse_loc_id = c.id
                                                                    LIMIT 1 ) >0
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

                                            $result['pwlID'] = $Row['pwlID'];
                                            $response['response'][] = $result;
                                        }


                                        $Sql_sub_subparent3 = "SELECT c.id,c.title,c.dimensions_id,c.bin_cost,
                                                                      c.parent_id,curr.code as crname,
                                                                      dim.title as dimtitle,
                                                                      ((SELECT COUNT(uom_setup.id) 
                                                                        FROM units_of_measure_setup uom_setup 
                                                                        WHERE uom_setup.product_id='".$attr['productID']."' AND 
                                                                                uom_setup.cat_id=c.dimensions_id) +
                                                                        (SELECT COUNT(product.unit_id) 
                                                                        FROM product 
                                                                        WHERE  product.id='".$attr['productID']."' AND 
                                                                                product.unit_id=c.dimensions_id)) as UOMexist,
                                                                        (SELECT pwl.id 
                                                                         FROM product_warehouse_location as pwl 
                                                                         WHERE  pwl.item_id='".$attr['productID']."' AND 
                                                                                pwl.warehouse_id='".$attr['warehouseID']."' AND 
                                                                                pwl.company_id='" . $this->arrUser['company_id'] . "' AND
                                                                                pwl.status=1 AND 
                                                                                pwl.warehouse_loc_id = c.id
                                                                         LIMIT 1 )  as pwlID,
                                                                        CASE  WHEN c.cost_type_id = 1 THEN 'Fixed'
                                                                            WHEN c.cost_type_id = 2 THEN 'Daily'
                                                                            WHEN c.cost_type_id = 3 THEN 'Weekly'
                                                                            WHEN c.cost_type_id = 4 THEN 'Monthly'
                                                                            WHEN c.cost_type_id = 5 THEN 'Annually'
                                                                            END AS cost_type
                                                                From warehouse_bin_location  c
                                                                left JOIN currency as curr on curr.id=c.currency_id
                                                                left JOIN units_of_measure as dim on dim.id=c.dimensions_id
                                                                where   c.warehouse_id=$attr[warehouseID] and 
                                                                        c.status=1 and 
                                                                        c.parent_id=" . $Row_sub_subparent2['id'] . " and
                                                                        c.company_id=" . $this->arrUser['company_id'] . " AND
                                                                        (SELECT pwl.id 
                                                                            FROM product_warehouse_location as pwl 
                                                                            WHERE  pwl.item_id='".$attr['productID']."' AND 
                                                                                    pwl.warehouse_id='".$attr['warehouseID']."' AND 
                                                                                    pwl.company_id='" . $this->arrUser['company_id'] . "' AND
                                                                                    pwl.status=1 AND
                                                                                    pwl.warehouse_loc_id = c.id
                                                                            LIMIT 1 ) >0
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

                                                    $result['pwlID'] = $Row['pwlID'];
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
        } */

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
                where  c.item_id=" . $attr['productID'] . " AND 
                       c.warehouse_id='" . $attr['warehouseID']. "' AND 
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

    // opening balance stock end
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // opening balance customer start

    function addOpeningBalanceCustomer($attr) {
        // echo "<pre>";
        // print_r($attr['customers']); exit;

        $this->objGeneral->mysql_clean($attr); 

        $Sqla = "SELECT d.salesAccountDebators,
                           d.postingGroup,
                           gl_account.accountCode,
                           gl_account.name
                    FROM inventory_setup d
                    LEFT JOIN gl_account on gl_account.id=d.salesAccountDebators
                    WHERE d.company_id = '" . $this->arrUser['company_id'] . "' AND 
                          gl_account.status=1 AND
                          d.type=1";

        // echo $Sqla;exit;
        $RSa = $this->objsetup->CSI($Sqla);

        if ($RSa->RecordCount() > 0) {
            while ($Row = $RSa->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $postingAccounts[] = $Row;
            }
        }
        else {
            $response['ack'] = 0;
            $response['error'] = 'Posting Group Accounts are not Selected in Inventory Setup!';
            return $response;
        }

        foreach ($attr['customers'] as $rec) {

            $posting_date = (isset($rec->posting_date) && $rec->posting_date != '') ? $rec->posting_date : 0;
            $docType = (isset($rec->docTypes->id) && $rec->docTypes->id != '') ? $rec->docTypes->id : 0;
            $debitAmount = (isset($rec->debitAmount) && $rec->debitAmount != '') ? Round($rec->debitAmount,2) : 0;
            $creditAmount = (isset($rec->creditAmount) && $rec->creditAmount != '') ? Round($rec->creditAmount,2) : 0;
            $calcAmount = (isset($rec->calcAmount) && $rec->calcAmount != '') ? Round($rec->calcAmount,2) : 0;
            $currency_id = (isset($rec->currencyID->id) && $rec->currencyID->id != '') ? $rec->currencyID->id : 0;
            $posting_date = $this->objGeneral->convert_date($rec->posting_date);
            $convRate = (isset($rec->convRate) && $rec->convRate != '') ? Round($rec->convRate,5) : 0;
            $invoiceNoLength = strlen($rec->invoiceNo);

            if ($posting_date == 0) {
                $response['ack'] = 0;
                $response['error'] = 'Customer ' . $rec->description . '(' . $rec->moduleNo . ') Posting Date is not Selected!';
                return $response;
                exit;
            }elseif (!($rec->posting_group_id > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Customer ' . $rec->description . '(' . $rec->moduleNo . ') Posting Group is not Selected!';
                return $response;
                exit;
            } elseif (!($docType > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Customer ' . $rec->description . '(' . $rec->moduleNo . ') Doc Type is not Selected!';
                return $response;
                exit;
            } elseif (!($currency_id > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Customer ' . $rec->description . '(' . $rec->moduleNo . ') Currency is missing!';
                return $response;
                exit;
            } elseif (!($invoiceNoLength > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Customer ' . $rec->description . '(' . $rec->moduleNo . ') Doc No. is empty!';
                return $response;
                exit;
            } elseif ($convRate == 0) {
                $response['ack'] = 0;
                $response['error'] = 'Customer ' . $rec->description . '(' . $rec->moduleNo . ') Currency Conversion Rate is empty!';
                return $response;
                exit;
            } elseif ($convRate < 0) {
                $response['ack'] = 0;
                $response['error'] = 'Customer ' . $rec->description . '(' . $rec->moduleNo . ') Currency Conversion Rate Can\'t be negative!';
                return $response;
                exit;
            }
            /* elseif(!($rec->amount>0)){
              $response['ack'] = 0;
              $response['error'] = 'Customer '.$rec->description.'('.$rec->moduleNo.') Debit Amount is not Selected!';
              return $response;
              exit;
              } */ elseif (!($calcAmount > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Customer ' . $rec->description . '(' . $rec->moduleNo . ') Amount in LCY is invalid!';
                return $response;
                exit;
            } elseif (!($posting_date > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Customer ' . $rec->description . '(' . $rec->moduleNo . ') posting date is not Selected!';
                return $response;
                exit;
            }
        }

        $defaultCurrency = (isset($attr['defaultCurrency']) && $attr['defaultCurrency'] != '') ? $attr['defaultCurrency'] : '0';

        foreach ($attr['customers'] as $rec) {

            // $moduleID       = (isset($rec->id) && $rec->id!='')?$rec->id:0;
            $moduleID = (isset($rec->moduleID) && $rec->moduleID != '') ? $rec->moduleID : 0;
            $docType = (isset($rec->docTypes->id) && $rec->docTypes->id != '') ? $rec->docTypes->id : 0;
            $debitAmount = (isset($rec->debitAmount) && $rec->debitAmount != '') ? Round($rec->debitAmount,2) : 0;
            $creditAmount = (isset($rec->creditAmount) && $rec->creditAmount != '') ? Round($rec->creditAmount,2) : 0;
            $calcAmount = (isset($rec->calcAmount) && $rec->calcAmount != '') ? Round($rec->calcAmount,2) : 0;
            $currency_id = (isset($rec->currencyID->id) && $rec->currencyID->id != '') ? $rec->currencyID->id : 0;
            $posting_date = $this->objGeneral->convert_date($rec->posting_date);
            $updateID = (isset($rec->updateID) && $rec->updateID != '') ? $rec->updateID : 0;
            $convRate = (isset($rec->convRate) && $rec->convRate != '') ? Round($rec->convRate,5) : 0;
            $converted_currency_id = (isset($rec->converted_currency_id) && $rec->converted_currency_id != '') ? $rec->converted_currency_id : 0;

            /* if ($updateID > 0)
              $update_check = "  AND tst.id <> '" . $up_id . "'";

              $data_pass = "  tst.moduleID=" . $moduleID . " and
              tst.type = 1 and  $update_check";

              $total = $this->objGeneral->count_duplicate_in_sql('opening_balance_customer', $data_pass, $this->arrUser['company_id']);

              if (!($total > 0)) { */

            /* if($defaultCurrency!=$currency_id){

              $Sql_b = "SELECT conversion_rate
              FROM currency_histroy
              WHERE currency_id='".$currency_id."' AND
              start_date <= '" . $posting_date . "'
              ORDER BY start_date desc
              LIMIT 1  ";

              $RS_b = $this->objsetup->CSI($Sql_b);

              if ($RS_b->RecordCount() > 0) {
              $Row_b = $RS_b->FetchRow();
              $conversion_rate = $Row_b['conversion_rate'];
              $converted_price = bcdiv($amount, $conversion_rate, 4);
              }
              else{
              $response['ack'] = 0;
              $response['error'] = 'Please set the currency conversion rates!';
              return $response;
              exit;
              }
              } */

            foreach ($postingAccounts as $postgrp) {

                if ($postgrp['postingGroup'] == $rec->posting_group_id) {
                    $account_id = $postgrp['salesAccountDebators'];
                    $account_no = $postgrp['accountCode'];
                    $account_name = $postgrp['name'];
                }
            }
            
            $posting_dateUnConv = "";            

            if($rec->posting_date > 0){
                $posting_dateUnConv = " posting_dateUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($rec->posting_date) . "',";            
            } 
            if ($updateID == 0) {
                $Sql = "INSERT INTO  opening_balance_customer 
                                                SET
                                                    docType = '" . $docType . "',
                                                    moduleID = '" . $moduleID . "',
                                                    moduleNo='" . $rec->moduleNo . "',
                                                    description='" . $rec->description . "',
                                                    invoiceNo='" . $rec->invoiceNo . "',
                                                    extRefNo='" . $rec->extRefNo . "',
                                                    posting_group_id='" . $rec->posting_group_id . "',
                                                    account_id = '" . $account_id . "',
                                                    account_no = '" . $account_no . "',
                                                    account_name = '" . $account_name . "',
                                                    posting_date = '" . $posting_date . "',
                                                    $posting_dateUnConv
                                                    created_date = '" . current_date . "' ,
                                                    currency_id =  '" . $currency_id . "',
                                                    debitAmount = '" . $debitAmount . "',
                                                    creditAmount = '" . $creditAmount . "',
                                                    converted_price =  '" . $calcAmount . "',
                                                    converted_currency_id =  '" . $converted_currency_id . "',
                                                    convRate =  '" . $convRate . "',
                                                    status = 1,
                                                    type = 1,
                                                    transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 2),
                                                    user_id =  '" . $this->arrUser['id'] . "',
                                                    company_id =  '" . $this->arrUser['company_id'] . "'";
            } else {
                $Sql = "UPDATE opening_balance_customer 
                                            SET
                                                    docType = '" . $docType . "',
                                                    moduleID = '" . $moduleID . "',
                                                    moduleNo='" . $rec->moduleNo . "',
                                                    description='" . $rec->description . "',
                                                    invoiceNo='" . $rec->invoiceNo . "',
                                                    extRefNo='" . $rec->extRefNo . "',
                                                    posting_group_id='" . $rec->posting_group_id . "',
                                                    account_id = '" . $account_id . "',
                                                    account_no = '" . $account_no . "',
                                                    account_name = '" . $account_name . "',
                                                    posting_date = '" . $posting_date . "',
                                                    $posting_dateUnConv
                                                    currency_id =  '" . $currency_id . "',
                                                    debitAmount = '" . $debitAmount . "',
                                                    creditAmount = '" . $creditAmount . "',
                                                    converted_price =  '" . $calcAmount . "',
                                                    converted_currency_id =  '" . $converted_currency_id . "',
                                                    convRate =  '" . $convRate . "'
                                            WHERE id = $updateID";
            }
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            //}
        }

        $response['ack'] = 1;
        $response['error'] = 'Record Updated Successfully';
        return $response;
    }

    function getOpeningBalanceCustomer($attr) {

        $Sql = "SELECT * 
                FROM opening_balance_customer 
                WHERE company_id = '" . $this->arrUser['company_id'] . "'  AND 
                      status = 1 AND 
                      type=1";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql, "finance", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['posting_date'] = trim($this->objGeneral->convert_unix_into_date($Row['posting_date']));
                $Row['updateID'] = $Row['id'];
                $Row['docTypesel'] = $Row['docType'];
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        return $response;
    }

    function deleteOpeningBalncCustomerRec($attr) {
        $id = $attr['id'];

        $Sql = "DELETE FROM opening_balance_customer
                WHERE id = $id and postStatus IS NULL Limit 1";
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

    // opening balance customer end
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // opening balance Supplier start

    function addOpeningBalanceSupplier($attr) {
        //  echo "<pre>";
        // print_r($attr['suppliers']); exit;

        $this->objGeneral->mysql_clean($attr);

        $SqlSupp = "SELECT d.purchaseAccountCreditors,
                           d.postingGroup,
                           gl_account.accountCode,
                           gl_account.name
                    FROM inventory_setup d
                    LEFT JOIN gl_account on gl_account.id=d.purchaseAccountCreditors
                    WHERE d.company_id = '" . $this->arrUser['company_id'] . "' AND 
                          gl_account.status=1 AND
                          d.type=2";

        // echo $SqlSupp;exit;
        $RSSupp = $this->objsetup->CSI($SqlSupp);

        if ($RSSupp->RecordCount() > 0) {
            while ($Row = $RSSupp->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $postingAccounts[] = $Row;
            }
        }
        else {
            $response['ack'] = 0;
            $response['error'] = 'Posting Group Accounts are not Selected in Inventory Setup!';
            return $response;
        }

        foreach ($attr['suppliers'] as $rec) {

            $docType = (isset($rec->docTypes->id) && $rec->docTypes->id != '') ? $rec->docTypes->id : 0;
            $debitAmount = (isset($rec->debitAmount) && $rec->debitAmount != '') ? Round($rec->debitAmount,2) : 0;
            $creditAmount = (isset($rec->creditAmount) && $rec->creditAmount != '') ? Round($rec->creditAmount,2) : 0;
            $calcAmount = (isset($rec->calcAmount) && $rec->calcAmount != '') ? Round($rec->calcAmount,2) : 0;
            $currency_id = (isset($rec->currencyID->id) && $rec->currencyID->id != '') ? $rec->currencyID->id : 0;
            $posting_date = $this->objGeneral->convert_date($rec->posting_date);
            $convRate = (isset($rec->convRate) && $rec->convRate != '') ? Round($rec->convRate,5) : 0;
            $invoiceNoLength = strlen($rec->invoiceNo);

            if (!($rec->posting_group_id > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Supplier ' . $rec->description . '(' . $rec->moduleNo . ') Posting Group is not Selected!';
                return $response;
                exit;
            } elseif (!($docType > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Supplier ' . $rec->description . '(' . $rec->moduleNo . ') Doc Type is not Selected!';
                return $response;
                exit;
            } elseif (!($currency_id > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Supplier ' . $rec->description . '(' . $rec->moduleNo . ') Currency is missing!';
                return $response;
                exit;
            } elseif (!($invoiceNoLength > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Supplier ' . $rec->description . '(' . $rec->moduleNo . ') Doc No. is empty!';
                return $response;
                exit;
            } elseif ($convRate == 0) {
                $response['ack'] = 0;
                $response['error'] = 'Supplier ' . $rec->description . '(' . $rec->moduleNo . ') Currency Conversion Rate is empty!';
                return $response;
                exit;
            } elseif ($convRate < 0) {
                $response['ack'] = 0;
                $response['error'] = 'Supplier ' . $rec->description . '(' . $rec->moduleNo . ') Currency Conversion Rate Can\'t be negative!';
                return $response;
                exit;
            }
            /* elseif(!($rec->amount>0)){
              $response['ack'] = 0;
              $response['error'] = 'Supplier '.$rec->description.'('.$rec->moduleNo.') Debit Amount is not Selected!';
              return $response;
              exit;
              } */ elseif (!($calcAmount > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Supplier ' . $rec->description . '(' . $rec->moduleNo . ') Amount in LCY is invalid!';
                return $response;
                exit;
            } elseif (!($posting_date > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'Supplier ' . $rec->description . '(' . $rec->moduleNo . ') posting date is not Selected!';
                return $response;
                exit;
            }
        }

        $defaultCurrency = (isset($attr['defaultCurrency']) && $attr['defaultCurrency'] != '') ? $attr['defaultCurrency'] : '0';

        foreach ($attr['suppliers'] as $rec) {
            // $moduleID       = (isset($rec->id) && $rec->id!='')?$rec->id:0;
            $moduleID = (isset($rec->moduleID) && $rec->moduleID != '') ? $rec->moduleID : 0;
            $docType = (isset($rec->docTypes->id) && $rec->docTypes->id != '') ? $rec->docTypes->id : 0;
            $debitAmount = (isset($rec->debitAmount) && $rec->debitAmount != '') ? Round($rec->debitAmount,2) : 0;
            $creditAmount = (isset($rec->creditAmount) && $rec->creditAmount != '') ? Round($rec->creditAmount,2) : 0;
            $calcAmount = (isset($rec->calcAmount) && $rec->calcAmount != '') ? Round($rec->calcAmount,2) : 0;
            $currency_id = (isset($rec->currencyID->id) && $rec->currencyID->id != '') ? $rec->currencyID->id : 0;
            $posting_date = $this->objGeneral->convert_date($rec->posting_date);
            $updateID = (isset($rec->updateID) && $rec->updateID != '') ? $rec->updateID : 0;
            $convRate = (isset($rec->convRate) && $rec->convRate != '') ? Round($rec->convRate,5) : 0;
            $converted_currency_id = (isset($rec->converted_currency_id) && $rec->converted_currency_id != '') ? $rec->converted_currency_id : 0;

            /* if ($updateID > 0)
              $update_check = "  AND tst.id <> '" . $up_id . "'";

              $data_pass = "  tst.moduleID=" . $moduleID . " and
              tst.type = 2 and  $update_check";

              $total = $this->objGeneral->count_duplicate_in_sql('opening_balance_customer', $data_pass, $this->arrUser['company_id']);

              if (!($total > 0)) {

              if($defaultCurrency!=$currency_id){

              $Sql_b = "SELECT conversion_rate
              FROM currency_histroy
              WHERE currency_id='".$currency_id."' AND
              start_date <= '" . $posting_date . "'
              order by start_date desc LIMIT 1  ";

              $RS_b = $this->objsetup->CSI($Sql_b);

              if ($RS_b->RecordCount() > 0) {
              $Row_b = $RS_b->FetchRow();
              $conversion_rate = $Row_b['conversion_rate'];
              $converted_price = bcdiv($amount, $conversion_rate, 4);
              }
              else{
              $response['ack'] = 0;
              $response['error'] = 'Please set the currency conversion rates!';
              return $response;
              exit;
              }
              } */

            foreach ($postingAccounts as $postgrp) {

                if ($postgrp['postingGroup'] == $rec->posting_group_id) {
                    $account_id = $postgrp['purchaseAccountCreditors'];
                    $account_no = $postgrp['accountCode'];
                    $account_name = $postgrp['name'];
                }
            }

            if ($updateID == 0) {
                $Sql = "INSERT INTO  opening_balance_customer 
                                                SET
                                                    docType = '" . $docType . "',
                                                    moduleID = '" . $moduleID . "',
                                                    moduleNo='" . $rec->moduleNo . "',
                                                    description='" . $rec->description . "',
                                                    invoiceNo='" . $rec->invoiceNo . "',
                                                    extRefNo='" . $rec->extRefNo . "',
                                                    posting_group_id='" . $rec->posting_group_id . "',
                                                    account_id = '" . $account_id . "',
                                                    account_no = '" . $account_no . "',
                                                    account_name = '" . $account_name . "',
                                                    posting_date = '" . $posting_date . "',
                                                    created_date = '" . current_date . "' ,
                                                    currency_id =  '" . $currency_id . "',
                                                    debitAmount = '" . $debitAmount . "',
                                                    creditAmount = '" . $creditAmount . "',
                                                    converted_price =  '" . $calcAmount . "',
                                                    converted_currency_id =  '" . $converted_currency_id . "',
                                                    convRate =  '" . $convRate . "',
                                                    status = 1,
                                                    type = 2,
                                                    transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 2),
                                                    user_id =  '" . $this->arrUser['id'] . "',
                                                    company_id =  '" . $this->arrUser['company_id'] . "'";
            } else {
                $Sql = "UPDATE opening_balance_customer 
                                            SET
                                                    docType = '" . $docType . "',
                                                    moduleID = '" . $moduleID . "',
                                                    moduleNo='" . $rec->moduleNo . "',
                                                    description='" . $rec->description . "',
                                                    invoiceNo='" . $rec->invoiceNo . "',
                                                    extRefNo='" . $rec->extRefNo . "',
                                                    posting_group_id='" . $rec->posting_group_id . "',
                                                    account_id = '" . $account_id . "',
                                                    account_no = '" . $account_no . "',
                                                    account_name = '" . $account_name . "',
                                                    posting_date = '" . $posting_date . "',
                                                    currency_id =  '" . $currency_id . "',
                                                    debitAmount = '" . $debitAmount . "',
                                                    creditAmount = '" . $creditAmount . "',
                                                    converted_price =  '" . $calcAmount . "',
                                                    converted_currency_id =  '" . $converted_currency_id . "',
                                                    convRate =  '" . $convRate . "'
                                            WHERE id = ".$updateID." ";
            }
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            // }
        }

        $response['ack'] = 1;
        $response['error'] = 'Record Updated Successfully';
        return $response;
    }

    function getOpeningBalanceSupplier($attr) {

        $Sql = "SELECT * 
                FROM opening_balance_customer 
                WHERE company_id = '" . $this->arrUser['company_id'] . "' AND 
                      status = 1 AND 
                      type=2";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['posting_date'] = trim($this->objGeneral->convert_unix_into_date($Row['posting_date']));
                $Row['updateID'] = $Row['id'];
                $Row['docTypesel'] = $Row['docType'];
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        return $response;
    }

    // opening balance Supplier end
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // opening balance Bank start

    function addOpeningBalanceBank($attr) {

        $this->objGeneral->mysql_clean($attr);

        foreach ($attr['bankRec'] as $rec) {

            $docType = (isset($rec->docTypes->id) && $rec->docTypes->id != '') ? $rec->docTypes->id : 0;
            $moduleType = (isset($rec->moduleType) && $rec->moduleType != '') ? $rec->moduleType : 0;
            $debitAmount = (isset($rec->debitAmount) && $rec->debitAmount != '') ? Round($rec->debitAmount,2) : 0;
            $creditAmount = (isset($rec->creditAmount) && $rec->creditAmount != '') ? Round($rec->creditAmount,2) : 0;
            $calcAmount = (isset($rec->calcAmount) && $rec->calcAmount != '') ? Round($rec->calcAmount,2) : 0;
            // $currency_id = (isset($rec->currency_id) && $rec->currency_id != '') ? $rec->currency_id : '0';
            $currency_id = (isset($rec->currencyID->id) && $rec->currencyID->id != '') ? $rec->currencyID->id : 0;
            $convRate = (isset($rec->convRate) && $rec->convRate != '') ? Round($rec->convRate,5) : 0;
            $posting_date = $this->objGeneral->convert_date($rec->posting_date);
            $invoiceNoLength = strlen($rec->invoiceNo);

            $bankGlID = (isset($rec->bankGlID) && $rec->bankGlID != '') ? $rec->bankGlID : 0;


            if ($moduleType == 1){
                $moduleName = 'Customer';
                $moduleCode = $rec->customer_code;
            }
            elseif ($moduleType == 2){
                $moduleName = 'Supplier';
                $moduleCode = $rec->supplier_code;
            }

            if (!($rec->posting_group_id > 0)) {
                $response['ack'] = 0;
                $response['error'] = $moduleName . ' ' . $rec->name . '(' . $moduleCode. ') Posting Group is not Selected!';
                return $response;
                exit;
            } elseif (!($posting_date > 0)) {
                $response['ack'] = 0;
                $response['error'] = $moduleName . ' ' . $rec->name . '(' . $moduleCode . ') posting date is not Selected!';
                return $response;
                exit;
            } elseif (!($docType > 0)) {
                $response['ack'] = 0;
                $response['error'] = $moduleName . ' ' . $rec->description . '(' . $rec->moduleNo . ') Doc Type is not Selected!';
                return $response;
                exit;
            } elseif (!($currency_id > 0)) {
                $response['ack'] = 0;
                $response['error'] = $moduleName . ' ' . $rec->name . '(' . $moduleCode . ') Currency is missing!';
                return $response;
                exit;
            } elseif (!($invoiceNoLength > 0)) {
                $response['ack'] = 0;
                $response['error'] = $moduleName . ' ' . $rec->name . '(' . $moduleCode . ') Doc No. is empty!';
                return $response;
                exit;
            } elseif (!($bankGlID > 0)) {
                $response['ack'] = 0;
                $response['error'] = $moduleName . ' ' . $rec->description . '(' . $rec->moduleNo . ') Bank is not selected!';
                return $response;
                exit;
            } elseif ($convRate == 0) {
                $response['ack'] = 0;
                $response['error'] = $moduleName . ' ' . $rec->description . '(' . $rec->moduleNo . ') Currency Conversion Rate is empty!';
                return $response;
                exit;
            } elseif ($convRate < 0) {
                $response['ack'] = 0;
                $response['error'] = $moduleName . ' ' . $rec->name . '(' . $moduleCode . ') Conversion Rate Can\'t be negative!';
                return $response;
                exit;
            }  elseif (!($calcAmount > 0)) {
                $response['ack'] = 0;
                $response['error'] = $moduleName . ' ' . $rec->description . '(' . $rec->moduleNo . ') Amount in LCY is invalid!';
                return $response;
                exit;
            }
        }

        $defaultCurrency = (isset($attr['defaultCurrency']) && $attr['defaultCurrency'] != '') ? $attr['defaultCurrency'] : '0';

        foreach ($attr['bankRec'] as $rec) {
            $moduleType = (isset($rec->moduleType) && $rec->moduleType != '') ? $rec->moduleType : 0;
            // $moduleID   = (isset($rec->id) && $rec->id!='')?$rec->id:0;
            $moduleID = (isset($rec->moduleID) && $rec->moduleID != '') ? $rec->moduleID : 0;
            $docType = (isset($rec->docTypes->id) && $rec->docTypes->id != '') ? $rec->docTypes->id : 0;
            $debitAmount = (isset($rec->debitAmount) && $rec->debitAmount != '') ? Round($rec->debitAmount,2) : 0;
            $creditAmount = (isset($rec->creditAmount) && $rec->creditAmount != '') ? Round($rec->creditAmount,2) : 0;
            $calcAmount = (isset($rec->calcAmount) && $rec->calcAmount != '') ? Round($rec->calcAmount,2) : 0;
            $currency_id = (isset($rec->currencyID->id) && $rec->currencyID->id != '') ? $rec->currencyID->id : 0;
            $posting_date = $this->objGeneral->convert_date($rec->posting_date);
            $updateID = (isset($rec->updateID) && $rec->updateID != '') ? $rec->updateID : 0;
            $convRate = (isset($rec->convRate) && $rec->convRate != '') ? Round($rec->convRate,5) : 0;
            $converted_currency_id = (isset($rec->converted_currency_id) && $rec->converted_currency_id != '') ? $rec->converted_currency_id : 0;


            /* foreach($postingAccounts as $postgrp){

              if($moduleType==1){
              if($postgrp['postingGroup'] == $rec->posting_group_id &&
              $postgrp['salesAccountDebators']>0){
              $account_id   = $postgrp['accountID'];
              $account_no   = $postgrp['accountCode'];
              $account_name = $postgrp['name'];
              }
              }
              else if($moduleType==2){
              if($postgrp['postingGroup'] == $rec->posting_group_id &&
              $postgrp['purchaseAccountCreditors']>0){
              $account_id   = $postgrp['accountID'];
              $account_no   = $postgrp['accountCode'];
              $account_name = $postgrp['name'];
              }
              }
              } */

            $account_id = $rec->bankGlID;
            $account_no = $rec->bankNo;
            $account_name = $rec->bankGlName;

            $posting_dateUnConv = "";            

            if($rec->posting_date > 0){
                $posting_dateUnConv = " posting_dateUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($rec->posting_date) . "',";            
            }  

            if ($updateID == 0) {
                $Sql = "INSERT INTO  opening_balance_bank 
                                            SET
                                                docType = '" . $docType . "',
                                                moduleID = '" . $moduleID . "',
                                                moduleNo='" . $rec->moduleNo . "',
                                                description='" . $rec->description . "',
                                                invoiceNo='" . $rec->invoiceNo . "',
                                                extRefNo='" . $rec->extRefNo . "',
                                                posting_group_id='" . $rec->posting_group_id . "',
                                                account_id = '" . $account_id . "',
                                                account_no = '" . $account_no . "',
                                                account_name = '" . $account_name . "',
                                                posting_date = '" . $posting_date . "',
                                                ".$posting_dateUnConv."
                                                created_date = '" . current_date . "' ,
                                                currency_id =  '" . $currency_id . "',
                                                debitAmount = '" . $debitAmount . "',
                                                creditAmount = '" . $creditAmount . "',
                                                converted_price =  '" . $calcAmount . "',
                                                converted_currency_id =  '" . $converted_currency_id . "',
                                                convRate =  '" . $convRate . "',
                                                status = 1,
                                                type = '" . $moduleType . "',
                                                transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 2),
                                                user_id =  '" . $this->arrUser['id'] . "',
                                                company_id =  '" . $this->arrUser['company_id'] . "'";
            } else {
                $Sql = "UPDATE opening_balance_bank 
                                        SET
                                                docType = '" . $docType . "',
                                                moduleID = '" . $moduleID . "',
                                                moduleNo='" . $rec->moduleNo . "',
                                                description='" . $rec->description . "',
                                                invoiceNo='" . $rec->invoiceNo . "',
                                                extRefNo='" . $rec->extRefNo . "',
                                                posting_group_id='" . $rec->posting_group_id . "',
                                                account_id = '" . $account_id . "',
                                                account_no = '" . $account_no . "',
                                                account_name = '" . $account_name . "',
                                                posting_date = '" . $posting_date . "',
                                                ".$posting_dateUnConv."
                                                currency_id =  '" . $currency_id . "',
                                                debitAmount = '" . $debitAmount . "',
                                                creditAmount = '" . $creditAmount . "',
                                                converted_price =  '" . $calcAmount . "',
                                                converted_currency_id =  '" . $defaultCurrency . "',
                                                convRate =  '" . $convRate . "'
                                        WHERE id = ".$updateID." ";
            }
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
        }

        $response['ack'] = 1;
        $response['error'] = 'Record Updated Successfully';
        return $response;
    }

    function getOpeningBalanceBank($attr) {

        $Sql = "SELECT * 
                FROM opening_balance_bank 
                WHERE company_id = '" . $this->arrUser['company_id'] . "' AND 
                      status = 1";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['posting_date'] = trim($this->objGeneral->convert_unix_into_date($Row['posting_date']));
                $Row['updateID'] = $Row['id'];
                $Row['docTypesel'] = $Row['docType'];
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        return $response;
    }

    function deleteOpeningBalncBankRec($attr) {
        $id = $attr['id'];

        $Sql = "DELETE FROM opening_balance_bank
                WHERE id = $id and postStatus IS NULL Limit 1";
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

    // opening balance Bank end
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // opening balance GL start

    function addOpeningBalanceGL($attr) {

        $this->objGeneral->mysql_clean($attr);
        // echo "<pre>";
        // print_r($attr['recGL']); exit; 

        foreach ($attr['recGL'] as $rec) {

            $docType = (isset($rec->docTypes->id) && $rec->docTypes->id != '') ? $rec->docTypes->id : 0;
            $debitAmount = (isset($rec->debitAmount) && $rec->debitAmount != '') ? Round($rec->debitAmount,2) : 0;
            $creditAmount = (isset($rec->creditAmount) && $rec->creditAmount != '') ? Round($rec->creditAmount,2) : 0;
            $calcAmount = (isset($rec->calcAmount) && $rec->calcAmount != '') ? Round($rec->calcAmount,2) : 0;
            $currency_id = (isset($rec->currencyID->id) && $rec->currencyID->id != '') ? $rec->currencyID->id : 0;
            $posting_date = $this->objGeneral->convert_date($rec->posting_date);
            $convRate = (isset($rec->convRate) && $rec->convRate != '') ? Round($rec->convRate,5) : 0;
            $account_id = (isset($rec->account_id) && $rec->account_id != '') ? $rec->account_id : 0;
            $invoiceNoLength = strlen($rec->invoiceNo);

            if (!($currency_id > 0)) {
                $response['ack'] = 0;
                $response['error'] = '' . $rec->description . '(' . $rec->moduleNo . ') Account Currency is missing!';
                return $response;
                exit;
            } elseif (!($account_id > 0)) {
                $response['ack'] = 0;
                $response['error'] = 'GL Account is missing!';
                return $response;
                exit;
            } elseif (!($invoiceNoLength > 0)) {
                $response['ack'] = 0;
                $response['error'] = '' . $rec->description . '(' . $rec->moduleNo . ') Account Doc No. is empty!';
                return $response;
                exit;
            }  elseif ($convRate == 0) {
                $response['ack'] = 0;
                $response['error'] = '' . $rec->description . '(' . $rec->moduleNo . ') Account Currency Conversion Rate is empty!';
                return $response;
                exit;
            } elseif ($convRate < 0) {
                $response['ack'] = 0;
                $response['error'] = '' . $rec->description . '(' . $rec->moduleNo . ') Account Currency Conversion Rate Can\'t be negative!';
                return $response;
                exit;
            } elseif (!($calcAmount > 0)) {
                $response['ack'] = 0;
                $response['error'] = '' . $rec->description . '(' . $rec->moduleNo . ') Amount in LCY is invalid!';
                return $response;
                exit;
            } elseif (!($posting_date > 0)) {
                $response['ack'] = 0;
                $response['error'] = '' . $rec->description . '(' . $rec->moduleNo . ') Account posting date is not Selected!';
                return $response;
                exit;
            }
        }

        $defaultCurrency = (isset($attr['defaultCurrency']) && $attr['defaultCurrency'] != '') ? $attr['defaultCurrency'] : '0';

        foreach ($attr['recGL'] as $rec) {

            $docType = (isset($rec->docTypes->id) && $rec->docTypes->id != '') ? $rec->docTypes->id : 0;
            $debitAmount = (isset($rec->debitAmount) && $rec->debitAmount != '') ? Round($rec->debitAmount,2) : 0;
            $creditAmount = (isset($rec->creditAmount) && $rec->creditAmount != '') ? Round($rec->creditAmount,2) : 0;
            $calcAmount = (isset($rec->calcAmount) && $rec->calcAmount != '') ? Round($rec->calcAmount,2) : 0;
            $currency_id = (isset($rec->currencyID->id) && $rec->currencyID->id != '') ? $rec->currencyID->id : 0;
            $posting_date = $this->objGeneral->convert_date($rec->posting_date);
            $updateID = (isset($rec->updateID) && $rec->updateID != '') ? $rec->updateID : 0;
            $convRate = (isset($rec->convRate) && $rec->convRate != '') ? Round($rec->convRate,5) : 0;
            $converted_currency_id = (isset($rec->converted_currency_id) && $rec->converted_currency_id != '') ? $rec->converted_currency_id : 0;
            $account_id = (isset($rec->account_id) && $rec->account_id != '') ? $rec->account_id : 0;
            $account_no = (isset($rec->account_no) && $rec->account_no != '') ? $rec->account_no : 0;
            $account_name = (isset($rec->account_name) && $rec->account_name != '') ? $rec->account_name : 0;

            if ($updateID == 0) {
                $Sql = "INSERT INTO  opening_balance_gl 
                                            SET
                                                docType = '" . $docType . "',
                                                moduleNo='" . $rec->moduleNo . "',
                                                description='" . $rec->description . "',
                                                invoiceNo='" . $rec->invoiceNo . "',
                                                extRefNo='" . $rec->extRefNo . "',
                                                account_id = '" . $account_id . "',
                                                account_no = '" . $account_no . "',
                                                account_name = '" . $account_name . "',
                                                posting_date = '" . $posting_date . "',
                                                created_date = '" . current_date . "' ,
                                                currency_id =  '" . $currency_id . "',
                                                debitAmount = '" . $debitAmount . "',
                                                creditAmount = '" . $creditAmount . "',
                                                converted_price =  '" . $calcAmount . "',
                                                converted_currency_id =  '" . $converted_currency_id . "',
                                                convRate =  '" . $convRate . "',
                                                status = 1,
                                                user_id =  '" . $this->arrUser['id'] . "',
                                                company_id =  '" . $this->arrUser['company_id'] . "'";
            } else {
                $Sql = "UPDATE opening_balance_gl 
                                        SET
                                                docType = '" . $docType . "',
                                                moduleNo='" . $rec->moduleNo . "',
                                                description='" . $rec->description . "',
                                                invoiceNo='" . $rec->invoiceNo . "',
                                                extRefNo='" . $rec->extRefNo . "',
                                                account_id = '" . $account_id . "',
                                                account_no = '" . $account_no . "',
                                                account_name = '" . $account_name . "',
                                                posting_date = '" . $posting_date . "',
                                                currency_id =  '" . $currency_id . "',
                                                debitAmount = '" . $debitAmount . "',
                                                creditAmount = '" . $creditAmount . "',
                                                converted_price =  '" . $calcAmount . "',
                                                converted_currency_id =  '" . $converted_currency_id . "',
                                                convRate =  '" . $convRate . "'
                                        WHERE id = ".$updateID." ";
            }
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
        }

        $response['ack'] = 1;
        $response['error'] = 'Record Updated Successfully';
        return $response;
    }

    function getOpeningBalanceGL($attr) {

        $Sql = "SELECT * 
                FROM opening_balance_gl 
                WHERE company_id = '" . $this->arrUser['company_id'] . "'  AND 
                      status = 1";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['posting_date'] = trim($this->objGeneral->convert_unix_into_date($Row['posting_date']));
                $Row['updateID'] = $Row['id'];
                $Row['docTypesel'] = $Row['docType'];
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        return $response;
    }

    function deleteOpeningBalncGLRec($attr) {
        $id = $attr['id'];

        $Sql = "DELETE FROM opening_balance_gl
                WHERE id = $id and postStatus IS NULL Limit 1";
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

    // opening balance GL end
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    function postOpeningBalance($attr) {

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


        $sub_module_type = $attr['sub_module_type'];

        if ($sub_module_type > 0) {

            if ($sub_module_type == 1) {

                $resposeArr = $this->addOpeningBalanceBank($attr);
            } elseif ($sub_module_type == 2) {

                $resposeArr = $this->addOpeningBalanceStock($attr);
            } elseif ($sub_module_type == 3) {

                $resposeArr = $this->addOpeningBalanceCustomer($attr);
            } elseif ($sub_module_type == 4) {

                $resposeArr = $this->addOpeningBalanceSupplier($attr);
            } elseif ($sub_module_type == 5) {

                $resposeArr = $this->addOpeningBalanceGL($attr);
            }
            // echo "<pre>";
            // print_r($resposeArr['error']);
            // exit;
            if ($resposeArr['ack'] > 0) {

                $Sql = "CALL SR_postOpeningBalance(" . $sub_module_type . ",
                                                   " . $this->arrUser['company_id'] . ",
                                                   " . $this->arrUser['id'] . ",
                                                        @errorNo,
                                                        @param1,
                                                        @param2,
                                                        @param3,
                                                        @param4);";
                // echo $Sql;
                // exit;
                $RS = $this->objsetup->CSI($Sql);

                if($RS->msg == 1)
                {             
                    $response['ack'] = 1;
                    $response['error'] = NULL;
                    $this->Conn->commitTrans();
                    $this->Conn->autoCommit = true;
                    
                    $srLogTrace = array();

                    $srLogTrace['ErrorCode'] = '';
                    $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
                    $srLogTrace['Function'] = __FUNCTION__;
                    $srLogTrace['CLASS'] = __CLASS__;
                    $srLogTrace['Parameter1'] = 'id:'.$attr['id'];
                    $srLogTrace['ErrorMessage'] = '';

                    $this->objsetup->SRTraceLogsPHP($srLogTrace);

                    return $response;
                    // $this->objsetup->terminateWithMessage("postPurchaseInvoice");
                } 
                else
                { 
                    $response['ack'] = 0;
                    $response['error'] = $RS->Error;
                }

               /*  mysqli_free_result($RS);
                $response['ack'] = 1; */
            } else {
                $response['ack'] = 0;
                $response['error'] = $resposeArr['error'];
            }
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Module Type is missing!';
        }
        return $response;
    }

    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // opening balance Posting Start
    // opening balance Posting end
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    function add_gl_journal_receipt_single($attr) {
        // print_r($attr);exit;
        $item = $attr['item'];
        $converted_price = ($item->converted_price != '') ? $item->converted_price : '0';
        $debit_amount = ($item->debit_amount != '') ? $item->debit_amount : 'NULL';
        $credit_amount = ($item->credit_amount != '') ? $item->credit_amount : 'NULL';
        $transaction_type = ($item->transaction_type != '') ? $item->transaction_type : '0';
        $document_type = ($item->document_type != '') ? $item->document_type : '0';
        $account_id = ($item->account_id != '') ? $item->account_id : '0';
        $posting_group_id = ($item->posting_group_id != '') ? $item->posting_group_id : '0';

        $currency_id = ($item->currency_id != '' && $item->currency_id->id != "") ? $item->currency_id->id : '0';
        $balancing_account_id = ($item->balancing_account_id != '') ? $item->balancing_account_id : '0';
        $cnv_rate = ($item->cnv_rate != '') ? $item->cnv_rate : '0';
        $posting_date = $this->objGeneral->convert_date($item->posting_date);
        $id = (isset($item->id) && $item->id != '') ? $item->id : '0';


        $document_no = addslashes($item->document_no);
        $account_no = addslashes($item->account_no);
        $account_name = addslashes($item->account_name);
        $balancing_account_code = addslashes($item->balancing_account_code);
        $balancing_account_name = addslashes($item->balancing_account_name);

        if ($id == 0) {
            $Sql = "INSERT INTO payment_details
                        (parent_id,
                        transaction_type,
                        document_type,
                        document_no,
                        company_id,
                        user_id,
                        account_id,
                        account_no,
                        account_name,
                        posting_date,
                        created_date,
                        currency_id,
                        posting_group_id,
                        debit_amount,
                        credit_amount,
                        converted_price,
                        cnv_rate,
                        balancing_account_id,
                        balancing_account_code,
                        balancing_account_name,
                        status)
                    SELECT
                        \"".$attr['parent_id']."\",
                         ".$transaction_type.",
                         ".$document_type.",
                         \"".$document_no."\",
                         " . $this->arrUser['company_id'] . ",
                         " . $this->arrUser['id'] . ",
                         ".$account_id.",
                         \"".$account_no."\",
                         \"".$account_name."\",
                         \"".$posting_date."\",
                        UNIX_TIMESTAMP (NOW()) ,
                         " . $currency_id . ",
                         " . $posting_group_id . ",
                         ".$debit_amount.",
                         ".$credit_amount.",
                         ".$converted_price.",
                         ".$cnv_rate.",
                          ".$balancing_account_id.",
                        \"".$balancing_account_code."\",
                        \"".$balancing_account_name."\",
                        1
                    FROM widgetone    
                    WHERE
                        (SELECT type FROM gl_journal_receipt AS gjr WHERE gjr.id=".$attr['parent_id']." LIMIT 1) = 1 
                    LIMIT 1";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
            $updated = $id;
        } else {
            $Sql = "UPDATE payment_details SET
                        transaction_type =  ".$transaction_type.",
                        document_type =  ".$document_type.",
                        document_no =  '" . addslashes($item->document_no) . "',
                        account_id =  ".$account_id.",
                        account_no =  '" . addslashes($item->account_no) . "',
                        account_name =  '" . addslashes($item->account_name) . "',
                        posting_date =  '" . $posting_date . "',
                        currency_id =  " . $currency_id . ",
                        posting_group_id =  " . $posting_group_id . ",
                        debit_amount =  ".$debit_amount.",
                        credit_amount =  ".$credit_amount.",
                        converted_price =  ".$converted_price.",
                        cnv_rate =  ".$cnv_rate.",
                        balancing_account_id =   ".$balancing_account_id.",
                        balancing_account_code = '" . addslashes($item->balancing_account_code) . "',
                        balancing_account_name = '" . addslashes($item->balancing_account_name) . "'
                        
                        WHERE id = ".$id." AND company_id=" . $this->arrUser['company_id'] . " AND
                        (SELECT type FROM gl_journal_receipt AS gjr WHERE gjr.id=".$attr['parent_id']." LIMIT 1) = 1";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $updated = $this->Conn->Affected_Rows();
            $updated = $id;
        }

        if($updated > 0)
        {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = 'Record Updated Successfully';
        }
        else
        {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_gl_journal_receipt_item($attr) {
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
        // print_r($attr['selectdata']);exit;
        foreach ($attr['selectdata'] as $item) {
            $qty = ($item->qty != '') ? $item->qty : '0';
            $transaction_type = ($item->module_type != '') ? $item->module_type->value : '0';

            $posting_date = $this->objGeneral->convert_date($item->posting_date);

            $date_receivedUnConv = ""; 

            if($item->posting_date > 0){
                $date_receivedUnConv = "date_receivedUnConv = '" . $this->objGeneral->convertUnixDateIntoConvDate($item->posting_date) . "',";            
            }

            $item_id = ($item->item_id != '') ? $item->item_id : '0';
            $qty = ($item->qty != '') ? $item->qty : '0';
            $uom = ($item->uom != '' && $item->uom->unit_id != "") ? $item->uom->unit_id : '0';
            $uom_name = ($item->uom != '') ? $item->uom->name : '';
            $warehouse = ($item->warehouse != '' && $item->warehouse->id != "") ? $item->warehouse->id : '0';
            $warehouse_name = ($item->warehouse != '') ? addslashes($item->warehouse->name) : '';
            $location = ($item->location != '' && $item->location->id != "") ? $item->location->id : '0';

            $cost_per_unit = ($item->cost_per_unit != '') ? $item->cost_per_unit : '0';
            $costing_method_id = ($item->costing_method_id != '') ? $item->costing_method_id : '0';
            $amount = ($item->amount != '') ? $item->amount : '0';
            $balancing_account_id = ($item->balancing_account_id != '') ? $item->balancing_account_id : '0';
            $id = (isset($item->id) && $item->id != '') ? $item->id : '0';
            $stock_check = (isset($item->stock_check) && $item->stock_check != '') ? $item->stock_check : '0';
            $item_name = addslashes($item->item_name);

            $balancing_account_code = addslashes($item->balancing_account_code);
            $balancing_account_name = addslashes($item->balancing_account_name);

            if ($id == 0) {
                $Sql = "INSERT INTO item_journal_details
                            (parent_id,
                            posting_date,
                            transaction_type,
                            item_id,
                            item_code,
                            item_name,
                            stock_check,
                            qty,
                            costing_method_id,
                            uom,
                            uom_name,
                            warehouse,
                            warehouse_name,
                            location,
                            cost_per_unit,
                            amount,
                            balancing_account_id,
                            balancing_account_code,
                            balancing_account_name,
                            company_id,
                            user_id,
                            status)
                    SELECT 
                        \"$attr[parent_id]\",
                        \"$posting_date\",
                        $transaction_type,
                        \"$item_id\",
                        \"$item->item_code\",
                        \"$item_name\",
                        $stock_check,
                        $qty,
                        $costing_method_id,
                        $uom,
                        \"$uom_name\",
                        $warehouse,
                        \"$warehouse_name\",
                        $location,
                        $cost_per_unit,
                        $amount,
                        $balancing_account_id,
                        \"$balancing_account_code\",
                        \"$balancing_account_name\",
                        " . $this->arrUser['company_id'] . ",
                        " . $this->arrUser['id'] . ",
                        1
                    FROM widgetone
                    WHERE
                        (SELECT type FROM gl_journal_receipt AS gjr WHERE gjr.id=$attr[parent_id] LIMIT 1) = 1 LIMIT 1";
            } else {
                $Sql = "UPDATE item_journal_details SET
                            posting_date    =  '" . $posting_date . "',
                            transaction_type=  $transaction_type,
                            item_id         = $item_id,
                            item_code       = '$item->item_code',
                            item_name       = '" . addslashes($item->item_name) . "',
                            stock_check     =  $stock_check,
                            qty             =  $qty,
                            uom_name        = '$uom_name',
                            warehouse       = $warehouse,
                            warehouse_name  = '" . addslashes($warehouse_name) . "',
                            location        = $location,
                            cost_per_unit   = $cost_per_unit,
                            amount          = $amount,
                            balancing_account_id =   $balancing_account_id,
                            balancing_account_code = '$item->balancing_account_code',
                            balancing_account_name ='" . addslashes($item->balancing_account_name)."'
                            WHERE id = $id AND status = 1 AND
                            (SELECT type FROM gl_journal_receipt AS gjr WHERE gjr.id=$attr[parent_id] LIMIT 1) = 1 
                                AND company_id = " . $this->arrUser['company_id']." LIMIT 1";
            }
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($id == 0)  $id = $this->Conn->Insert_ID();
        }

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
        $srLogTrace['Parameter2'] = 'parent_id:' . $attr['parent_id'];
        $srLogTrace['Parameter3'] = 'id:' . $id;
        $srLogTrace['ErrorMessage'] = '';

        $this->objsetup->SRTraceLogsPHP($srLogTrace);
        return $response;
    }

    function add_gl_journal_receipt_item_single($attr) {
        // print_r($attr['selectdata']);exit;
        $item = $attr['item'];
        {
            $qty = ($item->qty != '') ? $item->qty : '0';
            $transaction_type = ($item->module_type != '') ? $item->module_type->value : '0';

            $posting_date = $this->objGeneral->convert_date($item->posting_date);
            $item_id = ($item->item_id != '') ? $item->item_id : '0';
            $qty = ($item->qty != '') ? $item->qty : '0';
            $uom = ($item->uom != '' && $item->uom->unit_id != "") ? $item->uom->unit_id : '0';
            $uom_name = ($item->uom != '') ? $item->uom->name : '';
            $warehouse = ($item->warehouse != '' && $item->warehouse->id != "") ? $item->warehouse->id : '0';
            $warehouse_name = ($item->warehouse != '') ? $item->warehouse->name : '';
            $location = ($item->location != '' && $item->location->id != "") ? $item->location->id : '0';
            
            $cost_per_unit = ($item->cost_per_unit != '') ? $item->cost_per_unit : '0';
            $costing_method_id = ($item->costing_method_id != '') ? $item->costing_method_id : '0';
            $amount = ($item->amount != '') ? $item->amount : '0';
            $balancing_account_id = ($item->balancing_account_id != '') ? $item->balancing_account_id : '0';
            $id = (isset($item->id) && $item->id != '') ? $item->id : '0';
            $stock_check = (isset($item->stock_check) && $item->stock_check != '') ? $item->stock_check : '0';

            if ($id == 0) {
                $Sql = "INSERT INTO  item_journal_details SET
                            parent_id       = '" . $attr['parent_id'] . "',
                            posting_date    =  '" . $posting_date . "',
                            transaction_type=  $transaction_type,
                            item_id         = $item_id,
                            item_code       = '$item->item_code',
                            item_name       = '" . addslashes($item->item_name) . "',
                            qty             =  $qty,
                            costing_method_id= $costing_method_id,
                            uom             = $uom,
                            uom_name        = '$uom_name',
                            warehouse       = $warehouse,
                            warehouse_name  = '" . addslashes($warehouse_name) . "',
                            location        = $location,
                            cost_per_unit   = $cost_per_unit,
                            amount          = $amount,
                            stock_check     = $stock_check,
                            balancing_account_id =   $balancing_account_id,
                            balancing_account_code = '$item->balancing_account_code',
                            balancing_account_name = '$item->balancing_account_name',
                            company_id =  " . $this->arrUser['company_id'] . ",
                            user_id =  " . $this->arrUser['id'] . ",
                            status = 1";
                $RS = $this->objsetup->CSI($Sql);
                $id = $this->Conn->Insert_ID();
            } else {
                $Sql = "UPDATE item_journal_details SET
                            posting_date    =  '" . $posting_date . "',
                            transaction_type=  $transaction_type,
                            item_id         = $item_id,
                            item_code       = '$item->item_code',
                            item_name       = '" . addslashes($item->item_name) . "',
                            qty             =  $qty,
                            uom_name        = '$uom_name',
                            warehouse       = $warehouse,
                            warehouse_name  = '" . addslashes($warehouse_name) . "',
                            location        = $location,
                            cost_per_unit   = $cost_per_unit,
                            amount          = $amount,
                            stock_check     = $stock_check,
                            balancing_account_id =   $balancing_account_id,
                            balancing_account_code = '$item->balancing_account_code',
                            balancing_account_name = '$item->balancing_account_name'
                            WHERE id = $id";
                $RS = $this->objsetup->CSI($Sql);
            }
            // echo $Sql;exit;
        }

        if($transaction_type == 1){
            $attr['warehouses_id'] = $warehouse;
            $attr['product_id'] = $item_id;
            $attr['order_id'] = $attr['parent_id'];
            $attr['type_id'] = 3;
            $attr['orderLineID'] = $id;

            $response['stockAlloc'] = $this->getPurchaseStockAllocation($attr);
        }

        $response['ack'] = 1;
        $response['id'] = $id;
        $response['error'] = 'Record Updated Successfully';
        return $response;
    }

    function getPurchaseStockAllocation($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $where_clause = "";
        $response = array();
        if (!empty($attr['purchase_return_status']))
            $where_clause .= " AND c.purchase_return_status = 1 ";
        else
            $where_clause .= " AND c.purchase_return_status = 0 ";

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
                       c.item_journal_detail_id='" . $attr['orderLineID'] . "' and
                       w.id = '" . $attr['warehouses_id'] . "'and
                       c.status=1 and 
                       c.type='" . $attr['type_id'] . "' AND
                       c.ledger_type = 1 AND 
                       c.journal_status = 1  
                       " . $where_clause . " AND
                       c.company_id=" . $this->arrUser['company_id'] . "
                order by c.id ASC ";

        // echo $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql);
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
                $result['item_trace_unique_id'] = $Row['item_trace_unique_id'];

                $result['prod_date'] = $this->objGeneral->convert_unix_into_date($Row['prod_date']);
                $result['date_received'] = $this->objGeneral->convert_unix_into_date($Row['date_received']);
                $result['use_by_date'] = $this->objGeneral->convert_unix_into_date($Row['use_by_date']);
                $result['quantity'] = $Row['quantity'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            // $response['ack'] = 0;
            $response['response'] = array();
        }


        if (!empty($attr['purchase_return_status'])) {

            $sql_total_purchase_return = "SELECT  sum(quantity) as total  
                                          From warehouse_allocation  c 
                                          where  c.product_id=".$attr['product_id']."  and  
                                                 c.status=1 and 
                                                 c.type=1 and
                                                 c.order_id=".$attr['order_id']." and 
                                                 c.warehouse_id=".$attr['warehouses_id']." and
                                                 c.purchase_return_status = 1  and 
                                                 c.company_id=" . $this->arrUser['company_id'] . " ";

            $rs_count_pr = $this->objsetup->CSI($sql_total_purchase_return);
            $response['total_pr'] = $rs_count_pr->fields['total'];

        }
        $sql_total = "SELECT  sum(quantity) as total  
                        From warehouse_allocation  c 
                        where  c.product_id=".$attr['product_id']."  and  
                               c.status=1 and 
                               c.type=3  AND
                                c.ledger_type = 1 AND 
                                c.journal_status = 1  AND
                               c.order_id=".$attr['order_id']." and 
                               c.item_journal_detail_id='" . $attr['orderLineID'] . "' and
                               c.warehouse_id=".$attr['warehouses_id']." AND
                               c.company_id=" . $this->arrUser['company_id'] . " ";

        $rs_count = $this->objsetup->CSI($sql_total);
        $response['total'] = $rs_count->fields['total'];

        return $response;
    }

    function delete_payment_detail($attr) {

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $Sql = "SELECT transaction_type FROM payment_details WHERE id = ".$attr['id'].";";
        $RS = $this->objsetup->CSI($Sql);
        $typeId = $RS->fields['transaction_type'];
        $moduleName = "";
        if ($typeId == 1) {
            $moduleName = "general";
        } else if ($typeId == 2) {
            $moduleName = "customer";
        } else if ($typeId == 3) {
            $moduleName = "supplier";
        }

        $moduleName .= "_journal";
        // echo $moduleName;exit;
        // delete allocated payment
        $Sql1 = "UPDATE payment_details AS o SET temp_allocated_amount = temp_allocated_amount - (SELECT IFNULL(SUM(pa.`amount_allocated`),0) FROM `payment_allocation` AS pa
                WHERE pa.`payment_detail_id`=".$attr['id']." AND (pa.invoice_type = 5 OR pa.invoice_type = 6))
                WHERE o.company_id = " . $this->arrUser['company_id'] . " AND o.id IN(SELECT pa.`invoice_id` FROM `payment_allocation` AS pa
                WHERE pa.`payment_detail_id`=".$attr['id']." AND (pa.invoice_type = 5 OR pa.invoice_type = 6))";
        // echo $Sql1;exit;
        // $RS1 = $this->objsetup->CSI($Sql1);
        // if ($typeId)
        $RS1 = $this->objsetup->CSI($Sql1, $moduleName, sr_EditPermission);

        // delete allocation entries
        $Sql2 = "DELETE FROM payment_allocation WHERE payment_detail_id = ".$attr['id']." AND (invoice_type = 5 OR invoice_type = 6) AND company_id = " . $this->arrUser['company_id'];
        // echo $Sql2;exit;
        $RS2 = $this->objsetup->CSI($Sql2);

        // delete payment details row
        $Sql3 = "DELETE FROM payment_details WHERE id = ".$attr['id']." AND company_id = " . $this->arrUser['company_id'] . " Limit 1";
        // echo $Sql;exit;
        $RS3 = $this->objsetup->CSI($Sql3);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        return $response;
    }

    function delete_item_journal_details($attr) {

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $Sql = "DELETE FROM item_journal_details	WHERE id = ".$attr['id']." Limit 1";
        // echo $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "item_journal", sr_EditPermission);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $delete_Sql = "DELETE FROM warehouse_allocation WHERE item_journal_detail_id = ".$attr['id']." AND type = 3";
            $RS = $this->objsetup->CSI($delete_Sql);

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        return $response;
    }

    //Customer /Supplier cart

    function CalculateCustomerBalance($id) {
        $this->objGeneral->mysql_clean($attr);
        //IFNULL(SR_CalculateCustomerBalance($id, " . $this->arrUser['company_id'] . "), 0) AS customer_balance

        $upToDate = date("Y-m-d"); 

        $Sql = "SELECT IFNULL(SR_rep_aged_cust_sum(".$id.",DATE_SUB('".$upToDate."', INTERVAL 14600 DAY),DATE_ADD('".$upToDate."', INTERVAL 14600 DAY)," . $this->arrUser['company_id'] . ",'LCY_total',2,'',DATE_ADD('".$upToDate."', INTERVAL 14600 DAY)), 0) AS customer_balance";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        
        return $RS->fields['customer_balance'];
    }

    function CalculateCustomerBalanceInActualCurrency($id) {
        $this->objGeneral->mysql_clean($attr);
        $upToDate = date("Y-m-d"); 

        $Sql = "SELECT IFNULL(sr_getCustomerBalanceInActualCurrency('".$upToDate."'," . $this->arrUser['company_id'] . ",".$id."), 0) AS balanceInCustomerCurrency";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        
        return $RS->fields['balanceInCustomerCurrency'];
    }

    function CalculateCustAvgPaymentDays($id) {
        $this->objGeneral->mysql_clean($attr);

        $upToDate = date("Y-m-d"); 

        $Sql = "SELECT IFNULL(SR_Payment_Days_Avg(".$id.",DATE_SUB('".$upToDate."', INTERVAL 14600 DAY),'".$upToDate."'," . $this->arrUser['company_id'] . ",1), 0) AS custAvgPaymentDays";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        
        return $RS->fields['custAvgPaymentDays'];
    }

    function get_gl_journal_receipt_payment($attr) {
        /* $Sql = "SELECT  c.*, 
          CASE  WHEN c.tran_type = 1 THEN 'Credit'
          WHEN c.tran_type = 2 THEN 'Debit'
          END AS transaction,
          IFNULL(( SELECT sum(wa.amount)
          FROM gl_journal_receipt_person as wa
          WHERE wa.cust_id=$attr[cust_id]  $where2 ),0) as allocated
          FROM  gl_journal_receipt_detail c
          JOIN company on company.id=c.company_id
          where  (c.company_id=" . $this->arrUser['company_id'] . " or
          company.parent_id=" . $this->arrUser['company_id'] . ")  AND
          c.module_type=$attr[module_type] And
          c.account_id=$attr[cust_id]  and
          c.status=1 $where "; */
        $Sql = "SELECT  
                    o.id AS order_id,
                    o.posting_date, 
                    'Sales Invoice' AS docType,
                    o.sale_invioce_code AS invoice_code,
                    o.sell_to_cust_no,
                    o.sale_person,
                    '-' sale_person_2,
                    o.sale_order_code AS order_code,
                    o.cust_order_no,
                    cur.code AS currency_code,
                    o.ship_to_name,
                    o.grand_total,
                    o.grand_total_converted, 
                    o.tax_amount,
                    (o.grand_total - o.tax_amount) AS amount_without_vat,
                    o.remaining_amount,
                    gat.`gl_account_code`,
                    o.due_date,                    
                    o.bill_to_finance_charges,
                    o.bill_to_insurance_charges,
                    o.on_hold,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE gat.AddedBy = emp.id) AS posted_by,
                    o.transaction_id AS entry_no,
		            gat.AddedOn AS posted_on,                    
		            '-' AS debitAmount,
		            '-' AS creditAmount,
                    '-' AS externalRefNo,
		            '-' AS customerName,
                    '-' AS detail_id

                    FROM orders AS o, gl_account_txn AS gat, currency as cur
                    WHERE 
                        gat.object_id = o.id AND
                        o.sell_to_cust_id = $attr[cust_id] AND
                        o.company_id = " . $this->arrUser['company_id'] . " AND
                        o.type IN (2,3) AND 
                        gat.type = 1 AND
                        o.currency_id = cur.id AND
                        gat.`gl_account_id` = (SELECT isetup.salesAccountDebators
                                                FROM inventory_setup AS isetup, gl_account AS ga
                                                WHERE 
                                                    ga.id = isetup.salesAccountDebators AND
                                                    isetup.postingGroup = o.`bill_to_posting_group_id` AND
                                                    isetup.type = 1 AND
                                                    isetup.company_id = " . $this->arrUser['company_id'] . "
                                                LIMIT 1)
                    
                UNION
                    SELECT
                    ro.id AS order_id,
                    ro.posting_date, 
                    'Credit Note' AS docType,
                    ro.return_invoice_code AS invoice_code,
                    ro.sell_to_cust_no,
                    ro.sale_person,
                    '-' sale_person_2,
                    ro.return_order_code AS order_code,
                    '-' AS cust_order_no,
                    cur.code AS currency_code,
                    ro.ship_to_name,
                    ro.grand_total,
                    ro.grand_total_converted, 
                    ro.tax_amount,
                    (ro.grand_total - ro.tax_amount) AS amount_without_vat,
                    ro.remaining_amount,
                    gat.`gl_account_code`,
                    ro.due_date,                    
                    ro.bill_to_finance_charges_name,
                    ro.bill_to_insurance_charges_name,
                    ro.on_hold,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE gat.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            gat.AddedOn AS posted_on,                    
		            '-' AS debitAmount,
		            '-' AS creditAmount,
                    '-' AS externalRefNo,
		            '-' AS customerName,
                    '-' AS detail_id

                    FROM return_orders AS ro, gl_account_txn AS gat, currency as cur
                    WHERE 
                        gat.object_id = ro.id AND
                        ro.sell_to_cust_id = $attr[cust_id] AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.type IN (2,3) AND 
                        gat.type = 2 AND
                        ro.currency_id = cur.id AND
                        gat.`gl_account_id` = (SELECT isetup.salesAccountDebators
                                                FROM inventory_setup AS isetup, gl_account AS ga
                                                WHERE 
                                                    ga.id = isetup.salesAccountDebators AND
                                                    isetup.postingGroup = ro.`bill_to_posting_group_id` AND
                                                    isetup.type = 1 AND
                                                    isetup.company_id = " . $this->arrUser['company_id'] . "
                                                LIMIT 1)
                UNION
                    SELECT
                    ro.id AS order_id,
                    pd.posting_date, 
                    'Customer Payment' AS docType,
                    pd.document_no AS invoice_code,
                    pd.account_no as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    NULL AS cust_order_no,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount
                    END ) AS grand_total,
                    pd.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    NULL AS amount_without_vat,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                    END ) AS remaining_amount,
                    pd.`balancing_account_code` AS gl_account_code,
                    NULL AS due_date,                    
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    pd.on_hold,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE pd.user_id = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            pd.posting_date AS posted_on,                    
		            NULL AS debitAmount,
		            NULL AS creditAmount,
                    NULL AS externalRefNo,
		            NULL AS customerName,
                    pd.id AS detail_id
                    FROM gl_journal_receipt AS ro, payment_details as pd,  currency as cur
                    WHERE 
                        pd.account_id = $attr[cust_id] AND
                        pd.company_id = " . $this->arrUser['company_id'] . " AND
                        pd.parent_id = ro.id AND
                        pd.document_type = 2 AND
                        pd.transaction_type = 2 AND
                        pd.currency_id = cur.id

                UNION
                    SELECT
                    ro.id AS order_id,
                    pd.posting_date, 
                    'Customer Refund' AS docType,
                    pd.document_no AS invoice_code,
                    pd.account_no as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    NULL AS cust_order_no,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount
                    END ) AS grand_total,
                    pd.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    NULL AS amount_without_vat,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                    END ) AS remaining_amount,
                    pd.`balancing_account_code` AS gl_account_code,
                    NULL AS due_date,                    
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    pd.on_hold,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE pd.user_id = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            pd.posting_date AS posted_on,                    
		            NULL AS debitAmount,
		            NULL AS creditAmount,
                    NULL AS externalRefNo,
		            NULL AS customerName,
                    pd.id AS detail_id
                    FROM gl_journal_receipt AS ro, payment_details as pd,  currency as cur
                    WHERE 
                        pd.account_id = $attr[cust_id] AND
                        pd.company_id = " . $this->arrUser['company_id'] . " AND
                        pd.parent_id = ro.id AND
                        pd.document_type = 3 AND
                        pd.transaction_type = 2 AND
                        pd.currency_id = cur.id
                UNION 
                    SELECT
                    ro.id AS order_id,
                    op.posting_date, 
                    'Bank Opening Balance' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    NULL AS cust_order_no,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    NULL as grand_total,
                    op.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    NULL AS amount_without_vat,
                    op.converted_price AS remaining_amount,
                    ro.gl_account_code AS gl_account_code,
                    NULL AS due_date,                    
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    op.on_hold,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    op.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
                    op.extRefNo AS externalRefNo,
		            op.description AS customerName,
                    op.id AS detail_id
                    FROM gl_account_txn AS ro, opening_balance_bank as op,currency as cur,financial_settings as fs
                    WHERE 
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.gl_account_id = fs.opening_balance_gl_account AND
                        op.id = ro.object_id AND
                        ro.type = 6 AND
                        op.type = 1 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                UNION
                    SELECT
                    ro.id AS order_id,
                    op.posting_date, 
                    'Opening Balance' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    NULL AS cust_order_no,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    NULL as grand_total,
                    op.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    NULL AS amount_without_vat,
                    op.converted_price AS remaining_amount,
                    ro.gl_account_code AS gl_account_code,
                    NULL AS due_date,                    
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    op.on_hold,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    op.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
                    op.extRefNo AS externalRefNo,
		            op.description AS customerName,
                    op.id AS detail_id
                    FROM gl_account_txn AS ro, opening_balance_customer as op,currency as cur,financial_settings as fs
                    WHERE 
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.gl_account_id = fs.opening_balance_gl_account AND
                        op.id = ro.object_id AND
                        ro.type = 8 AND
                        op.type = 1 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id

                    ORDER BY posted_on ASC;                    
                    ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                // $amount_without_vat = floatval ($Row['grand_total']) - floatval ($Row['tax_amount']);
                // $Row['amount_without_vat'] = $amount_without_vat;
                $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $Row['due_date'] = $this->objGeneral->convert_unix_into_date($Row['due_date']);
                $Row['opened_closed'] = (floatval ($Row['remaining_amount']) != 0) ? 'Yes' : 'No';
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function getCustomerActivityPortal($attr) {

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        if(isset($attr['selCust'])){

            $key = hash('sha256', SECRET_KEY);
            $iv = substr(hash('sha256', SECRET_IV), 0, 16);
            $outputInvName = openssl_decrypt(base64_decode($attr['selCust']), SECRET_METHOD, $key, 0, $iv);
            $fileName = explode(",",$outputInvName);

            $customerID = $fileName[1];

            $Sql = "SELECT c.id as cid,c.customer_code,c.name,c.company_id,
                            company.name as compName,company.url,company.address,
                            company.address_2,company.county,company.postcode,company.telephone,
                            company.fax,company.city,company.logo
                    FROM crm c
                    LEFT JOIN company on company.id = c.company_id
                    WHERE c.type IN (2,3) AND 
                        c.customer_code IS NOT NULL AND 
                        c.name <>'' AND 
                        c.id=" . $customerID. "";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {

                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                            unset($Row[$key]);
                    }

                    $row = array();
                    $attr['cust_id'] = $Row['cid'];
                    $this->arrUser['company_id'] = $Row['company_id'];

                    $attr['compName'] = $Row['compName'];
                    $attr['compURL'] = $Row['url'];
                    $attr['address'] = $Row['address'];
                    $attr['address_2'] = $Row['address_2'];
                    $attr['county'] = $Row['county'];
                    $attr['postcode'] = $Row['postcode'];
                    $attr['telephone'] = $Row['telephone'];
                    $attr['fax'] = $Row['fax'];
                    $attr['city'] = $Row['city'];
                    $attr['logo'] = $Row['logo'];
                }
                $response['customerID'] = $customerID;
            } else {
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['response'][] = array();
                return $response;
            }
        }
        else{
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
            return $response;
        }

        $response['compName'] = $attr['compName'];
        $response['compURL'] = $attr['compURL'];
        $response['address'] = $attr['address'];
        $response['address_2'] = $attr['address_2'];
        $response['county'] = $attr['county'];
        $response['postcode'] = $attr['postcode'];
        $response['telephone'] = $attr['telephone'];
        $response['fax'] = $attr['fax'];
        $response['city'] = $attr['city'];
        $response['logo'] = $attr['logo'];  

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);
        $Sql = "select * FROM (SELECT  
                    o.id AS order_id,
                    o.sell_to_cust_name AS customer_name,
                    o.posting_date,
                    o.posting_dateUnConv as posting_date2, 
                    'Sales Invoice' AS docType,
                    o.sale_invioce_code AS invoice_code,
                    o.sell_to_cust_no,
                    o.sale_person,
                    NULL sale_person_2,
                    o.sale_order_code AS order_code,
                    o.cust_order_no,
                    o.currency_id,
                    o.currency_rate,
                    cur.code AS currency_code,
                    o.ship_to_name,
                    o.grand_total,
                    o.grand_total_converted, 
                    o.tax_amount,
                    o.remaining_amount,
                    o.remaining_amount/o.currency_rate  AS remaining_amount_lcy,
                    (CASE WHEN ROUND(o.remaining_amount, 2) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    (o.grand_total - o.tax_amount) AS amount_without_vat,
                    NULL AS `gl_account_code`,
                    NULL AS `gl_account_name`,
                    UNIX_TIMESTAMP(DATE_ADD(FROM_UNIXTIME(o.posting_date), INTERVAL (COALESCE((SELECT CASE  WHEN pt.days>0 THEN pt.days
																		ELSE 0
																		END AS 'days'
																	FROM payment_terms AS pt
																	WHERE pt.name = o.payment_terms_code AND 
																		pt.company_id = " . $this->arrUser['company_id'] . "
																	limit 1),0)) DAY)) as due_date,                  
                    o.bill_to_finance_charges,
                    o.bill_to_insurance_charges,
                    o.on_hold,
                    (CASE
                        WHEN o.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=o.id AND invoice_type = 1 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    o.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) FROM gl_account_txn as gat WHERE gat.object_id=o.id AND gat.type=1 AND gat.company_id = " . $this->arrUser['company_id'] . ") AS entry_no,
		            o.posted_on,                    
		            NULL AS debitAmount,
		            NULL AS creditAmount,
                    NULL AS externalRefNo,
		            NULL AS customerName,
                    '0' AS detail_id,
                    o.ship_to_city AS shipped_city,
                    o.ship_to_post_code AS shipped_post_code,
                    o.bill_to_posting_group_name AS posting_group,
                    o.sell_to_contact_no AS contact_person,
                    sr_link_so_po(o.id) AS link_to_po

                    FROM orders AS o, currency as cur
                    WHERE 
                        o.sell_to_cust_id = $attr[cust_id] AND
                        o.company_id = " . $this->arrUser['company_id'] . " AND
                        o.type IN (2,3) AND 
                        o.currency_id = cur.id
                    
                UNION
                    SELECT
                    ro.id AS order_id,
                    ro.sell_to_cust_name AS customer_name,
                    ro.posting_date, 
                    ro.posting_dateUnConv as posting_date2, 
                    'Credit Note' AS docType,
                    ro.return_invoice_code AS invoice_code,
                    ro.sell_to_cust_no,
                    ro.sale_person,
                    NULL sale_person_2,
                    ro.return_order_code AS order_code,
                    NULL AS cust_order_no,
                    ro.currency_id,
                    ro.currency_rate,
                    cur.code AS currency_code,
                    ro.ship_to_name,
                    (ro.grand_total * (CASE WHEN ro.grand_total<>0 THEN -1 ELSE 1 END)) AS grand_total,
                    (ro.grand_total_converted * (CASE WHEN ro.grand_total_converted<>0 THEN -1 ELSE 1 END)) AS grand_total_converted, 
                    (ro.tax_amount * (CASE WHEN ro.tax_amount<>0 THEN -1 ELSE 1 END)) AS tax_amount,
                    (ro.remaining_amount * (CASE WHEN ro.remaining_amount<>0 THEN -1 ELSE 1 END)) AS remaining_amount,
                    ((ro.remaining_amount/ro.currency_rate) * (CASE WHEN (ro.remaining_amount/ro.currency_rate)<>0 THEN -1 ELSE 1 END)) AS remaining_amount_lcy,
                    (CASE WHEN ROUND(ro.remaining_amount, 2) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    ((ro.grand_total - ro.tax_amount) * (CASE WHEN (ro.grand_total - ro.tax_amount) > 1 THEN -1 ELSE 1 END)) AS amount_without_vat,
                    NULL AS `gl_account_code`,
                    NULL AS `gl_account_name`,
                    ro.posting_date as due_date,                   
                    ro.bill_to_finance_charges,
                    ro.bill_to_insurance_charges,                    
                    ro.on_hold,
                    (CASE
                        WHEN ro.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=ro.id AND invoice_type = 2 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    ro.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) FROM gl_account_txn as gat WHERE gat.object_id=ro.id AND gat.type= 2 AND gat.company_id = " . $this->arrUser['company_id'] . ") AS entry_no,
		            ro.posted_on,                                    
		            NULL AS debitAmount,
		            NULL AS creditAmount,
                    NULL AS externalRefNo,
		            NULL AS customerName,
                    '0' AS detail_id,
                    ro.ship_to_city AS shipped_city,
                    ro.ship_to_post_code AS shipped_post_code,
                    ro.bill_to_posting_group_name AS posting_group,
                    ro.sell_to_contact_no AS contact_person,
                    NULL AS link_to_po

                    FROM return_orders AS ro,currency as cur
                    WHERE 
                        ro.sell_to_cust_id = $attr[cust_id] AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.type IN (2,3) AND 
                        ro.currency_id = cur.id

                UNION
                    SELECT
                    ro.id AS order_id,
                    pd.account_name AS customer_name,
                    pd.posting_date,  
                    pd.posting_dateUnConv as posting_date2, 
                    (CASE
                        WHEN pd.document_type = 1 THEN
                            'General Journal'
                        ELSE
                            'Customer Payment'
                    END) AS docType,
                    pd.document_no AS invoice_code,
                    pd.account_no as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    NULL AS cust_order_no,
                    pd.currency_id,
                    pd.cnv_rate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    ((CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount
                    END) * (CASE WHEN (CASE
                                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                                        END)<>0 THEN -1 
                            ELSE 1 END)
                    ) AS grand_total,
                    (pd.converted_price * (CASE WHEN pd.converted_price<>0 THEN -1 ELSE 1 END)) as grand_total_converted, 
                    NULL AS tax_amount,
                    ((CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                    END ) * (CASE WHEN (CASE
                                            WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                                            WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                                        END )<>0 THEN -1 
                            ELSE 1 END)
                    ) AS remaining_amount,
                    ((CASE
                        WHEN pd.credit_amount > 0 THEN (pd.credit_amount - allocated_amount)/pd.cnv_rate
                        WHEN pd.debit_amount > 0 THEN (pd.debit_amount - allocated_amount)/pd.cnv_rate
                    END ) * (CASE WHEN (CASE
                                            WHEN pd.credit_amount > 0 THEN (pd.credit_amount - allocated_amount)/pd.cnv_rate
                                            WHEN pd.debit_amount > 0 THEN (pd.debit_amount - allocated_amount)/pd.cnv_rate
                                        END )<>0 THEN -1 
                            ELSE 1 END)
                    ) AS remaining_amount_lcy,
                    (CASE WHEN ((CASE
                                WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                                WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                            END ) 
                            ) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    pd.`balancing_account_code` AS gl_account_code,
                    pd.`balancing_account_name` AS gl_account_name,
                    pd.posting_date AS due_date,                    
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    pd.on_hold,
                    (CASE
                        WHEN pd.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=pd.id AND invoice_type = 5 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    ro.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) 
                        FROM gl_account_txn as gat WHERE 
                            gat.type=5 AND 
                            gat.company_id =" . $this->arrUser['company_id'] . " AND 
                            gat.object_id=ro.id AND
                            gat.ref_id = pd.id AND
                            gat.gl_account_id=pd.balancing_account_id) AS entry_no,
		            ro.posted_on,                    
		            pd.debit_amount AS debitAmount,
		            pd.credit_amount AS creditAmount,
                    NULL AS externalRefNo,
		            NULL AS customerName,
                    pd.id AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = pd.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po

                    FROM gl_journal_receipt AS ro, payment_details as pd,  currency as cur
                    WHERE 
                        pd.account_id = $attr[cust_id] AND
                        pd.company_id = " . $this->arrUser['company_id'] . " AND
                        pd.parent_id = ro.id AND
                        ro.type = 2 AND
                        pd.document_type IN (1,2) AND
                        pd.transaction_type = 2 AND
                        pd.currency_id = cur.id AND 
                        pd.credit_amount > 0

                UNION
                    SELECT
                    ro.id AS order_id,
                    pd.account_name AS customer_name,
                    pd.posting_date,   
                    pd.posting_dateUnConv as posting_date2,
                    (CASE
                        WHEN pd.document_type = 1 THEN
                            'General Journal'
                        ELSE
                            'Customer Refund'
                    END) AS docType, 
                    pd.document_no AS invoice_code,
                    pd.account_no as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    NULL AS cust_order_no,
                    pd.currency_id,
                    pd.cnv_rate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount
                    END ) AS grand_total,
                    pd.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                    END ) AS remaining_amount,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN (pd.credit_amount - allocated_amount)/pd.cnv_rate
                        WHEN pd.debit_amount > 0 THEN (pd.debit_amount - allocated_amount)/pd.cnv_rate
                    END ) AS remaining_amount_lcy,
                    (CASE WHEN (CASE
                                WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                                WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                            END ) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    pd.`balancing_account_code` AS gl_account_code,
                    pd.`balancing_account_name` AS gl_account_name,
                    pd.posting_date AS due_date,                    
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    pd.on_hold,
                    (CASE
                        WHEN pd.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=pd.id AND invoice_type = 5 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    ro.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) 
                        FROM gl_account_txn as gat WHERE 
                            gat.type=5 AND 
                            gat.company_id =" . $this->arrUser['company_id'] . " AND 
                            gat.object_id=ro.id AND
                            gat.ref_id = pd.id AND
                            gat.gl_account_id=pd.balancing_account_id) AS entry_no,
		            ro.posted_on,                                     
		            pd.debit_amount AS debitAmount,
		            pd.credit_amount AS creditAmount,
                    NULL AS externalRefNo,
		            NULL AS customerName,
                    pd.id AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = pd.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po

                    FROM gl_journal_receipt AS ro, payment_details as pd,  currency as cur
                    WHERE 
                        pd.account_id = $attr[cust_id] AND
                        pd.company_id = " . $this->arrUser['company_id'] . " AND
                        pd.parent_id = ro.id AND
                        ro.type = 2 AND
                        pd.document_type IN (1,3) AND
                        pd.transaction_type = 2 AND
                        pd.currency_id = cur.id AND 
                        pd.debit_amount > 0
                UNION
                    SELECT
                    op.id AS order_id,
                    op.description AS customer_name,
                    op.posting_date,  
                    op.posting_dateUnConv as posting_date2,  
                    'Opening Balance Invoice' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    op.extRefNo AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    (CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) AS grand_total,
                    op.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) AS remaining_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) /op.convRate) AS remaining_amount_lcy,
                    (CASE WHEN ((CASE
                                WHEN op.creditAmount > 0 THEN op.creditAmount
                                WHEN op.debitAmount > 0 THEN op.debitAmount
                            END ) - op.allocated_amount) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    UNIX_TIMESTAMP(DATE_ADD(FROM_UNIXTIME(op.posting_date), INTERVAL (COALESCE((SELECT CASE  WHEN pt.days>0 THEN pt.days
																		ELSE 0
																		END AS 'days'
																	FROM finance AS f
																	LEFT JOIN payment_terms AS pt ON f.payment_terms_id = pt.id
																	WHERE f.customer_id = op.moduleID),0)) DAY)) as due_date,
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 6 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
                    op.extRefNo AS externalRefNo,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po

                    FROM gl_account_txn AS ro, opening_balance_customer as op,currency as cur
                    WHERE 
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 8 AND
                        op.type = 1 AND
                        op.docType = 1 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id
                UNION
                    SELECT
                    op.id AS order_id,
                    op.description AS customer_name,
                    op.posting_date, 
                    op.posting_dateUnConv as posting_date2, 
                    'Opening Balance Credit Note' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    op.extRefNo AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) * (CASE WHEN (CASE
                                            WHEN op.creditAmount > 0 THEN op.creditAmount
                                            WHEN op.debitAmount > 0 THEN op.debitAmount
                                        END )<>0 THEN -1 
                            ELSE 1 END)
                    ) AS grand_total,
                    (op.converted_price * (CASE WHEN op.converted_price<>0 THEN -1 ELSE 1 END)) as grand_total_converted, 
                    NULL AS tax_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) * (CASE WHEN ((CASE
                                                                    WHEN op.creditAmount > 0 THEN op.creditAmount
                                                                    WHEN op.debitAmount > 0 THEN op.debitAmount
                                                                END ) - op.allocated_amount)<>0 THEN -1 
                                                    ELSE 1 END)
                    ) AS remaining_amount,
                    ((((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) /op.convRate) * (CASE WHEN (((CASE
                                                                                    WHEN op.creditAmount > 0 THEN op.creditAmount
                                                                                    WHEN op.debitAmount > 0 THEN op.debitAmount
                                                                                END ) - op.allocated_amount) /op.convRate)<>0 THEN -1 
                                                                ELSE 1 END)
                    ) AS remaining_amount_lcy,
                    (CASE  WHEN
                        (((CASE
                            WHEN op.creditAmount > 0 THEN op.creditAmount
                            WHEN op.debitAmount > 0 THEN op.debitAmount
                        END ) - op.allocated_amount)
                        )  > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    op.posting_date AS due_date,
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 6 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
                    op.extRefNo AS externalRefNo,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po


                    FROM gl_account_txn AS ro, opening_balance_customer as op,currency as cur
                    WHERE 
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 8 AND
                        op.type = 1 AND
                        op.docType = 2 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id
                UNION 
                    SELECT
                    op.id AS order_id,
                    op.description AS customer_name,
                    op.posting_date, 
                    op.posting_dateUnConv as posting_date2, 
                    'Bank Opening Balance Payment' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    op.extRefNo AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) * (CASE WHEN (CASE
                                        WHEN op.creditAmount > 0 THEN op.creditAmount
                                        WHEN op.debitAmount > 0 THEN op.debitAmount
                                    END ) > 0 THEN -1 ELSE 1 END)) AS grand_total,
                    op.converted_price * (CASE WHEN op.converted_price > 0 THEN -1 ELSE 1 END) as grand_total_converted, 
                    NULL AS tax_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) * (CASE WHEN ((CASE
                                                            WHEN op.creditAmount > 0 THEN op.creditAmount
                                                            WHEN op.debitAmount > 0 THEN op.debitAmount
                                                        END ) - op.allocated_amount) > 0 THEN -1 ELSE 1 END) 
                    )AS remaining_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount)/op.convRate) * (CASE WHEN (((CASE
                                                                        WHEN op.creditAmount > 0 THEN op.creditAmount
                                                                        WHEN op.debitAmount > 0 THEN op.debitAmount
                                                                    END ) - op.allocated_amount)/op.convRate) > 0 THEN -1 ELSE 1 END)
                    AS remaining_amount_lcy,
                    (CASE WHEN (((CASE
                                WHEN op.creditAmount > 0 THEN op.creditAmount
                                WHEN op.debitAmount > 0 THEN op.debitAmount
                            END ) - op.allocated_amount)) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    op.posting_date AS due_date,              
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 7 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
                    op.extRefNo AS externalRefNo,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po


                    FROM gl_account_txn AS ro, opening_balance_bank as op,currency as cur
                    WHERE
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 6 AND
                        op.type = 1 AND
                        op.docType = 1 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id
                UNION 
                    SELECT
                    op.id AS order_id,
                    op.description AS customer_name,
                    op.posting_date, 
                    op.posting_dateUnConv as posting_date2, 
                    'Bank Opening Balance Refund' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    op.extRefNo AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                     (CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) AS grand_total,
                    op.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) AS remaining_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount)/op.convRate) AS remaining_amount_lcy,
                    (CASE WHEN ((CASE
                                WHEN op.creditAmount > 0 THEN op.creditAmount
                                WHEN op.debitAmount > 0 THEN op.debitAmount
                            END ) - op.allocated_amount) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    op.posting_date AS due_date,
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 7 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
                    op.extRefNo AS externalRefNo,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po


                    FROM gl_account_txn AS ro, opening_balance_bank as op,currency as cur
                    WHERE
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 6 AND
                        op.type = 1 AND
                        op.docType = 2 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id
                    ) as tbl where 1 $where_clause                
                    ";

                    
        // echo $Sql;exit;
        $total_limit = pagination_limit;
        
        if ($order_clause == "")
            $order_type = "Order BY posting_date DESC";
        else
            $order_type = $order_clause;

            // echo $total_limit;exit;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        // $RS = $this->objsetup->CSI($response['q'], 'activity_customer', sr_ViewPermission);
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        $index = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                // $amount_without_vat = floatval ($Row['grand_total']) - floatval ($Row['tax_amount']);
                // $Row['amount_without_vat'] = $amount_without_vat;
                // $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $Row['posting_date'] = date("d/m/Y", strtotime($Row['posting_date2']));
                $Row['due_date'] = $this->objGeneral->convert_unix_into_date($Row['due_date']);
                // $Row['opened_closed'] = (floatval($Row['remaining_amount']) != 0) ? 'Yes' : 'No';
                $Row['on_hold_check'] = (intval($Row['on_hold']) > 0) ? true : false;
                $Row['index'] = $index++;
                $response['response'][] = $Row;
            }
            

            if($response['customer_balance'] == '333333333') 
                $response['customer_balance'] = 0;
        }
        else {
            $response['response'][] = array();
        }

        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("CustomerActivityPortal");
        return $response;
    }


    function get_gl_journal_receipt_payment_customer($attr) {
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);
        $Sql = "select * FROM (SELECT  
                    o.id AS order_id,
                    o.sell_to_cust_name AS customer_name,
                    o.posting_date,
                    o.posting_dateUnConv as posting_date2,
                    o.offer_date AS order_date,
                    o.delivery_date,
                    'Sales Invoice' AS docType,
                    o.sale_invioce_code AS invoice_code,
                    o.sell_to_cust_no,
                    o.sale_person,
                    NULL sale_person_2,
                    o.sale_order_code AS order_code,
                    o.cust_order_no,
                    o.currency_id,
                    o.currency_rate,
                    cur.code AS currency_code,
                    o.ship_to_name,
                    o.grand_total,
                    o.grand_total_converted, 
                    o.tax_amount,
                    o.remaining_amount,
                    o.remaining_amount/o.currency_rate  AS remaining_amount_lcy,
                    (CASE WHEN ROUND(o.remaining_amount, 2) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    (o.grand_total - o.tax_amount) AS amount_without_vat,
                    NULL AS `gl_account_code`,
                    NULL AS `gl_account_name`,
                    UNIX_TIMESTAMP(DATE_ADD(FROM_UNIXTIME(o.posting_date), INTERVAL (COALESCE((SELECT CASE  WHEN pt.days>0 THEN pt.days
																		ELSE 0
																		END AS 'days'
																	FROM payment_terms AS pt
																	WHERE pt.name = o.payment_terms_code AND 
																		pt.company_id = " . $this->arrUser['company_id'] . "
																	limit 1),0)) DAY)) as due_date,                  
                    o.bill_to_finance_charges,
                    o.bill_to_insurance_charges,
                    o.on_hold,
                    (CASE
                        WHEN o.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=o.id AND invoice_type = 1 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    o.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) FROM gl_account_txn as gat WHERE gat.object_id=o.id AND gat.type=1 AND gat.company_id = " . $this->arrUser['company_id'] . ") AS entry_no,
		            o.posted_on,                    
		            NULL AS debitAmount,
		            NULL AS creditAmount,
                    NULL AS externalRefNo,
		            NULL AS customerName,
                    '0' AS detail_id,
                    o.ship_to_city AS shipped_city,
                    o.ship_to_post_code AS shipped_post_code,
                    o.bill_to_posting_group_name AS posting_group,
                    o.sell_to_contact_no AS contact_person,
                    sr_link_so_po(o.id) AS link_to_po

                    FROM orders AS o, currency as cur
                    WHERE 
                        o.sell_to_cust_id = $attr[cust_id] AND
                        o.company_id = " . $this->arrUser['company_id'] . " AND
                        o.type IN (2,3) AND 
                        o.currency_id = cur.id
                    
                UNION
                    SELECT
                    ro.id AS order_id,
                    ro.sell_to_cust_name AS customer_name,
                    ro.posting_date, 
                    ro.posting_dateUnConv as posting_date2, 
                    NULL AS order_date,
                    NULL AS delivery_date,
                    'Credit Note' AS docType,
                    ro.return_invoice_code AS invoice_code,
                    ro.sell_to_cust_no,
                    ro.sale_person,
                    NULL sale_person_2,
                    ro.return_order_code AS order_code,
                    NULL AS cust_order_no,
                    ro.currency_id,
                    ro.currency_rate,
                    cur.code AS currency_code,
                    ro.ship_to_name,
                    (ro.grand_total * (CASE WHEN ro.grand_total<>0 THEN -1 ELSE 1 END)) AS grand_total,
                    (ro.grand_total_converted * (CASE WHEN ro.grand_total_converted<>0 THEN -1 ELSE 1 END)) AS grand_total_converted, 
                    (ro.tax_amount * (CASE WHEN ro.tax_amount<>0 THEN -1 ELSE 1 END)) AS tax_amount,
                    (ro.remaining_amount * (CASE WHEN ro.remaining_amount<>0 THEN -1 ELSE 1 END)) AS remaining_amount,
                    ((ro.remaining_amount/ro.currency_rate) * (CASE WHEN (ro.remaining_amount/ro.currency_rate)<>0 THEN -1 ELSE 1 END)) AS remaining_amount_lcy,
                    (CASE WHEN ROUND(ro.remaining_amount, 2) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    ((ro.grand_total - ro.tax_amount) * (CASE WHEN (ro.grand_total - ro.tax_amount) > 1 THEN -1 ELSE 1 END)) AS amount_without_vat,
                    NULL AS `gl_account_code`,
                    NULL AS `gl_account_name`,
                    ro.posting_date as due_date,                   
                    ro.bill_to_finance_charges,
                    ro.bill_to_insurance_charges,                    
                    ro.on_hold,
                    (CASE
                        WHEN ro.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=ro.id AND invoice_type = 2 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    ro.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) FROM gl_account_txn as gat WHERE gat.object_id=ro.id AND gat.type= 2 AND gat.company_id = " . $this->arrUser['company_id'] . ") AS entry_no,
		            ro.posted_on,                                    
		            NULL AS debitAmount,
		            NULL AS creditAmount,
                    NULL AS externalRefNo,
		            NULL AS customerName,
                    '0' AS detail_id,
                    ro.ship_to_city AS shipped_city,
                    ro.ship_to_post_code AS shipped_post_code,
                    ro.bill_to_posting_group_name AS posting_group,
                    ro.sell_to_contact_no AS contact_person,
                    NULL AS link_to_po

                    FROM return_orders AS ro,currency as cur
                    WHERE 
                        ro.sell_to_cust_id = $attr[cust_id] AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.type IN (2,3) AND 
                        ro.currency_id = cur.id

                UNION
                    SELECT
                    ro.id AS order_id,
                    pd.account_name AS customer_name,
                    pd.posting_date,  
                    pd.posting_dateUnConv as posting_date2, 
                    NULL AS order_date,
                    NULL AS delivery_date,
                    (CASE
                        WHEN pd.document_type = 1 THEN
                            'General Journal'
                        ELSE
                            'Customer Payment'
                    END) AS docType,
                    pd.document_no AS invoice_code,
                    pd.account_no as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    NULL AS cust_order_no,
                    pd.currency_id,
                    pd.cnv_rate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    ((CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount
                    END) * (CASE WHEN (CASE
                                            WHEN pd.credit_amount > 0 THEN pd.credit_amount
                                            WHEN pd.debit_amount > 0 THEN pd.debit_amount
                                        END)<>0 THEN -1 
                            ELSE 1 END)
                    ) AS grand_total,
                    (pd.converted_price * (CASE WHEN pd.converted_price<>0 THEN -1 ELSE 1 END)) as grand_total_converted, 
                    NULL AS tax_amount,
                    ((CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                    END ) * (CASE WHEN (CASE
                                            WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                                            WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                                        END )<>0 THEN -1 
                            ELSE 1 END)
                    ) AS remaining_amount,
                    ((CASE
                        WHEN pd.credit_amount > 0 THEN (pd.credit_amount - allocated_amount)/pd.cnv_rate
                        WHEN pd.debit_amount > 0 THEN (pd.debit_amount - allocated_amount)/pd.cnv_rate
                    END ) * (CASE WHEN (CASE
                                            WHEN pd.credit_amount > 0 THEN (pd.credit_amount - allocated_amount)/pd.cnv_rate
                                            WHEN pd.debit_amount > 0 THEN (pd.debit_amount - allocated_amount)/pd.cnv_rate
                                        END )<>0 THEN -1 
                            ELSE 1 END)
                    ) AS remaining_amount_lcy,
                    (CASE WHEN ((CASE
                                WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                                WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                            END ) 
                            ) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    pd.`balancing_account_code` AS gl_account_code,
                    pd.`balancing_account_name` AS gl_account_name,
                    pd.posting_date AS due_date,                    
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    pd.on_hold,
                    (CASE
                        WHEN pd.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=pd.id AND invoice_type = 5 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    ro.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) 
                        FROM gl_account_txn as gat WHERE 
                            gat.type=5 AND 
                            gat.company_id =" . $this->arrUser['company_id'] . " AND 
                            gat.object_id=ro.id AND
                            gat.ref_id = pd.id AND
                            gat.gl_account_id=pd.balancing_account_id) AS entry_no,
		            ro.posted_on,                    
		            pd.debit_amount AS debitAmount,
		            pd.credit_amount AS creditAmount,
                    NULL AS externalRefNo,
		            NULL AS customerName,
                    pd.id AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = pd.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po

                    FROM gl_journal_receipt AS ro, payment_details as pd,  currency as cur
                    WHERE 
                        pd.account_id = $attr[cust_id] AND
                        pd.company_id = " . $this->arrUser['company_id'] . " AND
                        pd.parent_id = ro.id AND
                        ro.type = 2 AND
                        pd.document_type IN (1,2) AND
                        pd.transaction_type = 2 AND
                        pd.currency_id = cur.id AND 
                        pd.credit_amount > 0

                UNION
                    SELECT
                    ro.id AS order_id,
                    pd.account_name AS customer_name,
                    pd.posting_date,   
                    pd.posting_dateUnConv as posting_date2,
                    NULL AS order_date,
                    NULL AS delivery_date,
                    (CASE
                        WHEN pd.document_type = 1 THEN
                            'General Journal'
                        ELSE
                            'Customer Refund'
                    END) AS docType, 
                    pd.document_no AS invoice_code,
                    pd.account_no as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    NULL AS cust_order_no,
                    pd.currency_id,
                    pd.cnv_rate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount
                    END ) AS grand_total,
                    pd.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                    END ) AS remaining_amount,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN (pd.credit_amount - allocated_amount)/pd.cnv_rate
                        WHEN pd.debit_amount > 0 THEN (pd.debit_amount - allocated_amount)/pd.cnv_rate
                    END ) AS remaining_amount_lcy,
                    (CASE WHEN (CASE
                                WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                                WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                            END ) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    pd.`balancing_account_code` AS gl_account_code,
                    pd.`balancing_account_name` AS gl_account_name,
                    pd.posting_date AS due_date,                    
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    pd.on_hold,
                    (CASE
                        WHEN pd.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=pd.id AND invoice_type = 5 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    ro.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) 
                        FROM gl_account_txn as gat WHERE 
                            gat.type=5 AND 
                            gat.company_id =" . $this->arrUser['company_id'] . " AND 
                            gat.object_id=ro.id AND
                            gat.ref_id = pd.id AND
                            gat.gl_account_id=pd.balancing_account_id) AS entry_no,
		            ro.posted_on,                                     
		            pd.debit_amount AS debitAmount,
		            pd.credit_amount AS creditAmount,
                    NULL AS externalRefNo,
		            NULL AS customerName,
                    pd.id AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = pd.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po

                    FROM gl_journal_receipt AS ro, payment_details as pd,  currency as cur
                    WHERE 
                        pd.account_id = $attr[cust_id] AND
                        pd.company_id = " . $this->arrUser['company_id'] . " AND
                        pd.parent_id = ro.id AND
                        ro.type = 2 AND
                        pd.document_type IN (1,3) AND
                        pd.transaction_type = 2 AND
                        pd.currency_id = cur.id AND 
                        pd.debit_amount > 0
                UNION
                    SELECT
                    op.id AS order_id,
                    op.description AS customer_name,
                    op.posting_date,  
                    op.posting_dateUnConv as posting_date2,  
                    NULL AS order_date,
                    NULL AS delivery_date,
                    'Opening Balance Invoice' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    op.extRefNo AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    (CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) AS grand_total,
                    op.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) AS remaining_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) /op.convRate) AS remaining_amount_lcy,
                    (CASE WHEN ((CASE
                                WHEN op.creditAmount > 0 THEN op.creditAmount
                                WHEN op.debitAmount > 0 THEN op.debitAmount
                            END ) - op.allocated_amount) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    UNIX_TIMESTAMP(DATE_ADD(FROM_UNIXTIME(op.posting_date), INTERVAL (COALESCE((SELECT CASE  WHEN pt.days>0 THEN pt.days
																		ELSE 0
																		END AS 'days'
																	FROM finance AS f
																	LEFT JOIN payment_terms AS pt ON f.payment_terms_id = pt.id
																	WHERE f.customer_id = op.moduleID),0)) DAY)) as due_date,
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 6 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
                    op.extRefNo AS externalRefNo,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po

                    FROM gl_account_txn AS ro, opening_balance_customer as op,currency as cur
                    WHERE 
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 8 AND
                        op.type = 1 AND
                        op.docType = 1 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id
                UNION
                    SELECT
                    op.id AS order_id,
                    op.description AS customer_name,
                    op.posting_date, 
                    op.posting_dateUnConv as posting_date2, 
                    NULL AS order_date,
                    NULL AS delivery_date,
                    'Opening Balance Credit Note' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    op.extRefNo AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) * (CASE WHEN (CASE
                                            WHEN op.creditAmount > 0 THEN op.creditAmount
                                            WHEN op.debitAmount > 0 THEN op.debitAmount
                                        END )<>0 THEN -1 
                            ELSE 1 END)
                    ) AS grand_total,
                    (op.converted_price * (CASE WHEN op.converted_price<>0 THEN -1 ELSE 1 END)) as grand_total_converted, 
                    NULL AS tax_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) * (CASE WHEN ((CASE
                                                                    WHEN op.creditAmount > 0 THEN op.creditAmount
                                                                    WHEN op.debitAmount > 0 THEN op.debitAmount
                                                                END ) - op.allocated_amount)<>0 THEN -1 
                                                    ELSE 1 END)
                    ) AS remaining_amount,
                    ((((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) /op.convRate) * (CASE WHEN (((CASE
                                                                                    WHEN op.creditAmount > 0 THEN op.creditAmount
                                                                                    WHEN op.debitAmount > 0 THEN op.debitAmount
                                                                                END ) - op.allocated_amount) /op.convRate)<>0 THEN -1 
                                                                ELSE 1 END)
                    ) AS remaining_amount_lcy,
                    (CASE  WHEN
                        (((CASE
                            WHEN op.creditAmount > 0 THEN op.creditAmount
                            WHEN op.debitAmount > 0 THEN op.debitAmount
                        END ) - op.allocated_amount)
                        )  > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    op.posting_date AS due_date,
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 6 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
                    op.extRefNo AS externalRefNo,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po


                    FROM gl_account_txn AS ro, opening_balance_customer as op,currency as cur
                    WHERE 
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 8 AND
                        op.type = 1 AND
                        op.docType = 2 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id
                UNION 
                    SELECT
                    op.id AS order_id,
                    op.description AS customer_name,
                    op.posting_date, 
                    op.posting_dateUnConv as posting_date2, 
                    NULL AS order_date,
                    NULL AS delivery_date,
                    'Bank Opening Balance Payment' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    op.extRefNo AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) * (CASE WHEN (CASE
                                        WHEN op.creditAmount > 0 THEN op.creditAmount
                                        WHEN op.debitAmount > 0 THEN op.debitAmount
                                    END ) > 0 THEN -1 ELSE 1 END)) AS grand_total,
                    op.converted_price * (CASE WHEN op.converted_price > 0 THEN -1 ELSE 1 END) as grand_total_converted, 
                    NULL AS tax_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) * (CASE WHEN ((CASE
                                                            WHEN op.creditAmount > 0 THEN op.creditAmount
                                                            WHEN op.debitAmount > 0 THEN op.debitAmount
                                                        END ) - op.allocated_amount) > 0 THEN -1 ELSE 1 END) 
                    )AS remaining_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount)/op.convRate) * (CASE WHEN (((CASE
                                                                        WHEN op.creditAmount > 0 THEN op.creditAmount
                                                                        WHEN op.debitAmount > 0 THEN op.debitAmount
                                                                    END ) - op.allocated_amount)/op.convRate) > 0 THEN -1 ELSE 1 END)
                    AS remaining_amount_lcy,
                    (CASE WHEN (((CASE
                                WHEN op.creditAmount > 0 THEN op.creditAmount
                                WHEN op.debitAmount > 0 THEN op.debitAmount
                            END ) - op.allocated_amount)) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    op.posting_date AS due_date,              
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 7 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
                    op.extRefNo AS externalRefNo,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po


                    FROM gl_account_txn AS ro, opening_balance_bank as op,currency as cur
                    WHERE
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 6 AND
                        op.type = 1 AND
                        op.docType = 1 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id
                UNION 
                    SELECT
                    op.id AS order_id,
                    op.description AS customer_name,
                    op.posting_date, 
                    op.posting_dateUnConv as posting_date2, 
                    NULL AS order_date,
                    NULL AS delivery_date,
                    'Bank Opening Balance Refund' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as sale_person,
                    NULL sale_person_2,
                    NULL AS order_code,
                    op.extRefNo AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                     (CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) AS grand_total,
                    op.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) AS remaining_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount)/op.convRate) AS remaining_amount_lcy,
                    (CASE WHEN ((CASE
                                WHEN op.creditAmount > 0 THEN op.creditAmount
                                WHEN op.debitAmount > 0 THEN op.debitAmount
                            END ) - op.allocated_amount) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    op.posting_date AS due_date,
                    NULL AS bill_to_finance_charges_name,
                    NULL AS bill_to_insurance_charges_name,
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 7 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
                    op.extRefNo AS externalRefNo,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS shipped_city,
                    NULL AS shipped_post_code,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group,
                    NULL AS contact_person,
                    NULL AS link_to_po


                    FROM gl_account_txn AS ro, opening_balance_bank as op,currency as cur
                    WHERE
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 6 AND
                        op.type = 1 AND
                        op.docType = 2 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id
                    ) as tbl where 1 ".$where_clause."               
                    ";

                    
        // echo $Sql;exit;
        $total_limit = pagination_limit;
        
        if ($order_clause == "")
            $order_type = " Order BY posting_date DESC ";
        else
            $order_type = $order_clause;

            // echo $total_limit;exit;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], 'activity_customer', sr_ViewPermission);
        $response['q'] = '';
        $index = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                // $amount_without_vat = floatval ($Row['grand_total']) - floatval ($Row['tax_amount']);
                // $Row['amount_without_vat'] = $amount_without_vat;
                // $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $Row['posting_date'] = date("d/m/Y", strtotime($Row['posting_date2']));
                $Row['due_date'] = $this->objGeneral->convert_unix_into_date($Row['due_date']);
                // $Row['opened_closed'] = (floatval($Row['remaining_amount']) != 0) ? 'Yes' : 'No';
                $Row['on_hold_check'] = (intval($Row['on_hold']) > 0) ? true : false;
                $Row['index'] = $index++;
                $response['response'][] = $Row;
            }
            $response['customer_balance'] = self::CalculateCustomerBalance($attr['cust_id']);
            $response['custAvgPaymentDays'] = self::CalculateCustAvgPaymentDays($attr['cust_id']);

            $response['balanceInCustomerCurrency'] = 0;

            if(isset($attr['defaultCurrency']) && $attr['defaultCurrency'] > 0 && $attr['defaultCurrency'] != $attr['customerCurrencyID']){
                $response['balanceInCustomerCurrency'] = self::CalculateCustomerBalanceInActualCurrency($attr['cust_id']);
            }            

            if($response['customer_balance'] == '333333333') 
                $response['customer_balance'] = 0;
        }
        else {
            $response['response'][] = array();
        }

        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("CustomerActivity");
        return $response;
    }

    function get_gl_journal_receipt_payment_supplier($attr) {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);
        $Sql = "SELECT * FROM (SELECT   
                    o.id AS order_id,
                    o.sell_to_cust_name AS supplier_name,
                    o.invoice_date AS posting_date, 
                    o.invoice_dateUnConv AS posting_date2, 
                    o.order_date,
                    o.receiptDate AS receipt_date,
                    'Purchase Invoice' AS docType,
                    o.invoice_code AS invoice_code,
                    o.sell_to_cust_no,
                    o.srm_purchase_code AS purchaser,
                    o.order_code,
                    o.supp_order_no AS cust_order_no,
                    o.currency_id,
                    o.currency_rate,
                    cur.code AS currency_code,
                    o.ship_to_name,
                    (o.grand_total * (CASE WHEN o.grand_total<>0 THEN -1 ELSE 1 END)) AS grand_total,
                    (o.grand_total_converted * (CASE WHEN o.grand_total_converted<>0 THEN -1 ELSE 1 END)) AS grand_total_converted, 
                    (o.tax_amount * (CASE WHEN o.tax_amount<>0 THEN -1 ELSE 1 END)) AS tax_amount,
                    (o.remaining_amount * (CASE WHEN o.remaining_amount<>0 THEN -1 ELSE 1 END)) AS remaining_amount,
                    ((o.remaining_amount/o.currency_rate) * (CASE WHEN (o.remaining_amount/o.currency_rate)<>0 THEN -1 ELSE 1 END))  AS remaining_amount_lcy,
                    (CASE WHEN ROUND(o.remaining_amount, 2) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    ((o.grand_total - o.tax_amount) * (CASE WHEN (o.grand_total - o.tax_amount) > 1 THEN -1 ELSE 1 END)) AS amount_without_vat,
                    NULL AS `gl_account_code`,
                    NULL AS `gl_account_name`,
                    o.due_date,                    
                    o.on_hold,
                    (CASE
                        WHEN o.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=o.id AND invoice_type = 3 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    o.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) FROM gl_account_txn as gat WHERE gat.object_id=o.id AND gat.type= 3 AND gat.company_id = " . $this->arrUser['company_id'] . ") AS entry_no,
		            o.posted_on,                    
		            NULL AS debitAmount,
		            NULL AS creditAmount,
		            NULL AS customerName,
                    '0' AS detail_id,
                    o.ship_to_city AS collection_city,
                    o.ship_to_post_code AS collection_postcode,
                    o.comm_book_in_no AS consignment_no,
                    o.sell_to_contact_no AS contact_person,
                    sr_link_so(o.id) AS link_to_so,
                    o.bill_to_posting_group_name AS posting_group

                    FROM srm_invoice AS o, currency as cur
                    WHERE 
                        o.sell_to_cust_id = $attr[cust_id] AND
                        o.company_id = " . $this->arrUser['company_id'] . " AND
                        o.type IN (2) AND 
                        o.currency_id = cur.id
                    
                UNION
                    SELECT
                    ro.id AS order_id,
                    ro.supplierName AS supplier_name,
                    ro.supplierCreditNoteDate AS posting_date,
                    ro.supplierCreditNoteDateUnConv AS posting_date2,  
                    NULL AS order_date,
                    NULL AS receipt_date,
                    'Debit Note' AS docType,
                    ro.invoice_code AS invoice_code,
                    ro.supplierNo AS sell_to_cust_no,
                    ro.purchaser,
                    ro.debitNoteCode AS order_code,
                    ro.supplierCreditNoteNo AS cust_order_no,
                    ro.currency_id,
                    ro.currency_rate,
                    cur.code AS currency_code,
                    ro.shipToSupplierLocName AS ship_to_name,
                    ro.grand_total,
                    ro.grand_total_converted, 
                    ro.tax_amount,
                    ro.remaining_amount,
                    ro.remaining_amount/ro.currency_rate AS remaining_amount_lcy,
                    (CASE WHEN ROUND(ro.remaining_amount, 2) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    (ro.grand_total - ro.tax_amount) AS amount_without_vat,
                    NULL AS `gl_account_code`,
                    NULL AS `gl_account_name`,
                    ro.supplierCreditNoteDate AS due_date,                    
                    ro.on_hold,
                    (CASE
                        WHEN ro.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=ro.id AND invoice_type = 4 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    ro.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) FROM gl_account_txn as gat WHERE gat.object_id=ro.id AND gat.type= 4 AND gat.company_id = " . $this->arrUser['company_id'] . ") AS entry_no,
		            ro.posted_on,                    
		            NULL AS debitAmount,
		            NULL AS creditAmount,
		            NULL AS customerName,
                    '0' AS detail_id,
                    ro.shipToSupplierLocCity AS collection_city,
                    ro.shipToSupplierLocPostCode AS collection_postcode,
                    NULL AS consignment_no,
                    ro.supplierContactName AS contact_person,
                    NULL AS link_to_so,
                    ro.bill_to_posting_group_name AS posting_group

                    FROM srm_order_return AS ro, currency as cur
                    WHERE 
                        ro.supplierID = $attr[cust_id] AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.type IN (2) AND 
                        ro.currency_id = cur.id
                UNION
                    SELECT
                    ro.id AS order_id,
                    pd.account_name AS supplier_name,
                    pd.posting_date, 
                    pd.posting_dateUnConv AS posting_date2,  
                    NULL AS order_date,
                    NULL AS receipt_date,
                    (CASE
                        WHEN pd.document_type = 1 THEN
                            'General Journal'
                        ELSE
                            'Supplier Payment'
                    END) AS docType, 
                    pd.document_no AS invoice_code,
                    pd.account_no as sell_to_cust_no,
                    NULL as purchaser,
                    NULL AS order_code,
                    NULL AS cust_order_no,
                    pd.currency_id,
                    pd.cnv_rate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount
                    END ) AS grand_total,
                    pd.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                    END ) AS remaining_amount,
                    (CASE
                        WHEN pd.credit_amount > 0 THEN (pd.credit_amount - allocated_amount)/pd.cnv_rate
                        WHEN pd.debit_amount > 0 THEN (pd.debit_amount - allocated_amount)/pd.cnv_rate
                    END ) AS remaining_amount_lcy,
                    (CASE WHEN (CASE
                                    WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                                    WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                                END ) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    pd.`balancing_account_code` AS gl_account_code,
                    pd.`balancing_account_name` AS gl_account_name,
                    pd.posting_date AS due_date,                    
                    pd.on_hold,
                    (CASE
                        WHEN pd.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=pd.id AND invoice_type = 5 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    ro.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) 
                        FROM gl_account_txn as gat WHERE 
                            gat.type=5 AND 
                            gat.company_id =" . $this->arrUser['company_id'] . " AND 
                            gat.object_id=ro.id AND
                            gat.ref_id = pd.id AND
                            gat.gl_account_id=pd.balancing_account_id) AS entry_no,
		            ro.posted_on,                    
		            pd.debit_amount AS debitAmount,
		            pd.credit_amount AS creditAmount,
		            NULL AS customerName,
                    pd.id AS detail_id,
                    NULL AS collection_city,
                    NULL AS collection_postcode,
                    NULL AS consignment_no,
                    NULL AS contact_person,
                    NULL AS link_to_so,
                    (SELECT name FROM ref_posting_group WHERE id = pd.posting_group_id) AS posting_group

                    FROM gl_journal_receipt AS ro, payment_details as pd,  currency as cur
                    WHERE 
                        pd.account_id = $attr[cust_id] AND
                        pd.company_id = " . $this->arrUser['company_id'] . " AND
                        pd.parent_id = ro.id AND
                        ro.type = 2 AND
                        pd.document_type IN (1, 2) AND
                        pd.transaction_type = 3 AND
                        pd.currency_id = cur.id AND
                        pd.debit_amount > 0

                UNION
                    SELECT
                    ro.id AS order_id,
                    pd.account_name AS supplier_name,
                    pd.posting_date, 
                    pd.posting_dateUnConv AS posting_date2, 
                    NULL AS order_date,
                    NULL AS receipt_date,
                    (CASE
                        WHEN pd.document_type = 1 THEN
                            'General Journal'
                        ELSE
                            'Supplier Refund'
                    END) AS docType, 
                    pd.document_no AS invoice_code,
                    pd.account_no as sell_to_cust_no,
                    NULL as purchaser,
                    NULL AS order_code,
                    NULL AS cust_order_no,
                    pd.currency_id,
                    pd.cnv_rate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    ((CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount
                    END ) * (CASE WHEN (CASE
                                                WHEN pd.credit_amount > 0 THEN pd.credit_amount
                                                WHEN pd.debit_amount > 0 THEN pd.debit_amount
                                            END ) <>0 THEN -1 ELSE 1 END)
                    ) AS grand_total,
                    (pd.converted_price * (CASE WHEN pd.converted_price<>0 THEN -1 ELSE 1 END)) as grand_total_converted, 
                    NULL AS tax_amount,
                    ((CASE
                        WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                        WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                    END ) * (CASE WHEN (CASE
                                            WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                                            WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                                        END )<>0 THEN -1 ELSE 1 END)
                    ) AS remaining_amount,
                    ((CASE
                        WHEN pd.credit_amount > 0 THEN (pd.credit_amount - allocated_amount)/pd.cnv_rate
                        WHEN pd.debit_amount > 0 THEN (pd.debit_amount - allocated_amount)/pd.cnv_rate
                    END ) * (CASE WHEN (CASE
                                            WHEN pd.credit_amount > 0 THEN (pd.credit_amount - allocated_amount)/pd.cnv_rate
                                            WHEN pd.debit_amount > 0 THEN (pd.debit_amount - allocated_amount)/pd.cnv_rate
                                        END ) <>0 THEN -1 ELSE 1 END)
                    ) AS remaining_amount_lcy,
                    (CASE WHEN ((CASE
                                    WHEN pd.credit_amount > 0 THEN pd.credit_amount - allocated_amount
                                    WHEN pd.debit_amount > 0 THEN pd.debit_amount - allocated_amount
                                END )
                                )  > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    pd.`balancing_account_code` AS gl_account_code,
                    pd.`balancing_account_name` AS gl_account_name,
                    pd.posting_date AS due_date,                    
                    pd.on_hold,
                    (CASE
                        WHEN pd.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=pd.id AND invoice_type = 5 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    ro.posted_by_name AS posted_by,
                    (SELECT MIN(transaction_id) 
                        FROM gl_account_txn as gat WHERE 
                            gat.type=5 AND 
                            gat.company_id =" . $this->arrUser['company_id'] . " AND 
                            gat.object_id=ro.id AND
                            gat.ref_id = pd.id AND
                            gat.gl_account_id=pd.balancing_account_id) AS entry_no,
		            ro.posted_on,                    
		            pd.debit_amount AS debitAmount,
		            pd.credit_amount AS creditAmount,
		            NULL AS customerName,
                    pd.id AS detail_id,
                    NULL AS collection_city,
                    NULL AS collection_postcode,
                    NULL AS consignment_no,
                    NULL AS contact_person,
                    NULL AS link_to_so,
                    (SELECT name FROM ref_posting_group WHERE id = pd.posting_group_id) AS posting_group

                    FROM gl_journal_receipt AS ro, payment_details as pd,  currency as cur
                    WHERE 
                        pd.account_id = $attr[cust_id] AND
                        pd.company_id = " . $this->arrUser['company_id'] . " AND
                        pd.parent_id = ro.id AND
                        ro.type = 2 AND
                        pd.document_type IN (1, 3) AND
                        pd.transaction_type = 3 AND
                        pd.currency_id = cur.id AND
                        pd.credit_amount > 0
                UNION
                    SELECT
                    op.id AS order_id,
                    op.description AS supplier_name,
                    op.posting_date, 
                    op.posting_dateUnConv AS posting_date2, 
                    NULL AS order_date,
                    NULL AS receipt_date,
                    'Opening Balance Invoice' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as purchaser,
                    op.extRefNo AS order_code,
                    NULL AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) * (CASE WHEN (CASE
                                            WHEN op.creditAmount > 0 THEN op.creditAmount
                                            WHEN op.debitAmount > 0 THEN op.debitAmount
                                        END )<>0 THEN -1 ELSE 1 END)
                    ) AS grand_total,
                    (op.converted_price * (CASE WHEN op.converted_price<>0 THEN -1 ELSE 1 END)) as grand_total_converted, 
                    NULL AS tax_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) * (CASE WHEN ((CASE
                                                        WHEN op.creditAmount > 0 THEN op.creditAmount
                                                        WHEN op.debitAmount > 0 THEN op.debitAmount
                                                    END ) - op.allocated_amount)<>0 THEN -1 ELSE 1 END)
                    ) AS remaining_amount,
                    ((((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) /op.convRate) * (CASE WHEN (((CASE
                                                                                WHEN op.creditAmount > 0 THEN op.creditAmount
                                                                                WHEN op.debitAmount > 0 THEN op.debitAmount
                                                                            END ) - op.allocated_amount) /op.convRate)<>0 THEN -1 ELSE 1 END)
                    ) AS remaining_amount_lcy,
                    (CASE WHEN (((CASE
                                        WHEN op.creditAmount > 0 THEN op.creditAmount
                                        WHEN op.debitAmount > 0 THEN op.debitAmount
                                    END ) - op.allocated_amount)
                                    )  > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    UNIX_TIMESTAMP(DATE_ADD(FROM_UNIXTIME(op.posting_date), INTERVAL (COALESCE((SELECT CASE  WHEN pt.days>0 THEN pt.days
																		ELSE 0
																		END AS 'days'
																	FROM srm_finance AS f
																	LEFT JOIN srm_payment_terms AS pt ON f.payment_terms_id = pt.id
																	WHERE f.supplier_id = op.moduleID),0)) DAY)) as due_date,                  
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 6 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS collection_city,
                    NULL AS collection_postcode,
                    NULL AS consignment_no,
                    NULL AS contact_person,
                    NULL AS link_to_so,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group
                    
                    FROM gl_account_txn AS ro, opening_balance_customer as op,currency as cur
                    WHERE 
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 9 AND
                        op.type = 2 AND
                        op.docType = 1 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id
                UNION
                    SELECT
                    op.id AS order_id,
                    op.description AS supplier_name,
                    op.posting_date, 
                    op.posting_dateUnConv AS posting_date2, 
                    NULL AS order_date,
                    NULL AS receipt_date,
                    'Opening Balance Debit Note' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as purchaser,                    
                    op.extRefNo AS order_code,
                    NULL AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    (CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) AS grand_total,
                    op.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) AS remaining_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) /op.convRate) AS remaining_amount_lcy,
                    (CASE WHEN ((CASE
                                    WHEN op.creditAmount > 0 THEN op.creditAmount
                                    WHEN op.debitAmount > 0 THEN op.debitAmount
                                END ) - op.allocated_amount) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    op.posting_date AS due_date,                  
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 6 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS collection_city,
                    NULL AS collection_postcode,
                    NULL AS consignment_no,
                    NULL AS contact_person,
                    NULL AS link_to_so,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group
                    
                    FROM gl_account_txn AS ro, opening_balance_customer as op,currency as cur
                    WHERE 
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 9 AND
                        op.type = 2 AND
                        op.docType = 2 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id
                UNION 
                    SELECT
                    op.id AS order_id,
                    op.description AS supplier_name,
                    op.posting_date, 
                    op.posting_dateUnConv AS posting_date2, 
                    NULL AS order_date,
                    NULL AS receipt_date,
                    'Bank Opening Balance Payment' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as purchaser,
                    op.extRefNo AS order_code,
                    NULL AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    (CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) AS grand_total,
                    op.converted_price as grand_total_converted, 
                    NULL AS tax_amount,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) AS remaining_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount)/op.convRate) AS remaining_amount_lcy,
                    (CASE WHEN ((CASE
                                    WHEN op.creditAmount > 0 THEN op.creditAmount
                                    WHEN op.debitAmount > 0 THEN op.debitAmount
                                END ) - op.allocated_amount) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    op.posting_date AS due_date,                 
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 7 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS collection_city,
                    NULL AS collection_postcode,
                    NULL AS consignment_no,
                    NULL AS contact_person,
                    NULL AS link_to_so,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group
                    
                    FROM gl_account_txn AS ro, opening_balance_bank as op,currency as cur
                    WHERE
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 6 AND
                        op.type = 2 AND
                        op.docType = 1 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id
                UNION 
                    SELECT
                    op.id AS order_id,
                    op.description AS supplier_name,
                    op.posting_date, 
                    op.posting_dateUnConv AS posting_date2, 
                    NULL AS order_date,
                    NULL AS receipt_date,
                    'Bank Opening Balance Refund' AS docType,
                    op.invoiceNo AS invoice_code,
                    op.moduleNo as sell_to_cust_no,
                    NULL as purchaser,
                    op.extRefNo AS order_code,
                    NULL AS cust_order_no,
                    op.currency_id,
                    op.convRate AS currency_rate,
                    cur.code AS currency_code,
                    NULL as ship_to_name,
                    ((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) * (CASE WHEN (CASE
                                            WHEN op.creditAmount > 0 THEN op.creditAmount
                                            WHEN op.debitAmount > 0 THEN op.debitAmount
                                        END ) <>0 THEN -1 ELSE 1 END)
                    ) AS grand_total,
                    (op.converted_price * (CASE WHEN op.converted_price<>0 THEN -1 ELSE 1 END)) as grand_total_converted, 
                    NULL AS tax_amount,
                    (((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount) * (CASE WHEN ((CASE
                                                                    WHEN op.creditAmount > 0 THEN op.creditAmount
                                                                    WHEN op.debitAmount > 0 THEN op.debitAmount
                                                                END ) - op.allocated_amount) <>0 THEN -1 ELSE 1 END)
                    ) AS remaining_amount,
                    ((((CASE
                        WHEN op.creditAmount > 0 THEN op.creditAmount
                        WHEN op.debitAmount > 0 THEN op.debitAmount
                    END ) - op.allocated_amount)/op.convRate) * (CASE WHEN (((CASE
                                                                                WHEN op.creditAmount > 0 THEN op.creditAmount
                                                                                WHEN op.debitAmount > 0 THEN op.debitAmount
                                                                            END ) - op.allocated_amount)/op.convRate) <>0 THEN -1 ELSE 1 END)
                    ) AS remaining_amount_lcy,
                    (CASE WHEN (((CASE
                                    WHEN op.creditAmount > 0 THEN op.creditAmount
                                    WHEN op.debitAmount > 0 THEN op.debitAmount
                                END ) - op.allocated_amount)
                                ) > 0 THEN 'Yes' ELSE 'No' END) AS opened_closed,
                    NULL AS amount_without_vat,
                    ro.gl_account_code AS gl_account_code,
                    ro.gl_account_name AS gl_account_name,
                    op.posting_date AS due_date,                 
                    op.on_hold,
                    (CASE
                        WHEN op.on_hold = 1 THEN
                            (SELECT comments FROM on_hold_invoice WHERE invoice_id=op.id AND invoice_type = 7 ORDER BY id DESC LIMIT 1)
                        ELSE
                            ''
                    END) AS on_hold_message,
                    (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE ro.AddedBy = emp.id) AS posted_by,
                    ro.transaction_id AS entry_no,
		            ro.AddedOn AS posted_on,
		            op.debitAmount AS debitAmount,
		            op.creditAmount AS creditAmount,
		            op.description AS customerName,
                    '0' AS detail_id,
                    NULL AS collection_city,
                    NULL AS collection_postcode,
                    NULL AS consignment_no,
                    NULL AS contact_person,
                    NULL AS link_to_so,
                    (SELECT name FROM ref_posting_group WHERE id = op.posting_group_id) AS posting_group
                    
                    FROM gl_account_txn AS ro, opening_balance_bank as op,currency as cur
                    WHERE
                        op.moduleID = $attr[cust_id] AND
                        op.company_id = " . $this->arrUser['company_id'] . " AND
                        ro.company_id = " . $this->arrUser['company_id'] . " AND
                        op.id = ro.object_id AND
                        ro.type = 6 AND
                        op.type = 2 AND
                        op.docType = 2 AND
                        op.postStatus = 1 AND
                        op.currency_id = cur.id
                    GROUP BY op.id) as tbl where 1 ".$where_clause."                 
                    ";
        
        // echo $Sql;exit;
        $total_limit = pagination_limit;
        
        
        if ($order_clause == "")
            $order_type = "Order BY posting_date DESC";
        else
            $order_type = $order_clause;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], 'activity_supplier', sr_ViewPermission);
        $response['q'] = '';
        $index = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                // $amount_without_vat = floatval ($Row['grand_total']) - floatval ($Row['tax_amount']);
                // $Row['amount_without_vat'] = $amount_without_vat;

                // $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $Row['posting_date'] = date("d/m/Y", strtotime($Row['posting_date2']));
                $Row['due_date'] = $this->objGeneral->convert_unix_into_date($Row['due_date']);
                // $Row['opened_closed'] = (floatval($Row['remaining_amount']) != 0) ? 'Yes' : 'No';
                $Row['on_hold_check'] = (intval($Row['on_hold']) > 0) ? true : false;
                $Row['index'] = $index++;
                $Row['remaining_amount'] =  Round($Row['remaining_amount'],2);
                $Row['remaining_amount_lcy'] =  Round($Row['remaining_amount_lcy'],2);
                $Row['amount_without_vat'] =  Round($Row['amount_without_vat'],2);
                $response['response'][] = $Row;
            }

        } else{
            $response['response'][] = array();
        }
        
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['balanceInSupplierCurrency'] = 0;

        if(isset($attr['defaultCurrency']) && $attr['defaultCurrency'] > 0 && $attr['defaultCurrency'] != $attr['supplierCurrencyID']){
            // $balanceInSupplierCurrency = ",
                        //  (CASE WHEN (s.type <> 1 AND s.currency_id <> ".$attr['defaultCurrency'].") THEN sr_getSupplierBalanceInActualCurrency('$upToDate',s.company_id,s.id)
                            //    ELSE 0
                            //    END) AS balanceInSupplierCurrency";

            $response['balanceInSupplierCurrency'] = self::CalculateSupplierBalanceInActualCurrency($attr['cust_id']);
        }

        $response['supplier_balance'] = self::CalculateSupplierBalance($attr['cust_id']);

        // if($response['supplier_balance'] == '333333333' || $response['supplier_balance'] == '-333333333') 
        //     $response['supplier_balance'] = 0;

        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("SupplierActivity");
        return $response;
    }

    function CalculateSupplierBalance($id) {
        $this->objGeneral->mysql_clean($attr);
        // IFNULL(SR_CalculateSupplierBalance(".$attr['id'].", " . $this->arrUser['company_id'] . "), 0) AS supplier_balance        

        $upToDate = date("Y-m-d"); 

        /* $Sql = "SELECT IFNULL(SR_rep_aged_supp_sum($id,DATE_SUB('$upToDate', INTERVAL 14600 DAY),DATE_ADD('$upToDate', INTERVAL 14600 DAY)," . $this->arrUser['company_id'] . ",'sr_rep',2,'',DATE_ADD('$upToDate', INTERVAL 14600 DAY)), 0)*(-1) AS supplier_balance"; */

        $Sql = "SELECT sr_getSupplierBalance('".$upToDate."'," . $this->arrUser['company_id'] . ",".$id.") AS supplier_balance";
        
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        
        return $RS->fields['supplier_balance'];
    }

    function CalculateSupplierBalanceInActualCurrency($id) {
        $this->objGeneral->mysql_clean($attr);
        $upToDate = date("Y-m-d"); 
        $Sql = "SELECT sr_getSupplierBalanceInActualCurrency('".$upToDate."'," . $this->arrUser['company_id'] . ",".$id.") AS balanceInSupplierCurrency";
        
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);        
        return $RS->fields['balanceInSupplierCurrency'];
    }

    function get_gl_journal_receipt_payment_item($attr) {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        $rawMaterialProductChk = $attr['rawMaterialProductChk'];
        $rawMaterialProductQuery = '';

        if($rawMaterialProductChk >0){

            $rawMaterialProductQuery = " UNION ALL
                                            SELECT  
                                                o.id AS order_id,
                                                o.invoice_date AS posting_date, 
                                                (CASE
                                                    WHEN o.type = 3 THEN
                                                        'PO Finished Good'
                                                    ELSE
                                                        'PI Finished Good'
                                                END) AS docType,
                                                (CASE
                                                    WHEN o.type = 3 THEN
                                                        o.order_code
                                                    ELSE
                                                        o.invoice_code
                                                END) AS invoice_code,
                                                prd.product_code AS item_no,
                                                prd.description AS item_desc,
                                                o.comm_book_in_no AS consignment_no,
                                                NULL AS ref_no,
                                                NULL AS batch_no,
                                                prd.unit_name AS unit_measure,
                                                NULL as warehouse,
                                                (wh_alloc.quantity * -1) AS quantity,
                                                NULL AS cost_price,
                                                NULL AS sale_price,
                                                NULL AS unit_sale_price,
                                                NULL AS unit_cost_price,
                                                1 AS transaction_type,
                                                o.posted_on, 
                                                0 AS invoiced_qty,
                                                0 AS remaining_qty,
                                                NULL AS open_close
                                            FROM srm_invoice AS o, srm_invoice_detail od, warehouse_allocation AS wh_alloc,productcache AS prd
                                            WHERE 
                                                o.id = od.invoice_id AND
                                                od.type = 0 AND
                                                wh_alloc.order_id = o.id AND
                                                wh_alloc.raw_material_out = 1 AND
                                                wh_alloc.purchase_order_detail_id = od.id AND
                                                wh_alloc.product_id = $attr[product_id] AND 
                                                wh_alloc.product_id = prd.id AND
                                                wh_alloc.type = 1 AND wh_alloc.purchase_return_status = 0 AND
                                                (o.type IN(1, 2) OR o.purchaseStatus = 2) AND
                                                o.company_id= " . $this->arrUser['company_id'] . " ";
        }


        $Sql = "SELECT * FROM (SELECT  
                    o.id AS order_id,
                    o.posting_date,
                    (CASE
                        WHEN o.type = 1 THEN
                            'Sales Order'
                        ELSE
                            'Sales Invoice'
                    END) AS docType,
                    (CASE
                        WHEN o.type = 1 THEN
                             o.sale_order_code
                        ELSE
                            o.sale_invioce_code 
                    END) AS invoice_code,
                    od.product_code AS item_no,
                    od.item_name AS item_desc,
                    wh_alloc.consignment_no,
                    wh_alloc.container_no AS ref_no,
                    wh_alloc.batch_no AS batch_no,
                    od.unit_measure,
                    od.warehouse,
                    (wh_alloc.quantity * -1) AS quantity,
                    NULL AS cost_price,
                    -- ROUND((IFNULL(od.unit_price,0)/o.currency_rate) * (wh_alloc.quantity * -1), 2) AS sale_price,
                    (ROUND(((od.unit_price/o.currency_rate) * wh_alloc.quantity) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate) * wh_alloc.quantity)*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)  * wh_alloc.quantity) ELSE 0 END), 3) * -1) AS sale_price,
                    (ROUND(((od.unit_price/o.currency_rate)) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate) )*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate) ) ELSE 0 END), 3) * -1) AS unit_sale_price,
                    NULL AS unit_cost_price,
                    2 AS transaction_type,
                    o.posted_on, 
                    NULL AS invoiced_qty,
                    NULL AS remaining_qty,
                    NULL AS open_close

                    FROM orders AS o, order_details od, warehouse_allocation AS wh_alloc
                    WHERE 
                        o.id = od.order_id AND
                        wh_alloc.order_id = o.id AND
                        wh_alloc.sale_order_detail_id = od.id AND
                        wh_alloc.type = 2 AND wh_alloc.sale_return_status = 0 AND
                        od.item_id = $attr[product_id] AND
                        (o.type IN(2,3) OR o.dispatched = 1) AND
                        o.company_id= " . $this->arrUser['company_id'] . "
                UNION ALL
                    SELECT  
                        o.id AS order_id,
                        o.posting_date, 
                        'Credit Note' AS docType,
                        (CASE
                            WHEN o.type = 1 THEN
                                o.return_order_code
                            ELSE
                                o.return_invoice_code 
                        END) AS invoice_code,
                        od.product_code AS item_no,
                        od.item_name AS item_desc,
                        wh_alloc.consignment_no,
                        wh_alloc.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        od.unit_measure,
                        od.warehouse,
                        wh_alloc.quantity,
                        ROUND(((od.unit_price/o.currency_rate) * wh_alloc.quantity) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate) * wh_alloc.quantity)*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)  * wh_alloc.quantity) ELSE 0 END), 2) AS cost_price,
                        NULL AS sale_price,
                        NULL AS unit_sale_price,
                        ROUND(((od.unit_price/o.currency_rate)) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate))*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)) ELSE 0 END), 2) AS unit_cost_price,
                        1 AS transaction_type,
                        o.posted_on, 
                        NULL AS invoiced_qty,
                        NULL AS remaining_qty,
                        NULL AS open_close

                        FROM return_orders AS o, return_order_details od, warehouse_allocation AS wh_alloc
                        WHERE 
                            o.id = od.order_id AND
                            wh_alloc.order_id = o.id AND
                            wh_alloc.sale_order_detail_id = od.id AND
                            wh_alloc.type = 2 AND wh_alloc.sale_return_status = 1 AND
                            od.item_id = $attr[product_id] AND
                            (o.type IN(2,3) OR o.dispatched = 1) AND
                            o.company_id= " . $this->arrUser['company_id'] . "
                UNION ALL
                    SELECT  
                        o.id AS order_id,
                        o.invoice_date AS posting_date, 
                        (CASE
                            WHEN o.type = 3 THEN
                                'Purchase Order'
                            ELSE
                                'Purchase Invoice'
                        END) AS docType,
                        (CASE
                            WHEN o.type = 3 THEN
                                o.order_code
                            ELSE
                                o.invoice_code
                        END) AS invoice_code,
                        od.product_code AS item_no,
                        od.product_name AS item_desc,
                        o.comm_book_in_no AS consignment_no,
                        wh_alloc.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        od.unit_measure,
                       IF(od.warehouse_id>0,od.warehouse,NULL) as warehouse,
                        wh_alloc.quantity,
                        -- ROUND((od.unit_price/o.currency_rate) * wh_alloc.quantity, 2) AS cost_price,
                        ROUND(((od.unit_price/o.currency_rate) * wh_alloc.quantity) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate) * wh_alloc.quantity)*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)  * wh_alloc.quantity) ELSE 0 END), 2) AS cost_price,
                        NULL AS sale_price,
                        NULL AS unit_sale_price,
                        ROUND(((od.unit_price/o.currency_rate)) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate))*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate) ) ELSE 0 END), 5) AS unit_cost_price,
                        1 AS transaction_type,
                        o.posted_on, 
                        ((SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation AS w 
                            WHERE w.ref_po_id=wh_alloc.id AND 
                                ((w.type = 2 AND w.sale_return_status = 0)OR 
                                (w.type = 1 AND w.purchase_return_status = 1 AND w.purchase_status IN (2, 3)) OR 
                                (w.type = 1 AND w.purchase_return_status = 0 AND w.raw_material_out = 1) OR 
                                (w.type = 3 AND w.ledger_type = 2 AND w.journal_status >0) OR 
                                (w.type = 5 AND w.ledger_type = 2 AND w.journal_status = 2)
                                )) - 
                         (SELECT IFNULL(SUM(w.quantity),0) 
                          FROM warehouse_allocation AS w 
                          WHERE w.item_trace_unique_id=wh_alloc.item_trace_unique_id AND w.type =2 AND w.sale_return_status = 1 AND w.sale_status IN (2, 3))
                        ) AS invoiced_qty,
                        (wh_alloc.quantity - 
                         (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id AND (w.ledger_type IS NULL OR w.ledger_type=2))  + 
                         (SELECT IFNULL(SUM(w.quantity),0) 
                          FROM warehouse_allocation AS w 
                          WHERE w.item_trace_unique_id=wh_alloc.item_trace_unique_id AND w.type =2 AND w.sale_return_status = 1 AND w.sale_status IN (2, 3))
                        ) AS remaining_qty,
                        (CASE
                            WHEN (wh_alloc.quantity - (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id)) > 0 THEN
                                'Open'
                            ELSE
                                'Close'
                        END) AS open_close
                        FROM srm_invoice AS o, srm_invoice_detail od, warehouse_allocation AS wh_alloc
                        WHERE 
                            o.id = od.invoice_id AND
                            wh_alloc.order_id = o.id AND
                            wh_alloc.raw_material_out IS NULL AND
                            wh_alloc.purchase_order_detail_id = od.id AND
                            wh_alloc.type = 1 AND wh_alloc.purchase_return_status = 0 AND
                            od.product_id = $attr[product_id] AND
                            (o.type IN(1, 2) OR o.purchaseStatus = 2) AND
                            o.company_id= " . $this->arrUser['company_id'] . "
                $rawMaterialProductQuery
                UNION ALL
                    SELECT  
                        o.id AS order_id,
                        o.supplierCreditNoteDate AS posting_date, 
                        'Debit Note' AS docType,
                        (CASE
                            WHEN o.type = 2 THEN
                                o.invoice_code
                            ELSE
                                o.debitNoteCode
                        END) AS invoice_code,
                        od.product_code AS item_no,
                        od.product_name AS item_desc,
                        NULL AS consignment_no,
                        wh_alloc.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        od.unit_measure,
                        od.warehouse,
                        (wh_alloc.quantity * -1) AS quantity,
                        NULL AS cost_price,
                        -- ROUND((od.unit_price/o.currency_rate) * (wh_alloc.quantity * -1), 2) AS sale_price,
                        (ROUND(((od.unit_price/o.currency_rate) * wh_alloc.quantity) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate) * wh_alloc.quantity)*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)  * wh_alloc.quantity) ELSE 0 END), 2) * -1) AS sale_price,
                        (ROUND(((od.unit_price/o.currency_rate)) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate))*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)) ELSE 0 END), 2) * -1) AS unit_sale_price,
                        NULL AS unit_cost_price,
                        2 AS transaction_type,
                        o.posted_on, 
                        NULL AS invoiced_qty,
                        NULL AS remaining_qty,
                        NULL AS open_close

                        FROM srm_order_return AS o, srm_order_return_detail od, warehouse_allocation AS wh_alloc
                        WHERE 
                            o.id = od.invoice_id AND
                            wh_alloc.order_id = o.id AND
                            wh_alloc.purchase_order_detail_id = od.id AND
                            wh_alloc.type = 1 AND wh_alloc.purchase_return_status = 1 AND
                            od.product_id = $attr[product_id] AND
                            (o.type IN(2,3) OR o.purchaseStatus = 2) AND
                            o.company_id= " . $this->arrUser['company_id'] . "
                UNION ALL
                    SELECT  
                        gj.id AS order_id,
                        ijd.posting_date,
                        'Item Journal' AS docType,
                        gj.acc_code AS invoice_code,
                        ijd.item_code AS item_no,
                        ijd.item_name AS item_desc,
                        wh_alloc.consignment_no,
                        wh_alloc.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        ijd.uom_name AS unit_measure,
                        ijd.warehouse_name AS warehouse,
                        (CASE 
                            WHEN ijd.transaction_type = 1 THEN
                                1
                            ELSE
                                -1
                        END) * wh_alloc.quantity AS quantity,
                        ( CASE  
                            WHEN ijd.transaction_type = 1 THEN 
                                ijd.cost_per_unit * (wh_alloc.quantity * (CASE WHEN ijd.transaction_type = 1 THEN 1
                                                                            ELSE -1 END))
                            ELSE NULL 
                        END) AS cost_price,
                        ( CASE  WHEN ijd.transaction_type = 2 
                                THEN ijd.cost_per_unit * (wh_alloc.quantity * (CASE WHEN ijd.transaction_type = 1 THEN 1
                                                                            ELSE -1 END))
                            ELSE NULL
                        END) AS sale_price,
                        ( CASE  WHEN ijd.transaction_type = 2 
                                THEN ijd.cost_per_unit * ((CASE WHEN ijd.transaction_type = 1 THEN 1
                                                                            ELSE -1 END))
                            ELSE NULL
                        END) AS unit_sale_price,
                        ( CASE  
                            WHEN ijd.transaction_type = 1 THEN 
                                ijd.cost_per_unit * ((CASE WHEN ijd.transaction_type = 1 THEN 1
                                                                            ELSE -1 END))
                            ELSE NULL 
                        END) AS unit_cost_price,
                        ijd.transaction_type,
                        gj.posted_on, 
                        (CASE 
                            WHEN ijd.transaction_type = 1 THEN
                                (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id)
                            ELSE
                                NULL
                        END) AS invoiced_qty,
                        (CASE 
                            WHEN ijd.transaction_type = 1 THEN
                                (wh_alloc.quantity - (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id AND (w.ledger_type IS NULL OR w.ledger_type=2)))
                            ELSE
                                NULL
                        END) AS remaining_qty,
                        (CASE 
                            WHEN ijd.transaction_type = 1 THEN
                                (CASE
                                    WHEN (wh_alloc.quantity - (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id)) > 0 THEN
                                        'Open'
                                    ELSE
                                        'Close'
                                END)
                            ELSE
                                NULL
                        END) AS open_close

                        FROM gl_journal_receipt gj, item_journal_details AS ijd, warehouse_allocation AS wh_alloc
                        WHERE 
                            gj.id  = ijd.parent_id AND
                            gj.type = 2 AND
                            wh_alloc.order_id = gj.id AND
                            wh_alloc.item_journal_detail_id = ijd.id AND
                            wh_alloc.type = 3 AND
                            wh_alloc.journal_status = 2 AND
                            ijd.item_id = $attr[product_id] AND
                            ijd.company_id= " . $this->arrUser['company_id'] . "
                UNION ALL
                    SELECT  
                        NULL AS order_id,
                        ob.posting_date AS posting_date, 
                        'Stock Opening Balance' AS docType,
                        ob.container_no AS invoice_code,
                        ob.ItemNo AS item_no,
                        ob.description AS item_desc,
                        ob.comm_book_in_no AS consignment_no,
                        ob.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        ob.uom AS unit_measure,
                        CONCAT(wh.wrh_code, ' - ', wh.name) AS warehouse,
                        ob.qty AS quantity,
                        ROUND((ob.price * ob.qty), 0) AS cost_price,
                        NULL AS sale_price,
                        NULL AS unit_sale_price,
                        ROUND(ob.price, 3) AS unit_cost_price,
                        1 AS transaction_type,
                        1 AS posted_on, 
                        (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id) AS invoiced_qty,

                        (wh_alloc.quantity - 
                         (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id AND (w.ledger_type IS NULL OR w.ledger_type=2))  + 
                         (SELECT IFNULL(SUM(w.quantity),0) 
                          FROM warehouse_allocation AS w 
                          WHERE w.item_trace_unique_id=wh_alloc.item_trace_unique_id AND w.type =2 AND w.sale_return_status = 1 AND w.sale_status IN (2, 3))
                         ) AS remaining_qty,

                        NULL AS open_close

                        FROM opening_balance_stock AS ob
                        LEFT JOIN warehouse_allocation AS wh_alloc ON wh_alloc.opBalncID = ob.id AND
                                                                        wh_alloc.type = 4 
                        LEFT JOIN warehouse AS wh ON wh.id = ob.warehouseID 
                        WHERE 
                            ob.postStatus = 1 AND
                            ob.productID = $attr[product_id] AND
                            ob.company_id= " . $this->arrUser['company_id'] . "
                UNION ALL
                    SELECT  
                        t.id AS order_id,
                        t.order_date AS posting_date, 
                        'Transfer Stock' AS docType,
                        t.code AS invoice_code,
                        td.item_code AS item_no,
                        td.item_name AS item_desc,
                        NULL AS consignment_no,
                        NULL AS ref_no,
                        NULL AS batch_no,
                        td.uom_name AS unit_measure,
                        CONCAT(wh.wrh_code, ' - ', wh.name) AS warehouse,
                        (td.qty * -1) AS quantity,
                        NULL AS cost_price,
                        NULL AS sale_price,
                        NULL AS unit_sale_price,
                        NULL AS unit_cost_price,
                        1 AS transaction_type,
                        1 AS posted_on, 
                        NULL AS invoiced_qty,
                        NULL AS remaining_qty,
                        NULL AS open_close


                        FROM transfer_orders AS t, transfer_orders_details AS td, warehouse as wh
                        WHERE 
                            t.id = td.transfer_order_id AND
                            wh.id = t.warehouse_from AND
                            t.type = 1 AND
                            td.item_id = $attr[product_id] AND
                            t.company_id= " . $this->arrUser['company_id'] . "
                 UNION ALL
                    SELECT  
                        t.id AS order_id,
                        t.order_date AS posting_date, 
                        'Transfer Stock' AS docType,
                        t.code AS invoice_code,
                        td.item_code AS item_no,
                        td.item_name AS item_desc,
                        NULL AS consignment_no,
                        NULL AS ref_no,
                        NULL AS batch_no,
                        td.uom_name AS unit_measure,
                        CONCAT(wh.wrh_code, ' - ', wh.name) AS warehouse,
                        td.qty AS quantity,
                        NULL AS cost_price,
                        NULL AS sale_price,
                        NULL AS unit_sale_price,
                        NULL AS unit_cost_price,
                        1 AS transaction_type,
                        1 AS posted_on, 
                        NULL AS invoiced_qty,
                        NULL AS remaining_qty,
                        NULL AS open_close

                        FROM transfer_orders AS t, transfer_orders_details AS td, warehouse as wh
                        WHERE 
                            t.id = td.transfer_order_id AND
                            wh.id = t.warehouse_to AND
                            t.type = 1 AND
                            td.item_id = $attr[product_id] AND
                            t.company_id= " . $this->arrUser['company_id'] . "
                           ) as tbl where 1 $where_clause ";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if ($order_clause == "")
            $order_type = "Order BY posting_date DESC,posted_on DESC";
        else
            $order_type = $order_clause;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], "activity_item", sr_ViewPermission);
        $response['q'] = '';
        $index = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                // $Row['remaining_qty'] = ($Row['invoiced_qty'] != '') ? $Row['quantity'] - $Row['invoiced_qty'] : '';
                // $Row['open_close'] = ($Row['remaining_qty'] != '') ? ((intval($Row['quantity']) > 0) ? 'Open' : 'Close') : '';
                $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $response['response'][] = $Row;
            }
        } else
            $response['response'][] = array();
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("ItemActivity");return $response;
    }

    
    function get_all_items_activity($attr) {
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.",$attr,$fieldsMeta);

        // same ftn as get_gl_journal_receipt_payment_item except for item ID
        $Sql = "SELECT * FROM (SELECT  
                    o.id AS order_id,
                    o.posting_date,
                    (CASE
                        WHEN o.type = 1 THEN
                            'Sales Order'
                        ELSE
                            'Sales Invoice'
                    END) AS docType,
                    (CASE
                        WHEN o.type = 1 THEN
                             o.sale_order_code
                        ELSE
                            o.sale_invioce_code 
                    END) AS invoice_code,
                    od.item_id AS item_id,
                    od.product_code AS item_no,
                    od.item_name AS item_desc,
                    wh_alloc.consignment_no,
                    wh_alloc.container_no AS ref_no,
                    wh_alloc.batch_no AS batch_no,
                    od.unit_measure,
                    od.warehouse,
                    (wh_alloc.quantity * -1) AS quantity,
                    NULL AS cost_price,
                    -- ROUND((IFNULL(od.unit_price,0)/o.currency_rate) * (wh_alloc.quantity * -1), 2) AS sale_price,
                    (ROUND(((od.unit_price/o.currency_rate) * wh_alloc.quantity) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate) * wh_alloc.quantity)*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)  * wh_alloc.quantity) ELSE 0 END), 2) * -1) AS sale_price,
                    (ROUND(((od.unit_price/o.currency_rate)) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate) )*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate) ) ELSE 0 END), 2) * -1) AS unit_sale_price,
                    NULL AS unit_cost_price,
                    2 AS transaction_type,
                    o.posted_on, 
                    NULL AS invoiced_qty,
                    NULL AS remaining_qty,
                    NULL AS open_close

                    FROM orders AS o, order_details od, warehouse_allocation AS wh_alloc
                    WHERE 
                        o.id = od.order_id AND
                        wh_alloc.order_id = o.id AND
                        od.type = 0 AND
                        wh_alloc.sale_order_detail_id = od.id AND
                        wh_alloc.type = 2 AND wh_alloc.sale_return_status = 0 AND
                        (o.type IN(2,3) OR o.dispatched = 1) AND
                        o.company_id= " . $this->arrUser['company_id'] . "
                UNION ALL
                    SELECT  
                        o.id AS order_id,
                        o.posting_date, 
                        'Credit Note' AS docType,
                        (CASE
                            WHEN o.type = 1 THEN
                                o.return_order_code
                            ELSE
                                o.return_invoice_code 
                        END) AS invoice_code,
                        od.item_id AS item_id,
                        od.product_code AS item_no,
                        od.item_name AS item_desc,
                        wh_alloc.consignment_no,
                        wh_alloc.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        od.unit_measure,
                        od.warehouse,
                        wh_alloc.quantity,
                        ROUND(((od.unit_price/o.currency_rate) * wh_alloc.quantity) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate) * wh_alloc.quantity)*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)  * wh_alloc.quantity) ELSE 0 END), 2) AS cost_price,
                        NULL AS sale_price,
                        NULL AS unit_sale_price,
                        ROUND(((od.unit_price/o.currency_rate)) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate))*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)) ELSE 0 END), 2) AS unit_cost_price,
                        1 AS transaction_type,
                        o.posted_on, 
                        NULL AS invoiced_qty,
                        NULL AS remaining_qty,
                        NULL AS open_close

                        FROM return_orders AS o, return_order_details od, warehouse_allocation AS wh_alloc
                        WHERE 
                            o.id = od.order_id AND
                            od.type = 0 AND
                            wh_alloc.order_id = o.id AND
                            wh_alloc.sale_order_detail_id = od.id AND
                            wh_alloc.type = 2 AND wh_alloc.sale_return_status = 1 AND
                            (o.type IN(2,3) OR o.dispatched = 1) AND
                            o.company_id= " . $this->arrUser['company_id'] . "
                UNION ALL
                    SELECT  
                        o.id AS order_id,
                        o.invoice_date AS posting_date, 
                        (CASE
                            WHEN o.type = 3 THEN
                                'Purchase Order'
                            ELSE
                                'Purchase Invoice'
                        END) AS docType,
                        (CASE
                            WHEN o.type = 3 THEN
                                o.order_code
                            ELSE
                                o.invoice_code
                        END) AS invoice_code,
                        od.product_id AS item_id,
                        od.product_code AS item_no,
                        od.product_name AS item_desc,
                        o.comm_book_in_no AS consignment_no,
                        wh_alloc.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        od.unit_measure,
                       IF(od.warehouse_id>0,od.warehouse,NULL) as warehouse,
                        wh_alloc.quantity,
                        -- ROUND((od.unit_price/o.currency_rate) * wh_alloc.quantity, 2) AS cost_price,
                        ROUND(((od.unit_price/o.currency_rate) * wh_alloc.quantity) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate) * wh_alloc.quantity)*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)  * wh_alloc.quantity) ELSE 0 END), 2) AS cost_price,
                        NULL AS sale_price,
                        NULL AS unit_sale_price,
                        ROUND(((od.unit_price/o.currency_rate)) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate))*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate) ) ELSE 0 END), 2) AS unit_cost_price,
                        1 AS transaction_type,
                        o.posted_on, 
                         
                        ((SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation AS w 
                            WHERE w.ref_po_id=wh_alloc.id AND 
                                ((w.type = 2 AND w.sale_return_status = 0)OR 
                                (w.type = 1 AND w.purchase_return_status = 1 AND w.purchase_status IN (2, 3)) OR 
                                (w.type = 1 AND w.purchase_return_status = 0 AND w.raw_material_out = 1) OR 
                                (w.type = 3 AND w.ledger_type = 2 AND w.journal_status >0) OR 
                                (w.type = 5 AND w.ledger_type = 2 AND w.journal_status = 2)
                                )) - 
                         (SELECT IFNULL(SUM(w.quantity),0) 
                          FROM warehouse_allocation AS w 
                          WHERE w.item_trace_unique_id=wh_alloc.item_trace_unique_id AND w.type =2 AND w.sale_return_status = 1 AND w.sale_status IN (2, 3))
                        ) AS invoiced_qty,

                        (wh_alloc.quantity - 
                         (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id)  + 
                         (SELECT IFNULL(SUM(w.quantity),0) 
                          FROM warehouse_allocation AS w 
                          WHERE w.item_trace_unique_id=wh_alloc.item_trace_unique_id AND w.type =2 AND w.sale_return_status = 1 AND w.sale_status IN (2, 3))
                        ) AS remaining_qty,


                        (CASE
                            WHEN (wh_alloc.quantity - (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id)) > 0 THEN
                                'Open'
                            ELSE
                                'Close'
                        END) AS open_close
                        FROM srm_invoice AS o, srm_invoice_detail od, warehouse_allocation AS wh_alloc
                        WHERE 
                            o.id = od.invoice_id AND
                            od.type = 0 AND
                            wh_alloc.order_id = o.id AND
                            wh_alloc.raw_material_out IS NULL AND
                            wh_alloc.purchase_order_detail_id = od.id AND
                            wh_alloc.type = 1 AND wh_alloc.purchase_return_status = 0 AND
                            (o.type IN(1, 2) OR o.purchaseStatus = 2) AND
                            o.company_id= " . $this->arrUser['company_id'] . "                
                 UNION ALL
                        SELECT  
                            o.id AS order_id,
                            o.invoice_date AS posting_date, 
                            (CASE
                                WHEN o.type = 3 THEN
                                    'PO Finished Good'
                                ELSE
                                    'PI Finished Good'
                            END) AS docType,
                            (CASE
                                WHEN o.type = 3 THEN
                                    o.order_code
                                ELSE
                                    o.invoice_code
                            END) AS invoice_code,
                            prd.id AS item_id,
                            prd.product_code AS item_no,
                            prd.description AS item_desc,
                            o.comm_book_in_no AS consignment_no,
                            NULL AS ref_no,
                            NULL AS batch_no,
                            prd.unit_name AS unit_measure,
                            NULL as warehouse,
                            (wh_alloc.quantity * -1) AS quantity,
                            NULL AS cost_price,
                            NULL AS sale_price,
                            NULL AS unit_sale_price,
                            NULL AS unit_cost_price,
                            1 AS transaction_type,
                            o.posted_on, 
                            0 AS invoiced_qty,
                            0 AS remaining_qty,
                            NULL AS open_close
                        FROM srm_invoice AS o, srm_invoice_detail od, warehouse_allocation AS wh_alloc,productcache AS prd
                        WHERE 
                            o.id = od.invoice_id AND
                            od.type = 0 AND
                            wh_alloc.order_id = o.id AND
                            wh_alloc.raw_material_out = 1 AND
                            wh_alloc.purchase_order_detail_id = od.id AND
                            wh_alloc.product_id = prd.id AND
                            wh_alloc.type = 1 AND wh_alloc.purchase_return_status = 0 AND
                            (o.type IN(1, 2) OR o.purchaseStatus = 2) AND
                            o.company_id= " . $this->arrUser['company_id'] . "                
                UNION ALL
                    SELECT  
                        o.id AS order_id,
                        o.supplierCreditNoteDate AS posting_date, 
                        'Debit Note' AS docType,
                        (CASE
                            WHEN o.type = 2 THEN
                                o.invoice_code
                            ELSE
                                o.debitNoteCode
                        END) AS invoice_code,
                        od.product_id AS item_id,
                        od.product_code AS item_no,
                        od.product_name AS item_desc,
                        wh_alloc.consignment_no,
                        wh_alloc.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        od.unit_measure,
                        od.warehouse,
                        (wh_alloc.quantity * -1) AS quantity,
                        NULL AS cost_price,
                        -- ROUND((od.unit_price/o.currency_rate) * (wh_alloc.quantity * -1), 2) AS sale_price,
                        (ROUND(((od.unit_price/o.currency_rate) * wh_alloc.quantity) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate) * wh_alloc.quantity)*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)  * wh_alloc.quantity) ELSE 0 END), 2) * -1) AS sale_price,
                        (ROUND(((od.unit_price/o.currency_rate)) - (CASE WHEN od.discount_type = 'Percentage' THEN (((od.unit_price/o.currency_rate))*od.discount/100) WHEN od.discount_type = 'Value' THEN (od.discount/o.currency_rate) WHEN od.discount_type= 'Unit' THEN (((od.discount)/o.currency_rate)) ELSE 0 END), 2) * -1) AS unit_sale_price,
                        NULL AS unit_cost_price,
                        2 AS transaction_type,
                        o.posted_on, 
                        NULL AS invoiced_qty,
                        NULL AS remaining_qty,
                        NULL AS open_close

                        FROM srm_order_return AS o, srm_order_return_detail od, warehouse_allocation AS wh_alloc
                        WHERE 
                            o.id = od.invoice_id AND
                            od.type = 0 AND
                            wh_alloc.order_id = o.id AND
                            wh_alloc.purchase_order_detail_id = od.id AND
                            wh_alloc.type = 1 AND wh_alloc.purchase_return_status = 1 AND
                            (o.type IN(2,3) OR o.purchaseStatus = 2) AND
                            o.company_id= " . $this->arrUser['company_id'] . "
                UNION ALL
                    SELECT  
                        gj.id AS order_id,
                        ijd.posting_date,
                        'Item Journal' AS docType,
                        gj.acc_code AS invoice_code,
                        ijd.item_id AS item_id,
                        ijd.item_code AS item_no,
                        ijd.item_name AS item_desc,
                        wh_alloc.consignment_no,
                        wh_alloc.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        ijd.uom_name AS unit_measure,
                        ijd.warehouse_name AS warehouse,
                        (CASE 
                            WHEN ijd.transaction_type = 1 THEN
                                1
                            ELSE
                                -1
                        END) * wh_alloc.quantity AS quantity,
                        ( CASE  
                            WHEN ijd.transaction_type = 1 THEN 
                                ijd.cost_per_unit * (wh_alloc.quantity * (CASE WHEN ijd.transaction_type = 1 THEN 1
                                                                            ELSE -1 END))
                            ELSE NULL 
                        END) AS cost_price,
                        ( CASE  WHEN ijd.transaction_type = 2 
                                THEN ijd.cost_per_unit * (wh_alloc.quantity * (CASE WHEN ijd.transaction_type = 1 THEN 1
                                                                            ELSE -1 END))
                            ELSE NULL
                        END) AS sale_price,
                        ( CASE  WHEN ijd.transaction_type = 2 
                                THEN ijd.cost_per_unit * ((CASE WHEN ijd.transaction_type = 1 THEN 1
                                                                            ELSE -1 END))
                            ELSE NULL
                        END) AS unit_sale_price,
                        ( CASE  
                            WHEN ijd.transaction_type = 1 THEN 
                                ijd.cost_per_unit * ((CASE WHEN ijd.transaction_type = 1 THEN 1
                                                                            ELSE -1 END))
                            ELSE NULL 
                        END) AS unit_cost_price,
                        ijd.transaction_type,
                        gj.posted_on, 
                        (CASE 
                            WHEN ijd.transaction_type = 1 THEN
                                (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id)
                            ELSE
                                NULL
                        END) AS invoiced_qty,
                        (CASE 
                            WHEN ijd.transaction_type = 1 THEN
                                (wh_alloc.quantity - (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id))
                            ELSE
                                NULL
                        END) AS remaining_qty,
                        (CASE 
                            WHEN ijd.transaction_type = 1 THEN
                                (CASE
                                    WHEN (wh_alloc.quantity - (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id)) > 0 THEN
                                        'Open'
                                    ELSE
                                        'Close'
                                END)
                            ELSE
                                NULL
                        END) AS open_close

                        FROM gl_journal_receipt gj, item_journal_details AS ijd, warehouse_allocation AS wh_alloc
                        WHERE 
                            gj.id  = ijd.parent_id AND
                            gj.type = 2 AND
                            wh_alloc.order_id = gj.id AND
                            wh_alloc.item_journal_detail_id = ijd.id AND
                            wh_alloc.type = 3 AND
                            wh_alloc.journal_status = 2 AND
                            ijd.company_id= " . $this->arrUser['company_id'] . "
                UNION ALL
                    SELECT  
                        NULL AS order_id,
                        ob.posting_date AS posting_date, 
                        'Stock Opening Balance' AS docType,
                        ob.container_no AS invoice_code,
                        ob.productID AS item_id,
                        ob.ItemNo AS item_no,
                        ob.description AS item_desc,
                        ob.comm_book_in_no AS consignment_no,
                        ob.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        ob.uom AS unit_measure,
                        CONCAT(wh.wrh_code, ' - ', wh.name) AS warehouse,
                        ob.qty AS quantity,
                        ROUND((ob.price * ob.qty), 0) AS cost_price,
                        NULL AS sale_price,
                        NULL AS unit_sale_price,
                        ROUND(ob.price, 3) AS unit_cost_price,
                        1 AS transaction_type,
                        1 AS posted_on, 
                        (SELECT IFNULL(SUM(w.quantity),0) FROM warehouse_allocation as w WHERE w.ref_po_id=wh_alloc.id) AS invoiced_qty,
                        NULL AS remaining_qty,
                        NULL AS open_close

                        FROM opening_balance_stock AS ob
                        LEFT JOIN warehouse_allocation AS wh_alloc ON wh_alloc.opBalncID = ob.id AND
                                                                        wh_alloc.type = 4 
                        LEFT JOIN warehouse AS wh ON wh.id = ob.warehouseID 
                        WHERE 
                            ob.postStatus = 1 AND
                            ob.company_id= " . $this->arrUser['company_id'] . "
                UNION ALL
                    SELECT  
                        t.id AS order_id,
                        t.order_date AS posting_date, 
                        'Transfer Stock' AS docType,
                        t.code AS invoice_code,
                        td.item_id AS item_id,
                        td.item_code AS item_no,
                        td.item_name AS item_desc,
                        wh_alloc.consignment_no,
                        wh_alloc.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        td.uom_name AS unit_measure,
                        t.warehouse_from_name AS warehouse,
                        (wh_alloc.quantity * -1) AS quantity,
                        NULL AS cost_price,
                        NULL AS sale_price,
                        NULL AS unit_sale_price,
                        NULL AS unit_cost_price,
                        1 AS transaction_type,
                        1 AS posted_on, 
                        NULL AS invoiced_qty,
                        NULL AS remaining_qty,
                        NULL AS open_close


                        FROM transfer_orders AS t, transfer_orders_details AS td, warehouse_allocation AS wh_alloc
                        WHERE 
                            t.id = td.transfer_order_id AND
                            t.type = 1 AND
                            wh_alloc.order_id = t.id AND
                            wh_alloc.transfer_order_detail_id = td.id AND
                            wh_alloc.type = 5 AND
                            wh_alloc.ledger_type = 2 AND
                            t.company_id= " . $this->arrUser['company_id'] . "
                UNION ALL
                    SELECT  
                        t.id AS order_id,
                        t.order_date AS posting_date, 
                        'Transfer Stock' AS docType,
                        t.code AS invoice_code,
                        td.item_id AS item_id,
                        td.item_code AS item_no,
                        td.item_name AS item_desc,
                        wh_alloc.consignment_no,
                        wh_alloc.container_no AS ref_no,
                        wh_alloc.batch_no AS batch_no,
                        td.uom_name AS unit_measure,
                        t.warehouse_to_name AS warehouse,
                        wh_alloc.quantity,
                        NULL AS cost_price,
                        NULL AS sale_price,
                        NULL AS unit_sale_price,
                        NULL AS unit_cost_price,
                        1 AS transaction_type,
                        1 AS posted_on, 
                        NULL AS invoiced_qty,
                        NULL AS remaining_qty,
                        NULL AS open_close

                        FROM transfer_orders AS t, transfer_orders_details AS td, warehouse_allocation AS wh_alloc
                        WHERE 
                            t.id = td.transfer_order_id AND
                            t.type = 1 AND
                            wh_alloc.order_id = t.id AND
                            wh_alloc.transfer_order_detail_id = td.id AND
                            wh_alloc.type = 5 AND
                            wh_alloc.ledger_type = 1 AND
                            t.company_id= " . $this->arrUser['company_id'] . "
                            ) as tbl where 1 $where_clause ";

        $subQueryForBuckets = "SELECT  prd.id
                                FROM productcache prd
                                WHERE prd.id IS NOT NULL ";
        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 11);

        $Sql .= " AND (tbl.item_id IN (".$subQueryForBuckets.") )";


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        
        if ($order_clause == "")
            $order_type = "Order BY posting_date DESC,posted_on DESC";
        else
            $order_type = $order_clause;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], "activity_item", sr_ViewPermission);
        $response['q'] = '';
        $index = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                // $Row['remaining_qty'] = ($Row['invoiced_qty'] != '') ? $Row['quantity'] - $Row['invoiced_qty'] : '';
                // $Row['open_close'] = ($Row['remaining_qty'] != '') ? ((intval($Row['quantity']) > 0) ? 'Open' : 'Close') : '';
                $Row['posting_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $response['response'][] = $Row;
            }
        } else
            $response['response'][] = array();
        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("AllItemsActivity");
        return $response;
    }
    function add_payment_allocation($attr) {
        // print_r($attr);exit;
        $payment_id = $attr['payment_id'];
        $payment_detail_id = $attr['payment_detail_id'];
        $invoice_type = $attr['invoice_type'];
        $module_type = $attr['module_type'];
        $transaction_type = $attr['transaction_type'];
        $entries = "";
        $IsFinalPayment = (isset($attr['IsFinalPayment']) && $attr['IsFinalPayment'] == 1) ? 1 : 0;

        $total_allocated = 0;
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        $TRANSACTION_UNSUCCESSFUL = 0;
        
        
        foreach ($attr['items'] as $item) {
            $total_allocated += $item->amount_allocated;
            $allocation_date = $this->objGeneral->convert_date($item->allocation_date);
            if($item->document_type == 1)
            {
                $Check_Sql = "SELECT (grand_total - ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", $item->document_type) + $item->amount_allocated), 2)) AS invoice_value FROM orders WHERE id=$item->invoice_id";
            }
            else if($item->document_type == 2)
            {
                $Check_Sql = "SELECT (grand_total - ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", $item->document_type) + $item->amount_allocated), 2)) AS invoice_value FROM return_orders WHERE id=$item->invoice_id";
            }
            else if($item->document_type == 3)
            {
                $Check_Sql = "SELECT (grand_total - ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", $item->document_type) + $item->amount_allocated), 2)) AS invoice_value FROM srm_invoice WHERE id=$item->invoice_id";
            }
            else if($item->document_type == 4)
            {
                $Check_Sql = "SELECT (grand_total - ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", $item->document_type) + $item->amount_allocated), 2)) AS invoice_value FROM srm_order_return WHERE id=$item->invoice_id";
            }
            else if($item->document_type == 5 || $item->document_type == 6)
            {
                $Check_Sql = "SELECT ((CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) - ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", $item->document_type) + $item->amount_allocated), 2)) AS invoice_value FROM payment_details WHERE id=$item->invoice_id";
            }
            else if($item->document_type == 7 || $item->document_type == 8 || $item->document_type == 9 || $item->document_type == 10)
            {
                
                $Check_Sql = "SELECT ((CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) - ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", $item->document_type) + $item->amount_allocated), 2)) AS invoice_value FROM opening_balance_customer WHERE id=$item->invoice_id";
            }
            else if($item->document_type == 11 || $item->document_type == 12 || $item->document_type == 13 || $item->document_type == 14)
            {
                $Check_Sql = "SELECT ((CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) - ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", $item->document_type) + $item->amount_allocated), 2)) AS invoice_value FROM opening_balance_bank WHERE id=$item->invoice_id";
            }
            
            $RS1 = $this->objsetup->CSI($Check_Sql);
            if($RS1->fields['invoice_value'] < 0)
            {
                $TRANSACTION_UNSUCCESSFUL = 1;
                break;
            }

            if($TRANSACTION_UNSUCCESSFUL == 0)
            {
                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, status, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                        VALUES ( $payment_id, $payment_detail_id, 1, $item->invoice_id, $invoice_type, $item->document_type, $module_type, $transaction_type, $item->amount_allocated, 
                        ".$this->arrUser['company_id'].",".$this->arrUser['id'].", 0, UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);


                $allocation_entries = "UPDATE payment_details SET allocated_amount = IFNULL(allocated_amount,0) + $item->amount_allocated WHERE id= $payment_detail_id";
                // echo $allocation_entries;exit;
                $RS = $this->objsetup->CSI($allocation_entries);

                if ($item->document_type == 5 || $item->document_type == 6) {
                    $allocation_entries = "UPDATE payment_details SET temp_allocated_amount = IFNULL(temp_allocated_amount,0) + $item->amount_allocated WHERE id= $item->invoice_id";
                    $RS = $this->objsetup->CSI($allocation_entries);
                }
            }
        }

        if($TRANSACTION_UNSUCCESSFUL == 0)
        {
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            $response = array();
            
            $response['ack'] = 1;
            $response['total_allocated'] = $total_allocated;
            $response['error'] = null;
        }
        else
        {
            $this->Conn->rollbackTrans();
            $this->Conn->autoCommit = true;
            $response['ack'] = 0;
            $response['error'] = null;
        }
        return $response;
    }

    function add_payment_allocation_customer($attr) {
        // print_r($attr);exit;

        $invoice_id = $attr['invoice_id']; // invoice id of the item selected for payment
        $payment_id = $attr['payment_id'];
        $payment_detail_id = $attr['payment_detail_id'];
        $document_type = $attr['document_type'];
        $module_type = $attr['module_type'];
        $transaction_type = $attr['transaction_type'];
        $entry_type = $attr['entry_type']; ////1=> sales invoice 2=> credit note, 3=>Payment, 4=> Refund
        $posting_date = $this->objGeneral->convert_date($attr['posting_date']);//$attr['posting_date'];
        $from_entry_currency_rate = $attr['from_entry_currency_rate'];

        $entries = "";
        $IsFinalPayment = (isset($attr['IsFinalPayment']) && $attr['IsFinalPayment'] == 1) ? 1 : 0;
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        if ($IsFinalPayment == 1) {
            $Sql = "SELECT realised_gain_gl_id, realised_gain_gl_name, realised_gain_gl_code,
                        realised_loss_gl_id, realised_loss_gl_name, realised_loss_gl_code
                    FROM currency_movement_setup WHERE company_id= " . $this->arrUser['company_id'];
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            if ($RS->RecordCount() > 0) {
                $realised_gain_gl_id = $RS->fields['realised_gain_gl_id'];
                $realised_gain_gl_code = $RS->fields['realised_gain_gl_code'];
                $realised_gain_gl_name = $RS->fields['realised_gain_gl_name'];

                $realised_loss_gl_id = $RS->fields['realised_loss_gl_id'];
                $realised_loss_gl_code = $RS->fields['realised_loss_gl_code'];
                $realised_loss_gl_name = $RS->fields['realised_loss_gl_name'];
            }
        }

        $TRANSACTION_UNSUCCESSFUL = 0;
        
        foreach ($attr['items'] as $item) {
            if ($item->amount_allocated > 0) {
                $allocation_date = $this->objGeneral->convert_date($item->allocation_date);
                $inv_type = $entry_type; // (FROM ENTRY) 1=> Sale 2=>Credit 3=> Purchase 4=>Debit Note, 5=> Payment, 6=> Refund 
                // $item->invoice_type (FOR TO ENTRY )1=> Sale 2=>Credit 3=> Purchase 4=>Debit Note, 5=> Payment, 6=> Refund
                // echo $entry_type;exit;
                // $item->invoice_type ==> is mapped with document_type
                if ($entry_type == 1 || $entry_type == 2 || $entry_type == 7 || $entry_type == 8 || $entry_type == 11 || $entry_type == 12) {
                    $inv_id = $invoice_id;
                } else {
                    $inv_id = $payment_id;
                }

                if ($item->invoice_type == 1) { // Sales Invoice
                    $Sql = "UPDATE orders SET remaining_amount = ROUND((remaining_amount - $item->amount_allocated), 2), 
                                                    setteled_amount = ROUND((setteled_amount + $item->amount_allocated), 2) 
                            WHERE id = $item->invoice_id AND 
                                company_id = ".$this->arrUser['company_id']." AND
                                grand_total >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 1) + $item->amount_allocated), 2)";
                    // echo $Sql;exit;
                    $RS = $this->objsetup->CSI($Sql);
                    if (!($this->Conn->Affected_Rows() > 0)){
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 2) { // entry from credit note
                            $Sql1 = "UPDATE return_orders SET remaining_amount = ROUND(remaining_amount - $item->amount_allocated, 2), 
                                                        setteled_amount = ROUND(setteled_amount + $item->amount_allocated, 2) 
                                        WHERE id = $inv_id AND 
                                            company_id = ".$this->arrUser['company_id']." AND
                                            grand_total >= ROUND((SR_CalculateSetteledAmount($inv_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 2)  + $item->amount_allocated), 2) ";
                            // echo $Sql1;exit;
                            $RS1 = $this->objsetup->CSI($Sql1);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            }
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS2 = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 5) { // entry from payment
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($payment_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else 
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $payment_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 8) { // entry from Opening balance credit note
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 8) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 11) { // entry from opening balance bank payment
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 11) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {

                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                } else if ($item->invoice_type == 2) { // Credit Note
                    $Sql1 = "UPDATE return_orders SET remaining_amount = ROUND(remaining_amount - $item->amount_allocated, 2), 
                                                    setteled_amount = ROUND(setteled_amount + $item->amount_allocated, 2) 
                                    WHERE id = $item->invoice_id  AND 
                                            company_id = ".$this->arrUser['company_id']." AND
                                            grand_total >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 2)  + $item->amount_allocated), 2) ";

                    // echo $Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1);
                    if (!($this->Conn->Affected_Rows() > 0)) {
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 6) { // entry from refund
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $payment_detail_id  AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($payment_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";                            
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $payment_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 7) {
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id  AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 7) + $item->amount_allocated), 2) ";
                                                    
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 1) {
                            $Sql = "UPDATE orders SET remaining_amount = ROUND(remaining_amount - $item->amount_allocated, 2), 
                                                            setteled_amount = ROUND(setteled_amount + $item->amount_allocated, 2) 
                                        WHERE id = $inv_id  AND 
                                            company_id = ".$this->arrUser['company_id']." AND
                                            grand_total >= ROUND((SR_CalculateSetteledAmount($inv_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 1)  + $item->amount_allocated), 1) ";
                            // echo $Sql;exit;
                            $RS = $this->objsetup->CSI($Sql);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES (  $inv_id, NULL, 2, $item->invoice_id, $inv_type,  $item->invoice_type,$module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 12) { // entry from opening balance bank Refund
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 12) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                } else if ($item->invoice_type == 5) { // Payment
                    if ($entry_type == 1) { // from Sales order

                        $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $item->invoice_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($item->cust_payment_id,$item->invoice_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                        // // echo $allocation_entries;exit;
                        $RS = $this->objsetup->CSI($allocation_entries);
                        if (!($this->Conn->Affected_Rows() > 0)) {
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            // the invoices values may not be updated due to the check but the payment will be decreased, need to handle this 
                            $update_sql = "UPDATE orders AS o SET o.`setteled_amount`= ROUND((o.`setteled_amount` + $item->amount_allocated), 2),
                                                                        o.remaining_amount = ROUND((o.remaining_amount - $item->amount_allocated), 2)
                                                WHERE o.id = $inv_id AND 
                                                                o.company_id = ".$this->arrUser['company_id']." AND
                                                                o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 1) +                                $item->amount_allocated), 2)";
                            // echo $update_sql;exit;
                            $this->objsetup->CSI($update_sql);

                            $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                            // echo "332222--".$Sql;exit; 
                            $RS = $this->objsetup->CSI($Sql);
                        }
                    } else if ($entry_type == 6) { // refund
                        $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $item->invoice_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($item->cust_payment_id,$item->invoice_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                        // echo $allocation_entries;exit;
                        $RS = $this->objsetup->CSI($allocation_entries);

                        
                        if (!($this->Conn->Affected_Rows() > 0)) {
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($inv_id, $payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                        
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $inv_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                        


                    } else if ($entry_type == 7) { // opening balance invoice
                        
                        $allocation_entries1 = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $item->invoice_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($item->cust_payment_id,$item->invoice_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                        // echo $allocation_entries1;exit;
                        $RS = $this->objsetup->CSI($allocation_entries1);
                        
                        if (!($this->Conn->Affected_Rows() > 0)) {
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id  AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 7) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {                                
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, 
                                                    transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }

                    } else if ($entry_type == 12) { // entry from opening balance bank Refund
                        $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $item->invoice_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($item->cust_payment_id,$item->invoice_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                        // // echo $allocation_entries;exit;
                        $RS = $this->objsetup->CSI($allocation_entries);

                        if (!($this->Conn->Affected_Rows() > 0)) {
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id  AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 12) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                } else if ($item->invoice_type == 6) { // Refund
                    if ($entry_type == 2) { // from credit note
                        
                        $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $item->invoice_id  AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($item->cust_payment_id,$item->invoice_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";
                        // // echo $allocation_entries;exit;
                        $RS = $this->objsetup->CSI($allocation_entries);
                        if (!($this->Conn->Affected_Rows() > 0)) {
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            // the invoices values may not be updated due to the check but the payment will be decreased, need to handle this 
                            $update_sql = "UPDATE return_orders AS o SET o.`setteled_amount`= ROUND((o.`setteled_amount` + $item->amount_allocated), 2),
                                                                        o.remaining_amount = ROUND((o.remaining_amount - $item->amount_allocated), 2)
                                                WHERE o.id =  $inv_id AND
                                                                o.company_id = ".$this->arrUser['company_id']." AND
                                                                o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 2) +
                                                                                                $item->amount_allocated), 2)";
                            // echo $update_sql;exit;
                            $this->objsetup->CSI($update_sql);

                            $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $inv_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                            // echo "332222--".$Sql;exit; 
                            $RS = $this->objsetup->CSI($Sql);
                            
                        }
                    } else if ($entry_type == 5) { // payment

                        $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $item->invoice_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($item->cust_payment_id,$item->invoice_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";
                        // echo $allocation_entries;exit;
                        $RS = $this->objsetup->CSI($allocation_entries);
                        if (!($this->Conn->Affected_Rows() > 0)) {
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id  AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($inv_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, 
                                                            amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $inv_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].",
                                                            ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }   


                    } else if ($entry_type == 8) { // entry from Opening balance credit note

                        

                        $allocation_entries1 = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $item->invoice_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($item->cust_payment_id,$item->invoice_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";
                        // echo $allocation_entries1;exit;
                        $RS = $this->objsetup->CSI($allocation_entries1);

                        if (!($this->Conn->Affected_Rows() > 0)) {
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 8) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    } else if ($entry_type == 11) { // entry from Bank Opening balance payment
                        

                        $allocation_entries1 = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $item->invoice_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($inv_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";
                        // echo $allocation_entries1;exit;
                        $RS = $this->objsetup->CSI($allocation_entries1);

                        if (!($this->Conn->Affected_Rows() > 0)) {
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 11) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                    // echo $update_sql;exit;
                    // if($item->invoice_type == 3)
                    // {
                    //     $allocation_entries = "UPDATE payment_details SET allocated_amount = allocated_amount + $item->amount_allocated WHERE id= $item->invoice_id";
                    //     $RS = $this->objsetup->CSI($allocation_entries);
                    // }
                } else if ($item->invoice_type == 7) { // Customer opening balance invoice
                    $Sql1 = "UPDATE opening_balance_customer SET allocated_amount = allocated_amount + $item->amount_allocated 
                                WHERE id = $item->invoice_id  AND 
                                        company_id = ".$this->arrUser['company_id']." AND
                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 7) + $item->amount_allocated), 2) ";
                    // echo '22'.$Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1);
                    if (!($this->Conn->Affected_Rows() > 0)) {
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 2) { // credit note
                            $update_sql = "UPDATE return_orders AS o SET o.`setteled_amount`= o.`setteled_amount` + $item->amount_allocated,
                                                                        o.remaining_amount = o.remaining_amount -  $item->amount_allocated
                                                WHERE o.id = $inv_id AND
                                                                o.company_id = ".$this->arrUser['company_id']." AND
                                                                o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 2) + $item->amount_allocated ), 2)";
                            // echo $update_sql;exit;
                            $RS1 = $this->objsetup->CSI($update_sql);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                            
                        } else if ($entry_type == 5) { // Payment
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($inv_id, $payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, 
                                                                transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $inv_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 8) { // Opening balance credit note
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 8) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 11) { // entry from Bank Opening balance payment
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 11) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                } else if ($item->invoice_type == 8) { // Customer opening balance Credit Note
                    $Sql1 = "UPDATE opening_balance_customer SET allocated_amount = allocated_amount + $item->amount_allocated 
                                WHERE id = $item->invoice_id AND 
                                        company_id = ".$this->arrUser['company_id']." AND
                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 8) + $item->amount_allocated), 2) ";
                    // echo '33-'.$Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1);

                    if (!($this->Conn->Affected_Rows() > 0)) {
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 1) { // Sales Invoice
                            $update_sql = "UPDATE orders AS o SET o.`setteled_amount`= o.`setteled_amount` + $item->amount_allocated,
                                                                        o.remaining_amount = o.remaining_amount -  $item->amount_allocated
                                                WHERE o.id = $inv_id AND
                                                                o.company_id = ".$this->arrUser['company_id']." AND
                                                                o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 1) + $item->amount_allocated), 2)";
                            // echo $update_sql;exit;
                            $RS = $this->objsetup->CSI($update_sql);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {                            
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                            
                        } else if ($entry_type == 6) { // Refund
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($inv_id, $payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);

                            $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $payment_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                            // echo $Sql;exit;
                            $RS = $this->objsetup->CSI($Sql);
                        } else if ($entry_type == 7) { // opening balance credit note
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) WHERE id= $invoice_id";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);

                            $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                            // echo $Sql;exit;
                            $RS = $this->objsetup->CSI($Sql);
                        } else if ($entry_type == 12) { // entry from opening balance bank Refund
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) WHERE id= $invoice_id";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);

                            $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                            // echo $Sql;exit;
                            $RS = $this->objsetup->CSI($Sql);
                        }
                    }
                } else if ($item->invoice_type == 11) { // Bank opening balance Payment
                    $Sql1 = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0) + $item->amount_allocated), 2) 
                            WHERE id = $item->invoice_id AND 
                                        company_id = ".$this->arrUser['company_id']." AND
                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 11) + $item->amount_allocated), 2) ";
                    // echo $Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1);
                    if (!($this->Conn->Affected_Rows() > 0)) {
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 1) { // Sales Invoice
                            $update_sql = "UPDATE orders AS o SET o.`setteled_amount`= o.`setteled_amount` + $item->amount_allocated,
                                                                        o.remaining_amount = o.remaining_amount -  $item->amount_allocated
                                                WHERE o.id = $inv_id AND
                                                                o.company_id = ".$this->arrUser['company_id']." AND
                                                                o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 1) + $item->amount_allocated), 2)";
                            // echo $update_sql;exit;
                            $this->objsetup->CSI($update_sql);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, 
                                                                        amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }                            
                        } else if ($entry_type == 6) { // Refund
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($inv_id, $payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $payment_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 7) { // opening balance invoice
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id  AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 7) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 12) { // entry from opening balance bank Refund
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id  AND 
                                                            company_id = ".$this->arrUser['company_id']." AND
                                                            (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 12) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                } else if ($item->invoice_type == 12) { // Bank opening balance Refund
                    $Sql1 = "UPDATE opening_balance_bank SET allocated_amount = allocated_amount + $item->amount_allocated 
                            WHERE id = $item->invoice_id AND 
                                    company_id = ".$this->arrUser['company_id']." AND
                                    (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 12) + $item->amount_allocated), 2) ";
                    // echo $Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1);
                    if (!($this->Conn->Affected_Rows() > 0)) {
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 2) { // credit note
                            
                            $update_sql = "UPDATE return_orders AS o SET o.`setteled_amount`= ROUND((o.`setteled_amount` + $item->amount_allocated), 2),
                                                                        o.remaining_amount = ROUND((o.remaining_amount -  $item->amount_allocated), 2)
                                                WHERE o.id = $inv_id AND
                                                                o.company_id = ".$this->arrUser['company_id']." AND
                                                                o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 2) + $item->amount_allocated), 2)";
                            // echo $update_sql;exit;
                            $RS = $this->objsetup->CSI($update_sql);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 5) { // Payment
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id  AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($inv_id, $payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $payment_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 8) { // Opening balance credit note
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id  AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 8) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 11) { // Bank Opening balance payment
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id  AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 11) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)) {
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                }
                // 1=> sales invoice 2=> credit note, 5=>Payment, 6=> Refund, 7=> Customer opening balance invoice, 8=> Customer opening balance Credit Note, 
                // 9=> Supplier opening balance invoice, 10=> Supplier opening balance Credit Note, 11=> Customer Opening balance Payment (bank),
                // 12=> Customer Opening balance Refund (bank), 13=> Supplier Opening balance Payment (bank), 14=> Supplier Opening balance Refund (bank) 
                // (entry from)1=> sales invoice 2=> credit note, 3=> Purchase Invoice, 
                // 4=> Debit Note, 5=>Payment, 6=> Refund, 7=> Customer opening balance invoice, 
                // 8=> Customer opening balance Credit Note, 9=> Supplier opening balance invoice, 
                // 10=> Supplier opening balance Credit Note, 
                // 11=> Customer Opening balance Payment (bank), 12=> Customer Opening balance Refund (bank), 13=> Supplier Opening balance Payment (bank), 14=> Supplier Opening balance Refund (bank)
                // if($entry_type == 5 || $entry_type = 6) // payment from payment/refund
                {
                    // ---------------- For currency gain ----------------------------------------

                    $org_currency_rate = 0; // currency rate of the invoice which is going to be setteled (for example invoice)
                    $from_currency_rate = 0; // currency rate of the document from which the invoice is going to be setteled (for example payment) - current rate
                    $ref_id = $payment_detail_id;
                    $temp_object_id = $payment_id;
                    $item_posting_date  = $this->objGeneral->convert_date($item->posting_date);
                    if ($posting_date > $item_posting_date) {
                        $recorded_posting_date = $posting_date;
                    } else {
                        $recorded_posting_date = $item_posting_date;
                    }
                    $gl_entry_type = 5; // 1=> Sales Txn, 2=>Credit Note Txn, 3=> Purchase Txn, 4=> Debit Note Txn, 5=> Ledger Entry,
                    // 6=> Opening Balances Bank Entry,7=> Opening Balances Stock Entry,8=> Opening Balances customer Entry,
                    // 9=> Opening Balances Supplier Entry,10=> Opening Balances GL Entry, 11=> Item Journal, 12=> VAT Posting
                    /*
                      // straight entry
                      $org_currency_rate = $item->currency_rate;
                      $from_currency_rate = $from_entry_currency_rate;
                     */

                    /*
                      // inverse entry
                      $org_currency_rate = $from_entry_currency_rate;
                      $from_currency_rate = $item->currency_rate;
                     */
                    if ($entry_type == 5) { // from payment
                        // straight
                        $org_currency_rate = $item->currency_rate;
                        $from_currency_rate = $from_entry_currency_rate;
                    } else if ($entry_type == 6) { // from refund
                        // if($item->invoice_type == 5) // setteling from refund to payment
                        {
                            // reverse
                            $org_currency_rate = $from_entry_currency_rate;
                            $from_currency_rate = $item->currency_rate;
                            if ($item->invoice_type == 2) { // to credit note
                                $ref_id = 0;
                                $temp_object_id = $item->invoice_id;
                                $gl_entry_type = 2;
                            } else if ($item->invoice_type == 5) {// to payment
                                $ref_id = $item->invoice_id;
                                $temp_object_id = $item->cust_payment_id;
                                $gl_entry_type = 5;
                            } else if ($item->invoice_type == 11) {// opening balance payment
                                $ref_id = 0;
                                $temp_object_id = $item->invoice_id;
                                $gl_entry_type = 6;
                            } else if ($item->invoice_type == 8) {// opening balance credit note, 
                                $temp_object_id = $item->invoice_id;
                                $ref_id = 0;
                                $gl_entry_type = 8;
                            }
                        }
                        /* else
                          {
                          // straight
                          $org_currency_rate = $item->currency_rate;
                          $from_currency_rate = $from_entry_currency_rate;
                          } */
                    } else if ($entry_type == 1) { // from sales invoice
                        if ($item->invoice_type == 5) { // setteling from sales invoice to payment
                            // reverse
                            $org_currency_rate = $from_entry_currency_rate;
                            $from_currency_rate = $item->currency_rate;
                            $ref_id = $item->invoice_id;
                            $temp_object_id = $item->cust_payment_id;
                        } else {
                            // straight
                            $org_currency_rate = $item->currency_rate;
                            $from_currency_rate = $from_entry_currency_rate;
                            $gl_entry_type = 1;
                            $temp_object_id = $attr['invoice_id'];
                            // $temp_object_id = $item->cust_payment_id;
                        }
                    } else if ($entry_type == 2) { // from credit note
                        // if($item->invoice_type == 1 || $item->invoice_type == 6) // setteling with sales invoice or refund
                        // {
                        // reverse
                        $org_currency_rate = $from_entry_currency_rate;
                        $from_currency_rate = $item->currency_rate;
                        if ($item->invoice_type == 1) {
                            $temp_object_id = $item->invoice_id;
                            $ref_id = 0;
                            $gl_entry_type = 1;
                        } else if ($item->invoice_type == 6) {
                            $ref_id = $item->invoice_id;
                            $temp_object_id = $item->cust_payment_id;
                            $gl_entry_type = 5;
                        } else if ($item->invoice_type == 7) {
                            $ref_id = 0;
                            $temp_object_id = $item->invoice_id;
                            $gl_entry_type = 8;
                        } else if ($item->invoice_type == 12) {
                            $ref_id = 0;
                            $temp_object_id = $item->invoice_id;
                            $gl_entry_type = 6;
                        }
                        /* }
                          else // for opening balance invoice, opening balance refund
                          {
                          // reverse
                          $org_currency_rate = $from_entry_currency_rate;
                          $from_currency_rate = $item->currency_rate;

                          $gl_entry_type = 2;
                          $temp_object_id = $attr['invoice_id'];
                          } */
                    } else if ($entry_type == 7) { // opening balance invoice
                        // if($item->invoice_type == 5 || $item->invoice_type == 2) // setteling with payment or credit note
                        {
                            // reverse
                            $org_currency_rate = $from_entry_currency_rate;
                            $from_currency_rate = $item->currency_rate;
                            if ($item->invoice_type == 2) { // credit note
                                $temp_object_id = $item->invoice_id;
                                $ref_id = 0;
                                $gl_entry_type = 2;
                            } else if ($item->invoice_type == 5) { // payment
                                $ref_id = $item->invoice_id;
                                $temp_object_id = $item->cust_payment_id;
                                $gl_entry_type = 5;
                            } else if ($item->invoice_type == 8) { // opening balance credit note
                                $temp_object_id = $item->invoice_id;
                                $ref_id = 0;
                                $gl_entry_type = 8;
                            } else if ($item->invoice_type == 11) { // opening balance payment
                                $temp_object_id = $item->invoice_id;
                                $ref_id = 0;
                                $gl_entry_type = 6;
                            }
                        }
                        /* else
                          {
                          // straight
                          $org_currency_rate = $item->currency_rate;
                          $from_currency_rate = $from_entry_currency_rate;
                          $gl_entry_type = 8;
                          } */
                    } else if ($entry_type == 8) { // opening balance credit note
                        if ($item->invoice_type == 12) { // opening balance refund
                            // straight
                            $org_currency_rate = $item->currency_rate;
                            $from_currency_rate = $from_entry_currency_rate;
                            $temp_object_id = $attr['invoice_id'];
                            $ref_id = 0;
                            $gl_entry_type = 8;
                        } else {
                            // reverse
                            $org_currency_rate = $from_entry_currency_rate;
                            $from_currency_rate = $item->currency_rate;
                            if ($item->invoice_type == 6) { // refund
                                $temp_object_id = $item->cust_payment_id;
                                $ref_id = $item->invoice_id;
                                $gl_entry_type = 5;
                            } else if ($item->invoice_type == 7) { // opening balance invoice
                                $temp_object_id = $item->invoice_id; //$item->cust_payment_id;
                                $ref_id = 0;
                                $gl_entry_type = 8;
                            } else if ($item->invoice_type == 1) { // sales invoice
                                $temp_object_id = $item->invoice_id;
                                $ref_id = 0;
                                $gl_entry_type = 1;
                            }
                        }
                    } else if ($entry_type == 12) { // opening balance refund
                        /* if($item->invoice_type == 11)// opening balance payment
                          {
                          // straight
                          $org_currency_rate = $item->currency_rate;
                          $from_currency_rate = $from_entry_currency_rate;
                          $gl_entry_type = 6;
                          $temp_object_id = $attr['invoice_id'];
                          }
                          else */ {
                            // reverse
                            $org_currency_rate = $from_entry_currency_rate;
                            $from_currency_rate = $item->currency_rate;
                            if ($item->invoice_type == 2) { // credit note
                                $temp_object_id = $item->invoice_id;
                                $ref_id = 0;
                                $gl_entry_type = 2;
                            } else if ($item->invoice_type == 5) { // payment
                                $temp_object_id = $item->cust_payment_id;
                                $ref_id = $item->invoice_id;
                                $gl_entry_type = 5;
                            } else if ($item->invoice_type == 8) { // opening balance credit note
                                $temp_object_id = $item->invoice_id;
                                $ref_id = 0;
                                $gl_entry_type = 8;
                            } else if ($item->invoice_type == 11) { //  opening balance payment
                                $temp_object_id = $item->invoice_id;
                                $ref_id = 0;
                                $gl_entry_type = 6;
                            }
                        }
                    } else if ($entry_type == 11) { // opening balance payment
                        /* if($item->invoice_type == 12) // opening balance refund
                          {
                          // reverse
                          $org_currency_rate = $from_entry_currency_rate;
                          $from_currency_rate = $item->currency_rate;
                          $temp_object_id = $item->invoice_id;
                          $ref_id = 0;
                          $gl_entry_type = 6;
                          }
                          else */ {
                            // straight
                            $org_currency_rate = $item->currency_rate;
                            $from_currency_rate = $from_entry_currency_rate;
                            $gl_entry_type = 6;
                            $temp_object_id = $attr['invoice_id'];
                            $ref_id = 0;
                        }
                        /* if($item->invoice_type == 1) // Sales invoice
                          {
                          $temp_object_id = $item->invoice_id;
                          $ref_id = 0;
                          $gl_entry_type = 1;
                          }
                          else if($item->invoice_type == 6) // refund
                          {
                          $temp_object_id = $item->cust_payment_id;
                          $ref_id = $item->invoice_id;
                          $gl_entry_type = 5;
                          }
                          else if($item->invoice_type == 7) // opening balnace invoice
                          {
                          $temp_object_id = $item->cust_payment_id;
                          $ref_id = $item->invoice_id;
                          $gl_entry_type = 8;
                          }
                          else if($item->invoice_type == 12) // opening balnace refund
                          {
                          $temp_object_id = $item->cust_payment_id;
                          $ref_id = $item->invoice_id;
                          $gl_entry_type = 6;
                          } */
                    }
                    $check_gain = "SELECT SR_CalucateCurrencyGainLoss($item->currency_id, 
                                                                    $org_currency_rate, 
                                                                    $from_currency_rate, 
                                                                    $item->converted_currency_id, 
                                                                    $item->amount_allocated,
                                                                    $posting_date,
                                                                    1) AS total";
                    // echo $check_gain;exit;
                    $RS = $this->objsetup->CSI($check_gain);
                    if ($RS->fields['total'] > 0) {
                        $total_gain_loss = $RS->fields['total'];
                        $CG_SQL = "INSERT INTO gl_account_txn SET 
                                        object_id = $temp_object_id,
                                        type = $gl_entry_type, 
                                        company_id = " . $this->arrUser['company_id'] . ", 
                                        user_id = " . $this->arrUser['id'] . ",
                                        gl_account_id = $realised_gain_gl_id,
                                        gl_account_code = '$realised_gain_gl_code',
                                        gl_account_name = '$realised_gain_gl_name',
                                        debit_amount = 0, 
                                        credit_amount = " . $total_gain_loss . ", 
                                        AddedBy = " . $this->arrUser['id'] . ",
                                        invoice_date =  $recorded_posting_date,
                                        AddedOn =  UNIX_TIMESTAMP (NOW()),
                                        transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1),
                                        ref_id=$ref_id";
                        // echo $CG_SQL;exit;
                        $RS = $this->objsetup->CSI($CG_SQL);
                        $table_name = "";
                        $field_name = "";
                        $gl_account = "";
                        if ($module_type == 1) { // customer
                            $gl_account = "salesAccountDebators";
                            if ($item->invoice_type == 1) { // sales order
                                $table_name = "orders";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 2) { // Credit Note
                                $table_name = "return_orders";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 5 || $item->invoice_type == 6) { // payment/refund
                                $table_name = "payment_details";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 7 || $item->invoice_type == 8 || $item->invoice_type == 9 || $item->invoice_type == 10) { // opening balance customer/supplier (invoice/credit note)
                                $table_name = "opening_balance_customer";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 11 || $item->invoice_type == 12 || $item->invoice_type == 13 || $item->invoice_type == 14) { // opening balance bank customer/supplier (payment/refund)
                                $table_name = "opening_balance_bank";
                                $field_name = "posting_group_id";
                            }
                        } else if ($module_type == 2) { // supplier
                            $gl_account = "purchaseAccountCreditors";
                            if ($item->invoice_type == 3) { // Purchase order
                                $table_name = "srm_invoice";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 4) { // Debit Note 
                                $table_name = "srm_order_return";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 5 || $item->invoice_type == 6) { // payment/refund
                                $table_name = "payment_details";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 7 || $item->invoice_type == 8 || $item->invoice_type == 9 || $item->invoice_type == 10) { // opening balance customer/supplier (invoice/credit note)
                                $table_name = "opening_balance_customer";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 11 || $item->invoice_type == 12 || $item->invoice_type == 13 || $item->invoice_type == 14) { // opening balance bank customer/supplier (payment/refund)
                                $table_name = "opening_balance_bank";
                                $field_name = "posting_group_id";
                            }
                        }

                        if ($table_name != "") {
                            $CG_SQL1 = "INSERT INTO gl_account_txn SET 
                                        object_id = $temp_object_id,
                                        type = $gl_entry_type, 
                                        company_id = " . $this->arrUser['company_id'] . ", 
                                        user_id = " . $this->arrUser['id'] . ",
                                        gl_account_id = (SELECT isetup.$gl_account
                                                            FROM inventory_setup AS isetup, gl_account AS ga
                                                            WHERE 
                                                                ga.id = isetup.$gl_account AND
                                                                isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                                isetup.type = 1 AND
                                                                isetup.company_id = " . $this->arrUser['company_id'] . "
                                                            LIMIT 1),
                                        gl_account_code = (SELECT ga.accountCode
                                                            FROM inventory_setup AS isetup, gl_account AS ga
                                                            WHERE 
                                                                ga.id = isetup.$gl_account AND
                                                                isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                                isetup.type = 1 AND
                                                                isetup.company_id = " . $this->arrUser['company_id'] . "
                                                            LIMIT 1),
                                        gl_account_name = (SELECT ga.displayName
                                                            FROM inventory_setup AS isetup, gl_account AS ga
                                                            WHERE 
                                                                ga.id = isetup.$gl_account AND
                                                                isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                                isetup.type = 1 AND
                                                                isetup.company_id = " . $this->arrUser['company_id'] . "
                                                            LIMIT 1),
                                        debit_amount = " . $total_gain_loss . ",
                                        credit_amount = 0,
                                        AddedBy = " . $this->arrUser['id'] . ",
                                        invoice_date =  $recorded_posting_date,
                                        AddedOn =  UNIX_TIMESTAMP (NOW()),
                                        transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1),
                                        ref_id=$ref_id";
                            // echo $CG_SQL1;exit;
                            $RS1 = $this->objsetup->CSI($CG_SQL1);
                        }
                    }
                    // ---------------- For currency Loss ----------------------------------------
                    $check_loss = "SELECT SR_CalucateCurrencyGainLoss($item->currency_id, 
                                                                    $org_currency_rate, 
                                                                    $from_currency_rate, 
                                                                    $item->converted_currency_id, 
                                                                    $item->amount_allocated, 
                                                                    $posting_date, 
                                                                    2) AS total";
                    $RS = $this->objsetup->CSI($check_loss);
                    if ($RS->fields['total'] > 0) {
                        $total_gain_loss = $RS->fields['total'];
                        $CL_SQL = "INSERT INTO gl_account_txn SET 
                                        object_id = $temp_object_id,
                                        type = $gl_entry_type, 
                                        company_id = " . $this->arrUser['company_id'] . ", 
                                        user_id = " . $this->arrUser['id'] . ",
                                        gl_account_id = $realised_loss_gl_id,
                                        gl_account_code = '$realised_loss_gl_code',
                                        gl_account_name = '$realised_loss_gl_name',
                                        debit_amount = " . $total_gain_loss . ",
                                        credit_amount = 0, 
                                        AddedBy = " . $this->arrUser['id'] . ",
                                        invoice_date =  $recorded_posting_date,
                                        AddedOn =  UNIX_TIMESTAMP (NOW()),
                                        transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1),
                                        ref_id=$ref_id";
                        // echo $CL_SQL;exit;
                        $RS = $this->objsetup->CSI($CL_SQL);

                        $table_name = "";
                        $field_name = "";
                        $gl_account = "";
                        if ($module_type == 1) { // customer
                            $gl_account = "salesAccountDebators";
                            if ($item->invoice_type == 1) { // sales order
                                $table_name = "orders";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 2) { // Credit Note
                                $table_name = "return_orders";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 5 || $item->invoice_type == 6) { // payment/refund
                                $table_name = "payment_details";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 7 || $item->invoice_type == 8 || $item->invoice_type == 9 || $item->invoice_type == 10) { // opening balance customer/supplier (invoice/credit note)
                                $table_name = "opening_balance_customer";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 11 || $item->invoice_type == 12 || $item->invoice_type == 13 || $item->invoice_type == 14) { // opening balance bank customer/supplier (payment/refund)
                                $table_name = "opening_balance_bank";
                                $field_name = "posting_group_id";
                            }
                        } else if ($module_type == 2) { // supplier
                            $gl_account = "purchaseAccountCreditors";
                            if ($item->invoice_type == 3) { // Purchase order
                                $table_name = "srm_invoice";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 4) { // Debit Note 
                                $table_name = "srm_order_return";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 5 || $item->invoice_type == 6) { // payment/refund
                                $table_name = "payment_details";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 7 || $item->invoice_type == 8 || $item->invoice_type == 9 || $item->invoice_type == 10) { // opening balance customer/supplier (invoice/credit note)
                                $table_name = "opening_balance_customer";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 11 || $item->invoice_type == 12 || $item->invoice_type == 13 || $item->invoice_type == 14) { // opening balance bank customer/supplier (payment/refund)
                                $table_name = "opening_balance_bank";
                                $field_name = "posting_group_id";
                            }
                        }

                        if ($table_name != "") {
                            $CG_SQL1 = "INSERT INTO gl_account_txn SET 
                                        object_id = $temp_object_id,
                                        type = $gl_entry_type, 
                                        company_id = " . $this->arrUser['company_id'] . ", 
                                        user_id = " . $this->arrUser['id'] . ",
                                        gl_account_id = (SELECT isetup.$gl_account
                                                            FROM inventory_setup AS isetup, gl_account AS ga
                                                            WHERE 
                                                                ga.id = isetup.$gl_account AND
                                                                isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                                isetup.type = 1 AND
                                                                isetup.company_id = " . $this->arrUser['company_id'] . "
                                                            LIMIT 1),
                                        gl_account_code = (SELECT ga.accountCode
                                                            FROM inventory_setup AS isetup, gl_account AS ga
                                                            WHERE 
                                                                ga.id = isetup.$gl_account AND
                                                                isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                                isetup.type = 1 AND
                                                                isetup.company_id = " . $this->arrUser['company_id'] . "
                                                            LIMIT 1),
                                        gl_account_name = (SELECT ga.displayName
                                                            FROM inventory_setup AS isetup, gl_account AS ga
                                                            WHERE 
                                                                ga.id = isetup.$gl_account AND
                                                                isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                                isetup.type = 1 AND
                                                                isetup.company_id = " . $this->arrUser['company_id'] . "
                                                            LIMIT 1),
                                        debit_amount = 0,
                                        credit_amount = " . $total_gain_loss . ",
                                        AddedBy = " . $this->arrUser['id'] . ",
                                        invoice_date =  $recorded_posting_date,
                                        AddedOn =  UNIX_TIMESTAMP (NOW()),
                                        transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1),
                                        ref_id=$ref_id";
                            // echo $CG_SQL1;exit;
                            $RS1 = $this->objsetup->CSI($CG_SQL1);
                        }
                    }
                }
            }
        }

        if($TRANSACTION_UNSUCCESSFUL == 0)
        { 
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $response['ack'] = 1;
            $response['error'] = null;
        }
        else
        {
            $this->Conn->rollbackTrans();
            $this->Conn->autoCommit = true;
            $response['ack'] = 0;
            $response['error'] = null;
        }
        return $response;
    }

    function add_payment_allocation_supplier($attr) {
        // print_r($attr);exit;

        $invoice_id = $attr['invoice_id']; // invoice id of the item selected for payment
        $payment_id = $attr['payment_id'];
        $payment_detail_id = $attr['payment_detail_id'];
        $document_type = $attr['document_type'];
        $module_type = $attr['module_type'];
        $transaction_type = $attr['transaction_type'];
        $entry_type = $attr['entry_type']; ////1=> sales invoice 2=> credit note, 3=>Payment, 4=> Refund
        $posting_date = $this->objGeneral->convert_date($attr['posting_date']);//$attr['posting_date'];
        $from_entry_currency_rate = $attr['from_entry_currency_rate'];

        $entries = "";
        $IsFinalPayment = (isset($attr['IsFinalPayment']) && $attr['IsFinalPayment'] == 1) ? 1 : 0;
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        if ($IsFinalPayment == 1) {
            $Sql = "SELECT realised_gain_gl_id, realised_gain_gl_name, realised_gain_gl_code,
                        realised_loss_gl_id, realised_loss_gl_name, realised_loss_gl_code
                    FROM currency_movement_setup WHERE company_id= " . $this->arrUser['company_id'];
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            if ($RS->RecordCount() > 0) {
                $realised_gain_gl_id = $RS->fields['realised_gain_gl_id'];
                $realised_gain_gl_code = $RS->fields['realised_gain_gl_code'];
                $realised_gain_gl_name = $RS->fields['realised_gain_gl_name'];

                $realised_loss_gl_id = $RS->fields['realised_loss_gl_id'];
                $realised_loss_gl_code = $RS->fields['realised_loss_gl_code'];
                $realised_loss_gl_name = $RS->fields['realised_loss_gl_name'];
            }
        }

        $TRANSACTION_UNSUCCESSFUL = 0;

        foreach ($attr['items'] as $item) {
            if ($item->amount_allocated > 0) {
                $allocation_date = $this->objGeneral->convert_date($item->allocation_date);
                $inv_type = $entry_type; // (FROM ENTRY) 1=> Sale 2=>Credit 3=> Purchase 4=>Debit Note, 5=> Payment, 6=> Refund 
                // $item->invoice_type (FOR TO ENTRY )1=> Sale 2=>Credit 3=> Purchase 4=>Debit Note, 5=> Payment, 6=> Refund
                // echo $entry_type;exit;
                // $item->invoice_type ==> is mapped with document_type
                if ($entry_type == 3 || $entry_type == 4 || $entry_type == 9 || $entry_type == 10 || $entry_type == 13 || $entry_type == 14) {
                    $inv_id = $invoice_id;
                } else {
                    $inv_id = $payment_id;
                }

                if ($item->invoice_type == 3) { // Purchase Invoice
                    $Sql = "UPDATE srm_invoice SET remaining_amount = ROUND(remaining_amount - $item->amount_allocated, 2), 
                                                    setteled_amount = ROUND(setteled_amount + $item->amount_allocated, 2) 
                                    WHERE id = $item->invoice_id AND
                                        company_id = ".$this->arrUser['company_id']." AND
                                        grand_total >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 3) + $item->amount_allocated), 2)";
                    // echo $Sql;exit;
                    $RS = $this->objsetup->CSI($Sql);
                    if (!($this->Conn->Affected_Rows() > 0)){
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 4) { // entry from debit note
                            $Sql1 = "UPDATE srm_order_return SET remaining_amount = ROUND(remaining_amount - $item->amount_allocated, 2), 
                                                        setteled_amount = ROUND(setteled_amount + $item->amount_allocated, 2) 
                                        WHERE id = $inv_id AND
                                            company_id = ".$this->arrUser['company_id']." AND
                                            grand_total >= ROUND((SR_CalculateSetteledAmount($inv_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 4) + $item->amount_allocated), 2)";
                            // echo $Sql1;exit;
                            $RS1 = $this->objsetup->CSI($Sql1);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 5) { // entry from payment
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($payment_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $payment_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 10) { // entry from Opening balance debit note
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id  AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 10) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 13) { // entry from opening balance bank payment
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 13) + $item->amount_allocated), 2)";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                } else if ($item->invoice_type == 4) { // Debit Note
                    $Sql1 = "UPDATE srm_order_return SET remaining_amount = ROUND(remaining_amount - $item->amount_allocated, 2), 
                                                    setteled_amount = ROUND(setteled_amount + $item->amount_allocated, 2) 
                                    WHERE id = $item->invoice_id  AND 
                                        company_id = ".$this->arrUser['company_id']." AND
                                        grand_total >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 4)  + $item->amount_allocated), 2) ";
                    // echo $Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1);
                    if (!($this->Conn->Affected_Rows() > 0)){
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 6) { // entry from refund
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($payment_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS1 = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $payment_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 9) { // entry from openning balance invoice
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 9) + $item->amount_allocated), 2) ";

                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 3) { // entry from purchase invoice
                            $Sql = "UPDATE srm_invoice SET remaining_amount = ROUND(remaining_amount - $item->amount_allocated, 2), 
                                                            setteled_amount = ROUND(setteled_amount + $item->amount_allocated, 2) 
                                        WHERE id = $inv_id AND 
                                                company_id = ".$this->arrUser['company_id']." AND
                                                grand_total >= ROUND((SR_CalculateSetteledAmount($inv_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 3)  + $item->amount_allocated), 2) ";
                            // echo $Sql;exit;
                            $RS = $this->objsetup->CSI($Sql);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES (  $inv_id, NULL, 2, $item->invoice_id, $inv_type,  $item->invoice_type,$module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 14) { // entry from opening balance bank Refund
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                          company_id = ".$this->arrUser['company_id']." AND
                                                            (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 14) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                } else if ($item->invoice_type == 5) { // Payment

                    
                    $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                        WHERE id= $item->invoice_id  AND 
                                            company_id = ".$this->arrUser['company_id']." AND
                                            (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($item->cust_payment_id,$item->invoice_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                    // // echo $allocation_entries;exit;
                    $RS = $this->objsetup->CSI($allocation_entries);
                    if (!($this->Conn->Affected_Rows() > 0)){
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 3) { // from Purchase order

                            
                            /* $update_sql = "UPDATE srm_invoice AS o SET o.`setteled_amount`= o.`setteled_amount` + (SELECT pa.`amount_allocated` FROM `payment_allocation` AS pa
                                                                                                WHERE pa.company_id = " . $this->arrUser['company_id'] . " AND pa.`payment_id`= $inv_id AND pa.invoice_id = $item->invoice_id AND pa.`invoice_type` = 3 AND pa.`document_type` = 5 AND pa.`payment_id`=o.id  ORDER BY pa.id DESC LIMIT 1),
                                                                        o.remaining_amount = o.remaining_amount -  (SELECT pa.`amount_allocated` FROM `payment_allocation` AS pa
                                                                                                WHERE pa.company_id = " . $this->arrUser['company_id'] . " AND pa.`payment_id`= $inv_id AND pa.invoice_id = $item->invoice_id AND pa.`invoice_type` = 3 AND pa.`document_type` = 5 AND pa.`payment_id`=o.id  ORDER BY pa.id DESC LIMIT 1)
                                                WHERE o.id IN(SELECT pa.`payment_id` FROM `payment_allocation` AS pa
                                                                WHERE pa.company_id = " . $this->arrUser['company_id'] . " AND pa.`payment_id`= $inv_id AND pa.invoice_id = $item->invoice_id AND pa.`invoice_type` = 3 AND pa.`document_type` = 5);"; */
                            // echo $update_sql;exit;

                            $update_sql = "UPDATE srm_invoice AS o SET o.`setteled_amount`= ROUND((o.`setteled_amount` + $item->amount_allocated), 2),
                                                                        o.remaining_amount = ROUND((o.remaining_amount - $item->amount_allocated), 2)
                                                WHERE o.id = $inv_id AND 
                                                                o.company_id = ".$this->arrUser['company_id']." AND
                                                                o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 3) +                                $item->amount_allocated), 2)";

                            $RS1 = $this->objsetup->CSI($update_sql);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo "332222--".$Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 6) { // refund
                            
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $payment_detail_id  AND 
                                                company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($inv_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";

                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {

                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $inv_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                            

                        } else if ($entry_type == 9) { // opening balance invoice
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 9) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 14) { // entry from opening balance bank Refund
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 14) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                } else if ($item->invoice_type == 6) { // Refund

                    
                    $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                            WHERE id= $item->invoice_id AND 
                                                company_id = ".$this->arrUser['company_id']." AND
                                                (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($item->cust_payment_id,$item->invoice_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";
                    // // echo $allocation_entries;exit;
                    $RS = $this->objsetup->CSI($allocation_entries);

                    if (!($this->Conn->Affected_Rows() > 0)){
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 4) { // from debit note

                            /* $update_sql = "UPDATE srm_order_return AS o SET o.`setteled_amount`= o.`setteled_amount` + (SELECT pa.`amount_allocated` FROM `payment_allocation` AS pa
                                                                                                WHERE pa.company_id = " . $this->arrUser['company_id'] . " AND pa.`payment_id`= $inv_id AND pa.invoice_id = $item->invoice_id AND pa.`invoice_type` = 4 AND pa.`document_type` = 6 AND pa.`payment_id`=o.id  ORDER BY pa.id DESC LIMIT 1),
                                                                        o.remaining_amount = o.remaining_amount -  (SELECT pa.`amount_allocated` FROM `payment_allocation` AS pa
                                                                                                WHERE pa.company_id = " . $this->arrUser['company_id'] . " AND pa.`payment_id`= $inv_id AND pa.invoice_id = $item->invoice_id AND pa.`invoice_type` = 4 AND pa.`document_type` = 6 AND pa.`payment_id`=o.id  ORDER BY pa.id DESC LIMIT 1)
                                                WHERE o.id IN(SELECT pa.`payment_id` FROM `payment_allocation` AS pa
                                                                WHERE pa.company_id = " . $this->arrUser['company_id'] . " AND pa.`payment_id`= $inv_id AND pa.invoice_id = $item->invoice_id AND pa.`invoice_type` = 4 AND pa.`document_type` = 6);"; */
                            $update_sql = "UPDATE srm_order_return AS o SET o.`setteled_amount`= ROUND((o.`setteled_amount` + $item->amount_allocated), 2),
                                                                o.remaining_amount = ROUND((o.remaining_amount - $item->amount_allocated), 2)
                                        WHERE o.id = $inv_id AND 
                                                        o.company_id = ".$this->arrUser['company_id']." AND
                                                        o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 4) +                                $item->amount_allocated), 2)";
                            // echo $update_sql;exit;
                            $RS1 = $this->objsetup->CSI($update_sql);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $inv_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo "332222--".$Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                            
                        } else if ($entry_type == 5) { // payment
                           
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $payment_detail_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($payment_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $inv_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 10) { // entry from Opening balance credit note
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 10) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 13) { // entry from Bank Opening balance payment
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 13) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                } else if ($item->invoice_type == 9) { // Customer opening balance invoice
                    $Sql1 = "UPDATE opening_balance_customer SET allocated_amount = allocated_amount + $item->amount_allocated 
                            WHERE id = $item->invoice_id AND 
                                company_id = ".$this->arrUser['company_id']." AND
                                (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 9) + $item->amount_allocated), 2) ";
                    // echo '22'.$Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1);
                    if (!($this->Conn->Affected_Rows() > 0)){
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 4) { // Debit note
                        
                            $update_sql = "UPDATE srm_order_return AS o SET o.`setteled_amount`= ROUND((o.`setteled_amount` + $item->amount_allocated), 2),
                                                                o.remaining_amount = ROUND((o.remaining_amount - $item->amount_allocated), 2)
                                        WHERE o.id = $inv_id AND 
                                            o.company_id = ".$this->arrUser['company_id']." AND
                                            o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 4) +                                $item->amount_allocated), 2)";
                            // echo $update_sql;exit;
                            $this->objsetup->CSI($update_sql);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 5) { // Payment
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($payment_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $payment_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 10) { // Opening balance credit note
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                            company_id = ".$this->arrUser['company_id']." AND
                                                            (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 10) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 13) { // entry from Bank Opening balance payment
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 13) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                } else if ($item->invoice_type == 10) { // Customer opening balance Credit Note
                    $Sql1 = "UPDATE opening_balance_customer SET allocated_amount = allocated_amount + $item->amount_allocated 
                            WHERE id = $item->invoice_id AND 
                                company_id = ".$this->arrUser['company_id']." AND
                                (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 10) + $item->amount_allocated), 2) ";
                    // echo '33-'.$Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1);
                    if (!($this->Conn->Affected_Rows() > 0)){
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 3) { // Purchase Invoice
                            $update_sql = "UPDATE srm_invoice AS o SET o.`setteled_amount`= ROUND((o.`setteled_amount` + $item->amount_allocated), 2),
                                                                o.remaining_amount = ROUND((o.remaining_amount - $item->amount_allocated), 2)
                                            WHERE o.id = $inv_id AND 
                                                            o.company_id = ".$this->arrUser['company_id']." AND
                                                            o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 3) +                                $item->amount_allocated), 2)";
                            // echo $update_sql;exit;
                            $RS1 = $this->objsetup->CSI($update_sql);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                            
                        } else if ($entry_type == 6) { // Refund
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($payment_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $payment_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 9) { // opening balance credit note
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 9) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 14) { // entry from opening balance bank Refund
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $invoice_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 14) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                } else if ($item->invoice_type == 13) { // Bank opening balance Payment
                    $Sql1 = "UPDATE opening_balance_bank SET allocated_amount = allocated_amount + $item->amount_allocated 
                            WHERE id = $item->invoice_id AND 
                                company_id = ".$this->arrUser['company_id']." AND
                                (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 13) + $item->amount_allocated), 2) ";
                    // echo $Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1);
                    if ($entry_type == 3) { // Purchase Invoice
                    
                        $update_sql = "UPDATE srm_invoice AS o SET o.`setteled_amount`= ROUND((o.`setteled_amount` + $item->amount_allocated), 2),
                                                            o.remaining_amount = ROUND((o.remaining_amount - $item->amount_allocated), 2)
                                        WHERE o.id = $inv_id AND 
                                                        o.company_id = ".$this->arrUser['company_id']." AND
                                                        o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 3) +                                $item->amount_allocated), 2)";
                        // echo $update_sql;exit;
                        $RS1 = $this->objsetup->CSI($update_sql);
                        if (!($this->Conn->Affected_Rows() > 0)){
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                            // echo $Sql;exit; 
                            $RS = $this->objsetup->CSI($Sql);
                        }
                    } else if ($entry_type == 6) { // Refund
                        $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $payment_detail_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($payment_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 6) + $item->amount_allocated), 2) ";
                        // echo $allocation_entries;exit;
                        $RS = $this->objsetup->CSI($allocation_entries);
                        if (!($this->Conn->Affected_Rows() > 0)){
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $payment_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                            // echo $Sql;exit;
                            $RS = $this->objsetup->CSI($Sql);
                        }
                    } else if ($entry_type == 9) { // opening balance credit note
                        $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $invoice_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 9) + $item->amount_allocated), 2) ";
                        // echo $allocation_entries;exit;
                        $RS = $this->objsetup->CSI($allocation_entries);
                        if (!($this->Conn->Affected_Rows() > 0)){
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                            // echo $Sql;exit;
                            $RS = $this->objsetup->CSI($Sql);
                        }
                    } else if ($entry_type == 14) { // entry from opening balance bank Refund
                        $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                WHERE id= $invoice_id AND 
                                                    company_id = ".$this->arrUser['company_id']." AND
                                                    (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 14) + $item->amount_allocated), 2) ";
                        // echo $allocation_entries;exit;
                        $RS = $this->objsetup->CSI($allocation_entries);
                        if (!($this->Conn->Affected_Rows() > 0)){
                            $TRANSACTION_UNSUCCESSFUL = 1;
                        } 
                        else
                        {
                            $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                    VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                            // echo $Sql;exit;
                            $RS = $this->objsetup->CSI($Sql);
                        }
                    }
                } else if ($item->invoice_type == 14) { // Bank opening balance Refund
                    $Sql1 = "UPDATE opening_balance_bank SET allocated_amount = allocated_amount + $item->amount_allocated 
                            WHERE id = $item->invoice_id AND 
                                company_id = ".$this->arrUser['company_id']." AND
                                (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($item->invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 14) + $item->amount_allocated), 2) ";
                    // echo $Sql1;exit;
                    $RS1 = $this->objsetup->CSI($Sql1);
                    
                    if (!($this->Conn->Affected_Rows() > 0)){
                        $TRANSACTION_UNSUCCESSFUL = 1;
                    } 
                    else
                    {
                        if ($entry_type == 4) { // debit note

                            $update_sql = "UPDATE srm_order_return AS o SET o.`setteled_amount`= ROUND((o.`setteled_amount` + $item->amount_allocated), 2),
                                                                o.remaining_amount = ROUND((o.remaining_amount - $item->amount_allocated), 2)
                                        WHERE o.id = $inv_id AND 
                                            o.company_id = ".$this->arrUser['company_id']." AND
                                            o.grand_total >= ROUND((SR_CalculateSetteledAmount(o.id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 4) +                                $item->amount_allocated), 2)";
                            // echo $update_sql;exit;
                            $this->objsetup->CSI($update_sql);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $inv_id, NULL, 2,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit; 
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 5) { // Payment
                            $allocation_entries = "UPDATE payment_details SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $payment_detail_id AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN credit_amount > 0 THEN credit_amount ELSE debit_amount END) >= ROUND((SR_CalculateSetteledAmount($payment_id,$payment_detail_id,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 5) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $payment_id, $payment_detail_id, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 10) { // Opening balance credit note
                            $allocation_entries = "UPDATE opening_balance_customer SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id  AND 
                                                        company_id = ".$this->arrUser['company_id']." AND
                                                        (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 10) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        } else if ($entry_type == 13) { // Bank Opening balance payment
                            $allocation_entries = "UPDATE opening_balance_bank SET allocated_amount = ROUND((IFNULL(allocated_amount,0)  + $item->amount_allocated), 2) 
                                                    WHERE id= $invoice_id AND 
                                                            company_id = ".$this->arrUser['company_id']." AND
                                                            (CASE WHEN creditAmount > 0 THEN creditAmount ELSE debitAmount END) >= ROUND((SR_CalculateSetteledAmount($invoice_id,0,'1971-01-01', '2099-01-01',".$this->arrUser['company_id'].", 13) + $item->amount_allocated), 2) ";
                            // echo $allocation_entries;exit;
                            $RS = $this->objsetup->CSI($allocation_entries);
                            
                            if (!($this->Conn->Affected_Rows() > 0)){
                                $TRANSACTION_UNSUCCESSFUL = 1;
                            } 
                            else
                            {
                                $Sql = "INSERT INTO payment_allocation (payment_id, payment_detail_id, payment_type, invoice_id, invoice_type, document_type, module_type, transaction_type, amount_allocated, company_id, user_id, date_created, allocation_date, allocation_dateUnConv, AddedBy, AddedOn) 
                                                        VALUES ( $invoice_id, NULL, 1,  $item->invoice_id, $inv_type, $item->invoice_type, $module_type, $transaction_type, $item->amount_allocated, ".$this->arrUser['company_id'].", ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()), $allocation_date, DATE_FORMAT(FROM_UNIXTIME($allocation_date), '%Y-%m-%d'), ".$this->arrUser['id'].", UNIX_TIMESTAMP (NOW()))";
                                // echo $Sql;exit;
                                $RS = $this->objsetup->CSI($Sql);
                            }
                        }
                    }
                }

                // 1=> sales invoice 2=> credit note, 5=>Payment, 6=> Refund, 7=> Customer opening balance invoice, 8=> Customer opening balance Credit Note, 
                // 9=> Supplier opening balance invoice, 10=> Supplier opening balance Credit Note, 11=> Customer Opening balance Payment (bank),
                // 12=> Customer Opening balance Refund (bank), 13=> Supplier Opening balance Payment (bank), 14=> Supplier Opening balance Refund (bank) 
                // (entry from)1=> sales invoice 2=> credit note, 3=> Purchase Invoice, 
                // 4=> Debit Note, 5=>Payment, 6=> Refund, 7=> Customer opening balance invoice, 
                // 8=> Customer opening balance Credit Note, 9=> Supplier opening balance invoice, 
                // 10=> Supplier opening balance Credit Note, 
                // 11=> Customer Opening balance Payment (bank), 12=> Customer Opening balance Refund (bank), 13=> Supplier Opening balance Payment (bank), 14=> Supplier Opening balance Refund (bank)
                // if($entry_type == 5 || $entry_type = 6) // payment from payment/refund
                {
                    // ---------------- For currency gain ----------------------------------------

                    $org_currency_rate = 0; // currency rate of the invoice which is going to be setteled (for example invoice)
                    $from_currency_rate = 0; // currency rate of the document from which the invoice is going to be setteled (for example payment) - current rate
                    $ref_id = $payment_detail_id;
                    $temp_object_id = $payment_id;
                    $item_posting_date = $this->objGeneral->convert_date($item->posting_date);
                    if ($posting_date > $item_posting_date) {
                        $recorded_posting_date = $posting_date;
                    } else {
                        $recorded_posting_date = $item_posting_date;
                    }
                    $gl_entry_type = 5; // 1=> Sales Txn, 2=>Credit Note Txn, 3=> Purchase Txn, 4=> Debit Note Txn, 5=> Ledger Entry,
                    // 6=> Opening Balances Bank Entry,7=> Opening Balances Stock Entry,8=> Opening Balances customer Entry,
                    // 9=> Opening Balances Supplier Entry,10=> Opening Balances GL Entry, 11=> Item Journal, 12=> VAT Posting
                    /*
                      // straight entry
                      $org_currency_rate = $item->currency_rate;
                      $from_currency_rate = $from_entry_currency_rate;
                     */

                    /*
                      // inverse entry
                      $org_currency_rate = $from_entry_currency_rate;
                      $from_currency_rate = $item->currency_rate;
                     */
                    if ($entry_type == 5) { // from payment
                        // reverse
                        $org_currency_rate = $from_entry_currency_rate;
                        $from_currency_rate = $item->currency_rate;
                        if ($item->invoice_type == 3) { // Purchase Invoice
                            $ref_id = 0;
                            $temp_object_id = $item->invoice_id;
                            $gl_entry_type = 3;
                        } else if ($item->invoice_type == 6) { // Refund
                            $ref_id = $item->invoice_id;
                            $temp_object_id = $item->cust_payment_id;
                            $gl_entry_type = 5;
                        } else if ($item->invoice_type == 9) { // opening balance invoice
                            $ref_id = 0;
                            $temp_object_id = $item->invoice_id;
                            $gl_entry_type = 9;
                        } else if ($item->invoice_type == 14) { // opening balance refund
                            $ref_id = 0;
                            $temp_object_id = $item->invoice_id;
                            $gl_entry_type = 6;
                        }
                    } else if ($entry_type == 6) { // from refund
                        // straight
                        $org_currency_rate = $item->currency_rate;
                        $from_currency_rate = $from_entry_currency_rate;
                    } else if ($entry_type == 3) { // from purchase invoice
                        if ($item->invoice_type == 5) { // setteling from sales invoice to payment
                            // straight
                            $org_currency_rate = $item->currency_rate;
                            $from_currency_rate = $from_entry_currency_rate;
                            $gl_entry_type = 3;
                            $temp_object_id = $attr['invoice_id'];
                        } else {
                            // reverse
                            $org_currency_rate = $from_entry_currency_rate;
                            $from_currency_rate = $item->currency_rate;

                            if ($item->invoice_type == 4) { // debit note
                                $ref_id = 0;
                                $temp_object_id = $item->invoice_id;
                                $gl_entry_type = 4;
                            } else if ($item->invoice_type == 10) { // opening balance debit note
                                $ref_id = 0;
                                $temp_object_id = $item->invoice_id;
                                $gl_entry_type = 9;
                            } else if ($item->invoice_type == 13) { // opeinng balance payment
                                $ref_id = 0;
                                $temp_object_id = $item->invoice_id;
                                ;
                                $gl_entry_type = 6;
                            }
                        }
                    } else if ($entry_type == 4) { // from debit note
                        if ($item->invoice_type == 6) { // setteling with sales invoice or refund
                            // reverse
                            $org_currency_rate = $from_entry_currency_rate;
                            $from_currency_rate = $item->currency_rate;
                            $ref_id = $item->invoice_id;
                            $temp_object_id = $item->cust_payment_id;
                            $gl_entry_type = 5;
                        } else { // for opening balance invoice, opening balance refund
                            // straight
                            $org_currency_rate = $item->currency_rate;
                            $from_currency_rate = $from_entry_currency_rate;

                            $gl_entry_type = 4;
                            $temp_object_id = $attr['invoice_id'];
                        }
                    } else if ($entry_type == 9) { // opening balance invoice
                        // straight
                        $org_currency_rate = $item->currency_rate;
                        $from_currency_rate = $from_entry_currency_rate;
                        $temp_object_id = $attr['invoice_id'];
                        $gl_entry_type = 9;
                    } else if ($entry_type == 10) { // opening balance debit note
                        if ($item->invoice_type == 14) { // opening balance refund
                            // reverse
                            $org_currency_rate = $from_entry_currency_rate;
                            $from_currency_rate = $item->currency_rate;
                            $temp_object_id = $attr['invoice_id'];
                            $gl_entry_type = 6;
                        } else {
                            // straight
                            $org_currency_rate = $item->currency_rate;
                            $from_currency_rate = $from_entry_currency_rate;
                            $temp_object_id = $attr['invoice_id'];
                            $gl_entry_type = 9;
                        }
                    } else if ($entry_type == 14) { // opening balance refund
                        if ($item->invoice_type == 13) {// opening balance payment
                            // reverse
                            $org_currency_rate = $from_entry_currency_rate;
                            $from_currency_rate = $item->currency_rate;
                            $gl_entry_type = 6;
                            $temp_object_id = $item->invoice_id;
                        } else {
                            // straight
                            $org_currency_rate = $item->currency_rate;
                            $from_currency_rate = $from_entry_currency_rate;
                            $gl_entry_type = 6;
                            $temp_object_id = $attr['invoice_id'];
                        }
                    } else if ($entry_type == 13) { // opening balance payment
                        // reverse
                        $org_currency_rate = $from_entry_currency_rate;
                        $from_currency_rate = $item->currency_rate;
                        if ($item->invoice_type == 3) { // Purhase invoice
                            $temp_object_id = $item->invoice_id;
                            $ref_id = 0;
                            $gl_entry_type = 3;
                        } else if ($item->invoice_type == 6) { // refund
                            $temp_object_id = $item->cust_payment_id;
                            $ref_id = $item->invoice_id;
                            $gl_entry_type = 5;
                        } else if ($item->invoice_type == 9) { // opening balnace invoice
                            $temp_object_id = $item->invoice_id;
                            $ref_id = 0;
                            $gl_entry_type = 9;
                        } else if ($item->invoice_type == 14) { // opening balnace refund
                            $ref_id = 0;
                            $temp_object_id = $item->invoice_id;
                            $gl_entry_type = 6;
                        }
                    }
                    $check_gain = "SELECT SR_CalucateCurrencyGainLoss($item->currency_id, 
                                                                $org_currency_rate, 
                                                                $from_currency_rate, 
                                                                $item->converted_currency_id, 
                                                                $item->amount_allocated,
                                                                $posting_date,
                                                                1) AS total";
                    // echo $check_gain;exit;

                    $RS = $this->objsetup->CSI($check_gain);
                    if ($RS->fields['total'] > 0) {
                        $total_gain_loss = $RS->fields['total'];
                        $CG_SQL = "INSERT INTO gl_account_txn SET 
                                    object_id = $temp_object_id,
                                    type = $gl_entry_type, 
                                    company_id = " . $this->arrUser['company_id'] . ", 
                                    user_id = " . $this->arrUser['id'] . ",
                                    gl_account_id = $realised_gain_gl_id,
                                    gl_account_code = '$realised_gain_gl_code',
                                    gl_account_name = '$realised_gain_gl_name',
                                    debit_amount = 0, 
                                    credit_amount = " . $total_gain_loss . ", 
                                    AddedBy = " . $this->arrUser['id'] . ",
                                    invoice_date =  $recorded_posting_date,
                                    AddedOn =  UNIX_TIMESTAMP (NOW()),
                                    transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1),
                                    ref_id=$ref_id";
                        // echo $CG_SQL;exit;
                        $RS = $this->objsetup->CSI($CG_SQL);
                        $table_name = "";
                        $field_name = "";
                        $gl_account = "";
                        if ($module_type == 1) { // customer
                            $gl_account = "salesAccountDebators";
                            if ($item->invoice_type == 1) { // sales order
                                $table_name = "orders";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 2) { // Credit Note
                                $table_name = "return_orders";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 5 || $item->invoice_type == 6) { // payment/refund
                                $table_name = "payment_details";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 7 || $item->invoice_type == 8 || $item->invoice_type == 9 || $item->invoice_type == 10) { // opening balance customer/supplier (invoice/credit note)
                                $table_name = "opening_balance_customer";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 11 || $item->invoice_type == 12 || $item->invoice_type == 13 || $item->invoice_type == 14) { // opening balance bank customer/supplier (payment/refund)
                                $table_name = "opening_balance_bank";
                                $field_name = "posting_group_id";
                            }
                        } else if ($module_type == 2) { // supplier
                            $gl_account = "purchaseAccountCreditors";
                            if ($item->invoice_type == 3) { // Purchase order
                                $table_name = "srm_invoice";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 4) { // Debit Note 
                                $table_name = "srm_order_return";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 5 || $item->invoice_type == 6) { // payment/refund
                                $table_name = "payment_details";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 7 || $item->invoice_type == 8 || $item->invoice_type == 9 || $item->invoice_type == 10) { // opening balance customer/supplier (invoice/credit note)
                                $table_name = "opening_balance_customer";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 11 || $item->invoice_type == 12 || $item->invoice_type == 13 || $item->invoice_type == 14) { // opening balance bank customer/supplier (payment/refund)
                                $table_name = "opening_balance_bank";
                                $field_name = "posting_group_id";
                            }
                        }

                        if ($table_name != "") {
                            $CG_SQL1 = "INSERT INTO gl_account_txn SET 
                                    object_id = $temp_object_id,
                                    type = $gl_entry_type, 
                                    company_id = " . $this->arrUser['company_id'] . ", 
                                    user_id = " . $this->arrUser['id'] . ",
                                    gl_account_id = (SELECT isetup.$gl_account
                                                        FROM inventory_setup AS isetup, gl_account AS ga
                                                        WHERE 
                                                            ga.id = isetup.$gl_account AND
                                                            isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                            isetup.type = 2 AND
                                                            isetup.company_id = " . $this->arrUser['company_id'] . "
                                                        LIMIT 1),
                                    gl_account_code = (SELECT ga.accountCode
                                                        FROM inventory_setup AS isetup, gl_account AS ga
                                                        WHERE 
                                                            ga.id = isetup.$gl_account AND
                                                            isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                            isetup.type = 2 AND
                                                            isetup.company_id = " . $this->arrUser['company_id'] . "
                                                        LIMIT 1),
                                    gl_account_name = (SELECT ga.displayName
                                                        FROM inventory_setup AS isetup, gl_account AS ga
                                                        WHERE 
                                                            ga.id = isetup.$gl_account AND
                                                            isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                            isetup.type = 2 AND
                                                            isetup.company_id = " . $this->arrUser['company_id'] . "
                                                        LIMIT 1),
                                    debit_amount = " . $total_gain_loss . ",
                                    credit_amount = 0,
                                    AddedBy = " . $this->arrUser['id'] . ",
                                    invoice_date =  $recorded_posting_date,
                                    AddedOn =  UNIX_TIMESTAMP (NOW()),
                                    transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1),
                                    ref_id=$ref_id";
                            // echo $CG_SQL1;exit;
                            $RS1 = $this->objsetup->CSI($CG_SQL1);
                        }
                    }
                    // ---------------- For currency Loss ----------------------------------------
                    $check_loss = "SELECT SR_CalucateCurrencyGainLoss($item->currency_id, 
                                                                $org_currency_rate, 
                                                                $from_currency_rate, 
                                                                $item->converted_currency_id, 
                                                                $item->amount_allocated, 
                                                                $posting_date, 
                                                                2) AS total";
                    $RS = $this->objsetup->CSI($check_loss);
                    if ($RS->fields['total'] > 0) {
                        $total_gain_loss = $RS->fields['total'];
                        $CL_SQL = "INSERT INTO gl_account_txn SET 
                                    object_id = $temp_object_id,
                                    type = $gl_entry_type, 
                                    company_id = " . $this->arrUser['company_id'] . ", 
                                    user_id = " . $this->arrUser['id'] . ",
                                    gl_account_id = $realised_loss_gl_id,
                                    gl_account_code = '$realised_loss_gl_code',
                                    gl_account_name = '$realised_loss_gl_name',
                                    debit_amount = " . $total_gain_loss . ",
                                    credit_amount = 0, 
                                    AddedBy = " . $this->arrUser['id'] . ",
                                    invoice_date =  $recorded_posting_date,
                                    AddedOn =  UNIX_TIMESTAMP (NOW()),
                                    transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1),
                                    ref_id=$ref_id";
                        // echo $CL_SQL;exit;
                        $RS = $this->objsetup->CSI($CL_SQL);

                        $table_name = "";
                        $field_name = "";
                        $gl_account = "";
                        if ($module_type == 1) { // customer
                            $gl_account = "salesAccountDebators";
                            if ($item->invoice_type == 1) { // sales order
                                $table_name = "orders";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 2) { // Credit Note
                                $table_name = "return_orders";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 5 || $item->invoice_type == 6) { // payment/refund
                                $table_name = "payment_details";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 7 || $item->invoice_type == 8 || $item->invoice_type == 9 || $item->invoice_type == 10) { // opening balance customer/supplier (invoice/credit note)
                                $table_name = "opening_balance_customer";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 11 || $item->invoice_type == 12 || $item->invoice_type == 13 || $item->invoice_type == 14) { // opening balance bank customer/supplier (payment/refund)
                                $table_name = "opening_balance_bank";
                                $field_name = "posting_group_id";
                            }
                        } else if ($module_type == 2) { // supplier
                            $gl_account = "purchaseAccountCreditors";
                            if ($item->invoice_type == 3) { // Purchase order
                                $table_name = "srm_invoice";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 4) { // Debit Note 
                                $table_name = "srm_order_return";
                                $field_name = "bill_to_posting_group_id";
                            } else if ($item->invoice_type == 5 || $item->invoice_type == 6) { // payment/refund
                                $table_name = "payment_details";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 7 || $item->invoice_type == 8 || $item->invoice_type == 9 || $item->invoice_type == 10) { // opening balance customer/supplier (invoice/credit note)
                                $table_name = "opening_balance_customer";
                                $field_name = "posting_group_id";
                            } else if ($item->invoice_type == 11 || $item->invoice_type == 12 || $item->invoice_type == 13 || $item->invoice_type == 14) { // opening balance bank customer/supplier (payment/refund)
                                $table_name = "opening_balance_bank";
                                $field_name = "posting_group_id";
                            }
                        }

                        if ($table_name != "") {
                            $CG_SQL1 = "INSERT INTO gl_account_txn SET 
                                    object_id = $temp_object_id,
                                    type = $gl_entry_type, 
                                    company_id = " . $this->arrUser['company_id'] . ", 
                                    user_id = " . $this->arrUser['id'] . ",
                                    gl_account_id = (SELECT isetup.$gl_account
                                                        FROM inventory_setup AS isetup, gl_account AS ga
                                                        WHERE 
                                                            ga.id = isetup.$gl_account AND
                                                            isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                            isetup.type = 2 AND
                                                            isetup.company_id = " . $this->arrUser['company_id'] . "
                                                        LIMIT 1),
                                    gl_account_code = (SELECT ga.accountCode
                                                        FROM inventory_setup AS isetup, gl_account AS ga
                                                        WHERE 
                                                            ga.id = isetup.$gl_account AND
                                                            isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                            isetup.type = 2 AND
                                                            isetup.company_id = " . $this->arrUser['company_id'] . "
                                                        LIMIT 1),
                                    gl_account_name = (SELECT ga.displayName
                                                        FROM inventory_setup AS isetup, gl_account AS ga
                                                        WHERE 
                                                            ga.id = isetup.$gl_account AND
                                                            isetup.postingGroup = (SELECT $field_name FROM $table_name WHERE id = $item->invoice_id) AND
                                                            isetup.type = 2 AND
                                                            isetup.company_id = " . $this->arrUser['company_id'] . "
                                                        LIMIT 1),
                                    debit_amount = 0,
                                    credit_amount = " . $total_gain_loss . ",
                                    AddedBy = " . $this->arrUser['id'] . ",
                                    invoice_date =  $recorded_posting_date,
                                    AddedOn =  UNIX_TIMESTAMP (NOW()),
                                    transaction_id = SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1),
                                    ref_id=$ref_id";
                            // echo $CG_SQL1;exit;
                            $RS1 = $this->objsetup->CSI($CG_SQL1);
                        }
                    }
                }
            }
        }
        if($TRANSACTION_UNSUCCESSFUL == 0)
        { 
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $response['ack'] = 1;
            $response['error'] = null;
        }
        else
        {
            $this->Conn->rollbackTrans();
            $this->Conn->autoCommit = true;
            $response['ack'] = 0;
            $response['error'] = null;
        }

        return $response;
    }

    function get_invoice_receipt_payment($arr_attr) {

        $Sql = "SELECT * FROM gl_journal_receipt_person   WHERE  salesperson_id = '$arr_attr[invoice]'  ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }


                $Row['date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);

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

    //---------------------------get invoice remaining ammount---------------/

    function get_invoice_remaining_payment($arr_attr) {

        $Sql = "SELECT sum(amount) as payed_amount  FROM gl_journal_receipt_person  rp WHERE  rp.doc_type = '$arr_attr[doc_type]' and rp.parent_id = '$arr_attr[invoice_id]'  ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }


                $Row['date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);

                $response['response'] = $Row;
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

    //---------------------------get invoice remaining ammount---------------/

    function convert_posting_receipt($attr) {

        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        $checkAlreadyPosted = "SELECT type FROM gl_journal_receipt WHERE id= $attr[parent] LIMIT 1";
        $RS = $this->objsetup->CSI($checkAlreadyPosted);
        
        if($RS->fields['type'] == 2)
        {
            // $this->objsetup->terminateWithMessage("Journal already Posted");
            $response['ack'] = 0;
            $response['error'] = 'Journal already Posted';

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Journal already Posted';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }
        else
        {
            $this->Conn->beginTrans();
            $this->Conn->autoCommit = false;

            $ValidateSql = "CALL SR_Post_Journal('" . $attr['parent'] . "', " . $this->arrUser['company_id'] . ", " . $this->arrUser['id'] . ",
                                                                            @errorNo,
                                                                            @param1,
                                                                            @param2,
                                                                            @param3,
                                                                            @param4)";
            // echo  $ValidateSql;exit;
            $RS = $this->objsetup->CSI($ValidateSql);

            if ($RS->msg == 1) {
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
                $srLogTrace['Parameter2'] = 'parent:' . $attr['parent'];
                $srLogTrace['ErrorMessage'] = "";

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                
                return $response;
                // $this->objsetup->terminateWithMessage("postPurchaseInvoice");
            } else {
                // $this->objsetup->terminateWithMessage("Journal can not be posted");
                $response['ack'] = 0;
                $response['error'] = $RS->Error;//'Journal can not be posted';

                $srLogTrace = array();

                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['Parameter2'] = 'parent:' . $attr['parent'];
                $srLogTrace['ErrorMessage'] = $RS->Error;

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;
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
          $response['error'] = 'Journal can not be posteds!';
          }
          else
          {
          $response['ack'] = 0;
          $response['error'] = 'Journal can not be posted';
          }

          return $response; */
        // print_r($attr);exit;
    }

    function convert_posting_receipt_item($attr) {

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

        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        $checkAlreadyPosted = "SELECT type FROM gl_journal_receipt WHERE id= $attr[parent] LIMIT 1";
        $RS = $this->objsetup->CSI($checkAlreadyPosted);
        
        if($RS->fields['type'] == 2)
        {
            // $this->objsetup->terminateWithMessage("Journal already Posted");
            $response['ack'] = 0;
            $response['error'] = 'Journal already Posted';

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Journal already Posted';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
            return $response;
        }
        else
        {
            $this->Conn->beginTrans();
            $this->Conn->autoCommit = false;

            $ValidateSql = "CALL SR_Post_Journal_Item('" . $attr['parent'] . "', " . $this->arrUser['company_id'] . ", " . $this->arrUser['id'] . ",
                                                                            @errorNo,
                                                                            @param1,
                                                                            @param2,
                                                                            @param3,
                                                                            @param4)";
            // echo  $ValidateSql;exit;
            $RS = $this->objsetup->CSI($ValidateSql);

            if ($RS->msg == 1) {
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
                $srLogTrace['Parameter2'] = 'parent:' . $attr['parent'];
                $srLogTrace['ErrorMessage'] = "";

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                
                return $response;
                // $this->objsetup->terminateWithMessage("postPurchaseInvoice");
            } else {
                // $this->objsetup->terminateWithMessage("Journal can not be posted");
                $response['ack'] = 0;
                $response['error'] = $RS->Error;//'Journal can not be posted';

                $srLogTrace = array();

                $srLogTrace['ErrorCode'] = '';
                $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
                $srLogTrace['Function'] = __FUNCTION__;
                $srLogTrace['CLASS'] = __CLASS__;
                $srLogTrace['Parameter1'] = 'Exit';
                $srLogTrace['Parameter2'] = 'parent:' . $attr['parent'];
                $srLogTrace['ErrorMessage'] = $RS->Error;

                $this->objsetup->SRTraceLogsPHP($srLogTrace);
                return $response;
            }
        }
/* 
        $allocation_check="SELECT ijd.warehouse AS id
						FROM 
                        item_journal_details AS ijd
						WHERE
                            ijd.parent_id = $attr[parent] AND
                            ijd.transaction_type = 2 AND
                            ijd.stock_check = 0
						GROUP BY ijd.item_id
						HAVING SUM(ijd.qty)> SR_CURRENT_OR_AVAILABLE_STOCK_byWarehouse(ijd.item_id, ijd.warehouse, " . $this->arrUser['company_id'] . ", 2)
                        LIMIT 1";
        // echo $allocation_check;exit;

        $rs_allocation_check = $this->objsetup->CSI($allocation_check);
        if ($rs_allocation_check->fields['id'] > 0) {    
            $response['ack'] = 0;
            $response['error'] = 'Stock limit exceed for Items with stock allocation not required';
            return $response;
        }

        // print_r($attr);exit;
        $fin_check = "SELECT id, posting_start_date, posting_end_date
                        FROM financial_settings
                        WHERE company_id = " . $this->arrUser['company_id'];
        // echo  $fin_check;exit;
        $rs_fin_check = $this->objsetup->CSI($fin_check);
        if ($rs_fin_check->fields['id'] > 0) {
            $date_check = "SELECT IFNULL( (SELECT id 
                            FROM item_journal_details 
                            WHERE parent_id = $attr[parent] AND posting_date NOT BETWEEN " . $rs_fin_check->fields['posting_start_date'] . " AND " . $rs_fin_check->fields['posting_end_date'] . " LIMIT 1), 0) AS invalid_date";
            $rs_date_check = $this->objsetup->CSI($date_check);
            // echo $rs_date_check->fields['invalid_date'];exit;
            if ($rs_date_check->fields['invalid_date'] == 0) {
                $transaction_entries = "";
                $stock_entries = "";
                $item_in_cost_entries = "";
                $item_out_cost_entries = "";
                $sql_pr = "UPDATE gl_journal_receipt SET type=2 WHERE id ='$attr[parent]' and company_id=" . $this->arrUser['company_id'] . " Limit 1";
                // echo $sql_pr;exit;
                $rsl_pr = $this->objsetup->CSI($sql_pr);

                if ($this->Conn->Affected_Rows() > 0) {

                    //isetup.postingGroup = $item->posting_group_id AND
                    // get stock G/L
                    $Sql = "SELECT isetup.purchaseAccountStock as gl_id, ga.accountCode as gl_code, ga.displayName as gl_name
                            FROM inventory_setup AS isetup, gl_account AS ga
                            WHERE 
                                ga.id = isetup.purchaseAccountStock AND
                                isetup.type = 2 AND
                                isetup.company_id = " . $this->arrUser['company_id'] . "
                            LIMIT 1;";
                    // echo $Sql;exit;
                    $RS = $this->objsetup->CSI($Sql);
                    if ($RS->RecordCount() > 0) {
                        $stock_gl_id = $RS->fields['gl_id'];
                        $stock_gl_code = $RS->fields['gl_code'];
                        $stock_gl_name = $RS->fields['gl_name'];

                        $txn_type = 11; // for item journal entries
                        foreach ($attr['items'] as $item) {

                            $posting_date = $this->objGeneral->convert_date($item->posting_date);
                            if ($item->transaction_type == 1) { // positive entry
                                $transaction_entries .= "($item->parent_id, $txn_type, " . $this->arrUser['company_id'] . "," . $this->arrUser['id'] . ", $item->balancing_account_id, 
                                                        '$item->balancing_account_code', '".addslashes($item->balancing_account_name)."', 0, " . floatval($item->amount) . ", " . $this->arrUser['id'] . ", " . current_date . ", $item->id,
                                                        SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1)),";

                                $transaction_entries .= "($item->parent_id, $txn_type, " . $this->arrUser['company_id'] . "," . $this->arrUser['id'] . ", $stock_gl_id, 
                                                        '$stock_gl_code', '$stock_gl_name', " . floatval($item->amount) . ", 0, " . $this->arrUser['id'] . ", " . current_date . ", $item->id,
                                                        SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1)),";

                                                        
                                //   $stock_entries .= "($item->parent_id, $item->id, $item->item_id, ".$item->warehouse->id.", ".$item->location->id.", $item->qty, 3, " . $this->arrUser['company_id'] . "," . $this->arrUser['id'] . "
                                //   , ".$this->objGeneral->convert_date($item->posting_date).", ".$item->uom->unit_id.", '".$item->uom->name."', 1, 1, 1, UUID()),";
                                
                                $item_in_cost_entries .= "($item->parent_id, 4, $item->item_id, '$item->item_code', $item->id, $item->qty, $item->qty, " . floatval($item->cost_per_unit) . ", " . $posting_date . ", 
                                                            " . $this->arrUser['company_id'] . ", UNIX_TIMESTAMP (NOW())),";
                            } else if ($item->transaction_type == 2) { // negative entry
                                $transaction_entries .= "($item->parent_id, $txn_type, " . $this->arrUser['company_id'] . "," . $this->arrUser['id'] . ", $item->balancing_account_id, 
                                                        '$item->balancing_account_code', '".addslashes($item->balancing_account_name)."', " . floatval($item->amount) . ", 0, " . $this->arrUser['id'] . ", " . current_date . ", $item->id,
                                                        SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1)),";

                                $transaction_entries .= "($item->parent_id, $txn_type, " . $this->arrUser['company_id'] . "," . $this->arrUser['id'] . ", $stock_gl_id, 
                                                        '$stock_gl_code', '$stock_gl_name', 0, " . floatval($item->amount) . ", " . $this->arrUser['id'] . ", " . current_date . ", $item->id,
                                                        SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 1)),";


                                $item_out_cost_entries .= "($item->parent_id, 4, $item->item_id, '$item->item_code', $item->id, $item->qty, " . floatval($item->cost_per_unit) . ", " . $posting_date . ", 
                                                            " . $this->arrUser['company_id'] . ", UNIX_TIMESTAMP (NOW())),";
                                
                                                            
                                if($item->stock_check == 0)
                                {
                                    $stock_entries .= "($item->parent_id, $item->id, $item->item_id, ".$item->warehouse->id.", ".$item->location->id.", $item->qty, 3, " . $this->arrUser['company_id'] . "," . $this->arrUser['id'] . "
                                    , ".$this->objGeneral->convert_date($item->posting_date).", ".$item->uom->unit_id.", '".$item->uom->name."', 1, 1, 2, UUID()),";
                                }
                            }
                        }
                        if (strlen($transaction_entries) > 0) {
                            $txn_entries = "INSERT INTO `gl_account_txn` (object_id, TYPE, company_id, user_id, gl_account_id, gl_account_code, gl_account_name, 
                                                debit_amount, credit_amount, AddedBy, AddedOn, ref_id, transaction_id)   VALUES " . (substr($transaction_entries,
                                            0, -1));
                            // echo $txn_entries;exit;
                            $txn_pr = $this->objsetup->CSI($txn_entries);
                        }

                        //unit_measure_qty
                        // location
                        // if (strlen($stock_entries) > 0) 
                        {
                            if (strlen($stock_entries) > 0) 
                            {
                              $stk_entries = "INSERT INTO `warehouse_allocation` (order_id, item_journal_detail_id, product_id, warehouse_id, location, quantity, type, company_id, user_id, order_date, unit_measure_id,
                              unit_measure_name, unit_measure_qty, status, ledger_type, item_trace_unique_id)
                              VALUES ".(substr($stock_entries, 0, -1));
                              // echo $stk_entries;exit;
                              $stk_pr = $this->objsetup->CSI($stk_entries);
                            }

                            $stk_entries = "UPDATE warehouse_allocation
                                                SET journal_status = 2
                                            WHERE
                                                order_id = $attr[parent] AND
                                                type = 3 AND
                                                company_id = " . $this->arrUser['company_id'];
                            // echo $stk_entries;exit;
                            $stk_pr = $this->objsetup->CSI($stk_entries);

                            $update_status = "UPDATE item_journal_details
                                                SET status = 2
                                            WHERE
                                                parent_id = $attr[parent] AND  
                                                company_id = " . $this->arrUser['company_id'];
                            // echo $update_status;exit;
                            $update_status = $this->objsetup->CSI($update_status);
                        }

                        if (strlen($item_in_cost_entries) > 0) {
                            $item_in_cost_entries_sql = "INSERT INTO item_in_cost_entries(invoice_id, invoice_type, product_id, product_code, order_detail_id, total_qty, remaining_qty, unit_price, posting_date,company_id, posted_on)
                                                    VALUES " . (substr($item_in_cost_entries, 0, -1));
                            // echo $item_in_cost_entries_sql;exit;
                            $in_cost_entries = $this->objsetup->CSI($item_in_cost_entries_sql);
                        }

                        if (strlen($item_out_cost_entries) > 0) {
                            $item_out_cost_entries_sql = "INSERT INTO item_out_cost_entries(invoice_id, invoice_type, product_id, product_code, order_detail_id, total_qty, unit_price, posting_date,company_id, posted_on)
                                                        VALUES " . (substr($item_out_cost_entries, 0, -1));
                            // echo $out_cost_entries;exit;
                            $out_cost_entries = $this->objsetup->CSI($item_out_cost_entries_sql);

                            $fifo_entries = "CALL SR_Item_Cost_Entries($attr[parent], 2, 2, 3, ". $this->arrUser['company_id'] . ", 0,
                                                                        @errorNo,
                                                                        @param1,
                                                                        @param2,
                                                                        @param3,
                                                                        @param4)";
                            $out_cost_entries_RS = $this->objsetup->CSI($fifo_entries); 
                        }

                        $Sql_Opening_balance_negative = "UPDATE opening_balance_stock AS obs
                                                SET obs.allocated_qty = obs.allocated_qty + (SELECT IFNULL(SUM(quantity), 0) 
                                                                        FROM warehouse_allocation AS wa
                                                                        WHERE
                                                                            wa.order_id = $attr[parent] AND 
                                                                            wa.type = 3 AND
                                                                            wa.company_id = " . $this->arrUser['company_id']." AND
                                                                            wa.ledger_type = 2 AND
                                                                            wa.opBalncID IS NOT NULL AND
                                                                            wa.opBalncID = obs.id),
                                                obs.temp_allocated_qty = obs.temp_allocated_qty - (SELECT IFNULL(SUM(quantity), 0) 
                                                                        FROM warehouse_allocation AS wa
                                                                        WHERE
                                                                            wa.order_id = $attr[parent] AND 
                                                                            wa.type = 3 AND
                                                                            wa.company_id = " . $this->arrUser['company_id']." AND
                                                                            wa.ledger_type = 2 AND
                                                                            wa.opBalncID IS NOT NULL AND
                                                                            wa.opBalncID = obs.id)
                                                WHERE obs.id IN (SELECT wa.opBalncID 
                                                        FROM warehouse_allocation AS wa
                                                        WHERE
                                                        wa.order_id = $attr[parent] AND 
                                                        wa.type = 3 AND
                                                        wa.company_id = " . $this->arrUser['company_id']." AND
                                                        wa.ledger_type = 2 AND
                                                        wa.opBalncID IS NOT NULL);";
                        $RS_Sql_Opening_balance_negative = $this->objsetup->CSI($Sql_Opening_balance_negative);                   

//                        $response['ack'] = 1;
//                        $response['error'] = NULL;
                        $response['ack'] = 1;
                        $response['error'] = NULL;
                        
                        
                        $refresh_checksum = "UPDATE sr_checksum 
                                                SET checksum_id=checksum_id+1,ChangedOn=CURRENT_TIMESTAMP, ChangedBy= " . $this->arrUser['id']."  
                                                WHERE company_id=" . $this->arrUser['company_id']." AND tableName='product';";
                        $this->objsetup->CSI($refresh_checksum);

                        $refresh_cache_1 = "DELETE FROM ProductCache WHERE id IN (SELECT item_id FROM item_journal_details WHERE parent_id = $attr[parent] AND company_id = " . $this->arrUser['company_id']." AND status=2)";
				        $this->objsetup->CSI($refresh_cache_1);
                        $refresh_cache_2 = "INSERT INTO ProductCache SELECT *,NOW() FROM sr_product_sel WHERE id IN (SELECT item_id FROM item_journal_details WHERE parent_id = $attr[parent] AND company_id = " . $this->arrUser['company_id']." AND status=2)";
                        $this->objsetup->CSI($refresh_cache_2);

                        $this->Conn->commitTrans();
                        $this->Conn->autoCommit = true;
                        
                        $srLogTrace = array();

                        $srLogTrace['ErrorCode'] = '';
                        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
                        $srLogTrace['Function'] = __FUNCTION__;
                        $srLogTrace['CLASS'] = __CLASS__;
                        $srLogTrace['Parameter1'] = 'Exit';
                        $srLogTrace['Parameter1'] = 'parent:' . $attr['parent'];
                        $srLogTrace['ErrorMessage'] = '';

                        $this->objsetup->SRTraceLogsPHP($srLogTrace);

                    } else
                    {
                        $response['ack'] = 0;
                        $response['error'] = 'Please select the appropriate G/Ls in the inventory setup';
                        $response['response'][] = array();
                    }
                } else
                    $response['response'][] = array();
            }
            else {
                // $this->objsetup->terminateWithMessage("Posting date range is not valid for all payments");
               $response['ack'] = 0;
               $response['error'] = 'Posting date range is not valid for all payments';
            }
        } else {
            // $this->objsetup->terminateWithMessage("Please set the financial settings");
           $response['ack'] = 0;
           $response['error'] = 'Please set the financial settings';
        } */
        return $response;
    }

    function update_currency_movements($attr) {

        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT * FROM currency_movement_setup WHERE company_id= " . $this->arrUser['company_id'];
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Sql = "UPDATE currency_movement_setup SET 
                        realised_gain_gl_id  = '$attr[realised_gain_gl_id]',
                        realised_gain_gl_name = '$attr[realised_gain_gl_name]',
                        realised_gain_gl_code = '$attr[realised_gain_gl_code]',
                        realised_loss_gl_id   = '$attr[realised_loss_gl_id]',
                        realised_loss_gl_name = '$attr[realised_loss_gl_name]',
                        realised_loss_gl_code = '$attr[realised_loss_gl_code]',
                        unrealised_gain_gl_id = '$attr[unrealised_gain_gl_id]',
                        unrealised_gain_gl_name = '$attr[unrealised_gain_gl_name]',
                        unrealised_gain_gl_code = '$attr[unrealised_gain_gl_code]',
                        unrealised_loss_gl_id   = '$attr[unrealised_loss_gl_id]',
                        unrealised_loss_gl_name = '$attr[unrealised_loss_gl_name]',
                        unrealised_loss_gl_code = '$attr[unrealised_loss_gl_code]'
                    WHERE company_id= " . $this->arrUser['company_id'];

            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            /*
              if ($this->Conn->Affected_Rows() > 0) {
              $response['ack'] = 1;
              $response['error'] = NULL;
              } else {
              $response['ack'] = 0;
              $response['error'] = 'Not updated';
              }
             */
        } else {
            $Sql = "INSERT INTO currency_movement_setup SET 
                        realised_gain_gl_id  = '$attr[realised_gain_gl_id]',
                        realised_gain_gl_name = '$attr[realised_gain_gl_name]',
                        realised_gain_gl_code = '$attr[realised_gain_gl_code]',
                        realised_loss_gl_id   = '$attr[realised_loss_gl_id]',
                        realised_loss_gl_name = '$attr[realised_loss_gl_name]',
                        realised_loss_gl_code = '$attr[realised_loss_gl_code]',
                        unrealised_gain_gl_id = '$attr[unrealised_gain_gl_id]',
                        unrealised_gain_gl_name = '$attr[unrealised_gain_gl_name]',
                        unrealised_gain_gl_code = '$attr[unrealised_gain_gl_code]',
                        unrealised_loss_gl_id   = '$attr[unrealised_loss_gl_id]',
                        unrealised_loss_gl_name = '$attr[unrealised_loss_gl_name]',
                        unrealised_loss_gl_code = '$attr[unrealised_loss_gl_code]',
                        company_id= " . $this->arrUser['company_id'] . ",
                        user_id = " . $this->arrUser['id'];
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            // $id = $this->Conn->Insert_ID();
            /* if ($id > 0)
              {
              $response['ack'] = 1;
              $response['error'] = NULL;
              } else {
              $response['ack'] = 0;
              $response['error'] = 'Not Inserted';
              } */
        }

        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function get_currency_movements($attr) {

        $response = array();

        $Sql = "SELECT * FROM currency_movement_setup WHERE company_id= " . $this->arrUser['company_id'];
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);

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
        } else
            $response['response'][] = array();


        return $response;
    }

    function accounts_entry($attr) {

        $sql_code = "SELECT  account_code as code  
                     FROM company_gl_accounts 
                     where id='" . $attr[gl_id] . "' 
                     Limit 1";
        $rs_count = $this->objsetup->CSI($sql_code);
        $code = $rs_count->fields['code'];

        $amount = $attr['grand_total'];

        if (!empty($attr['count_converted']) && empty($attr['statuschk'])) {
            $convert_amount = $this->objGeneral->get_convert_price($amount, $attr[currency_id], $attr[posting_date], $this->arrUser['company_id']);
        } else
            $convert_amount = $attr['grand_total'];

        $status = 1;
        if (!empty($attr['statuschk']))
            $status = 0;

        $check_allocation = 0;
        if (!empty($attr['statuschk']) && !empty($attr['reference_id']))
            $check_allocation = 1;


        $Sql_accounts = "INSERT INTO account_entry 
                                            SET 
                                                amount='$amount',
                                                module_id='$attr[module_id]',
                                                gl_id='$attr[gl_id]',
                                                gl_code= ' $code ',
                                                tran_type='$attr[tran_type]',
                                                module_type='$attr[module_type]',
                                                status=$status,
                                                user_id='" . $this->arrUser['id'] . "',
                                                create_date='" . current_date . "',
                                                company_id='" . $this->arrUser['company_id'] . "',
                                                order_date= '" . $this->objGeneral->convert_date($attr['posting_date']) . "',
                                                currency_id= '" . $attr['currency_id'] . "',
                                                convert_amount= '" . $convert_amount . "',
                                                reference_id= '$attr[reference_id]',
                                                check_allocation=$check_allocation ";
        //  echo $Sql_accounts;exit;

        if ($amount != 0)
            $RS = $this->objsetup->CSI($Sql_accounts);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Not Inserted';
        }
        return $response;
    }

    /* =============GL Opening Balance Start============================================= */

    function get_opening_balance_list($attr) {
        $this->objGeneral->mysql_clean($attr);

        $where = "";

        if (!empty($attr[search_code]))
            $where .= "AND (c.acc_code='" . $attr['search_code'] . "' or c.opening_balance_title LIKE '%" . $attr['keyword'] . "%') ";

        $Sql = "SELECT   c.id,c.acc_code,c.opening_balance_title,c.create_date
                FROM   gl_opening_balance  c
                JOIN company on company.id=c.company_id
                where   c.status=1 AND 
                        (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") $where
                order by c.id ASC";

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['acc_code'];
                $result['name'] = $Row['opening_balance_title'];
                $result['Date'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();


        return $response;
    }

    function get_opening_balance_by_id($attr) {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT * FROM gl_opening_balance WHERE id=".$attr['id']." LIMIT 1";
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

    function add_opening_balance($attr) {

        $id = $attr['id'];
        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "' ";

        $data_pass = "  tst.acc_code='" . $attr['acc_code'] . "'  and tst.status=1  $update_check ";
        $total = $this->objGeneral->count_duplicate_in_sql('gl_opening_balance', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists. ';
            return $response;
            exit;
        }


        if ($id == 0) {

            $msg = 'Inserted';

            $Sql = "INSERT INTO gl_opening_balance
                           SET
                                opening_balance_title='" . $attr['opening_balance_title'] . "',
                                create_date='" . current_date . "',
                                acc_no='" . $attr['acc_no'] . "',
                                acc_code='" . $attr['acc_code'] . "',
                                company_id='" . $this->arrUser['company_id'] . "',
                                user_id='" . $this->arrUser['id'] . "',
                                status=1,
                                AddedBy='" . $this->arrUser['id'] . "',
                                AddedOn=UNIX_TIMESTAMP (NOW())
                                ";
        } else {

            $msg = 'Update';
            $Sql = "UPDATE gl_opening_balance
                           SET
                                opening_balance_title='" . $attr['opening_balance_title'] . "',
                                ChangedBy='" . $this->arrUser['id'] . "',
                                ChangedOn=UNIX_TIMESTAMP (NOW())
                                WHERE id = $id Limit 1 ";
        }
        // echo  $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($id == 0)
            $id = $this->Conn->Insert_ID();
        //$this->Conn->Affected_Rows()
        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = 'Record ' . $msg;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not .' . $msg;
        }
        return $response;
    }

    /* =============GL Opening Balance End============================================= */


    /* =============GL Opening Balance sub records Start============================================= */

    function get_opening_balance_detail_list($attr) {
        $this->objGeneral->mysql_clean($attr);


        $Sql = "SELECT   c.*
                    FROM   gl_opening_balance_detail  c
                    JOIN company on company.id=c.company_id
                    where  c.status=1 and c.opening_balance_id='" . $attr['opening_balnc_id'] . "'
                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                    order by c.id ASC"; //and c.gl_type=1


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                /* $result = array();
                  $result['id'] = $Row['id'];
                  $result['code'] = $Row['acc_code'];
                  $result['name'] = $Row['opening_balance_title'];
                  $result['Date'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);

                  $response['response'][] = $result; */

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $Row['opening_balnc_date'] = $this->objGeneral->convert_unix_into_date($Row['opening_balnc_date']);

                $response['response'][] = $Row;
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();


        return $response;
    }

    function get_opening_balance_detail_by_id($attr) {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT * FROM gl_opening_balance_detail WHERE id=".$attr['id']." LIMIT 1";
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

    function add_opening_balance_detail($attr) {
        /* echo "<pre>";
          print_r($attr['rec'][0]);exit; */

        $insert_chk = 0;
        $update_chk = $attr['rec'][0]->id;

        foreach ($attr['rec'] as $rec2) {

            $id = $rec2->id;

            if (($rec2->credit_amount > 0 || $rec2->debit_amount > 0) && $rec2->opening_balnc_type_id->value > 0) {

                if ($rec2->credit_amount > 0) {
                    $tran_type = 1;
                    $opening_balnc_amount = $rec2->credit_amount;
                } else if ($rec2->debit_amount > 0) {
                    $tran_type = 2;
                    $opening_balnc_amount = $rec2->debit_amount;
                }

                if ($id == 0) {

                    $Sql = "INSERT INTO gl_opening_balance_detail
                                   SET
                                        opening_balance_id='" . $attr['OpeningBalance_rec_id'] . "',
                                        description='" . $rec2->description . "',
                                        credit_amount='" . $opening_balnc_amount . "',
                                        debit_amount='" . $opening_balnc_amount . "',
                                        tran_type='" . $tran_type . "',
                                        account_id='" . $rec2->account_id . "',
                                        account_code='" . $rec2->account_code . "',
                                        doc_num='" . $rec2->doc_num . "',
                                        opening_balnc_type='" . $rec2->opening_balnc_type_id->value . "',
                                        opening_balnc_date='" . $this->objGeneral->convert_date($rec2->opening_balnc_date) . "',
                                        currency_id='" . $rec2->currency_id->id . "',
                                        create_date='" . current_date . "',
                                        balance_code='" . $rec2->balance_code . "',
                                        balance_id='" . $rec2->balance_id . "',
                                        status=1,
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "'
                                        ";
                    //echo $Sql;

                    $RS = $this->objsetup->CSI($Sql);
                    $insert_chk++;
                } else {

                    $Sql = "UPDATE gl_opening_balance_detail
                                   SET
                                        credit_amount='" . $opening_balnc_amount . "',
                                        debit_amount='" . $opening_balnc_amount . "',
                                        description='" . $rec2->description . "',
                                        tran_type='" . $tran_type . "',
                                        account_id='" . $rec2->account_id . "',
                                        account_code='" . $rec2->account_code . "',
                                        doc_num='" . $rec2->doc_num . "',
                                        opening_balnc_type='" . $rec2->opening_balnc_type_id->value . "',
                                        opening_balnc_date='" . $this->objGeneral->convert_date($rec2->opening_balnc_date) . "',
                                        currency_id='" . $rec2->currency_id->id . "',
                                        balance_code='" . $rec2->balance_code . "',
                                        balance_id='" . $rec2->balance_id . "'

                                        WHERE id = $id Limit 1 ";
                    /* echo $Sql;
                      exit; */

                    $RS = $this->objsetup->CSI($Sql);
                }
            }
        }
        // exit;
        //$RS = $this->objsetup->CSI($Sql);
        /* if ($id == 0)
          $id = $this->Conn->Insert_ID(); */
        //$this->Conn->Affected_Rows()

        if ($update_chk > 0) {
            $response['ack'] = 1;
            $response['id'] = $update_chk;
            $response['error'] = 'Record Update';
        } else if ($insert_chk > 0) {
            $response['ack'] = 1;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Update';
        }
        return $response;
    }

    /* =============GL Opening Balance sub records End============================================= */


    /* ============= Get Customer Data for flexi modal popup============================================= */

    function customerDataForFlexiModal($attr) {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;
        $cond = $attr['cond'];       

        if (!empty($attr['searchKeyword'])) {
            $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
            $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        }
        
        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("Customer", $this->arrUser);
        }

        $response = array();

        $Sql = "  SELECT * FROM (SELECT c.id as cid,c.customer_code,c.name,c.statusp,finance.posting_group_id, 
						 c.region,(SELECT currency_id FROM crm WHERE id = c.id) as currencyID,c.buying_group,c.segment,ref.name as postingGrp
				  FROM sr_crm_listing c
				  LEFT JOIN finance ON finance.customer_id = c.id
				  LEFT JOIN ref_posting_group as ref on ref.id=finance.posting_group_id
				  WHERE c.type IN (2,3) AND 
				  	  	c.customer_code IS NOT NULL AND 
						c.name <>'' AND 
						c.company_id=" . $this->arrUser['company_id'] . ") AS tbl  where 1 " . $where_clause . " ";

        // $Sql = $this->objsetup->whereClauseAppender($Sql, 24);
        
        $subQueryForBuckets = " SELECT  c.id
                                FROM sr_crm_listing c
                                WHERE c.type IN (2,3) AND 
                                    c.company_id=" . $this->arrUser['company_id'] . "";
        
        /* $subQueryForBuckets = " SELECT  c.id
                                FROM crm c
                                WHERE c.type IN (2,3) AND 
                                    c.company_id=" . $this->arrUser['company_id'] . ""; */

        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 48);

        // echo $subQueryForBuckets;exit;

        $Sql .= " AND (tbl.cid IN (".$subQueryForBuckets.") ) ";

        // echo $Sql;exit;

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if (!empty($attr['sort_column'])) {
            $column = 'tbl.' . $attr['sort_column'];

            if ($attr['sort_column'] == 'customer_code')
                $column = 'tbl.' . 'customer_code';
            else if ($attr['sort_column'] == 'name')
                $column = 'tbl.' . 'name';
            else if ($attr['sort_column'] == "region")
                $column = 'tbl.' . 'region';
            else if ($attr['sort_column'] == "buying_group")
                $column = 'tbl.' . 'buying_group';
            else if ($attr['sort_column'] == "segment")
                $column = 'tbl.' . 'segment';
            else if ($attr['sort_column'] == "postingGrp")
                $column = 'tbl.' . 'postingGrp';
            else if ($attr['sort_column'] == 'statusp')
                $column = 'tbl.statusp';

            $order_type = "Order BY " . $column . " DESC";
        }

        $column = 'tbl.cid';

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " DESC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;

        $RS = $this->objsetup->CSI($response['q'], "customer", sr_ViewPermission);

        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $row = array();
                $row['id'] = $Row['cid'];
                $row['customer_code'] = $Row['customer_code'];
                $row['name'] = $Row['name'];
                $row['currency_id'] = $Row['currencyID'];
                $row['posting_group_id'] = $Row['posting_group_id'];
                $row['postingGrp'] = $Row['postingGrp'];
                $row['region'] = $Row['region'];
                $row['buying_group'] = $Row['buying_group'];
                $row['segment'] = $Row['segment'];
                $row['statusp'] = $Row['statusp'];

                $response['response'][] = $row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        if ($cond == 'Detail')
            $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('CUSTDetailModal');
        else
            $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('CUSTModal');

        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        return $response;
    }

    /* ============= Get Supplier Data for flexi modal popup============================================= */

    function supplierDataForFlexiModal($attr) {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;
        $cond = $attr['cond'];       

        if (!empty($attr['searchKeyword'])) {
            $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
            $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        }

        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("Supplier", $this->arrUser);
        }

        $response = array();

        $Sql = "  SELECT * FROM (SELECT s.id as sid,s.supplier_code,s.name,s.statusp,s.posting_group_id,
						 s.region,s.selling_group,s.currency_id,s.segment,ref.name as postingGrp
				  FROM sr_srm_general_sel1 s
				  left join ref_posting_group as ref on ref.id=s.posting_group_id
				  WHERE s.type IN (2,3) AND 
				  	  	s.supplier_code IS NOT NULL AND 
						s.name <>'' AND 
						s.company_id=" . $this->arrUser['company_id'] . " ) AS tbl  where 1 " . $where_clause . " ";

        // $Sql = $this->objsetup->whereClauseAppender($Sql, 24);

        $subQueryForBuckets = "SELECT  s.id
                               FROM sr_srm_general_sel s
                               WHERE s.id IS NOT NULL ";
        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 24);

        // echo $subQueryForBuckets;exit;

        $Sql .= " AND (tbl.sid IN (".$subQueryForBuckets.") ) ";
        // echo $Sql;exit;

        //   s.statusp = 'Active' AND 

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if (!empty($attr['sort_column'])) {
            $column = 'tbl.' . $attr[sort_column];

            if ($attr['sort_column'] == 'supplier_code')
                $column = 'tbl.' . 'supplier_code';
            else if ($attr['sort_column'] == 'name')
                $column = 'tbl.' . 'name';
            else if ($attr['sort_column'] == "statusp")
                $column = 'tbl.' . 'statusp';
            else if ($attr['sort_column'] == "region")
                $column = 'tbl.' . 'region';
            else if ($attr['sort_column'] == "segment")
                $column = 'tbl.' . 'segment';
            else if ($attr['sort_column'] == "postingGrp")
                $column = 'tbl.' . 'postingGrp';
            else if ($attr['sort_column'] == 'selling_group')
                $column = 'tbl.selling_group';

            $order_type = "Order BY " . $column . " DESC";
        }

        $column = 'tbl.sid';

        if ($order_clause == "")
            $order_type = "Order BY " . $column . " DESC";
        else
            $order_type = $order_clause;

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;

        $RS = $this->objsetup->CSI($response['q'], "supplier", sr_ViewPermission);

        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $row = array();
                $row['id'] = $Row['sid'];
                $row['supplier_code'] = $Row['supplier_code'];
                $row['name'] = $Row['name'];
                $row['currency_id'] = $Row['currency_id'];
                $row['postingGrp'] = $Row['postingGrp'];
                $row['posting_group_id'] = $Row['posting_group_id'];
                $row['region'] = $Row['region'];
                $row['selling_group'] = $Row['selling_group'];
                $row['segment'] = $Row['segment'];
                $row['statusp'] = $Row['statusp'];

                $response['response'][] = $row;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'][] = array();
        }

        if ($cond == 'Detail')
            $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('SUPPDetailModal');
        else
            $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('SUPPModal');

        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        return $response;
    }

    /* ============= Get Item Data for flexi modal popup============================================= */

    function itemDataForFlexiModal($attr) {
        // $result = array();

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $defaultFilter = false;
        $cond = $attr['cond'];       

        if (!empty($attr['searchKeyword'])) {
            $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
            $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        } 

        if (empty($where_clause)) {
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("Item", $this->arrUser);
        } 

        $response = array();

        $Sql = "  SELECT * FROM ( SELECT prd.id,
						 prd.product_code,
						 prd.description,
                         prd.statusp,
						 prd.brand_id,
						 prd.category_id,
						 prd.unit_id,
						 prd.standard_price, 
                         prd.category_name, 
                         prd.brand_name, 
                         prd.unit_name
					From productcache  prd
					where prd.product_code IS NOT NULL and 
						  prd.company_id=" . $this->arrUser['company_id'] . ") AS tbl 
                    where 1 " . $where_clause . " ";
        //prd.status <> -1

        // $Sql = $this->objsetup->whereClauseAppender($Sql, 24);

        $subQueryForBuckets = "SELECT  prd.id
                               FROM productcache prd
                               WHERE prd.id IS NOT NULL ";
        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 11);

        // echo $subQueryForBuckets;exit;

        $Sql .= " AND (tbl.id IN (".$subQueryForBuckets.") ) ";

        // echo $Sql;exit;

        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        if (!empty($attr['sort_column'])) {
            $column = 'tbl.' . $attr[sort_column];

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

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        // echo $response['q'];exit;

        $RS = $this->objsetup->CSI($response['q'], "item", sr_ViewPermission);

        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $row = array();
                $row['id'] = $Row['id'];
                $row['product_code'] = $Row['product_code'];
                $row['name'] = $Row['description'];
                $row['category'] = $Row['category_name'];
                $row['brand'] = $Row['brand_name'];
                $row['unit'] = $Row['unit_name'];

                $response['response'][] = $row;
            }
            $response['ack'] = 1;
            $response['error'] = null;
        }
        else {
            $response['ack'] = 0;
            $response['error'] = 'No Record found';
        }

        if ($cond == 'Detail')
            $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('itemDetailModal');
        else
            $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('itemModal');

        return $response;
    }

    // Posting Date Range
    function get_posting_date_range($attr) {
        $response = array();
        $Sql = "SELECT posting_start_date, posting_end_date
                    FROM   financial_settings 
                    where  company_id=" . $this->arrUser['company_id'];


        $RS = $this->objsetup->CSI($Sql, 'finance', sr_ViewPermission);


        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            $result = array();
            $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_start_date']);
            $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['posting_end_date']);
            $response['response'] = $result;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['ack'] = 0;
        return $response;
    }

    function update_posting_date_range($attr) {

        $Sql1 = "SELECT id FROM financial_settings where company_id=" . $this->arrUser['company_id'];
        $RS1 = $this->objsetup->CSI($Sql1);

        if ($RS1->RecordCount() > 0) {
        
            $Sql = "UPDATE financial_settings 
                                        SET
                                            posting_start_date = " . $this->objGeneral->convert_date($attr['start_date']) . ", 
                                            posting_end_date = " . $this->objGeneral->convert_date($attr['end_date']) . "
                                        WHERE company_id=" . $this->arrUser['company_id'];

            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Record can\'t be Saved!';
            }
        }
        else{
            $response['ack'] = 0;
            $response['error'] = 'Company finance settings are missing!';
        }
        return $response;
    }

    //Bank Reconciliation Section start
    function getBankStatements($attr) {
        $response = array();
        $Sql = "SELECT br.doc_type, br.doc_no, br.transaction_type, br.account_no, br.account_name,
                       br.reference_id, br.posting_date, br.balance, br.debit_amount, br.account_no, br.credit_amount,
                       br.last_date_reconceited, br.bank_statement_end_date, br.closing_bank_balance, br.status,
                FROM   bank_reconciliation br
                where  company_id=" . $this->arrUser['company_id'];

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {

            $Row = $RS->FetchRow();
            $result = array();
            $result['Posting Date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
            $result['Doc Type'] = $Row['doc_type'];
            // $result['Doc No']   = $Row['doc_no'];
            $result['Account No'] = $Row['account_no'];
            $result['Account Name'] = $Row['account_name'];
            $result['Reference ID'] = $Row['reference_id'];
            $result['Balance'] = $Row['balance'];
            $result['Debit Amount'] = $Row['debit_amount'];
            $result['Credit Amount'] = $Row['credit_amount'];
            $result['Closing Bank Balance'] = $Row['closing_bank_balance'];
            $result['Last Date Reconceited'] = $this->objGeneral->convert_unix_into_date($Row['last_date_reconceited']);
            $result['Bank Statement End Date'] = $this->objGeneral->convert_unix_into_date($Row['bank_statement_end_date']);
            $result['status'] = $Row['status'];
            $response['response'] = $result;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['ack'] = 0;
        return $response;
    }

    function getSilBankStatements($attr) {
        $response = array();
        $Sql = "SELECT pd.document_type AS doc_type, pd.document_no AS doc_no, pd.transaction_type, pd.account_no, pd.account_name,
                       pd.posting_date, pd.converted_price AS balance, pd.debit_amount, pd.credit_amount,
                       pd.created_date AS last_date_reconceited, pd.status
                FROM   payment_details pd
                where  company_id=" . $this->arrUser['company_id'] . " AND  user_id=" . $this->arrUser['id'];


        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['Posting Date'] = $this->objGeneral->convert_unix_into_date($Row['posting_date']);
                $result['Doc Type'] = $Row['doc_type'];
                // $result['Doc No']   = $Row['doc_no'];
                $result['Account No'] = $Row['account_no'];
                $result['Account Name'] = $Row['account_name'];
                $result['Balance'] = $Row['balance'];
                $result['Debit Amount'] = $Row['debit_amount'];
                $result['Credit Amount'] = $Row['credit_amount'];
                $result['Last Date Reconceited'] = $this->objGeneral->convert_unix_into_date($Row['last_date_reconceited']);
                $result['status'] = $Row['status'];
                $response['response'][] = $result;
                $response['ack'] = 1;
                $response['error'] = NULL;
            }

            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }

        // print_r($response); exit;
        return $response;
    }

    
    function get_on_hold_status($attr) {
        $response = array();
        // module_type = 1-> customer
        // module_type = 2-> supplier
        if ($attr['module_type'] == '1') {
            if ($attr['invoice_type'] == 'Sales Invoice') {
                $table = 'orders';
                $type = '1';
            } else if ($attr['invoice_type'] == 'Credit Note') {
                $table = 'return_orders';
                $type = '2';
            } else if ($attr['invoice_type'] == 'Customer Payment' || $attr['invoice_type'] == 'Customer Refund' || $attr['invoice_type'] == 'General Journal') {
                $table = 'payment_details';
                $type = '5';
            } else if ($attr['invoice_type'] == 'Opening Balance Invoice' || $attr['invoice_type'] == 'Opening Balance Credit Note') {
                $table = 'opening_balance_customer';
                $type = '6';
            } else if ($attr['invoice_type'] == 'Bank Opening Balance Payment' || $attr['invoice_type'] == 'Bank Opening Balance Refund') {
                $table = 'opening_balance_bank';
                $type = '7';
            }
        } else {
            if ($attr['invoice_type'] == 'Purchase Invoice') {
                $table = 'srm_invoice';
                $type = '3';
            } else if ($attr['invoice_type'] == 'Debit Note') {
                $table = 'srm_order_return';
                $type = '4';
            } else if ($attr['invoice_type'] == 'Supplier Payment' || $attr['invoice_type'] == 'Supplier Refund' || $attr['invoice_type'] == 'General Journal') {
                $table = 'payment_details';
                $type = '5';
            } else if ($attr['invoice_type'] == 'Opening Balance Invoice' || $attr['invoice_type'] == 'Opening Balance Debit Note') {
                $table = 'opening_balance_customer';
                $type = '6';
            } else if ($attr['invoice_type'] == 'Bank Opening Balance Payment' || $attr['invoice_type'] == 'Bank Opening Balance Refund') {
                $table = 'opening_balance_bank';
                $type = '7';
            }
        }

        $Sql = "SELECT o.id, o.comments, o.type,
                (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE emp.id = o.user_id) AS AddedBy,
                AddedOn
                FROM on_hold_invoice AS o
                WHERE o.invoice_type = $type AND
                    o.invoice_id = $attr[invoice_id] AND 
                    o.company_id = " . $this->arrUser['company_id']."
                ORDER BY o.id DESC";

        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['AddedOn'] = $this->objGeneral->convert_unix_into_date($Row['AddedOn']);
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
        }
        return $response;
    }

    function change_on_hold_status($attr) {
        $response = array();
        // module_type = 1-> customer
        // module_type = 2-> supplier
        if ($attr['module_type'] == '1') 
        {
            if ($attr['invoice_type'] == 'Sales Invoice') {
                $table = 'orders';
                $type = '1';
            } else if ($attr['invoice_type'] == 'Credit Note') {
                $table = 'return_orders';
                $type = '2';
            } else if ($attr['invoice_type'] == 'Customer Payment' || $attr['invoice_type'] == 'Customer Refund' || $attr['invoice_type'] == 'General Journal') {
                $table = 'payment_details';
                $type = '5';
            } else if ($attr['invoice_type'] == 'Opening Balance Invoice' || $attr['invoice_type'] == 'Opening Balance Credit Note') {
                $table = 'opening_balance_customer';
                $type = '6';
            } else if ($attr['invoice_type'] == 'Bank Opening Balance Payment' || $attr['invoice_type'] == 'Bank Opening Balance Refund') {
                $table = 'opening_balance_bank';
                $type = '7';
            }
        } 
        else 
        {
            if ($attr['invoice_type'] == 'Purchase Invoice') {
                $table = 'srm_invoice';
                $type = '3';
            } else if ($attr['invoice_type'] == 'Debit Note') {
                $table = 'srm_order_return';
                $type = '4';
            } else if ($attr['invoice_type'] == 'Supplier Payment' || $attr['invoice_type'] == 'Supplier Refund') {
                $table = 'payment_details';
                $type = '5';
            } else if ($attr['invoice_type'] == 'Opening Balance Invoice' || $attr['invoice_type'] == 'Opening Balance Debit Note') {
                $table = 'opening_balance_customer';
                $type = '6';
            } else if ($attr['invoice_type'] == 'Bank Opening Balance Payment' || $attr['invoice_type'] == 'Bank Opening Balance Refund') {
                $table = 'opening_balance_bank';
                $type = '7';
            }
        }

        $Sql = "UPDATE $table SET on_hold = " . $attr[status] . " WHERE id=" . $attr['invoice_id'];
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['error'] = null;
            $response['ack'] = 1;
        } else {
            $response['error'] = "Record not updated";
            $response['ack'] = 0;
        }
        return $response;
    }

    function add_comment_on_for_invoice_hold($attr) {
        // module_type = 1-> customer
        // module_type = 2-> supplier
        if ($attr['module_type'] == '1') {
            if ($attr['invoice_type'] == 'Sales Invoice') {
                $table = 'orders';
                $type = '1';
            } else if ($attr['invoice_type'] == 'Credit Note') {
                $table = 'return_orders';
                $type = '2';
            } else if ($attr['invoice_type'] == 'Customer Payment' || $attr['invoice_type'] == 'Customer Refund' || $attr['invoice_type'] == 'General Journal') {
                $table = 'payment_details';
                $type = '5';
            } else if ($attr['invoice_type'] == 'Opening Balance Invoice' || $attr['invoice_type'] == 'Opening Balance Credit Note') {
                $table = 'opening_balance_customer';
                $type = '6';
            } else if ($attr['invoice_type'] == 'Bank Opening Balance Payment' || $attr['invoice_type'] == 'Bank Opening Balance Refund') {
                $table = 'opening_balance_bank';
                $type = '7';
            }
        } else {
            if ($attr['invoice_type'] == 'Purchase Invoice') {
                $table = 'srm_invoice';
                $type = '3';
            } else if ($attr['invoice_type'] == 'Debit Note') {
                $table = 'srm_order_return';
                $type = '4';
            } else if ($attr['invoice_type'] == 'Supplier Payment' || $attr['invoice_type'] == 'Supplier Refund' || $attr['invoice_type'] == 'General Journal') {
                $table = 'payment_details';
                $type = '5';
            } else if ($attr['invoice_type'] == 'Opening Balance Invoice' || $attr['invoice_type'] == 'Opening Balance Debit Note') {
                $table = 'opening_balance_customer';
                $type = '6';
            } else if ($attr['invoice_type'] == 'Bank Opening Balance Payment' || $attr['invoice_type'] == 'Bank Opening Balance Refund') {
                $table = 'opening_balance_bank';
                $type = '7';
            }
        }
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $id = ($attr['id'] != '') ? $attr['id'] : 0;
        if($id > 0)
        {
            $Sql = "UPDATE on_hold_invoice SET 
                        comments    = '" .addslashes($attr['comments']) . "'
                    WHERE id = $id";
        }
        else
        {
            $status = ($attr['status'] == 0) ? " 1 " : "  2 "; 

            $Sql = "INSERT INTO on_hold_invoice SET 
                        comments    = '" .addslashes($attr['comments']) . "',
                        invoice_id  = " . $attr['invoice_id'] . ",
                        invoice_type=" . $type . ",
                        type=" . $status . ",
                        company_id  = " . $this->arrUser['company_id'] . ",
                        user_id  = " . $this->arrUser['id'] . ",
                        AddedOn  = UNIX_TIMESTAMP (NOW())";
        }
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            if($id == 0)
            {
                $status1 = ($attr['status'] == 0) ? " 1 " : "  0 "; 

                $Sql1 = "UPDATE $table SET on_hold = " . $status1 . " WHERE id=" . $attr['invoice_id'];
                // echo $Sql1;exit;
                $RS1 = $this->objsetup->CSI($Sql1);
            }

            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;

            $response['error'] = null;
            $response['ack'] = 1;
        } else {
            $response['error'] = "Record not updated";
            $response['ack'] = 0;
        }
        return $response;
    }

    function get_transfer_orders_pre_data($attr)
    {
        $response = array();
        $Sql = "SELECT w.id AS warehouse_id, 
                    CONCAT(w.name, ' - ', w.wrh_code) AS warehouse_name, 
                    w.address_1,
                    w.address_2,
                    w.city,
                    w.county,
                    w.wrh_code AS warehouse_code, 
                    wbl.id AS location_id, 
                    wbl.title AS location_name
                FROM warehouse AS w
                LEFT JOIN warehouse_bin_location AS wbl ON wbl.`warehouse_id` = w.id
                WHERE 
                    w.company_id=" . $this->arrUser['company_id'] . " AND 
                    wbl.company_id=" . $this->arrUser['company_id'] . " AND 
                    w.status=1 AND 
                    wbl.status = 1
                GROUP BY wbl.id
                ORDER BY w.id";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $prev_wh_id = 0;
            $count = -1;
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                if($prev_wh_id != $Row['warehouse_id'])
                {
                    $prev_wh_id = $Row['warehouse_id'];
                    $count = $count + 1;
                    $result = array();
                    $result['location_id']      = $Row['location_id'];
                    $result['location_name']    = $Row['location_name'];

                    $response['response'][$count]['warehouse_id']   = $Row['warehouse_id'];
                    $response['response'][$count]['warehouse_name'] = $Row['warehouse_name'];
                    $response['response'][$count]['warehouse_code'] = $Row['warehouse_code'];
                    $response['response'][$count]['address_1']      = $Row['address_1'];
                    $response['response'][$count]['address_2']      = $Row['address_2'];
                    $response['response'][$count]['city']           = $Row['city'];
                    $response['response'][$count]['county']         = $Row['county'];
                    $response['response'][$count]['location_arr'][] = $result;
                    
                }
                else
                {
                    $result = array();
                    $result['location_id']      = $Row['location_id'];
                    $result['location_name']    = $Row['location_name'];
                    $response['response'][$count]['location_arr'][] = $result;
                }
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }

        // print_r($response); exit;
        return $response;
    }

    function get_items_by_warehouse_id($attr)
    {
        $response = array();
        $from_warehouse_id  = ($attr['from_warehouse_id'] != '') ? $attr['from_warehouse_id'] : 0;
        $to_warehouse_id    = ($attr['to_warehouse_id'] != '') ? $attr['to_warehouse_id'] : 0;
        
        $Sql = "SELECT prd.id AS item_id, prd.product_code AS code, prd.description AS name, prd.available_quantity AS qty, prd.unit_name AS uom_name, prd.unit_id AS uom_id, prd.uomSetupID as uom_setup_id, prd.stock_check
                FROM sr_product_purchaselist AS prd 
                WHERE 
                    prd.company_id = " . $this->arrUser['company_id'] . " AND
                    prd.wh_warehouse_id = $from_warehouse_id AND
                    prd.available_quantity > 0  AND
                    (SELECT pwl.id FROM product_warehouse_location AS pwl WHERE pwl.item_id= prd.id AND pwl.warehouse_id=$to_warehouse_id LIMIT 1) > 0
                order by prd.id";
        //$Sql = $this->objsetup->whereClauseAppender($Sql,11);
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }
        return $response;
    }

    function delete_transfer_order_item($attr)
    {
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $Sql = "DELETE FROM transfer_orders_details 
                    WHERE id = ".$attr['id']." AND 
                    company_id=" . $this->arrUser['company_id']." AND
                    (SELECT type FROM transfer_orders WHERE id=$attr[order_id] LIMIT 1) = 0
                    Limit 1";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;

            $stkSql = "DELETE FROM warehouse_allocation 
                        WHERE 
                        order_id = $attr[order_id] AND 
                        product_id = $attr[product_id] AND
                        transfer_order_detail_id = ".$attr['id']."  AND
                        type = '5'";
                    // echo $stkSql;exit;
            $this->objsetup->CSI($stkSql);
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        return $response;
    }
    function get_all_transfer_orders($attr)
    {
        $response = array();
        $Sql = "SELECT t.id, t.code, t.AddedOn, (SELECT CONCAT(emp.`first_name`, emp.`last_name`) FROM employees AS emp WHERE emp.id = t.AddedBy) AS AddedBy
                FROM transfer_orders AS t
                WHERE type=".$attr['type']." AND company_id=" . $this->arrUser['company_id'];
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql, "transfer_stock", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['AddedOn'] = $this->objGeneral->convert_unix_into_date($Row['AddedOn']);
                $response['response'][] = $Row;
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
        }

        // print_r($response); exit;
        return $response;
    }

    function get_transfer_order_by_id($attr)
    { 
        $volume = 0;
        $volume_unit = '';
        $weight = 0;
        $weightunit = '';
        $weight_permission = 0;  
        $volume_permission = 0;  

        $Sql4 = "SELECT  SUM(uomsetup.volume * inv.qty) AS volume,
                    'cm3' AS volume_unit,
                    SUM((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                        ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                        END)* inv.qty) AS weight,
                    'kg' AS weightunit,
                    (SELECT weight_permission FROM transfer_orders 
                     LEFT JOIN items_weight_setup AS w ON ((w.title = 'Transfer Order' AND transfer_orders.type=0) OR 
							   (w.title = 'Posted Transfer Order' AND transfer_orders.type=1) ) AND 
				        transfer_orders.company_id = w.company_id WHERE transfer_orders.id= '".$attr['id']."') AS weight_permission,
                    (SELECT volume_permission FROM transfer_orders 
                     LEFT JOIN items_weight_setup AS w ON ((w.title = 'Transfer Order' AND transfer_orders.type=0) OR 
							   (w.title = 'Posted Transfer Order' AND transfer_orders.type=1) ) AND 
				        transfer_orders.company_id = w.company_id WHERE transfer_orders.id= '".$attr['id']."') AS volume_permission
                FROM transfer_orders_details AS inv
                LEFT JOIN units_of_measure_setup AS uomsetup ON inv.uom_setup_id = uomsetup.id
                WHERE inv.transfer_order_id='".$attr['id']."' and inv.company_id = " . $this->arrUser['company_id']." ";
        //echo $Sql4."<hr>"; exit;

        $rs4 = $this->objsetup->CSI($Sql4, "transfer_stock", sr_ViewPermission);

        if ($rs4->RecordCount() > 0){
            $volume = $rs4->fields['volume'];
            $volume_unit = $rs4->fields['volume_unit'];
            $weight = $rs4->fields['weight'];
            $weightunit = $rs4->fields['weightunit'];
            $weight_permission = $rs4->fields['weight_permission'];
            $volume_permission = $rs4->fields['volume_permission'];
        }

        $response = array();
        $Sql = "SELECT t.*, s.sell_to_cust_no, s.sell_to_cust_name, s.grand_total, s.sell_to_address, s.sell_to_address2, s.cust_phone, s.cust_order_no
                FROM transfer_orders AS t
                LEFT JOIN srm_invoice AS s ON s.id = t.purchase_order_id AND s.company_id=" . $this->arrUser['company_id']."
                WHERE 
                    t.id = ".$attr['id']." AND 
                    t.company_id=" . $this->arrUser['company_id'];
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            if ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['shipping_agent_name'] = $Row['sell_to_cust_no'].' - '.$Row['sell_to_cust_name'];
                $Row['shipping_charges']    = floatval($Row['grand_total']);
                $Row['shipping_address_1']  = $Row['sell_to_address'];
                $Row['shipping_address_2']  = $Row['sell_to_address2'];
                $Row['shipping_phone']      = $Row['cust_phone'];
                $Row['shipping_ref_no']     = $Row['cust_order_no'];
                
                
                $Row['order_date'] = $this->objGeneral->convert_unix_into_date($Row['order_date']);
                $Row['items'] =  $this->get_transfer_order_details($attr);
                $response['response'] = $Row;
            }
            $response['ack'] = 1;
        } else {
            $response['ack'] = 0;
            $response['response'] = array();
            $response['bucketFail'] = 1;
        }
        
        $response['volume'] = $volume;
        $response['volume_unit'] = $volume_unit;
        $response['weight'] = $weight;
        $response['weightunit'] = $weightunit;
        $response['weight_permission'] = $weight_permission;
        $response['volume_permission'] = $volume_permission;

        // print_r($response); exit;
        return $response;
    }

    function get_transfer_order_details($attr)
    {
        $response = array();
        $Sql = "SELECT t.*, (SELECT IFNULL(SUM(wh.quantity), 0) 
                            FROM warehouse_allocation as wh 
                            WHERE wh.company_id =" . $this->arrUser['company_id'] . " AND 
                                wh.type = 5 AND ledger_type = 2 AND wh.order_id = t.transfer_order_id AND
                                wh.location = IFNULL((SELECT pwl.id FROM `product_warehouse_location` AS pwl WHERE pwl.warehouse_id=wh.warehouse_id AND pwl.warehouse_loc_id= t.location_from AND pwl.item_id = t.item_id LIMIT 1), 0) AND  
                                wh.transfer_order_detail_id = t.id) AS allocated_stock
                FROM transfer_orders_details AS t
                WHERE t.transfer_order_id = ".$attr['id']." AND t.company_id=" . $this->arrUser['company_id'];
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $Row['qty'] = intval($Row['qty']);
                $Row['allocated_stock'] = intval($Row['allocated_stock']);
                $response[] = $Row;
            }
        }
        return $response;
    }


    function update_transfer_order($attr)
    {
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;

        $id = ($attr['id'] != '') ? $attr['id'] : 0;
        $purchase_order_id = ($attr['purchase_order_id'] != '') ? $attr['purchase_order_id'] : 0;
        $shipping_charges = ($attr['shipping_charges'] != '') ? $attr['shipping_charges'] : 0;

        if($id == 0)
        {            
            $Sql = "INSERT INTO transfer_orders SET  
                        code = SR_GetNextSeq('transfer_orders', " . $this->arrUser['company_id'] . ", 0, 0),
                        warehouse_from              = $attr[warehouse_from_id], 
                        warehouse_from_name         = '".addslashes($attr['warehouse_from_name'])."', 
                        warehouse_from_address_1    = '".addslashes($attr['warehouse_from_address_1'])."', 
                        warehouse_from_address_2    = '".addslashes($attr['warehouse_from_address_2'])."', 
                        warehouse_from_city         = '".addslashes($attr['warehouse_from_city'])."', 
                        warehouse_from_county       = '".addslashes($attr['warehouse_from_county'])."', 
                        warehouse_to                = $attr[warehouse_to_id], 
                        warehouse_to_name           = '".addslashes($attr['warehouse_to_name'])."', 
                        warehouse_to_address_1      = '".addslashes($attr['warehouse_to_address_1'])."', 
                        warehouse_to_address_2      = '".addslashes($attr['warehouse_to_address_2'])."', 
                        warehouse_to_city           = '".addslashes($attr['warehouse_to_city'])."', 
                        warehouse_to_county         = '".addslashes($attr['warehouse_to_county'])."', 
                        in_transit_code             = $attr[in_transit_code], 
                        order_date                  = " . $this->objGeneral->convert_date($attr['order_date']) . ",
                        purchase_order_id           = $purchase_order_id, 
                        purchase_order_code         = '".addslashes($attr['purchase_order_code'])."', 
                        shipping_agent_name         = '".addslashes($attr['shipping_agent_name'])."',
                        shipping_address_1          = '".addslashes($attr['shipping_address_1'])."',
                        shipping_address_2          = '".addslashes($attr['shipping_address_2'])."',
                        shipping_phone              = '".addslashes($attr['shipping_phone'])."',
                        shipping_ref_no             = '".addslashes($attr['shipping_ref_no'])."',
                        currency_code               = '".addslashes($attr['currency_code'])."',
                        shipping_charges    = $shipping_charges,
                        company_id = " . $this->arrUser['company_id']. ",
                        user_id = " . $this->arrUser['id'];

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }
        else
        {
            $Sql = "UPDATE transfer_orders SET  
                        warehouse_from              = $attr[warehouse_from_id], 
                        warehouse_from_name         = '".addslashes($attr['warehouse_from_name'])."', 
                        warehouse_from_address_1    = '".addslashes($attr['warehouse_from_address_1'])."', 
                        warehouse_from_address_2    = '".addslashes($attr['warehouse_from_address_2'])."', 
                        warehouse_from_city         = '".addslashes($attr['warehouse_from_city'])."', 
                        warehouse_from_county       = '".addslashes($attr['warehouse_from_county'])."', 
                        warehouse_to                = $attr[warehouse_to_id],
                        warehouse_to_name           = '".addslashes($attr['warehouse_to_name'])."', 
                        warehouse_to_address_1      = '".addslashes($attr['warehouse_to_address_1'])."', 
                        warehouse_to_address_2      = '".addslashes($attr['warehouse_to_address_2'])."', 
                        warehouse_to_city           = '".addslashes($attr['warehouse_to_city'])."', 
                        warehouse_to_county         = '".addslashes($attr['warehouse_to_county'])."', 
                        in_transit_code             = $attr[in_transit_code], 
                        order_date                  = " . $this->objGeneral->convert_date($attr['order_date']) . ",
                        purchase_order_id           = $purchase_order_id, 
                        purchase_order_code         = '".addslashes($attr['purchase_order_code'])."', 
                        shipping_agent_name         = '".addslashes($attr['shipping_agent_name'])."',
                        shipping_address_1          = '".addslashes($attr['shipping_address_1'])."',
                        shipping_address_2          = '".addslashes($attr['shipping_address_2'])."',
                        shipping_phone              = '".addslashes($attr['shipping_phone'])."',
                        shipping_ref_no             = '".addslashes($attr['shipping_ref_no'])."',
                        currency_code               = '".addslashes($attr['currency_code'])."',
                        shipping_charges    = $shipping_charges
                    WHERE id=$id";
                    
            $RS = $this->objsetup->CSI($Sql);
        }
        if($id > 0)
        {
            foreach($attr['items'] as $item)
            {
                $location_from  = ($item->location_from->location_id != '') ? $item->location_from->location_id : 0;
                $location_to    = ($item->location_to->location_id != '') ? $item->location_to->location_id : 0;
                $uom_id         = ($item->uom_id != '') ? $item->uom_id : 0;
                $uom_setup_id   = ($item->uom_setup_id != '') ? $item->uom_setup_id : 0;
                $qty            = ($item->qty != '') ? $item->qty : 0;
                $item_id        = ($item->item_id != '') ? $item->item_id : 0;
                $stock_check    = ($item->stock_check != '') ? $item->stock_check : 0;

                if($item->id == '')
                {
                    $itemSql = "INSERT INTO transfer_orders_details SET
                                transfer_order_id = $id,
                                item_id     =  $item_id,
                                item_code   = '".addslashes($item->item_code)."',
                                item_name   = '".addslashes($item->item_name)."',
                                qty         = $qty,
                                stock_check = $stock_check,
                                uom_name    = '".addslashes($item->uom_name)."',
                                uom_id      = '$uom_id',
                                uom_setup_id= '$uom_setup_id',
                                location_from =  $location_from,
                                location_to =  $location_to, 
                                company_id = " . $this->arrUser['company_id']. ",
                                user_id = " . $this->arrUser['id'];
                }
                else
                {
                    $itemSql = "UPDATE transfer_orders_details SET
                                    item_id     =  $item_id,
                                    item_code   = '".addslashes($item->item_code)."',
                                    item_name   = '".addslashes($item->item_name)."',
                                    qty         = $qty,
                                    stock_check = $stock_check,
                                    uom_name    = '".addslashes($item->uom_name)."',
                                    uom_id      = '$uom_id',
                                    uom_setup_id= '$uom_setup_id',
                                    location_from =  $location_from,
                                    location_to =  $location_to
                                WHERE 
                                    id = $item->id";
                }
                $RS = $this->objsetup->CSI($itemSql);
            }
            $response['id'] = $id;
            $response['ack'] = 1;
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
        } 
        else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        return $response;
    }

    function add_jl_transfer_order_item_single($attr)
    {
        // print_r($attr['item']->location_from->location_id);exit;
        $location_from = ($attr['item']->location_from->location_id != '') ? $attr['item']->location_from->location_id : 0;
        $location_to = ($attr['item']->location_to->location_id != '') ? $attr['item']->location_to->location_id : 0;
        $uom_id         = ($item['item']->uom_id != '') ? $item['item']->uom_id : 0;

        $id = ($attr['item']->id != '') ? $attr['item']->id : 0;
        $item = $attr['item'];
        // print_r($item->item_id);exit;

        if($id == 0)
        {
            $itemSql = "INSERT INTO transfer_orders_details SET
                        transfer_order_id = $attr[order_id],
                        item_id     =  $item->item_id,
                        item_code   = '".addslashes($item->item_code)."',
                        item_name   = '".addslashes($item->item_name)."',
                        qty         = $item->qty,
                        uom_name    = '".addslashes($item->uom_name)."',
                        uom_id      = '$uom_id',
                        location_from =  $location_from,
                        location_to =  $location_to, 
                        company_id = " . $this->arrUser['company_id']. ",
                        user_id = " . $this->arrUser['id'];
            // echo $itemSql;exit;
            $RS = $this->objsetup->CSI($itemSql);
            $id = $this->Conn->Insert_ID();
        }
        else
        {
            $itemSql = "UPDATE transfer_orders_details SET
                            item_id     =  $item->item_id,
                            item_code   = '".addslashes($item->item_code)."',
                            item_name   = '".addslashes($item->item_name)."',
                            qty         = $item->qty,
                            uom_name    = '".addslashes($item->uom_name)."',
                            uom_id      = '$uom_id',
                            location_from =  $location_from,
                            location_to =  $location_to
                        WHERE 
                            id = $id";
            // echo $itemSql;exit;
            $RS = $this->objsetup->CSI($itemSql);
        }

        $response['ack'] = 1; 
        $response['id'] = $id; 
        
        return $response;
    }
    
    function post_transfer_order($attr)
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

        $Sql = "CALL SR_Post_Transfer_Order(" . $attr['id'] . ",
                                                " . $this->arrUser['company_id'] . ",
                                                " . $this->arrUser['id'] . ",
                                                    @errorNo,
                                                    @param1,
                                                    @param2,
                                                    @param3,
                                                    @param4);";
        // echo $Sql;
        // exit;
        $RS = $this->objsetup->CSI($Sql);

        if($RS->msg == 1)
        {             
            $response['ack'] = 1;
            $response['error'] = NULL;
            $this->Conn->commitTrans();
            $this->Conn->autoCommit = true;
            
            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'id:'.$attr['id'];
            $srLogTrace['ErrorMessage'] = '';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response;
        } 
        else
        { 
            $response['ack'] = 0;
            $response['error'] = $RS->Error;
        }
        return $response;
    }

    function transfer_order_pdf($attr)
    {
        $id = ($attr['id'] != '') ? $attr['id'] : '0';

        $volume = 0;
        $volume_unit = '';
        $weight = 0;
        $weightunit = '';
        $weight_permission = 0;  
        $volume_permission = 0;  

        $Sql4 = "SELECT  SUM(uomsetup.volume * inv.qty) AS volume,
                    'cm3' AS volume_unit,
                    SUM((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                        ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                        END)* inv.qty) AS weight,
                    'kg' AS weightunit,
                    (SELECT weight_permission FROM transfer_orders 
                     LEFT JOIN items_weight_setup AS w ON ((w.title = 'Transfer Order' AND transfer_orders.type=0) OR 
							   (w.title = 'Posted Transfer Order' AND transfer_orders.type=1) ) AND 
				        transfer_orders.company_id = w.company_id WHERE transfer_orders.id= '$id') AS weight_permission,
                    (SELECT volume_permission FROM transfer_orders 
                     LEFT JOIN items_weight_setup AS w ON ((w.title = 'Transfer Order' AND transfer_orders.type=0) OR 
							   (w.title = 'Posted Transfer Order' AND transfer_orders.type=1) ) AND 
				        transfer_orders.company_id = w.company_id WHERE transfer_orders.id= '$id') AS volume_permission
                FROM transfer_orders_details AS inv
                LEFT JOIN units_of_measure_setup AS uomsetup ON inv.uom_setup_id = uomsetup.id
                WHERE inv.transfer_order_id='$id' ";
        //echo $Sql4."<hr>"; exit;

        $rs4 = $this->objsetup->CSI($Sql4);

        if ($rs4->RecordCount() > 0){
            $volume = $rs4->fields['volume'];
            $volume_unit = $rs4->fields['volume_unit'];
            $weight = $rs4->fields['weight'];
            $weightunit = $rs4->fields['weightunit'];
            $weight_permission = $rs4->fields['weight_permission'];
            $volume_permission = $rs4->fields['volume_permission'];
        }

        /* $Sql = "SELECT id, SUM(quantity) AS quantity, container_no, batch_no, transfer_order_detail_id 
                FROM warehouse_allocation
                WHERE
                    order_id=$id AND
                    type = 5 AND 
                    ledger_type = 1 AND
                    company_id=" . $this->arrUser['company_id']."
                GROUP BY transfer_order_detail_id "; */
        
        /* $Sql = "SELECT wh_alloc.id, 
                (CASE
                    WHEN tod.stock_check = 0 THEN
                        tod.qty
                    ELSE
                        SUM(wh_alloc.quantity)
                END) AS quantity, wh_alloc.container_no, wh_alloc.batch_no, tod.id AS transfer_order_detail_id 
                FROM transfer_orders_details AS tod 
                LEFT JOIN warehouse_allocation AS wh_alloc ON wh_alloc.order_id=$id AND wh_alloc.type = 5 AND wh_alloc.ledger_type = 1 
                WHERE
                    tod.transfer_order_id=$id AND
                    tod.company_id=" . $this->arrUser['company_id']."
                GROUP BY (CASE WHEN tod.stock_check = 0 THEN tod.id ELSE wh_alloc.transfer_order_detail_id END)"; *///tod.qty
        $Sql = "SELECT wh_alloc.id, 
                        wh_alloc.quantity AS quantity, 
                        wh_alloc.container_no, 
                        wh_alloc.batch_no,
                        wh_alloc.transfer_order_detail_id,
                        (uomsetup.volume * wh_alloc.quantity) AS volume,
                        'cm3' AS volume_unit,
                        'kg' AS weightunit,
                        ((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                            ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                            END) * wh_alloc.quantity) AS weight
                FROM warehouse_allocation AS wh_alloc
                LEFT JOIN transfer_orders_details AS tod ON wh_alloc.order_id=tod.transfer_order_id AND wh_alloc.transfer_order_detail_id=tod.id
                LEFT JOIN units_of_measure_setup AS uomsetup ON tod.uom_setup_id = uomsetup.id
                WHERE
                    wh_alloc.order_id=$id AND
                    wh_alloc.type = 5 AND 
                    wh_alloc.ledger_type = 1 AND
                    wh_alloc.company_id=" . $this->arrUser['company_id']." AND
                    tod.stock_check = 1 
                -- GROUP BY transfer_order_detail_id
                UNION
                SELECT wh_alloc.id, tod.qty AS quantity, 
                       wh_alloc.container_no, 
                       wh_alloc.batch_no, 
                       tod.id AS transfer_order_detail_id,
                        (uomsetup.volume * tod.qty) AS volume,
                        'cm3' AS volume_unit,
                        'kg' AS weightunit,
                        ((CASE WHEN uomsetup.weightunit = 1 THEN (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2)) / 1000
                            ELSE (ROUND(uomsetup.netweight,2) + ROUND(uomsetup.packagingweight,2))
                            END) * tod.qty) AS weight 
                FROM transfer_orders_details AS tod 
                LEFT JOIN warehouse_allocation AS wh_alloc ON wh_alloc.order_id=$id AND wh_alloc.type = 5 AND wh_alloc.transfer_order_detail_id=tod.id AND wh_alloc.ledger_type = 1 
                LEFT JOIN units_of_measure_setup AS uomsetup ON tod.uom_setup_id = uomsetup.id
                WHERE
                    tod.transfer_order_id=$id AND
                    tod.stock_check=0 AND
                    tod.company_id=" . $this->arrUser['company_id']."
                GROUP BY tod.id";

        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                if($Row['volume_unit'] == 5) 
                    $Row['volume_unit'] = 'mm3';

                $Row['weight_permission'] = $weight_permission;
                $Row['volume_permission'] = $volume_permission;

                $response['response'][] = $Row;
            }
            $Sql_com = "SELECT com.name, com.address, com.address_2, com.city, com.county, 
                                com.postcode, com.telephone, com.fax
                        FROM company AS com
                        WHERE id= ".$this->arrUser['company_id'];
            // echo $Sql_com;exit;
            $RS_com = $this->objsetup->CSI($Sql_com);
            if ($RS_com->RecordCount() > 0) {
                if ($Row_com = $RS_com->FetchRow()) {
                    foreach ($Row_com as $key => $value) {
                        if (is_numeric($key))
                            unset($Row_com[$key]);
                    }
                    $response['company_details'] = $Row_com;
                }
            }
            $response['ack']= 1;
        }
        else
            $response['ack']= 0;
        
        $response['volume'] = $volume;
        $response['volume_unit'] = $volume_unit;
        $response['weight'] = $weight;
        $response['weightunit'] = $weightunit;
        $response['weight_permission'] = $weight_permission;
        $response['volume_permission'] = $volume_permission;
        
        return $response;
    }

    function get_financial_year_dates($attr)
    {
        $Sql = "SELECT
                        DATE_FORMAT(FROM_UNIXTIME(`financial_settings`.`year_start_date`), '%d/%m/%Y') AS fin_year_start_date,
                        DATE_FORMAT(FROM_UNIXTIME(`financial_settings`.`year_end_date`), '%d/%m/%Y') AS fin_year_end_date,
                        DATE_FORMAT(DATE_SUB(CAST(FROM_UNIXTIME(`financial_settings`.`year_start_date`) AS DATE), INTERVAL 365 DAY), '%d/%m/%Y') AS prev_fin_year_start_date
                    FROM `financial_settings`
                    WHERE company_id = " . $this->arrUser['company_id'];
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'] = $Row;
            }
            $response['ack']= 1;
        }
        else
            $response['ack']= 0;
        return $response;
    }

    function get_finance_matrix($attr)
    {
        /* if ($this->arrUser['user_type'] > 2){
            $response['Access'] = 0;
            $response['PermissionName'] = 'View';
            $response['Module'] = 'Finance Matrix';
            return $response;
            
        } */

        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        
        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("FinanceMatrix", $this->arrUser);
        }
        

        $current_year_start_date    = $this->objGeneral->convertStartDate($attr['current_year_start_date']);
        $current_month_start_date   = $this->objGeneral->convertStartDate($attr['current_month_start_date']);
        $current_month_end_date     = $this->objGeneral->convertStartDate($attr['current_month_end_date']);

        $fin_year_start_date        = $this->objGeneral->convertStartDate($attr['fin_year_start_date']);
        $fin_year_end_date          = $this->objGeneral->convertStartDate($attr['fin_year_end_date']);
        $prev_fin_year_start_date   = $this->objGeneral->convertStartDate($attr['prev_fin_year_start_date']);

        $start_date = $this->objGeneral->convertStartDate($attr['start_date']);
        $end_date   = $this->objGeneral->convertStartDate($attr['end_date']);


        $Sql = "SELECT * FROM (SELECT tbl.glid AS id, tbl.accountcode AS gl_no, tbl.name AS gl_name,tbl.category,tbl.subcategory,ROUND(SUM(tbl.SumOfCreditDebit) ,2) AS selected_period,
 
                        (SELECT SUM(C.SumOfCreditDebit)
                        FROM srmatrix_finance_sel AS C
                        WHERE C.invoice_dateUnConv >= '$fin_year_start_date'
                        AND C.invoice_dateUnConv <= '$fin_year_end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                        AND C.Accountcode = tbl.accountcode) AS accouting_year,
                        
                        (SELECT SUM(C.SumOfCreditDebit)
                        FROM srmatrix_finance_sel AS C
                        WHERE C.invoice_dateUnConv >= '$current_month_start_date'
                        AND C.invoice_dateUnConv <= '$current_month_end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                        AND C.Accountcode = tbl.accountcode) AS current_month,

                        (SELECT SUM(C.SumOfCreditDebit)
                        FROM srmatrix_finance_sel AS C
                        WHERE C.invoice_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                        AND C.invoice_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) AND C.company_id='" . $this->arrUser['company_id'] . "'
                        AND C.Accountcode = tbl.accountcode) AS previouse_selected_period,
                        tbl.status

                        
                        FROM srmatrix_finance_sel as tbl
                        WHERE tbl.invoice_dateUnConv >= '$start_date' AND tbl.invoice_dateUnConv <= '$end_date' AND tbl.company_id='" . $this->arrUser['company_id'] . "'  
                        GROUP BY tbl.accountcode) AS tbl WHERE 1 $where_clause
                        ";
        if ($order_clause == "")
            $order_type = "Order by tbl.gl_no ASC";
        else
            $order_type = $order_clause;

        $total_limit = 1000;
          // bucket query
        $subQueryForBuckets = "SELECT  gl.id
        FROM gl_accountcache gl
        WHERE status = 1 AND company_id='" . $this->arrUser['company_id'] . "'  ";
        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 65);
        // echo $subQueryForBuckets;exit;
        $Sql .= " AND (tbl.id = 0 OR tbl.id IS NULL OR tbl.id IN (".$subQueryForBuckets.")) ";
        //echo $Sql;exit;
        // end

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
 
        $RS = $this->objsetup->CSI($response['q'], "finance_matrix", sr_ViewPermission);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
            $response['ack']= 1;
        }
        else
            $response['ack']= 1;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("FinanceMatrix");   
        $response['response']['tbl_meta_data']['defaultFilter'] = $defaultFilter;
        
        return $response;
    }

    
    function get_sales_matrix($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";

        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        
        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("SalesMatrix", $this->arrUser);
        }
        

        $current_year_start_date    = $this->objGeneral->convertStartDate($attr['current_year_start_date']);
        $current_month_start_date   = $this->objGeneral->convertStartDate($attr['current_month_start_date']);
        $current_month_end_date     = $this->objGeneral->convertStartDate($attr['current_month_end_date']);
        $fin_year_start_date        = $this->objGeneral->convertStartDate($attr['fin_year_start_date']);
        $fin_year_end_date          = $this->objGeneral->convertStartDate($attr['fin_year_end_date']);
        $prev_fin_year_start_date   = $this->objGeneral->convertStartDate($attr['prev_fin_year_start_date']);

        $start_date = $this->objGeneral->convertStartDate($attr['start_date']);
        $end_date   = $this->objGeneral->convertStartDate($attr['end_date']);

        $Sql = "SELECT * FROM (SELECT crm.id AS id, 
                                    crm.customer_code AS customer_no,
                                    crm.name AS customer_name,
                                    (SELECT
                                        CONCAT(emp.first_name,' ',emp.last_name)
                                    FROM employees emp
                                    WHERE (emp.id = (SELECT
                                                            crm_salesperson.salesperson_id
                                                            FROM crm_salesperson
                                                            WHERE ((crm_salesperson.module_id = crm.id)
                                                                AND (crm_salesperson.type = 2)
                                                                AND (crm_salesperson.is_primary = 1))
                                                            LIMIT 1))) AS saleperson,
                                    (SELECT
                                        crm_segment.title
                                    FROM crm_segment
                                    WHERE (crm_segment.id = crm.crm_segment_id)) AS segment,
                                    (SELECT
                                        crm_region.title
                                    FROM crm_region
                                    WHERE (crm_region.id = crm.region_id)) AS territory,
                                    (SELECT
                                        crm_buying_group.title
                                    FROM crm_buying_group
                                    WHERE (crm_buying_group.id = crm.buying_grp)) AS buying_group,
                                    (SELECT rpg.name FROM ref_posting_group AS rpg WHERE rpg.id = (SELECT posting_group_id FROM finance WHERE finance.customer_id = crm.id LIMIT 1) LIMIT 1) AS posting_group,
                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_revenue,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2)
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_profit,

                                    (SELECT ROUND(( (ROUND(SUM(ROUND(C.profit,2)) ,2)/ROUND(SUM(ROUND(C.revenue,2)) ,2)) * 100), 2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date'
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_profit_percentage,

                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS current_year_revenue,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2)
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS current_year_profit,
                                    
                                    (SELECT ROUND(( (ROUND(SUM(ROUND(C.profit,2)) ,2)/ROUND(SUM(ROUND(C.revenue,2)) ,2)) * 100), 2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date'
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS current_year_profit_percentage,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_previous_revenue,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2)
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_previous_profit,
                                    
                                    (SELECT ROUND(( (ROUND(SUM(ROUND(C.profit,2)) ,2)/ROUND(SUM(ROUND(C.revenue,2)) ,2)) * 100), 2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_previous_percentage,
                                    
                                    (SELECT ROUND(SUM(ROUND(o.revenue,2)), 2) 
                                                FROM srmatrix_sales_sel AS o 
                                                WHERE o.cust_id = tbl.cust_id AND 
                                                    o.invoice_type = 0 AND 
                                                    o.company_id='" . $this->arrUser['company_id'] . "' ) AS quotes_value,
                                    
                                    (SELECT ROUND(SUM(ROUND(o.revenue,2)), 2) 
                                                FROM srmatrix_sales_sel AS o 
                                                WHERE o.cust_id = tbl.cust_id AND 
                                                    o.invoice_type = 1 AND 
                                                    o.company_id='" . $this->arrUser['company_id'] . "' ) AS orders_value
                                    
                                    
                        FROM crm
                        LEFT JOIN srmatrix_sales_sel as tbl ON tbl.cust_id = crm.id
                        WHERE
                            crm.status = 1 AND 
                            crm.type IN (2, 3) AND
                            crm.company_id = '" . $this->arrUser['company_id'] . "' AND
                            crm.customer_code IS NOT NULL
                        GROUP BY crm.id) AS tbl WHERE 1 $where_clause
                        ";

        // Bucket query 
        $subQueryForBuckets = " SELECT  c.id
                                FROM sr_crm_listing c
                                WHERE c.type IN (2,3) AND 
                                    c.company_id=" . $this->arrUser['company_id'] . "";

        /* $subQueryForBuckets = " SELECT  c.id
                                FROM crm c
                                WHERE c.type IN (2,3) AND 
                                    c.company_id=" . $this->arrUser['company_id'] . ""; */
        //$subQueryForBuckets = $this->objsetup->whereClauseAppender($subQueryForBuckets, 48);
        // echo $subQueryForBuckets;exit;
        $Sql .= " AND (tbl.id = 0 OR tbl.id IS NULL OR tbl.id IN (".$subQueryForBuckets.")) ";
        //echo $Sql;exit;
        // bucket query end 
        if ($order_clause == "")
            $order_type = "Order by tbl.customer_no ASC";
        else
            $order_type = $order_clause;

        // Query for grand total records
        $Sql_grand = "SELECT 
                        ROUND(SUM(ROUND(tbl.orders_value,2)) ,2) AS orders_value_grand ,
                        ROUND(SUM(ROUND(tbl.quotes_value,2)) ,2) AS quotes_value_grand ,
                        ROUND(SUM(ROUND(tbl.current_year_revenue,2)) ,2) AS current_year_revenue_grand ,
                        ROUND(SUM(ROUND(tbl.current_year_profit,2)) ,2) AS current_year_profit_grand ,
                        ROUND(SUM(ROUND(tbl.selected_period_revenue,2)) ,2) AS selected_period_revenue_grand ,
                        ROUND(SUM(ROUND(tbl.selected_period_profit,2)) ,2) AS selected_period_profit_grand ,
                        ROUND(SUM(ROUND(tbl.selected_period_previous_revenue,2)) ,2) AS selected_period_previous_revenue_grand ,
                        ROUND(SUM(ROUND(tbl.selected_period_previous_profit,2)) ,2) AS selected_period_previous_profit_grand  
                        FROM (SELECT crm.id AS id,
                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_revenue,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2)
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_profit,

                                    (SELECT ROUND(( (ROUND(SUM(ROUND(C.profit,2)) ,2)/ROUND(SUM(ROUND(C.revenue,2)) ,2)) * 100), 2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date'
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_profit_percentage,

                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS current_year_revenue,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2)
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS current_year_profit,
                                    
                                    (SELECT ROUND(( (ROUND(SUM(ROUND(C.profit,2)) ,2)/ROUND(SUM(ROUND(C.revenue,2)) ,2)) * 100), 2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date'
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS current_year_profit_percentage,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_previous_revenue,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2)
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_previous_profit,
                                    
                                    (SELECT ROUND(( (ROUND(SUM(ROUND(C.profit,2)) ,2)/ROUND(SUM(ROUND(C.revenue,2)) ,2)) * 100), 2) 
                                            FROM srmatrix_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) 
                                            AND C.invoice_type = 2
                                            AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.cust_id = tbl.cust_id) AS selected_period_previous_percentage,
                                    
                                    (SELECT ROUND(SUM(ROUND(o.revenue,2)), 2) 
                                                FROM srmatrix_sales_sel AS o 
                                                WHERE o.cust_id = tbl.cust_id AND 
                                                    o.invoice_type = 0 AND 
                                                    o.company_id='" . $this->arrUser['company_id'] . "' ) AS quotes_value,
                                    
                                    (SELECT ROUND(SUM(ROUND(o.revenue,2)), 2) 
                                                FROM srmatrix_sales_sel AS o 
                                                WHERE o.cust_id = tbl.cust_id AND 
                                                    o.invoice_type = 1 AND 
                                                    o.company_id='" . $this->arrUser['company_id'] . "' ) AS orders_value
                                    
                                    
                        FROM crm
                        LEFT JOIN srmatrix_sales_sel as tbl ON tbl.cust_id = crm.id
                        WHERE
                            crm.status = 1 AND 
                            crm.type IN (2, 3) AND
                            crm.company_id = '" . $this->arrUser['company_id'] . "' AND
                            crm.customer_code IS NOT NULL
                            GROUP BY crm.id) AS tbl WHERE 1 $where_clause
                        ";

        // Bucket query 
        $subQueryForBuckets_grand = " SELECT  c.id
                                    FROM sr_crm_listing c
                                    WHERE c.type IN (2,3) AND 
                                        c.company_id=" . $this->arrUser['company_id'] . "";

        /* $subQueryForBuckets_grand = " SELECT  c.id
                                    FROM crm c
                                    WHERE c.type IN (2,3) AND 
                                        c.company_id=" . $this->arrUser['company_id'] . ""; */

        //$subQueryForBuckets_grand = $this->objsetup->whereClauseAppender($subQueryForBuckets_grand, 48);
        // echo $subQueryForBuckets;exit;
        $Sql_grand .= " AND (tbl.id = 0 OR tbl.id IS NULL OR tbl.id IN (".$subQueryForBuckets_grand.")) ";
        $RS_grand = $this->objsetup->CSI($Sql_grand);
        //echo  $Sql_grand;exit;

        $total_limit = 1000;
        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'tbl', $order_type);
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("SalesMatrix");   

        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], "sales_matrix", sr_ViewPermission);
        // $response['q'] = '';
       // echo $response['q'];exit;        
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
                $response['total'] = $Row['totalRecordCount'];
            }
            //grand total
            $RowG = $RS_grand->FetchRow();
                foreach ($RowG as $key => $value) {
                    if (is_numeric($key))
                        unset($RowG[$key]);
                }
            $response['grand']= $RowG;
            $response['ack']= 1;
            $response = $this->objGeneral->postListing($attr, $response);

        }
        else
            $response['ack']= 1;
        
        return $response;
    }

    
    function get_purchase_matrix($attr)
    {
        /* if ($this->arrUser['user_type'] > 2){
            $response['Access'] = 0;
            $response['PermissionName'] = 'View';
            $response['Module'] = 'Purchase Matrix';
            return $response;
            
        } */
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        
        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("PurchaseMatrix", $this->arrUser);
        }
        

        $current_year_start_date    = $this->objGeneral->convertStartDate($attr['current_year_start_date']);
        $current_month_start_date   = $this->objGeneral->convertStartDate($attr['current_month_start_date']);
        $current_month_end_date     = $this->objGeneral->convertStartDate($attr['current_month_end_date']);
        $fin_year_start_date        = $this->objGeneral->convertStartDate($attr['fin_year_start_date']);
        $fin_year_end_date          = $this->objGeneral->convertStartDate($attr['fin_year_end_date']);
        $prev_fin_year_start_date   = $this->objGeneral->convertStartDate($attr['prev_fin_year_start_date']);

        $start_date = $this->objGeneral->convertStartDate($attr['start_date']);
        $end_date   = $this->objGeneral->convertStartDate($attr['end_date']);

        $Sql = "SELECT * FROM (SELECT 
                                    srm.id                            AS id,
                                    srm.supplier_code                 AS supplier_no,
                                    srm.name                          AS supplier_name,
                                    (SELECT
                                        CONCAT(emp.first_name,' ',emp.last_name)
                                    FROM employees emp
                                    WHERE (emp.id = srm.salesperson_id)) AS purchaser,
                                    (SELECT
                                        crm_segment.title
                                    FROM crm_segment
                                    WHERE (crm_segment.id = srm.segment_id)) AS segment,
                                    (SELECT
                                        crm_region.title
                                    FROM crm_region
                                    WHERE (crm_region.id = srm.region_id)) AS territory,
                                    (SELECT
                                        crm_buying_group.title
                                    FROM crm_buying_group
                                    WHERE (crm_buying_group.id = srm.selling_grp_id)) AS selling_group,
                                    (SELECT rpg.name FROM ref_posting_group AS rpg WHERE rpg.id = (SELECT posting_group_id FROM srm_finance WHERE srm_finance.supplier_id = srm.id LIMIT 1) LIMIT 1) AS posting_group,
                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_purchase_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date'
                                            AND C.invoice_type = 2 AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.supplier_id = tbl.supplier_id) AS selected_period_purchases,

                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_purchase_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' 
                                            AND C.invoice_type = 2 AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.supplier_id = tbl.supplier_id) AS current_year_purchases,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_purchase_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) 
                                            AND C.invoice_type = 2 AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.supplier_id = tbl.supplier_id) AS selected_period_previous_purchases,

                                    (SELECT ROUND(SUM(ROUND(o.revenue,2)), 2) 
                                                FROM srmatrix_purchase_sel AS o 
                                                WHERE o.supplier_id = tbl.supplier_id AND 
                                                    o.invoice_type = 3 AND 
                                                    o.company_id='" . $this->arrUser['company_id'] . "' ) AS orders_value

                        FROM srm 
                        LEFT JOIN srmatrix_purchase_sel as tbl ON tbl.supplier_id=srm.id
                        WHERE srm.status=1 AND 
                            srm.type IN (2,3) AND 
                            srm.supplier_code IS NOT NULL AND
                            srm.company_id='" . $this->arrUser['company_id'] . "'
                        GROUP BY srm.id) AS tbl WHERE 1 $where_clause
                        ";

        if ($order_clause == "")
            $order_type = "Order by supplier_no ASC";
        else
            $order_type = $order_clause;
        // bucket query
            $subQuery = "SELECT  s.id 
            FROM sr_srm_general_sel as s
            WHERE  s.type IN (2,3) AND 
                   (s.company_id=" . $this->arrUser['company_id'] . " ) ";

            //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
            $Sql .= " AND (tbl.id = 0 OR tbl.id IS NULL OR tbl.id IN (".$subQuery.")) ";
           // echo $Sql;exit;
        // bucket query end
        $total_limit = 1000;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);

        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], "purchase_matrix", sr_ViewPermission);
        // $response['q'] = '';

        // Query for grand totals
        $Sql_grand = "SELECT 
            ROUND(SUM(ROUND(tbl.selected_period_purchases,2)) ,2) as selected_period_purchases_grand,
            ROUND(SUM(ROUND(tbl.current_year_purchases,2)) ,2) as current_year_purchases_grand,
            ROUND(SUM(ROUND(tbl.selected_period_previous_purchases,2)) ,2) as selected_period_previous_purchases_grand,
            ROUND(SUM(ROUND(tbl.orders_value,2)) ,2) as orders_value_grand
             FROM (SELECT 
                                    srm.id                            AS id,
                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_purchase_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date'
                                            AND C.invoice_type = 2 AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.supplier_id = tbl.supplier_id) AS selected_period_purchases,

                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_purchase_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' 
                                            AND C.invoice_type = 2 AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.supplier_id = tbl.supplier_id) AS current_year_purchases,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.revenue,2)) ,2) 
                                            FROM srmatrix_purchase_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) 
                                            AND C.invoice_type = 2 AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.supplier_id = tbl.supplier_id) AS selected_period_previous_purchases,

                                    (SELECT ROUND(SUM(ROUND(o.revenue,2)), 2) 
                                                FROM srmatrix_purchase_sel AS o 
                                                WHERE o.supplier_id = tbl.supplier_id AND 
                                                    o.invoice_type = 3 AND 
                                                    o.company_id='" . $this->arrUser['company_id'] . "' ) AS orders_value

                        FROM srm 
                        LEFT JOIN srmatrix_purchase_sel as tbl ON tbl.supplier_id=srm.id
                        WHERE srm.status=1 AND 
                            srm.type IN (2,3) AND 
                            srm.supplier_code IS NOT NULL AND
                            srm.company_id='" . $this->arrUser['company_id'] . "'
                        GROUP BY srm.id) AS tbl WHERE 1 $where_clause
                        ";
        $subQuery_grand = "SELECT  s.id 
        FROM sr_srm_general_sel as s
        WHERE  s.type IN (2,3) AND 
               (s.company_id=" . $this->arrUser['company_id'] . " ) ";

        //$subQuery_grand = $this->objsetup->whereClauseAppender($subQuery_grand,24);
        $Sql_grand .= " AND (tbl.id = 0 OR tbl.id IS NULL OR tbl.id IN (".$subQuery_grand.")) ";
        $RS_grand = $this->objsetup->CSI($Sql_grand);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }

            while ($RowG = $RS_grand->FetchRow()) {
                foreach ($RowG as $key => $value) {
                    if (is_numeric($key))
                        unset($RowG[$key]);
                }
                $response['grand'] = $RowG;
            }
            $response['ack']= 1;
        }
        else
            $response['ack']= 1;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("PurchaseMatrix");   
        
        return $response;
    }

    
    function get_inventory_matrix($attr)
    {
        /* if ($this->arrUser['user_type'] > 2){
            $response['Access'] = 0;
            $response['PermissionName'] = 'View';
            $response['Module'] = 'Inventory Matrix';
            return $response;
            
        } */
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        
        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("InventoryMatrix", $this->arrUser);
        }
        

        $current_year_start_date    = $this->objGeneral->convertStartDate($attr['current_year_start_date']);
        $current_month_start_date   = $this->objGeneral->convertStartDate($attr['current_month_start_date']);
        $current_month_end_date     = $this->objGeneral->convertStartDate($attr['current_month_end_date']);
        $fin_year_start_date        = $this->objGeneral->convertStartDate($attr['fin_year_start_date']);
        $fin_year_end_date          = $this->objGeneral->convertStartDate($attr['fin_year_end_date']);
        $prev_fin_year_start_date   = $this->objGeneral->convertStartDate($attr['prev_fin_year_start_date']);

        $start_date = $this->objGeneral->convertStartDate($attr['start_date']);
        $end_date   = $this->objGeneral->convertStartDate($attr['end_date']);

            $Sql = "SELECT * FROM (SELECT 
                                    tbl.id AS id,
                                    tbl.product_code AS product_code,
                                    tbl.description AS product_name,
                                    sr_sel_title_byName(tbl.company_id,'category',tbl.category_id)  category_name,
                                    sr_sel_title_byName(tbl.company_id,'brand',tbl.brand_id) AS brand_name,
                                    sr_sel_title_byName(tbl.company_id,'units_of_measure',tbl.unit_id) AS unit_name,
                                    tbl.status AS status_p, 
                                    (case when tbl.status=1 then 'Active' else 'Inactive' end) as status,
                                    (SELECT ROUND(SUM(ROUND(C.total_price,2)) ,2) 
                                            FROM srmatrix_inventory_purchases_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS purchases_period,

                                    (SELECT ROUND(SUM(ROUND(C.total_price,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS sales_period,

                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_period,

                                    
                                    (SELECT ROUND(( (ROUND(SUM(C.profit) ,2)/ROUND(SUM(C.total_price) ,2)) * 100), 2)
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_percentage_period,

                                    (SELECT ROUND(SUM(ROUND(C.total_price,2)) ,2) 
                                            FROM srmatrix_inventory_purchases_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS purchases_current_year,

                                    (SELECT ROUND(SUM(ROUND(C.total_price,2)) ,2) 
                                            FROM srmatrix_inventory_purchases_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS purchases_prev_period,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.total_price,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS sales_current_year,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_current_year,

                                    (SELECT ROUND(( (ROUND(SUM(C.profit) ,2)/ROUND(SUM(C.total_price) ,2)) * 100), 2)
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_percentage_current_year,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS sales_prev_period,

                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_prev_period,
                                            
                                    (SELECT ROUND(( (ROUND(SUM(C.profit) ,2)/ROUND(SUM(C.total_price) ,2)) * 100), 2)
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_percentage_prev_period
                                            
                                    
                        FROM product AS tbl
                        WHERE tbl.status = 1 AND tbl.`product_code` IS NOT NULL AND tbl.company_id = " . $this->arrUser['company_id'] . "
                        GROUP BY tbl.product_code) AS tbl WHERE 1 $where_clause
                        ";
        if ($order_clause == "")
            $order_type = "Order by tbl.product_code ASC";
        else
            $order_type = $order_clause;

        $total_limit = 1000;

         // bucket query
         $subQuery = "SELECT  prd.id 
         FROM  productcache as prd 
         WHERE  prd.product_code IS NOT NULL AND 
                (prd.company_id=" . $this->arrUser['company_id'] . " ) ";

         //$subQuery = $this->objsetup->whereClauseAppender($subQuery,11);
         $Sql .= " AND (tbl.id = 0 OR tbl.id IS NULL OR tbl.id IN (".$subQuery.")) ";
        // echo $Sql;exit;
     // bucket query end
        //echo $subQuery;exit;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);

        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], "inventory_matrix", sr_ViewPermission);
        // $response['q'] = '';

        // Query for grand total
        $Sql_grand = "SELECT 
                    ROUND(SUM(ROUND(tbl.purchases_period,2)) ,2) as purchases_period_grand,
                    ROUND(SUM(ROUND(tbl.sales_period,2)) ,2) as sales_period_grand,
                    ROUND(SUM(ROUND(tbl.profit_period,2)) ,2) as profit_period_grand,
                    ROUND(SUM(ROUND(tbl.purchases_current_year,2)) ,2) as purchases_current_year_grand,
                    ROUND(SUM(ROUND(tbl.purchases_prev_period,2)) ,2) as purchases_prev_period_grand,
                    ROUND(SUM(ROUND(tbl.sales_current_year,2)) ,2) as sales_current_year_grand,
                    ROUND(SUM(ROUND(tbl.profit_current_year,2)) ,2) as profit_current_year_grand,
                    ROUND(SUM(ROUND(tbl.sales_prev_period,2)) ,2) as sales_prev_period_grand,
                    ROUND(SUM(ROUND(tbl.profit_prev_period,2)) ,2) as profit_prev_period_grand
                     FROM (SELECT 
                                    tbl.id AS id,
                                    (case when tbl.status=1 then 'Active' else 'Inactive' end) as status,
                                    (SELECT ROUND(SUM(ROUND(C.total_price,2)) ,2) 
                                            FROM srmatrix_inventory_purchases_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS purchases_period,

                                    (SELECT ROUND(SUM(ROUND(C.total_price,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS sales_period,

                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_period,

                                    
                                    (SELECT ROUND(( (ROUND(SUM(C.profit) ,2)/ROUND(SUM(C.total_price) ,2)) * 100), 2)
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$start_date'
                                            AND C.posting_dateUnConv <= '$end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_percentage_period,

                                    (SELECT ROUND(SUM(ROUND(C.total_price,2)) ,2) 
                                            FROM srmatrix_inventory_purchases_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS purchases_current_year,

                                    (SELECT ROUND(SUM(ROUND(C.total_price,2)) ,2) 
                                            FROM srmatrix_inventory_purchases_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS purchases_prev_period,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.total_price,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS sales_current_year,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_current_year,

                                    (SELECT ROUND(( (ROUND(SUM(C.profit) ,2)/ROUND(SUM(C.total_price) ,2)) * 100), 2)
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= '$fin_year_start_date'
                                            AND C.posting_dateUnConv <= '$fin_year_end_date' AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_percentage_current_year,
                                    
                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS sales_prev_period,

                                    (SELECT ROUND(SUM(ROUND(C.profit,2)) ,2) 
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_prev_period,
                                            
                                    (SELECT ROUND(( (ROUND(SUM(C.profit) ,2)/ROUND(SUM(C.total_price) ,2)) * 100), 2)
                                            FROM srmatrix_inventory_sales_sel AS C
                                            WHERE C.posting_dateUnConv >= DATE_SUB('$start_date', INTERVAL 365 DAY)
                                            AND C.posting_dateUnConv <= DATE_SUB('$end_date', INTERVAL 365 DAY) AND C.company_id='" . $this->arrUser['company_id'] . "'
                                            AND C.id = tbl.id) AS profit_percentage_prev_period
                                            
                                    
                        FROM product AS tbl
                        WHERE tbl.status = 1 AND tbl.`product_code` IS NOT NULL AND tbl.company_id = " . $this->arrUser['company_id'] . "
                        GROUP BY tbl.product_code) AS tbl WHERE 1 $where_clause
                        ";
         // bucket query
         $subQuery_grand = "SELECT  prd.id 
         FROM  productcache as prd 
         WHERE  prd.product_code IS NOT NULL AND 
                (prd.company_id=" . $this->arrUser['company_id'] . " ) ";

         //$subQuery_grand = $this->objsetup->whereClauseAppender($subQuery_grand,11);
         $Sql_grand .= " AND (tbl.id = 0 OR tbl.id IS NULL OR tbl.id IN (".$subQuery_grand.")) ";
         $RS_grand = $this->objsetup->CSI($Sql_grand);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
            while ($RowG = $RS_grand->FetchRow()) {
                foreach ($RowG as $key => $value) {
                    if (is_numeric($key))
                        unset($RowG[$key]);
                }
                $response['grand'] = $RowG;
            }
            $response['ack']= 1;
        }
        else
            $response['ack']= 1;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("InventoryMatrix");   
        
        return $response;
    }

    
    
    function get_sales_matrix_details($attr)
    {
    
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        
        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("SalesMatrixDetails", $this->arrUser);
        }
        
        $start_date = $this->objGeneral->convertStartDate($attr['start_date']);
        $end_date   = $this->objGeneral->convertStartDate($attr['end_date']);


        $Sqla = "SELECT SUM(tbl.revenue) total_revenue FROM (SELECT tbl.order_id AS id, 
                                    tbl.cust_id, 
                                    tbl.invoice_code, 
                                    tbl.customer_no, 
                                    tbl.customer_name, 
                                    tbl.saleperson, 
                                    tbl.posting_date, 
                                    tbl.SalesType,
                        ROUND((tbl.revenue) ,2) AS revenue,
                        ROUND((tbl.profit) ,2) AS profit,                
                        ROUND(( (ROUND((tbl.profit) ,2)/ROUND((tbl.revenue) ,2)) * 100), 2) AS profit_percentage,
                        tbl.invoice_type
                FROM srmatrix_sales_sel as tbl
                WHERE 
                tbl.cust_id = $attr[cust_id] AND
                tbl.company_id='" . $this->arrUser['company_id'] . "') AS tbl WHERE 1 $where_clause
                ";
        // echo $Sqla;exit;
        $RSa = $this->objsetup->CSI($Sqla);

        $totalAmount = 0;
        if ($RSa->RecordCount() > 0) {
            $Rowa = $RSa->FetchRow();
            $totalAmount = $Rowa['total_revenue'];  
        }


        $Sql = "SELECT * FROM (SELECT tbl.order_id AS id, tbl.cust_id, tbl.invoice_code, tbl.customer_no, tbl.customer_name, tbl.saleperson, tbl.posting_date, tbl.SalesType,
                                    ROUND((tbl.revenue) ,2) AS revenue,
                                    ROUND((tbl.profit) ,2) AS profit,                
                                    ROUND(( (ROUND((tbl.profit) ,2)/ROUND((tbl.revenue) ,2)) * 100), 2) AS profit_percentage,
                                    tbl.invoice_type
                        FROM srmatrix_sales_sel as tbl
                        WHERE 
                            tbl.cust_id = $attr[cust_id] AND
                            tbl.company_id='" . $this->arrUser['company_id'] . "') AS tbl WHERE 1 $where_clause
                        ";
        if ($order_clause == "")
            $order_type = "Order by tbl.posting_date ASC";
        else
            $order_type = $order_clause;

        $total_limit = 1000;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);

        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], $moduleForPermission, sr_ViewPermission);
       // $response['q'] = '';

        $total = 0;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $total = $total + $Row['revenue'];
                $response['response'][] = $Row;
            }
            $response['ack']= 1;
            $response['total_amount'] = $totalAmount;
        }
        else
            $response['ack']= 1;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("SalesMatrixDetails");   
        
        return $response;
    }
    
    function get_purchase_matrix_details($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        
        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("PurchaseMatrixDetails", $this->arrUser);
        }
        
        $start_date = $this->objGeneral->convertStartDate($attr['start_date']);
        $end_date   = $this->objGeneral->convertStartDate($attr['end_date']);

        $Sqla = "SELECT SUM(tbl.revenue) total_revenue FROM (SELECT tbl.order_id AS id, 
                                    tbl.supplier_id, 
                                    tbl.invoice_code, 
                                    srm.supplier_code AS supplier_no,
                                    srm.name          AS supplier_name, 
                                    tbl.purchaser, 
                                    tbl.posting_date, 
                                    tbl.SalesType,
                                    ROUND((tbl.revenue) ,2) AS revenue,
                                    tbl.invoice_type
                        FROM srm 
                        LEFT JOIN srmatrix_purchase_sel as tbl ON tbl.supplier_id=srm.id
                        WHERE srm.id = $attr[supplier_id] AND srm.status=1 AND srm.type IN (2,3) AND srm.company_id='" . $this->arrUser['company_id'] . "') AS tbl WHERE 1 $where_clause
                        ";
        // echo $Sqla;exit;
        $RSa = $this->objsetup->CSI($Sqla);

        $totalAmount = 0;
        if ($RSa->RecordCount() > 0) {
            $Rowa = $RSa->FetchRow();
            $totalAmount = $Rowa['total_revenue'];  
        }

        $Sql = "SELECT * FROM (SELECT tbl.order_id AS id, 
                                        tbl.supplier_id, 
                                        tbl.invoice_code, 
                                        srm.supplier_code AS supplier_no,
                                        srm.name          AS supplier_name, 
                                        tbl.purchaser, 
                                        tbl.posting_date, 
                                        tbl.SalesType,
                                    ROUND((tbl.revenue) ,2) AS revenue,
                                    tbl.invoice_type
                        FROM srm 
                        LEFT JOIN srmatrix_purchase_sel as tbl ON tbl.supplier_id=srm.id
                        WHERE srm.id = $attr[supplier_id] AND srm.status=1 AND srm.type IN (2,3) AND srm.company_id='" . $this->arrUser['company_id'] . "') AS tbl WHERE 1 $where_clause
                        ";
        if ($order_clause == "")
            $order_type = "Order by tbl.posting_date ASC";
        else
            $order_type = $order_clause;

        $total_limit = 1000;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);

        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], $moduleForPermission, sr_ViewPermission);
        // $response['q'] = '';
        $total = 0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $total = $total + $Row['revenue'];
                $response['response'][] = $Row;
            }
            $response['ack']= 1;
            $response['total_amount'] = $totalAmount;
        }
        else
            $response['ack']= 1;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("PurchaseMatrixDetails");   
        
        return $response;
    }
    
    function get_inventory_matrix_details($attr)
    {
        $limit_clause = $where_clause = $fieldsMeta = $order_clause = "";
        $where_clause = $this->objGeneral->flexiWhereRetriever("tbl.", $attr, $fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("tbl.", $attr, $fieldsMeta);
        
        if (empty($where_clause)){
            $defaultFilter = true;
            $where_clause = $this->objGeneral->flexiDefaultFilterRetriever("InventoryMatrixDetails", $this->arrUser);
        }
        
        $start_date = $this->objGeneral->convertStartDate($attr['start_date']);
        $end_date   = $this->objGeneral->convertStartDate($attr['end_date']);

        $inventory_type_view = (isset($attr['detail_type']) && $attr['detail_type'] == 2) ? 'srmatrix_inventory_purchases_sel_detail' : 'srmatrix_inventory_sales_sel_detail';

        $Sql = "SELECT * FROM (SELECT tbl.order_id AS id, 
                                    tbl.product_code, 
                                    tbl.account_id, 
                                    tbl.account_no,
                                    tbl.account_name, 
                                    tbl.product_name, 
                                    sr_sel_title_byName(tbl.company_id,'category',p.category_id)  category_name,
                                    sr_sel_title_byName(tbl.company_id,'brand',p.brand_id) AS brand_name,
                                    sr_sel_title_byName(tbl.company_id,'units_of_measure',p.unit_id) AS unit_name,
                                    tbl.invoice_code, tbl.posting_date, tbl.unit_price, tbl.qty,
                                    tbl.SalesType,
                                    ROUND((tbl.total_price) ,2) AS sales,
                                    ROUND((tbl.profit) ,2) AS profit,
                                    ROUND(( (ROUND((tbl.profit) ,2)/ROUND((tbl.total_price) ,2)) * 100), 2) AS profit_percentage
                                    
                        FROM $inventory_type_view as tbl, product AS p
                        WHERE 
                            tbl.id = p.id AND
                            tbl.id = $attr[product_id] AND
                            tbl.company_id='" . $this->arrUser['company_id'] . "') AS tbl WHERE 1 $where_clause
                        ";
        if ($order_clause == "")
            $order_type = "Order by tbl.id ASC";
        else
            $order_type = $order_clause;

        $total_limit = 1000;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'tbl', $order_type);

        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q'], $moduleForPermission, sr_ViewPermission);
        // $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
            $response['ack']= 1;
        }
        else
            $response['ack']= 1;
        $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("InventoryMatrixDetails");   
        
        return $response;
    }
    
    function get_hr_matrix($attr)
    { 
        $start_date = $this->objGeneral->convert_date($attr['start_date']);
        $end_date   = $this->objGeneral->convert_date($attr['end_date']);
        $month      = ($attr['month'] != '') ? $attr['month'] : 0;
        $year       = ($attr['year'] != '') ? $attr['year'] : 0;
        
        $name_where = ($attr['emp_name'] && strlen($attr['emp_name'])>0) ? " AND (emp.first_name LIKE '%$attr[emp_name]%' || emp.last_name LIKE '%$attr[emp_name]%') || CONCAT(emp.first_name,' ', emp.last_name) LIKE '%$attr[emp_name]%' " : "";
        $departments_where = ($attr['departments'] && strlen($attr['departments'])>0) ? " AND (emp.department != 'Array') AND FIND_IN_SET (emp.department, '$attr[departments]') " : "";
        

        $Sql = "SELECT emp.id AS emp_id, emp.user_code AS emp_code, 
                    CONCAT(emp.first_name,' ', emp.last_name) AS emp_name, 
                    d.name AS department,
                    h.id AS holiday_id, 
                    h.holiday_date_from AS date_from, 
                    h.holiday_date_to AS date_to, 
                    FROM_UNIXTIME(h.holiday_date_from) AS start_date,
                    FROM_UNIXTIME(h.holiday_date_to) AS end_date,
                    IFNULL(DAY(FROM_UNIXTIME(h.holiday_date_from)), 0) AS start_day,
                    IFNULL(DAY(FROM_UNIXTIME(h.holiday_date_to)), 0) AS end_day,
                    IFNULL(ROUND((h.holiday_date_to-h.holiday_date_from)/(60*60*24))+1, 0) AS booked_days,
                    h.total_holiday AS days_requested,
                    holiday_nature
                FROM employees AS emp
                LEFT JOIN config_departments AS d ON FIND_IN_SET (emp.department, d.id)
                LEFT JOIN hr_holidays AS h ON h.emp_id = emp.id  AND h.company_id = '" . $this->arrUser['company_id'] . "' AND h.holidayStatus <> 3 AND
                                            (MONTH(FROM_UNIXTIME(h.holiday_date_from)) = $month OR MONTH(FROM_UNIXTIME(h.holiday_date_to)) = $month) AND
                                            (YEAR(FROM_UNIXTIME(h.holiday_date_from)) = $year OR YEAR(FROM_UNIXTIME(h.holiday_date_to)) = $year)
                WHERE 
                    emp.status = 1 AND emp.user_type <> 1 AND 
                    emp.company_id = '" . $this->arrUser['company_id'] . "' 
                    $departments_where $name_where
                ORDER BY emp.id, start_day";
        // echo $Sql;exit;
        //$RS = $this->objsetup->CSI($Sql);
        $RS = $this->objsetup->CSI($Sql, "hr_matrix", sr_ViewPermission);
        $prev_id = 0;
        $count = -1;
        $response = array();
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                if($prev_id != $Row['emp_id'])
                {
                    $count = $count+1;
                    
                    $response['response'][$count]['emp_id'] = $Row['emp_id'];
                    $response['response'][$count]['emp_code'] = $Row['emp_code'];
                    $response['response'][$count]['emp_name'] = $Row['emp_name'];
                    $response['response'][$count]['department'] = $Row['department'];

                    $holiday = array();
                    $holiday['holiday_id']  = $Row['holiday_id'];
                    $holiday['start_day']  = floatval($Row['start_day']);
                    $holiday['end_day']     = floatval($Row['end_day']);
                    $holiday['booked_days'] = floatval($Row['booked_days']);
                    $holiday['days_requested'] = floatval($Row['days_requested']);

                    if($Row['holiday_nature'] == 1)
                    {
                        $holiday['holiday_nature'] = 'Annual Leave';
                    }
                    else if($Row['holiday_nature'] == 2)
                    {
                        $holiday['holiday_nature'] = 'Sick Leave';
                    }
                    else
                    {
                        $holiday['holiday_nature'] = 'Leave';
                    }
                    
                    $prev_id = $Row['emp_id'];

                    $response['response'][$count]['holiday'][] = $holiday;
                }
                else
                {
                    $holiday = array();
                    $holiday['holiday_id']  = $Row['holiday_id'];
                    $holiday['start_day']  = $Row['start_day'];
                    $holiday['end_day']     = $Row['end_day'];
                    $holiday['booked_days'] = $Row['booked_days'];
                    $holiday['days_requested'] = $Row['days_requested'];
                    $response['response'][$count]['holiday'][] = $holiday;
                }
            }
            $response['ack']= 1;
        }
        else
            $response['ack']= 0;

        return $response;

    }
}

?>