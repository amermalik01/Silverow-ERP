<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Setup.php");

class Document extends Xtreme
{

    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;
    private $user_type = 0;
    private $company_id = 0;
    private $objsetup = null;

    function __construct($user_info = array())
    {

        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->arrUser = $user_info;
        $this->objsetup = new Setup($user_info);
    }

// static	
    function delete_update_status($table_name, $column, $id)
    {

        //	$Sql = "DELETE FROM $table_name 	WHERE id = $id Limit 1 ";
        $Sql = "UPDATE $table_name SET  $column=0 	WHERE id = $id Limit 1";
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            if ($table_name == 'ref_image') {
                return; // removing table ref_image from db as it is not being used
                echo $Sql1 = "SELECT *
				FROM ref_image
				WHERE id='$id'
				LIMIT 1";
                $Row = $this->objsetup->CSI($Sql1)->FetchRow();
                if ($Row[name] != '')
                    unlink(UPLOAD_PATH . "company_logo_temp/" . $Row[name]);
            }
            if ($Row[default_flag] == 1) {
                $rid = $Row[row_id];
                $Sql = "UPDATE product set prd_picture='' WHERE id=$rid";
                $RS = $this->objsetup->CSI($Sql);
            }
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

//set default status	
    function set_default_image($table_name, $column, $id, $rid, $refImg)
    {

        $Sql = "UPDATE $table_name SET  $column=0 	WHERE row_id = $rid";

        $RS = $this->objsetup->CSI($Sql);

        $Sql = "UPDATE product set prd_picture='$refImg' WHERE id=$rid";

        $RS = $this->objsetup->CSI($Sql);

        $Sql = "UPDATE $table_name SET  $column=1 	WHERE id = $id Limit 1";

        $RS = $this->objsetup->CSI($Sql);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be updated!';
        }

        return $response;
    }

