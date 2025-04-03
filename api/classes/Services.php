<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH."/classes/Xtreme.php");
require_once(SERVER_PATH."/classes/General.php");

class Services extends Xtreme
{
	private $Conn = null;
	private $objGeneral = null;
	private $arrUser = null;
	
	function __construct($user_info=array()){
		parent::__construct();
		$this->Conn = parent::GetConnection();
		$this->objGeneral = new General($user_info);
		$this->arrUser = $user_info;			 
	}	
		
	// static	
	function delete_update_status($table_name,$column,$id) 
	{
		$Sql = "UPDATE $table_name SET  $column=0 	WHERE id = $id Limit 1";
	
		$RS = $this->Conn->Execute($Sql); 
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

					
	function get_data_by_id($table_name,$id) 
	{
		$Sql = "SELECT *
				FROM $table_name
				WHERE id=$id
				LIMIT 1";
			//echo $Sql; exit;
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

	############	Start: Category ############	
	function get_categories($attr)
	{
		//echo "hereeee =>";print_r($this->arrUser);exit;
		//global $objFilters;
		//return $objFilters->get_module_listing(66, "service_catagory");
	
		$this->objGeneral->mysql_clean($attr);
	
		$limit_clause = $where_clause = "";
	
		if(!empty($attr['keyword'])) 
			$where_clause .= " AND name LIKE '%$attr[keyword]%' ";
		 
		 
		$response = array();
		
		$Sql = "SELECT   c.id, c.name,c.description FROM  service_catagory  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1 
		and (c.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")		 
		group by  c.name" ; //c.user_id=".$this->arrUser['id']." 		
		
		$RS = $this->Conn->Execute($Sql);		
			
		if($RS->RecordCount()>0)
		{
			while($Row = $RS->FetchRow())
			{
				$result = array();
				$result['id'] = $Row['id'];
				$result['name'] = $Row['name'];
				$result['description'] = $Row['description'];
				$response['response'][] = $result;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;							
		}
		else{
			$response['response'][] = array();
		}
		return $response;
	}

	
	function get_all_categories($attr,$remendar)
	{
		$this->objGeneral->mysql_clean($attr);
		//print_r($this->arrUser);
		 $Sql = "SELECT   c.id, c.name,c.description FROM  service_catagory  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1 
		and (c.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")		 
		group by  c.name" ; //c.user_id=".$this->arrUser['id']." 
		$RS = $this->Conn->Execute($Sql);
		 if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result['id'] = $Row['id'];
				$result['name'] = $Row['name'];
				$result['description'] = $Row['description'];
				$response['response'][] = $result;
			 }
			 $response['ack'] = 1;
			 $response['error'] = NULL;
		}
		else{
			$response['response'] = array();
		}
		return $response;
	}
		
	function add_category($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		//print_r($arr_attr);exit;
		if($arr_attr['id']>0)   
			$where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
		$data_pass = "tst.baket_name='" . $arr_attr['name'] . "'  $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('service_catagory', $data_pass, $this->arrUser['company_id']);
 
        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

		$id=$arr_attr['id']; 
		if($id== 0)
		{
			// Insert record into the document
			$Sql = "INSERT INTO service_catagory 
									SET 
										name='".$arr_attr['name']."',
										status=1,
										description='$arr_attr[description]',
										company_id='".$this->arrUser['company_id']."',
										user_id='".$this->arrUser['id']."'";
			$RS = $this->Conn->Execute($Sql);
			$id = $this->Conn->Insert_ID();
			}
			else {
				$Sql = "UPDATE service_catagory 
									SET  
										name='".$arr_attr['name']."',
										description='$arr_attr[description]',
										status='$arr_attr[status]'
									WHERE id = ".$id."   
									Limit 1"; 
				$RS = $this->Conn->Execute($Sql);
				} 
		//	echo $Sql;exit;
						
		if($id > 0){
			$response['id'] = $id;
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['error'] = 'Record Inserted Successfully!';
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not inserted!';
		}		
		return $response;
	}
	
	############	End: Category ##############

	############	Start: Brands ##############
	function get_brands($attr)
	{
		//global $objFilters;
		//return $objFilters->get_module_listing(3, "brand");
		$this->objGeneral->mysql_clean($attr);
		//echo $this->arrUser['id']."<hr>";

		$limit_clause = $where_clause = "";	
		if(!empty($attr['keyword'])) 	
			$where_clause .= " AND brandname LIKE '%$attr[keyword]%' ";
		 
		$response = array();
		
		$Sql = "SELECT   c.id, c.brandname, c.brandcode  
				FROM  brand  c 
				left JOIN company on company.id=c.company_id 
				where  c.status=1 
				and (c.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")		 
				group by  c.brandname DESC " ; //c.user_id=".$this->arrUser['id']." 
		
		$RS = $this->Conn->Execute($Sql);		 
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result = array();
				$result['id'] = $Row['id'];
				$result['brand_name'] = $Row['brandname'];
				$result['brand_code'] = $Row['brandcode'];
				$response['response'][] = $result;
			 }
			 $response['ack'] = 1;
			$response['error'] = NULL;							
		}
		else{
			$response['response'][] = array();
		}
		return $response;
	}
	
	function get_all_brands($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		
		$Sql = "SELECT   c.id, c.brandname, c.brandcode  
				FROM  brand  c 
				left JOIN company on company.id=c.company_id 
				where  c.status=1 
				and (c.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")		 
				group by  c.brandname DESC " ; //c.user_id=".$this->arrUser['id']." 
		
		$RS = $this->Conn->Execute($Sql);

		if($RS->RecordCount()>0)
		{
			while($Row = $RS->FetchRow()){
				$result['id'] = $Row['id'];
				$result['name'] = $Row['brandname'];
				$response['response'][] = $result;
			 }
			 $response['ack'] = 1;
			 $response['error'] = NULL;			
		}
		else{
			$response['response'] = array();
		}
		return $response;
	}
	
	function add_brand($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);
		//print_r($arr_attr);exit;
		
		if($arr_attr['id']>0)   
			$where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
		$data_pass = " tst.brandname='" . $arr_attr['brandname'] . "'  $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('brand', $data_pass, $this->arrUser['company_id']);
 
        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
		
		$id=$arr_attr['id']; 
		
		if($id== 0)
		{
			$Sql = "INSERT INTO brand 
								 SET 
									brandname='$arr_attr[brandname]',
									brandcode='$arr_attr[brandcode]',
									brandlogo='$arr_attr[brandlogo]',
									status=1,
									company_id='".$this->arrUser['company_id']."',
									user_id='".$this->arrUser['id']."'	";

			$RS = $this->Conn->Execute($Sql);
			$id = $this->Conn->Insert_ID();
		}
		else {
			$Sql = "UPDATE brand 
								SET  
									brandname='$arr_attr[brandname]',
									brandcode='$arr_attr[brandcode]',
									brandlogo='$arr_attr[brandlogo]',
									status='$arr_attr[status]'
									WHERE id = ".$id."   Limit 1"; 
			$RS = $this->Conn->Execute($Sql);
			} 
		//	echo $Sql;exit;
						
		if($id > 0){
			$response['id'] = $id;
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['error'] = 'Record Inserted Successfully!';
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not inserted!';
		}		
		return $response;
	}	
	
	############	End: Brands ################	
	
	############	Start: Unit of Measures ####	
	function get_units($attr)
	{
		//global $objFilters;
		//return $objFilters->get_module_listing(45, "service_units_of_measure");
		
		$this->objGeneral->mysql_clean($attr);
		$limit_clause = $where_clause = "";
	
		if(!empty($attr['keyword'])) 
			$where_clause .= " AND child.title LIKE '%$attr[keyword]%' ";
		 
		$response = array();
		
		$Sql = "SELECT  c.id, c.title AS childTitle, parent.title AS parentTitle,parent.id AS parent_id
				FROM  service_units_of_measure  c 
				LEFT JOIN company on company.id=c.company_id 
				LEFT JOIN service_units_of_measure parent ON c.parent_id = parent.id
				where  c.status=1 
				and (c.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")		 
				group by  c.title DESC " ; //c.user_id=".$this->arrUser['id']." 		
		
		$RS = $this->Conn->Execute($Sql);		
			
		if($RS->RecordCount()>0)
		{
			while($Row = $RS->FetchRow())
			{
				$result = array();
				$result['id'] = $Row['id'];
				$result['title'] = $Row['childTitle'];
				$response['response'][] = $result;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;							
		}
		else{
			$response['response'][] = array();
		}
		return $response;
	}
		
	function get_all_units($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		
		$Sql = "SELECT  c.id, c.title 
				FROM  service_units_of_measure  c 
				LEFT JOIN company on company.id=c.company_id 
				where    c.status=1 and 
						(c.company_id=".$this->arrUser['company_id']." or 
						 company.parent_id=".$this->arrUser['company_id'].")		 
				group by c.title DESC " ; //c.user_id=".$this->arrUser['id']." 

		$RS = $this->Conn->Execute($Sql);

	 	if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result['id'] = $Row['id'];
				$result['name'] = $Row['title'];
				$response['response'][] = $result;
			 }$response['ack'] = 1;
		$response['error'] = NULL;
		}else{
			$response['response'] = array();
		}
		return $response;
	}
		
	function add_unit($arr_attr)
	{
		//	print_r($arr_attr);exit;
		if($arr_attr['id']>0)   
			$where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
		$data_pass = " tst.title='" . $arr_attr['title'] . "'  $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('service_units_of_measure', $data_pass, $this->arrUser['company_id']);
 
        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
		$id=$arr_attr['id']; 
		
		if($id== 0){
			$Sql = "INSERT INTO service_units_of_measure 
									SET 
										title='".$arr_attr['name']."',
										parent_id='".$arr_attr['parent_id']."',
										status=1,
										company_id='".$this->arrUser['company_id']."',
										user_id='".$this->arrUser['id']."'	";

			$RS = $this->Conn->Execute($Sql);
			$id = $this->Conn->Insert_ID();
			}
			else {
				$Sql = "UPDATE service_units_of_measure 
										SET  
											title='".$arr_attr['title']."',
											parent_id='$arr_attr[parent_id]',
											status='$arr_attr[status]'
										WHERE id = ".$id."   
										Limit 1"; 
				$RS = $this->Conn->Execute($Sql);
				} 
		//echo $Sql;exit;
						
		if($id > 0){
			$response['id'] = $id;
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['error'] = 'Record Inserted Successfully!';
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not inserted!';
		}		
		return $response;
	}
	
	############	End: Unit of Measures ######
	
	############	Start: Service Category Units ######
	
	function get_cat_unit($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		//print_r($attr);exit;
		$limit_clause = $where_clause = "";
	
		if(!empty($attr['keyword'])) 	
			$where_clause .= " AND uom.title LIKE '%$attr[keyword]%' ";
		 
		$response = array();
		
		$Sql = "SELECT cuom.id, service_catagory.name AS categoryName, uom.title AS unitName, cuom.value
				FROM service_category_units_of_measure
				AS cuom
				LEFT JOIN service_units_of_measure AS uom ON uom.id = cuom.unit_id
				LEFT JOIN service_catagory ON service_catagory.id = cuom.category_id
				WHERE  cuom.status=1
				ORDER BY cuom.id DESC";
		
		$RS = $this->Conn->Execute($Sql);		
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result = array();
				$result['id'] = $Row['id'];
				$result['category_name'] = $Row['categoryName'];
				$result['unit_name'] = $Row['unitName'];
				$result['quantity'] = $Row['value'];
				$response['response'][] = $result;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['total'] = $total;

		}else{
			$response['ack'] = 0;
			$response['error'] = NULL;
			$response['response'][] = array();
		}
		return $response;
	}
	
	function get_cat_unit_by_cat_nd_unit_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM service_category_units_of_measure
				WHERE category_id='$attr[category_id]' AND unit_id='$attr[unit_id]'
				LIMIT 1";
		
		//echo $Sql; exit;
		$RS = $this->Conn->Execute($Sql);
		
		if($RS->RecordCount()>0){
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) unset($Row[$key]);
			}
			$response['response'] = $Row;
			$response['ack'] = 1;
			$response['error'] = NULL;
		}else{
			$response['ack'] = 0;
			$response['error'] = NULL;
			$response['response'] = array();
		}
		return $response;				
	}

	
	function add_cat_unit($arr_attr)
	{
		$this->objGeneral->mysql_clean($arr_attr);

		if($arr_attr['id']>0)   
			$where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
		$data_pass = "tst.value='".$arr_attr['value']."'   $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('service_category_units_of_measure', $data_pass, $this->arrUser['company_id']);
 
        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
		//	print_r($arr_attr);exit;
		$id=$arr_attr['id'];
		
		if($id== 0)
		{
			$Sql = "INSERT INTO service_category_units_of_measure
										SET 
											category_id='$arr_attr[category_ids]',
											unit_id='$arr_attr[unit_ids]', 
											value='$arr_attr[value]', 
											layers='$arr_attr[layers]', 	status=1,
											company_id='".$this->arrUser['company_id']."',
											user_id='".$this->arrUser['id']."'	";
			$RS = $this->Conn->Execute($Sql);
			$id = $this->Conn->Insert_ID();
			}
			else {
				$Sql = "UPDATE service_category_units_of_measure
										SET  
											category_id='$arr_attr[category_ids]',
											unit_id='$arr_attr[unit_ids]', 
											status='$arr_attr[status]',
											value='$arr_attr[value]', 
											layers='$arr_attr[layers]',
											company_id='".$this->arrUser['company_id']."',
											user_id='".$this->arrUser['id']."'
											WHERE id = $id 
											LIMIT 1";

				$RS = $this->Conn->Execute($Sql);
				}					
		//echo $Sql;exit;
						
		if($id > 0){
			$response['id'] = $id;
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['error'] = 'Record Inserted Successfully!';
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not inserted!';
		}		
		return $response;
	} 
	
	############	End: Service Category Unit #########

	function get_products_popup_invoice($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		//print_r($attr);exit;
		$limit_clause = $where_clause = "";
	
		if(!empty($attr['keyword'])){
			$where_clause .= " AND p.name LIKE '%$attr[keyword]%' ";
		}

		if(empty($attr['all'])){
			if(empty($attr['start'])) 
				$attr['start'] = 0;

			if(empty($attr['limit'])) 
				$attr['limit'] = 10;

			$limit_clause = " LIMIT $attr[start] , $attr[limit]";
		}
		$response = array();
		
		$Sql = "SELECT  products.*,
						products.id,
						products.srv_code as code, 
						products.description,
						company.name as company,
						products.prd_picture, 
						products.current_stock_level, 
						products.standard_price,
						products.profit_percentage,
						products.prd_dimensions,
						(SELECT catagory.name 
						 FROM catagory 
						 WHERE  products.category_id=catagory.id) as category_name,
						(SELECT brand.brandname 
						 FROM brand  
						 WHERE  brand.id=products.brand_id) as brand_name,
						(SELECT units_of_measure.title 
						 FROM units_of_measure   
						 WHERE units_of_measure.id=products.unit_id) as unit_of_measure_name,
						vat.vat_name as vat
				From products 
				LEFT JOIN company on company.id=products.company_id 
				LEFT  JOIN vat on vat.id=products.vat_rate_id 
				where  (products.company_id=".$this->arrUser['company_id']." or  
						company.parent_id=".$this->arrUser['company_id'].")	and 
						products.status = 1 ".$where_clause."
				ORDER BY products.id DESC";		
		 
		$RS = $this->Conn->Execute($Sql);
			
		if($RS->RecordCount()>0)
		{
			while($Row = $RS->FetchRow())
			{
				foreach($Row as $key => $value){
					if(is_numeric($key)) unset($Row[$key]);
				}
			$response['response'][] = $Row;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;							
		}
		else{
			$response['response'][] = array();
		}
		return $response;
	}


	function get_products_popup($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		//print_r($attr);exit;
		$limit_clause = $where_clause = "";
	
		if(!empty($attr['keyword']))
			$where_clause .= " AND p.name LIKE '%$attr[keyword]%' ";		
		
		if(!empty($attr['category_id'])){
			$where_clause .= " AND products.category_id = ".$attr['category_id'];
		}

		if(!empty($attr['search_string'])){
			$where_clause .= " AND (products.description LIKE '%$attr[search_string]%' OR products.code LIKE '%$attr[search_string]%' OR products.standard_price LIKE '%$attr[search_string]%') ";
		}

		$response = array();
		 
		$Sql = "SELECT  products.*,
						products.id, 
						products.srv_code as code, 
						products.description,
						company.name as company,
						products.prd_picture, 
						products.current_stock_level, 
						products.standard_price,
						products.profit_percentage,
						products.prd_dimensions,
						(SELECT service_catagory.name 
						 FROM service_catagory 
						 WHERE products.category_id=service_catagory.id) as category_name,
						(SELECT brand.brandname 
						 FROM brand  
						 WHERE brand.id=products.brand_id) as brand_name,
						(SELECT service_units_of_measure.title 
						 FROM service_units_of_measure   
						 WHERE service_units_of_measure.id=products.unit_id) as unit_of_measure_name
				From services as products
				LEFT JOIN company on company.id=products.company_id 
				where  (products.company_id=".$this->arrUser['company_id']." or  
						company.parent_id=".$this->arrUser['company_id'].")	and 
						products.status = 1 ".$where_clause."
				ORDER BY products.id DESC"; 
		
		$RS = $this->Conn->Execute($Sql);
			
		if($RS->RecordCount()>0)
		{
			while($Row = $RS->FetchRow())
			{
				foreach($Row as $key => $value){
					if(is_numeric($key)) unset($Row[$key]);
				}					
				$response['response'][] = $Row;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['total'] = $total;							
		}
		else{
			$response['response'] = array();
			$response['ack'] = 0;
			$response['error'] = NULL;
		}
		return $response;
	}
	

	function get_product_details_by_id($attr)
	{
		$this->objGeneral->mysql_clean($attr);
	 
		$Sql = "SELECT *
				FROM products
				WHERE  status=1 and id='$attr[product_id]' 
				LIMIT 1";
	 
		$RS = $this->Conn->Execute($Sql);
		 if($RS->RecordCount()>0)
		 {
			$Row = $RS->FetchRow();
			foreach($Row as $key => $value){
				if(is_numeric($key)) 
					unset($Row[$key]);
				}
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['response'] = $Row;
		}
		else{
			$response['response'] = array();
		}
		//echo "<pre>";print_r($response);exit;
		return $response;				
	} 
 	 
	############	Start: Products Listing ####	
 		
	function get_products_listing($attr)
	{
		$this->objGeneral->mysql_clean($attr);
		$limit_clause = $where_clause = "";
		
		if(!empty($attr['Serachkeyword'])){
			$where_clause .= " AND services.code LIKE '%$attr[Serachkeyword]%'  OR services.description LIKE '%$attr[Serachkeyword]%'";
			}

		if(empty($attr['all'])){
			if(empty($attr['start'])) 
				$attr['start'] = 0;

			if(empty($attr['limit'])) 
				$attr['limit'] = 10;

			$limit_clause = " LIMIT $attr[start] , $attr[limit]";
		}

		$response = array();
		
		$Sql = "SELECT  services.id, 
						services.srv_code,  
						services.description,
						company.name as company,
						services.prd_picture, 
						services.current_stock_level, 
						services.standard_price,
						services.profit_percentage,
						services.prd_dimensions,
						(SELECT service_catagory.name 
						 FROM service_catagory 
						 WHERE services.category_id=service_catagory.id) as category_name,
						(SELECT service_units_of_measure.title 
						 FROM service_units_of_measure   
						 WHERE service_units_of_measure.id=services.unit_id) as unit_of_measure_name
				From services 
				LEFT JOIN company on company.id=services.company_id
				where services.status=1  and 
					 (services.company_id=".$this->arrUser['company_id']." or 
					  company.parent_id=".$this->arrUser['company_id'].")	
					  ".$where_clause."	
				ORDER BY services.id DESC";
		
		$RS = $this->Conn->Execute($Sql);	
			
		if($RS->RecordCount()>0)
		{
			while($Row = $RS->FetchRow())
			{
				$result = array();
				$result['id'] = $Row['id'];
				$result['code'] = $Row['srv_code'];
				$result['description'] = $Row['description']; 
				$result['unit of measure'] = $Row['unit_of_measure_name'];
				$result['category'] = $Row['category_name'];
				$response['response'][] = $result;
				}
			$response['ack'] = 1;
			$response['error'] = NULL;							
		}
		else{
			$response['response'][] = array();
		}		
		return $response;
	}
	
	function update_value($arr_attr)	
	{
		foreach($arr_attr as $key => $val)
		{
			$converted_array[$key] = $val;	
			
			if($key == "id"){
			 	$product_id = $val;	
			}
		}
		// print_r($arr_attr);exit;
		//current_date=strtotime(date('Y-m-d')); 
		$counter_supplier=0;
		$counter_purchase=0;

		if(!empty($arr_attr->id))
		{
			$product_id=$arr_attr->id;	
			}

	    if(!empty($arr_attr->product_id))
		{
			$product_id=$arr_attr->product_id;	
			}

		$new='Add'; 
		$new_msg='Inserted';
		
		if($product_id== 0){
			$sql_total = "  SELECT count(ef.id) as total
							FROM services ef
							JOIN company ON company.id = ef.company_id
							WHERE ef.status=1 AND 
								ef.srv_code='" . $arr_attr[srv_code] . "' AND 
								(ef.company_id=".$this->arrUser['company_id']." or  
								company.parent_id=".$this->arrUser['company_id'].")"; 
			
			$rs_count = $this->Conn->Execute($sql_total);
			$total = $rs_count->fields['total'];
			
			if($total > 0){
				$response['ack'] = 0;
				$response['error'] = 'Record Already Exists.';
				return $response;
				}
				else{ 
					$Sql = "INSERT INTO services 
											SET 
												srv_code='".$arr_attr->srv_code."',
												srv_no='".$arr_attr->srv_no."',
												description='".$arr_attr->description."',
												category_id='".$arr_attr->category_ids."',
												unit_id='".$arr_attr->unit_ids."',
												current_stock_level='".$arr_attr->current_stock_level."',
												status=1,
												company_id='".$this->arrUser['company_id']."',
												user_id='".$this->arrUser['id']."', 
												date_added='".current_date."'";	
					$RSProducts = $this->Conn->Execute($Sql);
					$product_id = $this->Conn->Insert_ID();
					}
				}
				else {
					$new='Edit';  
					$new_msg='Update';

					if($arr_attr->tab_id_2==1)	
					{
						$Sql = "UPDATE services 
											SET 
												description='".$arr_attr->description."',
												category_id='".$arr_attr->category_ids."',
												unit_id='".$arr_attr->unit_ids."',
												current_stock_level='".$arr_attr->current_stock_level."',
												status='".$arr_attr->statuss."'
								WHERE id = ".$product_id."  
								Limit 1"; 
						}
					
					if($arr_attr->tab_id_2==2) { 
						$Sql = "UPDATE services 
											SET 
											 	unit_cost='".$arr_attr->unit_cost."',
												average_cost_id='".$arr_attr->average_cost_id."' ,
												vat_rate_id='".$arr_attr->vat_rate_ids."',
												standard_price='".$arr_attr->standard_price."',
												average_price='".$arr_attr->average_price."' ,
												purchase_measure='".$arr_attr->purchase_measures."',
												purchase_code='".$arr_attr->purchase_code."',
												purchase_code_id='".$arr_attr->purchase_code_id."',
												sales_code='".$arr_attr->sales_code."',
												sale_code_id='".$arr_attr->sales_code_id."'	
											WHERE id = ".$product_id."  
											Limit 1";
						}
					
					if($arr_attr->tab_id_2==3)	{ 
						$Sql = "UPDATE services 
											SET 
												prd_dimensions='".$arr_attr->prd_dimensions."',
												prd_height='".$arr_attr->prd_height."',
												prd_width='".$arr_attr->prd_width."',
												prd_length='".$arr_attr->prd_length."',
												prd_gross_weight='".$arr_attr->prd_gross_weight."',
												prd_net_weight='".$arr_attr->prd_net_weight."',
												prd_bar_code='".$arr_attr->prd_bar_code."',
												prd_country_origin='".$arr_attr->prd_country_origins."',
												prd_country_code='".$arr_attr->prd_country_code."' 
											WHERE id = ".$product_id."  
											Limit 1";
						}

					//echo "111";	echo $Sql;exit;
					$RS = $this->Conn->Execute($Sql);
					
					if($arr_attr->tab_id_2==6)
					{
						$counter_supplier++;
						$price =0;
						$arr_attr->sale_selling_checks;

						if($arr_attr->sale_selling_checks>0) 
						{
							$price =$arr_attr->sale_selling_price;
							}
						
						$f_id =$arr_attr->supplier_types;
						$tab_change='tab_sale';
						$sp_id=$arr_attr->sale_id;
						$sale_id=0;
						if($sp_id>0)
						{
							//  $Sql = "DELETE FROM service_sale WHERE id = $sp_id";
							//	$RS = $this->Conn->Execute($Sql);
								//	$Sql = "DELETE FROM service_sale WHERE sale_id = $sp_id";
								//	$RS = $this->Conn->Execute($Sql);
								
						 		$Sql = "UPDATE  service_sale SET   
									sale_selling_price='".$price."' 
									,sale_selling_check='".$arr_attr->sale_selling_checks."' 	
									,supplier_type='".$arr_attr->supplier_types."'  
									,discount_value='".$arr_attr->discount_value."'  
									,discount_price='".$arr_attr->discount_price."'  
									,start_date=   '" .   $this->objGeneral->convert_date($arr_attr->s_start_date) . "'
									,end_date=  '" .   $this->objGeneral->convert_date($arr_attr->s_end_date) . "'
									WHERE id = ".$sp_id."  Limit 1";
									$new='Add'; $new_msg='Edit';
									$RS = $this->Conn->Execute($Sql);
								//	echo $Sql ;	exit;	
									
						 }
				 	 else{
							 //,supplier_unit_cost='".$price."'
										$Sql = "INSERT INTO service_sale SET  							
									 supplier_name='".$arr_attr->sale_name."'   
									
									,sale_selling_price='".$price."' 
									,sale_selling_check='".$arr_attr->sale_selling_checks."' 	
									,supplier_type='".$arr_attr->supplier_types."'    
									,discount_value='".$arr_attr->discount_value."'  
									,discount_price='".$arr_attr->discount_price."'  
									,start_date=  '" .   $this->objGeneral->convert_date($arr_attr->s_start_date) . "'
									,end_date= '" .   $this->objGeneral->convert_date($arr_attr->s_end_date) . "'
									,product_id='".$product_id."' 	,status='1'  
									,company_id='".$this->arrUser['company_id']."' 
									,user_id='".$this->arrUser['id']."',
									date_added='".current_date."'"; 
								
								
									$new='Add'; $new_msg='Insert';
								 	$RS = $this->Conn->Execute($Sql);
									 $sale_id = $this->Conn->Insert_ID();
									
									$customer_price_id= explode(",",  $arr_attr->customer_price);
									$sale_name_id= explode(",",  $arr_attr->sale_name_id);
									 $i=0;
								   foreach ($sale_name_id as $key => $customer_id)
									 {   
											//	  echo $customer_id;
										if(is_numeric($customer_id))
									{	
								   			if($arr_attr->sale_selling_check==1) 
									{
									 
										$customer_price=	"customer_price='".$arr_attr->sale_selling_price."'  ";
										  $price =$arr_attr->sale_selling_price;
									}
									else{
										$customer_price=	"customer_price='".$customer_price_id[$i]."'  "; 
										$price =	$customer_price_id[$i];
										
										}
										
									if($f_id==1)
									{
										$discount_priceone = $arr_attr->discount_value * $price/100 ;   
										$discount_price =	  $price -  $discount_priceone ;
									}				
								  else  if($f_id==2)
									{
										$discount_price =   $price  - $arr_attr->discount_value;
									}
									
									$Sql = "INSERT INTO service_sale_customer SET  
										customer_id='".$customer_id."'
										,sale_id='".$sale_id."'  
										,status='1'  
										,".$customer_price."
										,discount_type='".$arr_attr->supplier_types."'  
										,discount_value='".$arr_attr->discount_value."' 
										,discounted_price='".$discount_price."' 
										,company_id='".$this->arrUser['company_id']."' 
										,user_id='".$this->arrUser['id']."',
										date_added='".current_date."'";
										$RS = $this->Conn->Execute($Sql);
										
									}
									$i++;
									} 
						  }
			 }   
			 
			if($arr_attr->tab_id_2==66) {      
			 //service_sale_customer
			 
		 			 $counter_supplier++; $tab_change='tab_sale_cancel';
					$sale_customer_id=$arr_attr->sale_customer_id;  
					if($sale_customer_id>0)	 {
								 
								 	$Sql = "DELETE FROM service_sale_customer WHERE sale_id = $sale_customer_id";
								 	$RS = $this->Conn->Execute($Sql);
								
									
									$customer_price_id= explode(",",  $arr_attr->customer_price2);
									$sale_name_id= explode(",",  $arr_attr->sale_name_id2);
								
								 $i=0;
								   foreach ($sale_name_id as $key => $customer_id)
									 {   
											//	  echo $customer_id;
										if(is_numeric($customer_id))
									{	
								   			if($arr_attr->sale_selling_check==1) 
									{
									 
										$customer_price=	"customer_price='".$arr_attr->sale_selling_price."'  "; 
									}
									else{
										$customer_price=	"customer_price='".$customer_price_id[$i]."'  "; 
										
										}
									$Sql = "INSERT INTO service_sale_customer SET  
										customer_id='".$customer_id."'
										,sale_id='".$sale_customer_id."'  
										,status='1'  
										,".$customer_price."
										,discount_type='".$arr_attr->discount_type2."'  
										,discount_value='".$arr_attr->discount_value2."' 
										,discounted_price='".$arr_attr->discounted_price2."' 
										,company_id='".$this->arrUser['company_id']."' 
										,user_id='".$this->arrUser['id']."',
										date_added='".current_date."'";
										$RS = $this->Conn->Execute($Sql);
										
									}
									$i++;
									} 
						 		$Sql = "UPDATE  service_sale SET supplier_name='".$arr_attr->sale_name2."'  
									WHERE id = ".$sale_customer_id."  Limit 1";
									$new='Add'; $new_msg='Insert';
									$RS = $this->Conn->Execute($Sql);
						 } 
					
			 } 
			 
			if($arr_attr->tab_id_2==4) {  
		 	
					 $tab_change='tab_supplier';
				   	 $sp_id=$arr_attr->sp_id; 
						 if($sp_id== 0) {
							
						
 								 		$Sql1 = "INSERT INTO service_product_supplier SET  
											 volume_id='".$arr_attr->volume_1s."'  
											 ,volume_1=1 
											,supplier_type='".$arr_attr->supplier_type_1s."'  
											 ,purchase_price='".$arr_attr->purchase_price_1."' 
											,discount_value='".$arr_attr->discount_value_1."'  
											 ,discount_price='".$arr_attr->discount_price_1."' 
									 
											,start_date=   '" .   $this->objGeneral->convert_date($arr_attr->start_date) . "'
											,end_date=    '" .   $this->objGeneral->convert_date($arr_attr->end_date) . "'
											,product_id='".$product_id."' 	,status='1'  
											,company_id='".$this->arrUser['company_id']."' 
											,user_id='".$this->arrUser['id']."'
											,date_added='".current_date."'";
										if($arr_attr->volume_1s!=NULL)	$RS = $this->Conn->Execute($Sql1);	
						
										
											
									  	$Sql2 = "INSERT INTO service_product_supplier SET  
											 volume_id='".$arr_attr->volume_2s."' 
											  ,volume_2=2 
											,supplier_type='".$arr_attr->supplier_type_2s."'  
											
											 ,purchase_price='".$arr_attr->purchase_price_2."' 
											,discount_value='".$arr_attr->discount_value_2."'  
											 ,discount_price='".$arr_attr->discount_price_2."' 
									 
									 		,start_date=   '" .   $this->objGeneral->convert_date($arr_attr->start_date) . "'
											,end_date=    '" .   $this->objGeneral->convert_date($arr_attr->end_date) . "'
											,product_id='".$product_id."' 	,status='1'  
											,company_id='".$this->arrUser['company_id']."' 
											,user_id='".$this->arrUser['id']."'
											,date_added='".current_date."'";
											
										if($arr_attr->volume_2s!=NULL)	 $RS = $this->Conn->Execute($Sql2);		
										
								 		$Sql3 = "INSERT INTO service_product_supplier SET  
											 volume_id='".$arr_attr->volume_3s."'  
											 ,volume_3=3
											,supplier_type='".$arr_attr->supplier_type_3s."' 
											
											 ,purchase_price='".$arr_attr->purchase_price_3."' 
											,discount_value='".$arr_attr->discount_value_3."'  
											 ,discount_price='".$arr_attr->discount_price_3."' 
									 
											,start_date=   '" .   $this->objGeneral->convert_date($arr_attr->start_date) . "'
											,end_date=   '" .   $this->objGeneral->convert_date($arr_attr->end_date) . "'
											,product_id='".$product_id."' 	,status='1'  
											,company_id='".$this->arrUser['company_id']."' 
											,user_id='".$this->arrUser['id']."'
											,date_added='".current_date."'";
										 if($arr_attr->volume_3s!=NULL)	$RS = $this->Conn->Execute($Sql3);	 
										
											$new='Add'; $new_msg='Insert';
						
						 }
						 else {
							$Sql = "UPDATE service_product_supplier SET  
							purchase_price='".$arr_attr->purchase_price_11."'  
							,discount_value='".$arr_attr->discount_value_11."'
							,discount_price='".$arr_attr->discount_price_11."'  
							WHERE id = ".$sp_id."   Limit 1";
							$RS = $this->Conn->Execute($Sql);	 
						 }
		 }   
		
			if($arr_attr->tab_id_2==5) {   	 
			
						 $tab_change='tab_purchaser';
		 		  	 	$pr_id=$arr_attr->pr_id; 
						 if($pr_id== 0){
									
 										$Sql1 = "INSERT INTO service_product_purchaser SET  
											 volume_id='".$arr_attr->volume_1_purchases."'  ,volume_1=1 
											,purchase_type='".$arr_attr->purchase_type_1s."'  
											,discount_value='".$arr_attr->p_discount_value_1."' 
											 ,purchase_price='".$arr_attr->p_price_1."'  
											 ,discount_price='".$arr_attr->discount_p_1."' 
											,p_start_date=   '" .   $this->objGeneral->convert_date($arr_attr->p_start_date) . "'
											,p_end_date=   '" .   $this->objGeneral->convert_date($arr_attr->p_end_date) . "'
											,product_id='".$product_id."' 	,status='1'  
											,company_id='".$this->arrUser['company_id']."' 
											,user_id='".$this->arrUser['id']."'
											,date_added='".current_date."'";
											if($arr_attr->volume_1_purchases!=NULL)$RS = $this->Conn->Execute($Sql1);	
									
						 			
									 	$Sql2 = "INSERT INTO service_product_purchaser SET  
											 volume_id='".$arr_attr->volume_2_purchases."'  ,volume_2=2
											,purchase_type='".$arr_attr->purchase_type_2s."' 
											,discount_value='".$arr_attr->p_discount_value_2."' 
											 ,purchase_price='".$arr_attr->p_price_2."'  
											 ,discount_price='".$arr_attr->discount_p_2."' 
											,p_start_date=  '" .   $this->objGeneral->convert_date($arr_attr->p_start_date) . "'
											,p_end_date=   '" .   $this->objGeneral->convert_date($arr_attr->p_end_date) . "'
											,product_id='".$product_id."' 	,status='1'  
											,company_id='".$this->arrUser['company_id']."' 
											,user_id='".$this->arrUser['id']."'
											,date_added='".current_date."'";
											if($arr_attr->volume_2_purchases!=NULL)$RS = $this->Conn->Execute($Sql2);	
						 			
								 	$Sql3 = "INSERT INTO service_product_purchaser SET  
											 volume_id='".$arr_attr->volume_3_purchases."'  ,volume_3=3 
											,purchase_type='".$arr_attr->purchase_type_3s."' 
											,discount_value='".$arr_attr->p_discount_value_3."' 
											 ,purchase_price='".$arr_attr->p_price_3."'  
											 ,discount_price='".$arr_attr->discount_p_3."' 
											 ,p_start_date=   '" .   $this->objGeneral->convert_date($arr_attr->p_start_date) . "'
											,p_end_date=    '" .   $this->objGeneral->convert_date($arr_attr->p_end_date) . "'
											,product_id='".$product_id."' 	,status='1'  
											,company_id='".$this->arrUser['company_id']."' 
											,user_id='".$this->arrUser['id']."'
											,date_added='".current_date."'";
							 				if($arr_attr->volume_3_purchases!=NULL)$RS = $this->Conn->Execute($Sql3);	 
			
											$new='Add'; $new_msg='Insert';
							  
			 }
										else { 
									$Sql = "UPDATE service_product_purchaser SET   
									purchase_price='".$arr_attr->purchase_price_11."'  
									,discount_value='".$arr_attr->discount_value_11."'
									,discount_price='".$arr_attr->discount_price_11."'   
									WHERE id = ".$pr_id."   Limit 1";  
									$RS = $this->Conn->Execute($Sql); 
							} 
			}   
		}
		
		
		
	   $message="Record  $new_msg successfully "; 
		
		if($product_id > 0){ 
			$response['product_id'] = $product_id;
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['msg'] = $message;
			$response['info'] = $new;
			$response['tab_change'] = $tab_change;
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not updated!';
			$response['msg'] = $message;
		}
		
		return $response;
	}

	
 
	
	function get_sale_list_product_id($attr){ 
		
		$this->objGeneral->mysql_clean($attr); 
		
		$limit_clause = $where_clause = "";
	
		if(!empty($attr['keyword'])){
			$where_clause .= " AND name LIKE '%$attr[keyword]%' ";
		}
		if(empty($attr['all'])){
			if(empty($attr['start'])) $attr['start'] = 0;
			if(empty($attr['limit'])) $attr['limit'] = 10;
			$limit_clause = " LIMIT $attr[start] , $attr[limit]";
		}
		$response = array();
		$Sql = "SELECT ps.id,ps.supplier_name,ps.supplier_code
		,ps.sale_selling_check,ps.sale_selling_price,ps.discount_value,ps.discount_price
		,ps.supplier_unit_cost,ps.start_date,ps.end_date
		,ps.discount_value,ps.supplier_type 
		FROM service_sale ps   
		WHERE ps.product_id='$attr[product_id]' and ps.status=1
		order by ps.id DESC";
	 
		
		$RS = $this->Conn->Execute($Sql);

			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
					$result = array();
					$result['id'] = $Row['id']; 
					//$result['customer_code'] = $Row['supplier_code'];  
					// $result['customer_name'] = $Row['name'];
					$result['customers'] = $Row['supplier_name'];
				//	if($Row['supplier_unit_cost']==0){$result['Promotion Price'] = 'NA';}
				//	else{$result['Promotion Price'] = $Row['supplier_unit_cost'];}
					if($Row['sale_selling_price']==0){$result['Standard Selling Price'] = 'NA';}
					else{$result['Standard Selling Price'] = $Row['sale_selling_price'];}
					$result['discount_type'] = ($Row['supplier_type'] == 1)? "Percentage":"Value";
					$result['discount'] = ($Row['supplier_type'] == 1)? $Row['discount_value']."%":$Row['discount_value'];
					$result['discounted_price'] = $Row['discount_price'];
					$result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']); 
					$result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']); 
					$response['response'][] = $result;
			 }$response['ack'] = 1;
		$response['error'] = NULL;							
		}else{
			$response['response'][] = array();
		}
		
		return $response; 
	} 
	
	function get_supplier_list_product_id($attr){ 
		
		$this->objGeneral->mysql_clean($attr); 
		
		$limit_clause = $where_clause = "";
	
		if(!empty($attr['keyword'])){
			$where_clause .= " AND name LIKE '%$attr[keyword]%' ";
		}
		if(empty($attr['all'])){
			if(empty($attr['start'])) $attr['start'] = 0;
			if(empty($attr['limit'])) $attr['limit'] = 10;
			$limit_clause = " LIMIT $attr[start] , $attr[limit]";
		}
		$response = array();
					
		$Sql = "SELECT service_product_supplier.id,service_product_supplier.start_date,service_product_supplier.end_date
		,service_product_supplier.discount_value,service_product_supplier.supplier_type
		,v.description
		,service_product_supplier.purchase_price,service_product_supplier.discount_price
		FROM service_product_supplier 
		Left JOIN service_price_offer_volume  v ON v.id = service_product_supplier.volume_id 
		WHERE service_product_supplier.product_id='$attr[product_id]' and service_product_supplier.status=1
		order by service_product_supplier.id DESC";
		
		
		$RS = $this->Conn->Execute($Sql);
		
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
					$result = array();
					$result['id'] = $Row['id']; 
				 	$result['Volume'] = $Row['description'];  
				 
					$result[' Standard Selling Price'] = $Row['purchase_price'];
				   if($Row['supplier_type']==1){$result['discount_type'] = 'Percentage' ;}
				   else{$result['discount_type'] =  'Value';}
					$result['Discount'] = ($Row['supplier_type'] == 1)? $Row['discount_value']."%":$Row['discount_value'];
					 $result[' Discounted Price'] = $Row['discount_price']; 
					 
					$result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']) ; 
					$result['end_date'] =  $this->objGeneral->convert_unix_into_date($Row['end_date']) ; 
					
				$response['response'][] = $result;
			 }$response['ack'] = 1;
		$response['error'] = NULL;							
		}else{
			$response['response'][] = array();
		}
		
		return $response; 
	}
	
    function get_purchase_list_product_id($attr){ 
		
		$this->objGeneral->mysql_clean($attr); 
		
		$limit_clause = $where_clause = "";
	
		if(!empty($attr['keyword'])){
			$where_clause .= " AND name LIKE '%$attr[keyword]%' ";
		}
		if(empty($attr['all'])){
			if(empty($attr['start'])) $attr['start'] = 0;
			if(empty($attr['limit'])) $attr['limit'] = 10;
			$limit_clause = " LIMIT $attr[start] , $attr[limit]";
		}
		$response = array();
	 	$Sql = "SELECT service_product_purchaser.id,service_product_purchaser.p_start_date,service_product_purchaser.p_end_date
		,service_product_purchaser.discount_value,service_product_purchaser.purchase_type
		,service_product_purchaser.purchase_price,service_product_purchaser.discount_price
		,(Select service_purchase_offer_volume.description  From service_purchase_offer_volume where service_purchase_offer_volume.id = service_product_purchaser.volume_id ) as descs
		FROM service_product_purchaser   
		WHERE service_product_purchaser.product_id='$attr[product_id]' and service_product_purchaser.status=1
		order by service_product_purchaser.id DESC";
		
		
		$RS = $this->Conn->Execute($Sql);
		
			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
                           // print_r($Row);
                            
					$result = array();
					$result['id'] = $Row['id']; 
				
					$result['Volume'] = $Row['descs'];  
					$result['Standard Unit Price '] = $Row['purchase_price'];
					$result['discount_type'] =  'Value';
					if($Row['purchase_type']==1)$result['discount_type'] = 'Percentage' ;
					$result['Discount'] = ($Row['purchase_type'] == 1)? $Row['discount_value']."%":$Row['discount_value'];
					$result['Discounted Price'] = $Row['discount_price']; 
                                       // echo "123::".strtotime(strval($Row['p_start_date']))."::44::";
					$result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['p_start_date']); 
					$result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['p_end_date']); 
					
				$response['response'][] = $result;
                                
			 }$response['ack'] = 1;
		$response['error'] = NULL;						
		}else{
			$response['response'][] = array();
		}
		// print_r($response);exit;
		
		return $response; 
	}
	
	
 
