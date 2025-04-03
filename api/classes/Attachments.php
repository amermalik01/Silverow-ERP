<?php
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Setup.php");

class Attachments extends Xtreme {
    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;
    private $objsetup = null;
    function __construct($user_info = array()) {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->arrUser = $user_info;
        $this->objsetup = new Setup($user_info);
    }
    

    function uploadFile($files, $attr){
        // echo '<pre>';print_r($attr);
        // echo "---";
        // print_r($files);exit;
        $this->objGeneral->mysql_clean($attr);
        if ($attr['attachmentFromNode']){
            $company_id = $attr['company_id'];
            $tmpFiles = [];
            // print_r($files);exit;
            // echo $files[0]['name'];exit;
            $tmpFiles['name'][] = $files['file']['name'];
            $tmpFiles['type'][] = $files['file']['type'];
            $tmpFiles['tmp_name'][] = $files['file']['tmp_name'];
            $tmpFiles['error'][] = $files['file']['error'];
            $tmpFiles['size'][] = $files['file']['size'];
            // print_r($tmpFiles);exit;
            $files['file'] = $tmpFiles;
            $attr['attachmentFile'] = $this->arrUser['id'] . "_" . $company_id . "_" . $attr['dateNow'];
        }
        else{
            $company_id = $this->arrUser['company_id'];
        }
            check_dir_path(UPLOAD_PATH . 'attachments');
            $uploads_dir = UPLOAD_PATH . 'attachments';
        $files = $files['file'];
        // print_r($files);exit;
        $len = sizeof($files['name']);
        //echo $len;exit;
        //print_r($files['name']);exit;
        $uploadedFiles = array();
        $failedFiles = array();
        for($i = 0; $i < $len; $i++) {
            if (empty($files["tmp_name"][$i])){
                $failedFiles[] = $files["name"][$i];
                continue;
            }
           $fileSize = $files['size'][$i];
           //echo "doing".$files["name"][$i];
           //print_r($files);
           //check_dir_path(UPLOAD_PATH.'emp_images');
           
           $tmp_name = $files["tmp_name"][$i];
           //echo $tmp_name;exit;
           $name = $files["name"][$i];
            $this->objGeneral->mysql_clean($name);
           $explode_file = explode(".", $name);
           array_pop($explode_file);
           $alias = implode(".",$explode_file);
           //$new_file_name = mt_rand().".".$explode_file[1];
           $extension = strtolower(substr($name, strrpos($name, ".") + 1));
           if ($attr['emailAttachment']){
               $attr['type'] = $attr['moduleTypeForAttachments'];
            //    $attr['recordName'] = $attr['recordName'];
               $attr['typeId'] = $attr['recordId'];
               $attr['subType'] = 0;
            //    $attr['moduleName'] = $attr['moduleName'];
               $attr['subTypeId'] = 0;
               $newFileName = $attr['attachmentFile'] . "_" . $i . "." . $extension;// mt_rand().".".$extention;
           }
           else{
               $newFileName = uniqid() . "." . $extension;// mt_rand().".".$extention;
           }
           $imageFileType = "." . $extension;
               $path = $uploads_dir . "/" . $newFileName;
               $var_export = move_uploaded_file($tmp_name, $path);
           $typeId = ($attr['typeId']) ? $attr['typeId'] : 0;
       //  $result = $objdoc->update_emp_pic($new_file_name ,$employee_id); 
           if ($var_export) {
               $Sql = "INSERT INTO attachments SET
                    name = '$name',
                    alias = '$alias',
                    size = '$fileSize',
                    fileType = '$extension',
                    path = '$path',
                    type = '".$attr['type']."',
                    subType = '$attr[subType]',
                    typeId = '$typeId',
                    record_name = '$attr[recordName]',
                    module_name = '$attr[moduleName]',
                    subTypeId = '$attr[subTypeId]',
                    user_id = ".$this->arrUser[id].",
                    company_id = ".$company_id.",
                    date_uploaded = ".current_date_time.",
                    date_created = ".current_date_time."
                    ";
                    // echo $Sql . PHP_EOL;exit;
                    $RS = $this->objsetup->CSI($Sql);
                    $lastId = $this->Conn->Insert_ID();
                    if($attr[moduleName]){
                    $associationsSql = "INSERT INTO document_association
                                        SET
                                            module_type     =   'document',
                                            module_id       =   '$lastId',
                                            record_type     =   '$attr[moduleName]',
                                            additional      =   '$attr[additional]',
                                            record_id       =   '$typeId',
                                            record_name     =   '$attr[recordName]',
                                            AddedBy         =   '" . $this->arrUser['id'] . "',
                                            AddedOn         =   UNIX_TIMESTAMP (NOW())
                                        ";
                                        // echo $associationsSql;exit;
                    $RSAssociation = $this->objsetup->CSI($associationsSql);
                    }
                    $uploadedFiles[] = $lastId;
                    $uploadedPaths[] = WEB_PATH . "/" . explode("//", $path)[1];
               $tempResult['fileType'] = $imageFileType;
               $tempResult['fileName'] = $newFileName;
               $tempResult['status'] = 1;
               $response['response'][] = $tempResult;
               $response['uploadedFiles'] = $uploadedFiles;
               $response['failedFiles'] = $failedFiles;
               $response['uploadedPaths'] = $uploadedPaths;
               $response['lastId'] = $this->Conn->Insert_ID();
           } else {
               $response['ack'] = 0;
               $tempResult['fileType'] = $imageFileType;
               $tempResult['fileName'] = $newFileName;
               $response['failedFiles'] = $failedFiles;
               $tempResult['status'] = 1;
               $response['response'][] = $tempResult;
               $response['lastId'] = $this->Conn->Insert_ID();
               //$response['response'] = "Error in files uploading Please check Size and Format JPG, Word or PDF!".$message;
               $response['response'] = "Error !" . $msg;
           }

           // change size to whatever key you need - error, tmp_name etc
        }
        return $response;
    }

