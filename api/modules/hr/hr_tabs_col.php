<?php
############	Start: hr of Tabs Columns ############
$app->post('/hr/hr_tabs_col', function () use ($app) {
	 //echo "here";exit;
	global $objHr, $input;	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	
	$result = $objHr->get_tabs_col($array);
	//print_r($result);exit;
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});



$app->post('/hr/hr_tabs_col/sort-tab-col', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}

	// print_r($input_array);exit;
	$result = $objHr->sort_tab_col($input_array);
  
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/hr/hr_tabs_col/get-tab-col', function () use ($app) {
	global $objHr, $input;	
	//echo "here";exit;
	$array = array(
				"id"=> $input->id
	);
	$result = $objHr->get_tab_col_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/hr_tabs_col/get-cols-by-tab-col', function () use ($app) {
	global $objHr, $input;	
	$array = array(
				"tab_id"=> $input->tab_id
	);
	$result = $objHr->get_cols_values($array);
	// echo "In ocntrolelr response<pre>";print_r($result);exit;
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});
	
	$app->post('/hr/hr_tabs_col/get_column_byid', function () use ($app) {
	global $objHr, $input;	
	  $array = array(
				"tab_id"=> $input->Id
	);
 
	$result = $objHr->get_list_by_tab_id($array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/hr_tabs_col/get-selected-category', function () use ($app) {
	global $objHr, $input;	
	$array = array(
				"tab_id"=> $input->tab_id  
	);
	$result = $objHr->get_selected_category($array);
	// echo "In controlelr response<pre>";print_r($result);exit;
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/hr_tabs_col/add-tab-col', function () use ($app) {
	global $objHr, $input;
	
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objHr->add_tab_col($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/hr/hr_tabs_col/update-tab-col', function () use ($app) {
	//echo "here";exit;
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objHr->update_tab_col($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/hr_tabs_col/update-tab-col-val', function () use ($app) {
	global $objHr, $input;
	
	//echo "Here in controller<pre>";print_r($input);exit;
	$input_array = array();
	$converted_array = array();
	$converted_tpes_array = array();
	$category_array = array();
	$brands_array = array();
	$units_array = array();
	$category_id = 0;
	$brand_id = 0;
	$unit_id = 0;
	
	foreach($input as $key => $val){
		$converted_array[$key] = $val;	
	}
	
	if(isset($converted_array['rec'])){
		foreach($converted_array['rec'] as $key => $val){
			$converted_tpes_array[$key] = $val;	
		}
		
		if(isset($converted_tpes_array['category_id'])){
			foreach($converted_tpes_array['category_id'] as $key => $val){
				$category_array[$key] = $val;	
			}
		$category_id = array_shift(array_slice($category_array, 0, 1));	
		}
		
		if(isset($converted_tpes_array['brandname'])){
			foreach($converted_tpes_array['brandname'] as $key => $val){
				$brands_array[$key] = $val;	
			}
		$brand_id = array_shift(array_slice($brands_array, 0, 1));	
		}
		
		if(isset($converted_tpes_array['unit_id'])){
			foreach($converted_tpes_array['unit_id'] as $key => $val){
				$units_array[$key] = $val;	
			}
		$unit_id = array_shift(array_slice($units_array, 0, 1));	
		}
	}
	
	
	
	foreach($input as $key => $val){
		//echo "<br>".$key." => ".$val;
		if($key != "rec" && $key != "token" && $key != "employee_id"){
			$input_array[$key] = $val;	
		}
		// get product ID
		if($key == "employee_id"){
			$employee_id = $val;	
		}
	}
	//echo "<pre>";print_r($input_array);exit;
	
	$result = $objHr->update_tab_col_val($input_array, $category_id, $brand_id, $unit_id, $employee_id);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/hr_tabs_col/delete-tab-col', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objHr->delete_tab_col($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/hr/hr_tabs_col/status-tab-col', function () use ($app) {
	global $objHr, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objHr->status_tab_col($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

############	End: Product of Tabs ##############
?>