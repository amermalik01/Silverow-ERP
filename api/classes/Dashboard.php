<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH."/classes/Xtreme.php");
require_once(SERVER_PATH."/classes/General.php");
require_once(SERVER_PATH . "/classes/Setup.php");

class Dashboard extends Xtreme{ 

	private $Conn = null;
	private $objGeneral = null;
	private $arrUser = null;
	private $objsetup = null;	
	private $latestVersion = null;

	function __construct($user_info=array()){
		
		parent::__construct();
		$this->Conn = parent::GetConnection();
		$this->objGeneral = new General($user_info);
        $this->objsetup = new Setup($user_info);		
		$this->arrUser = $user_info;
		$this->latestVersion = '1.0.20';	
	}
	
    function removeWhiteSpace($text)
    {
        $text = preg_replace('/[\t\n\r\0\x0B]/', ' ', $text);
        $text = preg_replace('/([\s])\1+/', ' ', $text);
        $text = trim($text);
        return $text;
    }

	function getWidgetContents(){

		$widgetQueries = array(1);//sets the first element of array to [0] => 1.... this is so widget ids match up with array ids

		$emptyString = "' '";
		
		//Top Customer Sales

		//Top Item Revenue						
		$widgetQueries['1'] = "SELECT o.sell_to_cust_id AS id, 
										o.sell_to_cust_name AS name, 
										o.sell_to_cust_no AS cust_code, 
										ROUND((IFNULL(SUM(net_amount_converted),0) - (SELECT IFNULL(SUM(ro.net_amount_converted),0) 
																					FROM return_orders AS ro 
																					WHERE %s AND ro.company_id = ".$this->arrUser['company_id']." AND 
																						ro.type IN (2,3) AND 
																						ro.sell_to_cust_id = o.sell_to_cust_id)),2) AS value 
								FROM orders AS o 
								WHERE %s AND 
									o.company_id = ".$this->arrUser['company_id']." AND  
									o.type in (2,3) 
								GROUP BY o.sell_to_cust_id 
								ORDER BY value DESC 
								LIMIT 10;";
		/*  AND 
									o.sell_to_cust_id IN (SELECT c.id 
															FROM sr_crm_listing AS c 
															WHERE c.company_id = ".$this->arrUser['company_id']." ) */
		// Top Item Sales

		$widgetQueries['2'] = " SELECT prd.id, prd.product_code,
										prd.description,
										od.unit_measure,
										(SUM(od.qty) - (SELECT IFNULL(SUM(rod1.qty), 0)
														FROM return_order_details AS rod1, return_orders AS ro1
														WHERE
															%s AND 
															rod1.order_id = ro1.id AND
															rod1.item_id=od.item_id AND
															rod1.type = 0 AND
															rod1.company_id=".$this->arrUser['company_id']." AND 
															ro1.type IN (2,3) AND 
															ro1.company_id=".$this->arrUser['company_id'].")) AS qtysold,
										ROUND((IFNULL(SUM(od.total_price),0) - (SELECT IFNULL(SUM(rod.total_price), 0)
																				FROM return_order_details AS rod, return_orders AS ro 
																				WHERE
																					%s AND 
																					rod.order_id = ro.id AND
																					rod.item_id=od.item_id AND
																					rod.type = 0 AND
																					rod.company_id=".$this->arrUser['company_id']." AND 
																					ro.type IN (2,3) AND 
																					ro.company_id=".$this->arrUser['company_id'].")
																					),2) AS revenue 
								FROM order_details AS od JOIN orders AS o ON o.id=od.order_id 
								LEFT JOIN productcache AS prd ON od.item_id=prd.id 
								LEFT JOIN employees AS emp ON emp.id = o.sale_person_id 
								WHERE %s AND 
										(o.sale_person_id = '".$this->arrUser['id']."' OR 
											emp.line_manager_name_id = '".$this->arrUser['id']."' OR 
											".$this->arrUser['user_type']." = 1 OR 
											".$this->arrUser['user_type']." = 2) AND 
										od.company_id=".$this->arrUser['company_id']." AND 
										od.type = 0 AND
										o.type IN (2,3) AND 
										o.company_id=".$this->arrUser['company_id']." AND 
										prd.company_id=".$this->arrUser['company_id']." 
								GROUP BY prd.product_code 
								ORDER BY Revenue DESC 
								LIMIT 10;";
		//Outstanding Sales Orders
		$widgetQueries['3'] = "SELECT id, 
										sale_order_code AS sales_order_no, 
										sell_to_cust_name AS name, 
										offer_date AS order_date, 
										ROUND(IFNULL(net_amount_converted, 0),2) AS value,
										delivery_date,
										requested_delivery_date 
								FROM orders 
								WHERE %s AND company_id=".$this->arrUser['company_id']." AND 
												TYPE=1 AND 
												delivery_date IS NOT NULL
								ORDER BY sale_order_code DESC 
								LIMIT 10;";
		/*  AND 
												sell_to_cust_id IN (SELECT c.id 
																	FROM sr_crm_listing AS c 
																	WHERE c.type in (2,3) AND 
																	c.company_id = ".$this->arrUser['company_id']."  )  */
		//Opportunity Cycle
		$widgetQueries['4'] = " SELECT c.name, IFNULL((SELECT COUNT(id) FROM sr_crm_opportunitycycle_details_sel AS copd WHERE copd.stage_id = c.id ), 0) AS percentage
								FROM opp_cycle_tabs c 
								WHERE c.company_id=".$this->arrUser['company_id']." AND c.status = 1 
								ORDER BY c.start_end,c.rank ASC LIMIT 0, 25;";
		//Sales Promotion
		$widgetQueries['5'] = "SELECT 1;";	
		//Sales Quotes
		$widgetQueries['6'] = "SELECT 1;";
		//Tasks
		$widgetQueries['7'] = " SELECT subject,date,time,comments,completed 
								FROM sr_tasks_view 
								WHERE user_id=".$this->arrUser['id']." AND 
										company_id=".$this->arrUser['company_id']." and 
										status <>3 
								ORDER BY date DESC;";
		//Approvals
		$widgetQueries['8'] = "SELECT * FROM (SELECT ah.object_id, ah.detail_id, ah.type, ah.object_code,
													(CASE WHEN ah.type = 1 OR ah.type = 2 THEN 'Sales Order' 
															WHEN ah.type = 3 OR ah.type = 8 THEN 'Credit Note' 
															WHEN ah.type = 4 OR ah.type = 7 THEN 'Purchase Order' 
															WHEN ah.type = 5 THEN 'Expense' 
															WHEN ah.type = 6 THEN 'Holiday' 
															END) AS ttype,
													(CASE
														WHEN ah.status = 0 THEN 'Queued for Approval'
														WHEN ah.status = 1 THEN 'Awaiting Approval'
														WHEN ah.status = 2 THEN 'Approved' 
														WHEN ah.status = 3 OR ah.status = 4 THEN 'Disapproved'
													END) AS statuss
												FROM `approval_history` AS ah 
												WHERE 
														ah.company_id=".$this->arrUser['company_id']." AND
														((".$this->arrUser['id']." IN (ah.`emp_id_1`, ah.`emp_id_2`, ah.`emp_id_3`, ah.`emp_id_4`, ah.`emp_id_5`, ah.`emp_id_6`) AND ah.status IN (1)) OR (".$this->arrUser['id']." = ah.requested_by AND ah.status IN (0, 1)))) AS qry;";

