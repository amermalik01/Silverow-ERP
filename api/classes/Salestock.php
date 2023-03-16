<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH. "/classes/Setup.php");

class Salestock extends Xtreme
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
        $this->arrUser = $user_info;
        $this->objsetup = new Setup($this->arrUser);
    }

    // static	
    function delete_update_status($table_name, $column, $id)
    {
        $Sql = "UPDATE $table_name SET  $column=0 	WHERE id = $id Limit 1";

        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        /* 	$uploads_dir = UPLOAD_PATH.'sales/';
          $Sql1 = "SELECT *
          FROM document
          WHERE id='".$attr['id']."'
          LIMIT 1";
          $Row = $this->objsetup->CSI($Sql1)->FetchRow();
          if($Row[file] != '')
          unlink($uploads_dir.$Row[file]);
         */
        return $response;
    }

    function get_data_by_id($table_name, $id)
    {

        $Sql = "SELECT *
				FROM $table_name
				WHERE id=$id
                LIMIT 1";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function get_unit_setup_list_category($attr)
    {
        $response = array();

        $total = 0;

        if ($attr['item_id'] != 0)
            $where = "and product_id='" . $attr['item_id'] . "'  ";


        $Sql = "SELECT   c.id,c.quantity,us.title as name,c.cat_id,c.ref_unit_id,c.ref_quantity
		 FROM  units_of_measure_setup  c 
		right JOIN units_of_measure us on us.id=c.cat_id 
		where  
		 c.status=1 	and us.status=1  
		 $where 
		group by us.title ASC order by c.id  ASC";  //group by c.quantity ASC " ;  
        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                if ($attr['item_id'] != 0) {
                    $result['quantity'] = $Row['quantity'];
                    $result['unit_id'] = $Row['cat_id'];
                    $result['ref_unit_id'] = $Row['ref_unit_id'];
                }

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['total'] = $total;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['response'][] = array();
        }


        /* 	$sort = array();
          foreach( $response['response'] as $k=>$v) {
          $sort['id'][$k] = $v['id'];
          }
          array_multisort($sort['id'], SORT_DESC, $response['id']);

         */

        // print_r($response);exit;
        return $response;
    }

    function get_all_products($attr)
    {
        //$this->objGeneral->mysql_clean($attr);''
        $limit_clause = $where_clause = "";
        $response = array();
        $str_where = '';
        if (isset($attr['categories'])) {
            $arrIds = array();
            foreach ($attr['categories'] as $value) {
                $arrIds[] = $value->id;
            }
            $strIds = implode(',', $arrIds);
            $str_where = " AND prd.category_id IN (" . $strIds . ")";
        }

        if (isset($attr['brands'])) {
            $arrIds = array();
            foreach ($attr['brands'] as $value) {
                $arrIds[] = $value->id;
            }
            $strIds = implode(',', $arrIds);
            $str_where = " AND prd.brand_id IN (" . $strIds . ")";
        }
        $str_where2 = '';
        if (!empty($attr['uom_id']))
            $str_where2 = " AND prd.unit_id = '" . $attr['uom_id'] . "' ";


        if (!empty($attr['searchKeyword'])) {
            $val = intval(preg_replace("/[^0-9]/", '', $attr['searchKeyword']));
            if ($val != 0)
                $where_clause .= " AND  prd.product_code LIKE '%$val%'  ";
            else
                $where_clause .= "   AND prd.description LIKE '%$attr[searchKeyword]%'";
        }


        if (!empty($attr['category_name']))
            $where_clause .= " AND prd.category_id=$attr[category_name] ";
        if (!empty($attr['brand_name']))
            $where_clause .= " AND prd.brand_id=$attr[brand_name] ";
        if (!empty($attr['unitss']))
            $where_clause .= " AND prd.unit_id=$attr[unitss] ";


        $Sql = "SELECT prd.id,prd.product_code,prd.description,prd.status
		,prd.brand_id,prd.category_id,prd.unit_id
		,prd.standard_price
		, " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('brand', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->get_nested_query_list('unit', $this->arrUser['company_id']) . "
		, " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . "
		From product  prd
		LEFT JOIN company on company.id=prd.company_id 
		where
		prd.product_code IS NOT NULL
		and (prd.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		" . $str_where . "
		" . $str_where2 . "
		" . $where_clause . "";
        
        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'prd');
        //echo $response['q'];exit;		
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['code'] = $Row['product_code'];
                //$result['description'] = $Row['description'];
                $result['name'] = $Row['description'];
                $result['category_name'] = $Row['category_name'];
                $result['brand_name'] = $Row['brand_name'];
                $result['unit_name'] = $Row['unit_name'];

                $result['standard_price'] = $Row['standard_price'];
                $result['current_stock'] = $Row['current_stock'];

                $result['brand_id'] = $Row['brand_id'];
                $result['category_id'] = $Row['category_id'];
                $result['unit_id'] = $Row['unit_id'];


                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_excluded_products($arr_attr)
    {
        $sql = "DELETE FROM promotion_excluded_product WHERE sale_promotion_id='$arr_attr[sale_promotion_id]'";
        $this->objsetup->CSI($sql);


        //echo "<pre>"; print_r($arr_attr['customers']); 
        foreach ($arr_attr['products'] as $value) {
            $Sql = "INSERT INTO promotion_excluded_product
				SET product_id=" . $value->id . ",category_id='$arr_attr[category_id]',sale_promotion_id='$arr_attr[sale_promotion_id]',brand_id='$arr_attr[brand_id]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
            $RS = $this->objsetup->CSI($Sql);
        }
    }

    function get_excluded_products($arr_attr)
    {
        $Sql = "SELECT product_id FROM promotion_excluded_product
			WHERE sale_promotion_id = $arr_attr[sale_promotion_id]";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
        $arrIds = array();
        $strIds = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $arrIds[] = $Row['product_id'];
            };
        }

        $strIds = implode(',', $arrIds);
        $response = array();

        $prodSql = " SELECT product.id,product.product_code,product.description,product.standard_price 
				FROM product
				JOIN company on company.id=product.company_id
				WHERE product.status = 1 and product.id in (" . $strIds . ") and (company_id=" . $this->arrUser['company_id'] . " 
				or  company.parent_id=" . $this->arrUser['company_id'] . ")
				order by product.id ASC"; //d.status=1 and 
        //echo $prodSql; exit;
        $prodRS = $this->objsetup->CSI($prodSql);
        if ($prodRS->RecordCount() > 0) {
            while ($Row = $prodRS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['product_code'] = $Row['product_code'];
                $result['description'] = $Row['description'];
                $result['standard_price'] = $Row['standard_price'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_price_adjustment_excluded_products($arr_attr)
    {
        $sql = "DELETE FROM price_adjustment_excluded_product WHERE price_adjustment_id='$arr_attr[sale_promotion_id]'";
        $this->objsetup->CSI($sql);


        //echo "<pre>"; print_r($arr_attr['customers']); 
        foreach ($arr_attr['products'] as $value) {
            $Sql = "INSERT INTO price_adjustment_excluded_product
				SET product_id=" . $value->id . ",category_id='$arr_attr[category_id]',price_adjustment_id='$arr_attr[sale_promotion_id]',brand_id='$arr_attr[brand_id]',user_id='" . $this->arrUser['id'] . "',company_id='" . $this->arrUser['company_id'] . "'";
            $RS = $this->objsetup->CSI($Sql);
        }
    }

    function get_price_adjustment_excluded_products($arr_attr)
    {
        $Sql = "SELECT product_id FROM price_adjustment_excluded_product
			WHERE price_adjustment_id = $arr_attr[sale_promotion_id]";

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
        $arrIds = array();
        $strIds = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $arrIds[] = $Row['product_id'];
            };
        }

        $strIds = implode(',', $arrIds);
        $response = array();

        $prodSql = " SELECT product.id,product.product_code,product.description,product.standard_price 
				FROM product
				JOIN company on company.id=product.company_id
				WHERE product.status = 1 and product.id in (" . $strIds . ") and (company_id=" . $this->arrUser['company_id'] . " 
				or  company.parent_id=" . $this->arrUser['company_id'] . ")
				order by product.id ASC"; //d.status=1 and 
        //echo $prodSql; exit;
        $prodRS = $this->objsetup->CSI($prodSql);
        if ($prodRS->RecordCount() > 0) {
            while ($Row = $prodRS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['product_code'] = $Row['product_code'];
                $result['description'] = $Row['description'];
                $result['standard_price'] = $Row['standard_price'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    /*function get_sale_offer_volume_by_type($attr)
    {
        //$this->objGeneral->mysql_clean($attr);
        $strIds = implode(',', $attr['customer_item_info_id']);
        //echo $strIds;
        $strLimit = '';
        if (isset($attr['isAdded']) && $attr['isAdded'] > 0)
            $strLimit = ' ORDER BY p.id DESC limit ' . count($attr['customer_item_info_id']);

        $Sql = "SELECT p.*,
		( SELECT wh.title  FROM units_of_measure_setup st 
		 JOIN units_of_measure as wh ON wh.id = st.cat_id
		where st.id =p.unit_category_id and st.status=1 ) as cat_name ,
		crm.name as crm_name,crm_alt_depot.depot as alt_location,crm_region.title as crm_region
		,crm_segment.title as crm_segment,crm_buying_group.title as crm_buying_group
		FROM crm_product_volume p
		LEFT JOIN crm ON (crm.id = p.crm_id)
		LEFT JOIN crm_alt_depot ON (crm_alt_depot.id = p.crm_id)
		LEFT JOIN crm_region ON (crm_region.id = p.crm_id)
		LEFT JOIN crm_segment ON (crm_segment.id = p.crm_id)
		LEFT JOIN crm_buying_group ON (crm_buying_group.id = p.crm_id)

		WHERE p.customer_item_info_id IN (" . $strIds . ") AND p.status=1 " . $strLimit;

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $crm = '';
                if ($Row['type'] == 1)
                    $crm = $Row['crm_name'];
                if ($Row['type'] == 2)
                    $crm = $Row['alt_location'];
                if ($Row['type'] == 3)
                    $crm = $Row['crm_region'];
                if ($Row['type'] == 4)
                    $crm = $Row['crm_segment'];
                if ($Row['type'] == 5)
                    $crm = $Row['crm_buying_group'];

                $result['id'] = $Row['id'];
                $result['crm_id'] = $Row['crm_id'];
                $result['quantity_to'] = $Row['quantity_from'];
                $result['quantity_from'] = $Row['crm_id'];
                $result['customer_item_info_id'] = $Row['customer_item_info_id'];
                $result['name'] = $Row['quantity_from'] . '-' . $Row['quantity_to'] . ' ' . $Row['cat_name'] . '-' . $crm;

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }*/

    // not in use
    function get_sale_offer_volume_by_type($attr)
    {
        //$this->objGeneral->mysql_clean($attr);
        $strIds = implode(',', $attr['customer_price_info_id']);
        //echo $strIds;
        $strLimit = '';
        if (isset($attr['isAdded']) && $attr['isAdded'] > 0)
            $strLimit = ' ORDER BY p.id DESC limit ' . count($attr['customer_price_info_id']);

        $Sql = "SELECT  p.*,
                        ( SELECT wh.title  
                          FROM units_of_measure_setup st
                          JOIN units_of_measure as wh ON wh.id = st.cat_id
                          where st.id =p.unit_category_id and 
                                st.status=1 ) as cat_name ,
                        crm.name as crm_name,
                        crm_alt_depot.depot as alt_location,
                        crm_region.title as crm_region,
                        crm_segment.title as crm_segment,
                        crm_buying_group.title as crm_buying_group
                FROM crm_product_volume p
                LEFT JOIN crm ON (crm.id = p.crm_id)
                LEFT JOIN crm_alt_depot ON (crm_alt_depot.id = p.crm_id)
                LEFT JOIN crm_region ON (crm_region.id = p.crm_id)
                LEFT JOIN crm_segment ON (crm_segment.id = p.crm_id)
                LEFT JOIN crm_buying_group ON (crm_buying_group.id = p.crm_id)

                WHERE p.customer_price_info_id IN (" . $strIds . ")  AND 
                      p.crm_id='" . $attr['crm_id'] . "' AND 
                      p.status=1 " . $strLimit;

         //echo $Sql; exit;

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $crm = '';
                if ($Row['type'] == 1)
                    $crm = $Row['crm_name'];
                if ($Row['type'] == 2)
                    $crm = $Row['alt_location'];
                if ($Row['type'] == 3)
                    $crm = $Row['crm_region'];
                if ($Row['type'] == 4)
                    $crm = $Row['crm_segment'];
                if ($Row['type'] == 5)
                    $crm = $Row['crm_buying_group'];

                $result['id'] = $Row['id'];
                $result['crm_id'] = $Row['crm_id'];
                $result['quantity_to'] = $Row['quantity_to'];
                $result['quantity_from'] = $Row['quantity_from'];
                $result['customer_price_info_id'] = $Row['customer_price_info_id'];
                $result['name'] = $Row['quantity_from'] . '-' . $Row['quantity_to'] . ' ' . $Row['cat_name'] . '-' . $crm;

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    // not in use
    function add_sale_offer_volume($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];

        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";

        $data_pass = "  tst.type='" . $arr_attr['type'] . "' and 
                        tst.product_id='" . $arr_attr['item_id'] . "' and 
                        tst.crm_id='" . $arr_attr['crm_id'] . "' and 
                        tst.unit_category_id='" . $arr_attr['unit_categorys'] . "' and 
                        tst.quantity_from = '" . $arr_attr['quantity_from'] . "' and 
                        tst.quantity_to = '" . $arr_attr['quantity_to'] . "' and 
                        tst.customer_price_info_id = '" . $arr_attr['customer_price_info_id'] . "'
                        $update_check";
        // and tst.customer_item_info_id = '" . $arr_attr['customer_item_info_id'] . "'

        $total = $this->objGeneral->count_duplicate_in_sql('crm_product_volume', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }
        

        if ($id == 0) {

            $Sql = "INSERT INTO crm_product_volume 
                                        SET
                                            type='" . $arr_attr['type'] . "',
                                            crm_id='" . $arr_attr['crm_id'] . "',
                                            product_id='" . $arr_attr['item_id'] . "',
                                            quantity_from='" . $arr_attr['quantity_from'] . "',
                                            quantity_to='" . $arr_attr['quantity_to'] . "',
                                            unit_category_id='" . $arr_attr['unit_categorys'] . "',
                                            customer_item_info_id='0',
                                            customer_price_info_id='" . $arr_attr['customer_price_info_id'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            user_id='" . $this->arrUser['id'] . "'";
            //echo $Sql;exit;
            // ,customer_item_info_id='" . $arr_attr['customer_item_info_id'] . "'
            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();

        } else {
            $Sql = "UPDATE crm_product_volume 
                                    SET  
										 type='" . $arr_attr['type'] . "'
                                         WHERE id = " . $id . "   
                                         Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }
        //	echo $Sql;exit;

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted';
        }
        return $response;
    }


    ############	Start: Products Listing ####

    function get_products_setup_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        if (!empty($attr['category_id']))
            $where_clause .= " AND products.category_id = " . $attr['category_id'];


        if (!empty($attr['search_string']))
            $where_clause .= " AND (products.description LIKE '%$attr[search_string]%' OR product.product_code LIKE '%$attr[search_string]%' OR products.standard_price LIKE '%$attr[search_string]%') ";


        if (!empty($attr['suppler_id'])) {
            $where_price .= " AND sp.sale_id = " . $attr['crm_id'];
        }

        $response = array();
        $response2 = array();


        $Sql = "SELECT prd.* ,
                " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . " ,
                " . $this->objGeneral->get_nested_query_list('brand', $this->arrUser['company_id']) . ",
                " . $this->objGeneral->get_nested_query_list('unit', $this->arrUser['company_id']) . ",
                " . $this->objGeneral->get_nested_query_list('product_status', $this->arrUser['company_id']) . ",
                (SELECT sp.unit_price  FROM product_supplier sp WHERE sp.product_id =prd.id  and sp.status=1 " . $where_price . " Limit 1) as unit_price
		From product as prd 
		LEFT JOIN company on company.id=prd.company_id 
		LEFT JOIN units_of_measure_setup st on st.product_id =prd.id
		where (prd.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	 and prd.status = 1 " . $where_clause . "
		group BY prd.id DESC";
        //echo $Sql; exit;

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
            $response['total'] = 0;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_products_popup_invoice($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);exit;
        $limit_clause = $where_clause = "";


        $response = array();


        $Sql = "SELECT products.*,vat.vat_name as vat
		,(SELECT category.name FROM category WHERE  products.category_id=category.id) as category_name
		,(SELECT brand.brandname FROM brand  WHERE  brand.id=products.brand_id) as brand_name
		,(SELECT units_of_measure.title FROM units_of_measure   WHERE units_of_measure.id=products.unit_id) as unit_of_measure_name
		,(
		(SELECT Sum(wr.quantity) FROM warehouse_allocation wr
		WHERE wr.item_id=products.id and wr.type=1 and wr.purchase_status in (2,3) )
		-
		(SELECT Sum(wl.quantity) FROM warehouse_allocation wl
		WHERE wl.item_id=products.id and wl.type=2 and wl.sale_status =2)
		) as current_stock
		From products 
		LEFT JOIN company on company.id=products.company_id 
		LEFT  JOIN vat on vat.id=products.vat_rate_id 
		where products.status=1  and (products.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	" . $where_clause . "
		ORDER BY products.id DESC";


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
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_products_popup($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //	print_r($attr);exit;
        $limit_clause = $where_clause = "";


        if (!empty($attr['searchKeyword'])) {
            $val = intval(preg_replace("/[^0-9]/", '', $attr['searchKeyword']));
            //$where_clause .= " AND  p.product_code LIKE '%$val%'  OR p.name LIKE '%$attr[searchKeyword]%'";
            if ($val != 0)
                $where_clause .= " AND  c.customer_no LIKE '%$val%'  ";
            else
                $where_clause .= "   AND p.name LIKE '%$attr[searchKeyword]%'";
        }

        if (!empty($attr['buying_groups']))
            $where_clause .= " AND c.buying_grp=$attr[buying_groups] ";
        if (!empty($attr['regions']))
            $where_clause .= " AND c.region_id=$attr[regions] ";
        if (!empty($attr['segments']))
            $where_clause .= " AND c.company_type=$attr[segments] ";


        if (!empty($attr['category_id']))
            $where_clause .= " AND products.category_id = " . $attr['category_id'];


        if (!empty($attr['search_string']))
            $where_clause .= " AND (products.description LIKE '%$attr[search_string]%' OR products.item_code LIKE '%$attr[search_string]%' OR products.standard_price LIKE '%$attr[search_string]%') ";


        $response = array();

        $Sql = "SELECT products.*
		,(SELECT category.name FROM category WHERE  products.category_id=category.id) as category_name,
		(SELECT brand.brandname FROM brand  WHERE  brand.id=products.brand_id) as brand_name,
		(SELECT units_of_measure.title FROM units_of_measure   WHERE units_of_measure.id=products.unit_id) as unit_of_measure_name
		From products 
		LEFT JOIN company on company.id=products.company_id 
		where (products.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	
		 and products.status = 1 " . $where_clause . "
		ORDER BY products.id DESC";


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
            $response['total'] = 0;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_purchased_products_popup($attr)
    {


        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";

        // if(!empty($attr['crm_id']))  $where_clause .= " AND p.name LIKE '%$ttr[crm_id]%' ";

        if (!empty($attr['category_id']))
            $where_clause .= " AND products.category_id = " . $attr['category_id'];


        if (!empty($attr['search_string'])) {
            $where_clause .= " AND (products.description LIKE '%$attr[search_string]%' OR products.item_code LIKE '%$attr[search_string]%' OR products.standard_price LIKE '%$attr[search_string]%') ";
        }
        if (!empty($attr['category_names']))
            $where_clause .= " AND product.category_id=$attr[category_names] ";
        if (!empty($attr['brand_names']))
            $where_clause .= " AND product.brand_id=$attr[brand_names] ";
        if (!empty($attr['units']))
            $where_clause .= " AND product.unit_id=$attr[units] ";
        if (!empty($attr['searchBox'])) {
            $where_clause .= " AND (product.description LIKE '%" . $attr['searchBox'] . "%' 
   OR product.product_code LIKE '%" . $attr['searchBox'] . "%') ";
        }

        $response = array();


        /* $Sql = "SELECT DISTINCT product.id, product.product_code, product.description,company.name as company
          ,product.prd_picture, product.current_stock_level, product.standard_price ,
          (SELECT category.name FROM category WHERE  product.category_id=category.id) as category_name,
          (SELECT brand.brandname FROM brand  WHERE  brand.id=product.brand_id) as brand_name,
          (SELECT units_of_measure.title FROM units_of_measure   WHERE units_of_measure.id=product.unit_id) as unit_of_measure_name
          ,IFNULL((SELECT sum(wa.quantity) FROM warehouse_allocation as wa
          WHERE wa.purchase_return_status = 0 and wa.status = 1 and wa.type = 1 and wa.purchase_status in (2,3) and wa.product_id = product.id),0) - IFNULL((SELECT sum(sa.quantity) FROM warehouse_allocation as sa
          WHERE sa.purchase_return_status = 1 and sa.status = 1 and sa.type = 1 and sa.purchase_status = (2) and sa.product_id = product.id),0)as current_stock ,
          product.*
          From product
          INNER JOIN warehouse_allocation as wha ON product.id = wha.product_id
          LEFT JOIN company on company.id=product.company_id
          JOIN units_of_measure_setup st on st.product_id =product.id
          where
          wha.type = 1 and wha.purchase_status in (2,3)
          and (product.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")
          and product.status = 1  and product.product_code IS NOT NULL
          ".$where_clause."
          ORDER BY product.id DESC";

         */


        $Sql = "SELECT product.*,product.id as pid
		,(SELECT category.name FROM category WHERE  product.category_id=category.id) as category_name
		,(SELECT brand.brandname FROM brand  WHERE  brand.id=product.brand_id) as brand_name
		,(SELECT units_of_measure.title FROM units_of_measure   WHERE units_of_measure.id=product.unit_id) as unit_of_measure_name
		,IFNULL((SELECT sum(wa.quantity) FROM warehouse_allocation as wa
		WHERE wa.purchase_return_status = 0 and wa.status = 1 and wa.type = 1 and wa.purchase_status in (2,3) and wa.product_id = product.id),0) - IFNULL((SELECT sum(sa.quantity) FROM warehouse_allocation as sa
		WHERE sa.purchase_return_status = 1 and sa.status = 1 and sa.type = 1 and sa.purchase_status = (2) and sa.product_id = product.id),0)as current_stock 
		,(SELECT cs.price_offered FROM customer_item_info cs WHERE cs.product_id=product.id Limit 1) 
		as price_offered1
		From product 
		LEFT JOIN company on company.id=product.company_id 
		where product.status=1  and product.product_code IS NOT NULL  and 
		(product.company_id=" . $this->arrUser['company_id'] . "  or  company.parent_id=" . $this->arrUser['company_id'] . ")
		" . $where_clause . " ";
        //and product.stock_check=1
        //echo  $Sql;exit;
        //ORDER BY product.id DESC
        //echo $Sql2; exit;////,sp.min_order_qty as  pmin_quantity,sp.max_order_qty as pmax_quantity
        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'product');

        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row2 = $RS->FetchRow()) {
                foreach ($Row2 as $key2 => $value2) {
                    if (is_numeric($key2))
                        unset($Row2[$key2]);
                }

                $standard_price = $Row2['standard_price'];
                if ($Row2['price_offered1'] > 0)
                    $Row2['standard_price'] = $Row2['price_offered1'];
                $product_id = $Row2['pid'];
                $crm_id = $attr['crm_id'];

                $sql_cust_location = "SELECT id FROM crm_alt_depot  where crm_id=$crm_id ";
                $rs_cust_location = $this->objsetup->CSI($sql_cust_location);
                if ($rs_cust_location->RecordCount() > 0) {
                    while ($Row_cust_location = $rs_cust_location->FetchRow()) {
                        $customer_loc[] = $Row_cust_location['id'];
                    }
                    $loc_str = "'" . implode("', '", $customer_loc) . "'";
                }

                $order_date = $this->objGeneral->convert_date($attr['order_date']);
                if ($order_date) {

                    if (sizeof($customer_loc) > 0) {

                        $sql_cust_loc_item = "SELECT converted_price FROM customer_item_info 
						where crm_id=$crm_id and product_id=$product_id and crm_alt_location_id IN ($loc_str) and 
						customer_product_type_id=2 and start_date <= $order_date and end_date >= $order_date limit 1";

                        $rs_cust_loc_item = $this->objsetup->CSI($sql_cust_loc_item);

                        if ($rs_cust_loc_item->RecordCount() > 0) {
                            $Row2['standard_price'] = $rs_cust_loc_item->fields['converted_price'];
                        } else
                            $Row2['standard_price'] = $standard_price;
                    } else {

                        $sql_cust_item = "SELECT converted_price FROM customer_item_info
                                  where crm_id=$crm_id and product_id=$product_id and  customer_product_type_id=1 and start_date <= $order_date and end_date >= $order_date limit 1";

                        $rs_cust_item = $this->objsetup->CSI($sql_cust_item);

                        if ($rs_cust_item->RecordCount() > 0)
                            $Row2['standard_price'] = $rs_cust_item->fields['converted_price'];
                        else {
                            // Region Query
                            $sql_region_item = "SELECT crm_id,converted_price FROM customer_item_info where product_id=$product_id and  customer_product_type_id=3 and start_date <= $order_date and end_date >= $order_date limit 1";
                            $rs_region_item = $this->objsetup->CSI($sql_region_item);

                            if ($rs_region_item->RecordCount() > 0) {

                                $region_id = $rs_region_item->fields['crm_id'];

                                $sql_crm = "SELECT id FROM crm where region_id=$region_id and id= $crm_id limit 1";

                                $rs_crm = $this->objsetup->CSI($sql_crm);

                                if ($rs_crm->RecordCount() > 0) {
                                    $Row2['standard_price'] = $rs_region_item->fields['converted_price'];
                                } else
                                    $Row2['standard_price'] = $standard_price;
                            } else {

                                // Segment Query
                                $sql_Segment_item = "SELECT crm_id,converted_price FROM customer_item_info
								where product_id=$product_id and  customer_product_type_id=4 and start_date <= $order_date and end_date >= $order_date limit 1";

                                $rs_Segment_item = $this->objsetup->CSI($sql_Segment_item);

                                if ($rs_Segment_item->RecordCount() > 0) {

                                    $segment_id = $rs_Segment_item->fields['crm_id'];

                                    $sql_crm = "SELECT id FROM crm where company_type=$segment_id and id= $crm_id limit 1";

                                    $rs_crm = $this->objsetup->CSI($sql_crm);

                                    if ($rs_crm->RecordCount() > 0) {
                                        $Row2['standard_price'] = $rs_Segment_item->fields['converted_price'];
                                    } else {
                                        $Row2['standard_price'] = $standard_price;
                                    }
                                } else {

                                    // Buying Group Query
                                    $sql_buy_grp_item = "SELECT crm_id,converted_price FROM customer_item_info where product_id=$product_id and  customer_product_type_id=5 and start_date <= $order_date and end_date >= $order_date limit 1";
                                    $rs_buy_grp_item = $this->objsetup->CSI($sql_buy_grp_item);

                                    if ($rs_buy_grp_item->RecordCount() > 0) {

                                        $buy_grp_id = $rs_buy_grp_item->fields['crm_id'];

                                        $sql_crm = "SELECT id FROM crm where buying_grp=$buy_grp_id and id= $crm_id limit 1";
                                        $rs_crm = $this->objsetup->CSI($sql_crm);

                                        if ($rs_crm->RecordCount() > 0) {
                                            $Row2['standard_price'] = $rs_buy_grp_item->fields['converted_price'];
                                        } else {
                                            $Row2['standard_price'] = $standard_price;
                                        }
                                    } else {
                                        $Row2['standard_price'] = $standard_price;
                                    }
                                }
                            }
                        }
                    }
                } else
                    $Row2['standard_price'] = $standard_price;


                $response['response'][] = $Row2;
            }


            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }


        return $response;
    }

    function get_purchased_products_supplier_price_popup($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        /* print_r($attr);
          exit; */
        $limit_clause = $where_clause = "";


        // if(!empty($attr['crm_id']))  $where_clause .= " AND p.name LIKE '%$ttr[crm_id]%' ";

        if (!empty($attr['category_id']))
            $where_clause .= " AND products.category_id = " . $attr['category_id'];


        if (!empty($attr['search_string'])) {
            $where_clause .= " AND (products.description LIKE '%$attr[search_string]%' OR products.item_code LIKE '%$attr[search_string]%' OR products.standard_price LIKE '%$attr[search_string]%') ";
        }
        if (!empty($attr['category_names']))
            $where_clause .= " AND product.category_id=$attr[category_names] ";
        if (!empty($attr['brand_names']))
            $where_clause .= " AND product.brand_id=$attr[brand_names] ";
        if (!empty($attr['units']))
            $where_clause .= " AND product.unit_id=$attr[units] ";
        if (!empty($attr['searchBox'])) {
            $where_clause .= " AND (product.description LIKE '%" . $attr['searchBox'] . "%' OR product.product_code LIKE '%" . $attr['searchBox'] . "%') ";
        }

        $response = array();

        $order_date = $this->objGeneral->convert_date($attr['order_date']);


        $Sql = "SELECT product.*,product.id as pid,
                      (SELECT category.name FROM category WHERE  product.category_id=category.id) as category_name,
                      (SELECT brand.brandname FROM brand  WHERE  brand.id=product.brand_id) as brand_name ,
                      (SELECT units_of_measure.title FROM units_of_measure WHERE units_of_measure.id=product.unit_id) as unit_of_measure_name,
                      IFNULL((SELECT sum(wa.quantity) FROM warehouse_allocation as wa WHERE wa.purchase_return_status = 0 and
                                                                                            wa.status = 1 and wa.type = 1 and
                                                                                            wa.purchase_status in (2,3) and
                                                                                            wa.product_id = product.id),0) -
                      IFNULL((SELECT sum(sa.quantity) FROM warehouse_allocation as sa WHERE sa.purchase_return_status = 1 and
                                                                                            sa.status = 1 and sa.type = 1 and
                                                                                            sa.purchase_status = (2) and
                                                                                            sa.product_id = product.id),0) as current_stock,
                      (SELECT cs.converted_price FROM product_supplier cs WHERE cs.product_id=product.id and
                                                                                cs.start_date <= $order_date and
                                                                                cs.end_date >= $order_date  limit 1) as price_offered1
		        From product
		        LEFT JOIN company on company.id=product.company_id
		                where product.status=1  and
		                      product.product_code IS NOT NULL and
		                      product.stock_check=1 and
		                      (product.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") " . $where_clause . " ";

        //ORDER BY product.id DESC
        //echo $Sql; exit;
        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'product');
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row2 = $RS->FetchRow()) {
                foreach ($Row2 as $key2 => $value2) {
                    if (is_numeric($key2))
                        unset($Row2[$key2]);
                }

                $standard_price = $Row2['standard_price'];

                if ($Row2['price_offered1'] > 0)
                    $Row2['standard_price'] = $Row2['price_offered1'];


                /* $product_id = $Row2['pid'];
                  $crm_id = $attr['crm_id'];

                  $sql_cust_location = "SELECT id FROM crm_alt_depot  where crm_id=$crm_id";


                  $rs_cust_location = $this->objsetup->CSI($sql_cust_location);

                  if ($rs_cust_location->RecordCount() > 0) {
                  while ($Row_cust_location = $rs_cust_location->FetchRow()) {
                  $customer_loc[] = $Row_cust_location['id'];
                  }
                  }

                  $loc_str = "'".implode("', '", $customer_loc)."'"; */
                // $order_date = $this->objGeneral->convert_date($attr['order_date']);

                /* if ($order_date > 0) {

                  if (sizeof($customer_loc) > 0) {

                  $sql_cust_loc_item = "SELECT converted_price FROM customer_item_info
                  where crm_id=$crm_id and product_id=$product_id and crm_alt_location_id IN ($loc_str) and  customer_product_type_id=2 and start_date <= $order_date and end_date >= $order_date limit 1";

                  $rs_cust_loc_item = $this->objsetup->CSI($sql_cust_loc_item);

                  if ($rs_cust_loc_item->RecordCount() > 0) {
                  $Row2['standard_price'] = $rs_cust_loc_item->fields['converted_price'];
                  } else {
                  $Row2['standard_price'] = $standard_price;
                  }
                  } else {

                  $sql_cust_item = "SELECT converted_price FROM customer_item_info
                  where crm_id=$crm_id and product_id=$product_id and  customer_product_type_id=1 and start_date <= $order_date and end_date >= $order_date limit 1";


                  $rs_cust_item = $this->objsetup->CSI($sql_cust_item);

                  if ($rs_cust_item->RecordCount() > 0) {
                  $Row2['standard_price'] = $rs_cust_item->fields['converted_price'];

                  } else {

                  // Region Query
                  $sql_region_item = "SELECT crm_id,converted_price FROM customer_item_info where product_id=$product_id and  customer_product_type_id=3 and start_date <= $order_date and end_date >= $order_date limit 1";
                  $rs_region_item = $this->objsetup->CSI($sql_region_item);

                  if ($rs_region_item->RecordCount() > 0) {

                  $region_id = $rs_region_item->fields['crm_id'];

                  $sql_crm = "SELECT id FROM crm where region_id=$region_id and id= $crm_id limit 1";

                  $rs_crm = $this->objsetup->CSI($sql_crm);

                  if ($rs_crm->RecordCount() > 0) {
                  $Row2['standard_price'] = $rs_region_item->fields['converted_price'];
                  } else {
                  $Row2['standard_price'] = $standard_price;
                  }

                  } else {

                  // Segment Query
                  $sql_Segment_item = "SELECT crm_id,converted_price FROM customer_item_info where product_id=$product_id and  customer_product_type_id=4 and start_date <= $order_date and end_date >= $order_date limit 1";

                  //echo $sql_Segment_item . "<hr>";

                  $rs_Segment_item = $this->objsetup->CSI($sql_Segment_item);

                  if ($rs_Segment_item->RecordCount() > 0) {

                  $segment_id = $rs_Segment_item->fields['crm_id'];

                  $sql_crm = "SELECT id FROM crm where company_type=$segment_id and id= $crm_id limit 1";

                  $rs_crm = $this->objsetup->CSI($sql_crm);

                  if ($rs_crm->RecordCount() > 0) {
                  $Row2['standard_price'] = $rs_Segment_item->fields['converted_price'];
                  } else {
                  $Row2['standard_price'] = $standard_price;
                  }

                  } else {

                  // Buying Group Query
                  $sql_buy_grp_item = "SELECT crm_id,converted_price FROM customer_item_info where product_id=$product_id and  customer_product_type_id=5 and start_date <= $order_date and end_date >= $order_date limit 1";
                  $rs_buy_grp_item = $this->objsetup->CSI($sql_buy_grp_item);

                  if ($rs_buy_grp_item->RecordCount() > 0) {

                  $buy_grp_id = $rs_buy_grp_item->fields['crm_id'];

                  $sql_crm = "SELECT id FROM crm where buying_grp=$buy_grp_id and id= $crm_id limit 1";
                  $rs_crm = $this->objsetup->CSI($sql_crm);

                  if ($rs_crm->RecordCount() > 0) {
                  $Row2['standard_price'] = $rs_buy_grp_item->fields['converted_price'];
                  } else {
                  $Row2['standard_price'] = $standard_price;
                  }

                  } else {
                  $Row2['standard_price'] = $standard_price;
                  }
                  }
                  }
                  }
                  }
                  } else {
                  $Row2['standard_price'] = $standard_price;
                  } */

                /* if ($converted_price > 0) $Row2['standard_price'] = $converted_price;
                  else  $Row2['standard_price'] = $standard_price; */

                /* echo $Row2['standard_price'];
                  exit; */

                $response['response'][] = $Row2;
            }


            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }

        return $response;
    }

    function get_purchase_products_popup($attr)
    {
        //echo "here=======>>"; exit;
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        if (!empty($attr['category_id']))
            $where_clause .= " AND products.category_id = " . $attr['category_id'];


        if (!empty($attr['search_string'])) {
            $where_clause .= " AND (products.description LIKE '%$attr[search_string]%' OR products.item_code LIKE '%$attr[search_string]%' OR products.standard_price LIKE '%$attr[search_string]%') ";
        }

        $response = array();

        $sql_total = '';


        $Sql = "SELECT products.*,
                        (SELECT category.name FROM category WHERE  products.category_id=category.id) as category_name,
                        (SELECT brand.brandname FROM brand  WHERE  brand.id=products.brand_id) as brand_name,
                        (SELECT units_of_measure.title FROM units_of_measure   WHERE units_of_measure.id=products.unit_id) as unit_of_measure_name,
                        IFNULL((SELECT sum(wa.quantity) FROM warehouse_allocation as wa
					  WHERE wa.type = 1 and wa.purchase_status in (2,3) and wa.item_id = products.id),0) -  IFNULL((SELECT sum(sa.quantity) FROM warehouse_allocation as sa
					  WHERE sa.type = 2 and sa.sale_status = 2 and sa.item_id = products.id),0) as current_stock
		 
		From products 
		LEFT JOIN company on company.id=products.company_id 
		where products.status=1  and products.company_id=" . $this->arrUser['company_id'] . "	" . $where_clause . "
		ORDER BY products.id DESC";

        echo $Sql;
        exit;
        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];
        $Sql .= $limit_clause;
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
            $response['total'] = $total;
        } else {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function get_products_listing($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();


        /* , IFNULL((SELECT sum(wa.quantity) FROM warehouse_allocation as wa
          WHERE wa.type = 1 and wa.purchase_status in (2,3) and wa.item_id = products.id),0) -  IFNULL((SELECT sum(sa.quantity) FROM warehouse_allocation as sa
          WHERE sa.type = 2 and sa.sale_status = 2 and sa.item_id = products.id),0) as current_stock
         */
        $Sql = "SELECT products.*
,(SELECT category.name FROM category WHERE  products.category_id=category.id) as category_name
,(SELECT brand.brandname FROM brand  WHERE  brand.id=products.brand_id) as brand_name
,(SELECT units_of_measure.title FROM units_of_measure   WHERE units_of_measure.id=products.unit_id) as unit_of_measure_name
,IFNULL((SELECT sum(wa.quantity) FROM warehouse_allocation as wa
WHERE wa.purchase_return_status = 0 and wa.type = 1 and wa.purchase_status in (2,3) and wa.item_id = products.id),0) - IFNULL((SELECT sum(sa.quantity) FROM warehouse_allocation as sa
WHERE sa.purchase_return_status = 1 and sa.type = 1 and sa.purchase_status = (2) and sa.item_id = products.id),0)
as current_stock

From products 
LEFT JOIN company on company.id=products.company_id 
where products.status=1  and (products.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	" . $where_clause . "
ORDER BY products.id DESC";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['item_code'] = $Row['item_code'];
                $result['item_description'] = $Row['description'];
                $result['brand'] = $Row['brand_name'];
                $result['Category'] = $Row['category_name'];
                $result['unit of measure'] = $Row['unit_of_measure_name'];
                $result['Sales Orders'] = '';
                $result['Current Stock Level'] = $Row['current_stock'];
                $result['Items Assigned to Sales Orders '] = '';
                $result['Sales Orders with Unassigned Items / Stock '] = '';
                $result['Available Stock'] = '';
                $result['On Purchase Order '] = '';
                $result['On Route/ In Transit'] = '';
                // $result['status'] = ($Row['status'] == "1")?"Active":"Inactive";
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function update_product_value($arr_attr)
    {

        /* 	,$product_id, $category_id, $brand_id,$unit_id,$purchase_measure, $status, $costing_method_id, 
          $vat_rate_id,$country
         */
        //$this->objGeneral->mysql_clean($arr_attr);


        /* foreach($arr_attrs as $key => $value)
          {
          $arr_attr[$key] = strip_tags(trim($value));
          }


         */

        foreach ($arr_attr as $key => $val) {
            $converted_array[$key] = $val;

            if ($key == "id") {
                $product_id = $val;
            }
        }


        //current_date=strtotime(date('Y-m-d')); 
        $counter_supplier = 0;
        $counter_purchase = 0;
        if (!empty($arr_attr->id)) {
            $product_id = $arr_attr->id;
        }
        if (!empty($arr_attr->product_id)) {
            $product_id = $arr_attr->product_id;
        }


        $new = 'Add';
        $new_msg = 'Updated';

        $update_check = "";

        if ($product_id > 0)
            $update_check = "  AND tst.id <> '" . $product_id . "'";

        $data_pass = "  tst.item_code='$arr_attr->item_code' and  tst.description='$arr_attr->description' $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('products', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($product_id == 0) {

            /* $sql_total = "SELECT  count(id) as total	FROM products where
              item_code='$arr_attr->item_code' and  description='$arr_attr->description' and company_id='" . $this->arrUser['company_id'] . "'  ";
              $rs_count = $this->objsetup->CSI($sql_total);
              $total = $rs_count->fields['total'];

              if ($total > 0) {
              $response['ack'] = 0;
              $response['error'] = 'Record Already Exists.';
              return $response;
              } else { */


            $Sql = "INSERT INTO products SET
			item_code='" . $arr_attr->item_code . "' ,lead_time='" . $arr_attr->lead_time . "' ,lead_type='" . $arr_attr->lead_type . "' ,description='" . $arr_attr->description . "'
			,category_id='" . $arr_attr->category_ids . "' , brand_id='" . $arr_attr->brand_ids . "', unit_id='" . $arr_attr->unit_ids . "', current_stock_level='" . $arr_attr->current_stock_level . "' ,min_stock='" . $arr_attr->min_stock . "'
			,max_stock='" . $arr_attr->max_stock . "' 
			,reorder_quality='" . $arr_attr->reorder_quality . "' ,max_quality='" . $arr_attr->max_quality . "' 
			,prd_picture='" . $arr_attr->prd_picture . "'
			,status=1
			,company_id='" . $this->arrUser['company_id'] . "',user_id='" . $this->arrUser['id'] . "', date_added='" . strtotime("now") . "'";
            $RSProducts = $this->objsetup->CSI($Sql);
            $product_id = $this->Conn->Insert_ID();
            $new = 'Inserted';
            $Sql_record = "UPDATE units_of_measure_setup SET
				item_id='" . $product_id . "' WHERE item_code = '" . $arr_attr->item_code . "' ";
            $RSProducts = $this->objsetup->CSI($Sql_record);

            // }
        } else {


            $new = 'Edit';

            if ($arr_attr->tab_id_2 == 1) {

                /* 	  $sql_total = "SELECT  count(id) as total	FROM products
                  where    company_id='".$this->arrUser['company_id']."'
                  and product_code='$arr_attr->item_code' and status=1 and  id not in( ".$product_id.") ";
                  $rs_count = $this->objsetup->CSI($sql_total);
                  $total = $rs_count->fields['total'];	 //	 and  $arr_attr[number] BETWEEN start_amount AND end_amount


                  if($total >=1){
                  $response['ack'] = 0;
                  $response['error'] = 'Item Code Already Exit!';
                  return $response;
                  } */


                $Sql = "UPDATE products SET 
		lead_time='" . $arr_attr->lead_time . "' ,lead_type='" . $arr_attr->lead_type . "' ,description='" . $arr_attr->description . "'
		,category_id='" . $arr_attr->category_ids . "' , brand_id='" . $arr_attr->brand_ids . "', unit_id='" . $arr_attr->unit_ids . "', current_stock_level='" . $arr_attr->current_stock_level . "' ,min_stock='" . $arr_attr->min_stock . "'
		,max_stock='" . $arr_attr->max_stock . "' 
		,reorder_quality='" . $arr_attr->reorder_quality . "' ,max_quality='" . $arr_attr->max_quality . "' 
		,prd_picture='" . $arr_attr->prd_picture . "'
		,status='" . $arr_attr->statuss . "'
		WHERE id = " . $product_id . "  Limit 1";
                $RS = $this->objsetup->CSI($Sql);
            }

            if ($arr_attr->tab_id_2 == 2) {
                $Sql = "UPDATE products SET 
			unit_cost='" . $arr_attr->unit_cost . "' ,costing_method_id='" . $arr_attr->costing_method_ids . "'
			,average_cost_id='" . $arr_attr->average_cost_id . "' ,vat_rate_id='" . $arr_attr->vat_rate_ids . "' 
			,standard_price='" . $arr_attr->standard_price . "',average_price='" . $arr_attr->average_price . "' 
			,purchase_measure='" . $arr_attr->purchase_measures . "' 
			,purchase_code='" . $arr_attr->purchase_code . "',purchase_code_id='" . $arr_attr->purchase_code_id . "'
			,sales_code='" . $arr_attr->sales_code . "',sale_code_id='" . $arr_attr->sales_code_id . "'
			WHERE id = " . $product_id . "  Limit 1";
                $RS = $this->objsetup->CSI($Sql);
            }

            if ($arr_attr->tab_id_2 == 3) {
                $Sql = "UPDATE products SET 
			prd_dimensions='" . $arr_attr->prd_dimensions . "',prd_height='" . $arr_attr->prd_height . "',prd_width='" . $arr_attr->prd_width . "'
			,prd_length='" . $arr_attr->prd_length . "',prd_gross_weight='" . $arr_attr->prd_gross_weight . "'
			,prd_net_weight='" . $arr_attr->prd_net_weight . "',prd_bar_code='" . $arr_attr->prd_bar_code . "'
			,prd_country_origin='" . $arr_attr->prd_country_origins . "',prd_country_code='" . $arr_attr->prd_country_code . "'
			
			WHERE id = " . $product_id . "  Limit 1";

                $RS = $this->objsetup->CSI($Sql);
            }


            if ($arr_attr->tab_id_2 == 6) {
                $counter_supplier++;
                $price = 0;
                //	echo	 $price =$arr_attr->sale_unit_cost;
                $arr_attr->sale_selling_checks;
                if ($arr_attr->sale_selling_checks > 0) {
                    $price = $arr_attr->sale_selling_price;
                }

                $f_id = $arr_attr->supplier_types;

                $tab_change = 'tab_sale';
                $sp_id = $arr_attr->sale_id;
                $sale_id = 0;
                if ($sp_id > 0) {
                    //  $Sql = "DELETE FROM product_sale WHERE id = $sp_id";
                    //	$RS = $this->objsetup->CSI($Sql);
                    //	$Sql = "DELETE FROM product_sale_customer WHERE sale_id = $sp_id";
                    //	$RS = $this->objsetup->CSI($Sql);

                    $Sql = "UPDATE  product_sale SET   
									sale_selling_price='" . $price . "' 
									,sale_selling_check='" . $arr_attr->sale_selling_checks . "' 	
									,supplier_type='" . $arr_attr->supplier_types . "'  
									,discount_value='" . $arr_attr->discount_value . "'  
									,discount_price='" . $arr_attr->discount_price . "'  
									,start_date= '" . $this->objGeneral->convert_date($arr_attr->s_start_date) . "'
									,end_date= '" . $this->objGeneral->convert_date($arr_attr->s_end_date) . "' 
									WHERE id = " . $sp_id . "  Limit 1";
                    $new = 'Add';
                    $new_msg = 'Edit';
                    $RS = $this->objsetup->CSI($Sql);
                    //	echo $Sql ;	exit;	
                } else {
                    //,supplier_unit_cost='".$price."'
                    $Sql = "INSERT INTO product_sale SET  							
									 supplier_name='" . $arr_attr->sale_name . "'   
									
									,sale_selling_price='" . $price . "' 
									,sale_selling_check='" . $arr_attr->sale_selling_checks . "' 	
									,supplier_type='" . $arr_attr->supplier_types . "'    
									,discount_value='" . $arr_attr->discount_value . "'  
									,discount_price='" . $arr_attr->discount_price . "'  
									,start_date= '" . $this->objGeneral->convert_date($arr_attr->s_start_date) . "'
									,end_date= '" . $this->objGeneral->convert_date($arr_attr->s_end_date) . "' 
									,product_id='" . $product_id . "' 	,status='1'  
									,company_id='" . $this->arrUser['company_id'] . "' 
									,user_id='" . $this->arrUser['id'] . "',
									date_added='" . current_date . "'";


                    $new = 'Add';
                    $new_msg = 'Insert';
                    $RS = $this->objsetup->CSI($Sql);
                    $sale_id = $this->Conn->Insert_ID();

                    $customer_price_id = explode(",", $arr_attr->customer_price);
                    $sale_name_id = explode(",", $arr_attr->sale_name_id);
                    $i = 0;
                    foreach ($sale_name_id as $key => $customer_id) {
                        //	  echo $customer_id;
                        if (is_numeric($customer_id)) {
                            if ($arr_attr->sale_selling_check == 1) {

                                $customer_price = "customer_price='" . $arr_attr->sale_selling_price . "'  ";
                                $price = $arr_attr->sale_selling_price;
                            } else {
                                $customer_price = "customer_price='" . $customer_price_id[$i] . "'  ";
                                $price = $customer_price_id[$i];
                            }

                            if ($f_id == 1) {
                                $discount_priceone = $arr_attr->discount_value * $price / 100;
                                $discount_price = $price - $discount_priceone;
                            } else if ($f_id == 2) {
                                $discount_price = $price - $arr_attr->discount_value;
                            }

                            $Sql = "INSERT INTO product_sale_customer SET  
										customer_id='" . $customer_id . "'
										,sale_id='" . $sale_id . "'  
										,status='1'  
										," . $customer_price . "
										,discount_type='" . $arr_attr->supplier_types . "'  
										,discount_value='" . $arr_attr->discount_value . "' 
										,discounted_price='" . $discount_price . "' 
										,company_id='" . $this->arrUser['company_id'] . "' 
										,user_id='" . $this->arrUser['id'] . "',
										date_added='" . current_date . "'";
                            $RS = $this->objsetup->CSI($Sql);
                        }
                        $i++;
                    }
                }
            }

            if ($arr_attr->tab_id_2 == 66) {


                $counter_supplier++;
                $tab_change = 'tab_sale_cancel';
                $sale_customer_id = $arr_attr->sale_customer_id;
                if ($sale_customer_id > 0) {

                    $Sql = "DELETE FROM product_sale_customer WHERE sale_id = $sale_customer_id";
                    $RS = $this->objsetup->CSI($Sql);


                    $customer_price_id = explode(",", $arr_attr->customer_price2);
                    $sale_name_id = explode(",", $arr_attr->sale_name_id2);

                    $i = 0;
                    foreach ($sale_name_id as $key => $customer_id) {
                        //	  echo $customer_id;
                        if (is_numeric($customer_id)) {
                            if ($arr_attr->sale_selling_check == 1) {

                                $customer_price = "customer_price='" . $arr_attr->sale_selling_price . "'  ";
                            } else {
                                $customer_price = "customer_price='" . $customer_price_id[$i] . "'  ";
                            }
                            $Sql = "INSERT INTO product_sale_customer SET  
										customer_id='" . $customer_id . "'
										,sale_id='" . $sale_customer_id . "'  
										,status='1'  
										," . $customer_price . "
										,discount_type='" . $arr_attr->discount_type2 . "'  
										,discount_value='" . $arr_attr->discount_value2 . "' 
										,discounted_price='" . $arr_attr->discounted_price2 . "' 
										,company_id='" . $this->arrUser['company_id'] . "' 
										,user_id='" . $this->arrUser['id'] . "',
										date_added='" . current_date . "'";
                            $RS = $this->objsetup->CSI($Sql);
                        }
                        $i++;
                    }
                    $Sql = "UPDATE  product_sale SET supplier_name='" . $arr_attr->sale_name2 . "'  
									WHERE id = " . $sale_customer_id . "  Limit 1";
                    $new = 'Add';
                    $new_msg = 'Insert';
                    $RS = $this->objsetup->CSI($Sql);
                }
            }

            if ($arr_attr->tab_id_2 == 4) {


                //print_r($arr_attr);exit;

                $tab_change = 'tab_supplier';
                $sp_id = $arr_attr->sp_id;
                if ($sp_id == 0) {


                    $Sql1 = "INSERT INTO product_supplier SET  
											 volume_id='" . $arr_attr->volume_1s . "' 
											 , volume_name='" . $arr_attr->volume_1->name . "'   
											 ,volume_1=1 
											,supplier_type='" . $arr_attr->supplier_type_1s . "'  
											 ,purchase_price='" . $arr_attr->purchase_price_1 . "' 
											,discount_value='" . $arr_attr->discount_value_1 . "'  
											 ,discount_price='" . $arr_attr->discount_price_1 . "' 
									 
											,start_date=  '" . $this->objGeneral->convert_date($arr_attr->start_date) . "'
											,end_date=   '" . $this->objGeneral->convert_date($arr_attr->end_date) . "'
											,product_id='" . $product_id . "' 	,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
                    if ($arr_attr->volume_1s != NULL)
                        $RS = $this->objsetup->CSI($Sql1);


                    $Sql2 = "INSERT INTO product_supplier SET  
											 volume_id='" . $arr_attr->volume_2s . "' 
											  , volume_name='" . $arr_attr->volume_2->name . "'   
											  ,volume_2=2 
											,supplier_type='" . $arr_attr->supplier_type_2s . "'  
											
											 ,purchase_price='" . $arr_attr->purchase_price_2 . "' 
											,discount_value='" . $arr_attr->discount_value_2 . "'  
											 ,discount_price='" . $arr_attr->discount_price_2 . "' 
									 
									 		,start_date=  '" . $this->objGeneral->convert_date($arr_attr->start_date) . "'
											,end_date=   '" . $this->objGeneral->convert_date($arr_attr->end_date) . "'
											,product_id='" . $product_id . "' 	,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";

                    if ($arr_attr->volume_2s != NULL)
                        $RS = $this->objsetup->CSI($Sql2);

                    $Sql3 = "INSERT INTO product_supplier SET  
											 volume_id='" . $arr_attr->volume_3s . "'  
											  , volume_name='" . $arr_attr->volume_3->name . "'   
											 ,volume_3=3
											,supplier_type='" . $arr_attr->supplier_type_3s . "' 
											
											 ,purchase_price='" . $arr_attr->purchase_price_3 . "' 
											,discount_value='" . $arr_attr->discount_value_3 . "'  
											 ,discount_price='" . $arr_attr->discount_price_3 . "' 
									 
											,start_date=  '" . $this->objGeneral->convert_date($arr_attr->start_date) . "'
											,end_date=   '" . $this->objGeneral->convert_date($arr_attr->end_date) . "'
											,product_id='" . $product_id . "' 	,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
                    if ($arr_attr->volume_3s != NULL)
                        $RS = $this->objsetup->CSI($Sql3);

                    $new = 'Add';
                    $new_msg = 'Insert';
                } else {
                    $Sql1 = "UPDATE product_supplier SET  
							purchase_price='" . $arr_attr->purchase_price_11 . "'  
							,discount_value='" . $arr_attr->discount_value_11 . "'
							,discount_price='" . $arr_attr->discount_price_11 . "'  
							WHERE id = " . $sp_id . "   Limit 1";
                    $RS = $this->objsetup->CSI($Sql1);
                }
            }

            if ($arr_attr->tab_id_2 == 5) {

                //print_r($arr_attr);exit;

                $tab_change = 'tab_purchaser';
                $pr_id = $arr_attr->pr_id;
                if ($pr_id == 0) {

                    $Sql1 = "INSERT INTO product_purchaser SET  
											 volume_id='" . $arr_attr->volume_1_purchases . "' 
											  , volume_name='" . $arr_attr->volume_1_purchase->name . "'   
											  ,volume_1=1 
											,purchase_type='" . $arr_attr->purchase_type_1s . "'  
											,discount_value='" . $arr_attr->p_discount_value_1 . "' 
											 ,purchase_price='" . $arr_attr->p_price_1 . "'  
											 ,discount_price='" . $arr_attr->discount_p_1 . "' 
											,p_start_date=  '" . $this->objGeneral->convert_date($arr_attr->p_start_date) . "'
											,p_end_date=   '" . $this->objGeneral->convert_date($arr_attr->p_end_date) . "'
											,product_id='" . $product_id . "' 
											,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
                    if ($arr_attr->volume_1_purchases != NULL)
                        $RS = $this->objsetup->CSI($Sql1);


                    $Sql2 = "INSERT INTO product_purchaser SET  
											 volume_id='" . $arr_attr->volume_2_purchases . "'  
											  , volume_name='" . $arr_attr->volume_2_purchase->name . "'   
											  ,volume_2=2
											,purchase_type='" . $arr_attr->purchase_type_2s . "' 
											,discount_value='" . $arr_attr->p_discount_value_2 . "' 
											 ,purchase_price='" . $arr_attr->p_price_2 . "'  
											 ,discount_price='" . $arr_attr->discount_p_2 . "' 
											,p_start_date=  '" . $this->objGeneral->convert_date($arr_attr->p_start_date) . "'
											,p_end_date=   '" . $this->objGeneral->convert_date($arr_attr->p_end_date) . "'
											,product_id='" . $product_id . "' 	,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
                    if ($arr_attr->volume_2_purchases != NULL)
                        $RS = $this->objsetup->CSI($Sql2);

                    $Sql3 = "INSERT INTO product_purchaser SET  
											 volume_id='" . $arr_attr->volume_3_purchases . "' 
											  , volume_name='" . $arr_attr->volume_3_purchase->name . "'   
											   ,volume_3=3 
											,purchase_type='" . $arr_attr->purchase_type_3s . "' 
											,discount_value='" . $arr_attr->p_discount_value_3 . "' 
											 ,purchase_price='" . $arr_attr->p_price_3 . "'  
											 ,discount_price='" . $arr_attr->discount_p_3 . "' 
											 ,p_start_date=  '" . $this->objGeneral->convert_date($arr_attr->p_start_date) . "'
											,p_end_date=   '" . $this->objGeneral->convert_date($arr_attr->p_end_date) . "'
											,product_id='" . $product_id . "' 	,status='1'  
											,company_id='" . $this->arrUser['company_id'] . "' 
											,user_id='" . $this->arrUser['id'] . "'
											,date_added='" . current_date . "'";
                    if ($arr_attr->volume_3_purchases != NULL)
                        $RS = $this->objsetup->CSI($Sql3);

                    $new = 'Add';
                    $new_msg = 'Insert';
                } else {
                    $Sql = "UPDATE product_purchaser SET   
									purchase_price='" . $arr_attr->purchase_price_11 . "'  
									,discount_value='" . $arr_attr->discount_value_11 . "'
									,discount_price='" . $arr_attr->discount_price_11 . "'   
									WHERE id = " . $pr_id . "   Limit 1";
                    $RS = $this->objsetup->CSI($Sql);
                }
            }
        }

        //	echo $Sql;exit;

        /* if($counter_supplier > 0){

          $this->copy_supplier_log($arr_attr,$supplier_type,$volume_1,$volume_2,$volume_3,$product_id);
          }

          if($counter_purchase > 0){

          $this->copy_purchase_log($arr_attr,$supplier_type,$volume_1,$volume_2,$volume_3,$product_id);
          }
         */

        $message = "Record  $new_msg  ";

        if ($product_id > 0) {
            $response['product_id'] = $product_id;
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $message;
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Updated!';
            $response['msg'] = $message;
        }

        return $response;
    }

    function get_customer_sale_list($attr)
    {
        $response2 = array();
        $response = array();

        $Sql = "SELECT customer_id as id,discount_type,discount_value,discounted_price
	   FROM product_sale_customer  where sale_id ='".$attr['id']."' and status=1 ";
        $RS = $this->objsetup->CSI($Sql);
        $selected = array();

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $selected[] = $Row['id'];

                $result['id'] = $Row['id'];
                $result['discount_type'] = $Row['discount_type'];
                $result['discount_value'] = $Row['discount_value'];
                $result['discounted_price'] = $Row['discounted_price'];
                $response2['response_selected'][] = $result;
            }
        }
        //	print_r($response2['response_selected']);exit;
        $limit_clause = $where_clause = "";


        $Sql = "SELECT  d.id, d.name, d.contact_person, d.customer_no, d.customer_price, d.type
	, d.address_1, d.city, d.postcode 
	,(SELECT  volume_1_price FROM crm_price_offer_listing  where product_id=".$attr['product_id']." and crm_id=d.id Limit 1)as price
	,(SELECT  cs1.title FROM site_constants  cs1
	where cs1.type='SEGMENT' and cs1.id=d.company_type
	Limit 1)as segment
	,(SELECT  cs2.title FROM site_constants  cs2
	where cs2.type='BUYING_GROUP' and cs2.id=d.buying_grp
	Limit 1)as buying_group 
	FROM crm  d
	left  JOIN company on company.id=d.company_id 
	where type in (2,3) and ( d.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	order by d.id DESC";


        $RS = $this->objsetup->CSI($Sql);

        $selected_count = 0;


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();
                $result['id'] = $Row['id'];

                if ($Row['type'] == 1)
                    $result['code'] = 'CRM';// . $this->module_item_prefix($Row['customer_no'])
                else
                    $result['code'] = 'CUST';// . $this->module_item_prefix($Row['customer_no'])

                $result['name'] = $Row['name'];
                $result['address'] = $Row['address_1'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];

                if ($Row['segment'] == '')
                    $result['segment'] = "NA";
                else
                    $result['segment'] = $Row['segment'];

                if ($Row['buying_group'] == '')
                    $result['Buying Group'] = "NA";
                else
                    $result['Buying Group'] = $Row['buying_group'];

                if ($attr['price_check'] == 0)
                    $result['price'] = $Row['price'];
                //	if (in_array($Row['id'], $selected)) 
                //if (key_exists($Row['id'], $response2['response_selected']))
                /* if (array_key_exists($Row['id'], $response2['response_selected'])) 	{ 	
                  $result['checked'] =1;
                  $selected_count++;
                  }	else{		$result['checked'] =0;	} */

                $value_count = 0;
                foreach ($response2['response_selected'] as $key => $m_id) {
                    if ($Row['id'] == $m_id['id']) {
                        $value_count = 1;
                        $selected_count++;
                    }

                    $result['checked'] = $value_count;
                    $result['discount_type'] = ($m_id['discount_type'] == 1) ? "Percentage" : "Value";
                    $result['discount_value'] = $m_id['discount_value'];
                    $result['discounted_price'] = $m_id['discounted_price'];


                    if ($m_id['discount_type'] == 1) {
                        $discount_priceone = $m_id['discount_value'] * $Row['customer_price'] / 100;
                        $discount_price = $Row['customer_price'] - $discount_priceone;
                    } else if ($m_id['discount_type'] == 2) {
                        $result['discounted_price'] = $Row['customer_price'] - $m_id['discount_value'];
                    }
                }
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }


        $response['selected_count'] = $selected_count;
        $response['discount_type2'] = $m_id['discount_type'];
        $response['discount_value2'] = $m_id['discount_value'];
        $response['discounted_price2'] = $m_id['discounted_price'];
        return $response;
    }

    function get_customer_sale_list_filter($attr)
    {
        $response2 = array();
        $response = array();

        $Sql = "SELECT customer_id as id,discount_type,discount_value,discounted_price,customer_price
	   FROM product_sale_customer  where sale_id ='".$attr['id']."' and status=1 ";
        $RS = $this->objsetup->CSI($Sql);
        $selected = array();

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $selected[] = $Row['id'];

                $result['id'] = $Row['id'];
                $result['discount_type'] = $Row['discount_type'];
                $result['discount_value'] = $Row['discount_value'];
                $result['discounted_price'] = $Row['discounted_price'];
                $result['customer_price'] = $Row['customer_price'];
                $response2['response_selected'][] = $result;
            }
        }

        //	print_r($response2['response_selected']);exit;
        $limit_clause = $where_clause = "";


        $Where = "";
        $segment = "";
        $buying = "";
        $searchKeyword = trim($attr['searchKeyword']);
        //previus
        /* $filter_1 =	$attr[cat_ids];//$attr[select_1s]; 

          if($filter_1==1)	 $segment = "AND sc1.name LIKE  '%$searchKeyword%' ";
          else if($filter_1==2)	 $buying = "AND sc2.name LIKE '%$searchKeyword%' ";

          if($attr[cat_ids]=='address') $attr[cat_ids]='address_1';
          $filter_2 =	$attr[cat_ids];
          if($filter_2 != "") $Where .= " AND   d.$filter_2 LIKE '%$searchKeyword%' ";
         */

        $filter = $attr['cat_ids'];

        if ($filter == 'customer_no') {

            $searchKeyword = filter_var($attr['searchKeyword'], FILTER_SANITIZE_NUMBER_INT);
            $searchKeyword = ltrim($searchKeyword, '0');
        }

        if ($attr['cat_ids'] != "")
            $Where .= " AND   d.$filter LIKE '%$searchKeyword%' ";

        if (empty($attr['type']))
            $attr['type'] = 3;

        $Sql = "SELECT  d.id, d.name, d.contact_person, d.customer_no, d.customer_price, d.type, d.address_1, d.city, d.postcode 
		,(SELECT  volume_1_price FROM crm_price_offer_listing  where product_id=".$attr['product_id']." and crm_id=d.id
		Limit 1)as price
		,(SELECT  sc1.title FROM site_constants  sc1	  where sc1.type='SEGMENT'  $segment
		and sc1.id=d.company_type Limit 1)as segment
		,(SELECT  sc2.title FROM site_constants sc2 where sc2.type='BUYING_GROUP'  $buying
		and sc2.id=d.buying_grp	Limit 1)as buying_group
		FROM crm  d
		left  JOIN company on company.id=d.company_id 
		where type in (2,3) and ( d.company_id=" . $this->arrUser['company_id'] . " 
		or  company.parent_id=" . $this->arrUser['company_id'] . ")
		$Where	
		order by d.id DESC";


        $RS = $this->objsetup->CSI($Sql);

        $selected_count = 0;

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                $result['id'] = $Row['id'];
                if ($Row['type'] == 1)
                    $result['code'] = 'CRM';// . $this->module_item_prefix($Row['customer_no'])
                else
                    $result['code'] = 'CUST';// . $this->module_item_prefix($Row['customer_no'])

                $result['name'] = $Row['name'];
                $result['address'] = $Row['address_1'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];


                /* if($Row['segment']=='') $result['segment']="NA";
                  else $result['segment']=$Row['segment'];

                  if($Row['buying_group']=='') $result['Buying Group']="NA";
                  else $result['Buying Group']=$Row['buying_group'];

                 */

                if ($attr['type'] == 3) {
                    $result['segment'] = $Row['segment'];
                    $result['buying_group'] = $Row['buying_group'];
                } elseif ($attr['type'] == 1)
                    $result['segment'] = $Row['segment'];
                elseif ($attr['type'] == 2)
                    $result['buying_group'] = $Row['buying_group'];

                if ($attr['price_check'] == 0)
                    $result['price'] = $Row['price'];
                //	if (in_array($Row['id'], $selected)) 
                //if (key_exists($Row['id'], $response2['response_selected']))
                /* if (array_key_exists($Row['id'], $response2['response_selected'])) 	{ 	
                  $result['checked'] =1;
                  $selected_count++;
                  }
                  else{		$result['checked'] =0;	} */

                $value_count = 0;
                if ($attr['get_id'] > 0) {
                    $result['discounted_price'] = '';
                    foreach ($response2['response_selected'] as $key => $m_id) {
                        // echo $Row['id']; echo $m_id['id'];


                        if ($Row['id'] == $m_id['id']) {
                            $value_count = 1;
                            $selected_count++;
                            /* $result['customer_price'] = $m_id['customer_price'];
                              $result['discounted_price'] = $m_id['discounted_price'];
                              $result['discounted2'] = $m_id['discounted_price']; */
                        }
                        $result['checked'] = $value_count;
                        $result['discount_type'] = ($m_id['discount_type'] == 1) ? "Percentage" : "Value";
                        $result['discount_value'] = $m_id['discount_value'];
                        $result['discounted_price'] = $m_id['discounted_price'];


                        if ($m_id['discount_type'] == 1) {
                            $discount_priceone = $m_id['discount_value'] * $result['customer_price'] / 100;
                            $result['discounted2'] = round($result['customer_price'] - $discount_priceone, 2);
                        } else if ($m_id['discount_type'] == 2) {
                            $result['discounted2'] = round($result['customer_price'] - $m_id['discount_value'], 2);
                        }

                        /* if(($result['price']==0))	{
                          $result['price'] = 'NA';
                          $result['discounted_price'] = 'NA';
                          //$result['discounted2']= 'NA';
                          $result['discount_type'] ='NA';
                          $result['discount_value'] = 'NA';
                          } */
                    }
                }
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_sale_list($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        $date = strtotime(current_date);


        $Sql = "SELECT ps.id,ps.supplier_name,ps.supplier_code
		,ps.sale_selling_check,ps.sale_selling_price,ps.discount_value,ps.discount_price
		,ps.supplier_unit_cost,ps.start_date,ps.end_date
		,ps.discount_value,ps.supplier_type 
		FROM product_sale ps   
		WHERE ps.product_id='".$attr['product_id']."' and ps.status=1
		and ps.end_date >= '" . strtotime("now") . "'		
		order by ps.id DESC";

        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                //$result['customer_code'] = $Row['supplier_code'];  
                // $result['customer_name'] = $Row['name'];
                $result['customers'] = $Row['supplier_name'];
                //	if($Row['supplier_unit_cost']==0){$result['Promotion Price'] = 'NA';}
                //	else{$result['Promotion Price'] = $Row['supplier_unit_cost'];}
                if ($Row['sale_selling_price'] == 0) {
                    $result['Standard Selling Price'] = 'NA';
                } else {
                    $result['Standard Selling Price'] = $Row['sale_selling_price'];
                }
                $result['discount_type'] = ($Row['supplier_type'] == 1) ? "Percentage" : "Value";
                $result['discount'] = ($Row['supplier_type'] == 1) ? $Row['discount_value'] . "%" : $Row['discount_value'];
                $result['discounted_price'] = $Row['discount_price'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function get_supplier_list_product_id($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT product_supplier.id,product_supplier.start_date,product_supplier.end_date
		,product_supplier.discount_value,product_supplier.supplier_type
		,product_supplier.volume_name
		,product_supplier.purchase_price,product_supplier.discount_price
		FROM product_supplier  
		Left  JOIN company on company.id=product_supplier.company_id 
		where product_supplier.product_id='".$attr['product_id']."' and product_supplier.status=1 
		and ( product_supplier.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	
		order by product_supplier.id DESC";


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['Volume'] = $Row['volume_name'];
                $result['Standard Selling Price'] = $Row['purchase_price'];
                if ($Row['supplier_type'] == 1) {
                    $result['discount_type'] = 'Percentage';
                } else {
                    $result['discount_type'] = 'Value';
                }
                $result['Discount'] = ($Row['supplier_type'] == 1) ? $Row['discount_value'] . "%" : $Row['discount_value'];
                $result[' Discounted Price'] = $Row['discount_price'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function get_purchase_list_product_id($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();

        $Sql = "SELECT product_purchaser.id,product_purchaser.p_start_date,product_purchaser.p_end_date
,product_purchaser.discount_value,product_purchaser.purchase_type,product_purchaser.purchase_price,product_purchaser.discount_price,product_purchaser.volume_name
		FROM product_purchaser   
		left  JOIN company on company.id=product_purchaser.company_id 
		where product_purchaser.product_id='".$attr['product_id']."' and product_purchaser.status=1 
		and ( product_purchaser.company_id=" . $this->arrUser['company_id'] . " 
		or  company.parent_id=" . $this->arrUser['company_id'] . ")
		order by product_purchaser.id DESC";


        $RS = $this->objsetup->CSI($Sql);


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                $result['Volume'] = $Row['volume_name'];
                $result['Standard Unit Price '] = $Row['purchase_price'];
                $result['discount_type'] = 'Value';
                if ($Row['purchase_type'] == 1)
                    $result['discount_type'] = 'Percentage';
                $result['Discount'] = ($Row['purchase_type'] == 1) ? $Row['discount_value'] . "%" : $Row['discount_value'];
                $result[' Discounted Price'] = $Row['discount_price'];

                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['p_start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['p_start_date']);
                /*
                  $dt = new DateTime($Row['p_start_date']);  // convert UNIX timestamp to PHP DateTime
                  $result['start_date'] =$dt->format('d/m/Y');
                  $dt = new DateTime($Row['p_start_date']);  // convert UNIX timestamp to PHP DateTime
                  $result['end_date'] =$dt->format('d/m/Y');
                 */


                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function get_products($attr)
    {
        global $objFilters;
        $where = self::setCondtionArray($attr['condition']);
        //echo "<pre>"; print_r($where); exit;
        return $objFilters->get_module_listing(29, "products", '', '', '', '', $where);
    }

    function setCondtionArray($condition)
    {
        $where = array();
        if (isset($condition) && !empty($condition)) {
            $arr_cond = explode('@', $condition);

            if (count($arr_cond) > 1 && $arr_cond[0]) {
                foreach ($arr_cond as $cond) {
                    list($col, $val) = explode('*', $cond);
                    $where[][$col] = $val;
                }
            } else {
                list($col, $val) = explode('*', $condition);
                $where[][$col] = $val;
            }
        }

        return $where;
    }

    function get_item_avg($attr)
    {
        $response = array();
        $sql_total = "SELECT  avg(unit_price) as avg	FROM srm_invoice_detail
				WHERE  product_id='" . $attr['product_id'] . "' and status=1 ";
        $rs_count = $this->objsetup->CSI($sql_total);
        $avg = $rs_count->fields['avg'];
        if ($avg == 0) {
            $response['ack'] = 0;
            $response['error'] = 'No PO exists for this item';
            // $response['error'] = 'Record not Exist .';
        } else {
            $response['ack'] = 1;
            $response['avg'] = round($avg, 2);
            $response['error'] = 'Record  Exist .';
        }
        return $response;
    }

    function update_product($attr)
    {
        $start_date = date('Y-m-d');
        $end_date = date('Y-m-d');
        /* if(!empty($attr['margin_start_date'])){
          if(strpos($attr['margin_start_date'],'/') == true){
          $date = str_replace('/', '-', $attr['margin_start_date']);
          $start_date = date("Y-m-d", strtotime($date));
          }
          else{
          $start_date = $attr['margin_start_date'];
          }
          }


          if(!empty($attr['margin_end_date'])){
          if(strpos($attr['margin_end_date'],'/') == true){
          $date = str_replace('/', '-', $attr['margin_end_date']);
          $end_date = date("Y-m-d", strtotime($date));
          }
          else{
          $end_date = $attr['margin_end_date'];
          }
          } */

        if ((isset($attr['margin_start_date']) && !empty($attr['margin_start_date']) && !is_numeric($attr['margin_start_date']))) {
            if (strpos($attr['margin_start_date'], '/') == true) {
                $date = str_replace('/', '-', $attr['margin_start_date']);
                $start_date = date("Y-m-d", strtotime($date));
                $start_date = $this->objGeneral->convert_date($start_date);
            } else {
                $start_date = $this->objGeneral->convert_date($attr['margin_start_date']);
            }
        } else {
            $start_date = strtotime($attr['margin_start_date']);
        }

        if ((isset($attr['margin_end_date']) && !empty($attr['margin_end_date']) && !is_numeric($attr['margin_end_date']))) {
            if (strpos($attr['margin_end_date'], '/') == true) {
                $date = str_replace('/', '-', $attr['margin_end_date']);
                $end_date = date("Y-m-d", strtotime($date));
                $end_date = $this->objGeneral->convert_date($end_date);
            } else {
                $end_date = $this->objGeneral->convert_date($attr['margin_end_date']);
            }
        } else {
            $end_date = $this->objGeneral->convert_date($attr['margin_end_date']);
        }

        /* if((isset($attr['margin_end_date']) && !empty($attr['margin_end_date']) && !is_numeric($attr['margin_end_date']))){
          $end_date = strtotime($attr['margin_end_date']);
          }
          if((isset($attr['margin_start_date']) && !empty($attr['margin_start_date']) && is_numeric($attr['margin_start_date']))
          && (isset($attr['margin_end_date']) && !empty($attr['margin_end_date']) && is_numeric($attr['margin_end_date']))){
          $start_date = $attr['margin_start_date'];
          $end_date = $attr['margin_end_date'];
          } */


        $response = array();
        if (isset($attr['standard_price']) && isset($attr['absolute_minimum_price'])) {
            $Sql = "UPDATE product SET  
  margin_start_date= '" . $this->objGeneral->convert_date($attr['margin_start_date']) . "'
,margin_end_date= '" . $this->objGeneral->convert_date($attr['margin_end_date']) . "'
, standard_price='" . $attr['standard_price'] . "',absolute_minimum_price='" . $attr['absolute_minimum_price'] . "',
                      sale_item_gl_code='" . $attr['sale_item_gl_code'] . "',
                      sale_item_gl_id='" . $attr['sale_item_gl_id'] . "'

				WHERE  id='" . $attr['product_id'] . "'";
        } else {
            $Sql = "UPDATE product SET 
margin_start_date= '" . $this->objGeneral->convert_date($attr['margin_start_date']) . "'
,margin_end_date= '" . $this->objGeneral->convert_date($attr['margin_end_date']) . "'
, standard_price='" . $attr['standard_price'] . "',absolute_minimum_price='" . $attr['absolute_minimum_price'] . "',
                      sale_item_gl_code='" . $attr['sale_item_gl_code'] . "',
                      sale_item_gl_id='" . $attr['sale_item_gl_id'] . "'
				WHERE  id='" . $attr['product_id'] . "'";
        }

        //echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Not updated.';
        }
        return $response;
    }

    function get_sale_margin($attr)
    {
        $response = array();
        $sql = "SELECT year_start_date, year_end_date   
						FROM financial_settings WHERE company_id = '" . $this->arrUser['company_id'] . "' limit 1";

        // echo $sql; exit;		
        $RS = $this->objsetup->CSI($sql);
        $start_date = strtotime($RS->fields['year_start_date']);
        $end_date = strtotime($RS->fields['year_end_date']);

        /* if((isset($attr['margin_start_date']) && !empty($attr['margin_start_date']) && !is_numeric($attr['margin_start_date'])) 
          && (isset($attr['margin_end_date']) && !empty($attr['margin_end_date']) && !is_numeric($attr['margin_end_date']))){
          $start_date = strtotime($attr['margin_start_date']);
          $end_date = strtotime($attr['margin_end_date']);
          }
          if((isset($attr['margin_start_date']) && !empty($attr['margin_start_date']) && is_numeric($attr['margin_start_date']))
          && (isset($attr['margin_end_date']) && !empty($attr['margin_end_date']) && is_numeric($attr['margin_end_date']))){
          $start_date = $attr['margin_start_date'];
          $end_date = $attr['margin_end_date'];
          } */

        if ((isset($attr['margin_start_date']) && !empty($attr['margin_start_date']) && !is_numeric($attr['margin_start_date']))) {
            if (strpos($attr['margin_start_date'], '/') == true) {
                $date = str_replace('/', '-', $attr['margin_start_date']);
                $start_date = date("Y-m-d", strtotime($date));
                $start_date = $this->objGeneral->convert_date($start_date);
            } else {
                $start_date = $this->objGeneral->convert_date($attr['margin_start_date']);
            }
        } else {
            if ($attr['margin_start_date'] > 0)
                $start_date = $this->objGeneral->convert_date($attr['margin_start_date']);
        }

        if ((isset($attr['margin_end_date']) && !empty($attr['margin_end_date']) && !is_numeric($attr['margin_end_date']))) {
            if (strpos($attr['margin_end_date'], '/') == true) {
                $date = str_replace('/', '-', $attr['margin_end_date']);
                $end_date = date("Y-m-d", strtotime($date));
                $end_date = $this->objGeneral->convert_date($end_date);
            } else {
                $end_date = $this->objGeneral->convert_date($attr['margin_end_date']);
            }
        } else {
            if ($attr['margin_end_date'] > 0)
                $end_date = $this->objGeneral->convert_date($attr['margin_end_date']);
        }


        $sql_total = "SELECT avg(sd.unit_price) as avg  
						FROM srm_invoice_detail sd WHERE sd.status=1 AND product_id = '" . $attr['product_id'] . "' and invoice_type in(2,3)
						AND ( sd.order_date BETWEEN '" . $start_date . "' AND '" . $end_date . "')";

        $avg_cost = 0;

        $rs_count = $this->objsetup->CSI($sql_total);
        if ($rs_count->fields['avg'] > 0)
            $avg_cost = $rs_count->fields['avg'];
        $overall_margin = ($attr['standard_price'] - $avg_cost) / ($attr['standard_price'] * 100);
        if ($overall_margin > 0) {
            $response['overall_margin'] = round($overall_margin, 0);
        } else
            $response['overall_margin'] = '0';

        $response['margin_start_date'] = $this->objGeneral->convert_unix_into_date($start_date);
        $response['margin_end_date'] = $this->objGeneral->convert_unix_into_date($end_date);

        return $response;
    }

    function get_last_invoice_date($attr)
    {
        $response = array();
        $sql = "SELECT order_details.order_date   
						FROM order_details 
						JOIN orders ON (orders.id = order_details.order_id) 
						WHERE company_id = '" . $this->arrUser['company_id'] . "' AND order_details.item_id = " . $attr['product_id'] . " AND orders.type in (2,3) ORDER BY order_details.id DESC limit 1";

        // echo $sql; exit;		
        $RS = $this->objsetup->CSI($sql);
        $order_date = $this->objGeneral->convert_unix_into_date($RS->fields['order_date']);

        if (!empty($order_date)) {
            $response['order_date'] = $order_date;
            $response['ack'] = 1;
        } else {
            $response['order_date'] = '';
            $response['ack'] = 0;
        }

        return $response;
    }

    
    function get_all_categories($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT   c.id, c.name, c.description 
                FROM  category  c 
                left JOIN company on company.id=c.company_id 
                where   c.status=1  and c.name!='' and 
                        (c.company_id=" . $this->arrUser['company_id'] . " or  
                         company.parent_id=" . $this->arrUser['company_id'] . ")		 
                group by  c.name"; 

        //c.user_id=".$this->arrUser['id']." 
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['description'] = $Row['description'];
                $result['title'] = $Row['name'];

                $result['brands'] = array();

                /* $Sql2 = "SELECT  map.id,map.brandID,map.categoryID
                     FROM  brandcategorymap  map 
                     where map.brandID='" . $Row['id']. "' "; 

                $RS2 = $this->objsetup->CSI($Sql2);

                if ($RS2->RecordCount() > 0) {
                    while ($Row2 = $RS2->FetchRow()) {

                        foreach ($Row2 as $key => $value) {
                            if (is_numeric($key))
                                unset($Row2[$key]);
                        }
                        $result['categories'][] = $Row2;
                    }
                }
                else{
                    $result['categories'] = 0;
                }               

                $response['response'][] = $result; */


                /* ============================== */
                $Sql2 = "SELECT  map.id,map.brandID,map.categoryID
                        FROM  brandcategorymap  map
                        left JOIN company on company.id=map.company_id  
                        where map.categoryID='" . $Row['id']. "' and 
                            (map.company_id=" . $this->arrUser['company_id'] . " or  
                            company.parent_id=" . $this->arrUser['company_id'] . ")"; 

                $RS2 = $this->objsetup->CSI($Sql2);

                if ($RS2->RecordCount() > 0) {
                    while ($Row2 = $RS2->FetchRow()) {

                        foreach ($Row2 as $key => $value) {
                            if (is_numeric($key))
                                unset($Row2[$key]);
                        }
                        $result['brands'][] = $Row2;
                    }
                }
                else
                    $result['brands'] = 0;
                /* ============================== */

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }
        /* if($remendar=11)
			 {
				$result['id'] = -1;
				$result['name'] = '+ Add New';
				$response['response'][] = $result;
			 }*/
        return $response;
    }

    function get_all_brands($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT  c.id, c.brandname, c.brandcode  
                FROM  brand  c 
                left JOIN company on company.id=c.company_id
                where   c.status=1  and 
                        c.brandname!='' and 
                        (c.company_id=" . $this->arrUser['company_id'] . " or  
                         company.parent_id=" . $this->arrUser['company_id'] . ")
                group by  c.brandname DESC "; 
        
        //c.user_id=".$this->arrUser['id']." 

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['brandname'];
                $result['description'] = $Row['brandname'];
                $result['title'] = $Row['brandname'];

                $Sql2 = "SELECT  map.id,map.brandID,map.categoryID
                     FROM  brandcategorymap  map
                     left JOIN company on company.id=map.company_id 
                     where map.brandID='" . $Row['id']. "' and 
                        (map.company_id=" . $this->arrUser['company_id'] . " or  
                         company.parent_id=" . $this->arrUser['company_id'] . ")"; 
                //echo  $Sql2; exit;

                $RS2 = $this->objsetup->CSI($Sql2);

                if ($RS2->RecordCount() > 0) {
                    while ($Row2 = $RS2->FetchRow()) {

                        foreach ($Row2 as $key => $value) {
                            if (is_numeric($key))
                                unset($Row2[$key]);
                        }
                        $result['categories'][] = $Row2;
                    }
                }
                else{
                    $result['categories'] = 0;
                }               

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;

        } else {
            $response['response'] = array();
        }
        /* echo "<pre>";
        print_r($response);
        exit; */
        return $response;
    }

}