    function get_data_by_id($table_name, $id)
    {

        $Sql = "SELECT *
				FROM $table_name
				WHERE id=$id
				LIMIT 1";
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

    ############	Start: Generl document##

    function get_document_all_main($attr)
    {
        return; // removing table document_permision from db as it is not being used
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);

        if (!empty($attr['deparment']))
            $where_clause .= "AND (cs.salesperson_id=$attr[deparment] Or cs.salesperson_id=$attr[user_id]) ";

        if (!empty($attr['module']))
            $where_clause1 .= "AND (ri.folder_id=$attr[module] ) ";

        $response = array();
//  AND ri.folder_id=0  AND  title!='' 


        $Sql .= "SELECT  ri.id,ri.title,ri.name,0 as permisions,(SELECT df.title FROM document df where df.id=ri.folder_id and df.type=1  limit 1)as fname ,(SELECT df.first_name FROM employees df where df.id=ri.user_id   limit 1) as creater ,0 as chk_permision,CASE  WHEN ri.is_public= 1 THEN 'Private' WHEN ri.is_public= 2 THEN 'Public'   END AS share,ri.create_date
		,is_shared FROM document ri
		left JOIN company on company.id=ri.company_id 
		WHERE  ri.status=1   AND ri.type=2     AND ri.main_module_doc=2   AND ri.user_id='" . $this->arrUser['id'] . "'
		AND (ri.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		$where_clause1
		group by ri.id
		$limit_clause
 		Union 
		SELECT  ri.id,ri.title,ri.name,cs.permisions,(SELECT df.title FROM document df where df.id=ri.folder_id and df.type=1  limit 1)as fname  ,(SELECT df.first_name FROM employees df where df.id=ri.user_id   limit 1) as creater  ,1 as chk_permision,CASE   WHEN ri.is_public= 1 THEN 'Private' WHEN ri.is_public= 2 THEN 'Public'   END AS share,ri.create_date ,is_shared FROM document ri left JOIN company on company.id=ri.company_id  JOIN document_permision cs on cs.module_id=ri.id 
		WHERE  ri.status=1   AND ri.type=2 AND ri.main_module_doc=2    AND ri.user_id!='" . $this->arrUser['id'] . "'
		AND (ri.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		AND FIND_IN_SET(3, cs.permisions)
		$where_clause
		$where_clause1
		AND cs.type IN (7,8)
		
		$limit_clause
		";


        $order_type = "group by ri.id";
        $total_limit = 100; //pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ri', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                // $result['code'] = $Row['document_code'];
                $result['document_name'] = $Row['title'];
                $result['folder_name'] = $Row['fname'];
                $result['share_with'] = $Row['share'];
                $result['sid'] = $Row['is_shared'];
                $result['created_by'] = $Row['creater'];
                $result['date_created'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);
                $result['path'] = $Row['name'];
                if (!empty($result['path']))
                    $result['extention'] = strtolower(substr($result['path'], strrpos($result['path'], ".") + 1));
                $result['permisions'] = $Row['permisions'];
                $result['chkp'] = $Row['chk_permision'];

                //	$result['user_id'] = $Row['user_id'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function add_document_all_main($arr_attr)
    {
        $doc_id = $arr_attr['id'];

        if ($arr_attr['id'] > 0)
            $where_id = " AND tst.id <> '".$arr_attr['id']."' ";

        $data_pass = "  tst.title='" . $arr_attr['document_title'] . "'  AND  tst.main_module_doc=2  $where_id";
        $total = $this->objGeneral->count_duplicate_in_sql('document', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }

        if ($doc_id == 0) {

            $Sql = "INSERT INTO document SET 
					title='" . $arr_attr['document_title'] . "',document_code='" . $arr_attr['document_code'] . "'
					,name='" . $arr_attr['document_path'] . "',FileType='" . $arr_attr['FileType'] . "'
					,folder_id='" . $arr_attr['folder_ids'] . "',is_public='" . $arr_attr['is_publics'] . "'
					,status=1,is_shared='" . $arr_attr['is_shareds'] . "' ,main_module_doc=2 ,type=2
					,company_id='" . $this->arrUser['company_id'] . "'	
					,user_id='" . $this->arrUser['id'] . "',create_date='" . current_date . "'";
            // $response =$this->objGeneral->run_query_exception($Sql);
            //return $response;
        } else {
            $Sql = "UPDATE document SET 
					title='" . $arr_attr['document_title'] . "',document_code='" . $arr_attr['document_code'] . "'
					,name='" . $arr_attr['document_path'] . "',FileType='" . $arr_attr['FileType'] . "'
					,folder_id='" . $arr_attr['folder_ids'] . "',is_shared='" . $arr_attr['is_shareds'] . "'
					,is_public='" . $arr_attr['is_publics'] . "' 
					WHERE id = ".$arr_attr['id']." Limit 1"; //,status='".$arr_attr[statuss]."'
        }

        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($doc_id == 0)
            $doc_id = $this->Conn->Insert_ID();

        //if($this->Conn->Affected_Rows() > 0)
        if ($doc_id > 0) {
            $response['ack'] = 1;
            $response['id'] = $doc_id;
            $response['error'] = 'Record Updated Successfully';
        } else {
            $response['ack'] = 0;
            if ($doc_id > 0)
                $response['id'] = $doc_id;
            $response['error'] = 'Record Not Updated';
            $response['msg'] = $message;
        }
        return $response;
    }

    function sort_document($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        // print_r($arr_attr);exit;

        $upslide = strcmp($arr_attr['str'], "up");
        $downslide = strcmp($arr_attr['str'], "down");

        $add = $arr_attr['id'] + 1;
        $sort_id = $arr_attr['sort_id'];
        $sort_post = $sort_id + 1;
        $sort_pre = $sort_id - 1;

        $current = $arr_attr['id'];
        $count == 0;


        if ($upslide == 0) {//&& $arr_attr['index']>=0
            $sql_total = "SELECT  *	FROM document WHERE sort_id='" . $sort_pre . "' and tab_id='" . $arr_attr['t_id'] . "'";
            $rs_count_start = $this->objsetup->CSI($sql_total);


            if ($rs_count_start->RecordCount() > 0) {


                $Sql = "UPDATE document SET sort_id = $sort_id WHERE sort_id =  $sort_pre Limit 1 ";
                $RS = $this->objsetup->CSI($Sql);

                $Sql2 = "UPDATE document SET sort_id = $sort_pre WHERE id = $current Limit 1 ";
                $RS2 = $this->objsetup->CSI($Sql2);

                $count++;
            }
        }

        if ($downslide == 0) { //&& $arr_attr['index']>=0
            $sql_total = "SELECT  *	FROM document WHERE sort_id='" . $sort_post . "'and tab_id='" . $arr_attr['t_id'] . "'";
            $rs_count_start = $this->objsetup->CSI($sql_total);


            if ($rs_count_start->RecordCount() > 0) {

                $Sql = "UPDATE document SET sort_id = $sort_id WHERE sort_id = $sort_post and tab_id='" . $arr_attr['t_id'] . "' Limit 1 ";
                $RS = $this->objsetup->CSI($Sql);

                $Sql2 = "UPDATE document SET sort_id = $sort_post WHERE id = $current and tab_id='" . $arr_attr['t_id'] . "'Limit 1 ";
                $RS2 = $this->objsetup->CSI($Sql2);


                $count++;
            }
        }
        //exit;

        if ($count > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            return $response;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'record not updated!';
            return $response;
        }
    }

    function get_list_by_tab_id($attr)
    {
        return; // removing table employee_tabs from db as it is not being used

        $this->objGeneral->mysql_clean($arr_attr);

        $id = $attr['tab_id']->id;


        $Sql = "SELECT document.id, document.name, document.sort_id, document.description, document.status, document.tab_id,employee_tabs.name as tabName FROM document
		LEFT JOIN employee_tabs ON employee_tabs.id = document.tab_id
		LEFT  JOIN company on company.id=document.company_id 
		where  document.status=1 
		and (document.company_id=" . $this->arrUser['company_id'] . " 
		or  company.parent_id=" . $this->arrUser['company_id'] . ") and document.tab_id=$id
		  ";


        $order_type = " ";
        $total_limit = 100; //pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'document', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['id'];
                $result['Tabid'] = $Row['t_id'];
                $result['Sortid'] = $Row['sort_id'];
                $result['name'] = $Row['name'];
                //$result['tab_name'] = $Row['tabName'];
                //$result['description'] = $Row['description']; 
                // $result['status'] = ($Row['status'] == "1")?"Active":"Inactive";
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_documents_folder_main($attr, $p)
    {

        $Sql = "SELECT c.id, c.title  as name,  c.folder_id  as parent_id,c.user_id,c.create_date
		 ,(SELECT df.first_name FROM employees df where df.id=c.user_id   limit 1) as creater 
		FROM  document  c 
		left JOIN company on company.id=c.company_id 
		where c.type=1    AND   c.status=1   AND c.user_id='" . $this->arrUser['id'] . "'   AND
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	 
		order by c.name DESC "; //and  c.parent_id=0 and //c.id  != 7 and   


        $order_type = " ";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['parent_id'] = $Row['parent_id'];
                $result['user_id'] = $Row['user_id'];
                $result['creater'] = $Row['creater'];

                $result['date_created'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);

                if ($Row['parent_id'] == 0)
                    $response['response_parent'][] = $result;
                else
                    $response['response_child'][] = $result;
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }

        if (count($response['response_parent'])) {
            foreach ($response['response_parent'] as $key => $value) {

                $result['id'] = $value['id'];
                $result['name'] = $value['name'];
                $result['parent_id'] = $value['parent_id'];
                $result['creater'] = $value['creater'];
                $response['response'][] = $result;

                // $response['response'][] =  $this->recurcise_child($response['response_child'],$value['id']);

                foreach ($response['response_child'] as $key2 => $value_2) {

                    if ($value_2['parent_id'] == $value['id']) {
                        $result['id'] = $value_2['id'];
                        $result['name'] = "   - " . $value_2['name'];
                        $result['parent_id'] = $value_2['parent_id'];
                        $result['creater'] = $value_2['creater'];
                        $response['response'][] = $result;

                        foreach ($response['response_child'] as $key2 => $value_3) {

                            if ($value_3['parent_id'] == $value_2['id']) {
                                $result['id'] = $value_3['id']; //"  --".$value_3['name']; 
                                $result['name'] = "		- - " . $value_3['name']; // str_pad($value_3['name'],5,".");
                                $result['parent_id'] = $value_3['parent_id'];
                                $result['creater'] = $value_3['creater'];
                                $response['response'][] = $result;

                                foreach ($response['response_child'] as $key2 => $value_4) {

                                    if ($value_4['parent_id'] == $value_3['id']) {
                                        $result['id'] = $value_4['id']; //"  --".$value_3['name']; 
                                        $result['name'] = "		- - - " . $value_4['name']; // str_pad($value_3['name'],5,".");
                                        $result['parent_id'] = $value_4['parent_id'];
                                        $result['creater'] = $value_4['creater'];
                                        $response['response'][] = $result;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return $response;
    }

    function get_folder_permision($arr_attr)
    {

        return; // removing table document_permision from db as it is not being used

        $type = "";

        if (!empty($arr_attr['type']))
            $type .= "and c.type = '".$arr_attr['type']."' ";

        $Sql = "SELECT c.* FROM document_permision c  WHERE c.module_id = '".$arr_attr['id']."'  " . $type . " AND  c.end_date=0 ";


        $order_type = " ";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

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
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_folder_permision($arr_attr)
    {
        return; // removing table document_permision from db as it is not being used

        //$Sql = "UPDATE document SET  permisions='".$arr_attr[permisions]."' WHERE id = $arr_attr[module] Limit 1";
        // $RS = $this->objsetup->CSI($Sql);
        //echo $Sql;exit;
        // print_r($arr_attr);exit;

        $sql = "DELETE FROM document_permision WHERE module_id='$arr_attr[module]'  AND type='" . $arr_attr['type'] . "' ";
        $RS = $this->objsetup->CSI($sql);


        $check = false;
        $Sql = "INSERT INTO document_permision (module_id,salesperson_id,permisions,type,company_id,user_id,start_date) VALUES ";
        foreach ($arr_attr['selected'] as $item) {

            $Sql .= "(  '" . $arr_attr['module'] . "' ," . $item->id . "  ,'" . $item->permisions . "'," . $arr_attr['type'] . "
			," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "	,'" . current_date . "' ), ";

            $check = true;
        }
        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        //echo  $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($check) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not insert';
        }
        return $response;
    }

    function document_list_module($attr)
    {
        return; // removing table document_permision from db as it is not being used
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = $where_clause = "";

        if (!empty($attr['deparment']))
            $where_clause .= "AND (cs.salesperson_id=$attr[deparment] Or cs.salesperson_id=$attr[user_id]) ";

        if (!empty($attr['module']))
            $where_clause1 .= "AND (ri.folder_id=$attr[module] ) AND (ri.is_public=2 ) ";
        else
            $where_clause3 .= "AND (ri.is_public=1 ) ";


        $response = array();
        /* if(!empty($attr['module']))
          {
          $limitStart = $attr['limitStart'];
          $limitCount = 5; // Set how much data you have to fetch on each request
          $limit_clause = "limit $limitStart, $limitCount";
          } */

        $response = array();
        //  AND ri.folder_id=0  AND  title!='' 


        $Sql = "SELECT  ri.id,ri.title,ri.name, 0 as permisions,(SELECT df.title FROM document df where df.id=ri.folder_id and df.type=1  limit 1)as fname ,(SELECT df.first_name FROM employees df where df.id=ri.user_id   limit 1) as creater,0 as chk_permision,CASE  WHEN ri.is_public= 1 THEN 'Private' WHEN ri.is_public= 2 THEN 'Public'  END AS share,ri.create_date,ri.is_shared,ri.user_id
		FROM document ri
		left JOIN company on company.id=ri.company_id 
		WHERE  ri.status=1  AND ri.type=2 AND ri.main_module_doc=2   AND ri.user_id='" . $this->arrUser['id'] . "'
		AND (ri.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		$where_clause3
		$where_clause1
		group by ri.id
		$limit_clause
 		Union 
		SELECT  ri.id,ri.title,ri.name,cs.permisions,(SELECT df.title FROM document df where df.id=ri.folder_id and df.type=1  limit 1)as fname  ,(SELECT df.first_name FROM employees df where df.id=ri.user_id   limit 1) as creater,1 as chk_permision
		,CASE  WHEN ri.is_public= 1 THEN 'Private' WHEN ri.is_public= 2 THEN 'Public'  END AS share,ri.create_date,ri.is_shared,ri.user_id
		FROM document ri
		left JOIN company on company.id=ri.company_id 
		left JOIN document_permision cs on cs.module_id=ri.id 
		WHERE  ri.status=1  AND ri.type=2 AND ri.main_module_doc=2    AND ri.user_id!='" . $this->arrUser['id'] . "'
		AND (ri.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		AND FIND_IN_SET(3, cs.permisions)
		$where_clause
		$where_clause1 
		 AND cs.type IN (7,8)
		
		$limit_clause
		";


        $order_type = "group by ri.id ";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ri', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                $result['id'] = $Row['id'];
                // $result['code'] = $Row['document_code'];
                $result['document_name'] = $Row['title'];
                $result['folder_name'] = $Row['fname'];
                $result['share_with'] = $Row['share'];
                $result['sid'] = $Row['is_shared'];
                $result['created_by'] = $Row['creater'];
                $result['date_created'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);
                $result['path'] = $Row['name'];
                if (!empty($result['path']))
                    $result['extention'] = strtolower(substr($result['path'], strrpos($result['path'], ".") + 1));
                $result['permisions'] = $Row['permisions'];
                $result['chkp'] = $Row['chk_permision'];

                $result['user_id'] = $Row['user_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_folder_list_from_permision($arr_attr)
    {
        return; // removing table document_permision from db as it is not being used
        if (!empty($arr_attr['deparment']))
<<<<<<< HEAD
            $where_clause .= "AND (cs.salesperson_id='$arr_attr[deparment]' OR cs.salesperson_id='$arr_attr[user_id]' ) ";
=======
            $where_clause .= "AND (cs.salesperson_id='$arr_attr[deparment]' OR cs.salesperson_id='".$arr_attr['user_id']."' ) ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $response = array();

        $Sql = "SELECT  ri.id,ri.title as name,ri.folder_id as parent_id,ri.user_id,ri.create_date
		,0 as permisions  ,0 as chk_permision  ,(SELECT df.first_name FROM employees df where df.id=ri.user_id   limit 1) as creater 
		FROM document ri
		left JOIN company on company.id=ri.company_id 
		WHERE title!='' AND ri.status=1  AND ri.type=1   AND ri.user_id='" . $this->arrUser['id'] . "'
		AND (ri.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		group by ri.id
		Union 
		SELECT  ri.id,ri.title as name,ri.folder_id as parent_id,ri.user_id,ri.create_date
		,cs.permisions  ,1 as chk_permision ,(SELECT df.first_name FROM employees df where df.id=ri.user_id   limit 1) as creater 
		FROM document ri
		left JOIN company on company.id=ri.company_id
		left JOIN document_permision cs on cs.module_id=ri.id  
		WHERE ri.status=1  AND ri.type=1   AND ri.user_id !='" . $this->arrUser['id'] . "'
		AND (ri.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		AND FIND_IN_SET(3, cs.permisions)
		" . $where_clause . " 
		 AND cs.type IN (1) 
 		"; //AND ri.main_module_doc=2 


        $order_type = "group by ri.id ";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ri', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['parent_id'] = $Row['parent_id'];
                $result['user_id'] = $Row['user_id'];
                $result['permisions'] = $Row['permisions'];
                $result['chkp'] = $Row['chk_permision'];
                $result['creater'] = $Row['creater'];

                $result['date'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }


        return $response;
    }

    ############	Start: document   ######

    function get_parent_module_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = " SELECT c.id,c.name
				FROM ref_module c
				WHERE c.parent_id=0
				 ";


        $order_type = "";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_child_module_list($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        $Sql = " SELECT c.id,c.name FROM ref_module c WHERE c.parent_id=" . $arr_attr['id'] . "  ";

        $order_type = "";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
        }

        return $response;
    }

    function get_child_module_list_selected($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $per_data = explode(",", $arr_attr['permisions']);

        $Sql = " SELECT c.id,c.name FROM ref_module c 	WHERE c.parent_id=" . $arr_attr['id'] . "  ";

        $order_type = "";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                /* $result['id'] = $Row['id'];
                  $result['name'] = $Row['name'];
                  $response['response'][] = $result;
                 */
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];

                if (in_array($Row['id'], $per_data)) { // if ( is_array($m_id['id']) )//  if ( $per_id == $m_id['id'] )
                    $result['checked'] = TRUE; // $result['check_status'] =TRUE;  
                } else {

                    $result['checked'] = FALSE; // $result['check_status'] = 0;
                }
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response_1['response'] = array();
        }

        return $response;
        $count = 0;


        /*  $clg_id = explode(",", $clg_id);
          $clgid = array();
          foreach ($clg_id as $key => $clg) {
          $clgid[] = $clg;
          }

          if ($r_id != 1) {
          $this->db->where_in('i.clg_id', $clgid);
          }
         */


        $per_data = explode(",", $arr_attr['permisions']);
        foreach ($response_1['response'] as $key => $m_id) {
            //$m_id['id'];
            //  foreach ($per_data as $key => $per_id)
            //	{ 
            if (in_array($m_id['id'], $per_data)) { // if ( is_array($m_id['id']) )//  if ( $per_id == $m_id['id'] )
                $result['id'] = $m_id['id'];
                $result['name'] = $m_id['name'];
                $result['checked'] = 1;
                $response['response'][] = $result;
            } else {  // if ( $per_id != $m_id['id'] )
                $result['id'] = $m_id['id'];
                $result['name'] = $m_id['name'];
                $result['checked'] = 2;
                $response['response'][] = $result;
            }


            //	 }
        }
        // print_r($response['response']); 	 exit;
        //$final=	array_merge($response_1['response'], $response['response']);
        //	$final=	array_unique($final);
        //  print_r($final);  exit;
    }

    function document_list_all_tabs($attr)
    {
        $limit_clause = $where_clause = "";

        $response = array();
        $response2 = array();

        if (!empty($attr['item_id']))
            $where_clause .= " AND psp.item_id = '$attr[item_id]' ";
        if (!empty($attr['supp_id']))
            $where_clause .= " AND psp.sale_id = '$attr[supp_id]' ";

        //if(!empty($attr[module_id]))	$where_clause2 .= "AND ri.module_id='".$attr[module_id]."' ";
        //if(!empty($attr[employee_id]))	$where_clause2 .= "AND ri.row_id='".$attr[employee_id]."' ";
        //if(!empty($attr[subtype]))	$where_clause2 .= "AND ri.sub_type='".$attr[subtype]."' ";

        if (!empty($attr['module_id']))
            $where_clause2 .= " AND ( ri.row_id=" . $attr[employee_id] . " AND   ri.module_id = '$attr[module_id]') ";
        else
            $where_clause2 .= " AND  ri.row_id=" . $attr[employee_id] . "  ";


        if (!empty($attr[tab_ids])) {
            $pieces = explode(",", $attr[tab_ids]);
            foreach ($pieces as $key => $value) {
                if ($value)
                    $tab_ids .= "'" . $value . "'" . ',';
            }
            $tab_ids = substr($tab_ids, 0, -1);

            if (!empty($attr[tab_ids]))
                $where_clause2 .= "AND ri.tab_id in ( " . $tab_ids . ") ";
            else {
                $response['response'][] = array();
                return $response;
                exit;
            }
        }


         $Sql = "SELECT  ri.id,ri.title,ri.document_code,ri.name,(SELECT df.title FROM document df where df.id=ri.folder_id and df.type=1  limit 1)as fname , (select st.name from opp_cycle_tabs st where st.id=ri.tab_id  and st.company_id=" . $this->arrUser['company_id'] . " limit 1 ) as stagename   ,ref.name as tname FROM document ri 	left JOIN company on company.id=ri.company_id  left JOIN ref_module as ref on ref.id=ri.tab_id  	WHERE ri.status=1  AND ri.type=2  AND (ri.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") " . $where_clause2 . " "; //AND (ri.module_id=".$module_id." or  ri.row_id=".$employee_id."or  ri.sub_type=".$sub_type.")
        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ri');
      //  echo $response['q'];  exit;

        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                //	$result['code'] = $Row['document_code'];
                $result['name'] = $Row['title'];
                //$result['folder_name'] = $Row['fname'];
                $result['stage '] = $Row['stagename'];
                // $result['Tab '] = $Row['tname'];
                $result['image'] = $Row['name'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_documents_all_list($attr)
    {
        $limit_clause = $where_clause = "";

        $response = array();
        $response2 = array();


        if (!empty($attr['item_id']))
            $where_clause .= " AND psp.item_id = '$attr[item_id]' ";
        if (!empty($attr['supp_id']))
            $where_clause .= " AND psp.sale_id = '$attr[supp_id]' ";


        if (!empty($attr['module_id']))
            $where_clause2 .= " AND ( ri.row_id=" . $attr[employee_id] . " AND   ri.module_id = '$attr[module_id]') ";
        else
            $where_clause2 .= " AND  ri.row_id=" . $attr[employee_id] . "  ";

        if (!empty($attr[tab_id]))
            $where_clause2 .= "AND ri.tab_id='" . $attr[tab_id] . "' ";


        if (!empty($attr[subtype]))
            $where_clause2 .= "AND ri.sub_type='" . $attr[subtype] . "' ";


        $Sql = "SELECT  ri.id,ri.title,ri.document_code,ri.name,(SELECT df.title FROM document df where df.id=ri.folder_id and df.type=1  limit 1)as fname  ,(select st.name from opp_cycle_tabs st where st.id=ri.tab_id   limit 1 ) as stagename,ref.name as tname FROM document ri left JOIN company on company.id=ri.company_id 
		left JOIN ref_module as ref on ref.id=ri.tab_id  WHERE ri.status=1  AND ri.type=2  AND (ri.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		" . $where_clause2 . "
		"; //AND (ri.module_id=".$module_id." or  ri.row_id=".$employee_id."or  ri.sub_type=".$sub_type.")	
        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ri');
        // echo $response['q']);exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                //	$result['code'] = $Row['document_code'];
                $result['name'] = $Row['title'];
                $result['stage '] = $Row['stagename'];
                //$result['folder_name'] = $Row['fname']; 
                // $result['Tab '] = $Row['tname'];
                $result['image'] = $Row['name'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function doc_code($attr)
    {

        $moduleId = "";
        $employeeId = "";
        if (isset($attr['module_id']) && $attr['module_id'] != '') {
            $moduleId = "ef.module_id  ='" . $attr['module_id'] . "' and";
        }
        if (isset($attr['employee_id']) && $attr['employee_id'] != '') {
            $employeeId = "ef.row_id  ='" . $attr['employee_id'] . "' and";
        }
        $sql_total = "SELECT max(ef.id) as count	 
		FROM document ef
		LEFT JOIN company ON company.id = ef.company_id
		WHERE ef.status=1 and  ef.type=2 and $employeeId $moduleId
		(ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	
		Limit 1 ";
        $srm = $this->objsetup->CSI($sql_total)->FetchRow();
        $nubmer = $srm['count'];
        if ($attr['is_increment'] == 1 || $nubmer == '')
            $nubmer++;

        $response['response']['code'] = 'DOC' . $this->objGeneral->module_item_prefix($nubmer);
        return $response;
    }

    function get_document_id($attr)
    {


        $Sql = "SELECT * FROM document WHERE id=".$attr['id']." and status=1 LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $result = array();

            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['id'];
                $result['document_code'] = $Row['document_code'];
                $result['title'] = $Row['title'];
                $result['folder_id'] = $Row['folder_id'];
                $result['FileType'] = $Row['FileType'];
                $result['image_paths'] = $Row['name'];

                $response['response'] = $result;
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        //[{"ack":1,"FileType":"jpg","image_number":1,"response":"1832154929.jpg"}]


        $result2['ack'] = 1;
        $result2['FileType'] = $result['FileType'];
        $result2['image_number'] = 1;
        $result2['response'] = $result['image_paths'];
        $response['response2'][] = $result2;

        //print_r($response);
        return $response;
    }

    function update_documents($arr_attr)
    {

        //print_r($arr_attr);exit;

        $company_id = $this->arrUser['company_id'];
        $doc_id = $arr_attr[document_id];
        $row_id = $arr_attr[employee_id];
        $module_id = $arr_attr[module_id];
        $subtype = $arr_attr[subtype];

        $new = 'Edit';
        $new_msg = 'Record Updated Successfully';

        $Sql = "UPDATE document SET  status=0 WHERE id = " . $doc_id . " 	Limit 1";
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0)
            $msg = 'Updated';
        else
            $msg = 'Inserted';

        $Sql = "INSERT INTO document ( name,FileType,primary_flag,title, document_code, folder_id,	 type,status,   company_id, user_id,  create_date ,row_id,module_id,sub_type,tab_id) VALUES ";
        foreach ($arr_attr[fileName1] as $keys => $first) {
            $Sql .= "(  '" . $first->response . "', '" . $first->FileType . "', '" . $count . "', '" . $arr_attr[document_title] . "', " . "'" . $arr_attr[document_code] . "'	," . "'" . $arr_attr[folder_ids] . "',2,1,'" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "','" . current_date . "' ,'" . $row_id . "','" . $module_id . "','" . $subtype . "' ,'" . $arr_attr[tab_id] . "' ), ";
        }
        $Sqls = substr_replace(substr($Sql, 0, -1), "", -1);
        // $Sqls= substr($Sqls, 0, -1);
        //   echo  $Sqls; exit;
        $RSProducts = $this->objsetup->CSI($Sqls);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['msg'] = $msg;
            $response['info'] = $msg;
            $response['error'] = NULL;
            $response['tab_change'] = $tab_change;
        } else {
            $response['ack'] = 0;
            $response['error'] = "Record is Not $msg ";
            $response['msg'] = $message;
        }

        return $response;
    }

    function update_documents_single($arr_attr)
    {

        foreach ($input as $key => $val) {
            $converted_array[$key] = $val;
            if ($key == "id") {
                $employee_id = $val;
            }
        }

        $company_id = $this->arrUser['company_id'];
        $doc_id = $arr_attr->document_id;
        if (!empty($arr_attr->id))
            $employee_id = $arr_attr->id;
        if (!empty($arr_attr->employee_id))
            $employee_id = $arr_attr->employee_id;

        $moduleId = "";
        $employeeId = "";
        if (isset($arr_attr->module_id) && $arr_attr->module_id != '')
            $moduleId = ",module_id='" . $arr_attr->module_id . "'";
        if (isset($employee_id) && $employee_id != '')
            $employeeId = ",row_id='" . $employee_id . "' ";

        $new = 'Edit';
        $new_msg = 'Record Updated Successfully';
        $tab_change = 'tab_doc';


        if ($doc_id == 0) {


            // Insert record into the document
            $Sql = "INSERT INTO document SET 
								title='" . $arr_attr->document_title . "'
								,name='" . $arr_attr->document_path . "' 
								,document_code='" . $arr_attr->document_code . "'
								 ,folder_id='" . $arr_attr->folder_ids . "' 
								,FileType='" . $arr_attr->FileType . "'
									tab_id='" . $arr_attr->tab_id . "'
								,type=2,status=1
								$employeeId
								 $moduleId
								,company_id='" . $this->arrUser['company_id'] . "'
								,user_id='" . $this->arrUser['id'] . "',
								create_date='" . current_date . "'
								
								,AddedBy='" . $this->arrUser['id'] . "'
								,AddedOn='" . current_date . "'";

            $response = $this->objGeneral->run_query_exception($Sql);
            $new_msg = 'Record Inserted Successfully';
            $new = 'Add';

            $response['msg'] = $new_msg;
            $response['info'] = $new;
            return $response;
        } else {

            $Sql = "UPDATE document SET  
					status=1 WHERE id = " . $doc_id . " 
					Limit 1";
            $RS = $this->objsetup->CSI($Sql);
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = $new_msg;
            $response['info'] = $new;
            $response['tab_change'] = $tab_change;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
            $response['msg'] = $message;
        }
        return $response;
    }

    function get_documents_folder_list($attr, $p)
    {


        $Sql = "SELECT c.id, c.title  as name,  c.folder_id  as parent_id,c.create_date
		 ,(SELECT df.first_name FROM employees df where df.id=c.user_id   limit 1) as creater 
		FROM  document  c 
		left JOIN company on company.id=c.company_id 
		where c.type=1  and c.module_id='$attr[module_id]'  and   c.status=1  and  
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	 
		 "; //and  c.parent_id=0 and //c.id  != 7 and  

        $order_type = "";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = ucwords($Row['name']);
                $result['parent_id'] = $Row['parent_id'];
                $result['creater'] = $Row['creater'];
                $result['date_created'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);

                if ($Row['parent_id'] == 0)
                    $response['response_parent'][] = $result;
                else
                    $response['response_child'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }

        if ($p == 0) {
            $response['response'] = $response['response_parent'];
            return $response;
            exit;
        }
        //$response['response'] =  $this->page_walk($response['response_parent']);
        //$response['response'] =  $this->_generate_prod_array($response['response_parent']);
        if (count($response['response_parent'])) {
            foreach ($response['response_parent'] as $key => $value) {

                $result['id'] = $value['id'];
                $result['name'] = $value['name'];
                $result['parent_id'] = $value['parent_id'];
                $result['creater'] = $value['creater'];
                $response['response'][] = $result;

                // $response['response'][] =  $this->recurcise_child($response['response_child'],$value['id']);

                foreach ($response['response_child'] as $key2 => $value_2) {

                    if ($value_2['parent_id'] == $value['id']) {
                        $result['id'] = $value_2['id'];
                        $result['name'] = "   - " . $value_2['name'];
                        $result['parent_id'] = $value_2['parent_id'];
                        $result['creater'] = $value_2['creater'];
                        $response['response'][] = $result;

                        foreach ($response['response_child'] as $key2 => $value_3) {

                            if ($value_3['parent_id'] == $value_2['id']) {
                                $result['id'] = $value_3['id']; //"  --".$value_3['name']; 
                                $result['name'] = "		- - " . $value_3['name']; // str_pad($value_3['name'],5,".");
                                $result['parent_id'] = $value_3['parent_id'];
                                $result['creater'] = $value_3['creater'];
                                $response['response'][] = $result;

                                foreach ($response['response_child'] as $key2 => $value_4) {

                                    if ($value_4['parent_id'] == $value_3['id']) {
                                        $result['id'] = $value_4['id']; //"  --".$value_3['name']; 
                                        $result['name'] = "		- - - " . $value_4['name']; // str_pad($value_3['name'],5,".");
                                        $result['parent_id'] = $value_4['parent_id'];
                                        $result['creater'] = $value_4['creater'];
                                        $response['response'][] = $result;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return $response;
    }

    function add_document_folder($attr)
    {
        $data_pass = " tst.module_id='" . $attr['module_id'] . "' and tst.title='" . $attr['name'] . "'  ";
        $total = $this->objGeneral->count_duplicate_in_sql('document', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }
        $Sql = "SELECT count(c.id)  as total	 FROM  document  c  left JOIN company on company.id=c.company_id  where c.type=1 AND c.status=1  AND c.folder_id='" . $folder_id . "'   AND (c.company_id=" . $this->arrUser['company_id'] . " or   company.parent_id=" . $this->arrUser['company_id'] . ")	  limit 5";
        //echo $Sql;exit;
        if (!empty($attr['folder_ids'])) {
            $rs_count = $this->objsetup->CSI($sql);

            if ($rs_count->fields['total'] > 0) {
                $response['ack'] = 0;
                $response['error'] = 'Maximum Limit is 3!';
                return $response;
                exits;
            }
        }


        if (!empty($attr['main_module_doc']))
            $add = " ,main_module_doc='" . $attr['main_module_doc'] . "' ";
        $Sql = "INSERT INTO document
			SET  
			title='" . $attr['name'] . "'	
			,module_id='" . $attr['module_id'] . "'
			,folder_id='" . $folder_id . "' 
			,type=1,status=1
			,company_id='" . $this->arrUser['company_id'] . "'
			,user_id='" . $this->arrUser['id'] . "'
			,create_date='" . current_date . "'
			$add ";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
            $response['error'] = 'Record  Inserted.';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record  Not  Inserted!';
        }
        return $response;
    }

    function edit_document_folder($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        if ($folder_id > 0)
            $where_id = " AND tst.id <> '$attr[folder_ids]' ";

        $data_pass = "   and tst.title='" . $attr['name'] . "'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('document', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE  documentSET   title='" . $attr['name'] . "'	 WHERE id = $attr[folder_ids] Limit 1 ";
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function recurcise_child($array, $parent_id)
    {

        foreach ($array as $key2 => $value_2) {
            if ($value_2['parent_id'] == $parent_id) {

                $result['id'] = $value_2['id'];
                $result['name'] = "   -" . $value_2['name'];
                $result['parent_id'] = $value_2['parent_id'];
                $response['response'][] = $result;

                //	 $response['response'][] =  $this->recurcise_child($array,$value_2['id']);
            }
        }

        return $response;
    }

    function get_documents_folder_list_pre($attr, $p)
    {

        //$this->objGeneral->mysql_clean($arr_attr);
        //echo $p;

        /* if($p==1)
          {
          $Sql = "SELECT c.id, c.name
          FROM  employee_folder  c
          left JOIN company on company.id=c.company_id
          where c.id  != 7 and   c.status=1 and
          (c.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")
          order by c.id DESC " ;

          }
          else
          {

          $Sql = "SELECT c.id, c.name
          FROM  employee_folder  c
          left JOIN company on company.id=c.company_id
          where  c.status=1 and
          (c.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")
          order by c.id DESC " ;

          }
          $RS = $this->objsetup->CSI($Sql);

          //echo $Sql;

          $response['ack'] = 1;
          $response['error'] = NULL;
          if($RS->RecordCount()>0){
          $result = array();
          while($Row = $RS->FetchRow()){
          $result['id'] = $Row['id'];
          $result['name'] = $Row['name'];
          $response['response'][] = $result;
          }
          }
          else{
          $response['response'] = array();
          }

         */


        $Sql = "SELECT c.id, c.name ,  c.parent_id
		FROM  employee_folder  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1  and  c.parent_id=0 and  
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	 
		 "; //and  c.parent_id=0 and //c.id  != 7 and  

        $order_type = "";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['parent_id'] = $Row['parent_id'];
                $response['response_parent'][] = $result;
            }
        }


        $Sql_child = "SELECT c.id, c.name ,  c.parent_id  FROM  employee_folder  c 
		left JOIN company on company.id=c.company_id  	where c.id  != 7 and   c.status=1 and  c.parent_id>0 and
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	 

		  ";
        $order_type = "";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql_child, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RSc = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RSc->RecordCount() > 0) {
            $result = array();
            while ($Row = $RSc->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['parent_id'] = $Row['parent_id'];
                $response['response_child'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        }


        /* $response['response'] =  $this->page_walk($response['response_parent']);
          $response['response'] =  $this->_generate_prod_array($response['response_parent']);

          print_r($response['response']);
          exit; */


        foreach ($response['response_parent'] as $key => $value) {

            $result['id'] = $value['id'];
            $result['name'] = $value['name'];
            $result['parent_id'] = $value['parent_id'];
            $response['response'][] = $result;


            /* $Sql_child = "SELECT c.id, c.name ,  c.parent_id 
              FROM  employee_folder  c
              where    c.status=1 and  c.parent_id =".$value['id']."
              order by c.id DESC " ;
              $RSc = $this->objsetup->CSI($Sql_child);

              if($RSc->RecordCount()>0){
              $result = array();
              while($Row = $RSc->FetchRow()){
              $result['id'] = $Row['id'];
              $result['name'] =   '-'.$Row['Row'];
              $result['parent_id'] = $Row['parent_id'];
              $response['response'][] = $result;
              }
              } */

            foreach ($response['response_child'] as $key2 => $value_2) {
                //while($Row = $response['response_child']) 

                if ($value_2['parent_id'] == $value['id']) {

                    $result['id'] = $value_2['id'];
                    $result['name'] = '-' . $value_2['name'];
                    $result['parent_id'] = $value_2['parent_id'];
                    $response['response'][] = $result;
                }
            }
        }

        return $response;
    }

    function document_parent_child_folder($attr)
    {

        $Sql = "SELECT c.id, c.name ,  c.parent_id 
		FROM  employee_folder  c 
		left JOIN company on company.id=c.company_id 
		where  c.status=1  and   c.parent_id=0 and
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	 
		 "; //and  c.parent_id=0 and //c.id  != 7 and  
        $order_type = "";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['parent_id'] = $Row['parent_id'];
                $response['response_parent'][] = $result;
            }
        }


        $Sql_child = "SELECT c.id, c.name ,  c.parent_id 
		FROM  employee_folder  c 
		left JOIN company on company.id=c.company_id 
		where c.id  != 7 and   c.status=1 and  c.parent_id>0 and
	(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	 
		  ";
        $order_type = "";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql_child, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RSc = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RSc->RecordCount() > 0) {
            $result = array();
            while ($Row = $RSc->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['parent_id'] = $Row['parent_id'];
                $response['response_child'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        }


        foreach ($response['response_parent'] as $key => $value) {

            $result['id'] = $value['id'];
            $result['name'] = $value['name'];
            $result['parent_id'] = $value['parent_id'];
            $response['response'][] = $result;


            foreach ($response['response_child'] as $key2 => $value_2) {
                //while($Row = $response['response_child']) 

                if ($value_2['parent_id'] == $value['id']) {

                    $result['id'] = $Row['id'];
                    $result['name'] = '-' . $value_2['name'];
                    $result['parent_id'] = $value_2['parent_id'];
                    $response['response'][] = $result;
                }
            }
        }

        return $response;
    }

    function page_walk($array, $parent_id = FALSE)
    {
        $organized_pages = array();

        $children = array();

        foreach ($array as $index => $page) {
            if ($page['parent_id'] == 0) { // No, just spit it out and you're done
                $organized_pages[$index] = $page;
                // print_r ($page['id']);
                /* $organized_pages['id'] = $page['id'];
                  $organized_pages['name'] = $page['name'];
                  $organized_pages['parent_id'] = $page['parent_id'];
                 */
            } else { // If it does, 
                $organized_pages[$parent_id]['children'][$page['id']] = $this->page_walk($page, $parent_id);
            }
        }

        return $organized_pages;
    }

    function _generate_prod_array($arr_prod, $parent = 0)
    {
        $products = array();
        foreach ($arr_prod as $product) {
            if (trim($product['parent_id']) == trim($parent)) {
                $product['sub'] = isset($product['sub']) ? $product['sub'] : $this->_generate_prod_array($arr_prod, $product['id']);
                $products[] = $product;
                // echo'<pre>'; print_r($products); echo'</pre>';exit;
            }
        }
        return $products;
    }

    function get_select_result()
    {


        $Sql = "SELECT * FROM employee_expenses_detail ee  where  ee.id='".$attr['id']."'	and status=1
		LIMIT 1 ";
        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;

        //set selected country id from POST
        $id = $this->input->post('id', TRUE);


        $data['show_list'] = $this->common_model->getcity($id);
        $selected = 'selected="selected"';
        $output = null;
        ?>
        <option value="">Select...</option>
        <?php
        foreach ($data['show_list'] as $row) {
            $output .= "<option value='" . $row['id'] . "'>" . $row['name'] . "</option>";
        }
        echo $output;
        ?>
        <?php
    }

    ############	Start: Images   ######

    function get_images_all_list($attr)
    {
        return; // removing table ref_image from db as it is not being used

        $limit_clause = $where_clause = "";

        //$type = (isset($attr['type'])) ? $attr['type'] : 1;
        // $item_id = (isset($attr['item_id'])) ? $attr['item_id'] : 1;
        $response = array();
        $response2 = array();

        if (!empty($attr['keyword']))
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";

        if (!empty($attr['item_id']))
            $where_clause .= " AND psp.item_id = '$attr[item_id]' ";
        if (!empty($attr['supp_id']))
            $where_clause .= " AND psp.sale_id = '$attr[supp_id]' ";


        if (!empty($attr['module_id']))
            $where_clause2 .= " AND ( ri.row_id=" . $attr[row_id] . " AND   ri.module_id = '$attr[module_id]') ";
        else
            $where_clause2 .= " AND  ri.row_id=" . $attr[row_id] . "  ";


        $Sql = "SELECT  ri.id,ri.title,ri.document_code,ri.name,ri.default_flag,(SELECT df.title FROM ref_image df where df.id=ri.folder_id and df.type=1 )as fname
		FROM ref_image ri
		left JOIN company on company.id=ri.company_id 
		WHERE ri.status=1  and ri.type=2 
		and (ri.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		" . $where_clause2 . " 
		";
        //defualt Variable
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'ri');
        //echo $response['q'];exit;		
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['document_code'];
                $result['name'] = $Row['title'];
                $result['folder_name'] = $Row['fname'];
                $result['image'] = $Row['name'];
                $result['df'] = $Row['default_flag'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function get_image_by_id($attr)
    {
        return; // removing table ref_image from db as it is not being used

        $Sql = "SELECT * FROM ref_image WHERE id=".$attr['id']." and status=1 LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $result = array();

            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['id'];
                $result['document_code'] = $Row['document_code'];
                $result['title'] = $Row['title'];
                $result['folder_id'] = $Row['folder_id'];
                $result['FileType'] = $Row['FileType'];
                $result['image_paths'] = $Row['name'];

                $response['response'] = $result;
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        $result2['ack'] = 1;
        $result2['FileType'] = $result['FileType'];
        $result2['image_number'] = 1;
        $result2['response'] = $result['image_paths'];
        $response['response2'][] = $result2;

        //print_r($response);
        return $response;
    }

    function get_image_code($attr)
    {
        return; // removing table ref_image from db as it is not being used
        $moduleId = "";
        $employeeId = "";
        if (isset($attr['module_id']) && $attr['module_id'] != '')
            $moduleId = "AND ef.module_id  ='" . $attr['module_id'] . "' ";
        if (isset($attr['row_id']) && $attr['row_id'] != '')
            $row_id = "AND ef.row_id  ='" . $attr['row_id'] . "' ";

        $sql = "SELECT max(ef.id) as count	 
		FROM ref_image ef
		LEFT JOIN company ON company.id = ef.company_id
		WHERE ef.status=1 AND  ef.type=2 
		AND(ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	
		$row_id
		$moduleId
		";
        //	echo $sql_total;exit;
        $srm = $this->objsetup->CSI($sql)->FetchRow();

        $nubmer = $srm['count'];
        if ($attr['is_increment'] == 1 || $nubmer == '')
            $nubmer++;

        $response['response']['code'] = 'IMG' . $this->objGeneral->module_item_prefix($nubmer);
        return $response;
    }

    function update_image($arr_attr)
    {
        return; // removing table ref_image from db as it is not being used
        $company_id = $this->arrUser['company_id'];
        $doc_id = ".$arr_attr['id'].";
        $row_id = $arr_attr[row_id];
        $module_id = $arr_attr[module_id];
        $new = 'Edit';
        $new_msg = 'Record Updated Successfully';

        $Sql = "UPDATE ref_image SET  status=0 WHERE id = " . $doc_id . " 	Limit 1";
        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0)
            $msg = 'Updated';
        else
            $msg = 'Inserted';

        $Sql = "INSERT INTO ref_image ( name,FileType,primary_flag,title, document_code, folder_id,type,status, company_id, user_id,  create_date ,row_id,module_id,default_flag) VALUES ";

        foreach ($arr_attr[fileName1] as $keys => $first) {

            $Sql .= "(  '" . $first->response . "', '" . $first->FileType . "', '" . $count . "', '" . $arr_attr[document_title] . "', " . "'" . $arr_attr[document_code] . "'	," . "'" . $arr_attr[folder_ids] . "',2,1,'" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "','" . current_date . "' ,'" . $row_id . "','" . $module_id . "',0 ) , ";
        }


        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        //echo  $Sql; exit;
        $RSProducts = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            //	if ($doc_id>0)  
            $response['ack'] = 1;
            $response['msg'] = $msg;
            $response['info'] = $msg;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = "Record is Not $msg";
        }

        return $response;
    }

    function get_image_folder_list($attr, $p)
    {
        return; // removing table ref_image from db as it is not being used

        $Sql = "SELECT c.id, c.title  as name,  c.folder_id  as parent_id
		FROM  ref_image  c 
		left JOIN company on company.id=c.company_id 
		where c.type=1  and c.module_id='$attr[module_id]'  and   c.status=1  and  
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	 
		  "; //and  c.parent_id=0 and //c.id  != 7 and  
        $order_type = "";
        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        if ($RS->RecordCount() > 0) {
            $result = array();
            while ($Row = $RS->FetchRow()) {

                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['parent_id'] = $Row['parent_id'];

                if ($Row['parent_id'] == 0)
                    $response['response_parent'][] = $result;
                else
                    $response['response_child'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = NULL;
        }

        foreach ($response['response_parent'] as $key => $value) {

            $result['id'] = $value['id'];
            $result['name'] = $value['name'];
            $result['parent_id'] = $value['parent_id'];
            $response['response'][] = $result;

            // $response['response'][] =  $this->recurcise_child($response['response_child'],$value['id']);

            foreach ($response['response_child'] as $key2 => $value_2) {

                if ($value_2['parent_id'] == $value['id']) {
                    $result['id'] = $value_2['id'];
                    $result['name'] = "   - " . $value_2['name'];
                    $result['parent_id'] = $value_2['parent_id'];
                    $response['response'][] = $result;

                    foreach ($response['response_child'] as $key2 => $value_3) {

                        if ($value_3['parent_id'] == $value_2['id']) {
                            $result['id'] = $value_3['id']; //"  --".$value_3['name']; 
                            $result['name'] = "		- - " . $value_3['name']; // str_pad($value_3['name'],5,".");
                            $result['parent_id'] = $value_3['parent_id'];
                            $response['response'][] = $result;

                            foreach ($response['response_child'] as $key2 => $value_4) {

                                if ($value_4['parent_id'] == $value_3['id']) {
                                    $result['id'] = $value_4['id']; //"  --".$value_3['name']; 
                                    $result['name'] = "		- - - " . $value_4['name']; // str_pad($value_3['name'],5,".");
                                    $result['parent_id'] = $value_4['parent_id'];
                                    $response['response'][] = $result;
                                }
                            }
                        }
                    }
                }
            }
        }

        return $response;
    }

    function add_image_folder($attr)
    {
        return; // removing table ref_image from db as it is not being used
        // echo $attr['folder_id']->id;
        $total = 0;
        if (!empty($attr['folder_ids']))
            $folder_id = $attr['folder_ids'];
        else
            $folder_id = 0;

        if ($folder_id != 0) {

            $sql = "SELECT  count(id)  as total FROM ref_image	 WHERE   folder_id='" . $folder_id . "'	and  company_id='" . $this->arrUser['company_id'] . "' limit 5";
            $rs_count = $this->objsetup->CSI($sql);
            $total2 = $rs_count->fields['total'];

            if ($total2 > 0) {
                $response['ack'] = 0;
                $response['error'] = 'Maximum Limit is 3!';
            }
        }


        if ($folder_id > 0)
            $where_id = " AND tst.id <> '$attr[folder_ids]' ";

        $data_pass = "   tst.module_id='" . $attr['module_id'] . "' and tst.title='" . $attr['name'] . "'  and tst.folder_id='" . $folder_id . "'   ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_image', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }


        if ($total == 0) {
            $Sql = "INSERT INTO ref_image
				SET  
				title='" . $attr['name'] . "'	 ,module_id='" . $attr['module_id'] . "'
				,folder_id='" . $folder_id . "'  	,type=1,status=1 ,company_id='" . $this->arrUser['company_id'] . "'
				,user_id='" . $this->arrUser['id'] . "'";

            $RS = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        }


        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
            $response['error'] = "Record  Inserted";
        }

        return $response;
    }

    function edit_image_folder($attr)
    {
        return; // removing table ref_image from db as it is not being used
        $this->objGeneral->mysql_clean($attr);

        if ($folder_id > 0)
            $where_id = " AND tst.id <> '$attr[folder_ids]' ";

        $data_pass = "      tst.title='" . $attr['name'] . "'     ";
        $total = $this->objGeneral->count_duplicate_in_sql('ref_image', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        $Sql = "UPDATE  ref_image SET  title='" . $attr['name'] . "'	 WHERE id = $attr[folder_ids] Limit 1 ";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        //if($id > 0){
        $response['ack'] = 1;
        //$response['id'] = $id;
        $response['error'] = NULL;
        //}

        return $response;
    }

    ############	Start: comments   ######

    function get_comment_listings($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $where_type_clause = "";
        if ($attr['module_name'] == 'crm' || $attr['module_name'] == 'crm_retailer'){
            $attr['sub_type'] = 4;
            $responseModule = "CRM/Customer";
            $where_type_clause .= " AND module_name LIKE 'CRM%' ";

            /* $subQuery = "SELECT  c.id
                         FROM sr_crm_listing  c 
                         WHERE c.type IN (1,2) AND 
                               c.company_id=" . $this->arrUser['company_id'] . " ";

            $subQuery = $this->objsetup->whereClauseAppender($subQuery,40); */
        }
        /* elseif ($attr['module_name'] == 'crm_retailer'){
            $attr['sub_type'] = 4;
            $responseModule = "CRM/Customer";
            $where_type_clause .= " AND module_name LIKE 'CRM%' ";
            $subQuery = "SELECT  c.id
                from sr_crm_listing  c 
                where  c.type IN (4) and c.company_id=" . $this->arrUser['company_id'] . " ";
            $subQuery = $this->objsetup->whereClauseAppender($subQuery,40);
        } */
        else if ($attr['module_name'] == 'sales'){
            $module_type = 1;
            $where_type_clause .= " AND module_name LIKE '%Sales%' ";

            /* $subQuery = "SELECT orderscache.id 
                         FROM orderscache 
                         WHERE sell_to_cust_id IN (SELECT c.id
                                                FROM sr_crm_listing  c 
                                                WHERE  c.type IN (2,3) and 
                                                    c.company_id=" . $this->arrUser['company_id'] . " "; 

            //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48);
            $subQuery .= " )"; */
        }
        else if ($attr['module_name'] == 'credit_note'){
            // $module_type = 1;
            $where_type_clause .= "  AND module_name LIKE '%Credit Note%' ";

            /* $subQuery = "SELECT return_orders.id 
                         FROM return_orders 
                         WHERE sell_to_cust_id IN (SELECT c.id
                                                FROM sr_crm_listing  c 
                                                WHERE  c.type IN (2,3) and 
                                                    c.company_id=" . $this->arrUser['company_id'] . "  "; 
            //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48);
            $subQuery .= " )"; */
        }
        if ($attr['module_name'] == 'warehouse'){
            $attr['sub_type'] = 5;
            $responseModule = "Warehouse";
            $where_type_clause .= " AND module_name LIKE 'Warehouse%' ";

            $subQuery = "SELECT  w.id
                        FROM warehouse as w 
                        WHERE   w.status <> -1 AND
                                (w.company_id=" . $this->arrUser['company_id'] . " ) "; 
        }
        if ($attr['module_name'] == 'srm'){
            $attr['sub_type']  = 3;
            $responseModule = "SRM/Supplier";
            $where_type_clause .= " AND module_name LIKE 'SRM%' ";

            /* $subQuery = "SELECT  s.id
                        FROM sr_srm_general_sel as s 
                        WHERE   s.type IN (1,2) and s.status <> -1 AND
                                (s.company_id=" . $this->arrUser['company_id'] . " ) ";
            //$subQuery = $this->objsetup->whereClauseAppender($subQuery,18); */
        }
        if ($attr['module_name'] == 'customer'){
            $attr['sub_type']  = 4;
            $responseModule = "CRM/Customer";
            $where_type_clause .= " AND (module_name LIKE 'Customer' OR module_name LIKE 'CRM') ";

            /* $subQuery = "SELECT  c.id
                        from sr_crm_listing  c 
                        where  c.type IN (2,3) "; 
            //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48); */
        }
        if ($attr['module_name'] == 'supplier'){
            $attr['sub_type']  = 3;
            $responseModule = "SRM/Supplier";
            $where_type_clause .= " AND (module_name LIKE 'Supplier' OR module_name LIKE 'SRM') ";

            /* $subQuery = "SELECT  s.id
                        FROM sr_srm_general_sel as s 
                        WHERE   s.type IN (2,3) and s.status <> -1 AND 
                                (s.company_id=" . $this->arrUser['company_id'] . " ) ";
            //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24); */
        }
        else if ($attr['module_name'] == 'purchase'){
            // $module_type = 1;
            $where_type_clause .= "  AND module_name LIKE '%purchase%' ";
            /* $subQuery = "SELECT srm_invoice.id FROM srm_invoice WHERE sell_to_cust_id IN (SELECT  s.id
                        FROM sr_srm_general_sel as s 
                        WHERE   s.type IN (2,3) AND 
                                s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
            $subQuery .= " )"; */
        }
        else if ($attr['module_name'] == 'debit_note'){
            // $module_type = 1;
            $where_type_clause .= "  AND module_name LIKE '%Debit Note%' ";
            /* $subQuery = "SELECT srm_order_return.id FROM srm_order_return WHERE supplierID IN (SELECT  s.id
                        FROM sr_srm_general_sel as s 
                        WHERE   s.type IN (2,3) AND 
                                s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
            $subQuery .= " )"; */
        }
        
        if ($attr['module_name'] == 'hr'){
            $attr['sub_type']  = 1;
            $responseModule = "HR";
            $where_type_clause .= " AND module_name LIKE 'HR' ";
            $subQuery = "SELECT  e.id
                        FROM employees as e 
                        WHERE   e.status <> -1 AND
                                (e.company_id=" . $this->arrUser['company_id'] . " ) ";
        }
        if ($attr['module_name'] == 'items'){
            $attr['sub_type']  = 2;
            $responseModule = "Items";
            $where_type_clause .= " AND module_name LIKE 'Items' ";
            /* $subQuery = "SELECT  prd.id
                FROM productcache as prd 
                WHERE   prd.status <> -1 AND
                        (prd.company_id=" . $this->arrUser['company_id'] . " ) ";
            //$subQuery = $this->objsetup->whereClauseAppender($subQuery,11); */
        }
        if ($attr['module_name']){
            if ($attr['record_id']){
                $attr['row_id'] = $attr['record_id'];
            }
        }

        if (empty($attr['module_name'])){
            /* 
            $crmSubQuery = "SELECT  c.id
                            FROM sr_crm_listing  c 
                            WHERE  c.type IN (1,2) and 
                                   c.company_id=" . $this->arrUser['company_id'] . " "; 

            //$crmSubQuery = $this->objsetup->whereClauseAppender($crmSubQuery,40);
            
            $saleSubQuery = "SELECT orderscache.id
                            FROM orderscache WHERE sell_to_cust_id IN (SELECt c.id
                            from sr_crm_listing  c 
                            where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  "; 
            //$saleSubQuery = $this->objsetup->whereClauseAppender($saleSubQuery,48);
            $saleSubQuery .= " )";

            $creditNoteSubQuery = "SELECT return_orders.id 
                                   FROM return_orders 
                                   WHERE sell_to_cust_id IN (SELECT c.id
                                                        FROM sr_crm_listing  c 
                                                        WHERE  c.type IN (2,3) and 
                                                            c.company_id=" . $this->arrUser['company_id'] . "  "; 
            //$creditNoteSubQuery = $this->objsetup->whereClauseAppender($creditNoteSubQuery,48);
            $creditNoteSubQuery .= " )";

            $srmSubQuery = "SELECT  s.id
                            FROM sr_srm_general_sel as s 
                            WHERE   s.type IN (1,2) and s.status <> -1 AND
                                    (s.company_id=" . $this->arrUser['company_id'] . " ) ";
            //$srmSubQuery = $this->objsetup->whereClauseAppender($srmSubQuery,18);

            $custSubQuery = "SELECT  c.id
                            from sr_crm_listing  c 
                            where  c.type IN (2,3) "; 
            //$custSubQuery = $this->objsetup->whereClauseAppender($custSubQuery,48);

            $itemSubQuery = "SELECT  prd.id
                            FROM productcache as prd 
                            WHERE  prd.status <> -1 and
                                    (prd.company_id=" . $this->arrUser['company_id'] . " ) ";
            //$itemSubQuery = $this->objsetup->whereClauseAppender($itemSubQuery,11);

            $suppSubQuery = "SELECT  s.id
                            FROM sr_srm_general_sel as s 
                            WHERE   s.type IN (2,3) and s.status <> -1 AND 
                                    (s.company_id=" . $this->arrUser['company_id'] . " ) ";
            //$suppSubQuery = $this->objsetup->whereClauseAppender($suppSubQuery,24);

            $purchaseSubQuery = "SELECT srm_invoicecache.id FROM srm_invoicecache WHERE sell_to_cust_id IN (SELECt s.id
                                FROM sr_srm_general_sel as s 
                                WHERE   s.type IN (2,3) AND 
                                        s.company_id=" . $this->arrUser['company_id'] . "  ";

            //$purchaseSubQuery = $this->objsetup->whereClauseAppender($purchaseSubQuery,24);
            $purchaseSubQuery .= " )";

            $debitNoteSubQuery = "SELECT srm_order_returncache.id 
                                  FROM srm_order_returncache 
                                  WHERE supplierID IN (SELECT s.id
                                                    FROM sr_srm_general_sel as s 
                                                    WHERE   s.type IN (2,3) AND 
                                                            s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$debitNoteSubQuery = $this->objsetup->whereClauseAppender($debitNoteSubQuery,24);
            $debitNoteSubQuery .= " )"; */

            $hrSubQuery = "SELECT e.id
                            FROM employees as e
                            WHERE e.status <> -1 ";
            $whSubQuery = "SELECT w.id
                            FROM warehouse as w
                            WHERE w.status <> -1 ";

            $allBucketsQuery =  " AND ((module_name = 'CRM') ";// and c.row_id IN ($crmSubQuery)
            $allBucketsQuery .=  " OR (module_name = 'Sales') ";// and c.row_id IN ($saleSubQuery)
            $allBucketsQuery .=  " OR (module_name = 'Credit Note') ";// and c.row_id IN ($creditNoteSubQuery)
            $allBucketsQuery .=  " OR (module_name LIKE '%Purchase%') ";// and c.row_id IN ($purchaseSubQuery)
            $allBucketsQuery .=  " OR (module_name LIKE '%Debit Note%') ";// and c.row_id IN ($debitNoteSubQuery)
            $allBucketsQuery .=  " OR (module_name = 'SRM') ";// and c.row_id IN ($srmSubQuery)
            $allBucketsQuery .=  " OR (module_name = 'HR' and c.row_id IN (".$hrSubQuery.") and c.user_id = " . $this->arrUser['id'] . ") OR (module_name = 'Warehouse' and c.row_id IN (".$whSubQuery.")) ";
            $allBucketsQuery .=  " OR (module_name IN ('Customer', 'CRM')) "; //  and c.row_id IN ($custSubQuery)
            $allBucketsQuery .=  " OR (module_name IN ('Supplier', 'SRM'))) "; // and c.row_id IN ($suppSubQuery)
            $allBucketsQuery .=  " OR (module_name IN ('Items') ) ";//and c.row_id IN ($itemSubQuery)
        }

        $bucketQuery = "";
        if ($subQuery){
            $bucketQuery = "AND c.row_id IN (".$subQuery.")";
        }
        else{
            $bucketQuery = $allBucketsQuery;
        }
        
        // print_r($attr);exit;

        $limit_clause = $where_clause = "";

        //$type = (isset($attr['type'])) ? $attr['type'] : 1;
        // $item_id = (isset($attr['item_id'])) ? $attr['item_id'] : 1;
        $response = array();
        $response2 = array();


        if (!empty($attr['item_id']))
            $where_clause .= " AND psp.item_id = '".$attr['item_id']."' ";
        if (!empty($attr['supp_id']))
            $where_clause .= " AND psp.sale_id = '".$attr['supp_id']."' ";


        if (isset($attr['sub_type']))
            $where_clause2 .= " and  c.sub_type='" . $attr['sub_type'] . "'  ";

        
        if (!empty($attr['row_id']))
            $where_clause2 .= " and  c.row_id=" . $attr['row_id'] . "  ";

        /* if (!empty($attr['module_id']))
            $where_clause2 .= " AND ( c.row_id=" . $attr[row_id] . " AND   c.module_id = '$attr[module_id]') ";
        else
            $where_clause2 .= " and  c.row_id=" . $attr[row_id] . "  ";
        */

        // if (!empty($attr['tabname'])) $query_clause2 = " , (select st.name from opp_cycle_tabs st where st.id=c.module_id   and   st.company_id=" . $this->arrUser['company_id'] . " limit 1 ) as tab_name ";
        $flexiWhereClause = "";
        if ($attr['searchKeyword']->multipleColumnSearch){
            $searchValue = $attr['searchKeyword']->multipleColumnSearch;
            $attr['searchKeyword']->description = $searchValue;
            $attr['searchKeyword']->subject = $searchValue;
            $attr['searchKeyword']->receiver_name = $searchValue;
            $attr['searchKeyword']->created_by = $searchValue;
            $attr['searchKeyword']->module_name = $searchValue;
            unset($attr['searchKeyword']->multipleColumnSearch);
        }
        $flexiWhereClause = $this->objGeneral->flexiWhereRetriever("c.",$attr,$fieldsMeta, "", "OR");
        // echo $flexiWhereClause;exit;
        $Sql = "SELECT * FROM sr_comments_sel c WHERE ((module_name <> 'HR' OR (module_name = 'HR' AND user_id = ".$this->arrUser['id'].")) and   c.company_id=" . $this->arrUser['company_id'] . " ". $where_clause2. " ". $where_type_clause. " ".$bucketQuery. ")".$flexiWhereClause; // description //group by  c.id DESC 
        //defualt Variable
        //echo $Sql;exit;
        $order_type = "group by  c.id ";
        // $total_limit = 9999;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        // $attr['searchKeyword']->totalRecords = 10;
        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        if ($attr['countOnly']){
            $response['q'] = '';
            $response['ack'] = 1;
            $response['error'] = NULL;
            return $response;
        }
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['created_by'] = $Row['created_by'];
                $result['created_by_email'] = trim(explode(')',explode('(',$result['created_by'])[1])[0]);
                $result['created_by_name'] = trim(explode(' (',$result['created_by'])[0]);
                $result['id'] = $Row['id'];
                $result['date_created'] = $this->objGeneral->convert_unix_into_datetime($Row['create_date']);
                $result['date_created_without_seconds'] = substr($result['date_created'],0,strripos($result['date_created'],":"));
                $result['subject'] = $Row['subject'];
                $result['tab_name'] = $Row['tab_name'];
                $result['description'] = (strlen($Row['description'] > 150)) ? substr($Row['description'], 0, 150) . '... ' : $Row['description'];
                $result['module_name'] = $Row['module_name'];
                $result['receiver_name'] = $Row['receiver_name'];
                $response['response'][] = $result;
                $response['total'] = $Row['totalRecordCount'];
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'] = array();

            $response = $this->objGeneral->postListing($attr, $response);
            $response['ack'] = 1;
            $response['error'] = NULL;


        return $response;
    }

    function get_comment_listings2($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $where_clause = $this->objGeneral->flexiWhereRetriever("c.",$attr,$fieldsMeta);
        $order_clause = $this->objGeneral->flexiOrderRetriever("c.",$attr,$fieldsMeta);

        $where_type_clause = "";
        if ($attr['module_name'] == 'crm' || $attr['module_name'] == 'crm_retailer'){
            $attr['sub_type'] = 4;
            $responseModule = "CRM/Customer";
            $where_type_clause .= " AND module_name LIKE 'CRM%' ";
        }
        else if ($attr['module_name'] == 'sales'){
            $module_type = 1;
            $where_type_clause .= " AND module_name LIKE '%Sales%' ";
        }
        else if ($attr['module_name'] == 'credit_note'){
            $where_type_clause .= "  AND module_name LIKE '%Credit Note%' ";
        }
        if ($attr['module_name'] == 'warehouse'){
            $attr['sub_type'] = 5;
            $responseModule = "Warehouse";
            $where_type_clause .= " AND module_name LIKE 'Warehouse%' ";

            $subQuery = "SELECT  w.id
                        FROM warehouse as w 
                        WHERE   w.status <> -1 AND
                                (w.company_id=" . $this->arrUser['company_id'] . " ) "; 
        }
        if ($attr['module_name'] == 'srm'){
            $attr['sub_type']  = 3;
            $responseModule = "SRM/Supplier";
            $where_type_clause .= " AND module_name LIKE 'SRM%' ";
        }
        if ($attr['module_name'] == 'customer'){
            $attr['sub_type']  = 4;
            $responseModule = "CRM/Customer";
            $where_type_clause .= " AND (module_name LIKE 'Customer' OR module_name LIKE 'CRM') ";
        }
        if ($attr['module_name'] == 'supplier'){
            $attr['sub_type']  = 3;
            $responseModule = "SRM/Supplier";
            $where_type_clause .= " AND (module_name LIKE 'Supplier' OR module_name LIKE 'SRM') ";
        }
        else if ($attr['module_name'] == 'purchase'){
            $where_type_clause .= "  AND module_name LIKE '%purchase%' ";
        }
        else if ($attr['module_name'] == 'debit_note'){
            $where_type_clause .= "  AND module_name LIKE '%Debit Note%' ";
        }
        
        if ($attr['module_name'] == 'hr'){
            $attr['sub_type']  = 1;
            $responseModule = "HR";
            $where_type_clause .= " AND module_name LIKE 'HR' ";
            $subQuery = "SELECT  e.id
                        FROM employees as e 
                        WHERE   e.status <> -1 AND
                                (e.company_id=" . $this->arrUser['company_id'] . " ) ";
        }
        if ($attr['module_name'] == 'items'){
            $attr['sub_type']  = 2;
            $responseModule = "Items";
            $where_type_clause .= " AND module_name LIKE 'Items' ";
        }
        if ($attr['module_name']){
            if ($attr['record_id']){
                $attr['row_id'] = $attr['record_id'];
            }
        }

        if (empty($attr['module_name'])){

            $hrSubQuery = "SELECT e.id
                            FROM employees as e
                            WHERE e.status <> -1 ";
            $whSubQuery = "SELECT w.id
                            FROM warehouse as w
                            WHERE w.status <> -1 ";

            $allBucketsQuery =  " AND ((module_name = 'CRM') ";// and c.row_id IN ($crmSubQuery)
            $allBucketsQuery .=  " OR (module_name = 'Sales') ";// and c.row_id IN ($saleSubQuery)
            $allBucketsQuery .=  " OR (module_name = 'Credit Note') ";// and c.row_id IN ($creditNoteSubQuery)
            $allBucketsQuery .=  " OR (module_name LIKE '%Purchase%') ";// and c.row_id IN ($purchaseSubQuery)
            $allBucketsQuery .=  " OR (module_name LIKE '%Debit Note%') ";// and c.row_id IN ($debitNoteSubQuery)
            $allBucketsQuery .=  " OR (module_name = 'SRM') ";// and c.row_id IN ($srmSubQuery)
            $allBucketsQuery .=  " OR (module_name = 'HR' and c.row_id IN ($hrSubQuery) and c.user_id = " . $this->arrUser['id'] . ") OR (module_name = 'Warehouse' and c.row_id IN ($whSubQuery)) ";
            $allBucketsQuery .=  " OR (module_name IN ('Customer', 'CRM')) "; //  and c.row_id IN ($custSubQuery)
            $allBucketsQuery .=  " OR (module_name IN ('Supplier', 'SRM'))) "; // and c.row_id IN ($suppSubQuery)
            $allBucketsQuery .=  " OR (module_name IN ('Items') ) ";//and c.row_id IN ($itemSubQuery)
        }

        $bucketQuery = "";
        if ($subQuery){
            $bucketQuery = "AND c.row_id IN (".$subQuery.")";
        }
        else{
            $bucketQuery = $allBucketsQuery;
        }
        
        // print_r($attr);exit;

        $limit_clause = $where_clause = "";
        $response = array();
        $response2 = array();


        if (!empty($attr['item_id']))
            $where_clause .= " AND psp.item_id = '$attr[item_id]' ";
        if (!empty($attr['supp_id']))
            $where_clause .= " AND psp.sale_id = '$attr[supp_id]' ";


        if (!empty($attr['sub_type']))
            $where_clause2 .= " and  c.sub_type=" . $attr['sub_type'] . "  ";

        
        if (!empty($attr['row_id']))
            $where_clause2 .= " and  c.row_id=" . $attr['row_id'] . "  ";
            
        $flexiWhereClause = "";
        if ($attr['searchKeyword']->multipleColumnSearch){
            $searchValue = $attr['searchKeyword']->multipleColumnSearch;
            $attr['searchKeyword']->description = $searchValue;
            $attr['searchKeyword']->subject = $searchValue;
            $attr['searchKeyword']->receiver_name = $searchValue;
            $attr['searchKeyword']->created_by = $searchValue;
            $attr['searchKeyword']->module_name = $searchValue;
            unset($attr['searchKeyword']->multipleColumnSearch);
        }
        $flexiWhereClause = $this->objGeneral->flexiWhereRetriever("c.",$attr,$fieldsMeta, "", "OR");
        // echo $flexiWhereClause;exit;
        $Sql = "SELECT * FROM sr_comments_sel c WHERE ((module_name <> 'HR' OR (module_name = 'HR' AND user_id = ".$this->arrUser['id'].")) and   c.company_id=" . $this->arrUser['company_id'] . "  $where_clause2   $where_type_clause $bucketQuery) $flexiWhereClause"; // description //group by  c.id DESC 
        //defualt Variable
        //echo $Sql;exit;
        $order_type = "group by  c.id ";
        // $total_limit = 9999;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        // $attr['searchKeyword']->totalRecords = 10;
        $response = $this->objGeneral->preListing($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        if ($attr['countOnly']){
            $response['q'] = '';
            $response['ack'] = 1;
            $response['error'] = NULL;
            return $response;
        }
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['created_by'] = $Row['created_by'];
                $result['created_by_email'] = trim(explode(')',explode('(',$result['created_by'])[1])[0]);
                $result['created_by_name'] = trim(explode(' (',$result['created_by'])[0]);
                $result['id'] = $Row['id'];
                $result['date_created'] = $this->objGeneral->convert_unix_into_datetime($Row['create_date']);
                $result['date_created_without_seconds'] = substr($result['date_created'],0,strripos($result['date_created'],":"));
                $result['subject'] = $Row['subject'];
                $result['tab_name'] = $Row['tab_name'];
                $result['description'] = (strlen($Row['description'] > 150)) ? substr($Row['description'], 0, 150) . '... ' : $Row['description'];
                $result['module_name'] = $Row['module_name'];
                $result['receiver_name'] = $Row['receiver_name'];
                $response['response'][] = $result;
                $response['total'] = $Row['totalRecordCount'];
            }
            
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'] = array();

            $response = $this->objGeneral->postListing($attr, $response);
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response']['tbl_meta_data'] = $this->objsetup->GetTableMetaData("crm_notes");


        return $response;
    }

    function get_comment_by_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT * FROM comment WHERE id='".$attr['id']."' LIMIT 1";
        //echo $Sql."<hr>"; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
                    
            }
            $Row['create_date'] = $this->objGeneral->convert_unix_into_date($Row['create_date']);
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function update_comment($arr_attr)
    {
        //print_r($arr_attr);exit;
        $this->objGeneral->mysql_clean($arr_attr);

        $Sqldocuments = "";

        if (!empty($arr_attr['fileName1'])) {
            foreach ($arr_attr['fileName1'] as $keys => $first) {
                $Sqldocuments .= "$first->response" . ',';
            }
        }


        $msg = 'inserted';
        $doc_id = $arr_attr['id'];
        //echo $doc_id;exit;
        if ($doc_id > 0)
            $where_id = " AND tst.id <> '$doc_id' ";

        $data_pass = "  tst.subject = '" . $arr_attr['subject'] . "' AND 
                        tst.description = '" . $arr_attr['description'] . "' AND 
                        tst.row_id = '" . $arr_attr['row_id'] . "' AND 
                        tst.create_date = '" . current_date_time . "'    ";
        $total = $this->objGeneral->count_duplicate_in_sql('comment', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }

        $description = $arr_attr['description'];
        if ($doc_id == 0) {

            $Sql = "INSERT INTO comment SET  
                    description='$description'  ,
                    subject='$arr_attr[subject]'  ,
                    checkTitle='$arr_attr[checkTitle]'  ,
                    row_id='$arr_attr[row_id]'  ,
                    record_name='$arr_attr[recordName]'  ,
                    type='".$arr_attr['type']."' ,
                    sub_type='$arr_attr[sub_type]'  ,
                    module_name='$arr_attr[moduleName]'  ,
                    doc_upload='" . $Sqldocuments . "'   ,
                    create_date='" . current_date_time . "' ,
                    employee_id='" . $this->arrUser['id'] . "' ,
                    user_id='" . $this->arrUser['id'] . "' ,
                    company_id='" . $this->arrUser['company_id'] . "' 	 ,
                    AddedBy='" . $this->arrUser['id'] . "' ,
                    AddedOn='" . current_date_time . "'
                    
                    ";
        } else {
            
            $Sql = "UPDATE comment SET  description='$description'  ,subject='$arr_attr[subject]'  ,doc_upload='" . $Sqldocuments . "'  ,checkTitle='$arr_attr[checkTitle]'  ,ChangedBy='" . $this->arrUser['id'] . "' ,ChangedOn='" . current_date_time . "'  WHERE id = $doc_id  limit 1";
            $msg = 'updated';
        }
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($doc_id == 0)
            $doc_id = $this->Conn->Insert_ID();

        //if($this->Conn->Affected_Rows() > 0)
        if ($doc_id > 0) {
            $response['ack'] = 1;
            $response['msg'] = "Record $msg successfully";
            $response['info'] = "$msg";
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['msg'] = "Record is not $msg";
        }

        return $response;
        exit;


        if (!empty($arr_attr[fileName1])) {

            $Sqld = "INSERT INTO document ( name,FileType,primary_flag,title, document_code, folder_id,type,status, company_id, user_id,  create_date ,row_id,sub_type) VALUES ";

            foreach ($arr_attr[fileName1] as $keys => $first) {
                if ($count > 1) {
                    $count = 0;
                }

                $Sqld .= "(  '" . $first->response . "', '" . $first->FileType . "', '" . $count . "', '" .
                    $arr_attr[subject] . "', " . "'" . $arr_attr[subject] . "'	," . "'" . $arr_attr[folder_ids] . "',2,1,'" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "','" . current_date . "' ,'" . $arr_attr[row_id] . "'
				,'" . $arr_attr[sub_type] . "'  ) , ";
                $chk = true;
                $count++;
            }
            echo $Sqld;
            exit;
            $Sqld = substr_replace(substr($Sqld, 0, -1), "", -1);
            $RSProduct = $this->objsetup->CSI($Sqld);
        }
    }

    function delete_comment($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = "UPDATE comment 
			SET  
			status=-1
			WHERE id = ".$attr['id']." Limit 1";
        //echo $Sql."<hr>"; exit;
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

}

?>