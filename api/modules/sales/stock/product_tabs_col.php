<?php
############	Start: Product of Tabs Columns ############
$app->post('/stock/product-col', function () use ($app) {
	//echo "here";exit;
	global $objStock, $input;	
	$array = array(
				"all"=> $input->all,
				"start"=> $input->start,
				"limit"=> $input->limit,
				"keyword"=> $input->keyword
	);
	//print_r($array);exit;
	$result = $objStock->get_tabs_col($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-col/sort-tab-col', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}

	// print_r($input_array);exit;
	$result = $objStock->sort_tab_col($input_array);
  
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});




$app->post('/stock/product-col/get_column_byid', function () use ($app) {
	global $objStock, $input;	
	  $array = array(
				"tab_id"=> $input->Id
	);
 
	$result = $objStock->get_list_by_tab_id($array); 
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/product-col/get-tab-col', function () use ($app) {
	global $objStock, $input;	
	$array = array(
				"id"=> $input->id
	);
	$result = $objStock->get_tab_col_by_id($array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-col/get-cols-by-tab-col', function () use ($app) {
	global $objStock, $input;	
	$array = array(
				"tab_id"=> $input->tab_id
	);
	$result = $objStock->get_cols_by_tab_id($array);
	//echo "In ocntrolelr response<pre>";print_r($result);exit;
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-col/get-selected-category', function () use ($app) {
	global $objStock, $input;	
	$array = array(
				"tab_id"=> $input->tab_id,
				"product_type"=> $input->product_type
	);
	$result = $objStock->get_selected_category($array);
	//echo "In ocntrolelr response<pre>";print_r($result);exit;
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-col/add-tab-col', function () use ($app) {
	global $objStock, $input;
	
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objStock->add_tab_col($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});


$app->post('/stock/product-col/update-tab-col', function () use ($app) {
	//echo "here";exit;
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objStock->update_tab_col($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-col/update-tab-col-val', function () use ($app) {
	global $objStock, $input;
	
	echo "Here in controller<pre>";print_r($input);exit;
	
	$input_array = array();
	$converted_array = array();
	$category_array = array();
	$brands_array = array();
	$units_array = array();
	$product_name = '';
	$product_code = '';
	$category_id = 0;
	$brand_id = 0;
	$unit_id = 0;
	
	foreach($input as $key => $val){
		$converted_array[$key] = $val;	
		
		if($key == "product_id"){
			$product_id = $val;	
		}
		
		if($key == "product_name"){
			$product_name = $val;	
		}
		
		if($key == "product_code"){
			$product_code = $val;	
		}
	}
	
	//echo "<pre>";print_r($converted_array);exit;
	
	if($converted_array['category_id']){
		foreach($converted_array['category_id'] as $key => $val){
			if($key == "id"){
				$category_id = $val;	
			}
		}
	}
	//exit;
	
	if($converted_array['brandname']){
		foreach($converted_array['brandname'] as $key => $val){
			if($key == "id"){
				$brand_id = $val;	
			}
		}
	}
	
	if($converted_array['unit_id']){
		foreach($converted_array['unit_id'] as $key => $val){
			if($key == "id"){
				$unit_id = $val;	
			}
		}
	}
	
	//exit;
	//if(!isset($converted_array['fields_data']) && !isset($converted_array['category_id']) && !isset($converted_array['brandname']) && !isset($converted_array['unit_id']) ){
		foreach($input as $key => $val){
			//echo "<br>".$key." => ".$val;
			if($key != "fields_data" && $key != "category_id" && $key != "brandname" && $key != "unit_id" && $key != "rec" && $key != "product_id" && $key != "token" && $key != "product_name" && $key != "product_code"){
				$input_array[$key] = $val;	
			}
			// get product ID
			
		}
	//}

	//echo "<pre>";print_r($input_array);exit;
	//echo "<pre>";print_r($input_array);exit;
	/*echo "Category ID=".$category_id;
	echo "<br>Brand ID=".$brand_id;
	echo "<br>Unit ID=".$unit_id;
	echo "<br>Product ID=".$product_id;
	echo "<pre>";print_r($input_array);
	exit;*/
	
	$result = $objStock->update_tab_col_val($input_array, $category_id, $brand_id, $unit_id, $product_id, $product_name, $product_code);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-col/delete-tab-col', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	$result = $objStock->delete_tab_col($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

$app->post('/stock/product-col/status-tab-col', function () use ($app) {
	global $objStock, $input;
	$input_array = array();
	
	foreach($input as $key => $val){
		$input_array[$key] = $val;	
	}
	//print_r($input_array);exit;
	$result = $objStock->status_tab_col($input_array);
	$app->response->setStatus(200);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode($result);
});

############	End: Product of Tabs ##############
