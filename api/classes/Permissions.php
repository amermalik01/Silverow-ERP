<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH."/classes/Xtreme.php");
require_once(SERVER_PATH."/classes/General.php");

class Permissions extends Xtreme{ 

	private $Conn = null;
	private $objGeneral = null;
	private $arrUser = null;
	
	function __construct($user_info=array()){
		
		parent::__construct();
		$this->Conn = parent::GetConnection();
		$this->objGeneral = new General($user_info);
		$this->arrUser = $user_info;
	}
	
	############	Start: permission ##############
	function get_permissions($attr){
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";
		//print_r($attr);
		$limit_clause = $where_clause = "";
	
		if(!empty($attr['keyword'])){
			$where_clause .= " AND role_id LIKE '%$attr[keyword]%' ";
		}
		if(empty($attr['all'])){
			if(empty($attr['start'])) $attr['start'] = 0;
			if(empty($attr['limit'])) $attr['limit'] = 10;
			$limit_clause = " LIMIT $attr[start] , $attr[limit]";
		}
		$response = array();
		
		$Sql = "SELECT id, role_id, mod_detail_id, company_id, user_id
				FROM permission
				WHERE 1 
				".$where_clause."
				ORDER BY id ASC";
		
		$sql_total = "SELECT COUNT(*) as total FROM ($Sql) as tabless";		
		$rs_count = $this->Conn->Execute($sql_total);
		$total = $rs_count->fields['total'];
		$Sql .= $limit_clause;
		$RS = $this->Conn->Execute($Sql);
		$response['ack'] = 1;
		$response['error'] = NULL;
		$response['total'] = $total;
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result = array();
				$result['id'] = $Row['id'];
				$result['role_id'] = $Row['role_id'];
				$result['mod_detail_id'] = $Row['mod_detail_id'];
				$response['response'][] = $result;
			}							
		}else{
			$response['response'][] = array();
		}
		return $response;
	}
	
	function get_permission_by_id($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM permission
				WHERE id='".$attr['id']."'
				LIMIT 1";
		$RS = $this->Conn->Execute($Sql);
		$response['ack'] = 1;
		$response['error'] = NULL;
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
		}else{
			$response['response'] = array();
		}
		return $response;
				
	}
	
	function get_permission_by_user($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM permission
				WHERE user_id='$attr[user_id]'
				LIMIT 1";
		$RS = $this->Conn->Execute($Sql);
		$response['ack'] = 1;
		$response['error'] = NULL;
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
		}else{
			$response['response'] = array();
		}
		return $response;
				
	}
		
	function add_permission($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "INSERT INTO permission
				SET 
					role_id='$arr_attr[role_id]',
					mod_detail_id='$arr_attr[mod_detail_id]',
<<<<<<< HEAD
					company_id='$arr_attr[company_id]',
					user_id='$arr_attr[user_id]',
					status='$arr_attr[status]'";
=======
					company_id='".$arr_attr['company_id']."',
					user_id='".$arr_attr['user_id']."',
					status='".$arr_attr['status']."'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					
		$RS = $this->Conn->Execute($Sql);
		$id = $this->Conn->Insert_ID();
		
		if($id > 0){
			$response['ack'] = 1;
			$response['error'] = NULL;
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not inserted!';
		}
		
		return $response;
				
	}
	
	function update_permission($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "UPDATE permission
				SET 
					role_id='$arr_attr[role_id]',
					mod_detail_id='$arr_attr[mod_detail_id]',
<<<<<<< HEAD
					company_id='$arr_attr[company_id]',
					user_id='$arr_attr[user_id]',
					status='$arr_attr[status]'
=======
					company_id='".$arr_attr['company_id']."',
					user_id='".$arr_attr['user_id']."',
					status='".$arr_attr['status']."'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					WHERE id = ".$arr_attr['id']." ";
	
		$RS = $this->Conn->Execute($Sql);
	
		if($this->Conn->Affected_Rows() > 0){
			$response['ack'] = 1;
			$response['error'] = NULL;
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not updated!';
		}
		
		return $response;
				
	}
	
	function delete_permission($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM permission
				WHERE id = ".$arr_attr['id']." Limit 1";
		$RS = $this->Conn->Execute($Sql);
	
		if($this->Conn->Affected_Rows() > 0){
			$response['ack'] = 1;
			$response['error'] = NULL;
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not deleted!';
		}
		
		return $response;
				
	}
	
	function status_permission($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

<<<<<<< HEAD
		$Sql = "UPDATE permission SET status='$arr_attr[status]' WHERE id = ".$arr_attr['id']." Limit 1";
=======
		$Sql = "UPDATE permission SET status='".$arr_attr['status']."' WHERE id = ".$arr_attr['id']." Limit 1";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		//exit;
		$RS = $this->Conn->Execute($Sql);
	
		if($this->Conn->Affected_Rows() > 0){
			$response['ack'] = 1;
			$response['error'] = NULL;
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not updated!';
		}
		
		return $response;
				
	}
	############	End: permission ################
	
	
}	
?>