		//Outstanding Purchase Orders
		$widgetQueries['9'] = " SELECT id,order_code,sell_to_cust_name AS name, order_date, ROUND(IFNULL(grand_total_converted, 0),2) AS value,
										receiptDate,requested_delivery_date 
								FROM srm_invoice 
								WHERE %s AND company_id=".$this->arrUser['company_id']." AND 
										TYPE=3 AND 
										receiptDate IS NOT NULL
								ORDER BY order_code DESC 
								LIMIT 10;";

		/*  AND 
										sell_to_cust_id IN (SELECT s.id 
															FROM sr_srm_general_sel AS s 
															WHERE s.type IN (2,3) AND 
																s.company_id = ".$this->arrUser['company_id'].")  */

		//Top Supplier Purchases

		$widgetQueries['10'] = "SELECT sell_to_cust_id AS id,
										sell_to_cust_name AS name,
										sell_to_cust_no AS supp_code,
										(ROUND(IFNULL(SUM(grand_total_converted), 0),2) - (SELECT ROUND(IFNULL(SUM(sr.grand_total_converted), 0),2) 
																	FROM srm_order_return AS sr 
																WHERE %debit_note_filter AND 
																	sr.company_id = ".$this->arrUser['company_id']." AND 
																	type = 2 AND 
																	sr.supplierID = sell_to_cust_id )
										) AS value 
								FROM srm_invoice 
								WHERE %s AND 
									company_id = ".$this->arrUser['company_id']." AND 
									type =2 
								GROUP BY sell_to_cust_id 
								ORDER BY ROUND(SUM(grand_total_converted),2) DESC 
								LIMIT 10;";														

		/* AND 
									sell_to_cust_id IN (SELECT s.id 
														FROM sr_srm_general_sel AS s 
														WHERE s.type IN (2,3) AND 
															s.company_id = ".$this->arrUser['company_id']." )  */
		//Salesperson Performance
		$widgetQueries['11'] = "SELECT o.sale_person_id AS id,
									o.sale_person AS name,
									(ROUND(IFNULL(SUM(o.net_amount_converted), 0),2) - (SELECT ROUND(IFNULL(SUM(ro.net_amount_converted), 0),2) FROM return_orders AS ro
															WHERE %s AND 
																ro.type =2 AND 
																ro.company_id=".$this->arrUser['company_id']." AND 
																ro.sale_person_id = o.sale_person_id)
									) AS value 
								FROM orders AS o 
								WHERE %s AND 
									o.type IN (2,3) AND 
									o.company_id=".$this->arrUser['company_id']." AND 
									o.sale_person <> '' AND 
									o.sale_person IS NOT NULL 
								GROUP BY o.sale_person 
								ORDER BY 3 DESC";

		
		//Purchaser Performance
		/* $widgetQueries['12'] = "SELECT purchase_code_id AS id,srm_purchase_code AS name, ROUND(IFNULL(SUM(grand_total_converted), 0),2) AS value FROM srm_invoice WHERE %s AND company_id=".$this->arrUser['company_id']." AND srm_purchase_code <> '' AND srm_purchase_code IS NOT NULL GROUP BY srm_purchase_code ORDER BY 3 DESC"; */
		$widgetQueries['12'] = "SELECT o.purchase_code_id AS id,
									o.srm_purchase_code AS name, 
									(ROUND(IFNULL(SUM(o.grand_total_converted), 0),2) - (SELECT ROUND(IFNULL(SUM(ro.grand_total_converted), 0),2) 
																FROM srm_order_return AS ro
																WHERE 
																	%debit_note_filter AND ro.company_id=".$this->arrUser['company_id']." AND 
																	ro.type = 2 AND
																	ro.purchaserID = o.purchase_code_id
																	)
									) AS value 
								FROM srm_invoice AS o
								WHERE %s AND o.company_id=".$this->arrUser['company_id']." AND 
									o.type = 2 AND
									o.srm_purchase_code <> '' AND 
									o.srm_purchase_code IS NOT NULL 
								GROUP BY o.srm_purchase_code 
								ORDER BY 3 DESC";

