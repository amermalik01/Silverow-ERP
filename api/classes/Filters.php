<?php
/**
* General Class for all modules fitlers and listings
*/

/*error_reporting(E_ALL);
ini_set('display_error', 1);*/
require_once(SERVER_PATH."/classes/Xtreme.php");
require_once(SERVER_PATH."/classes/General.php");

class Filters extends Xtreme
{

	private $Conn = null;
	private $objGeneral = null;
	private $arrUser = null;


	function __construct($user_info=array()){

		parent::__construct();
		$this->Conn = parent::GetConnection();
		$this->objGeneral = new General($user_info);

		$this->arrUser = $user_info;
		//echo "in constructor ----";exit;	
	}

	function get_module_listing($module_id, $module_table,$whr_col,$whr_val,$more_fields,$filter_id,$where,$order_by){

		$is_posted='';

		$record = $this->get_listing($module_table,$module_id,$whr_col,$whr_val,$more_fields,$filter_id,$where,$is_posted,$order_by);
		//echo "<pre>"; print_r($record); exit;
		$rs_record = $this->Conn->Execute('SELECT * FROM '.$module_table);
		$arr_record = $rs_record->GetArray();
		$total_record = count($arr_record);
		$data = array();
		$head = array(); 
		$filter_dict = array();
		//echo "<pre>"; print_r($arr_record); exit;
		foreach($record['table_headings'] as $row){
			$data['title'] = $row['title'];
			$field = str_replace('.','',$row['title']);
			$field = str_replace(' ','_',$field);
			$data['field'] = $field;
			$data['sortable'] = $field;
			$data['show'] = intval($row['is_visible']);
			//$data['filter'] = '{'.$field.':'."'text'".'}';
			$head[] = $data;
			$filter_dict[$field] = '';
		}
		$head[] = array('title' => 'Action','field' => 'Action','show'=>true);
		$arr_filters = $this->get_modules_filters(array('module_id'=>$module_id));
		$default_filter_id = '';
		$filters_dropdown = array();

		//echo '<pre>'; print_r($arr_filters[response]); exit;

		foreach($arr_filters[response] as $drp){

			$dropdown['value']= $drp['id'];
			$dropdown['label']= $drp['name'];
			$rsFiesld = $this->Conn->Execute("select fields FROM filter WHERE id=".$drp['id'])->FetchRow();
			$rsFiesld = $this->Conn->Execute('Select name FROM field WHERE id in( '.$rsFiesld['fields'].')');
			if($drp['is_default'] == 'Yes'){
				$default_filter_id = $drp['id'];
			}
			while($Field = $rsFiesld->FetchRow())
			{
				$dropdown['filtercolumns'][] = $Field;
			}
			$filters_dropdown['dropdown'][] = $dropdown;
		}
				
		//$filters_dropdown['default_filter_id'] = $this->getIndex($default_filter_id,$filters_dropdown['dropdown']);
		$filters_dropdown['default_filter_id'] = $default_filter_id;
		//echo "<pre>"; print_r(array('filters_dropdown'=>$filters_dropdown,'columns'=>$head,'filter_dict'=>$filter_dict,'filters'=>$record['column_id'], 'record'=>array('total'=>$record['num_rows'],'result'=>$record['results']))); exit;
		return  array('filters_dropdown'=>$filters_dropdown,'columns'=>$head,'filter_dict'=>$filter_dict,'filters'=>$record['column_id'], 'record'=>array('total'=>$record['num_rows'],'result'=>$record['results']));
		
 }

function getIndex($name, $array){
    foreach($array as $key => $value){
        if(is_array($value) && $value['value'] == $name)
              return $key;
    }
    return null;
}

