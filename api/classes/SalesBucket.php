<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH."/classes/Xtreme.php");
require_once(SERVER_PATH."/classes/General.php");
require_once(SERVER_PATH. "/classes/Setup.php");

class SalesBucket extends Xtreme{ 

	private $Conn = null;
	private $objGeneral = null;
	private $arrUser = null;
    private $objsetup = null;

	function __construct($user_info=array()){
		
		parent::__construct();
		$this->Conn = parent::GetConnection();
		$this->objGeneral = new General($user_info);
		$this->arrUser = $user_info;
        $this->objsetup = new Setup($this->arrUser);
	}

  // static	
	function delete_update_status($table_name,$column,$id) {
       
	 $Sql = "UPDATE $table_name SET  $column=0 	WHERE id = $id Limit 1" ;
	//echo $Sql;exit;
	
		$RS = $this->objsetup->CSI($Sql); 
		if($this->Conn->Affected_Rows() > 0){
			$response['ack'] = 1;
			$response['error'] = NULL;
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record can\'t be deleted!';
		}

		return $response;
    }
					
	function get_data_by_id($table_name,$id) {
       
		$Sql = "SELECT * FROM $table_name	WHERE id=$id LIMIT 1";
	//	echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);
	
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
		
			$response['response'] = $Row;
		$response['ack'] = 1;
		$response['error'] = NULL;
		}
		else $response['response'] = array();
		
		//print_r($response);exit;
		return $response;
    }
	