//------------Price Offer--------------------------

	function get_price_offer_volumes($attr){
		
		//global $objFilters;
	//	return $objFilters->get_module_listing(106, "service_purchase_offer_volume");

		 $this->objGeneral->mysql_clean($attr);
		
		$limit_clause = "";
		$where_clause = "AND company_id =".$this->arrUser['company_id'];

		if(!empty($attr['keyword'])){
			$where_clause .= " AND name LIKE '%$attr[keyword]%' ";
		}
		if(empty($attr['all'])){
			if(empty($attr['start'])) $attr['start'] = 0;
			if(empty($attr['limit'])) $attr['limit'] = 10;
			$limit_clause = " LIMIT $attr[start] , $attr[limit]";
		}
		$response = array();
		 
		
$Sql = "SELECT service_price_offer_volume.id, service_price_offer_volume.name,  service_price_offer_volume.status 
,service_price_offer_volume.type ,service_price_offer_volume.description 
FROM service_price_offer_volume 
left  JOIN company on company.id=service_price_offer_volume.company_id 
where service_price_offer_volume.status=1 and ( service_price_offer_volume.company_id=".$this->arrUser['company_id']." 
or  company.parent_id=".$this->arrUser['company_id'].")
order by service_price_offer_volume.id DESC";

		$RS = $this->Conn->Execute($Sql);

			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result = array();
				$result['id'] = $Row['id'];
				$result['name'] = $Row['name'];
					$result['description'] = $Row['description'];
				$response['response'][] = $result;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['total'] = $total;							
		}else{
			$response['response'] = array();
			$response['ack'] = 0;
			$response['error'] = NULL;
		}
		return $response; 
	
		
		}

	function get_price_offer_volume_by_type($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM service_price_offer_volume
				WHERE type='".$attr['type']."' AND company_id =".$this->arrUser['company_id'];  

				//echo $Sql; exit;
		$RS = $this->Conn->Execute($Sql);
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result = array();
				$result['id'] = $Row['id'];
				$result['name'] = $Row['description'];
				$response['response'][] = $result;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		}else{
			$response['response'] = array();
			$response['ack'] = 0;
			$response['error'] = NULL;
		}
		return $response;
				
	}

	function add_price_offer_volume($arr_attr){
	
		$this->objGeneral->mysql_clean($arr_attr);
				
				  	 $id=$arr_attr['id'];  if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
		$data_pass = "  tst.name='".$arr_attr['name']."'   $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('service_price_offer_volume', $data_pass, $this->arrUser['company_id']);
 
        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
		
	  				 if($id== 0){
				 
								 
		
							 
							
									$Sql = "INSERT INTO service_price_offer_volume SET 
									name='".$arr_attr['name']."',
									description='$arr_attr[description]',
									type='".$arr_attr['type']."',
									status=1,
									company_id='".$this->arrUser['company_id']."',
									user_id='".$this->arrUser['id']."'	";
									$RS = $this->Conn->Execute($Sql);
									$id = $this->Conn->Insert_ID();
									   
					 }
					 else {
									$Sql = "UPDATE service_price_offer_volume SET  
									SET 
									name='".$arr_attr['name']."',
									description='$arr_attr[description]',
									type='".$arr_attr['type']."',
									status=1
									WHERE id = ".$id."   Limit 1"; 
									$RS = $this->Conn->Execute($Sql);
					} 
					
			//	echo $Sql;exit;
						
		if($id > 0){
			$response['id'] = $id;
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['error'] = 'Record Inserted Successfully!';
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not inserted!';
		}		
		return $response;
				
	}