 function get_listing($table_name,$module_id,$whr_col,$whr_val,$more_fields,$filter_id,$where,$is_posted,$order_by) {
	 return; // removing table filter_details from db as it is not being used
		//echo "here==w======>>>".$filter_id;exit;
		if(isset($filter_id) && !empty($filter_id) && $filter_id != 'null')
			$query1 = "SELECT * FROM filter WHERE module_codes_id = '".$module_id."' AND id = '".$filter_id."' ";
		else
			$query1 = "SELECT * FROM filter WHERE module_codes_id = '".$module_id."' AND is_default = 1 ";
			
			
		$filter =  $this->Conn->Execute($query1)->FetchRow();
					//echo "here==w======>>>";exit;

		//echo $query1; exit;
		//print "<br>this ====>>>>";
		$query2 = "SELECT field.*,filter_details.sequence, ref_module_code.prefix, ref_module_code.module_condition FROM filter_details LEFT OUTER JOIN field ON field.id=filter_details.field_id Left Outer join ref_module_code ON (ref_module_code.id = field.module_codes_id) WHERE filter_id = '".$filter['id']."' AND filter_details.status=1  ORDER BY sequence ASC";
		/*echo $query2;
		exit;*/
		$arr_filters = $this->Conn->Execute($query2);
		//echo "<pre>";print_r($arr_filters->FetchRow());echo "</pre>";exit;
		
		$str_column = '';
		$str_where = '';
		$strDropDownQuery = '';
		$strLimitOffset = '';
		$strModuleCondition = '';
		$table_headings = array();
		$arrColumnType = array();
		$arrDropDown = array();
		$column_id = array();
		$contants_array = array();
		$a = 0;

		//print '<br> form =====>>'.$str_from;exit;
					

		if ($arr_filters->RecordCount() > 0)
		{
			$key = 0;
			$counter = 0;
			while($arr_value = $arr_filters->FetchRow())
			{
					
				++$key;
				
				$alia = str_replace(' ','_',$arr_value['description']);
				$alia = str_replace('.','',$alia);
				$col = $alia;
				$table_headings[] = array('title' => $arr_value['description'],'is_visible'=>$arr_value['is_visible']);
				//$column_id[$key] = $table_name.".".$arr_value['name'];
				$column_id[$key] = $arr_value['name'];
				$arrColumnType[$key] = INPUT_BOX;
				
				if ($a == 0) 
				{
					$str_column .= "".$table_name.".id ,";
					$str_from = "`".$table_name."`";
					$a++;
				}
				
				//echo "<pre>"; print_r($arr_value); echo "</pre>";
				//print "ths =====>>>". $arr_value['is_nescessary'];exit;
				//if ( $arr_value['is_nescessary'] == '2') { print '<br> form =====>>'.$arr_value['table_name'];}	
				$strColumnn = '';
				//echo "<pre>";print_r($arr_value);
				if(!empty($arr_value['foreign_id']) && $arr_value['foreign_id'] != NULL)
				{
					

				  if($arr_value['field_type'] == '5') // don't use alias if field_type == 5, in case more than one fields from a table.
					{	

						$strTable = $arr_value['table_name']; 
						$strTable2 = $strTable;
					}
					else if($arr_value['field_type'] == '6')
					{ 

						$strTable2 = $table_name; 
						$strTable = $arr_value['table_name']; 
					}
					else
					{
							//$strTable = $arr_value['table_name'].substr(trim($arr_value['description'], ' '), 0, 3);	
							$strTable = $arr_value['table_name'].$alia;	
							$strTable2 = $strTable;
					}

					/*if ( $arr_value['is_nescessary'] == '2'){
						$str_column .= "DATE_FORMAT(".$strTable.".".$arr_value['name']." ,  '%m/%d/%Y' ) as `".$col."`,";
					} else */
					if ( $arr_value['field_type'] !== '3') {
						$str_column .= $strTable.".".$arr_value['name']." as `".$col."`,";
					}		

					
					if($arr_value['condition'] != NULL && (strpos($arr_value['condition'],'::') == true))
					{

						list($firstcond, $secondcond) = explode('::', $arr_value['condition']);
						$arr_value['condition'] = $firstcond;
						$strColumnn = $secondcond;
						$str_from .= " LEFT OUTER JOIN ".$arr_value['table_name']." ".$strTable."   ON ( ".$strTable.'.'.$secondcond." AND ".$firstcond." = ".$arr_value['foreign_id'].")";

						//echo "strfrom==>>".$str_from;
					}
					else {
						$str_from .= " LEFT OUTER JOIN ".$arr_value['table_name']." ".$strTable."   ON ( ".$strTable2.".id = ".$arr_value['foreign_id'].")";
					}
					//echo "here in if======>>";exit;


					/*if ($arr_value['field_type'] == DROPDOWN)
					{

						$strCondition = '';
						$strCompany = '';
						$result = array();
						if ($arr_value['condition'] != NULL) {
							$strCompany = ' AND company_id = '.$this->arrUser[company_id].'';
							$strCondition = ' where '.$arr_value['condition'].$strCompany;
						}
						else
						{
							$strCondition =' where company_id = '.$this->arrUser[company_id].'';
						}

						$dropdown_name  = $arr_value['name'];
						$strDropDownQuery = 'Select id,'.$dropdown_name.' from '.$arr_value['table_name'].$strCondition;
						$result = array('' => '---Select---') ;
						
						$dropdown_result2 = $this->Conn->Execute($strDropDownQuery); 
						//echo "<pre>";var_export($dropdown_result);
						//echo "query = ".$strDropDownQuery;exit;
						//echo "heereeeee ===== >";exit;
						//echo "count == ".count($dropdown_result2->FetchRow());

						//exit;
						if($dropdown_result2->RecordCount()>0){
							while($row = $dropdown_result2->FetchRow()){
								//echo "<pre>"; print_r($strColumnn);
								//exit;
								if (isset($strColumnn) && !empty($strColumnn) && $arr_value['field_type'] == CONTANTS_DROPDOWN) 
									$nId = $row[$strColumnn];
								else	
									 $nId = $row['id'];
								$result[$nId] = $row[$dropdown_name];
							}
						}
						
						 $column_id[$key] = $arr_value['foreign_id'];
						 $dropdown_data = 'id="lst_'.$column_id[$key].'" class="field_column dropdown_select form-control"';
						// $arrDropDown[$key]= form_dropdown($column_id[$key], $result,'', $dropdown_data);
						// $arrColumnType[$key] = DROPDOWN;	
					}*/

					/*else if($arr_value['field_type'] == CALENDAR)
					{
						$arrColumnType[$key] = CALENDAR;
					}*/

						
				}
				else
				{
		
					//echo "here==>>";exit;
					$str_column .= $arr_value['table_name'].".".$arr_value['name']." as `".$col."`,";
					if($arr_value['foreign_id'] == '' && $arr_value['field_type'] == DROPDOWN){
						$arrColumnType[$key] = DROPDOWN;
					}
					else if($arr_value['foreign_id'] == '' && $arr_value['field_type'] == CALENDAR)
					{
						$arrColumnType[$key] = CALENDAR;
					}
					elseif ( $arr_value['is_nescessary'] == '2')
						$str_column .= "DATE_FORMAT(".$arr_value['table_name'].".".$arr_value['name']." ,  '%m/%d/%Y' ) as `".$col."`,";
					else if (($arr_value['foreign_id'] == '' || empty($arr_value['foreign_id'])) && $arr_value['field_type'] == '3')
					{
						$str_column .= " CONCAT('".$arr_value['prefix']."', case when ".$arr_value['table_name'].".".$arr_value['name']." < 10 then concat('00', ".$arr_value['table_name'].".".$arr_value['name'].") when ".$arr_value['table_name'].".".$arr_value['name']." < 100 then concat('0', ".$arr_value['table_name'].".".$arr_value['name'].") else ".$arr_value['table_name'].".".$arr_value['name']." end ) as `".$col."`,";
						$arrColumnType[$key] = INPUT_BOX;
					}
					else if($arr_value['foreign_id'] == '' && $arr_value['field_type'] == CONTANTS_DROPDOWN && $arr_value['condition'] != NULL )
					{
						
						$result = array('' => '---Select---') ;
						$dropdown_name  = $arr_value['name'];
						
						if((strpos($arr_value['condition'],'::') == true))
							list($constant_name, $table_field_name) = explode('::', $arr_value['condition']);
						
						$dropdown_result = $ci->config->item($constant_name);
							foreach($dropdown_result as $array_key => $row){
								$result[$array_key] = $row;
							}
						
						 $column_id[$key] = $table_field_name;
						 $contants_array[$key] = $constant_name;
						 $dropdown_data = 'id="lst_'.$column_id[$key].'" class="field_column dropdown_select form-control"';
						 $arrDropDown[$key]= form_dropdown($column_id[$key], $result,'', $dropdown_data);
						 $arrColumnType[$key] = CONTANTS_DROPDOWN;	
					}
					///echo "else loop = ".$counter++;
				}

				if($arr_value['module_condition'] != ''){
					$str_where = " where ".$arr_value['module_condition'];
					$strModuleCondition = $arr_value['module_condition'];
				}
				
				//exit;	
					
				//break;
			}
			//echo $str_column;exit;
		/*echo'here=>>'. $str_from; exit;
		echo "here----->>"; 
		print_r($where);
		exit;*/


		}
		else $str_from = $table_name;

		//print '<br> form =====>>'.$str_from;exit;
		
		if($more_fields != ''){
			$str_more_fields = '';
			$arr_more_fields = explode('*',$more_fields);
			if(count($more_fields) > 0){
				foreach($arr_more_fields as $field)
				$str_column .= "".$table_name.".".$field.",";
			}
		}

		//error_reporting(E_ALL);
		$strOrder = '';
		if(isset($order_by) && $order_by != ''){
			$strOrder = ' ORDER BY '.$order_by;
		}
		else{
			$strOrder = ' ORDER BY id DESC';
		}

		//echo "after ifles";exit;
		$str_column = rtrim($str_column, ',');
		/*if ($db->field_exists('company_id', $table_name) && $str_where != '')
			$str_where .= ' AND '.$table_name.'.company_id = '.$this->arrUser[company_id].'';
		else if($db->field_exists('company_id', $table_name))
			$str_where .= ' where '.$table_name.'.company_id = '.$this->arrUser[company_id].'';
		else
			$str_where = '';*/
		

		/*print_r($where);
		exit;*/
		

		if(isset($where) && !empty($where)){
			//print_r($where); exit;
		foreach($where as $key=>$wh){

			foreach($wh as $column=>$value){
				//echo '<br>'.$column."=>".$value;
			if(strpos($column,'like_') != '' && trim($value) != ''){
				$column = str_replace("like_","",$column);

				$brkt = '';
				if(strpos($value,')') !== false){
					$value = str_replace(")","",$value);
					$brkt = ')';
				}

				if($value != ''){

				if($str_where != ''){
					if(strpos($str_where,'LIKE') != false)
						$str_where.= " OR ".$column. " LIKE '%". $value."%'".$brkt;
					else
						$str_where.= " AND ".$column. " LIKE '%". $value."%'".$brkt;
				}
				else
					$str_where.= " WHERE ".$column. " LIKE '%". $value."%'".$brkt;
			}
					
			}
			else if(strpos($column,'notin_') !== false){
				$column = str_replace("notin_","",$column);
				if($str_where != '')
					$str_where.= " AND ".$column. " NOT IN (". $value.")";
				else
					$str_where.= " WHERE ".$column. " NOT IN (". $value.")";
					
			}
			else if(strpos($column,'in_') !== false){
				$column = str_replace("in_","",$column);
				if($str_where != '')
					$str_where.= " AND ".$column. " IN (". $value.")";
				else
					$str_where.= " WHERE ".$column. " IN (". $value.")";
			}
			else if(strpos($column,'lst_') !== false){
				$column = str_replace("lst_","",$column);
				if($str_where != '')
					$str_where.= " AND ".$column. " = '". $value."'";
				else
					$str_where.= " WHERE ".$column. " = '". $value."'";
			}
			else if(strpos($column,'daterange_') !== false){
				$column = str_replace("daterange_","",$column);
				list($start_date, $end_date) = explode('to', $value);
				$start_date = format_db_date(str_replace('_',"/",$start_date));
				$end_date = format_db_date(str_replace('_',"/",$end_date));
				if($str_where != '')
					$str_where.= " AND ".$column. " BETWEEN '".$start_date."' AND '".$end_date."'";
				else
					$str_where.= " WHERE ".$column. " BETWEEN '".$start_date."' AND '".$end_date."'";
			}
			else{
				//print "<br>this ====>>".$arr_value['field_type'];
				if($value != ''){
					if(strpos($value,')') == false){
					if($str_where != '')
					{

						$str_where.= " AND ".$column. " = '". $value."'";
						/*if ($arr_value['field_type'] == DROPDOWN)
							$str_where.= " AND ".$column. " = ". $value."";
						else	
							$str_where.= " AND ".$column. " LIKE '%". $value."%'";	*/					
					}
					else
						$str_where.= " WHERE ".$column. " = '". $value."'";
					}
				}
				}
				//print "<br>this ====>>".$str_where;exit;
			}
			}
		}

		//echo "<pre>"; print_r($this->arrUser); 

		if($table_name !=  'company'){
			if($str_where != '')
					$str_where.= " AND ".$table_name.".company_id = '".$this->arrUser[company_id]."'";
			else
					$str_where.= " WHERE ".$table_name.".company_id = '".$this->arrUser[company_id]."'";
		}
		if($table_name ==  'company'){
			if($str_where != '')
					$str_where.= " AND (".$table_name.".id = '".$this->arrUser[company_id]."' || ".$table_name.".parent_id = '".$this->arrUser[company_id]."')";
			else
					$str_where.= " WHERE ".$table_name.".id = '".$this->arrUser[company_id]."' || ".$table_name.".parent_id = '".$this->arrUser[company_id]."'";
		}

		/*if(isset($whr_col) && !empty($whr_col) && isset($whr_val) && !empty($whr_val)){

			if(isset($str_where) && !empty($str_where)){

				if(strpos($str_where,$whr_col) != false){

					 $str_where.= "".$whr_col. " = '".$whr_val."'";
					}
				else
					 $str_where = " WHERE ".$whr_col. " = '".$whr_val."'";
			}
			else
				$str_where = " WHERE ".$whr_col. " = '".$whr_val."'";
		}*/

		//echo 'whrer==>>'.$str_where;

		if(isset($whr_col) && !empty($whr_col) && isset($whr_val) && !empty($whr_val)){

			if(isset($str_where) && !empty($str_where)){

				if(strpos($str_where,'crm.status') != false){

					if($whr_col == 'company_type'){

							$str_where = " WHERE crm.type IN (2,3) AND crm.status = 'Active' AND crm.company_id = '".$this->arrUser[company_id]."' AND ".$whr_col." IN (".$whr_val.")";
					}
					else{

						$str_where = " WHERE crm.type IN (2,3) AND crm.status = 'Active' AND crm.company_id = '".$this->arrUser[company_id]."' AND ".$whr_col." = '".$whr_val."'";
					}
				}
				else
					 $str_where = " WHERE ".$whr_col. " = '".$whr_val."'";
			}
			else
				$str_where = " WHERE ".$whr_col. " = '".$whr_val."'";
		}

		/*if($is_posted !== ''){
			$str_where.= " AND is_posted = ".$is_posted."";
		}*/

		/*if(isset($limit) && !empty($limit)){
			$strLimitOffset = " LIMIT ".$limit." OFFSET ".$offset;	
		}*/
		
		/*echo 'here==>>'.$str_column;
		exit;*/
		
		$strQuery = ' Select '.$str_column.' from '.$str_from.$str_where.$strLimitOffset.$strOrder;
		
		//echo'here==>>'.$strQuery; exit;
		$data['arrColumnType'] = $arrColumnType;
		$data['arrDropDown'] = $arrDropDown;
		$data['table_headings'] = $table_headings;
		$data['column_id'] = $column_id;
		$data['contants_array'] = $contants_array;
		$data['strModuleCondition'] = $strModuleCondition;
		$RS = $this->Conn->Execute($strQuery); 
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				foreach($Row as $key => $value){
					if(is_numeric($key)) unset($Row[$key]);
				}

				$data['results'][] = $Row;

			}
									
		}


	  
		/*$sql_total = "SELECT COUNT(*) as total FROM ($strQuery) as tabless";
		echo "total===>>".$sql_total; exit;		
			$rs_count = $this->Conn->Execute($sql_total);
			$total = $rs_count->fields['total'];*/
			$data['num_rows'] = count($data['results']);//$total;


		return $data;


	}

	// Modules Filters Module