//----------------------crm_sale_bucket----------------

 
	

	function get_sale_baket_list($attr){
		$this->objGeneral->mysql_clean($attr); 
		
		$limit_clause = $where_clause = "";
	
		if(!empty($attr['thisid'])) 	$where_clause .= " AND c.id != '$attr[thisid]' ";
		 
		if(empty($attr['all'])){
			if(empty($attr['start'])) $attr['start'] = 0;
			if(empty($attr['limit'])) $attr['limit'] = 10;
			$limit_clause = " LIMIT $attr[start] , $attr[limit]";
		}
		$response = array();
		
		$Sql = "SELECT   c.* FROM  bucket c
		JOIN company on company.id=c.company_id where  c.status=1  AND c.sale_bk_code !=''   
		 AND(c.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")		 
		$where_clause
		order by c.id DESC" ;
		 
		
		$RS = $this->objsetup->CSI($Sql); 
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result = array();
				$result['id'] = $Row['id']; 
				$result['code'] = $Row['sale_bk_code'];
				$result['name'] = $Row['name'];
				 	
				$result['starting_date'] =$this->objGeneral->convert_unix_into_date($Row['starting_date']);
				$result['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);
			 
				$response['response'][] = $result;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;							
		}else 
			$response['response'][] = array();
		
		return $response;
	}
	
	function get_sale_baket_data_by_id($id) {
       echo "hello";exit;
	  
		$Sql = "SELECT * FROM bucket WHERE id=$id LIMIT 1";
	//	echo $Sql;exit;
				
		$RS = $this->objsetup->CSI($Sql);
	
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			
			$Row['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
			$Row['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);
			 
			
			$response['response'] = $Row;
		$response['ack'] = 1;
		$response['error'] = NULL;
		}
		else $response['response'] = array();
		
		//print_r($response);exit;
		return $response;
    }
	
	function add_sale_baket($arr_attr){ 
			$this->objGeneral->mysql_clean($arr_attr); 
			
						
			//	print_r($arr_attr);exit;
			  $sdate=$this->objGeneral->convert_date($arr_attr['starting_date']);
			 $edate=$this->objGeneral->convert_date($arr_attr['ending_date']);
			 
			 $id=$arr_attr['id'];  
			 if($id==0){  
				  
			//	 ('".$sdate."' BETWEEN starting_date AND ending_date	AND '".$edate."' BETWEEN starting_date AND ending_date )
				
	 if($arr_attr['id']>0)   $where_id = " AND tst.id <> '".$arr_attr['id']."' ";
		
		$data_pass = "  stst.ale_bk_code='" . $arr_attr['sale_bk_code'] . "' AND 
				( (tst.starting_date >= '".$sdate."' AND tst.ending_date <= '".$sdate."') 	Or( tst.starting_date >= '".$edate."' AND tst.ending_date <= '".$edate."')	 $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('bucket', $data_pass, $this->arrUser['company_id']);
 
        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
		
				
				
						$Sql = "INSERT INTO crm_sale_bucket
						SET  
						sale_bk_code='$arr_attr[sale_bk_code]' ,sale_bk_no='$arr_attr[sale_bk_no]' ,name='".$arr_attr['name']."' 	
						,starting_date = '" . $sdate. "',ending_date = '" .$edate . "'
						,company_id='".$this->arrUser['company_id']."'
						,user_id='".$this->arrUser['id']."',created_date='".current_date."'	,status=1
						";	
						$msg='Inserted'; 
					} 
			else {	 
				$Sql = "UPDATE bucket 	SET  name='".$arr_attr['name']."' ,starting_date = '" . $sdate. "',ending_date = '" .$edate . "'	WHERE id = $id Limit 1 "; 
					$msg='Updated'; 
			 }
			 
			// echo $Sql;exit;
			  $rs  = $this->objsetup->CSI($Sql); 
			 if($id== 0)	$id = $this->Conn->Insert_ID(); 
		 
		// $this->Conn->Affected_Rows() 
		 if(count($arr_attr['name']) > 0) {
			$response['ack'] = 1;
			$response['id'] =  $id;
			$response['error'] = NULL; 
		} 
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not '.$msg;
			
		}
			return $response;
	}

	function get_all_buckets(){
		$Sql = "SELECT id, name FROM bucket WHERE company_id = ".$this->arrUser['company_id']." AND status=1 ";
		$RS = $this->objsetup->CSI($Sql);
		if($RS->RecordCount()>0){
			$result = array();
			while($Row = $RS->FetchRow()){
				
				$result['id'] = $Row['id']; 
				$result['name'] = $Row['name'];
				$response['response'][] = $result;
			}
			
		}
		$response['ack'] = 1;
		$response['error'] = NULL;	
		return $response;
	}
 
 	
	function get_sale_baket_customize_list($attr){
		//$this->objGeneral->mysql_clean($attr); 
		
		$limit_clause = $where_clause = "";
	
		//if(!empty($attr['id'])) 	$where_clause .= " AND c.id != '".$attr['id']."' ";
		 
		if(empty($attr['all'])){
			if(empty($attr['start'])) $attr['start'] = 0;
			if(empty($attr['limit'])) $attr['limit'] = 100;
			$limit_clause = " LIMIT $attr[start] , $attr[limit]";
		}
		$response = array();
		

		$bucketSql = "SELECT  c.id,c.module_id, c.operator_search FROM  bucket_filters c
		JOIN company on company.id=c.company_id where  c.status=1  and c.type=2
		 AND(c.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")	
		order by c.id DESC" ;
		//echo $bucketSql ;exit;
		$RS = $this->objsetup->CSI($bucketSql);
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				
					 $new_query=$this->objGeneral->save_query_format($Row['operator_search'],2);
					// echo  $new_query;exit;
					 $RS_new = $this->objsetup->CSI($new_query);
						if($RS_new->RecordCount()>0){
							while($Row_new = $RS_new->FetchRow()){
				 				if($attr['id']===$Row_new['id'])$result  .= "'".$Row['module_id']."'".','; 
							} 
					}
			} 
		
		$result= substr($result, 0, -1);
		// echo 	$result ;exit;
		//echo strlen($result);
		}
		 
		 if( strlen($result) >3 )  {
			 
		$finalSql = "SELECT   c.* FROM  bucket c
		JOIN company on company.id=c.company_id where  c.status=1  AND c.sale_bk_code !=''   
		 AND(c.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")		 
		AND c.id IN ($result) 
		order by c.id DESC" ;
		 
		$finalRS = $this->objsetup->CSI($finalSql);
	 
			
		if($finalRS->RecordCount()>0){
			while($Row = $finalRS->FetchRow()){
				$result = array();
				$result['id'] = $Row['id']; 
				$result['code'] = $Row['sale_bk_code'];
				$result['name'] = $Row['name'];
				 	
				$result['starting_date'] =$this->objGeneral->convert_unix_into_date($Row['starting_date']);
				$result['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);
			 
				$response['response'][] = $result;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;							
		}
		}
		else  {
			$response['ack'] = 0;
			$response['response'][] = array();
		}
		
		
		
		return $response;
	}
	
	function get_customer_crm_by_sale_person_id_backup($attr,$type,$module_id){
	$this->objGeneral->mysql_clean($attr); 
	 // print_r($attr);exit;
	
	if(!empty($attr[normal_filter])){
		if($attr[normal_filter]==1)   $normal_filter = 'c.name';
		else if($attr[normal_filter]==2)   $normal_filter = 'cn.name';	//c.country_id
		else if($attr[normal_filter]==3)   $normal_filter = 'c.city';
		else if($attr[normal_filter]==4)   $normal_filter = 'c.postcode';
		else if($attr[normal_filter]==5)   $normal_filter = 'c.turnover';
		else if($attr[normal_filter]==6)   $normal_filter = 'cr.title';	//'c.region';
		else if($attr[normal_filter]==7)   $normal_filter = 'sr.title';	//'c.segment';
		else if($attr[normal_filter]==8)   $normal_filter = 'bs.title';	//'c.buyinggroup';
		}
	
	if(!empty($attr[operator_filter])){
		if($attr[operator_filter]==1)   $operator_filter = 'IN';
		else if($attr[operator_filter]==2)   $operator_filter = '=';
		else if($attr[operator_filter]==3)   $operator_filter = 'LIKE';
		else if($attr[operator_filter]==4)   $operator_filter = '>';
		else if($attr[operator_filter]==5)   $operator_filter = '<';
		else if($attr[operator_filter]==6)   $operator_filter = '>=';
		else if($attr[operator_filter]==7)   $operator_filter = '<=';
		else if($attr[operator_filter]==8)   $operator_filter = 'NOT IN';
		}
	if(!empty($attr[operator_search]))  {
		if( ($attr[operator_filter]==1) ||  ($attr[operator_filter]==8)) {
			 
			 $pieces = explode(",", $attr[operator_search]);
			 foreach($pieces  as $key => $value)
			 {
				   $new .=    "'".$value."'".','   ;
			 }
			 $new= substr($new, 0, -1);
			 $operator_search = "($new)";
		}
		else if($attr[operator_filter]==3)  $operator_search =  " '".$attr[operator_search]."%' " ;
		else   $operator_search = "'".$attr[operator_search]."'" ;
	}
	
	if(!empty($attr[logical_filter])){
		if($attr[logical_filter]==1) $logical_filter = 'AND';
		else if($attr[logical_filter]==2) $logical_filter = 'OR'; 
	}
	
	if(!empty($attr[normal_filter]))$where_clause .="AND $normal_filter  $operator_filter $operator_search "; 
	
	//if(!empty($attr[logical_search])) $where_clause .=" $logical_filter  $normal_filter = $logical_search "; 
	
	

	 // if(!empty($attr['all'])) $where_clause .= " AND  c.type IN (1,2,3)  ";
	  $where_clause_type = "    c.type IN (2,3)  ";
	
   $response = array();
	$Sql = "SELECT  distinct c.name,c.type, c.id, c.crm_no, c.customer_code, c.crm_code, c.customer_no, c.name , c.city  , c.postcode, c.turnover , cn.name as cnname , cr.title as region  , bs.title as buying_group  , sr.title as segment 
	FROM  crm  c 
	left JOIN company on company.id=c.company_id 
	left JOIN country as cn on cn.id=c.country_id   
	left JOIN crm_region as cr on cr.id =c.region_id
	left JOIN crm_buying_group as bs on bs.id =c.buying_grp 
	left JOIN crm_segment as sr on sr.id =c.company_type
	WHERE ".$where_clause_type." 
	AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	
	".$where_clause." 
	Group by c.name DESC 
	Limit 100 "; //Order by c.id DESC
 
  $RS = $this->objsetup->CSI($Sql);
 
   
 	 if($RS->RecordCount()>0){
  		 while($Row = $RS->FetchRow()){
    	 $result = array();
    	 $result['id'] = $Row['id'];  
		 $result['type'] = $Row['type'];
		$result['code'] = $Row['customer_code'];  
		if($Row['type']==1) $result['code'] = $Row['crm_code']; 
		
		$result['title'] = $Row['name'];
		$result['country'] = $Row['cnname'];
		$result['city'] = $Row['city'];
		$result['postcode'] = $Row['postcode'];
		$result['turnover'] = $Row['turnover'];
		$result['region'] =$Row['region'];
		$result['segment'] = $Row['segment'];
		 $result['buying_group'] = $Row['buying_group'];

    	 $response['response'][] = $result;
   }  
    		 $response['ack'] = 1;
  			$response['error'] = NULL;     
 	 }
	 else{
  	 	$response['response'][] = array();
    	 $response['ack'] = 0;
  		$response['error'] = NULL;
  	} 
	
	
	if($type==2){
		
		
		
		$Sql = "INSERT INTO bucket_filters (module_id, sort_id,normal_filter,operator_filter,operator_search,  logical_filter,company_id,user_id,date_created,type,status) VALUES ";		 
		
				$Sql2 = "(  '" . $module_id  . "' ,'','',''," . $Sql   . ",''," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "," . current_date . "	,$type,1), "; 
				//echo $Sql2;exit;
				$RS = $this->objsetup->CSI($Sql2);
		
		exit;
		}
		else  return $response; 
 
 
 
 }
 
	function get_customer_crm_by_sale_person_id($attr){
	//$this->objGeneral->mysql_clean($attr); 
	  
	//print_r($attr);exit;
	
	
	$where_clause='';
	if(!empty($attr[array_dynamic_filter]) && !empty($attr[array_dynamic_filter][0]->normal_filter->id) 
	&&!empty($attr[array_dynamic_filter][0]->operator_filter->id) &&!empty($attr[array_dynamic_filter][0]->operator_search) )
	{
		
		$where_clause = 'AND (';
		foreach ($attr[array_dynamic_filter] as $item) { 
			if( (!empty($item->normal_filter->id)) && (!empty($item->operator_filter->id))&& (!empty($item->operator_search)))
			{	
		
				 $normal_filter =$operator_filter =$operator_search =$logical_filter='';
			 
					if(!empty($item->normal_filter->id) ){
					
						if($item->normal_filter->id==1)   $normal_filter = 'c.name';
						else if($item->normal_filter->id==2)   $normal_filter = 'cn.name';	//c.country_id
						else if($item->normal_filter->id==3)   $normal_filter = 'c.city';
						else if($item->normal_filter->id==4)   $normal_filter = 'c.postcode';
						else if($item->normal_filter->id==5)   $normal_filter = 'c.turnover';
						else if($item->normal_filter->id==6)   $normal_filter = 'cr.title';	//'c.region';
						else if($item->normal_filter->id==7)   $normal_filter = 'sr.title';	//'c.segment';
						else if($item->normal_filter->id==8)   $normal_filter = 'bs.title';	//'c.buyinggroup';
						} 
						
					if(!empty($item->operator_filter->id)){
						if($item->operator_filter->id==1)   $operator_filter = 'IN';
						else if($item->operator_filter->id==2)   $operator_filter = '=';
						else if($item->operator_filter->id==3)   $operator_filter = 'LIKE';
						else if($item->operator_filter->id==4)   $operator_filter = '>';
						else if($item->operator_filter->id==5)   $operator_filter = '<';
						else if($item->operator_filter->id==6)   $operator_filter = '>=';
						else if($item->operator_filter->id==7)   $operator_filter = '<=';
						else if($item->operator_filter->id==8)   $operator_filter = 'NOT IN';
					}
		
					if(!empty($item->operator_search))  {
						if( ($item->operator_filter->id==1) ||  ($item->operator_filter->id==8)) {
						 
						 $pieces = explode(",", $item->operator_search);
						 foreach($pieces  as $key => $value)
						 {
							   $new .=    "'".$value."'".','   ;
						 }
						 $new= substr($new, 0, -1);
						 $operator_search = "($new)";
					}
						else if($item->operator_filter->id==3)  $operator_search =  " '".$item->operator_search."%' " ;
						else   $operator_search = "'".$item->operator_search."'" ;
					}
				
					if(!empty($item->logical_filter->id)){
						if($item->logical_filter->id==1) $logical_filter = 'AND';
						else if($item->logical_filter->id==2) $logical_filter = 'OR'; 
					}
					
					
					if(!empty($item->normal_filter->id))
					$where_clause .=" $normal_filter  $operator_filter $operator_search  $logical_filter   "; 
					
					
				} 
		}
		 $where_clause .=")  "; 
	//	echo $where_clause;exit;
	}
					


	
   $response = array();
   //distinct c.name,
	$Sql = "SELECT  c.type, c.id, c.crm_no, c.customer_code, c.crm_code, c.customer_no, c.name , c.city  , c.postcode, c.turnover , cn.name as cnname , cr.title as region  , bs.title as buying_group  , sr.title as segment 
	FROM  crm  c 
	left JOIN company on company.id=c.company_id 
	left JOIN country as cn on cn.id=c.country_id   
	left JOIN crm_region as cr on cr.id =c.region_id
	left JOIN crm_buying_group as bs on bs.id =c.buying_grp 
	left JOIN crm_segment as sr on sr.id =c.company_type
	WHERE c.name!='' AND c.type IN (2,3) 
	AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	
	".$where_clause." 
	Order by c.id DESC	"; 
	//Group by c.name   DESC
	//Limit 50 
 
 
  $RS = $this->objsetup->CSI($Sql);
 
   
 	 if($RS->RecordCount()>0){
  		 while($Row = $RS->FetchRow()){
    	 $result = array();
    	 $result['id'] = $Row['id'];  
		 $result['type'] = $Row['type'];
		$result['code'] = $Row['customer_code'];  
		//if($Row['type']==1) $result['code'] = $Row['crm_code']; 
		
		$result['title'] = $Row['name'];
		$result['country'] = $Row['cnname'];
		$result['city'] = $Row['city'];
		$result['postcode'] = $Row['postcode'];
		$result['turnover'] = $Row['turnover'];
		$result['region'] =$Row['region'];
		$result['segment'] = $Row['segment'];
		 $result['buying_group'] = $Row['buying_group'];

    	 $response['response'][] = $result;
   }  
    		 $response['ack'] = 1;
  			$response['error'] = NULL;     
 	 }
	 else{
  	 	$response['response'][] = array();
    	 $response['ack'] = 0;
  		$response['error'] = NULL;
  	} 
	
	
	   return $response; 
 
 }

	function get_sale_customer_data($arr_attr){
		
		
	// print_r($arr_attr);exit;
	//	$Sql = "SELECT cust_id FROM crm_sale_bucket_data WHERE module_id = $arr_attr[module_id]  AND type = ".$arr_attr['type']." ";
	
	$Sql = "SELECT cb.* FROM  bucket_filters  cb 
	left JOIN company on company.id=cb.company_id 
	WHERE cb.module_id = $arr_attr[module_id]  AND cb.type = 1 
	AND (cb.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	
	"; //Order by cb.id DESC 
 
	  $RS = $this->objsetup->CSI($Sql);
	    
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result = array();
				//$result['id'] = $Row['cust_id'];
				$result['id'] = $Row['id']; 
				$result['sort_id'] = $Row['sort_id']; 
				$result['operator_search'] = $Row['operator_search'];
				$result['normal_filter'] = $Row['normal_filter'];
				$result['operator_filter'] = $Row['operator_filter']; 
				 $result['logical_filter'] = $Row['logical_filter'];
				
				$response['response_filter'][] = $result;
				
			}
					
		$response['ack'] = 1;
		$response['error'] = NULL;		
		
 $Sql_cust = "SELECT operator_search FROM bucket_filters WHERE module_id = $arr_attr[module_id] AND type =2 limit 1";
$RS_cust = $this->objsetup->CSI($Sql_cust);
	//echo  $Sql_cust;exit;
	$new_query=$this->objGeneral->save_query_format($RS_cust->fields['operator_search'],2);
	//	echo  $new_query;exit;	
		$RS_cust2 = $this->objsetup->CSI($new_query);
		 if($RS_cust2->RecordCount()>0){
  		 while($Row = $RS_cust2->FetchRow()){
    	 $result = array();
    	 $result['id'] = $Row['id'];  
		 $result['type'] = $Row['type'];
		$result['code'] = $Row['customer_code'];  
		if($Row['type']==1) $result['code'] = $Row['crm_code']; 
		
		$result['title'] = $Row['name'];
		$result['country'] = $Row['cnname'];
		$result['city'] = $Row['city'];
		$result['postcode'] = $Row['postcode'];
		$result['turnover'] = $Row['turnover'];
		$result['region'] =$Row['region'];
		$result['segment'] = $Row['segment'];
		 $result['buying_group'] = $Row['buying_group'];

    	 $response['response_customer'][] = $result;
   }  
    			
 	 }
		}
		else $response['response'][] = array();
		
	 
		return $response;
	}

	function add_sale_customer_data($attr){
		
		//print_r($attr);exit;
		
		$chk=0;
	    $Sqli = "DELETE FROM bucket_filters WHERE module_id= '".$attr['module_id']."' ";
		$RS = $this->objsetup->CSI($Sqli);
		if($this->Conn->Affected_Rows() > 0)	$msg = 'Updated';
		else	$msg = 'Inserted';
		
		
		$Sql = "INSERT INTO bucket_filters (module_id, sort_id,normal_filter,operator_filter,operator_search,  logical_filter,company_id,user_id,date_created,type,status) VALUES ";		 
		
		foreach ($attr['array_dynamic_filter'] as $item) { 
		
		if( (!empty($item->normal_filter->id)) && (!empty($item->operator_filter->id))&& (!empty($item->operator_search)))
		{
$Sql .= "(  '" . $attr['module_id']  . "' ,'" . $item->sort_id   . "','" . $item->normal_filter->id   . "','" . $item->operator_filter->id   . "','" . $item->operator_search   . "','" . $item->logical_filter->id   . "'
," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "," . current_date . ",1,1 ), "; 
		$chk++;
		}
		
		}
		$Sql= substr_replace(substr($Sql, 0, -1), "", -1);
	//echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);
			 
		
		if($chk>0){
				 
	
	
	$where_clause='';
	if(!empty($attr[array_dynamic_filter]) && !empty($attr[array_dynamic_filter][0]->normal_filter->id) 
	&&!empty($attr[array_dynamic_filter][0]->operator_filter->id) &&!empty($attr[array_dynamic_filter][0]->operator_search) )
	{
		
		$where_clause = 'AND (';
		foreach ($attr[array_dynamic_filter] as $item) { 
			if( (!empty($item->normal_filter->id)) && (!empty($item->operator_filter->id))&& (!empty($item->operator_search)))
			{	
		
				 $normal_filter =$operator_filter =$operator_search =$logical_filter='';
			 
					if(!empty($item->normal_filter->id) ){
					
						if($item->normal_filter->id==1)   $normal_filter = 'c.name';
						else if($item->normal_filter->id==2)   $normal_filter = 'cn.name';	//c.country_id
						else if($item->normal_filter->id==3)   $normal_filter = 'c.city';
						else if($item->normal_filter->id==4)   $normal_filter = 'c.postcode';
						else if($item->normal_filter->id==5)   $normal_filter = 'c.turnover';
						else if($item->normal_filter->id==6)   $normal_filter = 'cr.title';	//'c.region';
						else if($item->normal_filter->id==7)   $normal_filter = 'sr.title';	//'c.segment';
						else if($item->normal_filter->id==8)   $normal_filter = 'bs.title';	//'c.buyinggroup';
						} 
						
					if(!empty($item->operator_filter->id)){
						if($item->operator_filter->id==1)   $operator_filter = 'IN';
						else if($item->operator_filter->id==2)   $operator_filter = '=';
						else if($item->operator_filter->id==3)   $operator_filter = 'LIKE';
						else if($item->operator_filter->id==4)   $operator_filter = '>';
						else if($item->operator_filter->id==5)   $operator_filter = '<';
						else if($item->operator_filter->id==6)   $operator_filter = '>=';
						else if($item->operator_filter->id==7)   $operator_filter = '<=';
						else if($item->operator_filter->id==8)   $operator_filter = 'NOT IN';
					}
		
					if(!empty($item->operator_search))  {
						if( ($item->operator_filter->id==1) ||  ($item->operator_filter->id==8)) {
						 
						 $pieces = explode(",", $item->operator_search);
						 foreach($pieces  as $key => $value)
						 {
							   $new .=    "'".$value."'".','   ;
						 }
						 $new= substr($new, 0, -1);
						 $operator_search = "($new)";
					}
						else if($item->operator_filter->id==3)  $operator_search =  " '".$item->operator_search."%' " ;
						else   $operator_search = "'".$item->operator_search."'" ;
					}
				
					if(!empty($item->logical_filter->id)){
						if($item->logical_filter->id==1) $logical_filter = 'AND';
						else if($item->logical_filter->id==2) $logical_filter = 'OR'; 
					}
					
					
					if(!empty($item->normal_filter->id))
					$where_clause .=" $normal_filter  $operator_filter $operator_search  $logical_filter   "; 
					
					
				} 
		}
		 $where_clause .=")  "; 
	//	echo $where_clause;exit;
	}
	
	
		$query_format="SELECT  distinct c.name,c.type, c.id, c.crm_no, c.customer_code, c.crm_code, c.customer_no, c.name , c.city  , c.postcode, c.turnover , cn.name as cnname , cr.title as region  , bs.title as buying_group  , sr.title as segment FROM  crm  c left JOIN company on company.id=c.company_id 	left JOIN country as cn on cn.id=c.country_id   
		left JOIN crm_region as cr on cr.id =c.region_id left JOIN crm_buying_group as bs on bs.id =c.buying_grp 
		left JOIN crm_segment as sr on sr.id =c.company_type
		WHERE c.name!='' AND  c.type IN (2,3) AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	".$where_clause." Order by c.id DESC	"; 
		//	echo  $query_format;
		$Sql_add = $this->objGeneral->save_query_format($query_format,1); //Order by c.id DESC
		//echo  $Sql_add;exit; 


$Sql2 = "INSERT INTO bucket_filters (module_id, sort_id,normal_filter,operator_filter,operator_search,  logical_filter,company_id,user_id,date_created,type,status) 	VALUES (  '" . $attr['module_id']  . "' ,'','',''
,'" . $Sql_add . "',''," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "," . current_date . "	,2,1) "; 
		//echo $Sql2;exit;
		$RS = $this->objsetup->CSI($Sql2);
				
		}
		
		
			 			
		 if($this->Conn->Affected_Rows() > 0){ 
			$response['ack'] = 1;
			$response['msg'] = 'Record '.$msg;
		}
		  else{
			$response['ack'] = 0;
			$response['error'] = 'Record Not .' .$msg;
		}
		
		
		return $response;
	}

	function add_bucket_to_customer($attr){
		
		//print_r($attr);exit;
		
		$sql_crm = "UPDATE crm SET bucket_id = CASE id ";
		
		$sql_sp_delete = "DELETE FROM crm_salesperson  ";//
		
		$Sql_sp_add = "INSERT INTO crm_salesperson (module_id,salesperson_id,type,is_primary,company_id,  user_id,bucket_id,start_date) VALUES ";	
		
		 foreach ($attr['salespersons'] as $item) { 
			$ids .=$item->id.',';
			
			$sql_crm .=" WHEN $item->id THEN $attr[bucket_id] ";
			 
			$Sql_sp_add .= "(  '" . $item->id  . "'," . $attr['primary_sale_id']   . " ,2,1," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . ",'" . $attr['bucket_id'] . "'	,'" . current_date . "' ), ";
			
			}
		$ids= substr($ids, 0, -1); 
		$sql_crm .= "END WHERE id IN ($ids)";
		//echo $sql_crm;exit;
		$RS_crm = $this->objsetup->CSI($sql_crm);
	
		$sql_sp_delete .= " WHERE module_id IN ($ids) And type=2   ";
		//echo $sql_sp_delete;exit;
		$RS_del = $this->objsetup->CSI($sql_sp_delete);
	
		$Sql_sp_add= substr_replace(substr($Sql_sp_add, 0, -1), "", -1);
		//echo  $Sql_sp_add;exit;
		$RSS_sp = $this->objsetup->CSI($Sql_sp_add);
		
		
		
		 if($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL; 
		} 
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not updated';
			
		}
			return $response;
		 
	}



