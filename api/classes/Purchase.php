<?php
// error_reporting(E_ERROR);
<<<<<<< HEAD
require_once(SERVER_PATH."/classes/Xtreme.php");
require_once(SERVER_PATH."/classes/General.php");
require_once(SERVER_PATH. "/classes/Setup.php");

class Purchase extends Xtreme{ 
=======
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Setup.php");

class Purchase extends Xtreme
{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	//echo "In class";
	//exit;
	private $Conn = null;
	private $objGeneral = null;
	private $arrUser = null;
<<<<<<< HEAD
    private $objsetup = null;
	
	function __construct($user_info=array()){
=======
	private $objsetup = null;

	function __construct($user_info = array())
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		//echo "In class";exit;
		parent::__construct();
		$this->Conn = parent::GetConnection();
		$this->objGeneral = new General($user_info);
		$this->arrUser = $user_info;
<<<<<<< HEAD
        $this->objsetup = new Setup($this->arrUser);
	}
	
	############	Start: Shipping Agents ##############
	function get_shipping_agents($attr){
=======
		$this->objsetup = new Setup($this->arrUser);
	}

	############	Start: Shipping Agents ##############
	function get_shipping_agents($attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";
		//print_r($attr);
		$limit_clause = $where_clause = "";
<<<<<<< HEAD
	
		if(!empty($attr['keyword'])) $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
		 
		 $response = array();
		
		 
		 $Sql = "SELECT shipping_agent.id, shipping_agent.name,  shipping_agent.code,  shipping_agent.telephone, shipping_agent.telephone,  shipping_agent.status  FROM shipping_agent 
		left  JOIN company on company.id=shipping_agent.company_id 
		where shipping_agent.status=1 and ( shipping_agent.company_id=".$this->arrUser['company_id']." 
		or  company.parent_id=".$this->arrUser['company_id'].")
		order by shipping_agent.id DESC";
		
		 
		$RS = $this->objsetup->CSI($Sql);
		  
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
=======

		if (!empty($attr['keyword'])) $where_clause .= " AND name LIKE '%$attr[keyword]%' ";

		$response = array();


		$Sql = "SELECT shipping_agent.id, shipping_agent.name,  shipping_agent.code,  shipping_agent.telephone, shipping_agent.telephone,  shipping_agent.status  FROM shipping_agent 
		left  JOIN company on company.id=shipping_agent.company_id 
		where shipping_agent.status=1 and ( shipping_agent.company_id=" . $this->arrUser['company_id'] . " 
		or  company.parent_id=" . $this->arrUser['company_id'] . ")
		order by shipping_agent.id DESC";


		$RS = $this->objsetup->CSI($Sql);


		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				$result = array();
				$result['id'] = $Row['id'];
				$result['code'] = $Row['code'];
				$result['name'] = $Row['name'];
				$result['phone'] = $Row['telephone'];/*
				$result['city'] = $Row['city'];
				$result['fax'] = $Row['fax'];*/
				$response['response'][] = $result;
<<<<<<< HEAD
			 }$response['ack'] = 1;
		$response['error'] = NULL;							
		}else{
=======
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			$response['response'][] = array();
		}
		return $response;
	}
<<<<<<< HEAD
	
	function get_shipping_agent_by_id($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM shipping_agent
				WHERE id='".$attr['id']."'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
	 
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
		  $response['ack'] = 1;
		$response['error'] = NULL;}else{
			$response['response'] = array();
		}
		return $response;
				
	}
		
	function add_shipping_agent($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		 	$sql_total = "SELECT  count(id) as total	FROM shipping_agent
			 where  name='".$arr_attr['name']."' and company_id='".$this->arrUser['company_id']."' ";	
				$rs_count = $this->objsetup->CSI($sql_total);
				$total = $rs_count->fields['total'];
				 
 
 
 	
 $data_pass = "  tst.name='" . $arr_attr['name'] . "' ";
        $total = $this->objGeneral->count_duplicate_in_sql('shipping_agent', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }

				 	 
					  $Sql = "INSERT INTO shipping_agent
							SET 
								name='".$arr_attr['name']."',
								coverage_area='$arr_attr[coverage_area]', 
								contact_person='$arr_attr[contact_person]', 
								telephone='$arr_attr[telephone]', 
								fax='$arr_attr[fax]', 
								email='$arr_attr[email]', 
								city='$arr_attr[city]', 					
								company_id='".$this->arrUser['company_id']."',
								user_id='".$this->arrUser['id']."',
								date_added='".current_date."'";
													
								
					$RS = $this->objsetup->CSI($Sql);
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
	
	function update_shipping_agent($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		
		 
 
 if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
 $data_pass = "  tst.name='" . $arr_attr['name'] . "' ";
        $total = $this->objGeneral->count_duplicate_in_sql('shipping_agent', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }

		
		$Sql = "UPDATE shipping_agent
				SET 
					name='".$arr_attr['name']."',
=======

	function get_shipping_agent_by_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM shipping_agent
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($RS->RecordCount() > 0) {
			$Row = $RS->FetchRow();
			foreach ($Row as $key => $value) {
				if (is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['response'] = array();
		}
		return $response;
	}

	function add_shipping_agent($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$sql_total = "SELECT  count(id) as total	FROM shipping_agent
					  where  name='" . $arr_attr['name'] . "' and company_id='" . $this->arrUser['company_id'] . "' ";
		$rs_count = $this->objsetup->CSI($sql_total);
		$total = $rs_count->fields['total'];
		$data_pass = "  tst.name='" . $arr_attr['name'] . "' ";

		$total = $this->objGeneral->count_duplicate_in_sql('shipping_agent', $data_pass, $this->arrUser['company_id']);

		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}

		$Sql = "INSERT INTO shipping_agent
			SET 
				name='" . $arr_attr['name'] . "',
				coverage_area='$arr_attr[coverage_area]', 
				contact_person='$arr_attr[contact_person]', 
				telephone='$arr_attr[telephone]', 
				fax='$arr_attr[fax]', 
				email='$arr_attr[email]', 
				city='$arr_attr[city]', 					
				company_id='" . $this->arrUser['company_id'] . "',
				user_id='" . $this->arrUser['id'] . "',
				date_added='" . current_date . "'";

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

	function update_shipping_agent($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);




		if ($arr_attr['id'] > 0)   $where_id = " AND tst.id != '" . $arr_attr['id'] . "' ";

		$data_pass = "  tst.name='" . $arr_attr['name'] . "' ";
		$total = $this->objGeneral->count_duplicate_in_sql('shipping_agent', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}


		$Sql = "UPDATE shipping_agent
				SET 
					name='" . $arr_attr['name'] . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					coverage_area='$arr_attr[coverage_area]', 
					contact_person='$arr_attr[contact_person]', 
					telephone='$arr_attr[telephone]', 
					fax='$arr_attr[fax]', 
					email='$arr_attr[email]', 
					city='$arr_attr[city]', 
<<<<<<< HEAD
					company_id='$arr_attr[company_id]'
					WHERE id = ".$arr_attr['id']." Limit 1";

		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function delete_shipping_agent($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);
		$Sql = "UPDATE shipping_agent
				SET status = 0
				WHERE id = ".$arr_attr['id']." Limit 1";
		/*$Sql = "DELETE FROM shipping_agent
				WHERE  Limit 1";*/
		$RS = $this->objsetup->CSI($Sql);
	
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
	############	End: Shipping Agents ################
	
	############	Start: Shipping Prices ##############
	function get_shipping_prices($attr){
=======
					company_id='" . $arr_attr['company_id'] . "'
					WHERE id = " . $arr_attr['id'] . " Limit 1";

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

	function delete_shipping_agent($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);
		$Sql = "UPDATE shipping_agent
				SET status = 0
				WHERE id = " . $arr_attr['id'] . " Limit 1";
		/*$Sql = "DELETE FROM shipping_agent
				WHERE  Limit 1";*/
		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not deleted!';
		}

		return $response;
	}
	############	End: Shipping Agents ################

	############	Start: Shipping Prices ##############
	function get_shipping_prices($attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";
		//print_r($attr);
		$limit_clause = $where_clause = "";
<<<<<<< HEAD
	
		if(!empty($attr['keyword'])) 	$where_clause .= " AND price LIKE '%$attr[keyword]%' ";
		 
		 
		$response = array();
		
		$Sql = "SELECT id, coverage_areas_id, price, shipping_measurements_id, shipping_agent_id
				FROM shipping_prices
				WHERE 1 
				".$where_clause."
				ORDER BY id DESC";
		
		 
		$RS = $this->objsetup->CSI($Sql);
	  
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
=======

		if (!empty($attr['keyword'])) 	$where_clause .= " AND price LIKE '%$attr[keyword]%' ";


		$response = array();

		$Sql = "SELECT id, coverage_areas_id, price, shipping_measurements_id, shipping_agent_id
				FROM shipping_prices
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";


		$RS = $this->objsetup->CSI($Sql);


		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				$result = array();
				$result['id'] = $Row['id'];
				$result['coverage_areas_id'] = $Row['coverage_areas_id'];
				$result['price'] = $Row['price'];
				$result['shipping_measurements_id'] = $Row['shipping_measurements_id'];
				$result['shipping_agent_id'] = $Row['shipping_agent_id'];
				$response['response'][] = $result;
<<<<<<< HEAD
			 }$response['ack'] = 1;
		$response['error'] = NULL;							
		}else{
=======
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			$response['response'][] = array();
		}
		return $response;
	}