//----------------------------------------------------
	function get_modules_filters($attr){

		$where_clause .= " AND module_codes_id = ".$attr['module_id'];

		$response = array();
		
		$Sql = "SELECT filter.*,ref_module_code.module_title as module_name,CONCAT(employees.first_name,' ',employees.last_name) as emp_name
				FROM filter
				LEFT JOIN ref_module_code ON ref_module_code.id = filter.module_codes_id
				LEFT JOIN employees ON employees.id = filter.created_by
				WHERE 1
				".$where_clause."
				ORDER BY id ASC";
		
		$sql_total = "SELECT COUNT(*) as total FROM ($Sql) as tabless";		
		$rs_count = $this->Conn->Execute($sql_total);
		$total = $rs_count->fields['total'];
		//echo $total_records."<hr>";
		$Sql .= $limit_clause;
		//echo $Sql."<hr>";
		$RS = $this->Conn->Execute($Sql);
		$response['ack'] = 1;
		$response['error'] = NULL;
		$response['total'] = $total;
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result = array();
				$result['id'] = $Row['id'];
				$result['name'] = $Row['name'];
				$result['is_default'] = $Row['is_default'];
				$response['response'][] = $result;
			}							
		}else{
			$response['response'][] = array();
		}
		return $response;
	}
 
}
?>