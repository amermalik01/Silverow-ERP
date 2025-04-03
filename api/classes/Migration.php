<?php
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/libraries/simplexlsx.class.php");
require_once(SERVER_PATH . "/classes/Setup.php");

/* Comments

 Author: Kia Samouie
 with a little help from Sia, Amer and Noor :P
 v0.43

Comments */

class Migration extends Xtreme
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
        $this->objsetup = new Setup($user_info);
        $this->arrUser = $user_info;
    }

    function makedirs($path, $mode = 0777)
    {
        return is_dir($path) || mkdir($path, $mode, true);
    }
  
    function alphaInCode($columnIndex) {
        $alphabet = range('A', 'Z');                
        $alphaValue = '';
        $x = floor($columnIndex / 26);
        if ($x) $alphaValue = $alphabet[$x];
        return $alphaValue . $alphabet[$columnIndex % 26];
    }

    function BoolDupeChk($dataArr) {

        $sqlResult = "SELECT id 
                      FROM " . $dataArr['mainTable'] . " 
                      WHERE prev_code='" . $dataArr['AccPrevCode']. "' 
                      AND company_id=" . $this->arrUser['company_id']. " 
                      LIMIT 1"; 
                            
        // echo $sqlResult;exit; 
        $RS = $this->objsetup->CSI($sqlResult);

        if ($RS->RecordCount() > 0) {

            $Row = $RS->FetchRow();         

            $dupSql = "  SELECT id 
                                 FROM " . $dataArr['sqlTable'] . "  
                                 WHERE  acc_id= '" . $Row["id"] . "' and
                                       '" .$dataArr['moduleTypeName']. "' = '" . $dataArr['moduleType'] . "' and  
                                       " . $dataArr['fieldChkName'] . " =1  and 
                                    company_id='" . $this->arrUser['company_id'] . "'  
                                 LIMIT 1";
            //echo $dupSql; exit;
            $dupRS = $this->objsetup->CSI($dupSql);

            $dupRecCount = $dupRS->RecordCount();

            if ($dupRecCount > 0) return 1;
            else  return 0;

        } else{
            return 0;
        }         
        
    }

    function checkDuplicatePrevCode($dataArr) {

            if($dataArr['acc_id'] ){
             $sqlResult = "SELECT id 
                          FROM " . $dataArr['mainTable'] . " 
                          WHERE prev_code='" . $dataArr['prev_code']. "' AND
                          acc_id='" .$dataArr['acc_id']. "' 
                          AND company_id=" . $this->arrUser['company_id']. " 
                          LIMIT 1";                     
        }
        elseif($dataArr['migrationName']=='Item'){

            $sqlResult = "SELECT id 
                          FROM " . $dataArr['mainTable'] . " 
                          WHERE old_code='" . $dataArr['prev_code']. "' 
                          AND company_id=" . $this->arrUser['company_id']. " 
                          LIMIT 1";    
        }else{
             $sqlResult = "SELECT id 
                          FROM " . $dataArr['mainTable'] . " 
                          WHERE prev_code='" . $dataArr['prev_code']. "' 
                          AND company_id=" . $this->arrUser['company_id']. " 
                          LIMIT 1";   
        }
         $RS = $this->objsetup->CSI($sqlResult);
            if ($RS->RecordCount() > 0) {
            return 1;
                } else{
                    return 0;
                } 
    }

    function checkRecordExist($brand_id,$category_id){
        $sqlResult = "SELECT id 
                          FROM brandcategorymap
                          WHERE brandID='" . $brand_id. "' 
                           AND categoryID=" . $category_id. " 
                          AND company_id=" . $this->arrUser['company_id']. " 
                          LIMIT 1";   

         $RS = $this->objsetup->CSI($sqlResult);
            if ($RS->RecordCount() > 0) {
                    return 1;
                } else{
                    return 0;
                }  
    }

    function checkUomExist($product_id,$record_id){
        $sqlResult = "SELECT u.id 
                          FROM units_of_measure_setup u
                          LEFT JOIN product p ON p.id=u.product_id
                          WHERE u.record_id='" . $record_id. "' 
                           AND p.old_code='" . $product_id. "' 
                          AND u.company_id=" . $this->arrUser['company_id']. " 
                          LIMIT 1";   

         $RS = $this->objsetup->CSI($sqlResult);
            if ($RS->RecordCount() > 0) {
                    return 1;
                } else{
                    return 0;
                }  
    }

    function isOverlappingDate($start_date,$end_date,$product_id,$type){
        $sqlResult = "SELECT id 
                          FROM product_price
                          WHERE company_id=" . $this->arrUser['company_id']. " 
                          AND (
                              ('".$start_date."' BETWEEN start_date AND end_date) 
                              || ('".$end_date."' BETWEEN start_date AND end_date) 
                              || (start_date BETWEEN '".$start_date."' AND '".$end_date."') 
                              || (end_date BETWEEN '".$start_date."' AND '".$end_date."') 
                              )
                          AND product_id = '".$product_id."'
                          AND type = '".$type."'
                          LIMIT 1";   
        //echo '<br>'.$sqlResult;
         $RS = $this->objsetup->CSI($sqlResult);
            if ($RS->RecordCount() > 0) {
                    return 1;
                } else{
                    return 0;
                }  
    }

    function checkModuleType($module,$brand_id=0){
        if($brand_id==0){
            $sqlResult = "SELECT v.type FROM ref_module_category_value v
                        LEFT JOIN ref_module_table m ON m.id=v.module_code_id
                        WHERE v.company_id=" . $this->arrUser['company_id']. "  
                        AND m.name='".$module."' AND (v.brand_id = 0 || v.brand_id IS NULL)
                          LIMIT 1";  
        }else{
            $sqlResult = "SELECT v.type FROM ref_module_category_value v
                        LEFT JOIN ref_module_table m ON m.id=v.module_code_id
                        WHERE v.company_id=" . $this->arrUser['company_id']. "  
                        AND m.name='".$module."' AND v.brand_id = '".$brand_id."'
                          LIMIT 1"; 
        }
         
        //echo '<br>'.$sqlResult; exit;
         $RS = $this->objsetup->CSI($sqlResult);
         if($RS->RecordCount()>0){
         $Row = $RS->FetchRow();
         return $Row['type']; 
         }else{
            return $this->checkModuleType($module);
         }
    }

    function checkDuplicateExtCode($dataArr) {

        $sqlResult = "SELECT id 
                      FROM " . $dataArr['mainTable'] . " 
                      WHERE ".$dataArr['mod_field']."='" . $dataArr['extCode']. "' 
                      AND company_id=" . $this->arrUser['company_id']. " 
                      LIMIT 1";    
     $RS = $this->objsetup->CSI($sqlResult);
        if ($RS->RecordCount() > 0) {
        return 1;
            } else{
                return 0;
            } 
    }

    function checkDuplicateLocation($dataArr) {

        $sqlResult = "SELECT id 
                      FROM " . $dataArr['mainTable'] . " 
                      WHERE item_id='" . $dataArr['item_id']. "' 
                      AND warehouse_id='" . $dataArr['warehouse_id']. "' 
                      AND description='" . trim($dataArr['location']). "' 
                      AND company_id=" . $this->arrUser['company_id']. " 
                      LIMIT 1";  
        //echo $sqlResult;exit;  
        $RS = $this->objsetup->CSI($sqlResult);
            if ($RS->RecordCount() > 0) {
            return 1;
                } else{
                    return 0;
                } 
    }

    function srLog($module, $subModule, $params, $message){
        echo 'inside function';
        $storedProc = "CALL SR_Logentry(".$this->arrUser['company_id'].",".$this->arrUser['id'].",".$module.",".$subModule.",".$params.",".$message.");";
        $RS = $this->objsetup->CSI($storedProc);
    }

    function migrateFile($arr, $input){
        //echo 'ddddd';exit;
         //print_r($arr);print_r($input);exit;
        
        $this->objsetup->SRTraceLogsPHP(LOG_LEVEL_2, __CLASS__, __FUNCTION__, SR_TRACE_PHP, 'Enter',__FUNCTION__,'migrationName:'.$input['migrationName']);
    
        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        
        ini_set('max_execution_time', 9999);
        // print_r($this->arrUser);exit;
    
        $migrationName = $input['migrationName'];
        // echo $migrationName;exit;

        // $storedProcStart = "CALL SR_Logentry(".$this->arrUser['company_id'].",".$this->arrUser['id'].",'Migration.php','migrateFile()','arr input','Start Migration');";
        // // echo $storedProcStart;exit;
        // $storedProcStartRS = $this->objsetup->CSI($storedProcStart);

        if (!empty($_FILES['file'])) {
            // print_r($_FILES['file']);exit;
            $filepath = APP_PATH . 'download/migrationMeta/'. $migrationName .'_Meta_Data.xlsx';
            $input_file_name = $_FILES['file']['name'];
            $metaData = new SimpleXLSX(file_get_contents($filepath), true);
            $migrationData = new SimpleXLSX($_FILES['file']['tmp_name']);

            list($cols,) = $metaData->dimension();
            list($cols,) = $migrationData->dimension();

            $templateSheet = $metaData->rows();
            // echo '<pre>';print_r($templateSheet);exit;

            $migrationSheet = $migrationData->rows();
            // print_r($migrationSheet); exit;
            if ($input['additionalParams']){
                $localVariables = array();
                // separating data of dynamic definedlist columns from sampledata will be added back at last
                $dynamicDefinedLists = array();
                $dynamicDefinedListData = array();
                for ($i = 0; $i < sizeof($input['additionalParams']); $i++){
                    if ($input['additionalParams'][$i]['targetTable'] == 'localVariable'){
                        $localVariables[$input['additionalParams'][$i]['targetField']] = $input['additionalParams'][$i]['value'];
                        array_splice($input['additionalParams'], $i, 1);
                    }
                    else if ($input['additionalParams'][$i]['value'] == "**"){
                        for ($j = 0; $j < sizeof($migrationSheet[0]); $j++){
                            if ($migrationSheet[0][$j] == $input['additionalParams'][$i]['columnName']){
                                array_push($dynamicDefinedLists, $j);
                            }
                        }
                    }
                }
                // print_r($dynamicDefinedLists);exit;
                for ($i = 0; $i < sizeof($dynamicDefinedLists); $i++){
                    $tempArr= "";
                    $tempArr->columnName = $migrationSheet[0][$dynamicDefinedLists[$i]];
                    array_splice($migrationSheet[0], $dynamicDefinedLists[$i], 1);
                    $tempArr->data = array();
                    for ($j = 1; $j < sizeof($migrationSheet); $j++){
                        array_push($tempArr->data, $migrationSheet[$j][$dynamicDefinedLists[$i]]);
                        array_splice($migrationSheet[$j], $dynamicDefinedLists[$i], 1);
                    }
                    array_push($dynamicDefinedListData, $tempArr);
                }
                for ($i = 0; $i < sizeof($input['additionalParams']); $i++){
                    array_push($templateSheet[0], $input['additionalParams'][$i]['type']);
                    array_push($templateSheet[1], $input['additionalParams'][$i]['sourceTable']);
                    array_push($templateSheet[2], $input['additionalParams'][$i]['sourceField']);
                    array_push($templateSheet[3], $input['additionalParams'][$i]['targetTable']);
                    array_push($templateSheet[4], $input['additionalParams'][$i]['targetField']);
                    array_push($templateSheet[5], $input['additionalParams'][$i]['columnName']);
                }
                if ($migrationSheet){
                    for ($i = 0; $i < sizeof($input['additionalParams']); $i++){
                        // if ($migrationSheet[$i][0] == ">The end") break;
                        if ($input['additionalParams'][$i]['value'] != "**"){
                            $migrationSheet[0][sizeof($migrationSheet[0])] = $input['additionalParams'][$i]['columnName'];
                            for ($j = 1; $j < sizeof($migrationSheet); $j++){
                                if ($migrationSheet[$j][0] == ">The end") break;
                                $migrationSheet[$j][sizeof($migrationSheet[$j])] = $input['additionalParams'][$i]['value'];
                            }
                        }
                    }
                    
                }

                if (sizeof($dynamicDefinedListData)){
                    for ($i = 0; $i < sizeof($dynamicDefinedListData); $i++){
                        $migrationSheet[0][sizeof($migrationSheet[0])] = $dynamicDefinedListData[$i]->columnName;
                        // for ($j = 0; $j < sizeof($dynamicDefinedListData[$i]->data); $j++){
                            for ($k = 1; $k < sizeof($migrationSheet); $k++){
                                $migrationSheet[$k][sizeof($migrationSheet[$k])] = $dynamicDefinedListData[$i]->data[$k-1];
                            }
                        // }
                    }
                    
                }

                

            }
           // print_r($migrationSheet);exit;


            $uom_arr = array();
            $barcode_arr = array();
            $wt_n_vol_arr = array();
            $items_ids_arr = array();
            $items_codes_arr = array();
            $items_costing_method_arr = array();
            $items_default_uom_arr = array();
            $items_uom_ids_arr = array();
            $items_stock_check_arr = array();
            $items_warehouse_name_arr = array();
            $items_vat_ids_arr = array();
            $items_vat_price_arr = array();
            $items_vat_value_arr = array();
            $errorLog = array();
            $warehouseNames = array();
            define("MAX_EXCEL_DATE", 2958465);

            $maxRows = sizeof($migrationSheet);
            $maxColumns = sizeof($migrationSheet[0]);
            $stockMigration = '';
            $openingStock = 0;
            $saleOrderFlag = false;
            $salesOrderDetailFlag = false;
            $purchaseOrderFlag = false;
            $purchaseOrderDetailFlag = false;
            $storageLocationFlag = false;
            $uomFlag = false;
            $itemStockAllocFlag = false;
           
            /*======= Maximum record 1000 allowed. checking for 1002 including Top heading and the bottom >The end line */
            if ($maxRows>1002) {
                $response['ack'] = 0;
                $response['error'] = "You have selected over 1000 records which is not allowed.";
                return $response;
                exit;
            }
            // echo 'maxRows'.$maxRows;exit;
            //echo '<pre>';print_r($localVariables);
            //echo '<pre>';print_r($migrationSheet);
            for ($columnIndex = 0; $columnIndex < $maxColumns; $columnIndex++){

                if ($migrationName == 'Purchase-Order-Items-Stock-Allocation'){
                    $qtySum = 0;
                    for ($i = 1; $i < sizeof($migrationSheet); $i++){
                        $qtySum += $migrationSheet[$i][4];
                    }
                   // echo $qtySum;exit;
                    if ($qtySum > $localVariables['qty_to_allocate']){
                        $errorLog['Qty'] = 'Specified quantity is greater than allocatable quantity';
                            break;           
                    }

                    $itemStockAllocFlag = true;
                }

                if ($templateSheet[5][$columnIndex] != $migrationSheet[0][$columnIndex]) {
                    // $errorLog[$errorMessageKey] = 'Your field"'. $migrationSheet[0][$columnIndex] . '" != "'. $templateSheet[5][$columnIndex]. '"';                    
                    array_push($errorLog, 'InputData "'. $migrationSheet[0][$columnIndex] . '" != MetaData"'. $templateSheet[5][$columnIndex]. '"');
                    break;
                }
                $type = $templateSheet[0][$columnIndex];             
                
                
                for ($rowIndex = 1; $rowIndex < $maxRows; $rowIndex++){
                    // $sqlTiming = "INSERT INTO migration_performance (rowIndex, columnIndex,type)
                    // VALUES (".$rowIndex.",".$columnIndex.",'TypeCheck');"; 
                    // echo $sqlTiming;exit;
                    // $RS = $this->objsetup->CSI($sqlTiming);

                    $targetCell = $migrationSheet[$rowIndex][$columnIndex];
                    if ($migrationSheet[$rowIndex][0] == ">The end") break;

                    $errorMessageKey = '('. ($this->alphaInCode($columnIndex)) . ($rowIndex + 1) .') '. $migrationSheet[0][$columnIndex];
                    $errorMessageValue = $targetCell;

                    // validation for gl accounts categories.
                    if(strlen($templateSheet[6][0]) > 0 && $templateSheet[6][0] == 'gl_account'){
                        $sqlGl = "SELECT count(id) as total FROM gl_account WHERE company_id=" . $this->arrUser['company_id']. ""; 
                        // echo $sqlGl;exit;
                        // $storedProcGL = "CALL SR_Logentry(".$this->arrUser['company_id'].",".$this->arrUser['id'].",'Migration.php','migrateFile()','arr input',".$sqlGl.");";
                        // echo $storedProcGL;exit;
                        // $storedProcGLRS = $this->objsetup->CSI($storedProcGL);
                        
                        $RSGl = $this->objsetup->CSI($sqlGl);

                        if (!($RSGl->fields['total'] > 0)) {
                            $errorLog[$errorMessageKey] = 'Please upload Categories and Sub Categories from Chart of Account!';   
                            break;                                                        
                        }
                        else{
                            $SqlDelglLink = "DELETE FROM gl_account as gl
                                                LEFT JOIN gl_account_link AS glLink on glLink.child_gl_account_id =  gl.id
                                                WHERE gl.gl_account_ref_id IS NULL AND 
                                                    gl.company_id='" . $this->arrUser['company_id'] . "'";
                            $this->objsetup->CSI($SqlDelglLink);
                            $SqlDelgl = "DELETE FROM gl_account 
                                            WHERE gl_account_ref_id IS NULL AND 
                                                company_id='" . $this->arrUser['company_id'] . "'";
                            $this->objsetup->CSI($SqlDelgl);
                        }
                    }
                    // $errorMessage = 'Cell('. ($this->alphaInCode($columnIndex)) . ($rowIndex + 1) .') ' . $targetCell;

                    if ($targetCell != null) {
                        //echo $type.'<br>';
                    switch ($type){
                        case "String":
                            $upperRange = $templateSheet[1][$columnIndex];
                            if ($upperRange != null) {
                                if (strlen($targetCell) > $upperRange) 
                                    $errorLog[$errorMessageKey] = '"'. $errorMessageValue. '"'. ' is too long';
                            }
                            // new check for the duplicate previous code
                             $check_prev_code = $templateSheet[2][$columnIndex]; 
                            if($check_prev_code=='validate_pcode'){  
                                $data_arr = array('mainTable'=>$templateSheet[3][$columnIndex],
                                                  'prev_code'=>$targetCell,
                                                  'acc_id'=>'',
                                                  'migrationName'=> $migrationName
                                                );
                                $isExistPrevCode = $this->checkDuplicatePrevCode($data_arr);
                              //echo $isExistPrevCode;
                                if($isExistPrevCode==1){
                                     $errorLog[$errorMessageKey] = '"'. $errorMessageValue. '"'. ' already exist.';
                                }
                            }
                            else if($check_prev_code=='validate_pcode_child'){                                
                                $data_arr = array('mainTable'=>$templateSheet[3][$columnIndex],
                                                  'prev_code'=>$targetCell,
                                                  'acc_id'=>$migrationSheet[$rowIndex][0],
                                                  'migrationName'=> $migrationName
                                                );
                          // print_r($data_arr);
                                $isExistPrevCode = $this->checkDuplicatePrevCode($data_arr);
                              //echo $isExistPrevCode;exit;
                                if($isExistPrevCode==1){
                                     $errorLog[$errorMessageKey] = '"'. $errorMessageValue. '"'. ' already exist agains this acc id "'.$migrationSheet[$rowIndex][0].'"';
                                }
                            }else if($check_prev_code=='validate_loc'){   
                                if($targetCell){                             
                                $data_arr = array('mainTable'=>$templateSheet[3][$columnIndex],
                                                  'location'=>$targetCell,
                                                  'item_id'=>$migrationSheet[$rowIndex][0],
                                                  'warehouse_id'=>$migrationSheet[$rowIndex][1],
                                                  'migrationName'=> $migrationName
                                                );

                                $checkDuplicateLocation = $this->checkDuplicateLocation($data_arr);
                             //echo $checkDuplicateLocation;exit;
                                if($checkDuplicateLocation==1){
                                     $errorLog[$errorMessageKey] = '"'. $errorMessageValue. '"'. ' already exist against this item id "'.$migrationSheet[$rowIndex][0].'" AND warehouse id = "'.$migrationSheet[$rowIndex][1].'"';
                                }
                            }
                            }
                            
                            if ($migrationName == 'Item-Unit-of-Measure'){

                            }

                            // end
                            $migrationSheet[$rowIndex][$columnIndex] = trim(addslashes($targetCell));
                            //echo '<br>'.$targetCell;
                            break;
                        case "Number":
                            $upperRange = $templateSheet[1][$columnIndex];                                
                            $lowerRange = $templateSheet[2][$columnIndex]; 
                            if (!is_numeric($targetCell)) {
                                $errorLog[$errorMessageKey] = '"'. $errorMessageValue. '"'. ' is not a numeric field';
                                break;
                            }
                            if ($upperRange != null && $lowerRange != null){
                                if ($targetCell < $upperRange || $targetCell > $lowerRange) 
                                    $errorLog[$errorMessageKey] = '"'.  $errorMessageValue. '"'.' is out of range';
                            } 
                            break;
                        case "Comma":
                            $commaArray = explode(",", $targetCell);
                            if (count($commaArray) > 3) $errorLog[$errorMessageKey] = '"'. $errorMessageValue. '"'. ' too many values. Refer to instructions';
                            $flag = false;
                            foreach ($commaArray as $elem){
                                if ($elem != '1' && $elem != '2' && $elem != '3') $flag = true;
                            }
                            if ($flag) $errorLog[$errorMessageKey] = '"'. $errorMessageValue. '"'. ' one of your values is incorrect. Refer to instructions';

                            break;
                        case "Ignore":
                            $sqlTable = $templateSheet[1][$columnIndex];
                            $sqlProperty = $templateSheet[2][$columnIndex];

                            if($sqlProperty=='barcode'){
                                $migrationSheet[$rowIndex][$columnIndex] = '#barcode#';
                            }

                            if($sqlTable){
                            $sqlResult = "SELECT id FROM " . $sqlTable . " WHERE " . $sqlProperty . "=\"" . addslashes($targetCell). "\" and company_id=" . $this->arrUser['company_id']. " LIMIT 1";
                            // echo $sqlResult;exit;
                            
                            $RS = $this->objsetup->CSI($sqlResult);
                            // $storedProcIgnore = "CALL SR_Logentry(".$this->arrUser['company_id'].",".$this->arrUser['id'].",'Migration.php','migrateFile()','arr input',".$sqlResult.");";
                            // $storedProcIgnoreRS = $this->objsetup->CSI($storedProcIgnore);

                            if ($RS->RecordCount() > 0) {
                                $Row = $RS->FetchRow();
                                $uom_arr[] = $Row["id"];
                                $migrationSheet[$rowIndex][$columnIndex] = 0;
                            } else{
                                $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found for('.$this->arrUser['user_name'].'). Please check your setup';
                            }
                        }else{
                            if($sqlProperty=='barcode'){
                                $barcode_arr[] = addslashes($targetCell);
                                $migrationSheet[$rowIndex][$columnIndex] = '#barcode#';
                            }else if($sqlProperty=='wt_n_vol'){
                                $wt_n_vol_arr[$rowIndex][$templateSheet[4][$columnIndex]] = addslashes($targetCell);
                                $migrationSheet[0][$columnIndex] = 'Weight_n_volume';
                                $migrationSheet[$rowIndex][$columnIndex] = '#wt_n_vol#';
                            }
                        }
                            break;

                        case "ListCompanyCustomized":
                                $sqlTable = $templateSheet[1][$columnIndex];
                                $sqlProperty = $templateSheet[2][$columnIndex];
                                $field_name = $templateSheet[8][$columnIndex];
                                //echo is_numeric($migrationSheet[$rowIndex][0]);exit;
                                if ($migrationName == "Item-Marginal-Analysis" && $sqlProperty=='unit_name'){
                                    if(is_numeric($migrationSheet[$rowIndex][0])){
                                        $sqlResult = "SELECT unit_id FROM " . $sqlTable . " 
                                                WHERE " . $sqlProperty . "=\"" . addslashes($targetCell). "\" AND 
                                                company_id=" . $this->arrUser['company_id']. " AND 
                                                id = ".$migrationSheet[$rowIndex][0]." LIMIT 1";
                                         //echo $sqlResult;exit;

                                        $RS = $this->objsetup->CSI($sqlResult);
                                        if ($RS->RecordCount() > 0) {
                                            $Row = $RS->FetchRow();
                                            $migrationSheet[$rowIndex][$columnIndex] = $Row['unit_id'];//mysqli_fetch_row($sqlResult)[0];
                                        } else{
                                            $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' There is no Unit ID';
                                        }
                                    }else{
                                        $errorLog[$errorMessageKey] = ' Previous code('.$migrationSheet[$rowIndex][0].') does not exist.';
                                    }

                                }elseif ($migrationName == "Item-Marginal-Analysis"  && $sqlProperty=='title'){
                                    if(is_numeric($migrationSheet[$rowIndex][0])){
                                        $sqlResult = "SELECT id FROM " . $sqlTable . " 
                                                WHERE " . $sqlProperty . "=\"" . addslashes($targetCell). "\" AND 
                                                company_id=" . $this->arrUser['company_id']. " AND 
                                                status = 1 LIMIT 1";
                                         //echo $sqlResult;exit;

                                        $RS = $this->objsetup->CSI($sqlResult);
                                        if ($RS->RecordCount() > 0) {
                                            $Row = $RS->FetchRow();
                                            $migrationSheet[$rowIndex][$columnIndex] = $Row['id'];

                                            $sqlResult1 = "SELECT id FROM product_marginal_analysis
                                            WHERE marginal_analysis_id =" . $Row['id']. " AND 
                                            product_id=" . $migrationSheet[$rowIndex][0]. "  LIMIT 1";
                                     //echo $sqlResult1;exit;

                                        $RS2 = $this->objsetup->CSI($sqlResult1);
                                        if ($RS2->RecordCount() > 0) {
                                            $errorLog[$errorMessageKey] = 'There is Duplicate entry for additional cost "'.$targetCell.'".';
                                        }
                                           
                                        } else{
                                            $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' There is no title exist.';
                                        }
                                    }else{
                                        $errorLog[$errorMessageKey] = ' Previous code('.$migrationSheet[$rowIndex][0].') does not exist.';
                                    }

                                }else{
                                    if(is_numeric($migrationSheet[$rowIndex][0])){
                                    $sqlResult = "SELECT $field_name FROM " . $sqlTable . " 
                                    WHERE " . $sqlProperty . "=\"" . addslashes($targetCell). "\" AND 
                                    company_id=" . $this->arrUser['company_id']. " AND 
                                    id = ".$migrationSheet[$rowIndex][0]." LIMIT 1";

                                    $RS = $this->objsetup->CSI($sqlResult);
                                    if ($RS->RecordCount() > 0) {
                                        $Row = $RS->FetchRow();
                                        $migrationSheet[$rowIndex][$columnIndex] = $Row[$field_name];//mysqli_fetch_row($sqlResult)[0];
                                    } else{
                                        $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' There is no Unit ID';
                                    }
                                }else{
                                    $errorLog[$errorMessageKey] = ' Previous code('.$migrationSheet[$rowIndex][0].') does not exist.';
                                }
                                }
                                
                                
                            break;
                        case "ListCompanyRetreiveProductMulti":

                            $sqlStock = "SELECT p.id as pid,p.product_code,p.description,p.unit_id , uom.title AS uom_name 
                                            FROM product as p
                                            LEFT JOIN units_of_measure uom ON uom.id = p.unit_id
                                            WHERE p.product_code=\"" . addslashes($targetCell). "\" and p.company_id=" . $this->arrUser['company_id']. " LIMIT 1";
                            // echo $sqlResult;exit;

                            $RSTOCK = $this->objsetup->CSI($sqlStock);
                            // $storedProcListCompanyRetreiveProductMulti = "CALL SR_Logentry(".$this->arrUser['company_id'].",".$this->arrUser['id'].",'Migration.php','migrateFile()','arr input',".$sqlStock.");";
                            // echo $storedProcListCompanyRetreiveProductMulti;exit;                                
                            // $storedProcListCompanyRetreiveProductMultiRS = $this->objsetup->CSI($storedProcListCompanyRetreiveProductMulti);

                            $additionalQueryFields = '';
                            $additionalQueryFieldsValues = '';
                            $stockMigration = $RSTOCK->RecordCount();                                
                            if ($stockMigration > 0) {
                                $openingStock = 1;
                                $RowStock = $RSTOCK->FetchRow();
                                $migrationSheet[$rowIndex][$columnIndex] = $RowStock["pid"];                                    
                            } else{
                                $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found for('.$this->arrUser['user_name'].'). Please check your setup';
                            }
                            
                        break;
                        case "ListCompany":
                            $sqlTable = $templateSheet[1][$columnIndex];
                            $sqlProperty = $templateSheet[2][$columnIndex];
                            $field_name = $templateSheet[7][$columnIndex];
                            $field_value = $templateSheet[8][$columnIndex];
                            $where = "";
                            
                            if(strlen($field_name) > 0){
                                if($field_name == "region_type"){
                                    $where = " AND region_type IN(".$field_value.")";
                                }
                                else if($field_name == "classification_type"){

                                    $calssificationArr = array();

                                    if($field_value == '1,12') {

                                        $calssificationArr = array( 1 =>'Lead' ,2 => 'Prospect' ,3 => 'Not Relevant', 
                                                                    4 => 'Customer',5 =>'Previous Customer',
                                                                    6=>'Dissolved/Liquidated',7 => 'Indirect Customer');
                                    }
                                    else if($field_value == '2,12') {

                                        $calssificationArr = array( 1 => 'Customer',2 =>'Previous Customer',
                                                                    3=>'Dissolved/Liquidated');
                                    }
                                    else if($field_value == '3,34') {
                                        
                                        $calssificationArr = array( 1 => 'Potential Supplier',2 => 'Supplier',3 => 'Previous Supplier', 4 => 'Dissolved/Liquidated');
                                    }
                                    else if($field_value == '4,34') {
                                        
                                        $calssificationArr = array( 1 => 'Supplier' ,2 => 'Previous Supplier', 3 => 'Dissolved/Liquidated');
                                    }

                                    // if(in_array(addslashes($targetCell),$calssificationArr)){
                                    if(strlen($calssificationArr[addslashes($targetCell)]) >0 ){
                                        $Sql = "SELECT rf.id, rf.name as title 
                                                FROM active_classification ac  
                                                INNER JOIN ref_classification  rf ON rf.id= ac.ref_type  
                                                WHERE ac.company_id='" . $this->arrUser[company_id] . "'  AND 
                                                      ac.type IN(" . $field_value.") AND
                                                      rf.name = '".$calssificationArr[$targetCell]."' order by rf.id ASC";
                                        //echo $Sql;exit;

                                        $RS = $this->objsetup->CSI($Sql);                                        

                                        if ($RS->RecordCount() > 0) {
                                            $Row = $RS->FetchRow();
                                            $migrationSheet[$rowIndex][$columnIndex] = $Row["id"];
                                        } else{
                                            $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found for('.$this->arrUser['user_name'].'). Please check your setup';
                                        }

                                    } else{
                                            $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found for('.$this->arrUser['user_name'].'). Please check your setup';
                                        }
                                }
                                elseif($field_name == "additional_cost_type"){
                                    $Sql = "SELECT id
                                                FROM item_additional_cost   
                                                WHERE company_id='" . $this->arrUser[company_id] . "'  AND 
                                                      type = '" .$field_value . "' AND
                                                      title = '".$calssificationArr[$targetCell]."' order by id ASC";
                                        //echo $Sql;exit;

                                        $RS = $this->objsetup->CSI($Sql);                                        

                                        if ($RS->RecordCount() > 0) {
                                            $Row = $RS->FetchRow();
                                            $migrationSheet[$rowIndex][$columnIndex] = $Row["id"];
                                        } else{
                                            $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found for('.$this->arrUser['user_name'].'). Please check Additional Cost sheet in sample data file';
                                        }
                                }
                                
                            }  
                            if($field_name != "classification_type" && $field_name != "additional_cost_type"){
                                if($templateSheet[7][2]=='module_type' && ($templateSheet[8][2]=='1' || $templateSheet[8][2]=='2') && $sqlTable=='alt_contact'){

                                    $sqlResult = "SELECT id FROM " . $sqlTable . " WHERE " 
                                                            . $sqlProperty . "=\"".addslashes($targetCell)."\" 
                                                            AND company_id=" . $this->arrUser['company_id']. " 
                                                            AND acc_id=" .trim($migrationSheet[$rowIndex][0]). " 
                                                            AND module_type=" . trim($templateSheet[8][2]). " 
                                                            AND status=1 $where LIMIT 1";
                                                            
                                } elseif(($migrationName == 'Supplier-General' || $migrationName == 'SRM-General') && $sqlTable=="crm_segment"){

                                    $sqlResult = "SELECT id FROM " . $sqlTable . " WHERE " 
                                                            . $sqlProperty . "=\"".addslashes($targetCell)."\" 
                                                            AND company_id=" . $this->arrUser['company_id']. " 
                                                            AND segment_type=2
                                                            AND status=1 $where LIMIT 1";
                                }elseif(($migrationName == 'Customer-General' || $migrationName == 'CRM-General') && $sqlTable=="crm_segment"){

                                    $sqlResult = "SELECT id FROM " . $sqlTable . " WHERE " 
                                                            . $sqlProperty . "=\"".addslashes($targetCell)."\" 
                                                            AND company_id=" . $this->arrUser['company_id']. " 
                                                            AND segment_type=1
                                                            AND status=1 $where LIMIT 1";
                                    
                                }else{                        
                                $sqlResult = "SELECT id FROM " . $sqlTable . " WHERE " 
                                                            . $sqlProperty . "=\"".addslashes($targetCell)."\" 
                                                            AND company_id=" . $this->arrUser['company_id']. " 
                                                            AND status=1 $where LIMIT 1";
                                }
                                // echo $sqlResult;exit;
                                $RS = $this->objsetup->CSI($sqlResult);
                                // $storedProcListCompany = "CALL SR_Logentry(".$this->arrUser['company_id'].",".$this->arrUser['id'].",'Migration.php','migrateFile()','arr input','".$sqlResult."');";
                                // $storedProcListCompanyRS = $this->objsetup->CSI($storedProcListCompany);
                                //echo $RS->RecordCount();exit;
                                if ($RS->RecordCount() > 0) {
                                    $Row = $RS->FetchRow();
                                    // $prod_code = $migrationSheet[$rowIndex][6];
                                    $migrationSheet[$rowIndex][$columnIndex] = $Row["id"];
                                } else{
                                    $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found for('.$this->arrUser['user_name'].'). Please check your setup';
                                }
                            }                           
                        break;

                        case "ListChildByCompany":
                                $sqlTable = $templateSheet[1][$columnIndex];
                                $sqlProperty = $templateSheet[2][$columnIndex];

                                //echo "acc_id=".$migrationSheet[$rowIndex][0].'<br>';
                                $acc_id = $migrationSheet[$rowIndex][0];
                                if(is_numeric($migrationSheet[$rowIndex][0])){
                                    $sqlResult = "SELECT id FROM " . $sqlTable . " WHERE " 
                                                                . $sqlProperty . "=\"".addslashes($targetCell)."\" 
                                                                AND acc_id=" . $acc_id. "
                                                                AND company_id=" . $this->arrUser['company_id']. " 
                                                                AND status=1  LIMIT 1";
                                    //echo $sqlResult.'<br>';exit;
                                    $RS = $this->objsetup->CSI($sqlResult);
                                
                                    if ($RS->RecordCount() > 0) {
                                        $Row = $RS->FetchRow();
                                        // $prod_code = $migrationSheet[$rowIndex][6];
                                        $migrationSheet[$rowIndex][$columnIndex] = $Row["id"];
                                    } else{
                                        $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found for('.$this->arrUser['user_name'].'). Please check your setup';
                                    }
                                }else{
                                    $errorLog[$errorMessageKey] = ' Previous code('.$migrationSheet[$rowIndex][0].') does not exist.';
                                }
                        break;
                        case "SalesOrderRetreiveLocationInfo":
                                $saleOrderFlag = true;
                                $salesOrderSql = "SELECT * FROM sr_crm WHERE (prev_code='".addslashes($targetCell)."' OR customer_code='".addslashes($targetCell)."') AND company_id=".$this->arrUser['company_id'].";";
                                // echo $salesOrderSql;exit;
                                $RS = $this->objsetup->CSI($salesOrderSql);
                                // $SalesOrderRetreiveLocationInfo = "CALL SR_Logentry(".$this->arrUser['company_id'].",".$this->arrUser['id'].",'Migration.php','migrateFile()','arr input','".$salesOrderSql."');";
                                // $SalesOrderRetreiveLocationInfoRS = $this->objsetup->CSI($SalesOrderRetreiveLocationInfo);

                                if ($RS->RecordCount() > 0) {
                                    $Row = $RS->FetchRow();
                                    $sql = "SELECT  cf.*,fs.finchargetype,fs.fincharges,fs.inschargetype,fs.inscharges
                                            FROM sr_customer_finance_sel as cf
                                            LEFT JOIN financial_settings as fs on fs.company_id = cf.company_id 
                                            WHERE cf.customer_id='$Row[id]' 
                                            AND cf.ftype = 'customer' 
                                            LIMIT 1";
                                            $RS2 = $this->objsetup->CSI($sql);
                                    if ($RS2->RecordCount() > 0) {
                                        $Row2 = $RS2->FetchRow();
                                    } else{
                                    $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.'. Finance details have not been selected for this Customer:'. $targetCell;
                                    } 
                                }  else{
                                    $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' previous/customer code has not been validated.';
                                    }
                        break;

                        case "SalesOrderWarehouse":
                            if ($migrationSheet[$rowIndex][1] == 0){
                                $warehouse = "SELECT wh.id,wh.name 
                                            FROM product_warehouse_location AS pr_wh_loc, warehouse as wh 
                                            WHERE wh.id = pr_wh_loc.warehouse_id 
                                            AND pr_wh_loc.item_id = '".$migrationSheet[$rowIndex][2]."' 
                                            AND wh.wrh_code ='".addslashes($targetCell)."' 
                                            AND pr_wh_loc.status = 1
                                            AND wh.company_id=".$this->arrUser['company_id']." LIMIT 1;";
                                // echo $warehouse;exit;
                                $RS = $this->objsetup->CSI($warehouse);
                                
                                if ($RS->RecordCount() > 0) {
                                    $Row = $RS->FetchRow();
                                    foreach ($Row as $key => $value) {
                                        if (is_numeric($key)) unset($Row[$key]);
                                    }
                                    $migrationSheet[$rowIndex][$columnIndex] = $Row["id"];
                                    $items_warehouse_name_arr[] = $Row["name"];
                                } else{
                                    $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' warehouse is not valid.';
                                }
                            }
                            else
                            {
                                $migrationSheet[$rowIndex][$columnIndex] = 0;
                                $items_warehouse_name_arr[] = '-';
                            }
                        break;

                        case "SalesOrderItem":
                            $sqlTable = $templateSheet[1][$columnIndex];
                            $sqlProperty = $templateSheet[2][$columnIndex];

                            if ($migrationSheet[$rowIndex][1] == 0){
                                $sqlResult = "SELECT id , product_code , unit_id , stock_check , costing_method_id,
                                            (SELECT id FROM  units_of_measure_setup WHERE product_id= p.id AND unit_id = p.unit_id LIMIT 1) 
                                            AS uom_id FROM product AS p
                                            WHERE p.product_code = '$targetCell' and company_id=" . $this->arrUser['company_id']. " LIMIT 1";
                                
                                // echo $sqlResult;exit;
                                $RS = $this->objsetup->CSI($sqlResult);

                                if ($RS->RecordCount() > 0) {
                                    $Row = $RS->FetchRow();
                                    $migrationSheet[$rowIndex][$columnIndex] = $Row["id"];
                                    $items_ids_arr[] = $Row["id"];
                                    $items_codes_arr[] = $Row["product_code"];
                                    $items_costing_method_arr[] = $Row["costing_method_id"];
                                    $items_default_uom_arr[] = $Row["unit_id"];
                                    $items_uom_ids_arr[] = $Row["uom_id"];
                                    $items_stock_check_arr[] = $Row["stock_check"];
                                    
                                } else{
                                    $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found for('.$this->arrUser['user_name'].'). Please check your setup';
                                }
                            }
                            else if ($migrationSheet[$rowIndex][1] == 1){
                                    $sqlResult = "SELECT  gl.id, gl.vatRateID, gl.displayName, gl.accountCode AS product_code, gl.accountType, glLink.child_gl_account_id
                                        FROM gl_account_link AS glLink
                                        LEFT JOIN gl_account gl ON gl.id=glLink.child_gl_account_id
                                        WHERE   gl.status=1 AND glLink.company_id=" . $this->arrUser['company_id']. "  AND gl.allowPosting=1 AND gl.accountType=3 AND gl.accountCode = '$targetCell' LIMIT 1";
                                
                                // echo $sqlResult;exit;
                                $RS = $this->objsetup->CSI($sqlResult);

                                if ($RS->RecordCount() > 0) {
                                    $Row = $RS->FetchRow();
                                    $migrationSheet[$rowIndex][$columnIndex] = $Row["id"];
                                    $items_ids_arr[] = $Row["id"];
                                    $items_codes_arr[] = $Row["product_code"];
                                    $items_costing_method_arr[] = 0;
                                    $items_default_uom_arr[] = 0;
                                    $items_uom_ids_arr[] = 0;
                                    $items_stock_check_arr[] = 0;
                                    
                                } else{
                                    $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found for('.$this->arrUser['user_name'].'). Please check your setup';
                                }
                            }
                        break;

                        case "SalesOrderDetailsVAT":
                            if ($migrationName == "Purchase-Order-Detail"){
                                $vatTable = 'srm_invoice';
                            } else{
                                $vatTable = 'orders';
                            }
                            if(is_numeric($migrationSheet[$rowIndex][0])){
                                $sqlVAT = "SELECT v.id, v.vat_value
                                            FROM vat_posting_grp_setup AS c, vat v
                                            WHERE c.`postingGrpID` = (SELECT `bill_to_posting_group_id` FROM $vatTable WHERE id='".$migrationSheet[$rowIndex][0]."') AND
                                            c.`vatRateID` = v.id AND
                                            v.vat_name = '".$targetCell."';";
                                // echo $sqlVAT;exit;
                                $RS = $this->objsetup->CSI($sqlVAT);

                                if ($RS->RecordCount() > 0) {
                                    $Row = $RS->FetchRow();
                                    $migrationSheet[$rowIndex][$columnIndex] = $Row["id"];
                                    $items_vat_price_arr[] = 0;
                                    $items_vat_value_arr[] = $Row["vat_value"];
                                    
                                } else{
                                    if ($migrationName == "Purchase-Order-Detail"){
                                        $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' This Supplier\'s Fianace details have no been populated.';
                                    } else{
                                        $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' This Customer\'s Fianace details have no been populated.';
                                    }
                                }
                            }else{
                                $errorLog[$errorMessageKey] = ' Previous code('.$migrationSheet[$rowIndex][0].') does not exist.';
                            }
                        break;

                        case "PurchaseOrderInvoiceChk":
                            $purchaseOrderFlag = true;
                            $sqlPur = "SELECT * FROM sr_srm_general_sel 
                                    WHERE (prev_code='".addslashes($targetCell)."' 
                                    OR supplier_code='".addslashes($targetCell)."') 
                                    AND company_id=".$this->arrUser['company_id'].";";
                            // echo $sqlPur;exit;
                            $RS = $this->objsetup->CSI($sqlPur);

                            if ($RS->RecordCount() > 0) {
                                $Row = $RS->FetchRow();
                            } else{
                                $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' previous/supplier code has not been validated.';
                            }
                        break;
                        
                        case "List":
                            $sqlTable = $templateSheet[1][$columnIndex];
                            $sqlProperty = $templateSheet[2][$columnIndex];
                            
                            $sqlResult = "SELECT id FROM " . $sqlTable . " 
                                        WHERE " . $sqlProperty . "=\"" . addslashes($targetCell). "\" 
                                        LIMIT 1";
                            
                            // echo $sqlResult.'<br>';
                            $RS = $this->objsetup->CSI($sqlResult);
                            // $storedProcList = "CALL SR_Logentry(".$this->arrUser['company_id'].",".$this->arrUser['id'].",'Migration.php','migrateFile()','arr input',".$sqlResult.");";
                            // $storedProcListRS = $this->objsetup->CSI($storedProcList);

                            if ($RS->RecordCount() > 0) {
                                $Row = $RS->FetchRow();
                                $migrationSheet[$rowIndex][$columnIndex] = $Row["id"];

                            } else{
                                $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found. Please check your data file';
                            }
                            break;

                        case "ListOnlyCompanyId":
                            $sqlTable = $templateSheet[1][$columnIndex];
                            $sqlProperty = $templateSheet[2][$columnIndex];
                            
                            $sqlResult = "SELECT id FROM " . $sqlTable . " 
                                        WHERE " . $sqlProperty . "=\"" . addslashes($targetCell). "\" AND 
                                        company_id=" . $this->arrUser['company_id']. "
                                        LIMIT 1";
                            
                            // echo $sqlResult.'<br>';
                            $RS = $this->objsetup->CSI($sqlResult);
                            // $storedProcList = "CALL SR_Logentry(".$this->arrUser['company_id'].",".$this->arrUser['id'].",'Migration.php','migrateFile()','arr input',".$sqlResult.");";
                            // $storedProcListRS = $this->objsetup->CSI($storedProcList);

                            if ($RS->RecordCount() > 0) {
                                $Row = $RS->FetchRow();
                                $migrationSheet[$rowIndex][$columnIndex] = $Row["id"];
                                if ($migrationName == 'BrandCategory' && $columnIndex>0){
                                    $brand_id = $migrationSheet[$rowIndex][0];
                                    $category_id = $migrationSheet[$rowIndex][$columnIndex];

                                     $RecordExist = $this->checkRecordExist($brand_id,$category_id);
                                    $brand_name = $brand_id;
                                    if($RecordExist==1){
                                         $errorLog[$errorMessageKey] = '"'. $errorMessageValue. '"'. ' already exist agains brand id "'.$migrationSheet[$rowIndex][0].'"';
                                    }
                                    
                                }
                                // for unit of measure duplication
                                if ($migrationName == 'Item-Unit-of-Measure' && $columnIndex>0 && $migrationSheet[0][$columnIndex]=='Unit of Measure'){
                                    $product_prev_code = $migrationSheet[$rowIndex][0];
                                    $uom_record_id = $migrationSheet[$rowIndex][$columnIndex];
                                   // echo $product_id;exit;
                                     $RecordExist = $this->checkUomExist($product_prev_code,$uom_record_id);
                                   // echo $RecordExist;exit;
                                    if($RecordExist==1){
                                         $errorLog[$errorMessageKey] = '"'. $errorMessageValue. '"'. ' already exist agains product id "'.$migrationSheet[$rowIndex][0].'"';
                                    }
                                    
                                }

                            } else{
                                $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found. Please check your data file';
                            }
                            break;

                        case "ItemWarehouseStorageLocationChk":
                        // echo $migrationSheet[$rowIndex][4];exit;

                            $sqlResult = "SELECT pr_wh_loc.id, `wrh_bin_loc`.`warehouse_id` FROM warehouse_bin_location AS wrh_bin_loc, `product_warehouse_location` AS pr_wh_loc, product AS prd
                                                WHERE 
                                                        `pr_wh_loc`.`warehouse_loc_id` = wrh_bin_loc.id AND
                                                        `pr_wh_loc`.item_id = prd.id AND
                                                        wrh_bin_loc.title = '". addslashes($targetCell)."' AND
                                                        prd.product_code = '".$migrationSheet[$rowIndex][6]."';";

                            $RS = $this->objsetup->CSI($sqlResult);
                            // echo $sqlResult;exit;

                            if ($RS->RecordCount() > 0) {
                                $Row = $RS->FetchRow();
                                $storageName = $targetCell;
                                $storageLocation_id = $Row["id"];
                                $warehouseNames[$storageLocation_id] = $migrationSheet[$rowIndex][$columnIndex];
                                $migrationSheet[$rowIndex][$columnIndex] = $storageLocation_id;
                                $storageLocationFlag = true;
                            } else{
                                $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' Storage Location '.$targetCell.' not valid on Item:'. $migrationSheet[$rowIndex][6];
                            }
                            break;
                            
                        case "ItemUOMAllocationChk"://still needs doing
                            
                            // $sqlResult = "SELECT id FROM product WHERE unit_id=(SELECT id FROM units_of_measure WHERE title='".$targetCell."' AND company_id=".$this->arrUser['company_id']." LIMIT 1) AND product_code='".$migrationSheet[$rowIndex][6]."';";
                            $sqlResult = "SELECT id FROM units_of_measure_setup WHERE cat_id=(SELECT id FROM units_of_measure WHERE title='".$targetCell."' AND company_id=".$this->arrUser['company_id']." LIMIT 1) AND product_code='".$migrationSheet[$rowIndex][6]."' AND company_id=".$this->arrUser['company_id']." LIMIT 1;";
                            // echo $sqlResult;exit;
                            $RS = $this->objsetup->CSI($sqlResult);

                            if ($RS->RecordCount() > 0) {
                                $Row = $RS->FetchRow();
                                $uomName = $targetCell;
                                $migrationSheet[$rowIndex][$columnIndex] = $Row["id"];
                                $uomFlag = true;
                            } else{
                                $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' The Base UOM on this Item is incorrect ';
                            }

                            break;
                        case "DefinedList":
                            $hardValues = $templateSheet[1][$columnIndex];
                            $explodedValues = explode(",", $hardValues);
                            $hardValuesArray= array();
                            foreach($explodedValues as $rec){
                                $hardValuesRec = explode("/", $rec);
                                $hardValuesArray[] = $hardValuesRec[0];
                            }
                            if (!in_array($migrationSheet[$rowIndex][$columnIndex], $hardValuesArray)) {
                                $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found. Please check instructions in your migration file';
                            }
                            break;

                        case "DefinedList2":
                        //this will match value and insert id
                            $hardValues = $templateSheet[1][$columnIndex];
                            $explodedValues = explode(",", $hardValues);
                            $hardValuesArray= array();
                            foreach($explodedValues as $rec){
                                $hardValuesRec = explode("/", $rec);
                                $hardValuesArray[] = $hardValuesRec[1];
                            }
                            if (!in_array($migrationSheet[$rowIndex][$columnIndex], $hardValuesArray)) {
                                $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found. Please check instructions in your migration file';
                            }
                            else{
                                foreach($explodedValues as $rec){
                                    $hardValuesRec = explode("/", $rec);
                                    if($hardValuesRec[1] == $migrationSheet[$rowIndex][$columnIndex])
                                        $migrationSheet[$rowIndex][$columnIndex] = $hardValuesRec[0];
                                }
                            }
                            break;

                        case "DefinedListVO":
                            $hardValues = $templateSheet[1][$columnIndex];
                            $explodedValues = explode(",", $hardValues);
                            $hardValuesArray= array();
                            foreach($explodedValues as $rec){
                                $hardValuesRec = explode("/", $rec);
                                $hardValuesArray[] = $hardValuesRec[0];
                            }

                            if(strlen($templateSheet[1][$columnIndex])>0){
                                if (!in_array($migrationSheet[$rowIndex][$columnIndex], $hardValuesArray)) {
                                    $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not found. Please check instructions in your migration file!';
                                }
                            }
                            break;
                            
                        case "Boolean":
                            if ($targetCell == 'yes' || 'Yes' || 'YES') $targetCell = '1';
                            if ($targetCell == 'no'|| 'No' || 'NO') $targetCell = '0';
                            if ($targetCell != '0' && $targetCell != '1') $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is neither 1/0';
                            break;

                        case "TargetsDataTypeBoolean":
                            if ($targetCell == 'Products') $migrationSheet[$rowIndex][$columnIndex] = 1;
                            if ($targetCell == 'Customer') $migrationSheet[$rowIndex][$columnIndex] = 2;
                            if ($targetCell == 'Products/Customer') $migrationSheet[$rowIndex][$columnIndex] = 3;
                            if ($targetCell != 'Products' && $targetCell != 'Customer' && $targetCell != 'Products/Customer') $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is neither Products, Customer or Products/Customer';
                            break;

                        case "TargetsProductTypeBoolean":
                            if ($targetCell == 'Category') $migrationSheet[$rowIndex][$columnIndex] = 1;
                            if ($targetCell == 'Product') $migrationSheet[$rowIndex][$columnIndex] = 2;
                            if ($targetCell == 'Brand') $migrationSheet[$rowIndex][$columnIndex] = 3;
                            if ($targetCell != 'Category' && $targetCell != 'Product' && $targetCell != 'Brand') $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is neither Category/Product/Brand';
                            break;
                            
                        case "TargetsTargetsTypeBoolean":
                            if ($targetCell == 'Amount') $migrationSheet[$rowIndex][$columnIndex] = 1;
                            if ($targetCell == 'Quantity') $migrationSheet[$rowIndex][$columnIndex] = 2;
                            if ($targetCell != 'Amount' && $targetCell != 'Quantity') $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is neither Amount/Quantity';
                            break;

                        case "CrmTypeBoolean":
                            /* if ($targetCell == 'Standard') $migrationSheet[$rowIndex][$columnIndex] = 1;
                            if ($targetCell == 'Route To Market') $migrationSheet[$rowIndex][$columnIndex] = 2;
                            if ($targetCell == 'Indirect') $migrationSheet[$rowIndex][$columnIndex] = 3;
                            if ($targetCell != 'Standard' && $targetCell != 'Route To Market' && $targetCell != 'Indirect') $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is neither Standard/Route To Market/Indirect'; */
                            if ($targetCell != '1' && $targetCell != '2' && $targetCell != '3') $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is neither 1/2/3';
                            break;

                        case "SalesOrderItemTypeCheck":
                            $salesOrderDetailFlag = true;                            
                            if ($targetCell == 'Item') $migrationSheet[$rowIndex][$columnIndex] = 0;
                            else if ($targetCell == 'GL') $migrationSheet[$rowIndex][$columnIndex] = 1;
                            else $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' please pick Item or GL';
                            break;

                        case "PurchaseOrderItemTypeCheck":
                            $purchaseOrderDetailFlag = true;
                            if ($targetCell == 'Item') $migrationSheet[$rowIndex][$columnIndex] = 0;
                            else if ($targetCell == 'GL') $migrationSheet[$rowIndex][$columnIndex] = 1;
                            else if ($targetCell == 'AddCost') $migrationSheet[$rowIndex][$columnIndex] = 2;
                            else $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' please pick Item or GL or Item Additional Cost';
                            break;

                        case "PurchaseAllocationTypeCheck":
                            if ($targetCell == 'Purchase') $migrationSheet[$rowIndex][$columnIndex] = 1;
                            else if ($targetCell == 'Sale') $migrationSheet[$rowIndex][$columnIndex] = 2;
                            else if ($targetCell == 'Item Ledger') $migrationSheet[$rowIndex][$columnIndex] = 3;
                            else if ($targetCell == 'Opening Balances') $migrationSheet[$rowIndex][$columnIndex] = 4;
                            else $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' please pick Purchase, Sale, Item Ledger or Opening Balances';
                            break;

                        case "PurchaseAllocationDateChk":
                            if ($targetCell > $migrationSheet[$rowIndex][11]) $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is greater than Date Received'. $migrationSheet[$rowIndex][9];
                        
                            if (is_numeric($targetCell) && $targetCell <= MAX_EXCEL_DATE && $targetCell > 0) {
                                $migrationSheet[$rowIndex][$columnIndex] = ($targetCell - 25569) * 86400;
                            } else{
                                $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not a valid excel date';                                    
                            }
                            break;
                            
                        case "Date":
                            if (is_numeric($targetCell) && $targetCell <= MAX_EXCEL_DATE && $targetCell > 0) {
                                $migrationSheet[$rowIndex][$columnIndex] = ($targetCell - 25569) * 86400;
                                // for purchase cost dates overlapping
                                if($migrationName == 'Item-Purchase-Cost' && $columnIndex==2){
                                        $product_id = $migrationSheet[$rowIndex][0];
                                        $start_date = $migrationSheet[$rowIndex][1];
                                        $end_date = $migrationSheet[$rowIndex][2]; 
                                        $isOverlappingDate = $this->isOverlappingDate($start_date,$end_date,$product_id,2);

                                        if($isOverlappingDate>0){
                                            $errorLog[$errorMessageKey] = 'Dates are overlapping with other Purchase Information for product "'.$product_id.'"'.'';  
                                        }
                                        if($end_date < $start_date){
                                            $errorLog[$errorMessageKey] = 'End date should be greater than the start date for product "'.$product_id.'"'.'';  
                                        }
                                }
                                // for sale price dates overlapping
                                if($migrationName == 'Item-Sales-Price' && $columnIndex==2){
                                        $product_id = $migrationSheet[$rowIndex][0];
                                        $start_date = $migrationSheet[$rowIndex][1];
                                        $end_date = $migrationSheet[$rowIndex][2]; 
                                        $isOverlappingDate = $this->isOverlappingDate($start_date,$end_date,$product_id,1);

                                        if($isOverlappingDate>0){
                                            $errorLog[$errorMessageKey] = 'Dates are overlapping with other Sale Information for product "'.$product_id.'"'.'';  
                                        }
                                        if($end_date < $start_date){
                                            $errorLog[$errorMessageKey] = 'End date should be greater than the start date for product "'.$product_id.'"'.'';  
                                        }
                                }
                                
                            } else{
                                $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not a valid excel date';                                    
                            }
                            break;
                        case "Date2UNIX":
                            $migrationSheet[$rowIndex][$columnIndex] = $this->objGeneral->convert_date($migrationSheet[$rowIndex][$columnIndex]);
                            break;
                        case "BatchDate":
                            // echo $targetCell;exit;
                            if (preg_match('/^[0-9]*$/',$targetCell)){
                                if ($targetCell <= MAX_EXCEL_DATE){                            
                                    if (is_numeric($targetCell) && $targetCell <= MAX_EXCEL_DATE && $targetCell > 0) {
                                        $migrationSheet[$rowIndex][$columnIndex] = date("d/m/Y",($targetCell - 25569) * 86400);
                                    } else{
                                        $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is not a excel date';                                   
                                    }
                                } 
                            } else {
                                $migrationSheet[$rowIndex][$columnIndex] = $targetCell;
                            }
                            break;
                        case "externalModuleCode":
                                //echo'<br>'. 'Ext case';
                                $mod_type = $templateSheet[8][0]; // get module type
                                $mod_field = $templateSheet[8][1]; // get module field
                                $check_mod_type = 0;
                                if(strlen($mod_type) > 0){
                                    if(strlen($migrationSheet[$rowIndex][8]) > 0 && $mod_type == 'product'){
                                        $brand_Id = $migrationSheet[$rowIndex][8]; 
                                        $check_mod_type =  $this->checkModuleType($mod_type,$brand_Id);
                                    }else{
                                        $check_mod_type =  $this->checkModuleType($mod_type);
                                    }
                                }
                                //echo $check_mod_type;exit;
                                if($check_mod_type==1){
                                    // new check for the duplicate external code
                                    $check_ext_code = $templateSheet[2][$columnIndex];
                                    if($check_ext_code=='validate_extCode'){  
                                        $data_arr = array('mainTable'=>$templateSheet[3][$columnIndex],
                                                        'extCode'=>$targetCell,
                                                        'mod_field'=>$mod_field,
                                                        'migrationName'=> $migrationName
                                                        );
                                        $isExistExtCode = $this->checkDuplicateExtCode($data_arr);
                                        //echo $isExistExtCode;exit;
                                        if($isExistExtCode==1){
                                            $errorLog[$errorMessageKey] = '"'. $errorMessageValue. '"'. ' already exist.';
                                        }
                                    }
                                    $migrationSheet[$rowIndex][$columnIndex] = $targetCell;
                                }else{
                                   // unset($migrationSheet[$rowIndex][$columnIndex]); 
                                   $errorLog[$errorMessageKey] = '"'. $errorMessageValue. '"'. ' Your module code scheme is set as internal.';
                                }
                                
                            break;    
                        case "Enum": 
                        // $storedProcEnum = "CALL SR_Logentry(".$this->arrUser['company_id'].",".$this->arrUser['id'].",'Migration.php','migrateFile()','arr input',".$sql.");";
                        // $storedProcEnumRS = $this->objsetup->CSI($storedProcEnum);
                            $sql = "SELECT * FROM information_schema.columns WHERE TABLE_SCHEMA='".DATABASE_NAME."' AND TABLE_NAME=\"". $templateSheet[3][$columnIndex]."\" AND COLUMN_NAME='". $templateSheet[4][$columnIndex]."';";
                            $sqlRow = $this->objsetup->CSI($sql)->FetchRow();
                            $enumString = $sqlRow['COLUMN_TYPE'];
                            $enumString = substr($enumString, 5, sizeof($enumString)-2);
                            $enumValues = str_getcsv($enumString, ',', "'");
                            $isEnum = false;
                            foreach ($enumValues as $value){ 
                                if ($value == $targetCell){
                                    $isEnum = true;
                                    break;
                                } 
                            }                                                           
                            if (!$isEnum) $errorLog[$errorMessageKey] = $migrationSheet[0][$columnIndex]. '"'. $errorMessageValue.'"'.' is not an enum value';
                            break;

                        case "checkPrimary": 
                        if ($targetCell != '0' && $targetCell != '1') {
                            $errorLog[$errorMessageKey] = '"'.$errorMessageValue.'"'.' is neither 1/0';
                            }elseif($targetCell==1){
                                    $sqlTable = $templateSheet[3][$columnIndex];
                                    $acc_id =   $migrationSheet[$rowIndex][0];
                                    $module_type = $templateSheet[8][2];
                                    if(is_numeric($migrationSheet[$rowIndex][0])){
                                    $sqlResult = "SELECT id FROM " . $sqlTable . " WHERE  
                                                 acc_id =".$acc_id."
                                                 AND module_type =".$module_type."
                                                AND is_primary=1 
                                                AND company_id=" . $this->arrUser['company_id']. " 
                                                AND status=1 $where LIMIT 1";
                                    //echo $sqlResult;exit;
                                    $RS = $this->objsetup->CSI($sqlResult);            
                                    if ($RS->RecordCount() > 0) {
                                        $errorLog[$errorMessageKey] = 'Primary contact is already set for acc_id('.$acc_id.').';
                                    } 
                                }else{
                                    $errorLog[$errorMessageKey] = ' Previous code('.$migrationSheet[$rowIndex][0].') does not exist.';
                                }
                                }
                            break;
                        }
                    } else{
                        $mandatoryChk = strpos($templateSheet[5][$columnIndex],'*');

                        if($mandatoryChk>0) $errorLog[$errorMessageKey] = 'This is a mandatory field';

                        if($type == 'Number' 
                        || $type == "Boolean" 
                        || $type == "Date" 
                        || $type == "List" 
                        || $type == "ListCompany" 
                        || $type == "BoolDupeCheck"
                        || $type == "DefinedList" 
                        || $type == "Comma" 
                        || $type == "DefinedList" 
                        || $type == "DefinedListVO" 
                        || $type == "Enum" 
                        || $type == "ListCompanyRetreiveProductMulti" 
                        || $type == "ListCompanyCustomized"
                        || $type == "ListChildByCompany"
                        || $type == "SalesOrderWarehouse"
                        || $type == "PurchaseOrderInvoiceChk"
                        || $type == "SalesOrderItem"
                        || $type == "SalesOrderDetailsVAT"
                        || $type == "CrmTypeBoolean"
                        || $type == "checkPrimary"
                        || $type == "Ignore"
                        ){
                            $migrationSheet[$rowIndex][$columnIndex] = 'NULL';
                        } 
                    }
                }
            }
            
            //echoecho "New mod type"; print_r($migrationSheet);exit;
            $module_type = $templateSheet[8][0];//exit;
            $module_field = $templateSheet[8][1];//exit;
            $needSetup = $templateSheet[10][3];// need financial settings data while uploading migration for Customer Finance only.

            $glAccountsMigration = $templateSheet[6][0];                

            if($needSetup>0){

                $setupSql = "SELECT  finchargechk,finchargetype,fincharges,inschargechk,inschargetype,inscharges
                             FROM financial_settings
                             WHERE company_id='" . $this->arrUser['company_id'] . "'LIMIT 1";

                $setupRS = $this->objsetup->CSI($setupSql);

                if ($setupRS->RecordCount() > 0) {
                    $Row = $setupRS->FetchRow();
                    $finchargechk = ($Row['finchargechk']) ? $Row['finchargechk'] : 0;
                    $finchargetype = ($Row['finchargetype']) ? $Row['finchargetype'] : 0;
                    $fincharges = ($Row['fincharges']) ? $Row['fincharges'] : 0;
                    $inschargechk = ($Row['inschargechk']) ? $Row['inschargechk'] :0;
                    $inschargetype = ($Row['inschargetype']) ? $Row['inschargetype'] :0;
                    $inscharges = ($Row['inscharges']) ? $Row['inscharges'] : 0;
                }
                else{
                    $errorLog[$errorMessageKey] = 'Financial settings are not applied in Setup!';
                }    
            }

            //echo'<pre>';print_r($migrationSheet);exit;

            if ($migrationName == 'Purchase-Orders-Items' && $migrationSheet[1][6]){
                // echo $migrationSheet[1][6];exit;

                $checkAlreadyPosted = "SELECT purchaseStatus, invoice_code 
                                        FROM srm_invoice 
                                        WHERE id= " . $migrationSheet[1][6] . " AND 
                                            company_id = '" . $this->arrUser['company_id'] . "'
                                        LIMIT 1";        
                $RsAlreadyPosted = $this->objsetup->CSI($checkAlreadyPosted);
                $purchaseStatus = $RsAlreadyPosted->fields['purchaseStatus'];
                
                if($purchaseStatus == 2)
                {
                    $response['ack'] = 0;
                    $response['error'] = "Already Received";
                    return $response;
                    exit;
                }
                elseif($purchaseStatus == 3)
                {
                    $response['ack'] = 0;
                    $response['error'] = ' Already posted with Invoice No. '.$RsAlreadyPosted->fields['invoice_code'];
                    return $response;
                    exit;
                }                          
            }

            $maxRows = $rowIndex;
            // print_r($errorLog);
            if (sizeof($errorLog) == 0){
                $template = array();
                for ($columnIndex = 0; $columnIndex < sizeof($templateSheet[0]); $columnIndex++){
                    array_push($template, (object)array(
                        "tableName" => $templateSheet[3][$columnIndex], 
                        "fieldName" => $templateSheet[4][$columnIndex], 
                        "indexId" => $columnIndex));
                }
                //print_r($template);exit;
                // echo sizeof($template);
                while (sizeof($template) > 0){
                    // $sqlTiming = "INSERT INTO migration_performance (rowIndex, columnIndex,type)
                    // VALUES (".$rowIndex.",".$columnIndex.",'SQLBuilder');"; 
                    // echo $sqlTiming;exit;
                    // $RS = $this->objsetup->CSI($sqlTiming);

                    $tableName = $template[0]->tableName;
                    $uniqueName = $templateSheet[3][1];

                    $uniqueIdStatus = "SELECT * FROM information_schema.columns WHERE table_name='".$uniqueName."' AND TABLE_SCHEMA = '".DATABASE_NAME."' AND column_name = 'unique_id';";
                   //echo $uniqueIdStatus;exit;
                    $RS = $this->objsetup->CSI($uniqueIdStatus);   

                    $sqlFields = $RS->RecordCount() ? "(unique_id," : "(";
                     //echo $templateSheet[8][2];exit;
                    if(strlen($templateSheet[7][2]) > 0 && $templateSheet[8][2] > 0){//adds module_type to sqlFields 
                        $sqlFields .= $templateSheet[7][2].',';
                    }

                    if($needSetup>0){
                        $sqlFields .= 'finchargetype,fincharges,inschargetype,inscharges,type,';
                    }
                    if($stockMigration>0){

                        // $additionalQueryFields = 'ItemNo,description,uomID,uom,';
                        $sqlFields .= 'ItemNo,description,uomID,uom,';
                        // $sqlFields .= $additionalQueryFields;
                    }

                    if ($migrationName == 'Purchase-Order-Items-Stock-Allocation'){
                        $sqlFields .= 'item_trace_unique_id,date_received,date_receivedUnConv,';
                    }

                    if ($migrationName == 'CRM-General' || $migrationName == 'SRM-General'){
                        $sqlFields .= 'transaction_id,';
                    }

                    if ($migrationName == 'Sales-Quotes-Items' || $migrationName == 'Sales-Orders-Items'){
                        $sqlFields .= 'type,product_code,item_name,vat_id,vat_name,vat_value,unit_measure_id,unit_measure, unit_parent_id,primary_unit_of_measure_id,unit_qty,costing_method_id,stock_check,cat_id,';
                    }

                    if ($migrationName == 'Purchase-Orders-Items'){
                        $sqlFields .= 'type,product_code,product_name,invoice_type,uom_id,vat,vat_id,vat_value,unit_measure,unit_measure_id,unit_parent_id,unit_qty,primary_unit_of_measure_name,primary_unit_of_measure_id,stock_check,cat_id,';
                    }

                    if ($migrationName == 'CRM-Notes' || $migrationName == 'Customer-Notes'){
                        $sqlFields .= 'employee_id,module_name,type,sub_type,create_date,record_name,';
                    }

                    
                    if($saleOrderFlag == true){
                        $sqlFields .= 'transaction_id,sale_order_code,type,sell_to_cust_id,sell_to_contact_no,sell_to_cust_name,sell_to_address,sell_to_address2,sell_to_city,sell_to_county,sell_to_post_code,sell_to_contact_id,sell_to_contact,sale_person_id,sale_person,cust_phone,cust_fax,cust_email,bill_to_cust_id,finance_customer_id,bill_to_cust_no,bill_to_name,bill_to_address,bill_to_address2,bill_to_city,bill_to_county,bill_to_post_code,bill_to_country_id,country_id,bill_to_contact,bill_to_contact_id,bill_to_contact_phone,bill_to_contact_email,bill_to_bank_id,bill_to_bank_name,bill_to_finance_charges,bill_to_finance_charges_type,bill_to_insurance_charges,bill_to_insurance_charges_type,currency_id,bill_to_posting_group_id,bill_to_posting_group_name,ship_to_name,ship_to_address,ship_to_address2,ship_to_city,ship_to_county,ship_to_post_code,ship_to_contact_id,ship_to_contact,book_in_tel,comm_book_in_contact,book_in_email,alt_depo_id,payment_discount,payment_method_id,';
                    }
                    
                    if ($salesOrderDetailFlag == true){
                        $sqlFields .= 'unit_measure_id,unit_measure,default_unit_measure_id,product_code,ref_prod_id,promotion_id,costing_method_id,vat_price,vat_value,stock_check,';
                    }

                    if ($purchaseOrderFlag == true){
                        $sqlFields .= 'transaction_id,type,order_code,account_payable_id,purchase_code_id,sell_to_contact_no,sell_to_cust_id,sell_to_contact_id,sell_to_cust_name,sell_to_address,sell_to_address2,sell_to_city,sell_to_county,sell_to_contact,sale_person_id,sale_person,cust_phone,cust_fax,cust_email,currency_id,converted_currency_id,converted_currency_code,sell_to_post_code,bill_to_cust_id,bill_to_cust_no,bill_to_contact_id,payable_bank,payment_terms_code,bill_to_name,bill_to_address,bill_to_address2,payment_method_id,bill_to_city,bill_to_county,bill_to_post_code,billToSupplierCountry,bill_to_contact,alt_depo_id,ship_to_name,ship_to_address,ship_to_address2,ship_to_city,ship_to_county,ship_to_post_code,shipToSupplierLocCountry,ship_to_phone,ship_to_email,bill_to_contact_no,ship_to_contact_shiping,country,srm_purchase_code,bill_phone,bill_fax,bill_email,bill_to_posting_group_id,payable_number,purchase_number,';
                    }

                    if ($purchaseOrderDetailFlag == true){
                        $sqlFields .= 'unit_measure_id,unit_measure,primary_unit_of_measure_id,product_code,promotion_id,vat_price,vat_value,stock_check,invoice_type,';
                    }

                    if($migrationName == 'Item-Unit-of-Measure')
                    {
                        // echo $migrationSheet[$rowIndex][0];
                        /* echo '<pre>';
                        print_r($migrationSheet[$rowIndex]);
                        $sqluom= "SELECT p.id as pid 
                                        FROM product as p
                                        WHERE old_code='" . $migrationSheet[$rowIndex][0]. "' LIMIT 1";
                        echo $sqluom;exit;
                        $RSUom = $this->objsetup->CSI($sqluom);                        
                        $uomMig = $RSUom->RecordCount(); 

                        if ($uomMig > 0) {

                        } */
                        $sqlFields .= 'product_id,unit_id,ref_quantity,cat_id,check_id,Dimension1_unit,Dimension2_unit,Dimension3_unit,volume,volume_unit,weightUnit,Dimension1,Dimension2,Dimension3,';  
                    }

                    if($migrationName == 'Opening-Balances-Customer')
                    {
                        $sqlFields .= 'moduleNo,description,account_id,account_no,account_name,posting_group_id,debitAmount,creditAmount,converted_price,currency_id,converted_currency_id,posting_dateUnConv,type,created_date,transaction_id,';  
                    }

                    if($migrationName == 'Opening-Balances-Supplier')
                    {
                        $sqlFields .= 'moduleNo,description,account_id,account_no,account_name,posting_group_id,debitAmount,creditAmount,converted_price,currency_id,converted_currency_id,posting_dateUnConv,type,created_date,transaction_id,';  
                    }

                    if($migrationName == 'Item-Warehouse')
                    {
                        $sqlFields .= 'warehouse_loc_id,cost,cost_type_id,uom_id,currency_id,warehouse_loc_sdate,warehouse_loc_edate,';  
                    }

                    if($migrationName == 'Supplier-Finance')
                    {
                        $sqlFields .= 'bank_name,';  
                    }

                    if ($storageLocationFlag == true){
                        $sqlFields .= 'warehouse_id,';
                    }

                    if ($uomFlag == true){
                        $sqlFields .= 'primary_unit_id,primary_unit_qty,unit_measure_name,unit_measure_qty,';
                    }
                    
                    if(strlen($glAccountsMigration) > 0 && $glAccountsMigration == 'gl_account'){
                        $sqlFields .= 'displayName,';                            
                    }   

                    if(strlen($module_field) > 0){
                        $sqlFields .= $module_field.',';
                    }

                    if(strlen($templateSheet[9][0]) > 0 && $templateSheet[9][0] == "Excl-Default-Fields")
                        $sqlFields .= "";

                    if($migrationName == 'BrandCategory'){
                        $sqlFields .= 'company_id,user_id,AddedOn,AddedBy,';
                    }
                    elseif($migrationName == 'Item-Purchase-Cost'){
                        $sqlFields .= 'company_id,user_id,AddedOn,AddedBy,';
                    }
                    elseif($migrationName == 'Item-Sales-Price'){
                        $sqlFields .= 'company_id,user_id,AddedOn,AddedBy,';
                    }
                    elseif($migrationName == 'Item-Marginal-Analysis'){
                        $sqlFields .= 'AddedOn,AddedBy,';
                    }
                    else
                        $sqlFields .= 'company_id,user_id,status,AddedOn,AddedBy,'; //shananegan

                    $sqlFieldIndexes = array();
                    $pos = 0;
                    $maxColumn = sizeof($template);
                    

                    for ($columnIndex = 0; $columnIndex < $maxColumn; $columnIndex++){
                        if ($tableName == $template[$pos]->tableName){
                            //echo $templateSheet[0][$columnIndex]; exit;
                            if(!($templateSheet[0][$columnIndex] == 'DefinedListVO') && !($templateSheet[2][$columnIndex] == 'wt_n_vol')){                              
                                $sqlFields = $sqlFields . $template[$pos]->fieldName. ',';
                            }
                            array_push($sqlFieldIndexes, $template[$pos]->indexId);
                            array_splice($template, $pos, 1);                               

                        } else{
                            $pos++;
                        }
                        
                    }
                    
                }
                $sqlFields = substr($sqlFields, 0, -1) . ', DM_check, DM_file)'; //removes trailing comma and adds last braket

                $UUID_chk = 0;
                $UUID_chk = $RS->RecordCount() ? 1: 0;  
                $retRes = 0;
                
                for ($rowIndex = 1; $rowIndex < $maxRows; $rowIndex++){

                    $UUID = ($UUID_chk>0) ? "UUID()," : "";
                    
                    $type = '';
                    // if(strlen($templateSheet[7][2]) > 0  && $templateSheet[8][2] > 0){
                    //     $type = $templateSheet[8][2].',';
                    //     $UUID .= $type;
                    // }

                    // if ($migrationName == 'CRM-Contact'){
                    //     $UUID .= "1,";
                    // }

                    if ($migrationName == 'Purchase-Order-Items-Stock-Allocation'){
                        $UUID .= 'UUID(),';

                        if($migrationSheet[$rowIndex][5]>0){

                            $sql8 = "SELECT receiptDate,FROM_UNIXTIME(receiptDate) as unConvDate
                                          FROM srm_invoice
                                          WHERE company_id = " . $this->arrUser['company_id'] . " and
                                                id='".$migrationSheet[$rowIndex][5]."';";
                            // echo $sql8;exit;
                            $RS8 = $this->objsetup->CSI($sql8);

                            if ($RS8->RecordCount() > 0) {
                                $Row = $RS8->FetchRow();
                                $receiptDate = $Row['receiptDate'];
                                $unConvDate = $Row['unConvDate'];
                                $UUID .= $receiptDate.",'".$unConvDate."',";
                            }
                            else{
                                $UUID .= '0,NULL,';
                            }
                        }
                        else{
                            $UUID .= '0,NULL,';
                        }
                    }

                    if ($migrationName == 'CRM-General' || $migrationName == 'CRM-Contact' || 
                        $migrationName == 'CRM-Location' || $migrationName == 'Customer-Contact' || 
                        $migrationName == 'Customer-Location' || $migrationName == 'SRM-General' || 
                        $migrationName == 'CRM-Contact-Location-Mapping' || $migrationName == 'Customer-Contact-Location-Mapping'){
                        $UUID .= "1,";
                    }

                    if ($migrationName == 'Sales-Quotes-Items' || $migrationName == 'Sales-Orders-Items'){

                         $uomResult = "SELECT p.id,p.product_code,p.stock_check,p.costing_method_id as costing_method_id, p.category_id as product_category_id, description, v.id as vat_id, vat_name, vat_value, uoms.id as uom_id, uom.id as primary_uom_id, uom.title as uom_title, uom.parent_id as uom_parent_id, uoms.quantity as uom_quantity FROM product p, vat v, units_of_measure uom, units_of_measure_setup uoms WHERE uom.id = uoms.cat_id and uoms.product_id = p.id and p.unit_id = uom.id and p.vat_rate_id = v.id and p.company_id = " . $this->arrUser['company_id'] . " and p.id='".$migrationSheet[$rowIndex][0]."';";
                        // echo $uomResult;exit;
                        $RS = $this->objsetup->CSI($uomResult);

                        if ($RS->RecordCount() > 0) {
                            $Row = $RS->FetchRow();
                            $prd_id = $Row['id'];
                            $product_code = $Row['product_code'];
                            $description = $Row['description'];
                            $vat_id = $Row['vat_id'];
                            $vat_id = $vat_id ? $vat_id : 0;
                            $vat_name = $Row['vat_name'];
                            $vat_value = $Row['vat_value'];
                            $uom_id = $Row['uom_id'];
                            $primary_uom_id = $Row['primary_uom_id'];
                            $uom_title = $Row['uom_title'];
                            $uom_parent_id = $Row['uom_parent_id'];
                            $stock_check = $this->objGeneral->emptyToZero($Row['stock_check']);
                            $uom_quantity = $Row['uom_quantity'];
                            $costing_method_id = $this->objGeneral->emptyToZero($Row['costing_method_id']);
                            $product_category_id = $this->objGeneral->emptyToZero($Row['product_category_id']);
                        }

                        $UUID .= "0,'" . addslashes($product_code) . "','" . addslashes($description) . "', nullif('$vat_id',''), '$vat_name', '$vat_value', '$uom_id', '$uom_title', '$uom_parent_id','$primary_uom_id', '$uom_quantity', '$costing_method_id',$stock_check, $product_category_id,";
                    }

                    if ($migrationName == 'Purchase-Orders-Items'){

                        // if(echo '<pre>';print_r($migrationSheet); exit;)
                        $uomResult = "SELECT p.id,p.product_code,p.stock_check,p.costing_method_id as costing_method_id, p.category_id as product_category_id, description, v.id as vat_id, vat_name, vat_value, uoms.id as uom_id, uom.id as primary_uom_id, uom.title as uom_title, uom.parent_id as uom_parent_id, uoms.quantity as uom_quantity FROM product p, vat v, units_of_measure uom, units_of_measure_setup uoms WHERE uom.id = uoms.cat_id and uoms.product_id = p.id and p.unit_id = uom.id and p.vat_rate_id = v.id and p.company_id = " . $this->arrUser['company_id'] . " and p.id='".$migrationSheet[$rowIndex][0]."';";
                        //  echo $uomResult;exit;
                        $RS = $this->objsetup->CSI($uomResult);

                        if ($RS->RecordCount() > 0) {
                            $Row = $RS->FetchRow();
                            $prd_id = $Row['id'];
                            $product_code = $Row['product_code'];
                            $description = $Row['description'];
                            $vat_id = $Row['vat_id'];
                            $vat_id = $vat_id ? $vat_id : 0;
                            $vat_name = $Row['vat_name'];
                            $vat_value = $Row['vat_value'];
                            $uom_id = $Row['uom_id'];
                            $primary_uom_id = $Row['primary_uom_id'];
                            $uom_title = $Row['uom_title'];
                            $uom_parent_id = $Row['uom_parent_id'];
                            $stock_check = $this->objGeneral->emptyToZero($Row['stock_check']);
                            $uom_quantity = $Row['uom_quantity'];
                            $costing_method_id = $Row['costing_method_id'];
                            $product_category_id = $this->objGeneral->emptyToZero($Row['product_category_id']);
                        }
                        // $sqlFields .= 'type,product_code,product_name,invoice_type,uom_id,vat,vat_id,unit_measure,unit_measure_id,unit_parent_id,unit_qty,primary_unit_of_measure_name,primary_unit_of_measure_id,stock_check,cat_id,';
                        $UUID .= "0,'" . addslashes($product_code) . "','" . addslashes($description) . "',3,$uom_id,'$vat_name',$vat_id,'$vat_value','$uom_title',$uom_id,$uom_parent_id,$uom_quantity,'$uom_title',$primary_uom_id,$stock_check,$product_category_id,";                        
                    }

                    if ($migrationName == 'SRM-Contact' || $migrationName == 'SRM-Location' || 
                        $migrationName == 'Supplier-Contact' || $migrationName == 'Supplier-Location'  || 
                        $migrationName == 'Supplier-Contact-Location-Mapping' || $migrationName == 'SRM-Contact-Location-Mapping'){
                        $UUID .= "2,";
                    }
                    
                    if ($migrationName == 'Customer-General' || $migrationName == 'Supplier-General' ){
                        $UUID .= "3,";
                    }
    
                    if($needSetup>0){
                        $UUID .= $finchargetype.','.$fincharges.','.$inschargetype.','.$inscharges.',"customer",';
                    }

                    if ($migrationName == 'CRM-Notes' || $migrationName == 'Customer-Notes'){
                        $module_name = '';
                        if($migrationName == 'Customer-Notes')
                        $module_name = "Customer";
                        if($migrationName == 'CRM-Notes')
                        $module_name = "CRM";
                        // echo $migrationSheet[$rowIndex][1];exit;
                        $CustomerDetails = "SELECT crm_code, customer_code, name from crm where id = " . $migrationSheet[$rowIndex][1] . " and company_id = " . $this->arrUser['company_id'] . " ";
                        $CustomerDetailsResult = $this->objsetup->CSI($CustomerDetails);
                        $CDR = $CustomerDetailsResult->FetchRow();
                        // echo $CustomerDetails;exit;
                        $recordName = ($CDR['customer_code'] ? $CDR['customer_code'] : $CDR['crm_code']) . " - " . $CDR['name'];
                        // echo $recordName;exit;
                        $UUID .= "'".$this->arrUser['id']."','".$module_name."','Notes','4',UNIX_TIMESTAMP(NOW()),'" . $recordName . "',";
                    }

                    if ($migrationName == 'CRM-General' || $migrationName == 'SRM-General'){
                        $transactionSQL = "SELECT SR_GetNextTransactionID(".$this->arrUser['company_id'].", 2)";
                        $transactionSQLRS = $this->objsetup->CSI($transactionSQL);
                        $transactionRow = $transactionSQLRS->FetchRow();
                        $UUID .= "'".$transactionRow[0]."',";
                    }
                    
                    if ($salesOrderDetailFlag == true){
                        $UUID .= "'".$items_uom_ids_arr[$rowIndex-1]."','', '".$items_default_uom_arr[$rowIndex-1]."', '".$items_codes_arr[$rowIndex-1]."', 0, 0,'".$items_costing_method_arr[$rowIndex-1]."', '".$items_vat_price_arr[$rowIndex-1]."', '".$items_vat_value_arr[$rowIndex-1]."', '".$items_stock_check_arr[$rowIndex-1]."',";
                    }

                    if ($purchaseOrderDetailFlag == true){
                        $UUID .= "'".$items_uom_ids_arr[$rowIndex-1]."','', '".$items_default_uom_arr[$rowIndex-1]."', '".$items_codes_arr[$rowIndex-1]."', 0,'".$items_vat_price_arr[$rowIndex-1]."', '".$items_vat_value_arr[$rowIndex-1]."', '".$items_stock_check_arr[$rowIndex-1]."',1,";
                    }
                    
                    $storageLocationId = $migrationSheet[$rowIndex][2];

                    if ($storageLocationFlag == true){
                        $storageLocationSQL = "SELECT pr_wh_loc.id, `wrh_bin_loc`.`warehouse_id` FROM warehouse_bin_location AS wrh_bin_loc, `product_warehouse_location` AS pr_wh_loc, product AS prd
                                            WHERE 
                                                    `pr_wh_loc`.`warehouse_loc_id` = wrh_bin_loc.id AND
                                                    `pr_wh_loc`.item_id = prd.id AND
                                                    wrh_bin_loc.title = '".$warehouseNames[$storageLocationId]."' AND
                                                    prd.id = '".$migrationSheet[$rowIndex][6]."' LIMIT 1;";
                        // echo $storageLocationSQL;exit;
                        $RS = $this->objsetup->CSI($storageLocationSQL);
                        if ($RS->RecordCount() > 0) {
                            $Row = $RS->FetchRow();
                            $UUID .= "'".$Row['warehouse_id']."',";
                        }
                    }

                    if ($uomFlag == true){
                        $uomResult = "SELECT id FROM product WHERE unit_id=(SELECT id FROM units_of_measure WHERE title='".$uomName."' AND company_id=".$this->arrUser['company_id']." LIMIT 1) AND id='".$migrationSheet[$rowIndex][6]."';";
                        // echo $uomResult;exit;
                        $RS = $this->objsetup->CSI($uomResult);

                        if ($RS->RecordCount() > 0) {
                            $Row = $RS->FetchRow();
                            $pri_unit_id = $Row['id'];
                        }
                        $UUID .= "'".$pri_unit_id."',1,'".$uomName."',1,";
                        // echo $UUID; exit;
                    }

                                    

                    $prev_code=$migrationSheet[$rowIndex][1];

                    if ($purchaseOrderFlag == true){
                        $Sqlpurchase = "SELECT  s.*,CONCAT(`purch`.`first_name`,' ',`purch`.`last_name`) AS `purchaser_code`, s.salesperson_id AS purchase_code_id
                                FROM sr_srm_general_bill_add_sel as s
                                LEFT JOIN `employees` `purch` ON (`purch`.`id` = `s`.salesperson_id) 
                                WHERE   s.type IN (2,3) AND 
                                        s.supplier_code IS NOT NULL AND  
                                        s.name !='' AND 
                                        (s.company_id=" . $this->arrUser['company_id'] . ") AND (s.prev_code='$prev_code' OR s.supplier_code='$prev_code') LIMIT 1";
                        // echo $Sqlpurchase;exit;

                        $RSpurchase = $this->objsetup->CSI($Sqlpurchase);

                        if ($RSpurchase->RecordCount() > 0) {
                            $purchaseRow = $RSpurchase->FetchRow();
                            foreach ($purchaseRow as $key => $value) {
                                if (is_numeric($key)) unset($purchaseRow[$key]);
                            }

                            $pOrder_code_Sql = "SELECT SR_GetNextSeq('srm_order','" . $this->arrUser['company_id'] . "','0' ,'0') ";
                            $code = $this->objsetup->CSI($pOrder_code_Sql);
    
                            $SR_GetNextseqcode = $code->fields[0]; 

                            $transactionSQL = "SELECT SR_GetNextTransactionID(".$this->arrUser['company_id'].", 2)";
                            $transactionSQLRS = $this->objsetup->CSI($transactionSQL);
                            $transactionRow = $transactionSQLRS->FetchRow();
                            
                            
                            $transaction_id     = $transactionRow[0];
                            $po_type            = '3';
                            $order_code         = $SR_GetNextseqcode;
                            $account_payable_id = ($purchaseRow['account_payable_id'] != '') ? $purchaseRow['account_payable_id'] : '0';
                            $purchase_code_id   = ($purchaseRow['purchase_code_id'] != '') ? $purchaseRow['purchase_code_id'] : '0';
                            $sell_to_contact_no = $purchaseRow['primaryc_name'];
                            $sell_to_cust_id    = $purchaseRow['id'];
                            $sell_to_cust_no    = $purchaseRow['supplier_code'];
                            $sell_to_contact_id = ($purchaseRow['primaryc_id'] != '') ? $purchaseRow['primaryc_id'] : '0';
                            $sell_to_cust_name  = $purchaseRow['name'];
                            $sell_to_address    = $purchaseRow['address_1'];
                            $sell_to_address2   = $purchaseRow['address_2'];
                            $sell_to_city       = $purchaseRow['city'];
                            $sell_to_county     = $purchaseRow['county'];
                            $sell_to_contact    = $purchaseRow['primaryc_name'];
                            $sale_person_id     = ($purchaseRow['sale_person_id'] != '') ? $purchaseRow['sale_person_id'] : '0';
                            $sale_person        = $purchaseRow['purchaser_code'];
                            $cust_phone         = $purchaseRow['phone'];
                            $cust_fax           = $purchaseRow['fax'];
                            $cust_email         = $purchaseRow['email'];
                            $currency_id        = ($purchaseRow['currency_id'] != '') ? $purchaseRow['currency_id'] : '0';
                            $converted_currency_id=($purchaseRow['currency_id'] != '') ? $purchaseRow['currency_id'] : '0';// '$converted_currency_id',
                            $converted_currency_code= '';// $purchaseRow['converted_currency_code'];     
                            $sell_to_post_code  = $purchaseRow['postcode'];
                            $bill_to_cust_id    = $purchaseRow['id'];
                            $bill_to_cust_no    = $purchaseRow['supplier_code'];
                            $bill_to_contact_id = ($purchaseRow['primaryc_id'] != '') ? $purchaseRow['primaryc_id'] : '0';
                            $payable_bank       = $purchaseRow['bank_name'];
                            $payment_terms_code = ($purchaseRow['payment_terms_id'] != '') ? $purchaseRow['payment_terms_id'] : '0';
                            $bill_to_name       = $purchaseRow['name'];
                            $bill_to_address    = $purchaseRow['address_1'];
                            $bill_to_address2   = $purchaseRow['address_1'];
                            $payment_method_id  = ($purchaseRow['payment_method_id'] != '') ? $purchaseRow['payment_method_id'] : '0';
                            $bill_to_city       = $purchaseRow['city'];
                            $bill_to_county     = $purchaseRow['county'];
                            $bill_to_post_code  = $purchaseRow['postcode'];
                            $billToSupplierCountry= ($purchaseRow['country_id'] != '') ? $purchaseRow['country_id'] : '0';
                            $bill_to_contact    = ($purchaseRow['primaryc_id'] != '') ? $purchaseRow['primaryc_id'] : '0';
                            
                            require_once(SERVER_PATH . "/classes/Supplier.php");
                            $objSup = new Supplier($this->arrUser);
                            $DefaultLocation = $objSup->getDefaultLocation($purchaseRow['id']);
                            
                            if(isset($DefaultLocation['id']) && $DefaultLocation['id'] > 0)
                            {
                                $alt_depo_id        = ($DefaultLocation['id'] != '') ? $DefaultLocation['id'] : '0';
                                $ship_to_name       = $DefaultLocation['depot'];
                                $ship_to_address    = $DefaultLocation['address'];
                                $ship_to_address2   = $DefaultLocation['address_2'];
                                $ship_to_city       = $DefaultLocation['city'];
                                $ship_to_county     = $DefaultLocation['county'];
                                $ship_to_post_code  = $DefaultLocation['postcode'];
                                $shipToSupplierLocCountry= ($DefaultLocation['country_id'] != '') ? $DefaultLocation['country_id'] : '0';
                                $ship_to_contact    = $DefaultLocation['ship_to_contact_shiping'];
                                $ship_to_phone      = $DefaultLocation['booking_telephone'];
                                $ship_to_email      = $DefaultLocation['ship_to_email'];
                                $ship_to_contact_shiping= $DefaultLocation['direct_line'];
                            }
                            else
                            {
                                $alt_depo_id        = '0';
                                $ship_to_name       = '';
                                $ship_to_address    = '';
                                $ship_to_address2   = '';
                                $ship_to_city       = '';
                                $ship_to_county     = '';
                                $ship_to_post_code  = '';
                                $shipToSupplierLocCountry= '0';
                                $ship_to_contact    = '';
                                $ship_to_phone      = '';
                                $ship_to_email      = '';
                                $ship_to_contact_shiping= '';
                            }
                            
                            $bill_to_contact_no = $purchaseRow['primaryc_name'];
                            $country            = ($purchaseRow['country_id'] != '') ? $purchaseRow['country_id'] : '0';
                            $srm_purchase_code  = $purchaseRow['purchase_code'];
                            $bill_phone         = $purchaseRow['phone'];
                            $bill_fax           = $purchaseRow['bill_fax'];
                            $bill_email         = $purchaseRow['email'];
                            $bill_to_posting_group_id= $purchaseRow['posting_group_id'];
                            $payable_number     = $purchaseRow['anumber'];
                            $purchase_number    = $purchaseRow['pnumber'];

                            // $UUID .= "'$po_type','$order_code','$account_payable_id','$purchase_code_id','$sell_to_contact_no','$sell_to_cust_id','$sell_to_contact_id','$sell_to_cust_name','$sell_to_address','$sell_to_address2','$sell_to_city','$sell_to_county','$sell_to_contact','$sale_person_id','$sale_person','$cust_phone','$cust_fax','$cust_email','$currency_id','$converted_currency_id','$converted_currency_code','$sell_to_post_code','$bill_to_cust_id','$bill_to_cust_no','$bill_to_contact_id','$payable_bank','$payment_terms_code','$bill_to_name','$bill_to_address','$bill_to_address2','$payment_method_id','$bill_to_city','$bill_to_county','$bill_to_post_code','$billToSupplierCountry','$bill_to_contact','$alt_depo_id','$ship_to_name','$ship_to_address','$ship_to_address2','$ship_to_city','$ship_to_county','$ship_to_post_code','$shipToSupplierLocCountry','$ship_to_phone','$ship_to_email','$bill_to_contact_no','$ship_to_contact_shiping','$country','$srm_purchase_code','$bill_phone','$bill_fax','$bill_email','$bill_to_posting_group_id','$payable_number','$purchase_number',";
                            $UUID .= "'".$transaction_id."','".$po_type."','".$order_code."','".$account_payable_id."','".$purchase_code_id."','".addslashes($sell_to_contact_no)."','".$sell_to_cust_id."','".$sell_to_contact_id."','".addslashes($sell_to_cust_name)."','".addslashes($sell_to_address)."','".addslashes($sell_to_address2)."','".$sell_to_city."','".$sell_to_county."','".addslashes($sell_to_contact)."','".$sale_person_id."','".$sale_person."','".$cust_phone."','".$cust_fax."','".$cust_email."','".$currency_id."','".$converted_currency_id."','".$converted_currency_code."','".$sell_to_post_code."','".$bill_to_cust_id."','".$bill_to_cust_no."','".$bill_to_contact_id."','".$payable_bank."','".$payment_terms_code."','".addslashes($bill_to_name)."','".addslashes($bill_to_address)."','".addslashes($bill_to_address2)."','".$payment_method_id."','".$bill_to_city."','".$bill_to_county."','".$bill_to_post_code."','".$billToSupplierCountry."','".$bill_to_contact."','".$alt_depo_id."','".addslashes($ship_to_name)."','".addslashes($ship_to_address)."','".addslashes($ship_to_address2)."','".$ship_to_city."','".$ship_to_county."','".$ship_to_post_code."','".$shipToSupplierLocCountry."','".$ship_to_phone."','".$ship_to_email."','".$bill_to_contact_no."','".$ship_to_contact_shiping."','".$country."','".$srm_purchase_code."','".$bill_phone."','".$bill_fax."','".$bill_email."','".$bill_to_posting_group_id."','".$payable_number."','".$purchase_number."',";
                            // echo $UUID;exit;
                        }
                                        
                    }

                    if($migrationName == 'Item-Unit-of-Measure')
                    {
                        $sqluom= "SELECT p.id as pid,p.product_code,p.description,p.unit_id 
                                        FROM product as p
                                        WHERE old_code='" . $migrationSheet[$rowIndex][0]. "' AND company_id=".$this->arrUser['company_id']."  LIMIT 1";
                        // echo $sqluom;exit;
                        $RSUom = $this->objsetup->CSI($sqluom);
                        $uomMig = $RSUom->RecordCount();
                        if ($uomMig > 0) {

                            $RowUOM = $RSUom->FetchRow();

                            $pid = $RowUOM["pid"];
                            $ItemUnit_id = $RowUOM["unit_id"];
                            $ref_quantity = 1;
                            
                        $sqlqty= "SELECT up.quantity as quantity 
                                        FROM units_of_measure_setup as up
                                        WHERE up.product_id='" . $pid. "' AND up.cat_id='" . $migrationSheet[$rowIndex][3]. "' AND up.company_id=".$this->arrUser['company_id']."  LIMIT 1";
                        // echo $sqlqty;exit;
                         $RSQt = $this->objsetup->CSI($sqlqty);
                        $uomQty = $RSQt->RecordCount(); 
                        if ($uomQty > 0) {
                             $RowQ = $RSQt->FetchRow();
                            $ref_quantity = $RowQ["quantity"];
                        }else{
                            $ref_quantity = 1;
                        }

                        $new_ref_quantity = $migrationSheet[$rowIndex][2]*$ref_quantity;

                        $UUID .= "'".$pid."','".$ItemUnit_id."','".$new_ref_quantity."','".$migrationSheet[$rowIndex][1]."',1,";
                            // PRINT_R($migrationSheet[$rowIndex]);exit;
                        }
                        else{
                            $UUID .= "'0','0','1','".$migrationSheet[$rowIndex][1]."',1,";
                            //product_id,unit_id,ref_quantity,cat_id,check_id,
                        }

                        $DimensionType = $migrationSheet[$rowIndex][5];
                        $pi = 3.141592653589;

                        if($DimensionType==1){ 
                            $volume = Round(($migrationSheet[$rowIndex][6] * $migrationSheet[$rowIndex][7] * $migrationSheet[$rowIndex][8]),2);
                            $Dimension1 = 1;
                            $Dimension2 = 2;
                            $Dimension3 = 4;
                        }
                        elseif($DimensionType==2){ 
                            $r = Round(($migrationSheet[$rowIndex][6] /2),2);
                            $h = Round($migrationSheet[$rowIndex][7],2);
                            $volume = Round(($pi * $h * pow($r,2)),2);

                            $Dimension1 = 2;
                            $Dimension2 = 1;
                            $Dimension3 = 0;
                        }
                        elseif($DimensionType==3){ 
                            $r = Round(($migrationSheet[$rowIndex][6] /2),2);
                            $volume = Round( ( (4/3)*$pi * pow($r,3)),2);
                            $Dimension1 = 2;
                            $Dimension2 = 0;
                            $Dimension3 = 0;
                        }else{
                            $volume = 0;
                            $Dimension1 = 1;
                            $Dimension2 = 2;
                            $Dimension3 = 4;
                        }

                        $migrationSheet[$rowIndex][6] = ($migrationSheet[$rowIndex][6]) ? Round($migrationSheet[$rowIndex][6],2) : 0;
                        $Dimension1_unit = 2;
                        $migrationSheet[$rowIndex][7] = ($migrationSheet[$rowIndex][7]) ? Round($migrationSheet[$rowIndex][7],2) : 0;
                        $Dimension2_unit = 2;
                        $migrationSheet[$rowIndex][8] = ($migrationSheet[$rowIndex][8]) ? Round($migrationSheet[$rowIndex][8],2) : 0;
                        $Dimension3_unit = 2;
                        $volume_unit = 2;
                        $weightUnit = 2;
                        
                        $UUID .= "'".$Dimension1_unit."','".$Dimension2_unit."','".$Dimension3_unit."','".$volume."','".$volume_unit."','".$weightUnit."','".$Dimension1."','".$Dimension2."','".$Dimension3."',";                 
                    }

                    if($migrationName == 'Opening-Balances-Customer')
                    {
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


                        $sqluom= "SELECT c.customer_code,c.name,f.posting_group_id,c.currency_id,
                                        (select currency_id from company where id= ".$this->arrUser['company_id'].") as baseCurrencyID
                                        FROM crm c
                                        LEFT JOIN finance f on c.id=f.customer_id
                                        WHERE c.id='" . $migrationSheet[$rowIndex][0]. "' AND c.company_id=".$this->arrUser['company_id']."  LIMIT 1";
                        //echo $sqluom;exit;
                        $RSOPC = $this->objsetup->CSI($sqluom);
                        $RowOPC = $RSOPC->FetchRow();
                        $customer_code = $RowOPC["customer_code"];
                        $name = $RowOPC["name"];
                        $posting_group_id = $RowOPC["posting_group_id"];
                        $currency_id = $RowOPC["currency_id"];
                        $baseCurrencyID = $RowOPC["baseCurrencyID"];
                        $convRate = $migrationSheet[$rowIndex][5];
                        $amount = $migrationSheet[$rowIndex][4];
                        $docType = $migrationSheet[$rowIndex][1];
                        $posting_date = $migrationSheet[$rowIndex][6];
                        $debitAmount = ($docType==1) ? $amount : 0;
                        $creditAmount = ($docType==2) ? $amount : 0;

                        foreach ($postingAccounts as $postgrp) {

                            if ($postgrp['postingGroup'] == $posting_group_id) {
                                $account_id = $postgrp['salesAccountDebators'];
                                $account_no = $postgrp['accountCode'];
                                $account_name = $postgrp['name'];
                            }
                        }

                        if($baseCurrencyID != $currency_id && $convRate==''){
                            $response['ack'] = 0;
                            $response['error'] = 'Customer ' . $name . '(' . $customer_code . ') Currency Conversion Rate is empty!';
                            return $response;
                        }

                        if (!($posting_group_id > 0)) {
                            $response['ack'] = 0;
                            $response['error'] = 'Customer ' .$name . '(' . $customer_code . ') Posting Group is not Selected!';
                            return $response;
                        }

                        if ($convRate < 0) {
                            $response['ack'] = 0;
                            $response['error'] = 'Customer ' .$name . '(' . $customer_code. ') Currency Conversion Rate Can\'t be negative!';
                            return $response;
                        }
                        
                        $converted_price = ($debitAmount!=0 && $creditAmount==0) ? $debitAmount /$convRate : $creditAmount /$convRate ; 
                        $posting_dateUnConv = "";            
                        if($posting_date > 0){
                            $posting_dateUnConv = date("Y-m-d", $posting_date);    
                        } 

                        $transaction_id = "SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 2)";

                        // set value column as string
                        $migrationSheet[$rowIndex][4] = '#value#'; 

                        $UUID .= "'".$customer_code."','".$name."','".$account_id."','".$account_no."','".$account_name."','".$posting_group_id."','".$debitAmount."','".$creditAmount."','".$converted_price."','".$currency_id."', '".$baseCurrencyID."','".$posting_dateUnConv."',1,current_date,".$transaction_id.",";
                    }

                    if($migrationName == 'Opening-Balances-Supplier')
                    {
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


                        $sqluom= "SELECT s.supplier_code,s.name,f.posting_group_id,s.currency_id,
                                        (select currency_id from company where id= ".$this->arrUser['company_id'].") as baseCurrencyID
                                        FROM srm s
                                        LEFT JOIN srm_finance f on s.id=f.supplier_id
                                        WHERE s.id='" . $migrationSheet[$rowIndex][0]. "' AND s.company_id=".$this->arrUser['company_id']."  LIMIT 1";
                        //echo $sqluom;exit;
                        $RSOPC = $this->objsetup->CSI($sqluom);
                        $RowOPC = $RSOPC->FetchRow();
                        $supplier_code = $RowOPC["supplier_code"];
                        $name = $RowOPC["name"];
                        $posting_group_id = $RowOPC["posting_group_id"];
                        $currency_id = $RowOPC["currency_id"];
                        $baseCurrencyID = $RowOPC["baseCurrencyID"];
                        $convRate = $migrationSheet[$rowIndex][5];
                        $amount = $migrationSheet[$rowIndex][4];
                        $docType = $migrationSheet[$rowIndex][1];
                        $posting_date = $migrationSheet[$rowIndex][6];
                        $debitAmount = ($docType==1) ? $amount : 0;
                        $creditAmount = ($docType==2) ? $amount : 0;

                        foreach ($postingAccounts as $postgrp) {

                            if ($postgrp['postingGroup'] == $posting_group_id) {
                                $account_id = $postgrp['salesAccountDebators'];
                                $account_no = $postgrp['accountCode'];
                                $account_name = $postgrp['name'];
                            }
                        }

                        if($baseCurrencyID != $currency_id && $convRate==''){
                            $response['ack'] = 0;
                            $response['error'] = 'Supplier ' . $name . '(' . $supplier_code . ') Currency Conversion Rate is empty!';
                            return $response;
                        }

                        if (!($posting_group_id > 0)) {
                            $response['ack'] = 0;
                            $response['error'] = 'Supplier ' .$name . '(' . $supplier_code . ') Posting Group is not Selected!';
                            return $response;
                        }

                        if ($convRate < 0) {
                            $response['ack'] = 0;
                            $response['error'] = 'Supplier ' .$name . '(' . $supplier_code. ') Currency Conversion Rate Can\'t be negative!';
                            return $response;
                        }
                        
                        $converted_price = ($debitAmount!=0 && $creditAmount==0) ? $debitAmount /$convRate : $creditAmount /$convRate ; 
                        $posting_dateUnConv = "";            
                        if($posting_date > 0){
                            $posting_dateUnConv = date("Y-m-d", $posting_date);    
                        } 

                        $transaction_id = "SR_GetNextTransactionID(" . $this->arrUser['company_id'] . ", 2)";

                        // set value column as string
                        $migrationSheet[$rowIndex][4] = '#value#';

                        $UUID .= "'".$supplier_code."','".$name."','".$account_id."','".$account_no."','".$account_name."','".$posting_group_id."','".$debitAmount."','".$creditAmount."','".$converted_price."','".$currency_id."','".$baseCurrencyID."','".$posting_dateUnConv."',2,current_date,".$transaction_id.",";
                    }

                    if($migrationName == 'Item-Warehouse')
                    {
                        $item_id = $migrationSheet[$rowIndex][0];
                        $warehouse_id = $migrationSheet[$rowIndex][1];
                        $location =  $migrationSheet[$rowIndex][2];

                        $sqluom= "SELECT cat_id
                        FROM units_of_measure_setup
                        WHERE product_id='" . $item_id. "' AND company_id=".$this->arrUser['company_id']."";
                        //echo $sqluom;exit;
                        $categories = [];
                        $RSa = $this->objsetup->CSI($sqluom);

                        if ($RSa->RecordCount() > 0) {
                            while ($Row = $RSa->FetchRow()) {
                                foreach ($Row as $key => $value) {
                                    if (is_numeric($key))
                                        unset($Row[$key]);
                                }
                                $categories[] = $Row['cat_id'];
                            }
                        }
                        $cat_ids =  implode($categories,',');
                        $sqlwbl= "SELECT *
                        FROM warehouse_bin_location
                        WHERE warehouse_id='" . $warehouse_id. "' 
                        AND dimensions_id IN (" . $cat_ids. ")
                        AND title='" . $location. "' 
                        AND company_id=".$this->arrUser['company_id']."";
                        //echo $sqlwbl;exit;

                        $RSwbl = $this->objsetup->CSI($sqlwbl);
                        if ($RSwbl->RecordCount() > 0) {
                            $Rowl = $RSwbl->FetchRow();
                            $warehouse_loc_id = $Rowl['id'];
                            $cost = $Rowl['bin_cost'];
                            $cost_type_id = $Rowl['cost_type_id'];
                            $dimensions_id = $Rowl['dimensions_id'];
                            $currency_id = $Rowl['currency_id'];
                            $warehouse_loc_sdate = $Rowl['warehouse_loc_sdate'];
                            $warehouse_loc_edate = ($Rowl['warehouse_loc_edate']) ? $Rowl['warehouse_loc_edate'] : 'NULL';

                            $UUID .= "'".$warehouse_loc_id."','".$cost."','".$cost_type_id."','".$dimensions_id."','".$currency_id."','".$warehouse_loc_sdate."','".$warehouse_loc_edate."',";
                        }else{
                            $response['ack'] = 0;
                            $response['error'] = 'Location (' . $location. ') does not exist!';
                            return $response;
                        }
                        //print_r($categories);exit;
                        //$sqlFields .= 'description,cost,cost_type_id,uom_id,currency_id,warehouse_loc_sdate,warehouse_loc_edate,';  
                    }

                    if($migrationName == 'Supplier-Finance')
                    {
                        $sqluom= "SELECT name as bank_name
                                        FROM bank_account 
                                        WHERE id='" . $migrationSheet[$rowIndex][11]. "' AND company_id=".$this->arrUser['company_id']."  LIMIT 1";
                        // echo $sqluom;exit;
                        $RSUom = $this->objsetup->CSI($sqluom);
                        $uomMig = $RSUom->RecordCount();
                        if ($uomMig > 0) {

                            $RowUOM = $RSUom->FetchRow();

                            $bank_name = $RowUOM["bank_name"];

                        $UUID .= "'".$bank_name."',";
                            // PRINT_R($migrationSheet[$rowIndex]);exit;
                        }
                        else{
                            $UUID .= "'',";
                            //product_id,unit_id,ref_quantity,cat_id,check_id,
                        }

                        // $UUID .= 'product_id,record_id,ref_quantity,cat_id';                        
                    }
                   // echo $UUID;exit;

                    if($saleOrderFlag == true){
                        
                        // $salesOrderSql = "SELECT * FROM orders WHERE company_id='" . $this->arrUser['company_id'] . "';";

                        // $salesOrderSql = "SELECT * FROM sr_crm WHERE (prev_code='".$migrationSheet[$rowIndex][1]."' OR customer_code='".$migrationSheet[$rowIndex][1]."') AND company_id=".$this->arrUser['company_id'].";";     
                        
                        /* $salesOrderSql = "SELECT  c.*, 
                                            `ad`.`id`           AS clid,
                                            `ad`.`depot`        AS cldepot,
                                            `ad`.`address`      AS claddress,
                                            `ad`.`address_2`    AS claddress_2,
                                            `ad`.`city`         AS clcity,
                                            `ad`.`county`       AS clcounty,
                                            `ad`.`postcode`     AS clpostcode,
                                            `cl`.`contact_name` AS `clcontact_name`,
                                            `cl`.`direct_line`  AS `cldirect_line`,
                                            `cl`.`job_title`    AS `cljob_title`,
                                            `cl`.`mobile`       AS `clmobile`,
                                            `cl`.`email`        AS `clemail`,
                                            `cl`.`phone`        AS `clphone`,
                                            `cl`.`fax`          AS `clfax`,
                                            crm_sp.salesperson_id AS sale_person_id,
                                            CONCAT(emp.first_name,' ',emp.last_name) as empname
                                        FROM sr_crm_general_sel  c
                                        LEFT JOIN alt_depot ad 
                                            ON `ad`.`acc_id`=`c`.`id` AND `ad`.`is_default`=1
                                        LEFT JOIN crm_salesperson as crm_sp on crm_sp.module_id = c.id AND crm_sp.type =2  AND (crm_sp.end_date IS NULL || crm_sp.end_date=0) and crm_sp.is_primary=1
                                        LEFT JOIN employees as emp on emp.id= crm_sp.salesperson_id
                                        LEFT JOIN `alt_contact` `cl`
                                            ON `cl`.`id` = `ad`.`alt_contact_id`
                                        WHERE 
                                            c.type IN (2,3) AND c.customer_code IS NOT NULL AND  c.name !='' AND
                                            c.posting_group_id > 0 AND
                                                (c.company_id=" . $this->arrUser['company_id'] . ") and (c.prev_code='$prev_code' OR c.customer_code='$prev_code') LIMIT 1"; */         
                        
                        $salesOrderSql = "SELECT  c.*, 
                                            `ad`.`id`           AS clid,
                                            `ad`.`depot`        AS cldepot,
                                            `ad`.`address`      AS claddress,
                                            `ad`.`address_2`    AS claddress_2,
                                            `ad`.`city`         AS clcity,
                                            `ad`.`county`       AS clcounty,
                                            `ad`.`postcode`     AS clpostcode,
                                            `cl`.`contact_name` AS `clcontact_name`,
                                            `cl`.`direct_line`  AS `cldirect_line`,
                                            `cl`.`job_title`    AS `cljob_title`,
                                            `cl`.`mobile`       AS `clmobile`,
                                            `cl`.`email`        AS `clemail`,
                                            `cl`.`phone`        AS `clphone`,
                                            `cl`.`fax`          AS `clfax`,
                                            crm_sp.salesperson_id AS sale_person_id,
                                            CONCAT(emp.first_name,' ',emp.last_name) as empname,
                                            `financial_settings`.`finchargetype`    AS `finchargetype`,
                                            `financial_settings`.`fincharges`       AS `fincharges`,
                                            `financial_settings`.`inschargetype`    AS `inschargetype`,
                                            `financial_settings`.`inscharges`       AS `inscharges`,
                                            `finance`.`posting_group_id`            AS `posting_group_id`,
                                            `finance`.`contact_person`              AS `fcontact_person`,
                                            `finance`.`phone`                       AS `fphone`,
                                            `finance`.`email`                       AS `femail`,
                                            `finance`.`bank_account_id`             AS `bank_account_id`,
                                            `finance`.`payment_terms_id`            AS `payment_terms_id`,
                                            `bank_account`.`name`                   AS `fbank_name`
                                        FROM sr_crm  c
                                        LEFT JOIN alt_depot ad 
                                            ON `ad`.`acc_id`=`c`.`id` AND `ad`.`is_default`=1
                                        LEFT JOIN crm_salesperson as crm_sp on crm_sp.module_id = c.id AND crm_sp.type =2  AND (crm_sp.end_date IS NULL || crm_sp.end_date=0) and crm_sp.is_primary=1
                                        LEFT JOIN employees as emp on emp.id= crm_sp.salesperson_id
                                        LEFT JOIN `alt_contact` `cl` ON `cl`.`id` = `ad`.`alt_contact_id`
                                        LEFT JOIN `financial_settings` ON (`financial_settings`.`company_id` = `c`.`company_id`)
                                        LEFT JOIN `finance` ON ((`finance`.`customer_id` = `c`.`id`) AND (`c`.`type` = 2 OR `c`.`type` = 3))
                                        LEFT JOIN `bank_account` ON((`bank_account`.`id` = `finance`.`bank_account_id`))
                                        WHERE 
                                            c.type IN (2,3) AND c.customer_code IS NOT NULL AND  c.name !='' AND
                                            finance.posting_group_id > 0 AND
                                                (c.company_id=" . $this->arrUser['company_id'] . ") and (c.prev_code='$prev_code' OR c.customer_code='$prev_code') LIMIT 1"; 
                        
                        // echo $salesOrderSql;exit;
                        $RSalesOrder = $this->objsetup->CSI($salesOrderSql);
                        if ($RSalesOrder->RecordCount() > 0) {
                            $SalesRow = $RSalesOrder->FetchRow();
                            foreach ($SalesRow as $key => $value) {
                                if (is_numeric($key)) unset($SalesRow[$key]);
                            }
                            // print_r($SalesRow);exit;
                            $order_code_Sql = "SELECT SR_GetNextSeq('orders','" . $this->arrUser['company_id'] . "','0' ,'0') ";
                            $code = $this->objsetup->CSI($order_code_Sql);
    
                            $SR_GetNextseqcode = $code->fields[0];

                            $transactionSQL = "SELECT SR_GetNextTransactionID(".$this->arrUser['company_id'].", 2)";
                            $transactionSQLRS = $this->objsetup->CSI($transactionSQL);
                            $transactionRow = $transactionSQLRS->FetchRow();
                            
                            $transaction_id = $transactionRow[0];
                            $sell_to_cust_id = $SalesRow['id'];
                            $sell_to_contact_no = $SalesRow['primaryc_name'];
                            $sell_to_cust_name = $SalesRow['name'];
                            $sell_to_address = $SalesRow['primary_address_1'];
                            $sell_to_address2 = $SalesRow['primary_address_2'];
                            $sell_to_city = $SalesRow['primary_city'];
                            $sell_to_county = $SalesRow['primary_county'];
                            $sell_to_post_code = $SalesRow['primary_postcode'];
                            $sell_to_contact_id = ($SalesRow['primaryc_id'] != '') ? $SalesRow['primaryc_id'] : 0;
                            $sell_to_contact = $SalesRow['primaryc_name'];
                            $sale_person_id = ($SalesRow['sale_person_id'] != '') ? $SalesRow['sale_person_id'] : 0;
                            $sale_person = $SalesRow['empname'];
                            $cust_phone = $SalesRow['primaryc_phone'];
                            $cust_fax = $SalesRow['primaryc_fax'];
                            $cust_email = $SalesRow['primaryc_email'];
                            $bill_to_cust_id = ($SalesRow['id'] != '') ? $SalesRow ['id'] : 0;
                            $finance_customer_id = $SalesRow['id'];
                            $bill_to_cust_no = $SalesRow['customer_code'];
                            $bill_to_name = $SalesRow['name'];
                            $bill_to_address = $SalesRow['primary_address_1'];
                            $bill_to_address2 = $SalesRow['primary_address_2'];
                            $bill_to_city = $SalesRow['primary_city'];
                            $bill_to_county = $SalesRow['primary_county'];
                            $bill_to_post_code = $SalesRow['primary_postcode'];
                            $bill_to_country_id = ($SalesRow['country_id'] != '') ? $SalesRow ['country_id'] : 0;
                            $country_id = ($SalesRow['country_id'] != '') ? $SalesRow ['country_id'] : 0;
                            $bill_to_contact = $SalesRow['fcontact_person'];
                            $bill_to_contact_id = ($SalesRow['primaryc_id'] != '') ? $SalesRow['primaryc_id'] : 0;
                            $bill_to_contact_phone = $SalesRow['fphone'];
                            $bill_to_contact_email = $SalesRow['femail'];
                            $bill_to_bank_id = ($SalesRow['bank_account_id'] != '') ? $SalesRow ['bank_account_id'] : 0;
                            $bill_to_bank_name = $SalesRow['fbank_name'];
                            $bill_to_finance_charges = ($SalesRow['fincharges'] != '') ? $SalesRow ['fincharges'] : 0;
                            $bill_to_finance_charges_type = ($SalesRow['finchargetype'] != '') ? $SalesRow ['finchargetype'] : 0;
                            $bill_to_insurance_charges = ($SalesRow['inscharges'] != '') ? $SalesRow ['inscharges'] : 0;
                            $bill_to_insurance_charges_type = ($SalesRow['inschargetype'] != '') ? $SalesRow ['inschargetype'] : 0;
                            $currency_id = ($SalesRow['currency_id'] != '') ? $SalesRow ['currency_id'] : 0;
                            $bill_to_posting_group_id = ($SalesRow['posting_group_id'] != '') ? $SalesRow ['posting_group_id'] : 0;
                            $bill_to_posting_group_name = ($SalesRow['posting_group_id'] != '') ? $SalesRow ['posting_group_id'] : 0;
                            $ship_to_name = $SalesRow['cldepot'];
                            $ship_to_address = $SalesRow['claddress'];
                            $ship_to_address2 = $SalesRow['claddress_2'];
                            $ship_to_city = $SalesRow['clcity'];
                            $ship_to_county = $SalesRow['clcounty'];
                            $ship_to_post_code = $SalesRow['clpostcode'];
                            $ship_to_contact_id = ($SalesRow['clid']) ? $SalesRow['clid'] : 0;
                            $ship_to_contact = $SalesRow['clcontact_name'];
                            $book_in_tel = $SalesRow['clphone'];
                            $comm_book_in_contact = $SalesRow['cldirect_line'];
                            $book_in_email = $SalesRow['clemail'];
                            $alt_depo_id = ($SalesRow['clid']) ? $SalesRow['clid'] : 0; 
                            $payment_discount = ($SalesRow['payment_terms_id'] != '') ? $SalesRow ['payment_terms_id'] : 0;
                            $payment_method_id = ($SalesRow['posting_group_id'] != '') ? $SalesRow ['posting_group_id'] : 0;

                            $UUID .= "'".$transaction_id."','".$SR_GetNextseqcode."', 1, '".$sell_to_cust_id."','".addslashes($sell_to_contact_no)."','".addslashes($sell_to_cust_name)."','".addslashes($sell_to_address)."','".addslashes($sell_to_address2)."','".$sell_to_city."','".$sell_to_county."','" .$sell_to_post_code."','".$sell_to_contact_id."','".addslashes($sell_to_contact)."','".$sale_person_id."','".$sale_person."','".$cust_phone."','".$cust_fax."','".$cust_email."','".$bill_to_cust_id."','".$finance_customer_id."','" .$bill_to_cust_no."','".addslashes($bill_to_name)."','".addslashes($bill_to_address)."','".addslashes($bill_to_address2)."','".$bill_to_city."','".$bill_to_county."','".$bill_to_post_code."','".$bill_to_country_id."','".$country_id."','" .$bill_to_contact."','".$bill_to_contact_id."','".$bill_to_contact_phone."','".$bill_to_contact_email."','".$bill_to_bank_id."','".addslashes($bill_to_bank_name)."','".$bill_to_finance_charges."','" .$bill_to_finance_charges_type."','".$bill_to_insurance_charges."','".$bill_to_insurance_charges_type."','".$currency_id."','".$bill_to_posting_group_id."','".addslashes($bill_to_posting_group_name)."','" .addslashes($ship_to_name)."','".addslashes($ship_to_address)."','".addslashes($ship_to_address2)."','".$ship_to_city."','".$ship_to_county."','".$ship_to_post_code."','".$ship_to_contact_id."','".$ship_to_contact."','" .$book_in_tel."','".$comm_book_in_contact."','".$book_in_email."','".$alt_depo_id."','".$payment_discount."','".$payment_method_id."',";
                            // echo $UUID;exit;
                        }
                        else
                        {
                            $errorLogFile = $errorLog;
                            // $path = WEB_PATH . '/download/Error_Log.txt';
                            
                            $webPath = WEB_PATH.'/app/views/migrationErrorLog/'.$migrationName.$this->arrUser['company_id'].'.txt';
                            
                            file_put_contents($webPath, $errorLogFile. PHP_EOL);
                            $response['ack'] = 0;
                            $response['error'] = 'No customer found with previous code '.$prev_code;
                            $response['link'] = $path;
                            $response['errorLogFile'] = $errorLogFile;
                            return $response;
                            exit;
                        }
                    }


                    if($stockMigration>0){

                        $sqlStock2 = "SELECT p.id as pid,p.product_code,p.description,p.unit_id , uom.title AS uom_name 
                                FROM product as p
                                LEFT JOIN units_of_measure uom ON uom.id = p.unit_id
                                WHERE p.id=" . $migrationSheet[$rowIndex][0]. " LIMIT 1";
                        // echo $sqlStock2;exit;
                        $RSTOCK2 = $this->objsetup->CSI($sqlStock2);

                        $additionalQueryFields = '';
                        $additionalQueryFieldsValues = '';
                        $stockMigration2 = $RSTOCK2->RecordCount(); 

                        if ($stockMigration2 > 0) {

                            $RowStock2 = $RSTOCK2->FetchRow();
                            $ItemNo = $RowStock2["product_code"];
                            $ItemDescription = $RowStock2["description"];
                            $ItemUnit_id = $RowStock2["unit_id"];
                            $ItemUnitName = $RowStock2["uom_name"];

                            $UUID .= "'".$ItemNo."','".addslashes($ItemDescription)."','".$ItemUnit_id."','".addslashes($ItemUnitName)."',";
                        }                            
                    } 

                    if(strlen($glAccountsMigration) > 0 && $glAccountsMigration == 'gl_account'){
                        $UUID .= "'".$migrationSheet[$rowIndex][1]."',";                            
                    } 
                    $checkModuleType = 0; //default
                    if(strlen($module_type) > 0){

                        $code = '';                        
                        // check for module type
                        if(strlen($migrationSheet[$rowIndex][8]) > 0 && $module_type == 'product'){
                            $brandId = $migrationSheet[$rowIndex][8];                            
                            $checkModuleType =  $this->checkModuleType($module_type,$brandId);
                        }else{
                            $checkModuleType =  $this->checkModuleType($module_type);
                        }
                        // module type check end
                        
                        if(strlen($migrationSheet[$rowIndex][8]) > 0 && $module_type == 'product'){
                            $brandId = $migrationSheet[$rowIndex][8];
                            // for internal type
                            if($checkModuleType==0){

                                if($brandId>0){
                                    $MYSQL_FUNCTION_Sql = "SELECT SR_GetNextSeq('" . $module_type . "','" . $this->arrUser['company_id'] . "',$brandId,'0') ";
                                }
                                else{
                                    $MYSQL_FUNCTION_Sql = "SELECT SR_GetNextSeq('" . $module_type . "','" . $this->arrUser['company_id'] . "','0' ,'0') ";
                                }

                                $code = $this->objsetup->CSI($MYSQL_FUNCTION_Sql);
                                $SR_GetNextseqcode = $code->fields[0]; 
                                $migrationSheet[$rowIndex][$maxColumns-1] = '####';
                            }
                            else{
                                $SR_GetNextseqcode = $migrationSheet[$rowIndex][$maxColumns-1];
                                /*======= Error for empty external code */
                                if ($SR_GetNextseqcode == "") {
                                    $response['ack'] = 0;
                                    $response['error'] = "External code is empty for the Previous Code (".$migrationSheet[$rowIndex][0].")";
                                    return $response;
                                    exit;
                                }
                                // unset($migrationSheet[$rowIndex][$maxColumns-1]); 
                                 $migrationSheet[$rowIndex][$maxColumns-1] = '####';
                            }
                        }
                        else{
                            // for internal type
                            if($checkModuleType==0){

                                $MYSQL_FUNCTION_Sql = "SELECT SR_GetNextSeq('" . $module_type . "','" . $this->arrUser['company_id'] . "','0' ,'0') ";
                                $code = $this->objsetup->CSI($MYSQL_FUNCTION_Sql);
                                $SR_GetNextseqcode = $code->fields[0]; 
                                if($migrationSheet[0][$maxColumns-1]=='External Code'){
                                    $migrationSheet[$rowIndex][$maxColumns-1] = '####';
                                }
                            }
                            else{
                                $SR_GetNextseqcode = $migrationSheet[$rowIndex][$maxColumns-1];
                                /*======= Error for empty external code */
                                if ($SR_GetNextseqcode == "") {
                                    $response['ack'] = 0;
                                    $response['error'] = "External code is empty for the Previous Code (".$migrationSheet[$rowIndex][0].")";
                                    return $response;
                                    exit;
                                }
                                //unset($migrationSheet[$rowIndex][$maxColumns-1]); 
                                $migrationSheet[$rowIndex][$maxColumns-1] = '####';
                            }

                        }
                        // echo $MYSQL_FUNCTION_Sql;exit;

                        /*======= Query for MYSQL FUNCTION end */
                        if ($SR_GetNextseqcode == "MaxReached" || $SR_GetNextseqcode == "NoValueSet") {
                            $message='';
                            if($SR_GetNextseqcode == "MaxReached"){
                                $message = "Code sequence range is reached to max value.";
                            }elseif($SR_GetNextseqcode == "NoValueSet"){
                                $message = "Module type value is not set.";
                            }
                            $response['ack'] = 0;
                            $response['error'] = $message;//$SR_GetNextseqcode;
                            return $response;
                            exit;
                        }
                        /*================= end =================*/

                        if(!strlen($module_field) > 0){
                            $response['ack'] = 0;
                            $response['error'] = 'Module Field for generated code is empty!';
                            return $response;
                            exit;
                        }

                        if(strlen($module_field) > 0){
                            $code = "'".$SR_GetNextseqcode."',";
                        }
                }

                   // echo $UUID;exit;
                    if(strlen($templateSheet[9][0]) > 0 && $templateSheet[9][0] == "Excl-Default-Fields"){
                       $UUID .= $templateSheet[8][2].",";
                    }

                   if($migrationName == 'BrandCategory'){
                        $sqlValues = $UUID . $type . $code . $this->arrUser['company_id'] . ','. $this->arrUser['id'] . ', UNIX_TIMESTAMP(NOW()), ' . $this->arrUser['id'] . ', ';
                        //echo $sqlValues;exit;
                    }
                    elseif($migrationName == 'Item-Purchase-Cost'){
                        $sqlValues = $UUID . $type . $code . $this->arrUser['company_id'] . ','. $this->arrUser['id'] . ', UNIX_TIMESTAMP(NOW()), ' . $this->arrUser['id'] . ', ';
                    }
                    elseif($migrationName == 'Item-Sales-Price'){
                        $sqlValues = $UUID . $type . $code . $this->arrUser['company_id'] . ','. $this->arrUser['id'] . ', UNIX_TIMESTAMP(NOW()), ' . $this->arrUser['id'] . ', ';
                    }
                    elseif($migrationName == 'Item-Marginal-Analysis'){
                        $sqlValues = $UUID . $type . $code . ' UNIX_TIMESTAMP(NOW()), ' . $this->arrUser['id'] . ', ';
                    }
                    else{
                        $sqlValues = $UUID . $type . $code . $this->arrUser['company_id'] . ','. $this->arrUser['id'] . ',1, UNIX_TIMESTAMP(NOW()), ' . $this->arrUser['id'] . ', ';
                    }
                    //echo $sqlValues;exit;
                    foreach ($sqlFieldIndexes as $index){
                        if(!($templateSheet[0][$index] == 'DefinedListVO') && !($templateSheet[2][$index] == 'wt_n_vol')){                              
                            $sqlValues .= "'" . $migrationSheet[$rowIndex][$index]. "',"; 
                        }                                                   
                    }
                    // echo $migrationSheet[0][$maxColumns-1];
                    // echo '<br>'. $sqlFields;
                    // echo '<br>'. $sqlValues;
                    if (strpos($sqlFields, 'extCode') !== false) {                        
                       $sqlFields = str_replace('extCode,','',$sqlFields);
                        $sqlValues = substr($sqlValues, 0, -8);
                    }elseif (strpos($sqlValues, '####') !== false && $migrationSheet[0][$maxColumns-1]=='External Code') {                     
                        $sqlValues = substr($sqlValues, 0, -8);
                    }else{
                        $sqlValues = substr($sqlValues, 0, -1);
                    }

                    if($migrationName == 'Opening-Balances-Customer' || $migrationName == 'Opening-Balances-Supplier'){
                        if (strpos($sqlFields, 'value') !== false) {                        
                            $sqlFields = str_replace('value,','',$sqlFields);
                            $sqlValues = str_replace("'#value#',",'',$sqlValues);
                            // $sqlValues = substr($sqlValues, 0, -8);
                         }elseif (strpos($sqlValues, '#value#') !== false) {                        
                            $sqlValues = str_replace("'#value#',",'',$sqlValues);
                            // $sqlValues = substr($sqlValues, 0, -8);
                         }
                    }

                    if($migrationName == 'Item'){
                        // echo '<pre>'; print_r($sqlValues);
                        //  echo 'here3'; print_r($sqlFields);exit;
                         
                        if (strpos($sqlFields, 'barcode') !== false) {                        
                            $sqlFields = str_replace('barcode,','',$sqlFields);
                            $sqlValues = str_replace("'#barcode#',",'',$sqlValues);
                            // $sqlValues = substr($sqlValues, 0, -8);
                         } elseif (strpos($sqlValues, '#barcode#') !== false) {                        
                            $sqlValues = str_replace("'#barcode#',",'',$sqlValues);
                            // $sqlValues = substr($sqlValues, 0, -8);
                         } 
                         

                         if (strpos($sqlFields, 'Weight_n_volume') !== false) {                        
                            $sqlFields = str_replace('Weight_n_volume,','',$sqlFields);
                            $sqlValues = str_replace("'#wt_n_vol#',",'',$sqlValues);
                            // $sqlValues = substr($sqlValues, 0, -8);
                         }elseif (strpos($sqlValues, '#wt_n_vol#') !== false) {                        
                            $sqlValues = str_replace("'#wt_n_vol#',",'',$sqlValues);
                            // $sqlValues = substr($sqlValues, 0, -8);
                         }
                    }
                    // echo '<br>'. $checkModuleType;
                     //echo '<br>'. $sqlValues; 
                    $sqlValues .= ", 1, '$input_file_name'";

                    $sqlQuery = "INSERT INTO ". $tableName . " " . $sqlFields . " SELECT ". $sqlValues. ";";//final sql
                    // echo $sqlQuery;
                    $sqlQuery = str_replace("'NULL'","NULL", $sqlQuery);
                    // echo '<br>'. $sqlQuery; exit;
                
                    try { //'success';
                        $RS = $this->objsetup->CSI($sqlQuery);

                            if (!$RS && $this->Conn->Affected_Rows() == 0){
                                $response['SqlErrorChk'] = 1;                  
                                $response['SqlError'] = $this->Conn->ErrorMsg(); 
                                $response['SQL'] = $sqlQuery;
                                $response['ack'] = 0;
                                $response['link'] = $path;
                                return $response;
                                exit; 
                            } 
                            $retRes++;
                        } //catch exception
                        catch (Exception $e) { //'error';
                            $errorLog['Query Failed'] = $e->getMessage();  
                            $response['SQL'] = $sqlQuery;                                                            
                            $errorLogFile = $errorLog;
                            $fileName = $migrationName.$this->arrUser['company_id'].$this->arrUser['user_id'];

                            // $path = WEB_PATH . '/download/\''.$fileName.'.txt';
                            $webPath = WEB_PATH.'/app/views/migrationErrorLog/'.$migrationName.$this->arrUser['company_id'].'.txt';                       
                            
                            file_put_contents($webPath, $errorLogFile. PHP_EOL);

                            $response['ack'] = 0;
                            $response['link'] = $path;
                            $response['errorLogFile'] = $errorLogFile;
                            return $response; 
                            exit;
                        } 


                    if($migrationName == 'Item')
                    {
                        $fields = explode(',', $sqlValues);
                        $productCode = $fields[1];
                        $productID = $this->Conn->Insert_ID();
                        if($wt_n_vol_arr){    
                            $DimensionType = $wt_n_vol_arr[$rowIndex]['DimensionType'];
                            $pi = 3.141592653589;

                            if($DimensionType==1){ 
                                $volume = Round(($wt_n_vol_arr[$rowIndex]['Dimension1_value'] * $wt_n_vol_arr[$rowIndex]['Dimension2_value'] * $wt_n_vol_arr[$rowIndex]['Dimension3_value']),2);

                                $Dimension1 = 1;
                                $Dimension2 = 2;
                                $Dimension3 = 4;
                            }
                            elseif($DimensionType==2){ 
                                $r = Round(($wt_n_vol_arr[$rowIndex]['Dimension1_value'] /2),2);
                                $h = Round($wt_n_vol_arr[$rowIndex]['Dimension2_value'],2);
                                $volume = Round(($pi * $h * pow($r,2)),2);

                                $Dimension1 = 2;
                                $Dimension2 = 1;
                                $Dimension3 = 0;
                            }
                            elseif($DimensionType==3){ 
                                $r = Round(($wt_n_vol_arr[$rowIndex]['Dimension1_value'] /2),2);
                                $volume = Round( ( (4/3)*$pi * pow($r,3)),2);
                                $Dimension1 = 2;
                                $Dimension2 = 0;
                                $Dimension3 = 0;
                            }else{
                                $volume = 0;
                                $Dimension1 = 1;
                                $Dimension2 = 2;
                                $Dimension3 = 4;
                            }
                    
                            $Dimension1_value = ($wt_n_vol_arr[$rowIndex]['Dimension1_value']) ? Round($wt_n_vol_arr[$rowIndex]['Dimension1_value'],2) : 0;
                            $Dimension1_unit = 2;
                            $Dimension2_value = ($wt_n_vol_arr[$rowIndex]['Dimension2_value']) ? Round($wt_n_vol_arr[$rowIndex]['Dimension2_value'],2) : 0;
                            $Dimension2_unit = 2;
                            $Dimension3_value = ($wt_n_vol_arr[$rowIndex]['Dimension3_value']) ? Round($wt_n_vol_arr[$rowIndex]['Dimension3_value'],2) : 0;
                            $Dimension3_unit = 2;
                            $volume_unit = 2;
                            $weightUnit = 2;
                            $netweight = ($wt_n_vol_arr[$rowIndex]['netweight']) ? Round($wt_n_vol_arr[$rowIndex]['netweight'],2) : 0;
                            $packagingWeight = ($wt_n_vol_arr[$rowIndex]['packagingWeight']) ? Round($wt_n_vol_arr[$rowIndex]['packagingWeight'],2) : 0;
                        }else{
                            $volume = 0;
                            $DimensionType = 1;
                            $Dimension1 = 1;
                            $Dimension1_value = 0;
                            $Dimension1_unit = 2;
                            $Dimension2 = 2;
                            $Dimension2_value = 0;
                            $Dimension2_unit = 2;
                            $Dimension3 = 4;
                            $Dimension3_value = 0;
                            $Dimension3_unit = 2;
                            $volume_unit = 2;
                            $weightUnit = 2;
                            $netweight = 0;
                            $packagingWeight = 0;

                        }

                        
                        $SqlInsert = " INSERT INTO units_of_measure_setup SET product_id = $productID, 
                                            product_code=".$productCode.", 
                                            unit_id=".$uom_arr[$rowIndex-1].", 
                                            record_id=".$uom_arr[$rowIndex-1].", 
                                            ref_unit_id=".$uom_arr[$rowIndex-1].", 
                                            barcode='".$barcode_arr[$rowIndex-1]."', 
                                            ref_quantity = 1, 
                                            check_id = 1,
                                            quantity = 1, 
                                            cat_id=".$uom_arr[$rowIndex-1].", 
                                            status = 1, 
                                            company_id = " .$this->arrUser['company_id'].",
                                            user_id = ". $this->arrUser['id'] .",
                                            date_added = UNIX_TIMESTAMP(NOW()),
                                            DimensionType=".$DimensionType.", 
                                            Dimension1=".$Dimension1.", 
                                            Dimension1_value=".$Dimension1_value.", 
                                            Dimension1_unit=".$Dimension1_unit.", 
                                            Dimension2=".$Dimension2.",
                                            Dimension2_value=".$Dimension2_value.", 
                                            Dimension2_unit=".$Dimension2_unit.", 
                                            Dimension3=".$Dimension3.", 
                                            Dimension3_value=".$Dimension3_value.", 
                                            Dimension3_unit=".$Dimension3_unit.",
                                            volume=".$volume.", 
                                            volume_unit=".$volume_unit.", 
                                            weightUnit=".$weightUnit.", 
                                            netweight=".$netweight.", 
                                            packagingWeight=".$packagingWeight."
                                            ";
                        // echo $SqlInsert;exit;
                        $RS = $this->objsetup->CSI($SqlInsert);
                        
                        $SqlUpdate = " UPDATE product SET unit_id = ".$uom_arr[$rowIndex-1]."
                                            where id = $productID";
                        $RS = $this->objsetup->CSI($SqlUpdate);
                    }
                    
                        $UUID='';
                    }

                if(strlen($glAccountsMigration) > 0 && $glAccountsMigration == 'gl_account'){
                    for ($rowIndex = 1; $rowIndex < $maxRows; $rowIndex++){  

                        //foreach ($sqlFieldIndexes as $index){
                            //} 
                        $childGlCode = $migrationSheet[$rowIndex][0]; 

                        if($childGlCode>0){
                            $sqlChild = "SELECT id 
                                         FROM gl_account 
                                         WHERE accountCode='" . $childGlCode. "' 
                                         AND company_id='" . $this->arrUser['company_id'] . "' 
                                         LIMIT 1";
                            // echo $sqlChild;exit;
                            $RSchild = $this->objsetup->CSI($sqlChild);

                            if ($RSchild->RecordCount() > 0) {
                                $RowChild = $RSchild->FetchRow();
                                $childGlId = $RowChild["id"];
                            }
                            else{
                                $childGlId = 0;
                            }
                        }
                        else{
                            $childGlId = 0;
                        }


                        $parentGlCode = $migrationSheet[$rowIndex][2]; 

                        if($parentGlCode>0){
                            $sqlParent = "SELECT id 
                                          FROM gl_account 
                                          WHERE accountCode='" . $parentGlCode. "' 
                                          AND company_id='" . $this->arrUser['company_id'] . "' 
                                          LIMIT 1";                                
                            // echo $sqlParent;exit;
                            $RSParent = $this->objsetup->CSI($sqlParent);

                            if ($RSParent->RecordCount() > 0) {
                                $RowParent = $RSParent->FetchRow();
                                $parentGlId = $RowParent["id"];
                            }
                            else{
                                $parentGlId = 0;
                            }
                        }
                        else{
                            $parentGlId = 0;
                        }

                        if($childGlId>0 && $parentGlId>0){                            

                            try { //'success';

                                $sqlQuery2 = "INSERT INTO gl_account_link 
                                                                SET
                                                                    parent_gl_account_id =" . $parentGlId . ",
                                                                    child_gl_account_id =" . $childGlId . ",
                                                                    company_id =" . $this->arrUser['company_id'] . ",
                                                                    AddedBy =" . $this->arrUser['id'] . ",
                                                                    AddedOn = UNIX_TIMESTAMP(NOW()),
                                                                    ChangedBy =" . $this->arrUser['id'] . ",
                                                                    ChangedOn =UNIX_TIMESTAMP(NOW()),
                                                                    LockedBy =" . $this->arrUser['id'] . ",
                                                                    LockedOn =UNIX_TIMESTAMP(NOW());";

                                $RS2 = $this->objsetup->CSI($sqlQuery2);
                                
                                if (!$RS2 && $this->Conn->Affected_Rows() == 0){
                                    // $path = WEB_PATH . '/download/Error_Log.txt';
                                    $errorLog['Query Failed'] = $this->Conn->ErrorMsg();
                                    $response['SQL'] = $sqlQuery;
                                    $errorLogFile = $errorLog;

                                    $webPath = WEB_PATH.'/app/views/migrationErrorLog/'.$migrationName.$this->arrUser['company_id'].'.txt';                       
                            
                                    file_put_contents($webPath, $errorLogFile. PHP_EOL);
                                    $response['ack'] = 0;
                                    $response['link'] = $path;
                                    $response['errorLogFile'] = $errorLogFile;
                                    return $response; 
                                    exit; 
                                } 
                            } //catch exception
                            catch (Exception $e) { //'error';
                                $errorLog['Query Failed'] = $e->getMessage();
                                $response['SQL'] = $sqlQuery;                                                         
                                $errorLogFile = $errorLog;
                                // $path = WEB_PATH . '/download/Error_Log.txt';
                                
                                $webPath = WEB_PATH.'/app/views/migrationErrorLog/'.$migrationName.$this->arrUser['company_id'].'.txt';                       
                            
                                file_put_contents($webPath, $errorLogFile. PHP_EOL);
                                $response['ack'] = 0;
                                $response['link'] = $path;
                                $response['errorLogFile'] = $errorLogFile;
                                return $response; 
                                exit;
                            }  
                        }                                                     
                    }                       
                }
                $response['ack'] = 1;
                $response['retRes'] = $retRes;
                $response['error'] = $retRes.' Record(s) uploaded successfully';
                $this->Conn->commitTrans();
                $this->Conn->autoCommit = true;
                $this->objsetup->SRTraceLogsPHP(LOG_LEVEL_2, __CLASS__, __FUNCTION__, SR_TRACE_PHP, 'Exit', __FUNCTION__,
                   'migrationName:'.$input['migrationName']);
            } else {
                // print_r($errorLog);exit;
                $errorLogFile = print_r($errorLog, true);
                // echo $errorLogFile;exit;
                $response['meta'] = $templateSheet;
                $response['data'] = $migrationSheet;
                $response['SQL'] = $sqlQuery;                    
                $response['ack'] = 0;
                $response['error'] = 'Record not inserted';
                $response['errorLogFile'] = $errorLog;
                // $webPath = WEB_PATH . '/download/migrationErrorLogs/'.$migrationName.$this->arrUser['company_id'].'.txt';
                $webPath = WEB_PATH.'/app/views/migrationErrorLog/'.$migrationName.$this->arrUser['company_id'].'.txt';
                $upload_file_path = $_SERVER['DOCUMENT_ROOT'].'/app/views/migrationErrorLog/'.$migrationName.$this->arrUser['company_id'].'.txt';
                
                $result_file = file_put_contents($upload_file_path, $errorLogFile. PHP_EOL);
                $response['link'] = $webPath;
            }
            return $response;   
        } else{
                $response['ack'] = 0;
                $response['error'] = 'Please upload a file first!';
                return $response;
        }
        

    }
}
?>