<<<<<<< HEAD
	
	function get_shipping_price_by_id($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM shipping_prices
				WHERE id='".$attr['id']."'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
		 
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
		  $response['ack'] = 1;
		$response['error'] = NULL;}else{
			$response['response'] = array();
		}
		return $response;
				
	}
		
	function add_shipping_price($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);
		
		 
 
  		
 $data_pass = "  tst.coverage_areas_id='" . $arr_attr['coverage_areas_id'] . "' ";
        $total = $this->objGeneral->count_duplicate_in_sql('shipping_prices', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }

		
		
=======

	function get_shipping_price_by_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM shipping_prices
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($RS->RecordCount() > 0) {
			$Row = $RS->FetchRow();
			foreach ($Row as $key => $value) {
				if (is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['response'] = array();
		}
		return $response;
	}

	function add_shipping_price($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);




		$data_pass = "  tst.coverage_areas_id='" . $arr_attr['coverage_areas_id'] . "' ";
		$total = $this->objGeneral->count_duplicate_in_sql('shipping_prices', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}



>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

		$Sql = "INSERT INTO shipping_prices
				SET 
					coverage_areas_id='$arr_attr[coverage_areas_id]',
					price='$arr_attr[price]', 
					shipping_measurements_id='$arr_attr[shipping_measurements_id]', 
					shipping_agent_id='$arr_attr[shipping_agent_id]'";
<<<<<<< HEAD
					
		$RS = $this->objsetup->CSI($Sql);
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
	
	function update_shipping_price($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);
 
 
 if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
 $data_pass = "  tst.coverage_areas_id='" . $arr_attr['coverage_areas_id'] . "' ";
        $total = $this->objGeneral->count_duplicate_in_sql('shipping_prices', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
=======

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

	function update_shipping_price($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);


		if ($arr_attr['id'] > 0)   $where_id = " AND tst.id != '" . $arr_attr['id'] . "' ";

		$data_pass = "  tst.coverage_areas_id='" . $arr_attr['coverage_areas_id'] . "' ";
		$total = $this->objGeneral->count_duplicate_in_sql('shipping_prices', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

		$Sql = "UPDATE shipping_prices
				SET 
					coverage_areas_id='$arr_attr[coverage_areas_id]',
					price='$arr_attr[price]', 
					shipping_measurements_id='$arr_attr[shipping_measurements_id]', 
					shipping_agent_id='$arr_attr[shipping_agent_id]'
<<<<<<< HEAD
					WHERE id = ".$arr_attr['id']." Limit 1 ";

		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function delete_shipping_price($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM shipping_prices
				WHERE id = ".$arr_attr['id']." Limit 1";
		$RS = $this->objsetup->CSI($Sql);
	
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
	############	End: Shipping Prices ################
	
	############	Start: Vednors ##############
	function get_vendors($attr){
=======
					WHERE id = " . $arr_attr['id'] . " Limit 1 ";

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

	function delete_shipping_price($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM shipping_prices
				WHERE id = " . $arr_attr['id'] . " Limit 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not deleted!';
		}

		return $response;
	}
	############	End: Shipping Prices ################

	############	Start: Vednors ##############
	function get_vendors($attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";
		//print_r($attr);
		$limit_clause = $where_clause = "";
<<<<<<< HEAD
	
		if(!empty($attr['keyword'])) $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
		 
		 
		$response = array();
		
		$Sql = "SELECT id, name, contact_person, address1, mobile
				FROM vendors
				WHERE 1 
				".$where_clause."
				ORDER BY id DESC";
		
	 
		$RS = $this->objsetup->CSI($Sql);
		  
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
=======

		if (!empty($attr['keyword'])) $where_clause .= " AND name LIKE '%$attr[keyword]%' ";


		$response = array();

		$Sql = "SELECT id, name, contact_person, address1, mobile
				FROM vendors
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";


		$RS = $this->objsetup->CSI($Sql);


		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				$result = array();
				$result['id'] = $Row['id'];
				$result['name'] = $Row['name'];
				$result['contact_person'] = $Row['contact_person'];
				$result['address1'] = $Row['address1'];
				$result['mobile'] = $Row['mobile'];
				$response['response'][] = $result;
<<<<<<< HEAD
			 }$response['ack'] = 1;
		$response['error'] = NULL;							
		}else{
=======
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			$response['response'][] = array();
		}
		return $response;
	}
<<<<<<< HEAD
	
	function get_vendor_by_id($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM vendors
				WHERE id='".$attr['id']."'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
		 
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
	  $response['ack'] = 1;
		$response['error'] = NULL;	}else{
			$response['response'] = array();
		}
		return $response;
				
	}
		
	function add_vendor($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);
		
		
		  
 $data_pass = "  tst.agent_no='" . $arr_attr['agent_no'] . "' and tst.name='".$arr_attr['name']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('vendors', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
=======

	function get_vendor_by_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM vendors
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($RS->RecordCount() > 0) {
			$Row = $RS->FetchRow();
			foreach ($Row as $key => $value) {
				if (is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['response'] = array();
		}
		return $response;
	}

	function add_vendor($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);



		$data_pass = "  tst.agent_no='" . $arr_attr['agent_no'] . "' and tst.name='" . $arr_attr['name'] . "' ";
		$total = $this->objGeneral->count_duplicate_in_sql('vendors', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


		$Sql = "INSERT INTO vendors
				SET 
					agent_no='$arr_attr[agent_no]',
<<<<<<< HEAD
					name='".$arr_attr['name']."', 
=======
					name='" . $arr_attr['name'] . "', 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					address1='$arr_attr[address1]', 
					address2='$arr_attr[address2]', 
					city='$arr_attr[city]', 
					county='$arr_attr[county]', 
					postcode='$arr_attr[postcode]', 
					country='$arr_attr[country]', 
					coverage_area='$arr_attr[coverage_area]', 
					contact_person='$arr_attr[contact_person]', 
					mobile='$arr_attr[mobile]', 
					phone='$arr_attr[phone]', 
					email='$arr_attr[email]', 
					fax='$arr_attr[fax]', 
					website='$arr_attr[website]', 
<<<<<<< HEAD
					type='".$arr_attr['type']."', 
					outlet_id='$arr_attr[outlet_id]'";
					
		$RS = $this->objsetup->CSI($Sql);
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
	
	function update_vendor($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);
		
		
 if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
 $data_pass = "  tst.agent_no='" . $arr_attr['agent_no'] . "' and tst.name='".$arr_attr['name']."' ";
        $total = $this->objGeneral->count_duplicate_in_sql('vendors', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
=======
					type='" . $arr_attr['type'] . "', 
					outlet_id='$arr_attr[outlet_id]'";

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

	function update_vendor($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);


		if ($arr_attr['id'] > 0)   $where_id = " AND tst.id != '" . $arr_attr['id'] . "' ";

		$data_pass = "  tst.agent_no='" . $arr_attr['agent_no'] . "' and tst.name='" . $arr_attr['name'] . "' ";
		$total = $this->objGeneral->count_duplicate_in_sql('vendors', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

		$Sql = "UPDATE vendors
				SET 
					agent_no='$arr_attr[agent_no]',
<<<<<<< HEAD
					name='".$arr_attr['name']."', 
=======
					name='" . $arr_attr['name'] . "', 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					address1='$arr_attr[address1]', 
					address2='$arr_attr[address2]', 
					city='$arr_attr[city]', 
					county='$arr_attr[county]', 
					postcode='$arr_attr[postcode]', 
					country='$arr_attr[country]', 
					coverage_area='$arr_attr[coverage_area]', 
					contact_person='$arr_attr[contact_person]', 
					mobile='$arr_attr[mobile]', 
					phone='$arr_attr[phone]', 
					email='$arr_attr[email]', 
					fax='$arr_attr[fax]', 
					website='$arr_attr[website]', 
<<<<<<< HEAD
					type='".$arr_attr['type']."', 
					outlet_id='$arr_attr[outlet_id]'
					WHERE id = ".$arr_attr['id']." Limit 1 ";

		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function delete_vendor($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM vendors
				WHERE id = ".$arr_attr['id']." Limit 1";
		$RS = $this->objsetup->CSI($Sql);
	
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
	############	End: Vednors ################
	
	############	Start: Vednors Finance ##############
	function get_vendors_finance($attr){
=======
					type='" . $arr_attr['type'] . "', 
					outlet_id='$arr_attr[outlet_id]'
					WHERE id = " . $arr_attr['id'] . " Limit 1 ";

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

	function delete_vendor($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM vendors
				WHERE id = " . $arr_attr['id'] . " Limit 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not deleted!';
		}

		return $response;
	}
	############	End: Vednors ################

	############	Start: Vednors Finance ##############
	function get_vendors_finance($attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";
		//print_r($attr);
		$limit_clause = $where_clause = "";
<<<<<<< HEAD
	
		if(!empty($attr['keyword'])) $where_clause .= " AND name LIKE '%$attr[keyword]%' ";
		 
		$response = array();
		
		$Sql = "SELECT id, contact_person, 	alt_contact_person, alt_contact_email, phone
				FROM vendors_finance
				WHERE 1 
				".$where_clause."
				ORDER BY id DESC";
		
		 
		$RS = $this->objsetup->CSI($Sql);
	  
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
=======

		if (!empty($attr['keyword'])) $where_clause .= " AND name LIKE '%$attr[keyword]%' ";

		$response = array();

		$Sql = "SELECT id, contact_person, 	alt_contact_person, alt_contact_email, phone
				FROM vendors_finance
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";


		$RS = $this->objsetup->CSI($Sql);


		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				$result = array();
				$result['id'] = $Row['id'];
				$result['contact_person'] = $Row['contact_person'];
				$result['alt_contact_person'] = $Row['alt_contact_person'];
				$result['alt_contact_email'] = $Row['alt_contact_email'];
				$result['phone'] = $Row['phone'];
				$response['response'][] = $result;
<<<<<<< HEAD
			 }$response['ack'] = 1;
		$response['error'] = NULL;							
		}else{
=======
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			$response['response'][] = array();
		}
		return $response;
	}
<<<<<<< HEAD
	
	function get_vendors_finance_by_id($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM vendors_finance
				WHERE id='".$attr['id']."'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
		 
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
		  $response['ack'] = 1;
		$response['error'] = NULL;}else{
			$response['response'] = array();
		}
		return $response;
				
	}
		
	function add_vendors_finance($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);
		
		
		 
 $data_pass = "  tst.vendor_id='" . $arr_attr['vendor_id'] . "' and tst.contact_person='$arr_attr[contact_person]' ";
        $total = $this->objGeneral->count_duplicate_in_sql('vendors_finance', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
=======

	function get_vendors_finance_by_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM vendors_finance
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($RS->RecordCount() > 0) {
			$Row = $RS->FetchRow();
			foreach ($Row as $key => $value) {
				if (is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['response'] = array();
		}
		return $response;
	}

	function add_vendors_finance($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);



		$data_pass = "  tst.vendor_id='" . $arr_attr['vendor_id'] . "' and tst.contact_person='$arr_attr[contact_person]' ";
		$total = $this->objGeneral->count_duplicate_in_sql('vendors_finance', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

		$Sql = "INSERT INTO vendors_finance
				SET 
					vendor_id='$arr_attr[vendor_id]',
					contact_person='$arr_attr[contact_person]', 
					alt_contact_person='$arr_attr[alt_contact_person]', 
					alt_contact_email='$arr_attr[alt_contact_email]', 
					email='$arr_attr[email]', 
					phone='$arr_attr[phone]', 
					fax='$arr_attr[fax]', 
					pay_to_vendor_id='$arr_attr[pay_to_vendor_id]', 
					gen_bus_posting_group='$arr_attr[gen_bus_posting_group]', 
					vat_bus_posting_group='$arr_attr[vat_bus_posting_group]', 
					vendor_posting_group='$arr_attr[vendor_posting_group]', 
					payment_terms_id='$arr_attr[payment_terms_id]', 
					payment_method_id='$arr_attr[payment_method_id]', 
					bank_account_id='$arr_attr[bank_account_id]', 
					currency_id='$arr_attr[currency_id]', 
					emp_id='$arr_attr[emp_id]', 
					prices_including_vat='$arr_attr[prices_including_vat]', 
					remittance_by_email='$arr_attr[remittance_by_email]'";
<<<<<<< HEAD
					
		$RS = $this->objsetup->CSI($Sql);
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
	
	function update_vendors_finance($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		
		
		
 if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
 $data_pass = "  tst.vendor_id='" . $arr_attr['vendor_id'] . "' and tst.contact_person='$arr_attr[contact_person]' ";
        $total = $this->objGeneral->count_duplicate_in_sql('vendors_finance', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
		
		
=======

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

	function update_vendors_finance($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);




		if ($arr_attr['id'] > 0)   $where_id = " AND tst.id != '" . $arr_attr['id'] . "' ";

		$data_pass = "  tst.vendor_id='" . $arr_attr['vendor_id'] . "' and tst.contact_person='$arr_attr[contact_person]' ";
		$total = $this->objGeneral->count_duplicate_in_sql('vendors_finance', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$Sql = "UPDATE vendors_finance
				SET 
					vendor_id='$arr_attr[vendor_id]',
					contact_person='$arr_attr[contact_person]', 
					alt_contact_person='$arr_attr[alt_contact_person]', 
					alt_contact_email='$arr_attr[alt_contact_email]', 
					email='$arr_attr[email]', 
					phone='$arr_attr[phone]', 
					fax='$arr_attr[fax]', 
					pay_to_vendor_id='$arr_attr[pay_to_vendor_id]', 
					gen_bus_posting_group='$arr_attr[gen_bus_posting_group]', 
					vat_bus_posting_group='$arr_attr[vat_bus_posting_group]', 
					vendor_posting_group='$arr_attr[vendor_posting_group]', 
					payment_terms_id='$arr_attr[payment_terms_id]', 
					payment_method_id='$arr_attr[payment_method_id]', 
					bank_account_id='$arr_attr[bank_account_id]', 
					currency_id='$arr_attr[currency_id]', 
					emp_id='$arr_attr[emp_id]', 
					prices_including_vat='$arr_attr[prices_including_vat]', 
					remittance_by_email='$arr_attr[remittance_by_email]'
<<<<<<< HEAD
					WHERE id = ".$arr_attr['id']." Limit 1 ";

		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function delete_vendors_finance($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM vendors_finance
				WHERE id = ".$arr_attr['id']." Limit 1";
		$RS = $this->objsetup->CSI($Sql);
	
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
	############	End: Vednors Finance ################
	
	############	Start: Alt. Contacts (Purchase Contacts) ##############
	function get_purchase_contacts($attr){
=======
					WHERE id = " . $arr_attr['id'] . " Limit 1 ";

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

	function delete_vendors_finance($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM vendors_finance
				WHERE id = " . $arr_attr['id'] . " Limit 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not deleted!';
		}

		return $response;
	}
	############	End: Vednors Finance ################

	############	Start: Alt. Contacts (Purchase Contacts) ##############
	function get_purchase_contacts($attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";
		//print_r($attr);
		$limit_clause = $where_clause = "";
<<<<<<< HEAD
	
		if(!empty($attr['keyword'])) $where_clause .= " AND contact_name LIKE '%$attr[keyword]%' ";
		 
	 
		$response = array();
		
		$Sql = "SELECT id, contact_name, mobile, email
				FROM purchase_contacts
				WHERE 1 
				".$where_clause."
				ORDER BY id DESC";
		
		 
		$RS = $this->objsetup->CSI($Sql);
		  
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
=======

		if (!empty($attr['keyword'])) $where_clause .= " AND contact_name LIKE '%$attr[keyword]%' ";


		$response = array();

		$Sql = "SELECT id, contact_name, mobile, email
				FROM purchase_contacts
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";


		$RS = $this->objsetup->CSI($Sql);


		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				$result = array();
				$result['id'] = $Row['id'];
				$result['contact_name'] = $Row['contact_name'];
				$result['mobile'] = $Row['mobile'];
				$result['email'] = $Row['email'];
				$response['response'][] = $result;
<<<<<<< HEAD
			 }$response['ack'] = 1;
		$response['error'] = NULL;							
		}else{
=======
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			$response['response'][] = array();
		}
		return $response;
	}
<<<<<<< HEAD
	
	function get_purchase_contact_by_id($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM purchase_contacts
				WHERE id='".$attr['id']."'
=======

	function get_purchase_contact_by_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM purchase_contacts
				WHERE id='" . $attr['id'] . "'
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
		$response['ack'] = 1;
		$response['error'] = NULL;
<<<<<<< HEAD
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
		  $response['ack'] = 1;
		$response['error'] = NULL;}else{
			$response['response'] = array();
		}
		return $response;
				
	}
		
	function add_purchase_contacts($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		
		
		
 		
 $data_pass = "  tst.vendor_id='" . $arr_attr['vendor_id'] . "' and tst.contact_name='$arr_attr[contact_name]' ";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_contacts', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
		
		
=======
		if ($RS->RecordCount() > 0) {
			$Row = $RS->FetchRow();
			foreach ($Row as $key => $value) {
				if (is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['response'] = array();
		}
		return $response;
	}

	function add_purchase_contacts($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);





		$data_pass = "  tst.vendor_id='" . $arr_attr['vendor_id'] . "' and tst.contact_name='$arr_attr[contact_name]' ";
		$total = $this->objGeneral->count_duplicate_in_sql('purchase_contacts', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$Sql = "INSERT INTO purchase_contacts
				SET 
					vendor_id='$arr_attr[vendor_id]',
					contact_name='$arr_attr[contact_name]', 
					mobile='$arr_attr[mobile]', 
					email='$arr_attr[email]'";
<<<<<<< HEAD
					
		$RS = $this->objsetup->CSI($Sql);
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
	
	function update_purchase_contacts($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

 if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
 $data_pass = "  tst.vendor_id='" . $arr_attr['vendor_id'] . "' and tst.contact_name='$arr_attr[contact_name]' ";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_contacts', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
=======

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

	function update_purchase_contacts($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		if ($arr_attr['id'] > 0)   $where_id = " AND tst.id != '" . $arr_attr['id'] . "' ";

		$data_pass = "  tst.vendor_id='" . $arr_attr['vendor_id'] . "' and tst.contact_name='$arr_attr[contact_name]' ";
		$total = $this->objGeneral->count_duplicate_in_sql('purchase_contacts', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$Sql = "UPDATE purchase_contacts
				SET 
					vendor_id='$arr_attr[vendor_id]',
					contact_name='$arr_attr[contact_name]', 
					mobile='$arr_attr[mobile]', 
					email='$arr_attr[email]'
<<<<<<< HEAD
					WHERE id = ".$arr_attr['id']." Limit 1 ";

		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function delete_purchase_contacts($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM purchase_contacts
				WHERE id = ".$arr_attr['id']." Limit 1";
		$RS = $this->objsetup->CSI($Sql);
	
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
	############	End: Alt. Contacts (Purchase Contacts) ##############
	
	############	Start: Purchase Quotes ##############
	function get_purchase_quotes($attr){
=======
					WHERE id = " . $arr_attr['id'] . " Limit 1 ";

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

	function delete_purchase_contacts($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM purchase_contacts
				WHERE id = " . $arr_attr['id'] . " Limit 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not deleted!';
		}

		return $response;
	}
	############	End: Alt. Contacts (Purchase Contacts) ##############

	############	Start: Purchase Quotes ##############
	function get_purchase_quotes($attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";
		//print_r($attr);
		$limit_clause = $where_clause = "";
<<<<<<< HEAD
	
		if(!empty($attr['keyword'])) $where_clause .= " AND 	quote_no LIKE '%$attr[keyword]%' ";
		 
		 
		$response = array();
		
		$Sql = "SELECT id, quote_no, contact, req_receipt_date
				FROM purchase_quotes
				WHERE 1 
				".$where_clause."
				ORDER BY id DESC";
		
		 
		$RS = $this->objsetup->CSI($Sql);
		  
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
=======

		if (!empty($attr['keyword'])) $where_clause .= " AND 	quote_no LIKE '%$attr[keyword]%' ";


		$response = array();

		$Sql = "SELECT id, quote_no, contact, req_receipt_date
				FROM purchase_quotes
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";


		$RS = $this->objsetup->CSI($Sql);


		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				$result = array();
				$result['id'] = $Row['id'];
				$result['quote_no'] = $Row['quote_no'];
				$result['contact'] = $Row['contact'];
				$result['req_receipt_date'] = $this->objGeneral->convert_unix_into_date($Row['req_receipt_date']);
				$response['response'][] = $result;
<<<<<<< HEAD
		 }$response['ack'] = 1;
		$response['error'] = NULL;						
		}else{
=======
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			$response['response'][] = array();
		}
		return $response;
	}
<<<<<<< HEAD
	
	function get_purchase_quote_by_id($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM purchase_quotes
				WHERE id='".$attr['id']."'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
		 
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
		  $response['ack'] = 1;
		$response['error'] = NULL;}else{
			$response['response'] = array();
		}
		return $response;
				
	}
		
	function add_purchase_quote($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		
		
  	
 $data_pass = "  tst.quote_no='" . $arr_attr['quote_no'] . "' and tst.contact='$arr_attr[contact]' ";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_quotes', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
		
		
=======

	function get_purchase_quote_by_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM purchase_quotes
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($RS->RecordCount() > 0) {
			$Row = $RS->FetchRow();
			foreach ($Row as $key => $value) {
				if (is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['response'] = array();
		}
		return $response;
	}

	function add_purchase_quote($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);




		$data_pass = "  tst.quote_no='" . $arr_attr['quote_no'] . "' and tst.contact='$arr_attr[contact]' ";
		$total = $this->objGeneral->count_duplicate_in_sql('purchase_quotes', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$Sql = "INSERT INTO purchase_quotes
				SET 
					quote_no='$arr_attr[quote_no]',
					vendor_id='$arr_attr[vendor_id]', 
					contact_id='$arr_attr[contact_id]',
					contact='$arr_attr[contact]',
<<<<<<< HEAD
					req_receipt_date='".$this->objGeneral->convert_date($arr_attr[req_receipt_date])."',
=======
					req_receipt_date='" . $this->objGeneral->convert_date($arr_attr['req_receipt_date']) . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					vendor_order_no	='$arr_attr[vendor_order_no]',
					net_amount='$arr_attr[net_amount]',
					tax_amount='$arr_attr[tax_amount]',
					grand_total='$arr_attr[grand_total]',
					currency_id='$arr_attr[currency_id]',
					comment='$arr_attr[comment]', 
					outlet_id='$arr_attr[outlet_id]'";
<<<<<<< HEAD
					
		$RS = $this->objsetup->CSI($Sql);
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
	
	function update_purchase_quote($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

 if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
 $data_pass = "  tst.quote_no='" . $arr_attr['quote_no'] . "' and tst.contact='$arr_attr[contact]' ";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_quotes', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
=======

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

	function update_purchase_quote($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		if ($arr_attr['id'] > 0)   $where_id = " AND tst.id != '" . $arr_attr['id'] . "' ";

		$data_pass = "  tst.quote_no='" . $arr_attr['quote_no'] . "' and tst.contact='$arr_attr[contact]' ";
		$total = $this->objGeneral->count_duplicate_in_sql('purchase_quotes', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$Sql = "UPDATE purchase_quotes
				SET 
					quote_no='$arr_attr[quote_no]',
					vendor_id='$arr_attr[vendor_id]', 
					contact_id='$arr_attr[contact_id]',
					contact='$arr_attr[contact]',
<<<<<<< HEAD
					req_receipt_date='".$this->objGeneral->convert_date($arr_attr[req_receipt_date])."',
=======
					req_receipt_date='" . $this->objGeneral->convert_date($arr_attr['req_receipt_date']) . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					vendor_order_no	='$arr_attr[vendor_order_no]',
					net_amount='$arr_attr[net_amount]',
					tax_amount='$arr_attr[tax_amount]',
					grand_total='$arr_attr[grand_total]',
					currency_id='$arr_attr[currency_id]',
					comment='$arr_attr[comment]', 
					outlet_id='$arr_attr[outlet_id]'
<<<<<<< HEAD
					WHERE id = ".$arr_attr['id']." ";

		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function delete_purchase_quote($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM purchase_quotes
				WHERE id = ".$arr_attr['id']." Limit 1";
		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function status_purchase_quote($arr_attr){
=======
					WHERE id = " . $arr_attr['id'] . " ";

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

	function delete_purchase_quote($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM purchase_quotes
				WHERE id = " . $arr_attr['id'] . " Limit 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not deleted!';
		}

		return $response;
	}

	function status_purchase_quote($arr_attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "UPDATE purchase_quotes
				SET 
<<<<<<< HEAD
					status='$arr_attr[status]'
					WHERE id = ".$arr_attr['id']." ";

		$RS = $this->objsetup->CSI($Sql);
	
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
	############	End: Purchase Quotes ##############
	
	############	Start: Purchase Inviocing ##############
	function get_purchase_invoicing($attr){
=======
					status='" . $arr_attr['status'] . "'
					WHERE id = " . $arr_attr['id'] . " ";

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
	############	End: Purchase Quotes ##############

	############	Start: Purchase Inviocing ##############
	function get_purchase_invoicing($attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";
		//print_r($attr);
		$limit_clause = $where_clause = "";
<<<<<<< HEAD
	
		if(!empty($attr['keyword'])) 	$where_clause .= " AND 	quote_id LIKE '%$attr[keyword]%' ";
		 
		 
		$response = array();
		
		$Sql = "SELECT id, quote_id, contact_id, vendor_name
				FROM purchase_invoicing
				WHERE 1 
				".$where_clause."
				ORDER BY id DESC";
		
	 
		$RS = $this->objsetup->CSI($Sql);
		 	
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
=======

		if (!empty($attr['keyword'])) 	$where_clause .= " AND 	quote_id LIKE '%$attr[keyword]%' ";


		$response = array();

		$Sql = "SELECT id, quote_id, contact_id, vendor_name
				FROM purchase_invoicing
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";


		$RS = $this->objsetup->CSI($Sql);

		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				$result = array();
				$result['id'] = $Row['id'];
				$result['quote_id'] = $Row['quote_id'];
				$result['contact_id'] = $Row['contact_id'];
				$result['vendor_name'] = $Row['vendor_name'];
				$response['response'][] = $result;
<<<<<<< HEAD
			 }$response['ack'] = 1;
		$response['error'] = NULL;							
		}else{
=======
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			$response['response'][] = array();
		}
		return $response;
	}
<<<<<<< HEAD
	
	function get_purchase_invoicing_by_id($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM purchase_invoicing
				WHERE id='".$attr['id']."'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
		 
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
		  $response['ack'] = 1;
		$response['error'] = NULL;}else{
			$response['response'] = array();
		}
		return $response;
				
	}
		
	function add_purchase_invoicing($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

 if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
 $data_pass = "  tst.quote_no='" . $arr_attr['quote_no'] . "' and tst.contact='$arr_attr[contact]' ";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_quotes', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
=======

	function get_purchase_invoicing_by_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM purchase_invoicing
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($RS->RecordCount() > 0) {
			$Row = $RS->FetchRow();
			foreach ($Row as $key => $value) {
				if (is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['response'] = array();
		}
		return $response;
	}

	function add_purchase_invoicing($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		if ($arr_attr['id'] > 0)   $where_id = " AND tst.id != '" . $arr_attr['id'] . "' ";

		$data_pass = "  tst.quote_no='" . $arr_attr['quote_no'] . "' and tst.contact='$arr_attr[contact]' ";
		$total = $this->objGeneral->count_duplicate_in_sql('purchase_quotes', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$Sql = "INSERT INTO purchase_invoicing
				SET 
					quote_id='$arr_attr[quote_id]',
					order_id='$arr_attr[order_id]', 
					vendor_id='$arr_attr[vendor_id]',
					contact_id='$arr_attr[contact_id]',
					vendor_name='$arr_attr[vendor_name]',
					address1='$arr_attr[address1]',
					address2='$arr_attr[address2]',
					city='$arr_attr[city]',
					county='$arr_attr[county]',
					postcode='$arr_attr[postcode]',
					phone='$arr_attr[phone]', 
					fax='$arr_attr[fax]', 
					email='$arr_attr[email]', 
					contact='$arr_attr[contact]', 
					payment_term_id='$arr_attr[payment_term_id]', 
					payment_method_id='$arr_attr[payment_method_id]', 
					payment_discount='$arr_attr[payment_discount]', 
<<<<<<< HEAD
					type='".$arr_attr['type']."'";
					
		$RS = $this->objsetup->CSI($Sql);
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
	
	function update_purchase_invoicing($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		
		 if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
 $data_pass = "  tst.quote_no='" . $arr_attr['quote_no'] . "' and tst.contact='$arr_attr[contact]'   $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_quotes', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
		
=======
					type='" . $arr_attr['type'] . "'";

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

	function update_purchase_invoicing($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);


		if ($arr_attr['id'] > 0)   $where_id = " AND tst.id != '" . $arr_attr['id'] . "' ";

		$data_pass = "  tst.quote_no='" . $arr_attr['quote_no'] . "' and tst.contact='$arr_attr[contact]'   $where_id";
		$total = $this->objGeneral->count_duplicate_in_sql('purchase_quotes', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$Sql = "UPDATE purchase_invoicing
				SET 
					quote_id='$arr_attr[quote_id]',
					order_id='$arr_attr[order_id]', 
					vendor_id='$arr_attr[vendor_id]',
					contact_id='$arr_attr[contact_id]',
					vendor_name='$arr_attr[vendor_name]',
					address1='$arr_attr[address1]',
					address2='$arr_attr[address2]',
					city='$arr_attr[city]',
					county='$arr_attr[county]',
					postcode='$arr_attr[postcode]',
					phone='$arr_attr[phone]', 
					fax='$arr_attr[fax]', 
					email='$arr_attr[email]', 
					contact='$arr_attr[contact]', 
					payment_term_id='$arr_attr[payment_term_id]', 
					payment_method_id='$arr_attr[payment_method_id]', 
					payment_discount='$arr_attr[payment_discount]', 
<<<<<<< HEAD
					type='".$arr_attr['type']."'
					WHERE id = ".$arr_attr['id']." Limit 1 ";

		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function delete_purchase_invoicing($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM purchase_invoicing
				WHERE id = ".$arr_attr['id']." Limit 1";
		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function status_purchase_invoicing($arr_attr){
=======
					type='" . $arr_attr['type'] . "'
					WHERE id = " . $arr_attr['id'] . " Limit 1 ";

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

	function delete_purchase_invoicing($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM purchase_invoicing
				WHERE id = " . $arr_attr['id'] . " Limit 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not deleted!';
		}

		return $response;
	}

	function status_purchase_invoicing($arr_attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "UPDATE purchase_invoicing
				SET 
<<<<<<< HEAD
					status='$arr_attr[status]'
					WHERE id = ".$arr_attr['id']." ";

		$RS = $this->objsetup->CSI($Sql);
	
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
	############	End: Purchase Inviocing ##############
	
	############	Start: Purchase Shipping ##############
	function get_purchase_shipping($attr){
=======
					status='" . $arr_attr['status'] . "'
					WHERE id = " . $arr_attr['id'] . " ";

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
	############	End: Purchase Inviocing ##############

	############	Start: Purchase Shipping ##############
	function get_purchase_shipping($attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";
		//print_r($attr);
		$limit_clause = $where_clause = "";
<<<<<<< HEAD
	
		if(!empty($attr['keyword'])) 	$where_clause .= " AND 	quote_id LIKE '%$attr[keyword]%' ";
		 
		 
		$response = array();
		
		$Sql = "SELECT id, quote_id, order_id, vendor_name
				FROM purchase_shipping
				WHERE 1 
				".$where_clause."
				ORDER BY id DESC";
		
	 
		$RS = $this->objsetup->CSI($Sql);
	 
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
=======

		if (!empty($attr['keyword'])) 	$where_clause .= " AND 	quote_id LIKE '%$attr[keyword]%' ";


		$response = array();

		$Sql = "SELECT id, quote_id, order_id, vendor_name
				FROM purchase_shipping
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";


		$RS = $this->objsetup->CSI($Sql);


		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				$result = array();
				$result['id'] = $Row['id'];
				$result['quote_id'] = $Row['quote_id'];
				$result['order_id'] = $Row['order_id'];
				$result['name'] = $Row['name'];
				$response['response'][] = $result;
<<<<<<< HEAD
			 }$response['ack'] = 1;
		$response['error'] = NULL;							
		}else{
=======
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			$response['response'][] = array();
		}
		return $response;
	}
<<<<<<< HEAD
	
	function get_purchase_shipping_by_id($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM purchase_shipping
				WHERE id='".$attr['id']."'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
		 if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
		  $response['ack'] = 1;
		$response['error'] = NULL;}else{
			$response['response'] = array();
		}
		return $response;
				
	}
		
	function add_purchase_shipping($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);
 
 $data_pass = "  tst.quote_id='" . $arr_attr['quote_id'] . "' and tst.name='".$arr_attr['name']."'   $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_shipping', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
=======

	function get_purchase_shipping_by_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM purchase_shipping
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
		if ($RS->RecordCount() > 0) {
			$Row = $RS->FetchRow();
			foreach ($Row as $key => $value) {
				if (is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['response'] = array();
		}
		return $response;
	}

	function add_purchase_shipping($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);
		$data_pass = "  tst.quote_id='" . $arr_attr['quote_id'] . "' and tst.name='" . $arr_attr['name'] . "' ";
		$total = $this->objGeneral->count_duplicate_in_sql('purchase_shipping', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$Sql = "INSERT INTO purchase_shipping
				SET 
					quote_id='$arr_attr[quote_id]',
					order_id='$arr_attr[order_id]', 
<<<<<<< HEAD
					name='".$arr_attr['name']."',
=======
					name='" . $arr_attr['name'] . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					address1='$arr_attr[address1]',
					address2='$arr_attr[address2]',
					city='$arr_attr[city]',
					county='$arr_attr[county]',
					postcode='$arr_attr[postcode]',
					contact='$arr_attr[contact]',
<<<<<<< HEAD
					customer_id='$arr_attr[customer_id]',
					sales_orders='$arr_attr[sales_orders]', 
					shipment_method_id='$arr_attr[shipment_method_id]', 
					req_receipt_date='".$this->objGeneral->convert_date($arr_attr[req_receipt_date])."', 
					delivery_date='".$this->objGeneral->convert_date($arr_attr[delivery_date])."', 
					type='".$arr_attr['type']."'";
					
		$RS = $this->objsetup->CSI($Sql);
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
	
	function update_purchase_shipping($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		
		if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
 $data_pass = "  tst.quote_id='" . $arr_attr['quote_id'] . "' and tst.name='".$arr_attr['name']."'   $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_shipping', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
		
		
		
=======
					customer_id='" . $arr_attr['customer_id'] . "',
					sales_orders='$arr_attr[sales_orders]', 
					shipment_method_id='$arr_attr[shipment_method_id]', 
					req_receipt_date='" . $this->objGeneral->convert_date($arr_attr['req_receipt_date']) . "', 
					delivery_date='" . $this->objGeneral->convert_date($arr_attr['delivery_date']) . "', 
					type='" . $arr_attr['type'] . "'";

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

	function update_purchase_shipping($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);


		if ($arr_attr['id'] > 0)   $where_id = " AND tst.id != '" . $arr_attr['id'] . "' ";

		$data_pass = "  tst.quote_id='" . $arr_attr['quote_id'] . "' and tst.name='" . $arr_attr['name'] . "'   $where_id";
		$total = $this->objGeneral->count_duplicate_in_sql('purchase_shipping', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}



>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$Sql = "UPDATE purchase_shipping
				SET 
					quote_id='$arr_attr[quote_id]',
					order_id='$arr_attr[order_id]', 
<<<<<<< HEAD
					name='".$arr_attr['name']."',
=======
					name='" . $arr_attr['name'] . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					address1='$arr_attr[address1]',
					address2='$arr_attr[address2]',
					city='$arr_attr[city]',
					county='$arr_attr[county]',
					postcode='$arr_attr[postcode]',
					contact='$arr_attr[contact]',
<<<<<<< HEAD
					customer_id='$arr_attr[customer_id]',
					sales_orders='$arr_attr[sales_orders]', 
					shipment_method_id='$arr_attr[shipment_method_id]', 
					req_receipt_date='".$this->objGeneral->convert_date($arr_attr[req_receipt_date])."', 
					delivery_date='".$this->objGeneral->convert_date($arr_attr[delivery_date])."', 
					type='".$arr_attr['type']."'
					WHERE id = ".$arr_attr['id']." Limit 1 ";

		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function delete_purchase_shipping($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM purchase_shipping
				WHERE id = ".$arr_attr['id']." Limit 1";
		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function status_purchase_shipping($arr_attr){
=======
					customer_id='" . $arr_attr['customer_id'] . "',
					sales_orders='$arr_attr[sales_orders]', 
					shipment_method_id='$arr_attr[shipment_method_id]', 
					req_receipt_date='" . $this->objGeneral->convert_date($arr_attr['req_receipt_date']) . "', 
					delivery_date='" . $this->objGeneral->convert_date($arr_attr['delivery_date']) . "', 
					type='" . $arr_attr['type'] . "'
					WHERE id = " . $arr_attr['id'] . " Limit 1 ";

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

	function delete_purchase_shipping($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM purchase_shipping
				WHERE id = " . $arr_attr['id'] . " Limit 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not deleted!';
		}

		return $response;
	}

	function status_purchase_shipping($arr_attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "UPDATE purchase_shipping
				SET 
<<<<<<< HEAD
					status='$arr_attr[status]'
					WHERE id = ".$arr_attr['id']." ";

		$RS = $this->objsetup->CSI($Sql);
	
		if($this->Conn->Affected_Rows() > 0){
			$response['ack'] = 1;
			$response['error'] = NULL;
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not updated!';
		}
		
		return $response;
				
=======
					status='" . $arr_attr['status'] . "'
					WHERE id = " . $arr_attr['id'] . " ";

		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not updated!';
		}

		return $response;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	############	End: Purchase Shipping ##############

	############	Start: Upload Documents ##############
<<<<<<< HEAD
	function get_documents($attr){
=======
	function get_documents($attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";
		//print_r($attr);
		$limit_clause = $where_clause = "";
<<<<<<< HEAD
	
		 
		$response = array();
		
		$Sql = "SELECT id, title, document_name, date_created
				FROM dcoument_upload
				WHERE 1 
				".$where_clause."
				ORDER BY id DESC";
		
	 
		$RS = $this->objsetup->CSI($Sql);
	 
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
=======


		$response = array();

		$Sql = "SELECT id, title, document_name, date_created
				FROM dcoument_upload
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";


		$RS = $this->objsetup->CSI($Sql);


		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				$result = array();
				$result['id'] = $Row['id'];
				$result['title'] = $Row['title'];
				$result['document_name'] = $Row['document_name'];
				$result['date_created'] = $this->objGeneral->convert_unix_into_date($Row['date_created']);
				$response['response'][] = $result;
<<<<<<< HEAD
			 }$response['ack'] = 1;
		$response['error'] = NULL;							
		}else{
=======
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			$response['response'][] = array();
		}
		return $response;
	}
<<<<<<< HEAD
	
	function get_document_by_id($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM dcoument_upload
				WHERE id='".$attr['id']."'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
	 	if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
		  $response['ack'] = 1;
		$response['error'] = NULL;}else{
			$response['response'] = array();
		}
		return $response;
				
	}
		
	function add_document($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		
		 
 $data_pass = "  tst.document_name='$arr_attr[document_name]'   $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('dcoument_upload', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
		
		
		$Sql = "INSERT INTO dcoument_upload
				SET 
					title='".$arr_attr['title']."',
					document_name='$arr_attr[document_name]', 
					module_id='$arr_attr[module_id]',
					type_id='$arr_attr[type_id]',
					company_id='$arr_attr[company_id]',
					user_id='$arr_attr[user_id]',
					date_created='".$this->objGeneral->convert_date($arr_attr[date_created])."',
					status='$arr_attr[status]'";
					
		$RS = $this->objsetup->CSI($Sql);
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
	
	function update_document($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		 if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
 $data_pass = "  tst.document_name='$arr_attr[document_name]'   $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('dcoument_upload', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
		
		
		$Sql = "UPDATE dcoument_upload
				SET 
					title='".$arr_attr['title']."',
					document_name='$arr_attr[document_name]', 
					module_id='$arr_attr[module_id]',
					type_id='$arr_attr[type_id]',
					company_id='$arr_attr[company_id]',
					user_id='$arr_attr[user_id]',
					date_created='".$this->objGeneral->convert_date($arr_attr[date_created])."',
					status='$arr_attr[status]'
					WHERE id = ".$arr_attr['id']." Limit 1 ";

		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function delete_document($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM dcoument_upload
				WHERE id = ".$arr_attr['id']." Limit 1";
		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function status_document($arr_attr){
=======

	function get_document_by_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM dcoument_upload
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
		if ($RS->RecordCount() > 0) {
			$Row = $RS->FetchRow();
			foreach ($Row as $key => $value) {
				if (is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['response'] = array();
		}
		return $response;
	}

	function add_document($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$data_pass = "  tst.document_name='$arr_attr[document_name]'";
		$total = $this->objGeneral->count_duplicate_in_sql('dcoument_upload', $data_pass, $this->arrUser['company_id']);

		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}

		$Sql = "INSERT INTO dcoument_upload
				SET 
					title='" . $arr_attr['title'] . "',
					document_name='$arr_attr[document_name]', 
					module_id='$arr_attr[module_id]',
					type_id='" . $arr_attr['type_id'] . "',
					company_id='" . $arr_attr['company_id'] . "',
					user_id='" . $arr_attr['user_id'] . "',
					date_created='" . $this->objGeneral->convert_date($arr_attr['date_created']) . "',
					status='" . $arr_attr['status'] . "'";

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

	function update_document($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		if ($arr_attr['id'] > 0)   $where_id = " AND tst.id != '" . $arr_attr['id'] . "' ";

		$data_pass = "  tst.document_name='$arr_attr[document_name]'   $where_id";
		$total = $this->objGeneral->count_duplicate_in_sql('dcoument_upload', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}


		$Sql = "UPDATE dcoument_upload
				SET 
					title='" . $arr_attr['title'] . "',
					document_name='$arr_attr[document_name]', 
					module_id='$arr_attr[module_id]',
					type_id='" . $arr_attr['type_id'] . "',
					company_id='" . $arr_attr['company_id'] . "',
					user_id='" . $arr_attr['user_id'] . "',
					date_created='" . $this->objGeneral->convert_date($arr_attr['date_created']) . "',
					status='" . $arr_attr['status'] . "'
					WHERE id = " . $arr_attr['id'] . " Limit 1 ";

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

	function delete_document($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM dcoument_upload
				WHERE id = " . $arr_attr['id'] . " Limit 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not deleted!';
		}

		return $response;
	}

	function status_document($arr_attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "UPDATE dcoument_upload
				SET 
<<<<<<< HEAD
					status='$arr_attr[status]'
					WHERE id = ".$arr_attr['id']." ";

		$RS = $this->objsetup->CSI($Sql);
	
		if($this->Conn->Affected_Rows() > 0){
			$response['ack'] = 1;
			$response['error'] = NULL;
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not updated!';
		}
		
		return $response;
				
=======
					status='" . $arr_attr['status'] . "'
					WHERE id = " . $arr_attr['id'] . " ";

		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not updated!';
		}

		return $response;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
	}
	############	End: Upload Documents ##############

	############	Start: Purcahse Orders ##############
<<<<<<< HEAD
	function get_purchase_orders($attr){
=======
	function get_purchase_orders($attr)
	{
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";
		//print_r($attr);
		$limit_clause = $where_clause = "";
<<<<<<< HEAD
	
		if(!empty($attr['keyword'])) 	$where_clause .= " AND contact_name LIKE '%$attr[keyword]%' ";
		 
		 
		$response = array();
		
		$Sql = "SELECT id, order_no, contact, req_receipt_date
				FROM purchase_orders
				WHERE 1 
				".$where_clause."
				ORDER BY id DESC";
		
	 
		$RS = $this->objsetup->CSI($Sql);
	 
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
=======

		if (!empty($attr['keyword'])) 	$where_clause .= " AND contact_name LIKE '%$attr[keyword]%' ";


		$response = array();

		$Sql = "SELECT id, order_no, contact, req_receipt_date
				FROM purchase_orders
				WHERE 1 
				" . $where_clause . "
				ORDER BY id DESC";


		$RS = $this->objsetup->CSI($Sql);


		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
				$result = array();
				$result['id'] = $Row['id'];
				$result['order_no'] = $Row['order_no'];
				$result['contact'] = $Row['contact'];
				$result['req_receipt_date'] = $this->objGeneral->convert_unix_into_date($Row['req_receipt_date']);
				$response['response'][] = $result;
<<<<<<< HEAD
			 }$response['ack'] = 1;
		$response['error'] = NULL;							
		}else{
=======
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
			$response['response'][] = array();
		}
		return $response;
	}
<<<<<<< HEAD
	
	function get_purchase_order_by_id($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM purchase_orders
				WHERE id='".$attr['id']."'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
		 if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
		  $response['ack'] = 1;
		$response['error'] = NULL;	$response['response'] = $Row;
		}else{
			$response['response'] = array();
		}
		return $response;
				
	}
		
	function add_purchase_order($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);
	 	
 $data_pass = "  tst.contact_id='$arr_attr[contact_id]'  AND 	contact='$arr_attr[contact]' $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_orders', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
=======

	function get_purchase_order_by_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM purchase_orders
				WHERE id='" . $attr['id'] . "'
				LIMIT 1";
		$RS = $this->objsetup->CSI($Sql);
		if ($RS->RecordCount() > 0) {
			$Row = $RS->FetchRow();
			foreach ($Row as $key => $value) {
				if (is_numeric($key)) unset($Row[$key]);
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['response'] = $Row;
		} else {
			$response['response'] = array();
		}
		return $response;
	}

	function add_purchase_order($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$data_pass = "  tst.contact_id='$arr_attr[contact_id]'  AND 	contact='$arr_attr[contact]' ";
		$total = $this->objGeneral->count_duplicate_in_sql('purchase_orders', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$Sql = "INSERT INTO purchase_orders
				SET 
					vendor_id='$arr_attr[vendor_id]',
					contact_id='$arr_attr[contact_id]', 
					contact='$arr_attr[contact]', 
<<<<<<< HEAD
					req_receipt_date='".$this->objGeneral->convert_date($arr_attr[req_receipt_date])."', 
=======
					req_receipt_date='" . $this->objGeneral->convert_date($arr_attr['req_receipt_date']) . "', 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					vendor_order_no='$arr_attr[vendor_order_no]', 
					bl_shipment_no='$arr_attr[bl_shipment_no]', 
					net_amount='$arr_attr[net_amount]', 
					tax_amount='$arr_attr[tax_amount]', 
					grand_total='$arr_attr[grand_total]', 
					currency_id='$arr_attr[currency_id]', 
					comment='$arr_attr[comment]', 
<<<<<<< HEAD
					status='$arr_attr[status]', 
					outlet_id='$arr_attr[outlet_id]'";
					
		$RS = $this->objsetup->CSI($Sql);
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
	
	function update_purchase_order($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);
	if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
 $data_pass = "  tst.contact_id='$arr_attr[contact_id]'  AND 	contact='$arr_attr[contact]' $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('purchase_orders', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
=======
					status='" . $arr_attr['status'] . "', 
					outlet_id='$arr_attr[outlet_id]'";

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

	function update_purchase_order($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);
		if ($arr_attr['id'] > 0)   $where_id = " AND tst.id != '" . $arr_attr['id'] . "' ";

		$data_pass = "  tst.contact_id='$arr_attr[contact_id]'  AND 	contact='$arr_attr[contact]' $where_id";
		$total = $this->objGeneral->count_duplicate_in_sql('purchase_orders', $data_pass, $this->arrUser['company_id']);


		if ($total == 1) {
			$response['ack'] = 0;
			$response['error'] = 'Record Already Exists.';
			return $response;
			exit;
		}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
		$Sql = "UPDATE purchase_orders
				SET 
					vendor_id='$arr_attr[vendor_id]',
					contact_id='$arr_attr[contact_id]', 
					contact='$arr_attr[contact]', 
<<<<<<< HEAD
					req_receipt_date='".$this->objGeneral->convert_date($arr_attr[req_receipt_date])."', 
=======
					req_receipt_date='" . $this->objGeneral->convert_date($arr_attr['req_receipt_date']) . "', 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
					vendor_order_no='$arr_attr[vendor_order_no]', 
					bl_shipment_no='$arr_attr[bl_shipment_no]', 
					net_amount='$arr_attr[net_amount]', 
					tax_amount='$arr_attr[tax_amount]', 
					grand_total='$arr_attr[grand_total]', 
					currency_id='$arr_attr[currency_id]', 
					comment='$arr_attr[comment]', 
<<<<<<< HEAD
					status='$arr_attr[status]', 
					outlet_id='$arr_attr[outlet_id]'
					WHERE id = ".$arr_attr['id']." Limit 1 ";

		$RS = $this->objsetup->CSI($Sql);
	
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
	
	function delete_purchase_order($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM purchase_orders
				WHERE id = ".$arr_attr['id']." Limit 1";
		$RS = $this->objsetup->CSI($Sql);
	
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
	############	End: Purcahse Orders ##############
}	
?>
=======
					status='" . $arr_attr['status'] . "', 
					outlet_id='$arr_attr[outlet_id]'
					WHERE id = " . $arr_attr['id'] . " Limit 1 ";

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

	function delete_purchase_order($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		$Sql = "DELETE FROM purchase_orders
				WHERE id = " . $arr_attr['id'] . " Limit 1";
		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Record not deleted!';
		}

		return $response;
	}
	############	End: Purcahse Orders ##############
}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