//----------------------sale_person----------------


	function get_crm_salesperson($arr_attr) {
		
		if(!empty($arr_attr['type'])) $type .="and type = '".$arr_attr['type']."' ";
       if(!empty($arr_attr['bucket_id'])) $type .="and bucket_id = '".$arr_attr['bucket_id']."' ";
    
	
	 $Sql = "SELECT * FROM crm_salesperson  WHERE module_id = '".$arr_attr['id']."'  " . $type. " AND  end_date=0 ";
        
   // echo $Sql; exit;
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
        }else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_crm_salesperson($arr_attr) {
      
	  
	   if(!empty($arr_attr['bucket_id'])) $type="and bucket_id = '".$arr_attr['bucket_id']."' ";
	   
	  //  $sql = "DELETE FROM crm_salesperson WHERE module_id='".$arr_attr['id']."' AND type='". $arr_attr['type']  . "'";
	   // $this->objsetup->CSI($sql);
       
	  				
        $check = false;
		$Sql = "INSERT INTO crm_salesperson (module_id,salesperson_id,type,is_primary,company_id,  user_id,bucket_id,start_date) VALUES ";		 
		foreach ($arr_attr['salespersons'] as $item) { 
				
				$Sql .= "(  '" . $arr_attr['id']  . "' ," . $item->id   . " ,". $arr_attr['type']  . ",	'" . $item->isPrimary . "'	," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . ",'" . $arr_attr['bucket_id'] . "'	,'" . current_date . "' ), "; 
					
			 $check = true;
		}
		$Sql= substr_replace(substr($Sql, 0, -1), "", -1);
		//echo  $Sql;exit;
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
	
	 function update_crm_salesperson($arr_attr) {
      
	   if(!empty($arr_attr['bucket_id'])) $type="and bucket_id = '".$arr_attr['bucket_id']."' ";
	   
		// print_r($arr_attr);exit;
	  // $sql = "DELETE FROM crm_salesperson WHERE module_id='".$arr_attr['id']."' AND type='". $arr_attr['type']  . "'";
	  // $this->objsetup->CSI($sql);
       
	    if(!empty($arr_attr['replace_sale_person']) || !empty($arr_attr['pre_sale_person']))  $ck_value=true;
		
	    //replae in crm
		$updatecrmsql = "UPDATE crm_salesperson SET  salesperson_id='". $arr_attr['replace_sale_person']."',is_primary='$arr_attr[primary_sale_id]' WHERE bucket_id='".$arr_attr['id']."' AND type='2'  AND salesperson_id='". $arr_attr['pre_sale_person']  . "' 	 AND salesperson_id!='". $arr_attr['replace_sale_person']  . "'  AND end_date=0 
Limit 1 "; //  echo $updatecrmsql;exit;
		if($ck_value>0 ) $this->objsetup->CSI($updatecrmsql);
		
		 //delete in bucket
	   $presql = "UPDATE crm_salesperson  SET  end_date='" . current_date . "'   WHERE module_id='".$arr_attr['id']."' AND type='". $arr_attr['type']  . "'  ";  
	   //echo $presql;exit; // AND salesperson_id='". $arr_attr['pre_sale_person']  . "'   Limit 1 
		$this->objsetup->CSI($presql);
		 
		  //add new  in bucket
		$replacesql = "INSERT INTO crm_salesperson (module_id,salesperson_id,type,is_primary,company_id,  user_id,bucket_id,start_date) VALUES (  '" . $arr_attr['id']  . "' ," .$arr_attr['replace_sale_person']    . " ,". $arr_attr['type']  . ",	'0'	," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . ",'" . $arr_attr['bucket_id'] . "'	,'" . current_date . "' )  "; //echo $replacesql;exit;
		if($ck_value>0 )  $this->objsetup->CSI($replacesql);
		
	  //add selected  in bucket
        $check = false;
		$Sql = "INSERT INTO crm_salesperson (module_id,salesperson_id,type,is_primary,company_id,  user_id,bucket_id,start_date) VALUES ";		 
		foreach ($arr_attr['salespersons'] as $item) { 
			//if($ck_value>0 )
			$Sql .= "(  '" . $arr_attr['id']  . "' ," . $item->id   . " ,". $arr_attr['type']  . ",	'" . $item->isPrimary . "'	," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . ",'" . $arr_attr['bucket_id'] . "'	,'" . current_date . "' ), "; 
				
			 $check = true;
		}
		$Sql= substr_replace(substr($Sql, 0, -1), "", -1);
	//	echo  $Sql;exit;
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
	
	
	
 //----------------------crm_sale_person_bucket ----------------

 
 	function get_sale_person_baket_list($attr){
		$this->objGeneral->mysql_clean($attr); 
		
		$limit_clause = $where_clause = "";
		
		
		if(!empty($attr['bk_id']))$where_clause .= "AND c.baket_id='$attr[bk_id]' ";
		  
		 
		$response = array();
		
		$Sql = "SELECT   c.* FROM  crm_sale_bucket_sp c
		JOIN company on company.id=c.company_id
		 where  c.status=1  
		 AND(c.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")		 
		$where_clause
		order by c.id DESC" ;
		 
		$RS = $this->objsetup->CSI($Sql);
	 
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result = array();
				$result['id'] = $Row['id'];  
				$result['name'] = $Row['baket_name'];
				 	
				$result['starting_date'] =$this->objGeneral->convert_unix_into_date($Row['starting_date']);
				$result['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);
			 
				$response['response'][] = $result;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;							
		}
		else 
			$response['response'][] = array();
		
		return $response;
	}
	
	function get_sale_person_baket_data_by_id($id) {
       
		$Sql = "SELECT * FROM crm_sale_bucket_sp	WHERE id=$id LIMIT 1";
	//	echo $Sql;exit;
				
		$RS = $this->objsetup->CSI($Sql);
	
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			
			$Row['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
			$Row['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);
			 
			
			$response['response'] = $Row;
		$response['ack'] = 1;
		$response['error'] = NULL;
		}
		else $response['response'] = array();
		
		//print_r($response);exit;
		return $response;
    }
	
	function add_sale_person_baket($arr_attr){ 
			$this->objGeneral->mysql_clean($arr_attr); 
			
						
			//	print_r($arr_attr);exit;
			  $sdate=$this->objGeneral->convert_date($arr_attr['starting_date']);
			 $edate=$this->objGeneral->convert_date($arr_attr['ending_date']);
			 
			 $id=$arr_attr['id'];  
			 if($id==0){  
			 
			 
			  if($arr_attr['id']>0)   $where_id = " AND tst.id <> '".$arr_attr['id']."' ";
		
		$data_pass = "  tst.baket_name='" . $arr_attr['baket_name'] . "'
				 AND ( (tst.starting_date >= '".$sdate."' AND tst.ending_date <= '".$sdate."')	
				 Or( tst.starting_date >= '".$edate."' AND tst.ending_date <= '".$edate."')	)
				 $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('crm_sale_bucket_sp', $data_pass, $this->arrUser['company_id']);
 
        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
		
		
						$Sql = "INSERT INTO crm_sale_bucket_sp
						SET  
						baket_id='$arr_attr[baket_id]' ,baket_name='$arr_attr[baket_name]' 	
						,starting_date = '" . $sdate. "',ending_date = '" .$edate . "'
						,company_id='".$this->arrUser['company_id']."'
						,user_id='".$this->arrUser['id']."',created_date='".current_date."'	,status=1
						";	
						$msg='Inserted'; 
					} 
			else {	 
				$Sql = "UPDATE crm_sale_bucket_sp 
				SET  baket_id='$arr_attr[baket_id]' ,baket_name='$arr_attr[baket_name]' 
				,starting_date = '" . $sdate. "',ending_date = '" .$edate . "'	WHERE id = $id Limit 1 "; 
					$msg='Updated'; 
			 }
			 
				//echo $Sql;exit;
		  $rs  = $this->objsetup->CSI($Sql); 
			 if($id== 0)	$id = $this->Conn->Insert_ID(); 
		 
		 
		 if($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['id'] =  $id;
			$response['error'] = NULL; 
		} 
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not '.$msg;
			
		}
			return $response;
	}
  
 
 
 
}
?>