//-----------Purchase Offer Volume Module---------------------------

	function get_purchase_offer_volume($attr){
		//global $objFilters;
	//	return $objFilters->get_module_listing(106, "service_purchase_offer_volume");

		 $this->objGeneral->mysql_clean($attr);
		
		 
		$response = array();
		 
		
		$Sql = "SELECT service_purchase_offer_volume.id, service_purchase_offer_volume.name,  service_purchase_offer_volume.status 
		,service_purchase_offer_volume.type ,service_purchase_offer_volume.description 
		FROM service_purchase_offer_volume 
		left  JOIN company on company.id=service_purchase_offer_volume.company_id 
		where service_purchase_offer_volume.status=1 and ( service_purchase_offer_volume.company_id=".$this->arrUser['company_id']." 
		or  company.parent_id=".$this->arrUser['company_id'].")
		order by service_purchase_offer_volume.id DESC";
	 
		
		$RS = $this->Conn->Execute($Sql);

			
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result = array();
				$result['id'] = $Row['id'];
				$result['name'] = $Row['name'];
				$response['response'][] = $result;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['total'] = $total;							
		}else{
			$response['response'] = array();
			$response['ack'] = 0;
			$response['error'] = NULL;
		}
		return $response; 
	}
	
	function get_purchase_offer_volume_by_type($attr){
		$this->objGeneral->mysql_clean($attr);
		$Sql = "SELECT *
				FROM service_purchase_offer_volume
				WHERE type='".$attr['type']."' AND company_id =".$this->arrUser['company_id'];  

				//echo $Sql; exit;
		$RS = $this->Conn->Execute($Sql);
		if($RS->RecordCount()>0){
			while($Row = $RS->FetchRow()){
				$result = array();
				$result['id'] = $Row['id'];
				$result['description'] = $Row['description'];
				$response['response'][] = $result;
			}
			$response['ack'] = 1;
			$response['error'] = NULL;
		}else{
			$response['response'] = array();
			$response['ack'] = 0;
			$response['error'] = NULL;
		}
		return $response;
				
	}

	function add_purchase_offer_volume($arr_attr){
		$this->objGeneral->mysql_clean($arr_attr);
		 
				//print_r($arr_attr);exit;
	  			 	 $id=$arr_attr['id']; 
					 
		  if($arr_attr['id']>0)   $where_id = " AND tst.id != '".$arr_attr['id']."' ";
		
		$data_pass = "  tst.name='".$arr_attr['name']."'   $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('service_purchase_offer_volume', $data_pass, $this->arrUser['company_id']);
 
        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }
		
		
		
	  				 if($id== 0){
				 
								 
							
									$Sql = "INSERT INTO service_purchase_offer_volume SET 
									name='".$arr_attr['name']."',
									description='$arr_attr[description]',
									type='".$arr_attr['type']."',
									status=1,
									company_id='".$this->arrUser['company_id']."',
									user_id='".$this->arrUser['id']."'	";
									$RS = $this->Conn->Execute($Sql);
									$id = $this->Conn->Insert_ID();
									}   
					  
					 else {
									$Sql = "UPDATE service_purchase_offer_volume SET  
									SET 
									name='".$arr_attr['name']."',
									description='$arr_attr[description]',
									type='".$arr_attr['type']."',
									status=1
									WHERE id = ".$id."   Limit 1"; 
									$RS = $this->Conn->Execute($Sql);
					} 
					
			//	echo $Sql;exit;
						
		if($id > 0){
			$response['id'] = $id;
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['error'] = 'Record Inserted Successfully!';
		}
		else{
			$response['ack'] = 0;
			$response['error'] = 'Record not inserted!';
		}		
		return $response;				
	}	
}	
?>