		//Company Profit
		/* $widgetQueries['13'] = "SELECT ROUND(IFNULL(SUM(credit_amount), 0) - IFNULL(SUM(debit_amount), 0),2) as value FROM gl_account_txn WHERE company_id=".$this->arrUser['company_id'].";"; */
		//add any new widgets below with the name as commentsIts 

		unset($widgetQueries[0]);//unsets the first element in array 				
		return $widgetQueries;

	}

	function getUserWidgets($attr){
		// $query = $this->getWidgetContents();
		// print_r($attr['type']);exit;
		// $customerBucket = $this->getBucketSql(48);
		// $productBucket = $this->getBucketEmployeeSpecific(11);
		// $supplierBucket = $this->getBucketSql(24);
		
			$Sql = "SELECT w.id,w.heighttype,w.widthtype,w.pos,w.title,w.description,w.type,wu.query,wu.active,wu.years,wu.quarters,wu.months,wu.yearOnly
					FROM widgets AS w
					LEFT JOIN widgetuser AS wu ON w.id = wu.widget_id
					WHERE wu.user_id = " . $this->arrUser['id'] . "
					AND wu.company_id=" . $this->arrUser['company_id'] . "
					AND w.id NOT IN(5,6) 
					ORDER BY wu.pos";
			//echo $Sql;exit;
			
			$RS = $this->objsetup->CSI($Sql);
			if ($RS->RecordCount() > 0) {
				while ($Row = $RS->FetchRow()) {
					foreach($Row as $key => $value) {
						if (is_numeric($key)) unset($Row[$key]);
					}
					// echo $Row['query']."-------";

					if($Row['active'] == 1)
					{
						// $Row['query'] = str_replace("#customer_bucket#", $customerBucket, $Row['query']);
						// $Row['query'] = str_replace("#product_bucket#", $productBucket, $Row['query']);
						// $Row['query'] = str_replace("#supplier_bucket#", $supplierBucket ,$Row['query']);
						
						$RS2 = $this->objsetup->CSI($Row['query']);
						$resultSet = array();
						if ($RS2->RecordCount() > 0) {
							while ($Row2 = $RS2->FetchRow()) {
								foreach($Row2 as $key => $value) {
									if (is_numeric($key)) unset($Row2[$key]);
								}

								array_push($resultSet, $Row2);
							}
						}

						$Row['query'] = $resultSet;//puts result set of query $Row['query'];
					}
					else
						$Row['query'] = "";
						
					$res[] = $Row;
				}

				$response['ack'] = 1;
				$response['response'] = $res;

				// $response['resultSet'] = $resultSet;

				$response['error'] = NULL;
				$response['success'] = 'Successfully got widgets!';
			}
			else {
				$response['ack'] = 1;
				// $response['error'] = 'Can\'t get widgets!';
			}

			return $response;
	} 

	/* 			$widgetSql = "SELECT w.* FROM widgets AS w, widgetroles AS wr 
						WHERE
							wr.widget_id = w.id AND
							wr.permission = 1 and
							FIND_IN_SET (wr.role_id, (SELECT roles FROM employees WHERE id = ".$this->arrUser['id'].")) AND
							wr.company_id=".$this->arrUser['company_id']; */

	function generateNewWidgetsForUser($ids, $userType){
		
		$widgetQueries = $this->getWidgetContents();
        // print_r($widgetQueries);exit;

		$widgetSql = "SELECT * FROM widgets;";

		// echo $widgetSql;exit;
		$widgetRS = $this->objsetup->CSI($widgetSql);
		$newWidgetQueries = array(1);
		unset($newWidgetQueries[0]);
			if ($widgetRS->RecordCount() > 0) {
				while ($Row = $widgetRS->FetchRow()) {
					foreach($Row as $key => $value) {
						if (is_numeric($key)) unset($Row[$key]);
					}
				$SQL = "MONTH(FROM_UNIXTIME(".$Row['field'].")) = MONTH(CURDATE()) AND YEAR(FROM_UNIXTIME(".$Row['field'].")) = YEAR(CURDATE())";
				$SQL1 = "MONTH(FROM_UNIXTIME(supplierCreditNoteDate)) = MONTH(CURDATE()) AND YEAR(FROM_UNIXTIME(supplierCreditNoteDate)) = YEAR(CURDATE())";
				// $sprintf = sprintf($widgetQueries[$Row['id']],$SQL);
				// echo $sprintf;exit;
				// $query = $this->removeWhiteSpace($widgetQueries[$Row['id']]);
				$sprintf_temp = str_replace("%s", $SQL, $this->removeWhiteSpace($widgetQueries[$Row['id']]));
				$sprintf = str_replace("%debit_note_filter", $SQL1, $sprintf_temp);
				// print_r($Row);exit;
				// array_push($newWidgetQueries,$sprintf);
				$newWidgetQueries[$Row['id']] = $sprintf;
				
					$res[] = $Row;
				}
			}
			// print_r($newWidgetQueries);exit;


		foreach ($ids as $key => $value){

			$pos = intval($value) - 1;
			// $str = sprintf("%d,%d,%d,%d,%d,'%s','%s','%s','%d','%d' ",$this->arrUser['company_id'],$value['id'],$this->arrUser['id'],0,$pos,$newWidgetQueries[$value['id']],date("Y"),date("m"),2,0);
			$str = $this->arrUser['company_id'].', '.$value.', '.$this->arrUser['id'].', 0, '.$pos.', "'.$newWidgetQueries[$value].'", '.date("Y").', '.date("m").', 2, 0, '.$this->arrUser['id'].', UNIX_TIMESTAMP (NOW())';

			// echo $str;exit;
			$widgetUsersSql = "INSERT INTO widgetuser (company_id,widget_id,user_id,active,pos,query,years,months,current,yearOnly, AddedBy, AddedOn) 
										SELECT DISTINCT ".$str." FROM widgetone 
										WHERE NOT EXISTS (SELECT 1 FROM widgetuser AS w2 
																WHERE w2.`company_id`=".$this->arrUser['company_id']." AND 
																	w2.widget_id=".$value." AND w2.user_id=".$this->arrUser['id'].")";
			// echo $widgetUsersSql;exit;
			$RSwidgetUsersSql = $this->objsetup->CSI($widgetUsersSql);
		}

		// $str = implode(",",$strArray);
		// echo $str;exit;
		
	}

	// $Sql = "SELECT w.id 
	// 			FROM widgets AS w, 
	// 			widgetroles AS wr 
	// 			WHERE wr.widget_id = w.id AND
	// 			FIND_IN_SET (wr.role_id, (SELECT roles FROM employees WHERE id = ".$this->arrUser['id'].")) AND
	// 			wr.permission = 1 AND
	// 			wr.company_id=".$this->arrUser['company_id']." AND
	// 			w.id NOT IN (SELECT widget_id FROM widgetuser WHERE company_id=".$this->arrUser['company_id']." AND user_id=".$this->arrUser['id'].");";

	function getUserRoles(){
		$Sql = "SELECT roles from employees WHERE id=" . $this->arrUser['id'] . ";";
		// echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);

		if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
				foreach ($Row as $key => $value) {
					if (is_numeric($key))
					unset($Row[$key]);
				}
				$roles = explode(",",$Row['roles']);
				// print_r($roles);exit;
			}
		}
		return $roles;
	}

	function checkUserWidgets($attr){

		// print_r($attr['userType']);exit; 
		$this->Conn->beginTrans();
		$this->Conn->autoCommit = false;
		
		$table = '';
		if($attr['type'] == 1)
			$table = "widgets";
		else if($attr['type'] == 2)
			$table = "reports";
		else
			return;
		
		if ($attr['userType'] != 1 && $attr['userType'] != 2) {
			$roles = $this->getUserRoles();

			// print_r($roles);exit;

			$Sql = '';
			foreach($roles as $key => $value) {
				$Sql.= "SELECT widget_id 
						FROM widgetroles 
						WHERE type= ".$attr['type']." AND role_id='" . $value . "' AND permission=1 AND company_id=" . $this->arrUser['company_id'] . " UNION ";
			}

			$Sql = substr($Sql, 0, -6);

			// echo $Sql;exit;

			$RS = $this->objsetup->CSI($Sql);
			if ($RS->RecordCount() > 0) {
				while ($Row = $RS->FetchRow()) {
					foreach($Row as $key => $value) {
						if (is_numeric($key)) unset($Row[$key]);
					}

					$ids[] = $Row['widget_id'];
				}
			}

			if (!empty($ids)) {
				$this->generateNewWidgetsForUser($ids, $attr['userType']);
				$response['message'] = 'You didn\'t have all the widgets, but you now do!';
				$response['ack'] = 1;
				$response['error'] = NULL;
			}
			else {
				$response['ack'] = 0;
				$response['success'] = 'You have all the '.$table;
			}
		}
		else {
			$Sql = "SELECT id 
					FROM $table 
					WHERE id NOT IN (SELECT widget_id FROM widgetuser WHERE company_id=" . $this->arrUser['company_id'] . " AND user_id=" . $this->arrUser['id'] . ");";
			// echo $Sql;exit;
			$RS = $this->objsetup->CSI($Sql);
			// print_r($RS->RecordCount());exit;
			if ($RS->RecordCount() > 0) {
				while ($Row = $RS->FetchRow()) {
					foreach($Row as $key => $value) {
						if (is_numeric($key)) unset($Row[$key]);
					}

					$ids[] = $Row['id'];

					// print_r($Row);exit;

				}
				if (!empty($ids)) {
					$this->generateNewWidgetsForUser($ids, $attr['userType']);
					$response['message'] = 'You didn\'t have all the widgets, but you now do!';
					$response['ack'] = 1;
					$response['error'] = NULL;
				}
			}
			else {
				$response['ack'] = 0;
				$response['success'] = 'You have all the '.$table;
			}
		}
		$this->Conn->commitTrans();
		$this->Conn->autoCommit = true;
		return $response;
	}

	function checkUserWidgetsRoles($attr){ 
		// print_r($attr);exit;
		$table = '';
		if($attr['type'] == 1)
			$table = "widgets";
		else if($attr['type'] == 2)
			$table = "reports";
		else
			return;
		
		$Sql = "SELECT DISTINCT rr.id as role_id ,w.id as widget_id
				FROM ref_roles AS rr, $table AS w
				WHERE rr.company_id=" . $this->arrUser['company_id'] . " AND rr.status=1 AND rr.id NOT IN 
				(SELECT wr.role_id FROM widgetroles AS wr 
				WHERE wr.company_id=" . $this->arrUser['company_id'] . " AND wr.`widget_id`=w.id AND wr.type=".$attr['type'].")";

		// echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);
		// print_r($RS->RecordCount());exit;
		$ids = array();
		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
				foreach ($Row as $key => $value) {
					if (is_numeric($key))
					unset($Row[$key]);
				}
				$ids[] = $Row;
				// print_r($Row);exit;
			}
			if (!empty($ids)){
				$this->generateNewWidgetsDepartmentsForUser($ids,$attr['type']);
				$response['message'] = 'Successfully added roles into widgets table';
				$response['ack'] = 1;		
				$response['error'] = NULL;
			} 
		} else {
			$response['ack'] = 0;
			$response['error'] = 'You have all the widgetroles';
		}

		return $response;		
	}

	function generateNewWidgetsDepartmentsForUser($ids,$type){
		// print_r($ids);exit;
				
		foreach ($ids as $key => $value){
			// print_r($value['department_id']);
			$Sql = "INSERT INTO widgetroles 
										SET 
											widget_id=".$value['widget_id'].",
											role_id=".$value['role_id'].",
											permission=0,
											type=$type,
											company_id=".$this->arrUser['company_id'];
			// echo $Sql;exit;
			$RS = $this->objsetup->CSI($Sql);
		}
		// exit;
	}

	function updateWidgetContents($attr){
		// print_r($attr);exit;
		if(empty($attr['options']->yearOnly)) $attr['options']->yearOnly = 0;
		if(empty($attr['options']->current)) $attr['options']->current = 0;

		$Sql = "SELECT w.id,w.table,w.field  
				FROM widgets as w 
				LEFT JOIN widgetuser as wu ON w.id=wu.widget_id
				WHERE id= ".$attr['widgetID'].";";
		// echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);

		// print_r($RS->fields);exit;
		$table = $RS->fields['table'];
		$field = $RS->fields['field'];
		$allWidgetQueries = $this->getWidgetContents();
		$query = $allWidgetQueries[$attr['widgetID']];
		// print_r($query);exit;
		// echo $query;exit;

		$option = '';

		if($attr['options']->year != ''){
			if($attr['options']->periodId == 'quarter' || $attr['options']->current == "1"){
				$option = "YEAR(FROM_UNIXTIME(".$field.")) = '".$attr['options']->year."' AND QUARTER(FROM_UNIXTIME(".$field.")) = '".$attr['options']->quarters."'";
				$option1 = "YEAR(FROM_UNIXTIME(supplierCreditNoteDate)) = '".$attr['options']->year."' AND QUARTER(FROM_UNIXTIME(supplierCreditNoteDate)) = '".$attr['options']->quarters."'";
			} elseif ($attr['options']->periodId == 'month' || $attr['options']->current == "2") {
				$option = "YEAR(FROM_UNIXTIME(".$field.")) = '".$attr['options']->year."' AND MONTH(FROM_UNIXTIME(".$field.")) = '".$attr['options']->months."'";
				$option1 = "YEAR(FROM_UNIXTIME(supplierCreditNoteDate)) = '".$attr['options']->year."' AND MONTH(FROM_UNIXTIME(supplierCreditNoteDate)) = '".$attr['options']->months."'";
			} elseif ($attr['options']->periodId == 'year' || $attr['options']->current == "0") {
				$option = "YEAR(FROM_UNIXTIME(".$field.")) = '".$attr['options']->year."'";
				$option1 = "YEAR(FROM_UNIXTIME(supplierCreditNoteDate)) = '".$attr['options']->year."'";
			}
		}
		// echo $option;exit;

		// $query = sprintf($query,$option);
		$query = str_replace("%s", $option, $this->removeWhiteSpace($query));
		$query = str_replace("%debit_note_filter", $option1, $query);
		// echo $query;exit;
		$year 		= (isset($attr['options']->year) && $attr['options']->year != '') ? $attr['options']->year : 0;
		$months 	= (isset($attr['options']->months) && $attr['options']->months != '') ? $attr['options']->months : 0;
		$quarters 	= (isset($attr['options']->quarters) && $attr['options']->quarters != '') ? $attr['options']->quarters : 0;
		$current 	= (isset($attr['options']->current) && $attr['options']->current != '') ? $attr['options']->current : 0;

		$Sql2 = 'UPDATE widgetuser 
							SET 
								query = "'.$query.'",
								years='.$year.',
								months='.$months.',
								quarters='.$quarters.',
								yearOnly='.$attr['options']->yearOnly.',
								current='.$current.'
								WHERE user_id='.$this->arrUser['id'].'
								AND company_id='.$this->arrUser['company_id'].'
								AND widget_id='.$attr['widgetID'];
		// echo $Sql2;exit;
		$RS2 = $this->objsetup->CSI($Sql2); 

		if ($this->Conn->Affected_Rows() > 0) {

			// $customerBucket = $this->getBucketSql(48);
			// $productBucket = $this->getBucketEmployeeSpecific(11);
			// $supplierBucket = $this->getBucketSql(24);

			// $query = str_replace("#customer_bucket#", $customerBucket, $query);
			// $query = str_replace("#product_bucket#", $productBucket, $query);
			// $query = str_replace("#supplier_bucket#", $supplierBucket ,$query);
			// echo $query;exit;
			$RS3 = $this->objsetup->CSI($query); 
			// print_r($RS3);exit;
			if ($RS3->RecordCount() > 0) {
						while ($Row = $RS3->FetchRow()) {
							foreach($Row as $key => $value) {
								if (is_numeric($key)) unset($Row[$key]);
							}
							$res[] = $Row;
						}
					}

			if (!empty($res)) {
				$response['ack'] = 1;
				$response['newQueryResults'] = $res;
				$response['newQuery'] = $query;				
				$response['error'] = NULL;
				$response['success'] = 'Updated Widget Options';
			} else{
				$response['ack'] = 3;
				$response['query'] = $query;
				$response['newQueryResults'] = null;
				$response['error'] = 'No data found! Please redo options';
			}
		} elseif ($this->Conn->Affected_Rows() == 0){
			$response['ack'] = 2;
            $response['error'] = NULL;
            $response['error'] = 'Widget data Unchanged';
		} else {
			$response['ack'] = 0;
            $response['error'] = 'Can\'t Update Widget Options!';
		}
		return $response;

	}

	function getRolesForSetup($attr){

		$table = '';
		if($attr['type'] == 1)
			$table = "widgets";
		else if($attr['type'] == 2)
			$table = "reports";
		else
			return;

		$excluded_widget_ids = '';


		$Sql = "SELECT id,role FROM ref_roles WHERE company_id=" . $this->arrUser['company_id'] ." AND STATUS=1;";
		// echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql,'general',sr_ViewPermission);
		// print_r($RS->RecordCount());exit;

		if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
				foreach ($Row as $key => $value) {
					if (is_numeric($key))
					unset($Row[$key]);
				}
				$res[] = $Row;
			}
			$response['roles'] = $res;
		}

		if($attr['type'] == 1)
		$excluded_widget_ids = ' AND widget_id NOT IN (5,6)';
		else
		$excluded_widget_ids = '';

		$Sql2 = "SELECT * FROM widgetroles WHERE type=".$attr['type']." AND company_id=" . $this->arrUser['company_id'] ." ".$excluded_widget_ids."  ORDER BY widget_id, role_id";
		// echo $Sql2;exit;
		$RS2 = $this->objsetup->CSI($Sql2);
		// print_r($RS->RecordCount());exit;

		if ($RS2->RecordCount() > 0) {
            while ($Row2 = $RS2->FetchRow()) {
				foreach ($Row2 as $key => $value) {
					if (is_numeric($key))
					unset($Row2[$key]);
				}
				$res2[] = $Row2;
			}
			$response['widgetRoles'] = $res2;
		}
		$where = "";
		if($attr['type'] == 2){
			$where = " WHERE status = 1 ORDER BY position ";
		}
			
		
		$where_excluded_widget_ids='';
		if($attr['type'] == 1){
			$where_excluded_widget_ids = ' WHERE id NOT IN (5,6)';		
		}
		$Sql3 = "SELECT id,title FROM $table ".$where_excluded_widget_ids.$where;
		// echo $Sql3;exit;
		$RS3 = $this->objsetup->CSI($Sql3);
		// print_r($RS->RecordCount());exit;

		if ($RS3->RecordCount() > 0) {
            while ($Row3 = $RS3->FetchRow()) {
				foreach ($Row3 as $key => $value) {
					if (is_numeric($key))
					unset($Row3[$key]);
				}
				$res3[] = $Row3;				
			}
			$response['widgets'] = $res3;

			$response['message'] = 'Got widget Roles';
			$response['ack'] = 1;		
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['success'] = 'Can\'t get widget Roles';
		}
		return $response;
	}

	function getReportRolesForSetup($attr)
	{
		$table = '';
		if($attr['type'] == 1)
			$table = "widgets";
		else if($attr['type'] == 2)
			$table = "reports";
		else
			return;

			
		if ($attr['userType'] != 1 && $attr['userType'] != 2) {
			$roles = $this->getUserRoles();

			// print_r($roles);exit;

			$Sql = '';
			foreach($roles as $key => $value) {
				$Sql.= "SELECT widget_id AS id FROM widgetroles WHERE type=".$attr['type']." AND role_id='" . $value . "' AND permission=1 AND company_id=" . $this->arrUser['company_id'] . " UNION ";
			}

			$Sql = substr($Sql, 0, -6);

			// echo $Sql;exit;

			$RS = $this->objsetup->CSI($Sql);
			if ($RS->RecordCount() > 0) {
				while ($Row = $RS->FetchRow()) {
					foreach($Row as $key => $value) {
						if (is_numeric($key)) unset($Row[$key]);
					}

					$response['response'][] = $Row['id'];
				}
				$response['ack'] = 1;
			}
			else
			{
				$response['response']['ack'] = 0;
			}
		}
		else {
			$Sql = "SELECT id FROM $table";
			// echo $Sql;exit;
			$RS = $this->objsetup->CSI($Sql);
			// print_r($RS->RecordCount());exit;
			if ($RS->RecordCount() > 0) {
				while ($Row = $RS->FetchRow()) {
					foreach($Row as $key => $value) {
						if (is_numeric($key)) unset($Row[$key]);
					}
					$response['response'][] = $Row['id'];
				}
				$response['ack'] = 1;
			}
			else {
				$response['ack'] = 0;
				$response['success'] = 'You have all the widgets';
			}
		}

		return $response;
	}

	function saveWidgetRoles($attr){
		// print_r($attr['widgetRoles']);exit;
		$this->Conn->beginTrans();
		$this->Conn->autoCommit = false;

		$updateFlag = 0;
		$unchagedFlag = 0;
		// $uncheckedWidgets = '';

		foreach ($attr['widgetRoles'] as $key => $value){
			// print_r($value->permission);exit;
			if ($value->permission != '1'){
				$value->permission = 0;
			} 
			// if ($value->permission == 1){
			// 	$uncheckedWidgets  .= $value->widget_id.',';
			// } 

			$Sql = "UPDATE widgetroles SET permission=".$value->permission." WHERE type='".$value->type."' AND widget_id='".$value->widget_id."' AND role_id='".$value->role_id."' AND company_id=".$this->arrUser['company_id'];
			// echo $Sql;exit;
			$RS = $this->objsetup->CSI($Sql);

			if ($this->Conn->Affected_Rows() > 0) $updateFlag++;
			if ($this->Conn->Affected_Rows() == 0) $unchagedFlag++;
		}

		if($attr['type'] == 1)
		{
			$SP = "CALL SR_Widgets_On_Save(".$this->arrUser['company_id'].",".$this->arrUser['id'].");";
			$RS2 = $this->objsetup->CSI($SP);
		}

		if ($updateFlag > 0) {
			$response['ack'] = 1;
			$response['error'] = NULL;
			$response['success'] = 'Successfully updated Widget role';
		} elseif ($unchagedFlag > 0) {
			$response['ack'] = 0;
			$response['error'] = 'Record Updated Successfully';
		} else {
			$response['ack'] = 0;
			$response['error'] = 'Can\'t update Widget role';
		}
		
		$this->Conn->commitTrans();
		$this->Conn->autoCommit = true;
		return $response;

	}

 	function openWidgetOptionsModal($attr){
		// print_r($attr);exit;		
		$Sql = "SELECT w.table,w.field from widgets as w WHERE id=".$attr['widgetID'].";";
		// echo $Sql;exit; 
		$RS = $this->objsetup->CSI($Sql);
		// print_r($RS);exit;

		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
				foreach ($Row as $key => $value) {
					if (is_numeric($key))
						unset($Row[$key]);
				}
				$res = $Row;
				// print_r($res);exit;				
			}

			$_type = ''; 
			if($attr['widgetID'] == 1){
				$_type = ' and type = 2';
			} else if ($attr['widgetID'] == 3){
				$_type = ' and type = 1';
				$res['field'] = 'offer_date';
			}

			$Sql2 = "SELECT YEAR(FROM_UNIXTIME(".$res['field'].")) as years
						FROM ".$res['table']."
						WHERE company_id=".$this->arrUser['company_id']." AND $res[field] IS NOT NULL AND $res[field] <> 0 $_type
						GROUP BY YEAR(FROM_UNIXTIME(".$res['field']."))
						ORDER BY years DESC;";
			// echo $Sql2;exit;
			$RS2 = $this->objsetup->CSI($Sql2);
		
			if ($RS2->RecordCount() > 0) {
				while ($Row2 = $RS2->FetchRow()) {
					foreach ($Row2 as $key => $value) {
						if (is_numeric($key))
							unset($Row2[$key]);
					}
					if(intval($Row2['years']) > 0)
						$response['response'][] = $Row2['years'];
					// print_r($res);exit;				
				}
			}

			$Sql3 = "SELECT query,years,quarters,months,yearOnly,current
						FROM widgetuser
						WHERE user_id=".$this->arrUser['id']."
						AND company_id=".$this->arrUser['company_id']."
						AND widget_id=".$attr['widgetID'].";";
			// echo $Sql3;exit; 
			$RS3 = $this->objsetup->CSI($Sql3);

			if ($RS2->RecordCount() > 0) {
				while ($Row3 = $RS3->FetchRow()) {
					foreach ($Row3 as $key => $value) {
						if (is_numeric($key))
							unset($Row3[$key]);
					}
					// print_r($Row3);exit;				
					$response['widgetOptionData'] = $Row3;
				}
			}
			$response['ack'] = 1;
            $response['error'] = NULL;
            // $response['response'] = $years;
			$response['success'] = 'Successfully got widget Years!';
		}
		else {
			$response['ack'] = 0;
			$response['error'] = 'Can\'t get widget Years!';
		}
		return $response;		
	}

	function getVersionData($attr){
		$Sql = "SELECT vh.version, vh.date,dev.devtype, dev.description
                FROM   version_history AS vh, sr_version_history_devtype_sel AS dev 
				WHERE dev.id = vh.id AND  vh.id = (SELECT MAX(vhs.id) FROM version_history AS vhs) ";
		// echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);
		if ($RS->RecordCount() > 0) {
			while ($Row = $RS->FetchRow()) {
				foreach ($Row as $key => $value) {
					if (is_numeric($key))
						unset($Row[$key]);
				}
				$res[] = $Row;
			}
			$response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = $res;
            $response['success'] = 'Successfully got most recent Version Data!';
		} else {
			$response['ack'] = 0;
            $response['error'] = 'Can\'t get most recent Version Data!';
		}
		return $response;
	}	

	function updateVersionData($attr){
		// print_r($attr);exit;
		$Sql = "INSERT INTO version_history SET version='".$attr['data']->newVersion."',
										   date=".$this->objGeneral->convert_date($attr['data']->date)."";
		// echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);
		$id = $this->Conn->Insert_ID();

		if ($id > 0) {
			foreach ($attr['bugs'] as $value){
				$this->updateVersionDataBugs($id, $value);
			}
			foreach ($attr['features'] as $value){
				$this->updateVersionDataFeatures($id, $value);
			}
			if ($this->Conn->Affected_Rows() > 0) {
				$response['ack'] = 1;
				$response['error'] = NULL;
				$response['success'] = 'Successfully added New Version';
			}
		} else {
				$response['ack'] = 0;
				$response['error'] = 'Can\'t add New Version';
			}
			return $response;
	}

	function updateVersionDataBugs($id, $bugs){
		$Sql = "INSERT INTO version_history_bugs SET versionID=".$id.", bugs='".$bugs."'";
		// echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);
	}

	function updateVersionDataFeatures($id, $features){
		$Sql = "INSERT INTO version_history_features SET versionID=".$id.", features='".$features."'";
		// echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);
	}

	function updateWidgetActive($attr){
		$set_pos = '';
		if($attr['active']==1){
			$SqlC = "SELECT * FROM   widgetuser WHERE user_id=".$this->arrUser['id']." AND active=1";
			// echo $Sql;exit;
			$RSC = $this->objsetup->CSI($SqlC);
			$activeRecords = $RSC->RecordCount();
			$pos = $activeRecords; 
			$set_pos = ", pos = ".$pos."";
		}

		$Sql = "UPDATE widgetuser SET active=".$attr['active']." ".$set_pos." WHERE widget_id = ".$attr['widgetId']." AND user_id=".$this->arrUser['id']."";
		// echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);

		if ($this->Conn->Affected_Rows() > 0) {
			$response['ack'] = 1;
            $response['error'] = NULL;
            $response['success'] = 'Successfully updated active state';
		} else {
			$response['ack'] = 0;
            $response['error'] = 'Can\'t update active state!';
		}
		return $response;
	}	

	function saveWidgetPos($attr){
		if(!empty($attr['activeWidgetPos'])){
			foreach ($attr['activeWidgetPos'] as $key => $pos){
				$Sql = "UPDATE widgetuser SET pos=".$key." WHERE widget_id=".$pos." AND user_id=".$this->arrUser['id'].";";
				// echo $Sql;
				$RS = $this->objsetup->CSI($Sql);
			}

			if ($this->Conn->Affected_Rows() > 0) {
				$response['ack'] = 1;
				$response['error'] = NULL;
				$response['success'] = 'Widgets Updated Successfully.';
			} else {
				$response['ack'] = 0;
				$response['error'] = 'Can\'t move positions';
			}

		} else{
			$response['ack'] = 1;
			$response['success'] = 'Positions Unchanged.';
		}

		return $response;
	}

	function getBucketSql($refModule){

		if ($this->arrUser['user_type'] == 1 || $this->arrUser['user_type'] == 2){
            $WhereQueries = " 1 ";
            return $WhereQueries;
        }

		$bucketSql = "SELECT IFNULL(SR_get_bucket_where_clause($refModule,".$this->arrUser['company_id'].",".$this->arrUser['id']."),'-999');";
		// echo $bucketSql;exit;
		$bucketRS = $this->objsetup->CSI($bucketSql);
		return $bucketRS->fields[0];
	}

	function getBucketEmployeeSpecific($refModule,$moduleTypeItem){

		if ($this->arrUser['user_type'] == 1 || $this->arrUser['user_type'] == 2){
            $WhereQueries = " 1 ";
            return $WhereQueries;
        }

		$bucketSql = "SELECT IFNULL(SR_getBucketEmployeeSpecific($refModule,".$this->arrUser['company_id'].",".$this->arrUser['id']."),'-999');";
		// echo $bucketSql;exit;
		$bucketRS = $this->objsetup->CSI($bucketSql);
		return $bucketRS->fields[0];
	}

	function getWidgetsForEmployeeSetup($attr){
		$Sql3 = "SELECT id,title FROM widgets";
		// echo $Sql;exit;
		$RS3 = $this->objsetup->CSI($Sql3);
		// print_r($RS->RecordCount());exit;

		if ($RS3->RecordCount() > 0) {
            while ($Row3 = $RS3->FetchRow()) {
				foreach ($Row3 as $key => $value) {
					if (is_numeric($key))
					unset($Row3[$key]);
				}
				$res3[] = $Row3;				
			}
			$response['widgets'] = $res3;

			$response['message'] = 'Got widget Roles';
			$response['ack'] = 1;		
			$response['error'] = NULL;
		} else {
			$response['ack'] = 0;
			$response['success'] = 'Can\'t get widget Roles';
		}
		return $response;
	}

	function check_released_version($attr){

		$Sql = "SELECT released_version
				FROM employee_last_activity 
				WHERE emp_id =".$this->arrUser['id']." AND released_version= '".$this->latestVersion."'";
		// echo $Sql;exit;
		$RS = $this->objsetup->CSI($Sql);

		if ($RS->RecordCount() > 0) {
			$response['success'] = 'Got latest version!';
			$response['ack'] = 1;		
			$response['error'] = NULL;
		}
		else{
			$SqlU = "UPDATE employee_last_activity 
										SET 
											released_version= '".$this->latestVersion."'
										WHERE emp_id =".$this->arrUser['id'].";";
			// echo $Sql;exit;
			$RSU = $this->objsetup->CSI($SqlU);

			$response['error'] = 'Don\'t have latest version!';
			$response['ack'] = 0;		
		}
        return $response;
    }
}
<<<<<<< HEAD
?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