    function updateFile($attr){
        $targetId = $attr['lastId'];
        //echo $targetFile.PHP_EOL;
        $Sql = "UPDATE attachments SET
                    alias = '".$attr['currentFile']->name."',
                    description = '".$attr['currentFile']->desc."'
                    WHERE id = $targetId
        ";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'][] = array();
        }
        return $response;
    }

    function deleteFileById($attr){
        // print_r($attr);exit;
        if (empty($attr['id'])){
            $response['ack'] = 0;
            $response['error'] = "Something went wrong..";
            $response['response'][] = array();
            return $response;
        }
        $SqlCount = "SELECT * FROM general_email_attachments where attachment_id = ".$attr['id']."; ";
        $RS = $this->objsetup->CSI($SqlCount);
        if ($RS->RecordCount() > 0) {
            $response['ack'] = 0;
            $response['error'] = "Document in use";
            $response['response'][] = array();
            return $response;
        }
        $getPathSql = "SELECT path FROM attachments WHERE id = ".$attr['id']."";
        $RS = $this->objsetup->CSI($getPathSql);
        $path = $RS->FetchRow()['path'];
        if (unlink($path)){
            $Sql = "DELETE FROM attachments WHERE id = ".$attr['id']."";
            $RS = $this->objsetup->CSI($Sql);
            if ($this->Conn->Affected_Rows() > 0) {
                $Sql2 = "DELETE FROM document_association where module_type LIKE '%Document%' and module_id = ".$attr['id'].";";
                $RS = $this->objsetup->CSI($Sql2);
                $Sql3 = "DELETE FROM general_email_attachments where attachment_id = ".$attr['id'].";";
                $RS = $this->objsetup->CSI($Sql3);
                $response['ack'] = 1;
                $response['error'] = "Record Deleted Successfully";
            }
            else{
                $response['ack'] = 0;
                $response['error'] = "Something went wrong..";
                $response['response'][] = array();
            }
        }
        else{
            $response['ack'] = 0;
            $response['error'] = "Something went wrong..";
            $response['response'][] = array();
        }
        return $response;
    }

    function getFileListing($attr){
        // print_r($attr);exit;
        $where_type_clause = "";
        $where = "";
        if ($attr['module_name']){
            //apply that module's bucket
            if ($attr['module_name'] == 'crm' || $attr['module_name'] == 'crm_retailer'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%CRM%' ";
                /* $subQuery = "SELECT  c.id
                                from sr_crm_listing  c 
                                where  c.type IN (1,2) and c.company_id=" . $this->arrUser['company_id'] . " ";  */
                /* $subQuery = "SELECT  c.id
                                FROM crm c
                                WHERE c.type IN (1,2) AND 
                                    c.company_id=" . $this->arrUser['company_id'] . ""; */
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,40);
            }
            else if ($attr['module_name'] == 'srm'){
                $module_type = 2;
                $where_module_name .= "  main_module_name LIKE '%SRM%' ";
                /* $subQuery = "SELECT  s.id
                            FROM sr_srm_general_sel as s 
                            WHERE   s.type IN (1,2) AND
                                    s.company_id=" . $this->arrUser['company_id'] . "  "; */
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,18);
            }
            else if ($attr['module_name'] == 'customer'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Customer%' ";
                /* $subQuery = "SELECT  c.id
                            from sr_crm_listing  c 
                            where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";  */
                
                /* $subQuery = "SELECT  c.id
                            FROM crm c
                            WHERE c.type IN (2,3) AND 
                                c.company_id=" . $this->arrUser['company_id'] . ""; */
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48);
            }
            else if ($attr['module_name'] == 'items'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Items%' ";
                /* $subQuery = "SELECT  prd.id
                            from productcache  prd 
                            where  prd.company_id=" . $this->arrUser['company_id'] . "  "; */
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,11);
            }
            else if ($attr['module_name'] == 'sales'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Sales%' ";
                /* $subQuery = "SELECT orderscache.id FROM orderscache WHERE sell_to_cust_id IN (SELECt c.id
                                from sr_crm_listing  c 
                                where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";  */
                /* $subQuery = "SELECT orderscache.id FROM orderscache WHERE sell_to_cust_id IN (SELECT  c.id
                             FROM crm c
                             WHERE c.type IN (2,3) AND 
                                   c.company_id=" . $this->arrUser['company_id'] . ""; */
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48);
                // $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'credit_note'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Credit Note%' ";
                /* $subQuery = "SELECT return_orders.id FROM return_orders WHERE sell_to_cust_id IN (SELECt c.id
                            from sr_crm_listing  c 
                            where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";  */
                
                /* $subQuery = "SELECT return_orders.id FROM return_orders WHERE sell_to_cust_id IN (SELECT  c.id
                             FROM crm c
                             WHERE c.type IN (2,3) AND 
                                   c.company_id=" . $this->arrUser['company_id'] . ""; */
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48);
                // $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'supplier'){
                $module_type = 2;
                $where_module_name .= "  main_module_name LIKE '%Supplier%' ";
                /* $subQuery = "SELECT  s.id
                            FROM sr_srm_general_sel as s 
                            WHERE   s.type IN (2,3) AND 
                                    s.company_id=" . $this->arrUser['company_id'] . "  "; */
               //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
            }
            else if ($attr['module_name'] == 'purchase'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%purchase%' ";
                /* $subQuery = "SELECT srm_invoice.id FROM srm_invoice WHERE sell_to_cust_id IN (SELECT  s.id
                                FROM sr_srm_general_sel as s 
                                WHERE   s.type IN (2,3) AND 
                                        s.company_id=" . $this->arrUser['company_id'] . "  "; */
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
                // $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'debit_note'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Debit Note%' ";
                /* $subQuery = "SELECT srm_order_return.id FROM srm_order_return WHERE supplierID IN (SELECT  s.id
                            FROM sr_srm_general_sel as s 
                            WHERE   s.type IN (2,3) AND 
                                    s.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
                $subQuery .= " )"; */
            }
            else if ($attr['module_name'] == 'hr'){
                $module_type = 7;
                $where_module_name .= "  main_module_name LIKE '%HR%' AND user_id = " . $this->arrUser['id'] . " ";
                $subQuery = "SELECT  e.id
                            FROM employees as e 
                            WHERE   e.status <> -1 AND
                                    e.company_id=" . $this->arrUser['company_id'] . " "; 
            }
            else if ($attr['module_name'] == 'warehouse'){
                $module_type = 8;
                $where_module_name .= "  main_module_name LIKE '%Warehouse%' AND user_id = " . $this->arrUser['id'] . " ";
                $subQuery = "SELECT  w.id
                            FROM warehouse as w 
                            WHERE   w.status <> -1 AND
                                    w.company_id=" . $this->arrUser['company_id'] . "  ";
            }
            else{
                $where_module_name .= "  main_module_name LIKE '%$attr[module_name]%' AND user_id = " . $this->arrUser['id'] . " ";
            }
            if ($attr['record_id']){
                //apply that module's bucket and that record
                $where = "$where_module_name and es.ass_id = $attr[record_id] ";
            }
            else{
                //apply that module's bucket
                if ($subQuery){
                    $where = "$where_module_name and (es.ass_id IN ($subQuery)";
                }
                else{
                    $where = "$where_module_name and (1";
                }
            }
        }
        else{
            /* 
            //apply buckets for all modules + virtual accounts + directly sent
            $crmSubQuery = "SELECT  c.id
                            from sr_crm_listing  c 
                            where  c.type IN (1,2) and c.company_id=" . $this->arrUser['company_id'] . " "; 
            //$crmSubQuery = $this->objsetup->whereClauseAppender($crmSubQuery,40);
            
            $srmSubQuery = "SELECT  s.id
                            FROM sr_srm_general_sel as s 
                            WHERE   s.type IN (1,2) AND
                                    (s.company_id=" . $this->arrUser['company_id'] . " ) ";
            //$srmSubQuery = $this->objsetup->whereClauseAppender($srmSubQuery,18);
            $custSubQuery = "SELECT  c.id
                            from sr_crm_listing  c 
                            where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  "; 
            //$custSubQuery = $this->objsetup->whereClauseAppender($custSubQuery,48);
            $itemsSubQuery = "SELECT  prd.id
                                from productcache  prd 
                                where  prd.company_id=" . $this->arrUser['company_id'] . "  ";
            //$itemsSubQuery = $this->objsetup->whereClauseAppender($itemsSubQuery,11);
            $saleSubQuery = "SELECT orderscache.id FROM orderscache WHERE sell_to_cust_id IN (SELECt c.id
                                from sr_crm_listing  c 
                                where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  "; 
            //$saleSubQuery = $this->objsetup->whereClauseAppender($saleSubQuery,48);
            $saleSubQuery .= " )";
            $creditNoteSubQuery = "SELECT return_orders.id FROM return_orders WHERE sell_to_cust_id IN (SELECt c.id
                                    from sr_crm_listing  c 
                                    where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  "; 
            //$creditNoteSubQuery = $this->objsetup->whereClauseAppender($creditNoteSubQuery,48);
            $creditNoteSubQuery .= " )";
            $suppSubQuery = "SELECT  s.id
                            FROM sr_srm_general_sel as s 
                            WHERE   s.type IN (2,3) AND 
                                    s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$suppSubQuery = $this->objsetup->whereClauseAppender($suppSubQuery,24);
            $purchaseSubQuery = "SELECT srm_invoicecache.id FROM srm_invoicecache WHERE sell_to_cust_id IN (SELECt s.id
                                FROM sr_srm_general_sel as s 
                                WHERE   s.type IN (2,3) AND 
                                        s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$purchaseSubQuery = $this->objsetup->whereClauseAppender($purchaseSubQuery,24);
            $purchaseSubQuery .= " )";
            $debitNoteSubQuery = "SELECT srm_order_returncache.id FROM srm_order_returncache WHERE supplierID IN (SELECt s.id
                                    FROM sr_srm_general_sel as s 
                                    WHERE   s.type IN (2,3) AND 
                                            s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$debitNoteSubQuery = $this->objsetup->whereClauseAppender($debitNoteSubQuery,24);
            $debitNoteSubQuery .= " )"; */
            $hrSubQuery = "SELECT e.id
                            FROM employees as e
                            WHERE e.status <> -1 ";
            $whSubQuery = "SELECT w.id
                            FROM warehouse as w
                            WHERE w.status <> -1 ";
            $allBucketsQuery =  " (main_module_name is null OR (main_module_name LIKE '%CRM%') ";// and es.ass_id IN ($crmSubQuery)
            $allBucketsQuery .=  " OR (main_module_name LIKE '%SRM%') ";// and es.ass_id IN ($srmSubQuery)
            $allBucketsQuery .=  " OR (main_module_name LIKE '%HR%' AND 
                                        es.ass_id IN ($hrSubQuery) AND 
                                        user_id = " . $this->arrUser['id'] . ")
                                   OR (main_module_name LIKE '%Warehouse%'  AND 
                                       es.ass_id IN ($whSubQuery) AND 
                                       user_id = " . $this->arrUser['id'] . ") ";
                                       
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Customer%') ";// and es.ass_id IN ($custSubQuery)
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Items%') ";// and es.ass_id IN ($itemsSubQuery)
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Sale%') ";// and es.ass_id IN ($saleSubQuery)
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Credit Note%') ";// and es.ass_id IN ($creditNoteSubQuery)
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Supplier%') ";// and es.ass_id IN ($suppSubQuery)
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Purchase%') ";// and es.ass_id IN ($purchaseSubQuery)
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Debit Note%') "; // and es.ass_id IN ($debitNoteSubQuery)
            $allBucketsQuery .= " ) ";
            $where = $allBucketsQuery;
        }
        if ($attr['module_name']){
            $Sql = "SELECT *  FROM sr_attachments_sel es WHERE company_id = " . $this->arrUser['company_id'] . " and $where )
                order by id desc; ";
            if ($attr['record_id']){
                $Sql = "SELECT *  FROM sr_attachments_sel es WHERE company_id = " . $this->arrUser['company_id'] . "  and $where 
                order by id desc; ";
            }
            
        }
        else{
            $Sql = "SELECT *  FROM sr_attachments_sel es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    ($where)
                order by id desc; ";
        }
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }         
                $Row['size'] = (string)round($Row['size']/1024,2);
                $Row['path'] = WEB_PATH . "/" . explode("//", $Row['path'])[1];
                $Row['date_uploaded'] = $this->objGeneral->convert_unix_into_datetime($Row['date_uploaded']);
                $Row['action'] = '1';
                
                if ($Row['ass_id'])
                    $Row['association'][] = array('assName'=>$Row['ass_name'], 'assId'=>$Row['ass_id'], 'assModule'=>$Row['ass_module']);
                if (empty(trim($Row['association'][0]['assName']))){
                    $Row['receiver_name'] = "N/A";
                }
                else{
                    $Row['receiver_name'] = $Row['association'][0]['assName'];
                }
                $dupChk = 0;

                if(isset($response)){

                    for ($l = sizeof($response['response']); $l >= 0 ; $l--){
                        if ($response['response'][$l]['id'] == $Row['id']){
                            $dupChk = 1;
                            $response['response'][$l]['association'][] = $Row['association'][0];
                            break;
                        }
                    }
                }
                if ($dupChk == 0){
                    $response['response'][] = $Row;
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] =  count($response['response']);
            if ($attr['countOnly']){
            $response['response'] = array();
            return $response;
        }
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'] = array();
        }
        // $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData('Attachments');//echo $Sql;exit;
        return $response;
    }
}
?>