<?php
// error_reporting(E_ALL);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Hr.php");
require_once(SERVER_PATH . "/classes/Setup.php");

class Customersales extends Xtreme
{
    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;
    private $objHr = null;
    private $objsetup = null;

    function __construct($user_info = array())
    {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->arrUser = $user_info;
        $this->objHr = new HR($this->arrUser);
        $this->objsetup = new Setup($user_info);
    }

    // static	
    function delete_update_status($table_name, $column, $id)
    {

        $Sql = "UPDATE $table_name SET  $column=0 	WHERE id = $id Limit 1";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }

    function deleteSalesBucket($attr)
    {
        $Sql = "UPDATE bucket SET status = 0 WHERE id = " . $attr['id'] . "; ";
        $Sql2 = "DELETE FROM crm_salesperson WHERE bucket_id = " . $attr['id'] . "; ";
        $Sql3 = "DELETE FROM crm_bucket WHERE bucket_id = " . $attr['id'] . "; ";

        $RS = $this->objsetup->CSI($Sql3);
        $RS = $this->objsetup->CSI($Sql2);
        $RS = $this->objsetup->CSI($Sql);

        /* $SqlDelete = "Delete FROM crmcache WHERE company_id = '" . $this->arrUser['company_id'] . "'";
        $this->objsetup->CSI($SqlDelete);
        $SqlInsert = "INSERT INTO Crmcache SELECT *,NOW() FROM sr_crm_listing WHERE company_id = '" . $this->arrUser['company_id'] . "'";
        $this->objsetup->CSI($SqlInsert);
 */
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }
        return $response;
    }

    function get_data_by_id($table_name, $id)
    {

        $Sql = "SELECT * FROM $table_name	WHERE id=$id LIMIT 1";
        //	echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'] = array();

        //print_r($response);exit;
        return $response;
    }

    //----------------------crm_sale_group----------------
    function get_sale_group_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $order_by = $where_clause = "";

        if (!empty($attr['keyword']))
            $where_clause .= " AND name LIKE '%$attr[keyword]%' ";


        $response = array();

        $Sql = "SELECT   c.id,c.sale_code,c.group_name   FROM   crm_sale_group c
		 left JOIN company on company.id=c.company_id 
		where  c.status=1 
		AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		" . $where_clause . "
		  ";


        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['sale_code'];
                $result['name'] = $Row['group_name'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_sale_group_list($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);
        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];


        if ($id == 0) {


            $Sql = "INSERT INTO crm_sale_group
                    SET  
                    sale_code='$arr_attr[sale_code]' ,sale_no='$arr_attr[sale_no]' ,group_name='$arr_attr[group_name]'
                    ,company_id='" . $this->arrUser['company_id'] . "',user_id='" . $this->arrUser['id'] . "',date_created='" . current_date . "',status=1 ";
            return $response = $this->objGeneral->run_query_exception($Sql);
        } else {
            $Sql = "UPDATE crm_sale_group
                    SET group_name='$arr_attr[group_name]',status='$arr_attr[statuss]' 	WHERE id = $id Limit 1 ";

            $rs = $this->objsetup->CSI($Sql);
        }

        //echo $Sql;exit; 
        //$this->Conn->Affected_Rows()
        if ($id > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record No Update';
        }

        return $response;
    }

    //----------------------crm_sale_target----------------
    function calcute_total_target_amount($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $response = array();

        $sql_total = "SELECT SUM(ef.target_amount) as total
		FROM crm_sale_target_detail ef
		JOIN company ON company.id = ef.company_id
		WHERE  ef.status=1  AND	ef.sale_target_id='" . $attr['t_id'] . "'  AND ef.type=1
		AND (ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		";

        $rs_count = $this->objsetup->CSI($sql_total);
        $total_target_amount = $rs_count->fields['total'];

        $total_comunication = 0;
        if ($attr['type'] == 3 || $attr['type'] == 4) {
            if ($attr['type'] == 3)
                $type = 1;
            else
                $type = 2;

            $sql_total = "SELECT sum(ef.discount_value) as total
		FROM crm_sale_target_commision_bonus ef
		JOIN company ON company.id = ef.company_id
		WHERE  ef.status=1 AND 	ef.module_id='" . $attr['t_id'] . "'  AND	ef.type='" . $type . "' 
		AND (ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		"; //$attr['type']
            //echo $sql_total;exit;
            $rs_count = $this->objsetup->CSI($sql_total);

            $response['total_comunication_target'] = $rs_count->fields['total'];

            $sql_total2 = "SELECT sum(ef.discount_value) as total
		FROM crm_sale_target_commision_bonus ef
		JOIN company ON company.id = ef.company_id
		WHERE  ef.status=1 AND 	ef.module_id='" . $attr['sub_module_id'] . "'  AND	ef.type='" . $attr['type'] . "' 
		AND (ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		"; //$attr['type']
            //echo $sql_total2;exit;
            $rs_count2 = $this->objsetup->CSI($sql_total2);
            $response['total_comunication'] = $rs_count->fields['total'] - $rs_count2->fields['total'];
        }

        if ($total_target_amount > 0) {

            $response['ack'] = 1;
            $response['total_target_amount'] = $total_target_amount;
        } else {
            $response['ack'] = 0;
            $response['response'][] = array();
        }
        return $response;
    }

    function calcute_level_remaining($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $response = array();

        $sql_total = "SELECT SUM(ef.target_amount) as total
		FROM crm_sale_target_detail ef
		JOIN company ON company.id = ef.company_id
		WHERE  ef.status=1 AND	ef.level_id='" . $attr['level_id'] . "'  And type=2
		AND (ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		"; //AND ef.sale_target_id='" . $attr['t_id'] . "' 
        //echo $sql_total;exit;
        $rs_count = $this->objsetup->CSI($sql_total);
        $total_target_amount = $rs_count->fields['total'];

        if ($total_target_amount > 0) {

            $response['ack'] = 1;
            $response['total_target_amount'] = $total_target_amount;
        } else {
            $response['ack'] = 0;
            $response['response'][] = array();
        }
        return $response;
    }

    function get_sale_group_list_by_group_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $order_by = $where_clause = "";


        $response = array();

        $Sql = "SELECT   c.id as spid ,c.is_primary, cs.group_name ,es.id, es.job_title, es.first_name, es.last_name
		, dp.name as dep_name 	FROM  crm_salesperson c
		 left JOIN company on company.id=c.company_id 
		 left JOIN employees  es on es.id=c.salesperson_id 
		left JOIN crm_sale_group  cs on cs.id=c.module_id 
		left JOIN departments  dp on dp.id=es.department 
		where  c.end_date=0
		AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		AND c.module_id=$attr[g_id] 
		 "; // es.status=1  AND 


        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                //$result['id'] = $Row['id']; 

                $result['id'] = $Row['id'];

                $result['group_name'] = $Row['group_name'];
                $result['name'] = $Row['first_name'] . ' ' . $Row['last_name'];

                $result['job_title'] = $Row['job_title'];
                $result['department'] = $Row['dep_name'];

                $result['is_primary'] = $Row['is_primary'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_customer_crm_by_sale_person_id_backup($attr, $type, $module_id)
    {
        $this->objGeneral->mysql_clean($attr);
        // print_r($attr);exit;
        $order_by = "";
        $where_clause = "";
        $new = "";

        if (!empty($attr['normal_filter'])) {
            if ($attr['normal_filter'] == 1)
                $normal_filter = 'c.name';
            else if ($attr['normal_filter'] == 2)
                $normal_filter = 'cn.name';    //c.country_id
            else if ($attr['normal_filter'] == 3)
                $normal_filter = 'c.city';
            else if ($attr['normal_filter'] == 4)
                $normal_filter = 'c.postcode';
            else if ($attr['normal_filter'] == 5)
                $normal_filter = 'c.turnover';
            else if ($attr['normal_filter'] == 6)
                $normal_filter = 'cr.title';    //'c.region';
            else if ($attr['normal_filter'] == 7)
                $normal_filter = 'sr.title';    //'c.segment';
            else if ($attr['normal_filter'] == 8)
                $normal_filter = 'bs.title';    //'c.buyinggroup';
        }

        if (!empty($attr['operator_filter'])) {
            if ($attr['operator_filter'] == 1)
                $operator_filter = 'IN';
            else if ($attr['operator_filter'] == 2)
                $operator_filter = '=';
            else if ($attr['operator_filter'] == 3)
                $operator_filter = 'LIKE';
            else if ($attr['operator_filter'] == 4)
                $operator_filter = '>';
            else if ($attr['operator_filter'] == 5)
                $operator_filter = '<';
            else if ($attr['operator_filter'] == 6)
                $operator_filter = '>=';
            else if ($attr['operator_filter'] == 7)
                $operator_filter = '<=';
            else if ($attr['operator_filter'] == 8)
                $operator_filter = 'NOT IN';
        }
        if (!empty($attr['operator_search'])) {
            if (($attr['operator_filter'] == 1) || ($attr['operator_filter'] == 8)) {

                $pieces = explode(",", $attr['operator_search']);
                foreach ($pieces as $key => $value) {
                    $new .= "'" . $value . "'" . ',';
                }
                $new = substr($new, 0, -1);
                $operator_search = "($new)";
            } else if ($attr['operator_filter'] == 3)
                $operator_search = " '" . $attr['operator_search'] . "%' ";
            else
                $operator_search = "'" . $attr['operator_search'] . "'";
        }

        if (!empty($attr['logical_filter'])) {
            if ($attr['logical_filter'] == 1)
                $logical_filter = 'AND';
            else if ($attr['logical_filter'] == 2)
                $logical_filter = 'OR';
        }

        if (!empty($attr['normal_filter']))
            $where_clause .= "AND $normal_filter  $operator_filter $operator_search ";

        //if(!empty($attr[logical_search])) $where_clause .=" $logical_filter  $normal_filter = $logical_search "; 
        // if(!empty($attr['all'])) $where_clause .= " AND  c.type IN (1,2,3)  ";
        $where_clause_type = "    c.type IN (2,3)  ";

        $response = array();
        $Sql = "SELECT  distinct c.name,c.type, c.id, c.crm_no, c.customer_code, c.crm_code, c.customer_no, c.name , c.city  , c.postcode, c.turnover , cn.name as cnname , cr.title as region  , bs.title as buying_group  , sr.title as segment 
                FROM  crm  c 
                left JOIN country as cn on cn.id=c.country_id   
                left JOIN crm_region as cr on cr.id =c.region_id
                left JOIN crm_buying_group as bs on bs.id =c.buying_grp 
                left JOIN crm_segment as sr on sr.id =c.company_type
                WHERE " . $where_clause_type . "  AND c.company_id=" . $this->arrUser['company_id'] . " " . $where_clause . " "; //Group by c.name DESC 
        //Limit 100  //Order by c.id DESC


        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['code'] = $Row['customer_code'];
                if ($Row['type'] == 1)
                    $result['code'] = $Row['crm_code'];

                $result['title'] = $Row['name'];
                $result['country'] = $Row['cnname'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];
                $result['turnover'] = $Row['turnover'];
                $result['region'] = $Row['region'];
                $result['segment'] = $Row['segment'];
                $result['buying_group'] = $Row['buying_group'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }


        if ($type == 2) {


            $Sql = "INSERT INTO bucket_filters (module_id, sort_id,normal_filter,operator_filter,operator_search,  logical_filter,company_id,user_id,date_created,type,status) 
                    VALUES ";

            $Sql2 = "(  '" . $module_id . "' ,'','',''," . $Sql . ",''," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "," . current_date . "	,$type,1), ";
            //echo $Sql2;exit;
            $RS = $this->objsetup->CSI($Sql2);

            exit;
        } else
            return $response;
    }

    function get_sale_target_by_sale_person_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $where_clause = "";
        $order_by = "";

        $response = array();

        if (!empty($attr['sid']))
            $where_clause .= " AND c.sale_person_id = '$attr[sid]' ";


        $Sql = "SELECT   c.*	,( SELECT SUM(sd.total_price)  FROM crm_sale_forcast sf 
		JOIN crm_sale_forcast_detail sd on sd.sale_forcast_id=sf.id 
		where sf.sale_target_id=c.id   and sf.forcast_status =2  )as forcast 
		FROM  crm_sale_target c
		JOIN company on company.id=c.company_id 
		where  c.status=1  AND  c.sale_person_name!='' AND  c.sale_code !=''   
		AND(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	 
		AND  c.sale_type=1  
		$where_clause
		  ";

        if ($response['total'] == 0) {

            $Sql = "SELECT   c.id,c.sale_code,cd.sale_person_name,c.sale_type,c.target_amount,c.starting_date,c.ending_date
		,( SELECT SUM(sd.total_price)  FROM crm_sale_forcast sf 
		JOIN crm_sale_forcast_detail sd on sd.sale_forcast_id=sf.id 
		where sf.sale_target_id=c.id   and sf.forcast_status =2  )as forcast 
		FROM  crm_sale_target c
		JOIN company on company.id=c.company_id 
		JOIN crm_sale_target_detail cd on cd.sale_target_id=c.id 
		where  c.status=1  AND  c.sale_person_name!='' AND  c.sale_code !=''   
		AND(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		
		AND cd.sale_person_id = '$attr[sid]'   AND  cd.status=1
		  ";
        }


        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['sale_code'];
                $result['sale_person'] = $Row['sale_person_name'];
                $result['type'] = ($Row['sale_type'] == "1") ? "Individual" : "Group";
                $result['target'] = $Row['target_amount'];
                $result['forecast'] = $Row['forcast'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_sale_person_by_sale_target_id($attr)
    {
        $Sql2 = "SELECT c.sale_person_id,c.sale_type
                FROM  crm_sale_target c
                where  c.status=1  AND  c.sale_person_name!='' AND  c.sale_code !='' AND c.company_id=" . $this->arrUser['company_id'] . " AND c.id = '$attr[target_id]' 
                Limit 1";

        $rs_count = $this->objsetup->CSI($Sql2);
        $sale_person_id = $rs_count->fields['sale_person_id'];
        $sale_type = $rs_count->fields['sale_type'];
        //	echo 	$Sql2;exit;
        //if(!empty($attr['target_sale_person_id'])) 	$sale_person_id = $attr[target_sale_person_id] ;

        if ($sale_person_id > 0) {

            if ($sale_type == 1) { //echo '1';

                $Sql_single = " SELECT es.id,es.user_code,es.first_name,es.last_name,es.job_title,departments.name as dname
                                FROM employees es
                                LEFT JOIN departments  on departments.id=es.department 
                                WHERE es.user_company=" . $this->arrUser['company_id'] . " AND es.id='$sale_person_id'  
                                Limit 1";
                // echo $Sql_single;exit;
                $RS = $this->objsetup->CSI($Sql_single);
            }

            if ($sale_type == 2) { //	echo '2';

                $Sql_group = " SELECT c.salesperson_id 
                               FROM crm_salesperson  c
                               WHERE c.company_id=" . $this->arrUser['company_id'] . " AND c.module_id='$sale_person_id'
                               order by  c.id DESC "; // c.type =2 

                //echo $Sql_group;exit;	
                $rs_group = $this->objsetup->CSI($Sql_group);
                $arrIds = array();
                $strIds = '';
                if ($rs_group->RecordCount() > 0) {
                    while ($Row = $rs_group->FetchRow()) {
                        $arrIds[] = $Row['salesperson_id'];
                    };
                }

                $strIds = implode(',', $arrIds);

                $Sql = "SELECT es.id  ,es.user_code,es.first_name,es.last_name,es.job_title,departments.name as dname
                        FROM employees  es
                        LEFT JOIN departments  on departments.id=es.department 
                        WHERE es.user_company=" . $this->arrUser['company_id'] . " AND  es.id in (" . $strIds . ")
                        ORDER BY es.id DESC";
                // echo $Sql;exit;
                $RS = $this->objsetup->CSI($Sql);
            }

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['user_code'] = $Row['user_code'];
                    $result['first_name'] = $Row['first_name'];
                    $result['last_name'] = $Row['last_name'];

                    $result['job_title'] = $Row['job_title'];
                    $result['department'] = $Row['dname'];

                    $response['response'][] = $result;
                }

                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['ack'] = 0;
                $response['response'][] = array();
            }
        }


        return $response;
    }

    function get_customer_crm_by_sale_person_id($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $where_clause = "";

        if (!empty($attr['all']))
            $where_clause .= " AND  c.type IN (1,2,3)  ";
        //$where_clause .= " AND  c.type IN (2,3)  ";

        if (!empty($attr['sale_person_id']))
            $where_clause .= " AND  cm.salesperson_id='" . $attr['sale_person_id'] . "' AND cm.type='2'  ";

        $response = array(); // ,c.region_id,c.company_type,c.buying_grp

        /* ,( SELECT cr.title  FROM crm_region as cr where cr.id =c.region_id ) as region 
          ,( SELECT bs.title  FROM crm_buying_group bs   where bs.id =c.buying_grp ) as buying_group
          ,( SELECT sr.title  FROM crm_segment as sr where sr.id =c.company_type ) as segment
         */

        $Sql = "SELECT  c.id,  c.name , c.contact_person , c.city  , c.postcode, c.phone, c.type, c.crm_no, c.customer_code, c.crm_code, c.customer_no, c.address_1,cm.is_primary, 
                        " . $this->objGeneral->get_nested_query_list('region', $this->arrUser['company_id']) . ",
                        " . $this->objGeneral->get_nested_query_list('buying_group', $this->arrUser['company_id']) . ", 
                        " . $this->objGeneral->get_nested_query_list('segment', $this->arrUser['company_id']) . "
                FROM  crm  c 
                JOIN crm_salesperson  cm on cm.module_id=c.id  
                where  c.name !='' AND c.company_id=" . $this->arrUser['company_id'] . " " . $where_clause . " ";

        $order_by = "group by c.id DESC";
        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];

                $result['code'] = $Row['customer_code'];

                if ($Row['type'] == 1)
                    $result['code'] = $Row['crm_code'];
                $result['type'] = $Row['type'];
                $result['title'] = $Row['name'];
                $result['person'] = $Row['contact_person'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];
                $result['phone'] = $Row['phone'];
                $result['type'] = $Row['type'];
                $result['address'] = $Row['address_1'];
                $result['region'] = $Row['region'];
                $result['segment'] = $Row['segment'];
                $result['buying_group'] = $Row['buying_group'];
                $result['is_primary'] = ($Row['is_primary'] == "1") ? "YES" : "NO ";

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

    function get_customer_crm_by_sale_target($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        // print_r($attr);exit;
        $where_clause = "";
        $new = "";

        if (!empty($attr['all']))
            $where_clause .= " AND  c.type IN (1,2,3)  ";
        $where_clause .= " AND  c.type IN (2,3)  ";

        $Sql = "SELECT record_id FROM crm_sale_target_types_data 
                WHERE module_id = $attr[target_id]  AND type = " . $attr['type'] . " ";

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['record_id'];
                $new .= "'" . $Row['record_id'] . "'" . ',';
            }
        }
        $new = substr($new, 0, -1);

        if ($attr['type'] == 4)
            $where_clause .= " AND  c.region_id  IN(" . $new . ")  ";
        else if ($attr['type'] == 5)
            $where_clause .= " AND  c.company_type  IN(" . $new . ")  ";
        else if ($attr['type'] == 6)
            $where_clause .= " AND  c.buying_id  IN(" . $new . ")  ";
        else if ($attr['type'] == 7)
            $where_clause .= " AND  c.id IN(" . $new . ")  ";

        $response = array();

        if (!empty($attr['sale_person_id']))
            $where_clause .= " AND  cm.salesperson_id='" . $attr['sale_person_id'] . "' AND cm.type='2'   AND cm.bucket_id =c.bucket_id ";

        $Sql = "SELECT  c.id,  c.name , c.contact_person , c.city  , c.postcode, c.phone, c.type, c.crm_no, 
                        c.customer_code, c.crm_code, c.customer_no, c.address_1,c.region_id,c.company_type,c.buying_grp,
                        " . $this->objGeneral->get_nested_query_list('region', $this->arrUser['company_id']) . ",
                        " . $this->objGeneral->get_nested_query_list('buying_group', $this->arrUser['company_id']) . ",
                        " . $this->objGeneral->get_nested_query_list('segment', $this->arrUser['company_id']) . "
                FROM  crm  c 
                JOIN crm_salesperson  cm on cm.module_id=c.id
                where  c.name !='' AND c.company_id=" . $this->arrUser['company_id'] . " " . $where_clause . "";

        //AND (SELECT cm.is_primary FROM crm_salesperson cm WHERE cm.module_id  =c.id AND type =2)
        //  ,cm.is_primary 
        //echo  $Sql;exit; 

        $order_by = "group by c.id";
        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                $result['id'] = $Row['id'];
                $result['code'] = $Row['customer_code'];
                if ($Row['type'] == 1)
                    $result['code'] = $Row['crm_code'];

                $result['type'] = $Row['type'];
                $result['title'] = $Row['name'];
                $result['person'] = $Row['contact_person'];
                $result['city'] = $Row['city'];
                $result['postcode'] = $Row['postcode'];
                $result['phone'] = $Row['phone'];
                $result['type'] = $Row['type'];
                $result['address'] = $Row['address_1'];
                $result['region'] = $Row['region'];
                $result['segment'] = $Row['segment'];
                $result['buying_group'] = $Row['buying_group'];
                // $result['is_primary'] = ($Row['is_primary'] == "1")?"YES":"NO "; 

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

    function get_sale_target($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $order_by = $where_clause = "";

        if (!empty($attr['thisid']))
            $where_clause .= " AND c.id != '$attr[thisid]' ";

        $response = array();

        $Sql = "SELECT c.*,
                      (SELECT SUM(sd.total_price)  
                       FROM crm_sale_forcast sf 
                       LEFT JOIN crm_sale_forcast_detail sd on sd.sale_forcast_id=sf.id 
                       where sf.sale_target_id=c.id AND 
                             sf.forcast_status =2  ) as forcast,
                      (SELECT units_of_measure.title 
                       FROM units_of_measure 
                       WHERE units_of_measure.id=c.target_uom) as unit_name
                FROM  crm_sale_target c
                WHERE c.status=1  AND  
                      c.sale_person_name!='' AND  
                      c.sale_code !=''  AND
                      c.company_id=" . $this->arrUser['company_id'] . "
                $where_clause ";

        $total_limit = pagination_limit;


        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];
        $order_by = " order by c.id DESC";
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['sale_code'];
                $result['sale_person'] = $Row['sale_person_name'];
                //$result['sale_person_id'] = $Row['sale_person_id'];
                $result['type'] = ($Row['sale_type'] == "1") ? "Individual" : "Group";

                $result['target_amount'] = $Row['target_amount'];
                if (($Row['fix_target_type'] == "2"))
                    $result['unit'] = $Row['unit_name'];

                $result['forecast'] = $Row['forcast'];
                $result['achieve'] = ''; //$Row['achieve'];
                //		if($Row['forcast']>0) 
                $result['Percentage'] = round(($Row['forcast'] * 100) / $Row['target_amount'], 2) . '%'; //
                $result['commission'] = ($Row['commission_type'] == "1") ? "Yes" : "No";
                $result['bonus'] = ($Row['bonus_type'] == "1") ? "Yes" : "No";
                $result['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
                $result['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_sale_list_by_id($id)
    {
        $Sql = "SELECT ct.*
                  FROM crm_sale_target ct	
                  WHERE id=$id 
                  LIMIT 1";
        // echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            // print_r($Row);exit;
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            // fetch data from target product table.
            if ($Row['dataType'] == 1 || $Row['dataType'] == 3) {

                $SqlTargetProduct = "SELECT product_ID
                                        FROM target_product
                                        WHERE crm_sale_target_ID=$id  AND  company_id='" . $this->arrUser['company_id'] . "' ";

                // echo $SqlTargetProduct;exit;
                $RSTargetProduct = $this->objsetup->CSI($SqlTargetProduct);

                if ($RSTargetProduct->RecordCount() > 0) {
                    while ($RowTargetProduct = $RSTargetProduct->FetchRow()) {
                        foreach ($RowTargetProduct as $key => $value) {
                            if (is_numeric($key))
                                unset($RowTargetProduct[$key]);
                        }
                        $Row['targetProducts'][] = $RowTargetProduct['product_ID'];
                    }
                }
            }

            // fetch data from target customer table.
            if ($Row['dataType'] == 2 || $Row['dataType'] == 3) {

                $SqlTargetCustomer = "SELECT crm_ID
                                        FROM target_customer
                                        WHERE crm_sale_target_ID=$id  AND  company_id='" . $this->arrUser['company_id'] . "' ";

                // echo $SqlTargetCustomer;exit;
                $RSTargetCustomer = $this->objsetup->CSI($SqlTargetCustomer);

                if ($RSTargetCustomer->RecordCount() > 0) {
                    while ($RowTargetCustomer = $RSTargetCustomer->FetchRow()) {

                        foreach ($RowTargetCustomer as $key => $value) {
                            if (is_numeric($key))
                                unset($RowTargetCustomer[$key]);
                        }

                        $Row['targetCustomer'][] = $RowTargetCustomer['crm_ID'];
                    }
                }
            }

            $Row['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
            $Row['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'] = array();

        // print_r($response);exit;
        return $response;
    }

    function generateTarget($attr)
    {
        $attr['selectedProducts'] = $attr['selectedProducts'];
        $attr['selectedExcludedProd'] = $attr['selectedExcludedProd'];
        $attr['selectedGroups'] = $attr['selectedGroups'];
        $attr['selectedExcludedCUST'] = $attr['selectedExcludedCUST'];

        /* echo "<pre>";
        print_r($attr['selectedProducts']);
        exit; */
        $where = "";

        /* if($attr['selectedProducts']){
            $where = " IN (".$attr['selectedProducts'].")";
        } */

        $Sql = 'SELECT COUNT(*) as rec,
                       grand_total,
                       DATE_FORMAT(FROM_UNIXTIME(posting_date), "%M") AS reqMonth
                FROM orders
                WHERE type IN (2,3) AND 
                      sale_person_id="' . $attr['sale_person_id'] . '" AND
                      sale_person_id="' . $attr['sale_person_id'] . '" AND
                GROUP BY reqMonth ';
        // echo $Sql;exit;

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
        } else
            $response['response'] = array();

        //print_r($response);exit;
        return $response;
    }

    function get_unique_id_add($attr)
    {
        $product_unique_id = "";
        $unique_id = $this->objGeneral->get_unique_id_from_db($attr);

        $Sql = "INSERT INTO crm_sale_target 
                                    SET 
                                        unique_id='" . $unique_id . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "',
                                        date_added='" . current_date . "' ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($this->Conn->Affected_Rows() > 0) {
            $response['product_unique_id'] = $product_unique_id;
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = 'Record  Inserted.';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Insert.';
        }
        return $response;
    }

    function add_sale_target($arr_attr)
    {
        // $this->objGeneral->mysql_clean($arr_attr);

        /*  if($arr_attr['product_promotion_type_ids']==1){
            // print_r($arr_attr['selectedProducts']); 
            foreach ($arr_attr['selectedProducts'] as $cat) {
                echo $cat->id;
            }       
        } */

        $selectedCustomers = $arr_attr['selectedCustomers'];
        $selectedProducts = $arr_attr['selectedProducts'];

        $sdate = $this->objGeneral->convert_date($arr_attr['starting_date']);
        $edate = $this->objGeneral->convert_date($arr_attr['ending_date']);

        $id = $arr_attr['id'];
        $updateID = $arr_attr['id'];

        $update_check = "";


        $data_types = (isset($arr_attr['data_types']) && $arr_attr['data_types'] != '') ? $arr_attr['data_types'] : 0;
        $target_types = (isset($arr_attr['target_types']) && $arr_attr['target_types'] != '') ? $arr_attr['target_types'] : 0;
        $product_promotion_type_ids = (isset($arr_attr['product_promotion_type_ids']) && $arr_attr['product_promotion_type_ids'] != '') ? $arr_attr['product_promotion_type_ids'] : 0;


        $sale_person_id = (isset($arr_attr['sale_person_id']) && $arr_attr['sale_person_id'] != '') ? $arr_attr['sale_person_id'] : 0;
        $sale_types = (isset($arr_attr['sale_types']) && $arr_attr['sale_types'] != '') ? $arr_attr['sale_types'] : 0;
        $commission_types = (isset($arr_attr['commission_types']) && $arr_attr['commission_types'] != '') ? $arr_attr['commission_types'] : 0;
        $bonus_types = (isset($arr_attr['bonus_types']) && $arr_attr['bonus_types'] != '') ? $arr_attr['bonus_types'] : 0;
        $fix_target_types = (isset($arr_attr['fix_target_types']) && $arr_attr['fix_target_types'] != '') ? $arr_attr['fix_target_types'] : 0;
        $target_uoms = (isset($arr_attr['target_uoms']) && $arr_attr['target_uoms'] != '') ? $arr_attr['target_uoms'] : 0;
        $currency_ids = (isset($arr_attr['currency_ids']) && $arr_attr['currency_ids'] != '') ? $arr_attr['currency_ids'] : 0;

        // target_amount='$arr_attr[target_amount]',
        if ($id == 0) {
            $Sql = "INSERT INTO crm_sale_target
                                            SET  
                                                sale_code='$arr_attr[sale_code]',
                                                unique_id=UUID(),
                                                dataType='$data_types',
                                                sale_type='$sale_types',
                                                target_type='$target_types',
                                                product_promotion_type_id='$product_promotion_type_ids',
                                                sale_person_name='$arr_attr[sale_person_name]',
                                                increment='$arr_attr[increment]',
                                                sale_person_id='$sale_person_id',
                                                starting_date = '" . $sdate . "',
                                                ending_date = '" . $edate . "',
                                                company_id='" . $this->arrUser['company_id'] . "',
                                                user_id='" . $this->arrUser['id'] . "',
                                                date_created='" . current_date . "',
                                                commission_type='$commission_types',
                                                bonus_type='$bonus_types',
                                                status=1,
                                                fix_target_type='$fix_target_types',
                                                target_uom='$target_uoms',
                                                converted_price='$arr_attr[converted_price]',
                                                currency_id='$currency_ids'";

            // echo $Sql;exit;
            $rs = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        } else {

            $Sql = "UPDATE crm_sale_target
                                    SET 
                                        sale_code='$arr_attr[sale_code]',
                                        unique_id=UUID(),
                                        dataType='$data_types',
                                        sale_type='$sale_types',
                                        target_type='$target_types',
                                        product_promotion_type_id='$product_promotion_type_ids',
                                        sale_person_name='$arr_attr[sale_person_name]',
                                        increment='$arr_attr[increment]',
                                        sale_person_id='$sale_person_id',
                                        commission_type='$commission_types',
                                        bonus_type='$bonus_types',
                                        starting_date = '" . $sdate . "',
                                        ending_date = '" . $edate . "' ,
                                        status='$arr_attr[statuss]'	,
                                        fix_target_type='$fix_target_types',
                                        target_uom='$target_uoms',
                                        converted_price='$arr_attr[converted_price]',
                                        currency_id='$currency_ids'
                                    WHERE id = $id 
                                    Limit 1 ";
            // echo $Sql;exit;
            $rs = $this->objsetup->CSI($Sql);
        }
        // }

        // echo $Sql;exit;
        if (($this->Conn->Affected_Rows() > 0) || $updateID > 0) {
            // if ($arr_attr['target_amount'] > 0) {

            $SqlDelProducts = "Delete from target_product where crm_sale_target_ID='$id' and company_id='" . $this->arrUser['company_id'] . "'";
            $rsDelProducts = $this->objsetup->CSI($SqlDelProducts);

            $SqlDelCustomers = "Delete from target_customer where crm_sale_target_ID='$id' and company_id='" . $this->arrUser['company_id'] . "'";
            $rsDelCustomers = $this->objsetup->CSI($SqlDelCustomers);

            if ($product_promotion_type_ids == 3) {

                foreach ($selectedProducts as $prod) {
                    $SqlProducts = "INSERT INTO target_product
                                                SET  
                                                    crm_sale_target_ID='$id',
                                                    product_ID='$prod->id',
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    status=1,
                                                    AddedBy='" . $this->arrUser['id']  . "',
                                                    AddedOn='" . current_date . "',
                                                    ChangedBy='" . $this->arrUser['id']  . "',
                                                    ChangedOn='" . current_date . "'";


                    $rsProducts = $this->objsetup->CSI($SqlProducts);
                }
            }

            foreach ($selectedCustomers as $cust) {
                $SqlCustomers = "INSERT INTO target_customer
                                            SET  
                                                crm_sale_target_ID='$id',
                                                crm_ID='$cust->id',
                                                company_id='" . $this->arrUser['company_id'] . "',
                                                status=1,
                                                AddedBy='" . $this->arrUser['id']  . "',
                                                AddedOn='" . current_date . "',
                                                ChangedBy='" . $this->arrUser['id']  . "',
                                                ChangedOn='" . current_date . "'";


                $rsCustomers = $this->objsetup->CSI($SqlCustomers);
            }


            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not update';
        }
        return $response;
    }

    function get_sale_target_type_data($arr_attr)
    {
        $response = "";
        $order_by = "";
        // print_r($arr_attr);exit;

        $Sql = "SELECT c.record_id 
                FROM crm_sale_target_types_data c
                WHERE c.module_id = $arr_attr[module_id]  AND 
                      c.type = " . $arr_attr['type'] . " ";

        $total_limit = pagination_limit;

        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        $arrIds = array();
        $strIds = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['record_id'];
                $response['response'][] = $result;
                //$arrIds[] = $Row['record_id'];
            };
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_sale_target_type_data($attr)
    {
        // print_r($attr);exit;
        $chk = 0;
        $Sqli = "DELETE FROM crm_sale_target_types_data   
                 WHERE  module_id= '" . $attr['module_id'] . "' AND  
                        type= '" . $attr['type'] . "'";
        //echo  $Sqli;exit;

        $RS = $this->objsetup->CSI($Sqli);

        if ($this->Conn->Affected_Rows() > 0)
            $msg = 'Updated';
        else
            $msg = 'Inserted';

        foreach ($attr['salespersons'] as $item) {
            $Sql = "INSERT INTO crm_sale_target_types_data 
                                    SET 
                                        module_id ='" . $attr['module_id'] . "',
                                        record_id = '" . $item->id . "' ,
                                        type = '" . $attr['type'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "',  
                                        user_id='" . $this->arrUser['id'] . "',
                                        date_added ='" . current_date . "'";

            // echo  $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['msg'] = 'Record ' . $msg;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not ' . $msg;
        }
        return $response;
    }

    //---------------commision---------------------
    function get_privous_data($attr)
    {
        //$this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT c.* 
                FROM  crm_sale_target_commision_bonus c
                LEFT JOIN company on company.id=c.company_id 
                where  c.status=1 AND  
                       c.module_id='$attr[module_id]' AND  
                       c.type='" . $attr['type'] . "' AND 
                       (c.company_id=" . $this->arrUser['company_id'] . " or  
                        company.parent_id=" . $this->arrUser['company_id'] . ")
                ORDER BY c.id ASC  
                LIMIT 1";

        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $result = array();

                $result['id']            = $Row['id'];
                $result['discount_type'] = ($Row['discount_type'] == "1") ? "Value" : "Percentage";
                $result['dtype']         = $Row['discount_type'];
                $result['target_type']   = ($Row['target_type_comsion'] == "1") ? "Accumulative" : "Independent";
                $result['atype']         = $Row['target_type_comsion'];
                $result['value_from']    = $Row['value_from'];
                $response['response'][]  = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();
        return $response;
    }


    function get_sale_comision($attr)
    {
        //$this->objGeneral->mysql_clean($attr);
        $response = "";

        $order_by = "order by c.value_from ASC ";

        if ($attr['type'] == 2 || $attr['type'] == 4 || $attr['type'] == 6)
            $order_by = "order by c.value_to ASC ";

        $Sql = "SELECT c.*
                FROM  crm_sale_target_commision_bonus c
                LEFT JOIN company on company.id=c.company_id 
                where  c.status=1 AND  
                       c.module_id='$attr[module_id]' AND  
                       c.type='" . $attr['type'] . "' AND 
                       (c.company_id=" . $this->arrUser['company_id'] . " or  
                        company.parent_id=" . $this->arrUser['company_id'] . ")";

        $total_limit = pagination_limit;


        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();

                $result['sale_type']     = ($Row['sale_type'] == "1") ? "Amount" : "Quantity";
                $result['value_from']    = $Row['value_from'];
                $result['value_to']      = $Row['value_to'];
                $result['discount_type'] = ($Row['discount_type'] == "1") ? "Value" : "Percentage";
                $result['target_type']   = ($Row['target_type_comsion'] == "1") ? "Accumulative" : "Independent";
                $result['id']            = $Row['id'];
                $result['module_id']     = $Row['module_id'];
                $result['discount_value'] = $Row['discount_value'];

                $result['dtype'] = $Row['discount_type'];
                $result['stype'] = $Row['sale_type'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function add_sale_comision($attr)
    {
        $id = $attr['id'];
        $msg = 'Insert';

        $update_check = "";
        $where_commsion = "";

        if ($id > 0)
            $update_check = " AND tst.id <> '" . $id . "'";

        if ($attr['type'] == 1 || $attr['type'] == 3)
            $where_commsion = " AND ('" . $attr['value_from'] . "' BETWEEN tst.value_from AND tst.value_to	OR
                                    '" . $attr['value_to'] . "' BETWEEN tst.value_from AND tst.value_to) ";
        else
            $where_commsion = " AND tst.value_to ='" . $attr['value_to'] . "' ";

        $data_pass = " tst.module_id='" . $attr['module_id'] . "' AND 
                       tst.type='" . $attr['type'] . "'  
                       $update_check $where_commsion)";

        $total = $this->objGeneral->count_duplicate_in_sql('crm_sale_target_commision_bonus', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO crm_sale_target_commision_bonus
                                        SET
                                            module_id='" . $attr['module_id'] . "',
                                            discount_type='" . $attr['discount_type']->value . "',
                                            discount_value='" . $attr['discount_value'] . "',
                                            sale_type='" . $attr['sale_type']->value  . "',
                                            value_from='" . $attr['value_from'] . "',
                                            value_to='" . $attr['value_to'] . "',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            user_id='" . $this->arrUser['id'] . "',
                                            date_created='" . current_date . "',
                                            type='" . $attr['type'] . "',
                                            target_type_comsion='" . $attr['target_type_comsion']->id . "',
                                            chk_accumlative='" . $attr['chk_accumlative'] . "'";
        } else {
            $Sql = "UPDATE crm_sale_target_commision_bonus
					                        SET  
                                                discount_type='" . $attr['discount_type']->value . "',
                                                discount_value='" . $attr['discount_value'] . "',
                                                sale_type='" . $attr['sale_type']->value . "',
                                                value_from='" . $attr['value_from'] . "',
                                                value_to='" . $attr['value_to'] . "',
                                                target_type_comsion='" . $attr['target_type_comsion']->id . "',
                                                chk_accumlative='" . $attr['chk_accumlative'] . "'
                                            WHERE id = $id 
                                            Limit 1 ";
            $msg = 'Update';
        }

        // echo  $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = 'Record ' . $msg;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not ' . $msg;
        }
        return $response;
    }

    //---------------crm_sale_target_detail---------------------

    function get_unique_id_add_detail($attr)
    {
        $product_unique_id = "";
        $unique_id = $this->objGeneral->get_unique_id_from_db($attr);

        $Sql = "INSERT INTO crm_sale_target_detail 
                                SET 
		unique_id='" . $unique_id . "',company_id='" . $this->arrUser['company_id'] . "',user_id='" . $this->arrUser['id'] . "' ,date_created='" . current_date . "',status=1,type='" . $attr['type'] . "',level_id='$attr[level_id]'
		";
        //  echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $id = $this->Conn->Insert_ID();

        if ($this->Conn->Affected_Rows() > 0) {
            $response['product_unique_id'] = $product_unique_id;
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = 'Record  Inserted.';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Insert.';
        }
        return $response;
    }

    function get_sale_detail_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $order_by = $where_clause = "";

        if (!empty($attr['level_id']))
            $where_clause .= " AND level_id ='$attr[level_id]' ";

        $response = array();

        $Sql = "SELECT   c.*,(SELECT units_of_measure.title FROM units_of_measure WHERE units_of_measure.id=c.target_uom) as unit_name
		FROM   crm_sale_target_detail c
		left JOIN company on company.id=c.company_id 
		where  c.status=1 AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	AND c.sale_target_id='$attr[crm_sale_target_id]' and type='" . $attr['type'] . "'
		 $where_clause
		  ";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['sale_person_name'] = $Row['sale_person_name'];
                $result['sid'] = $Row['sale_person_id'];
                $result['target_amount'] = $Row['target_amount'];

                if (($Row['fix_target_type'] == "2"))
                    $result['unit'] = $Row['unit_name'];

                $result['product_promotion_type_id'] = $Row['product_promotion_type_id'];
                $result['target_type'] = $Row['target_type'];
                $result['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
                $result['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
                $result['commission'] = ($Row['commission_type'] == "1") ? "Yes" : "No";
                $result['bonus'] = ($Row['bonus_type'] == "1") ? "Yes" : "No";
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_sale_detail_list_by_id($attr)
    {
        if (($attr['type'] == 1))
            $type = "3";
        else if (($attr['type'] == 3))
            $type = "5";
        $type2 = $type + 1;

        $Sql = "SELECT ct.*,( SELECT Count(sf.id)  FROM crm_sale_target_commision_bonus sf 
		where sf.module_id=ct.id   AND sf.type='$type')as comsion_status ,( SELECT Count(sf.id)  FROM crm_sale_target_commision_bonus sf 
		where sf.module_id=ct.id   AND sf.type='$type2' )as bonus_status FROM crm_sale_target_detail ct	
		WHERE id=" . $attr['id'] . " LIMIT 1";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $Row['start_date'] = $this->objGeneral->convert_unix_into_date($Row['start_date']);
            $Row['end_date'] = $this->objGeneral->convert_unix_into_date($Row['end_date']);
            $Row['created_date'] = $this->objGeneral->convert_unix_into_date($Row['created_date']);

            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'] = array();

        //print_r($response);exit;
        return $response;
    }

    function add_sale_detail($arr_attr)
    {
        //$this->objGeneral->mysql_clean($arr_attr); 
        //print_r($arr_attr);exit;
        $id = $arr_attr['id'];
        $sdate = $this->objGeneral->convert_date($arr_attr['start_date']);
        $edate = $this->objGeneral->convert_date($arr_attr['end_date']);
        $created_date = $this->objGeneral->convert_date($arr_attr['created_date']);
        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";

        $data_pass = "  tst.sale_person_name='" . $arr_attr['sale_person_name'] . "' AND ('" . $sdate . "' BETWEEN tst.start_date AND tst.end_date	or '" . $edate . "' BETWEEN tst.start_date AND tst.end_date )  $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('crm_sale_target_detail', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO crm_sale_target_detail
                                        SET  
                                            sale_target_id='$arr_attr[sale_target_id]',
                                            target_amount='$arr_attr[target_amount]' ,
                                            sale_group_id='$arr_attr[sale_group_id]'  ,
                                            product_promotion_type_id='$arr_attr[product_promotion_type_ids]' ,
                                            target_type='$arr_attr[target_types]',
                                            sale_person_name='$arr_attr[sale_person_name]',
                                            sale_person_id='$arr_attr[sale_person_id]',
                                            start_date = '" . $sdate . "',
                                            end_date = '" . $edate . "',
                                            company_id='" . $this->arrUser['company_id'] . "',
                                            user_id='" . $this->arrUser['id'] . "',
                                            date_created='" . current_date . "',
                                            status=1,
                                            commission_type='$arr_attr[commission_type]',
                                            bonus_type='$arr_attr[bonus_type]',
                                            target_uom='$arr_attr[target_uoms]',
                                            type='" . $arr_attr['type'] . "',
                                            level_id='$arr_attr[level_id]',
                                            created_date='$created_date' ";
            $rs = $this->objsetup->CSI($Sql);
            $id = $this->Conn->Insert_ID();
        } else {
            $Sql = "UPDATE crm_sale_target_detail
                                        SET 
                                            sale_group_id='$arr_attr[sale_group_id]',
                                            sale_target_id='$arr_attr[sale_target_id]' ,
                                            target_amount='$arr_attr[target_amount]',
                                            sale_person_name='$arr_attr[sale_person_name]',
                                            sale_person_id='$arr_attr[sale_person_id]',
                                            start_date = '" . $sdate . "',
                                            end_date = '" . $edate . "' ,
                                            status='$arr_attr[statuss]'	,
                                            target_uom='$arr_attr[target_uoms]',
                                            type='" . $arr_attr['type'] . "',
                                            level_id='$arr_attr[level_id]',edit_flag=1,
                                            created_date='$arr_attr[created_date]',
                                            product_promotion_type_id='$arr_attr[product_promotion_type_ids]' ,
                                            target_type='$arr_attr[target_types]',
                                            commission_type='$arr_attr[commission_type]',
                                            bonus_type='$arr_attr[bonus_type]' ,
                                            created_date='$created_date'	
                                            WHERE id = $id Limit 1 ";
            $rs = $this->objsetup->CSI($Sql);
        }

        //echo $Sql;exit;
        //$this->Conn->Affected_Rows()
        if ($arr_attr['target_amount'] > 0) {
            $response['id'] = $id;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is not Update';
        }
        return $response;
    }

    function get_crm_sale_target_type_all($arr_attr)
    {

        $response = $order_by = "";
        // print_r($arr_attr);exit;

        $Sql = "SELECT cd.record_id FROM crm_sale_target_types_data cd
		left JOIN company on company.id=cd.company_id 
		where  (cd.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	
		AND cd.module_id = $arr_attr[module_id]  AND cd.type = " . $arr_attr['type'] . "
		  ";

        $total_limit = pagination_limit;
        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'cd', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        $arrIds = array();
        $strIds = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                //$result['id'] = $Row['record_id'];
                //$response['response'][] = $result;
                $arrIds[] = $Row['record_id'];
            };
            // $response['ack'] = 1;
            //$response['error'] = NULL;	
        }
        //return $response;

        $strIds = implode(',', $arrIds);
        $response = array();
        if (!empty($strIds)) {

            if ($arr_attr['type'] == 1) {
                $prodSql = "SELECT   c.id, c.name as name,c.description as code FROM  category  c 
			left JOIN company on company.id=c.company_id 
			where  c.status=1 
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
			and c.id in (" . $strIds . ") 
			group by  c.name"; //c.user_id=".$this->arrUser['id']." 
            } else if ($arr_attr['type'] == 2) {

                $prodSql = "SELECT   c.id, c.brandname as name,  c.brandcode  as code FROM  brand  c 
			left JOIN company on company.id=c.company_id 
			where  c.status=1 
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
			and c.id in (" . $strIds . ") 
			group by  c.brandname DESC "; //c.user_id=".$this->arrUser['id']." 
            } else if ($arr_attr['type'] == 3) {
                /*
                  ,(SELECT category.name FROM category WHERE  prd.category_id=category.id Limit 1) as category_name
                  ,(SELECT brand.brandname FROM brand  WHERE  brand.id=prd.brand_id Limit 1) as brand_name
                  ,(SELECT units_of_measure.title FROM units_of_measure   WHERE units_of_measure.id=prd.unit_id Limit 1) as unit_name
                 */
                $prodSql = "SELECT prd.id,prd.product_code as code,prd.description as name,prd.status,prd.standard_price 
			, " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . "
			, " . $this->objGeneral->get_nested_query_list('brand', $this->arrUser['company_id']) . "
			, " . $this->objGeneral->get_nested_query_list('unit', $this->arrUser['company_id']) . "
			, " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . "
			From product  prd
			LEFT JOIN company on company.id=prd.company_id 
			where
			prd.product_code IS NOT NULL
			and (prd.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
			and prd.id in (" . $strIds . ") 
			ORDER BY prd.id DESC"; //, ".current_stock."
            } else if ($arr_attr['type'] == 4) {

                $prodSql = "SELECT   c.id, c.title as name, c.title as code FROM  crm_region  c 
			left JOIN company on company.id=c.company_id 
			where  c.status=1 
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
			and c.id in (" . $strIds . ") 
			group by  c.title   "; //c.user_id=".$this->arrUser['id']." 
            } else if ($arr_attr['type'] == 5) {

                $prodSql = "SELECT   c.id, c.title as name, c.title as code FROM  crm_segment  c 
			left JOIN company on company.id=c.company_id 
			where  c.status=1 
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
			and c.id in (" . $strIds . ") 
			group by  c.title   "; //c.user_id=".$this->arrUser['id']." 
            } else if ($arr_attr['type'] == 6) {

                $prodSql = "SELECT   c.id, c.title as name, c.title as code FROM  crm_buying_group  c 
			left JOIN company on company.id=c.company_id 
			where  c.status=1 
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
			and c.id in (" . $strIds . ") 
			group by  c.title   "; //c.user_id=".$this->arrUser['id']." 
            } else if ($arr_attr['type'] == 7) {

                $prodSql = "SELECT  c.id,  c.name , c.contact_person  ,c.type, c.crm_no,  c.crm_code as code
		FROM  crm  c 
		left JOIN company on company.id=c.company_id  
	  	 where  c.name !='' AND c.type IN(2,3) AND
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		
		and c.id in (" . $strIds . ") 
		order by c.id DESC ";
            }

            //echo $prodSql; exit;
            $RS = $this->objsetup->CSI($prodSql);
        }

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['code'] = $Row['code'];
                $result['name'] = $Row['name'];
                //$result['standard_price'] = $Row['standard_price'];
                //$result['current_stock'] = $Row['current_stock'];
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

    function get_crm_sale_target_type_detail($arr_attr)
    {
        $response = $order_by = "";

        // print_r($arr_attr);exit;

        $Sql = "SELECT c.record_id FROM crm_sale_target_type_detail c
		WHERE c.module_id = $arr_attr[module_id]  AND c.type = " . $arr_attr['type'] . " ";


        $total_limit = pagination_limit;
        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        $arrIds = array();
        $strIds = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['record_id'];
                $response['response'][] = $result;
                //$arrIds[] = $Row['record_id'];
            };
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_crm_sale_target_type_detail($attr)
    {

        // print_r($attr);exit;

        $chk = 0;
        $Sqli = "DELETE FROM crm_sale_target_type_detail  WHERE module_id= '" . $attr['module_id'] . "' AND  type= '" . $attr['type'] . "' ";
        //echo  $Sqli;exit;
        $RS = $this->objsetup->CSI($Sqli);

        if ($this->Conn->Affected_Rows() > 0)
            $msg = 'Updated';
        else
            $msg = 'Inserted';


        $Sql = "INSERT INTO crm_sale_target_type_detail (module_id, record_id,type,company_id,  user_id,date_added) VALUES ";

        foreach ($attr['salespersons'] as $item) {
            $Sql .= "(  '" . $attr['module_id'] . "' ," . $item->id . " ," . $attr['type'] . "	
					," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "," . current_date . "
					), ";
        }
        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        //echo  $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['msg'] = 'Record ' . $msg;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not ' . $msg;
        }
        return $response;
    }

    function get_crm_sale_target_type_all_level($arr_attr)
    {
        $response = $order_by = "";
        // print_r($arr_attr);exit;

        $Sql = "SELECT cd.record_id FROM crm_sale_target_type_detail cd
		left JOIN company on company.id=cd.company_id 
		where  (cd.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	
		AND cd.module_id = $arr_attr[module_id]  AND cd.type = " . $arr_attr['type'] . "
		  ";


        $order_by = "group by emp.id";
        $total_limit = pagination_limit;
        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'cd', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        $arrIds = array();
        $strIds = '';
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                //$result['id'] = $Row['record_id'];
                //$response['response'][] = $result;
                $arrIds[] = $Row['record_id'];
            };
            // $response['ack'] = 1;
            //$response['error'] = NULL;	
        }
        //return $response;

        $strIds = implode(',', $arrIds);
        $response = array();
        if (!empty($strIds)) {

            if ($arr_attr['type'] == 1) {
                $prodSql = "SELECT   c.id, c.name as name,c.description as code FROM  category  c 
			left JOIN company on company.id=c.company_id 
			where  c.status=1 
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
			and c.id in (" . $strIds . ") 
			group by  c.name"; //c.user_id=".$this->arrUser['id']." 
            } else if ($arr_attr['type'] == 2) {

                $prodSql = "SELECT   c.id, c.brandname as name,  c.brandcode  as code FROM  brand  c 
			left JOIN company on company.id=c.company_id 
			where  c.status=1 
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
			and c.id in (" . $strIds . ") 
			group by  c.brandname DESC "; //c.user_id=".$this->arrUser['id']." 
            } else if ($arr_attr['type'] == 3) {


                $prodSql = "SELECT prd.id,prd.product_code as code,prd.description as name,prd.status,prd.standard_price 
			, " . $this->objGeneral->get_nested_query_list('cat', $this->arrUser['company_id']) . "
			, " . $this->objGeneral->get_nested_query_list('brand', $this->arrUser['company_id']) . "
			, " . $this->objGeneral->get_nested_query_list('unit', $this->arrUser['company_id']) . "
			, " . $this->objGeneral->current_stock_counter($this->arrUser['company_id']) . "
			From product  prd
			LEFT JOIN company on company.id=prd.company_id 
			where
			prd.product_code IS NOT NULL
			and (prd.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
			and prd.id in (" . $strIds . ") 
			ORDER BY prd.id DESC"; //, ".current_stock."
            } else if ($arr_attr['type'] == 4) {

                $prodSql = "SELECT   c.id, c.title as name, c.title as code FROM  crm_region  c 
			left JOIN company on company.id=c.company_id 
			where  c.status=1 
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
			and c.id in (" . $strIds . ") 
			group by  c.title   "; //c.user_id=".$this->arrUser['id']." 
            } else if ($arr_attr['type'] == 5) {

                $prodSql = "SELECT   c.id, c.title as name, c.title as code FROM  crm_segment  c 
			left JOIN company on company.id=c.company_id 
			where  c.status=1 
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
			and c.id in (" . $strIds . ") 
			group by  c.title   "; //c.user_id=".$this->arrUser['id']." 
            } else if ($arr_attr['type'] == 6) {

                $prodSql = "SELECT   c.id, c.title as name, c.title as code FROM  crm_buying_group  c 
			left JOIN company on company.id=c.company_id 
			where  c.status=1 
			and (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
			and c.id in (" . $strIds . ") 
			group by  c.title   "; //c.user_id=".$this->arrUser['id']." 
            } else if ($arr_attr['type'] == 7) {

                $prodSql = "SELECT  c.id,  c.name , c.contact_person  ,c.type, c.crm_no,  c.crm_code as code
		FROM  crm  c 
		left JOIN company on company.id=c.company_id  
	  	 where  c.name !='' AND c.type IN(2,3) AND
		(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		
		and c.id in (" . $strIds . ") 
		order by c.id DESC ";
            }

            //echo $prodSql; exit;
            $RS = $this->objsetup->CSI($prodSql);
        }

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result['id'] = $Row['id'];
                $result['code'] = $Row['code'];
                $result['name'] = $Row['name'];
                //$result['standard_price'] = $Row['standard_price'];
                //$result['current_stock'] = $Row['current_stock'];
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

    //----------------------crm_sale_forcast----------------
    function get_sale_forcast_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $limit_clause = $where_clause = "";


        $response = array();


        if (!empty($attr['id']))
            $where_clause .= " AND sale_target_id ='" . $attr['id'] . "' ";

        $Sql = "SELECT   c.id, c.sale_code, c.sell_to_cust_name, c.sale_person,c.sale_person_id,c.sale_date,c.grand_total,
		forcast_status,ct.target_amount , c.sell_to_cust_id, c.comment, c.reject_comment
		FROM  crm_sale_forcast c
		 left JOIN crm_sale_target ct on ct.id=c.sale_target_id 
		 left JOIN company on company.id=c.company_id 
		where  c.status=1 AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")$where_clause 
		 ";

        $order_by = "group by c.id DESC";
        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['sale_code'];
                $result['sale_person'] = $Row['sale_person'];
                $result['sid'] = $Row['sale_person_id'];
                $result['cid'] = $Row['sell_to_cust_id'];
                $result['customer'] = $Row['sell_to_cust_name'];
                $result['target'] = $Row['target_amount'];
                $result['forecast'] = $Row['grand_total'];

                $result['comment'] = $Row['reject_comment'];
                if ($Row['forcast_status'] != 0)
                    $result['comment'] = $Row['comment'];

                if ($Row['forcast_status'] == "0")
                    $result['status'] = 'Pending';
                else if ($Row['forcast_status'] == "2")
                    $result['status'] = 'Approved';
                else if ($Row['forcast_status'] == "3")
                    $result['status'] = 'Converter';
                else if ($Row['forcast_status'] == "1")
                    $result['status'] = 'Send for Approval';
                elseif ($Row['forcast_status'] == "4")
                    $result['status'] = 'Rejected';

                $result['sale_date'] = $this->objGeneral->convert_unix_into_date($Row['sale_date']);
                // $result['del_date'] = $this->objGeneral->convert_unix_into_date($Row['del_date']);

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function get_sale_forcast_by_id($id)
    {

        $Sql = "SELECT * FROM crm_sale_forcast	WHERE id=$id LIMIT 1";
        //	echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }
            $Row['sale_date'] = $this->objGeneral->convert_unix_into_date($Row['sale_date']);
            $Row['del_date'] = $this->objGeneral->convert_unix_into_date($Row['del_date']);
            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'] = array();

        //print_r($response);exit;
        return $response;
    }

    function update_sale_forcast_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $id = $attr['id'];
        $sale_date = $this->objGeneral->convert_date($attr['sale_date']);
        $del_date = $this->objGeneral->convert_date($attr['del_date']);
        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";

        $data_pass = "  tst.sale_code='" . $attr['sale_code'] . "'  $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('crm_sale_forcast', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO crm_sale_forcast
                                    SET 
                                        sale_no='$attr[sale_no]',
                                        sale_code='$attr[sale_code]',
                                        sell_to_cust_no='$attr[sell_to_cust_no]',#
                                        sell_to_cust_name='$attr[sell_to_cust_name]',
                                        sell_to_address2='$attr[sell_to_address2]',
                                        sell_to_address='$attr[sell_to_address]',
                                        sell_to_city='$attr[sell_to_city]',
                                        sell_to_county='$attr[sell_to_county]',
                                        sell_to_post_code='$attr[sell_to_post_code]',
                                        sell_to_cust_id='$attr[sell_to_cust_id]',
                                        sell_to_contact_no='$attr[sell_to_contact_no]' ,
                                        sell_to_contact_id='$attr[sell_to_contact_id]',
                                        sale_person='$attr[sale_person]',
                                        sale_person_id='$attr[sale_person_id]',
                                        sale_target_id='$attr[sale_target_id]',
                                        sale_target_name='$attr[sale_target_name]',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        date_created='" . current_date . "',
                                        status=1,
                                        type=1,
                                        del_date='$del_date',
                                        sale_date='$sale_date',
                                        converted_price='$attr[converted_price]',
                                        currency_id='$attr[currency_ids]'";
            $add = 'Not Insert';
        } else {

            $Sql = "UPDATE crm_sale_forcast
                                    SET  
                                        sale_no='$attr[sale_no]',
                                        sale_code='$attr[sale_code]',
                                        sell_to_cust_no='$attr[sell_to_cust_no]',
                                        sell_to_cust_name='$attr[sell_to_cust_name]',
                                        sell_to_address2='$attr[sell_to_address2]',
                                        sell_to_address='$attr[sell_to_address]',
                                        sell_to_city='$attr[sell_to_city]',
                                        sell_to_county='$attr[sell_to_county]',
                                        sell_to_post_code='$attr[sell_to_post_code]',
                                        sell_to_cust_id='$attr[sell_to_cust_id]',
                                        sell_to_contact_no='$attr[sell_to_contact_no]' ,
                                        sell_to_contact_id='$attr[sell_to_contact_id]',
                                        sale_person='$attr[sale_person]',
                                        sale_person_id='$attr[sale_person_id]',
                                        sale_target_id='$attr[sale_target_id]',
                                        sale_target_name='$attr[sale_target_name]',
                                        del_date='$del_date',
                                        sale_date='$sale_date',
                                        converted_price='$attr[converted_price]',
                                        currency_id='$attr[currency_ids]'
                                    WHERE id = $id  
                                    LIMIT 1";
            $add = 'Not Update';
        }

        //echo $Sql;exit;
        $rs = $this->objsetup->CSI($Sql);
        if ($id == 0)
            $id = $this->Conn->Insert_ID();


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = $add;
        }

        return $response;
    }

    //------------------ item details---------------------
    function get_sale_forcast_list_items($attr, $doObj = 0)
    {
        $response = $order_by = "";

        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT c.* FROM crm_sale_forcast_detail WHERE c.sale_forcast_id='$attr[sale_id]'";


        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                if ($doObj == 1) {
                    $Row['vats']->name = $Row['vat'];
                    $Row['vats']->id = $Row['vat_id'];
                    $Row['vats']->vat_value = $Row['vat_value'];
                    $Row['units']->name = $Row['unit_measure'];
                    $Row['units']->id = $Row['unit_measure_id'];
                    $Row['units']->parent_id = $Row['unit_parent_id'];
                    $Row['units']->quantity = $Row['unit_qty'];
                    $Row['default_units']->name = $Row['default_unit_measure'];
                    $Row['default_units']->id = $Row['default_unit_measure_id'];
                    $Row['default_units']->parent_id = $Row['default_unit_parent_id'];
                    $Row['default_units']->quantity = $Row['default_unit_qty'];
                    $Row['discount_type_id']->id = $Row['discount_type'];
                    $Row['warehouses']->id = $Row['warehouse_id'];
                    $Row['warehouses']->name = $Row['warehouse'];
                    $Row['standard_price'] = $Row['unit_price'];
                    $Row['item_type'] = $Row['type'];
                    $Row['item_code'] = $Row['item_no'];
                    $Row['description'] = $Row['item_name'];
                    $Row['id'] = $Row['item_id'];
                    $response['response'][] = (object) $Row;
                } else
                    $response['response'][] = $Row;
            };
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
        }
        return $response;
    }

    function add_sale_forcast_list_items($attr)
    {
        //$this->objGeneral->mysql_clean($attr);
        /* echo $attr['items'][0]->discount_type_id->id;
          echo "<hr><pre>"; print_r($attr); exit; */
        $Sql = "UPDATE crm_sale_forcast SET  grand_total='$attr[grand_total]',comment='$attr[comment]' WHERE id = $attr[sale_id] Limit 1";
        $RS = $this->objsetup->CSI($Sql);

        //echo $Sql;exit;

        $chk = false;

        //echo "<pre>"; print_r($attr['items']); exit;
        foreach ($attr['items'] as $item) {

            if ($item->qty) {
                $SqlQuote = "INSERT INTO crm_sale_forcast_detail
					SET  qty='$item->qty',unit_price='$item->standard_price',vat='" . $item->vats->name . "',vat_id='" . $item->vats->id . "',vat_value='" . $item->vats->vat_value . "',item_name='$item->description',item_id='$item->id',total_price='$item->total_price',unit_measure='" . $item->units->name . "',unit_measure_id='" . $item->units->id . "',unit_parent_id='0',unit_qty='" . $item->units->quantity . "',default_unit_measure='" . $item->default_units->name . "',default_unit_measure_id='" . $item->default_units->id . "',default_unit_qty='" . $item->default_units->quantity . "',cat_id='$item->category_id',sale_forcast_id='$attr[sale_id]',conv_unit_price='$item->conv_unit_price',type='$item->item_type',item_no='$item->product_code',discount_type='" . $item->discount_type_id->id . "',discount='$item->discount',sale_unit_id='$item->sale_unit_id',purchase_unit_id='$item->purchase_unit_id',warehouse_id='" . $item->warehouses->id . "',warehouse='" . $item->warehouses->name . "' ";
            }
            //echo $SqlQuote."<hr>"; exit;
            $RS = $this->objsetup->CSI($SqlQuote);
            if ($this->Conn->Affected_Rows() > 0)
                $chk = true;
            else
                $chk = false;
        }
        //exit;
        if ($chk) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated!';
        }

        return $response;
    }

    function convert_rejected($attr)
    {

        $Sql = "UPDATE crm_sale_forcast SET forcast_status = 4  ,reject_comment = '$attr[comment]' WHERE id = " . $attr['id'] . "  Limit 1";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function send_for_approval122($attr)
    {

        $Sql = "UPDATE crm_sale_forcast SET forcast_status = 1   WHERE id = " . $attr['id'] . " Limit 1";
        //	echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function convert_approval($attr)
    {

        $Sql = "UPDATE crm_sale_forcast SET forcast_status =2  WHERE id = " . $attr['id'] . " Limit 1";
        //	echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function convert_to_order($attr)
    {
        //  print_r($attr);exit;

        $Sql = "UPDATE crm_sale_forcast SET type = 3  WHERE id = " . $attr['id'] . " Limit 1 ";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }

    function add_multiple_approval($attr)
    {
        $ids = "";
        // print_r($attr);exit;

        $status = "0";
        $comment = "reject_comment";
        if ($attr['type'] > 0) {
            $status = " 2 ";
            $comment = "comment";
        }

        $chk = 0;
        $msg = 'Updated';
        $sql_fr = "UPDATE crm_sale_forcast SET forcast_status =$status,$comment =CASE id ";
        foreach ($attr['salespersons'] as $item) {
            $ids .= $item->id . ',';
            $sql_fr .= " WHEN $item->id THEN '$item->comment' ";
            $chk++;
        }
        $ids = substr($ids, 0, -1);
        $sql_fr .= "END WHERE id IN ($ids)";
        //echo $sql_fr;exit;
        $sql_fr = $this->objsetup->CSI($sql_fr);
        //$sql_fr .= " WHERE module_id IN ($ids) And type=2   ";


        if ($chk > 0) {
            $response['ack'] = 1;
            $response['error'] = 'Record ' . $msg;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not ' . $msg;
        }

        return $response;
    }

    //----------------------crm_sale_bucket----------------

    function get_sale_baket_list($attr, $arg = 0, $isAllowed = 0)
    {
        // error_reporting(E_ALL); 
        $order_by = $where_clause = "";
        $this->objGeneral->mysql_clean($attr);

        if (!empty($attr['thisid']))
            $where_clause .= " AND c.id != '$attr[thisid]' ";

        $response = array();

        // $Sql = "SELECT   c.* FROM  bucket c
        //		JOIN company on company.id=c.company_id where  c.status=1  AND c.sale_bk_code !=''
        //		 AND(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
        //		$where_clause
        //		 ";

        $Sql = "SELECT c.* 
                FROM  sr_crm_sale_bucket_sel c
                LEFT JOIN company on company.id=c.company_id 
                where   c.status=1  AND 
                        c.sale_bk_code !='' AND
                        (c.company_id=" . $this->arrUser['company_id'] . " )$where_clause";

        //or  company.parent_id=" . $this->arrUser['company_id'] . "

        //  echo $Sql;exit;

        if ($arg == 1) $direct_limit = cache_pagination_limit;
        else $direct_limit = pagination_limit;


        $total_limit = $direct_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            //            $total_limit = $attr['pagination_limits'];

            $order_by = " order by  c.id DESC";
        $Sql = $Sql . $order_by;
        //echo $Sql;exit;

        $response['q'] = '';
        if ($isAllowed) {
            $RS = $this->objsetup->CSI($Sql);
        } else {
            $RS = $this->objsetup->CSI($Sql, "human_resource", sr_ViewPermission);
        }

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['bucket_no'] = $Row['sale_bk_code'];
                $result['name'] = $Row['name'];

                //$result['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
                //$result['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_sale_baket_data_by_id($id)
    {

        $Sql = "SELECT sb.*,( SELECT Count(sf.id)  FROM bucket_filters sf 
		where sf.module_id=sb.id   AND sf.type=1 Limit 1)as prod_status,( SELECT Count(sf.id)  FROM bucket_filters sf 
		where sf.module_id=sb.id   AND sf.type=1 Limit 1)as cust_status
		,( SELECT Count(sf.id)  FROM crm_salesperson sf 
		where sf.module_id=sb.id   AND sf.type=6 Limit 1)as salepersn
		 FROM bucket as sb	WHERE sb.id=$id and sb.company_id = '" . $this->arrUser['company_id'] . "' LIMIT 1";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql, "human_resource", sr_ViewPermission);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
            $Row['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);


            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'] = array();
            $response['bucketFail'] = 1;
        }

        //print_r($response);exit;

        $Sql2 = "SELECT employee_id,is_primary FROM employee_bucket WHERE bucket_id = $id AND company_id = " . $this->arrUser['company_id'];
        $RS2 = $this->objsetup->CSI($Sql2);

        if ($RS2->RecordCount() > 0) {
            while ($Row = $RS2->FetchRow()) {
                $response['employeeIDs'][] = $Row['employee_id'];
                if ($Row['is_primary'])
                    $response['primarySalesperson'] = $Row['employee_id'];
            }
        }


        $allEmployees = $this->objHr->get_employees(array(), 1);
        //print_r($result11['response']);exit;
        for ($i = 0; $i < sizeof($allEmployees['response']); $i++) {
            foreach ($allEmployees['response'][$i] as $key => $value) {
                if ($key == "code") {

                    $tempArray = array("Employee No." => $value);
                    $allEmployees['response'][$i] = $tempArray + $allEmployees['response'][$i];
                    unset($allEmployees['response'][$i][$key]);
                }
            }
        }
        $response['allEmployees'] = $allEmployees;



        return $response;
    }

    function get_sale_baket_data_preData($attr)
    {
        $response['response'] = array();
        $allEmployees = $this->objHr->get_employees(array(), 1);
        //print_r($result11['response']);exit;
        for ($i = 0; $i < sizeof($allEmployees['response']); $i++) {
            foreach ($allEmployees['response'][$i] as $key => $value) {
                if ($key == "code") {

                    $tempArray = array("Employee No." => $value);
                    $allEmployees['response'][$i] = $tempArray + $allEmployees['response'][$i];
                    unset($allEmployees['response'][$i][$key]);
                }
            }
        }

        $response['allEmployees'] = $allEmployees;
        $response['ack'] = 1;
        $response['error'] = NULL;

        return $response;
    }

    function add_sale_baket($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);

        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Enter';
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        $this->Conn->beginTrans();
        $this->Conn->autoCommit = false;
        // $this->objGeneral->mysql_clean($arr_attr);

        //print_r($arr_attr);exit;
        $sdate = $this->objGeneral->convert_date($arr_attr['starting_date']);
        $edate = $this->objGeneral->convert_date($arr_attr['ending_date']);

        $id = $arr_attr['id'];
        $update_check = "";

        if ($id > 0)
            $update_check = " AND tst.id <> '" . $id . "'";

        $data_pass = " tst.status=1 AND 
                       tst.name='" . $arr_attr['name'] . "'  
                      $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('bucket', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record Already Exists.';

            $this->objsetup->SRTraceLogsPHP($srLogTrace);

            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO bucket
                                    SET  
                                        sale_bk_code='$arr_attr[sale_bk_code]',
                                        name='" . $arr_attr['name'] . "',
                                        starting_date = '" . $sdate . "',
                                        ending_date = '" . $edate . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "',
                                        created_date='" . current_date . "'	,
                                        status=1";
            $msg = 'Inserted';
        } else {
            $Sql = "UPDATE bucket 	
                                SET  
                                    name='" . $arr_attr['name'] . "',
                                    starting_date = '" . $sdate . "',
                                    ending_date = '" . $edate . "'	
                                WHERE id = $id 
                                Limit 1 ";
            $msg = 'Updated';
        }

        // echo $Sql;exit;
        $rs = $this->objsetup->CSI($Sql);

        if ($id == 0)
            $id = $this->Conn->Insert_ID();

        // $this->Conn->Affected_Rows() 
        if (count($arr_attr['name']) > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not ' . $msg;

            $srLogTrace = array();

            $srLogTrace['ErrorCode'] = '';
            $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_1;
            $srLogTrace['Function'] = __FUNCTION__;
            $srLogTrace['CLASS'] = __CLASS__;
            $srLogTrace['Parameter1'] = 'Exit';
            $srLogTrace['ErrorMessage'] = 'Record not ' . $msg;

            $this->objsetup->SRTraceLogsPHP($srLogTrace);
        }

        if (strlen($arr_attr['employees'] > 0)) {
            $removeAssignments = "DELETE FROM employee_bucket 
            WHERE bucket_id = $id ";
            //echo $removeAssignments;exit;

            $removeAssignmentsResult = $this->objsetup->CSI($removeAssignments);
            $empArr = explode(",", $arr_attr['employees']);

            //print_r($empArr);exit;
            for ($i = 0; $i < sizeof($empArr); $i++) {

                $Sql = "INSERT INTO employee_bucket
                                set
                                    employee_id='$empArr[$i]',
                                    is_primary='" . ($empArr[$i] == $arr_attr['primarySalesperson'] ? 1 : 0) . "',
                                    company_id='" . $this->arrUser['company_id'] . "',
                                    AddedOn='" .  current_date . "',
                                    AddedBy='" . $this->arrUser['id'] . "',
                                    bucket_id='$id'";
                //echo $Sql;//exit; ;\n
                $R = $this->objsetup->CSI($Sql);
            }
            //exit;

        }

        if ($arr_attr['overwrite'] == 1) {
            $response['reverseAssignments'] = $this->reverseSalespersonAssignments($arr_attr['id'], $arr_attr['employees'], $arr_attr['primarySalesperson']);
        }

        $this->Conn->commitTrans();
        $this->Conn->autoCommit = true;

        $srLogTrace = array();

        $srLogTrace['ErrorCode'] = '';
        $srLogTrace['LOG_LEVEL'] = LOG_LEVEL_2;
        $srLogTrace['Function'] = __FUNCTION__;
        $srLogTrace['CLASS'] = __CLASS__;
        $srLogTrace['Parameter1'] = 'Exit';
        $srLogTrace['ErrorMessage'] = "";

        $this->objsetup->SRTraceLogsPHP($srLogTrace);

        return $response;
    }

    //----------------------customer filter----------------

    function get_sales_person_bucket($attr)
    {
        $ids = "";
        $response = "";
        $where_clause = "";
        // print_r($attr);//exit;
        // if (!empty($attr['bucket_selected_array'])) {
        foreach ($attr['bucket_selected_array'] as $item) {

            $ids .= $item->id . ',';
        }
        $ids = substr($ids, 0, -1);

        //left JOIN crm_bucket cb on cb.bucket_id=c.module_id
        // left JOIN bucket csb on csb.id=cb.bucket_id
        //AND c.bucket_id=0

        $Sql = "SELECT emp.id as spid ,emp.is_primary, es.job_title,CONCAT( es.first_name,'.',es.last_name) as  name,
                           dp.name as dep_name, csb.name as bucket_name,CONCAT( es.id,'.',emp.id) as  id2,es.id as id,csb.id as  bucket_id
                    FROM crm_salesperson emp  left JOIN bucket csb on csb.id=emp.module_id
                    left JOIN company on company.id=emp.company_id
                    left JOIN employees  es on es.id=emp.salesperson_id
                    left JOIN departments  dp on dp.id=es.department
                    WHERE (emp.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") AND
                           emp.type = 6 AND es.status=1 AND  emp.end_date=0  AND emp.module_id IN ($ids)
                    GROUP BY es.id ";

        $order_by = 'order by  csb.name DESC ';

        $total_limit = pagination_limit;


        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        /*echo $response['q'];
        exit;*/

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

    function get_sales_person_and_bucket($arr_attr)
    {

        //print_r($arr_attr);exit;
        $ids = "";
        $response = "";

        $Sql = "SELECT c.* FROM crm_bucket  c WHERE c.module_id = '$arr_attr[module_id]'  AND c.type = 1 AND  c.end_date=0 ";
        $order_by = "group by emp.id";
        $total_limit = pagination_limit;
        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $ids .= $Row['bucket_id'] . ',';
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $response['response'][] = $Row;
            }
        }

        /* foreach ($attr['bucket_selected_array'] as $item) { 
          $ids .=$item->id.',';
          } */
        $ids = substr($ids, 0, -1);

        //left JOIN crm_bucket cb on cb.bucket_id=c.module_id
        // left JOIN bucket csb on csb.id=cb.bucket_id 


        $Sql = "SELECT   c.id as spid ,c.is_primary, es.job_title,   CONCAT( es.first_name,'.',es.last_name) as  name , dp.name as dep_name, csb.name as bucket_name ,   CONCAT( es.id,'.',c.id) as  id,csb.id as  bucket_id
		 FROM crm_salesperson c
		 left JOIN bucket csb on csb.id=c.bucket_id 
		 left JOIN company on company.id=c.company_id 
		 left JOIN employees  es on es.id=c.salesperson_id  
		 left JOIN departments  dp on dp.id=es.department 
		WHERE  (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		 AND c.type = 2 AND  c.end_date=0  AND c.bucket_id IN ($ids) AND c.module_id='$arr_attr[module_id]' AND  c.end_date=0 
		 order by  csb.name DESC 
		 ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response_salesperson'][] = $Row;
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

    function get_crm_bucket($arr_attr, $type = null)
    {
        $response = "";
        $order_by = "";

        if ($type == 'crm') {
            $arr_attr['type'] = '1';
        } else if ($type == 'customer') {
            $arr_attr['type'] = 2;
        }

        $Sql = "SELECT c.* 
                FROM crm_bucket c 
                WHERE c.module_id = '$arr_attr[module_id]' and 
                      c.type IN (" . $arr_attr['type'] . ") AND  
                      (c.end_date IS NULL || c.end_date=0)";

        //echo $Sql;exit;
        $total_limit = pagination_limit;
        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'c', $order_by);
        // echo $response['q'];  exit;

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

    function add_crm_bucket($arr_attr)
    {

        $sql = "DELETE FROM crm_bucket WHERE module_id='$arr_attr[module_id]' AND type='" . $arr_attr['type'] . "' ";
        $RS = $this->objsetup->CSI($sql);


        $check = false;
        $Sql = "INSERT INTO crm_bucket (module_id,bucket_id,type,is_primary,company_id,user_id,start_date) VALUES ";

        foreach ($arr_attr['salesbucket'] as $item) {

            if ($item->isPrimary > 0)
                $is_primary = $item->isPrimary;
            else
                $is_primary = 0;

            $Sql .= "(  '" . $arr_attr['module_id'] . "' ," . $item->bucket_id . " ," . $arr_attr['type'] . ",	'" . $is_primary . "'	," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "	,'" . current_date . "' ), ";

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

    function delete_bucket_customer_card($arr_attr)
    {


        $Sql = "UPDATE crm_bucket SET  status=0 	WHERE id =  " . $arr_attr['id'] . " Limit 1";
        //echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record can\'t be deleted!';
        }

        return $response;
    }

    function get_customer_crm_filter_list($attr)
    {
        //$this->objGeneral->mysql_clean($attr); 
        //print_r($attr);exit;
        $where_clause = '';
        $where_clause_loc = '';
        $new = '';

        if (
            !empty($attr['array_dynamic_filter']) && !empty($attr['array_dynamic_filter'][0]->normal_filter->field_name) && !empty($attr['array_dynamic_filter'][0]->operator_filter->id) && !empty($attr['array_dynamic_filter'][0]->operator_search)
        ) {
            //$where_clause = 'AND (';
            $count_location = 0;
            $count_record = 0;
            foreach ($attr['array_dynamic_filter'] as $item) {

                if ((!empty($item->normal_filter->field_name)) && (!empty($item->operator_filter->id)) && (!empty($item->operator_search))) {

                    $normal_filter = $operator_filter = $operator_search = $logical_filter = '';

                    if (!empty($item->normal_filter->field_name)) {
                        $normal_filter = $item->normal_filter->field_name;
                        // if ($item->normal_filter->id == 1)
                        //     $normal_filter = 'c.name';
                        // else if ($item->normal_filter->id == 2)
                        //     $normal_filter = 'cn.name';    //c.country_id
                        // else if ($item->normal_filter->id == 3)
                        //     $normal_filter = 'c.city';
                        // else if ($item->normal_filter->id == 4)
                        //     $normal_filter = 'c.postcode';
                        // else if ($item->normal_filter->id == 5)
                        //     $normal_filter = 'c.turnover';
                        // else if ($item->normal_filter->id == 6)
                        //     $normal_filter = 'cr.title';    //'c.region';
                        // else if ($item->normal_filter->id == 7)
                        //     $normal_filter = 'sr.title';    //'c.segment';
                        // else if ($item->normal_filter->id == 8)
                        //     $normal_filter = 'bs.title';    //'c.buyinggroup';



                        // else if ($item->normal_filter->id == 9)
                        //     $normal_filter = 'cd.contact_name';
                        // else if ($item->normal_filter->id == 10)
                        //     $normal_filter = 'cd.postcode';
                        // else if ($item->normal_filter->id == 11)
                        //     $normal_filter = 'cd.city';
                        // else if ($item->normal_filter->id == 12)
                        //     $normal_filter = 'cnl.name';     //cd.country
                    }

                    if (!empty($item->operator_filter->id)) {
                        if ($item->operator_filter->id == 1)
                            $operator_filter = 'IN';
                        else if ($item->operator_filter->id == 2)
                            $operator_filter = '=';
                        else if ($item->operator_filter->id == 3)
                            $operator_filter = 'LIKE';
                        else if ($item->operator_filter->id == 4)
                            $operator_filter = '>';
                        else if ($item->operator_filter->id == 5)
                            $operator_filter = '<';
                        else if ($item->operator_filter->id == 6)
                            $operator_filter = '>=';
                        else if ($item->operator_filter->id == 7)
                            $operator_filter = '<=';
                        else if ($item->operator_filter->id == 8)
                            $operator_filter = 'NOT IN';
                    }

                    if (!empty($item->operator_search)) {

                        if (($item->operator_filter->id == 1) || ($item->operator_filter->id == 8)) {

                            $pieces = explode(",", $item->operator_search);
                            foreach ($pieces as $key => $value) {
                                if ($value)
                                    $new .= "'" . $value . "'" . ',';
                            }
                            $new = substr($new, 0, -1);
                            $operator_search = "($new)";
                        } else if ($item->operator_filter->id == 3)
                            $operator_search = " '" . $item->operator_search . "%' ";
                        else
                            $operator_search = "'" . $item->operator_search . "'";
                    }

                    if (!empty($item->logical_filter->id)) {
                        if ($item->logical_filter->id == 1)
                            $logical_filter = 'AND';
                        else if ($item->logical_filter->id == 2)
                            $logical_filter = 'OR';
                    }

                    $count_record++;
                    if ($item->normal_filter->id <= 8) {

                        if (!empty($item->normal_filter->id)) {
                            $where_clause = "(" . $where_clause;
                            $where_clause .= " $normal_filter  $operator_filter $operator_search ) $logical_filter   ";
                        }
                    }

                    if ($item->normal_filter->id >= 9) {
                        $count_location++;


                        $where_clause .= " (SELECT count(cd.id) FROM crm_alt_depot  cd
							LEFT JOIN company on company.id=cd.company_id 
							left JOIN country as cnl on cnl.id=cd.country   
							WHERE  cd.status=1 AND cd.crm_id=c.id
							AND (cd.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") 		 AND( $normal_filter  $operator_filter $operator_search  $logical_filter)    Limit 1) 	";
                        //$where_clause_loc =" ( $normal_filter  $operator_filter $operator_search  $logical_filter)   "; 
                    }
                }
            }
            $where_clause = 'AND ' . $where_clause;
            //$where_clause .= ")  ";
            //$where_clause .= ")  ";
        }



        /*

                    // if($item->normal_filter->id<=5) 	
                    $count_record++;
                    if (!empty($item->normal_filter->id)){
                        $where_clause = "(" . $where_clause;
                        $where_clause .= " $normal_filter  $operator_filter $operator_search $logical_filter   ";
                        
                    }
                }
            }
            $where_clause = 'AND ' . $where_clause;
            $where_clause .= ")  ";

        */


        if ($count_record == 0 && $attr['page'] != -1) {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
            return $response;
            exit;
        }

        $response = array();
        //distinct c.name,
        $Sql = "SELECT  c.type, c.id, c.customer_code, c.name , c.city  , c.postcode, c.turnover , cn.name as cnname , cr.title as region  , bs.title as buying_group  , sr.title as segment 
		,(SELECT count(cd.id) FROM crm_alt_depot  cd
		LEFT JOIN company on company.id=cd.company_id 
		WHERE  cd.status=1 AND cd.crm_id=c.id
		AND   (cd.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") Limit 1) as location_count 
		,(SELECT count(ct.id) FROM crm_bucket  ct
		LEFT JOIN company on company.id=ct.company_id 
		WHERE  ct.module_id=c.id
		AND   (ct.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") Limit 1) as bucket 
		FROM  crm  c 
		left JOIN company on company.id=c.company_id 
		left JOIN country as cn on cn.id=c.country_id   
		left JOIN crm_region as cr on cr.id =c.region_id
		left JOIN crm_buying_group as bs on bs.id =c.buying_grp 
		left JOIN crm_segment as sr on sr.id =c.company_id
		WHERE c.name!='' AND c.type IN (2,3) AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")	" . $where_clause;
        if ($count_location > 0)
            $Sql .= " " . $where_clause_loc;
        $Sql .= " 
		";
        //Group by c.name   DESC//Limit 50  
        //defualt Variable
        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        //echo $Sql;exit;
        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c');
        //echo $response['q'];exit;		
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['type'] = $Row['type'];
                $result['code'] = $Row['customer_code'];
                //if($Row['type']==1) $result['code'] = $Row['crm_code']; 

                $result['name'] = $Row['name'];
                $result['country'] = $Row['cnname'];
                $result['city'] = $Row['city'] ? $Row['city'] : "";
                $result['postcode'] = $Row['postcode'] ? $Row['postcode'] : "";
                $result['turnover'] = $Row['turnover'] ? $Row['turnover'] : "";
                $result['region'] = $Row['region'] ? $Row['region'] : "";
                $result['segment'] = $Row['segment'] ? $Row['segment'] : "";
                $result['buying_group'] = $Row['buying_group'] ? $Row['buying_group'] : "";

                $result['location'] = ($Row['location_count'] > 0) ? "Yes" : "NO";
                $result['bucket'] = $Row['bucket'];

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        }

        return $response;
    }

    function get_sale_bucket_customer($arr_attr)
    {
        $order_by = $response = "";

        // print_r($arr_attr);exit;
        //	$Sql = "SELECT cust_id FROM crm_sale_bucket_data WHERE module_id = $arr_attr[module_id]  AND type = ".$arr_attr['type']." ";

        $Sql = "SELECT cb.* 
                FROM  bucket_filters  cb 
                WHERE cb.module_id = $arr_attr[module_id] AND cb.type = 1 AND cb.company_id=" . $this->arrUser['company_id'] . "";
        //Order by cb.id DESC 


        $total_limit = pagination_limit;
        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'cb', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
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
        } else
            $response['response'][] = array();

        $response['response_customer'][] = array();
        return $response;
    }

    function add_sale_bucket_customer($attr)
    {
        //print_r($attr);exit;
        $new = $response = "";
        $where_clause_loc = "";

        $chk = 0;
        $Sqli = "DELETE FROM bucket_filters WHERE module_id= '" . $attr['module_id'] . "' ";
        $RS = $this->objsetup->CSI($Sqli);
        if ($this->Conn->Affected_Rows() > 0)
            $msg = 'Updated';
        else
            $msg = 'Inserted';


        $Sql = "INSERT INTO bucket_filters (module_id, sort_id,normal_filter,operator_filter,operator_search,  logical_filter,company_id,user_id,date_created,type,status) VALUES ";
        foreach ($attr['array_dynamic_filter'] as $item) {

            if ((!empty($item->normal_filter->id)) && (!empty($item->operator_filter->id)) && (!empty($item->operator_search))) {
                $Sql .= "(  '" . $attr['module_id'] . "' ,'" . $item->sort_id . "','" . $item->normal_filter->id . "','" . $item->operator_filter->id . "','" . $item->operator_search . "','" . $item->logical_filter->id . "'," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "," . current_date . ",1,1 ), ";
                $chk++;
            }
        }
        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($chk > 0) {


            $where_clause = '';
            if (
                !empty($attr['array_dynamic_filter']) && !empty($attr['array_dynamic_filter'][0]->normal_filter->id) && !empty($attr['array_dynamic_filter'][0]->operator_filter->id) && !empty($attr['array_dynamic_filter'][0]->operator_search)
            ) {
                $where_clause = 'AND (';
                $count_location = 0;
                $count_record = 0;
                foreach ($attr['array_dynamic_filter'] as $item) {

                    if ((!empty($item->normal_filter->id)) && (!empty($item->operator_filter->id)) && (!empty($item->operator_search))) {

                        $normal_filter = $operator_filter = $operator_search = $logical_filter = '';

                        if (!empty($item->normal_filter->id)) {

                            if ($item->normal_filter->id == 1)
                                $normal_filter = 'c.name';
                            else if ($item->normal_filter->id == 2)
                                $normal_filter = 'cn.name';    //c.country_id
                            else if ($item->normal_filter->id == 3)
                                $normal_filter = 'c.city';
                            else if ($item->normal_filter->id == 4)
                                $normal_filter = 'c.postcode';
                            else if ($item->normal_filter->id == 5)
                                $normal_filter = 'c.turnover';
                            else if ($item->normal_filter->id == 6)
                                $normal_filter = 'cr.title';    //'c.region';
                            else if ($item->normal_filter->id == 7)
                                $normal_filter = 'sr.title';    //'c.segment';
                            else if ($item->normal_filter->id == 8)
                                $normal_filter = 'bs.title';    //'c.buyinggroup';

                            //location filter
                            else if ($item->normal_filter->id == 9)
                                $normal_filter = 'cd.contact_name';
                            else if ($item->normal_filter->id == 10)
                                $normal_filter = 'cd.postcode';
                            else if ($item->normal_filter->id == 11)
                                $normal_filter = 'cd.city';
                            else if ($item->normal_filter->id == 12)
                                $normal_filter = 'cnl.name';     //cd.country
                        }

                        if (!empty($item->operator_filter->id)) {
                            if ($item->operator_filter->id == 1)
                                $operator_filter = 'IN';
                            else if ($item->operator_filter->id == 2)
                                $operator_filter = '=';
                            else if ($item->operator_filter->id == 3)
                                $operator_filter = 'LIKE';
                            else if ($item->operator_filter->id == 4)
                                $operator_filter = '>';
                            else if ($item->operator_filter->id == 5)
                                $operator_filter = '<';
                            else if ($item->operator_filter->id == 6)
                                $operator_filter = '>=';
                            else if ($item->operator_filter->id == 7)
                                $operator_filter = '<=';
                            else if ($item->operator_filter->id == 8)
                                $operator_filter = 'NOT IN';
                        }

                        if (!empty($item->operator_search)) {

                            if (($item->operator_filter->id == 1) || ($item->operator_filter->id == 8)) {

                                $pieces = explode(",", $item->operator_search);
                                foreach ($pieces as $key => $value) {
                                    if ($value)
                                        $new .= "'" . $value . "'" . ',';
                                }
                                $new = substr($new, 0, -1);
                                $operator_search = "($new)";
                            } else if ($item->operator_filter->id == 3)
                                $operator_search = " '" . $item->operator_search . "%' ";
                            else
                                $operator_search = "'" . $item->operator_search . "'";
                        }

                        if (!empty($item->logical_filter->id)) {
                            if ($item->logical_filter->id == 1)
                                $logical_filter = 'AND';
                            else if ($item->logical_filter->id == 2)
                                $logical_filter = 'OR';
                        }

                        $count_record++;
                        if ($item->normal_filter->id <= 8) {

                            if (!empty($item->normal_filter->id))
                                $where_clause .= " $normal_filter  $operator_filter $operator_search  $logical_filter   ";
                        }

                        if ($item->normal_filter->id >= 9) {
                            $count_location++;


                            $where_clause .= " (SELECT count(cd.id) 
                                                FROM crm_alt_depot  cd
                                                left JOIN country as cnl on cnl.id=cd.country 
                                                WHERE  cd.status=1 AND cd.crm_id=c.id AND cd.company_id=" . $this->arrUser['company_id'] . " AND
                                                ( $normal_filter  $operator_filter $operator_search  $logical_filter)
                                                Limit 1)";

                            //$where_clause_loc =" ( $normal_filter  $operator_filter $operator_search  $logical_filter)   "; 
                        }
                    }
                }
                $where_clause .= ")  ";
            }

            $query_format = "SELECT c.type, c.id, c.crm_no, c.customer_code, c.crm_code, c.customer_no, c.name , c.city  , c.postcode, c.turnover , 
                                    cn.name as cnname, cr.title as region, bs.title as buying_group, sr.title as segment,
                                    (SELECT count(cd.id) FROM crm_alt_depot  cd 
                                     WHERE  cd.status=1 AND cd.crm_id=c.id AND cd.company_id=" . $this->arrUser['company_id'] . " 
                                     Limit 1) as location_count
                            FROM  crm  c 
                            left JOIN country as cn on cn.id=c.country_id   
                            left JOIN crm_region as cr on cr.id =c.region_id
                            left JOIN crm_buying_group as bs on bs.id =c.buying_grp 
                            left JOIN crm_segment as sr on sr.id =c.company_type
                            WHERE c.name!='' AND c.type IN (2,3) AND c.company_id=" . $this->arrUser['company_id'] . "	
                            " . $where_clause;

            if ($count_location > 0)
                $Sql .= " " . $where_clause_loc;

            $Sql .= "";

            //Group by c.name   DESC
            //Limit 50 
            //echo  $query_format;exit; 
            $Sql_add = $this->objGeneral->save_query_format($query_format, 1); //Order by c.id DESC


            $Sql2 = "INSERT INTO bucket_filters (module_id, sort_id,normal_filter,operator_filter,operator_search,  logical_filter,company_id,user_id,date_created,type,status) 
                     VALUES ('" . $attr['module_id'] . "' ,'','','','" . $Sql_add . "',''," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "," . current_date . "	,2,1) ";
            //echo $Sql2;exit;
            $RS = $this->objsetup->CSI($Sql2);
        }

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['msg'] = 'Record ' . $msg;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not ' . $msg;
        }


        return $response;
    }

    function assign_bucket_to_customer($attr)
    {
        $ids = "";
        $sql_crm_del_bucket = "DELETE FROM crm_bucket";
        //$sql_crm_add_bucket = "UPDATE crm SET bucket_id = CASE id ";
        $sql_crm_add_bucket = "INSERT INTO crm_bucket (module_id,bucket_id,type,company_id,user_id,start_date) VALUES ";

        $sql_sp_delete = "DELETE FROM crm_salesperson  ";
        $Sql_sp_add = "INSERT INTO crm_salesperson (module_id,salesperson_id,type,is_primary,company_id,  user_id,bucket_id,start_date) VALUES ";

        foreach ($attr['salespersons'] as $item) {
            $ids .= $item->id . ',';

            //$sql_crm_add_bucket .=" WHEN $item->id THEN $attr[bucket_id] ";
            $sql_crm_add_bucket .= "(  '" . $item->id . "'," . $attr['bucket_id'] . " ,1," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . "	,'" . current_date . "' ), ";

            $Sql_sp_add .= "(  '" . $item->id . "'," . $item->id . " ,2,0," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . ",'" . $attr['bucket_id'] . "'	,'" . current_date . "' ), ";
        }
        //$attr['primary_sale_id'] 


        $ids = substr($ids, 0, -1);
        $sql_crm_del_bucket .= " WHERE module_id IN ($ids) AND type=1  "; // AND bucket_id=$attr[bucket_id]
        //$sql_crm_add_bucket .= "END WHERE id IN ($ids)";
        $sql_crm_add_bucket = substr_replace(substr($sql_crm_add_bucket, 0, -1), "", -1);

        $sql_sp_delete .= " WHERE module_id IN ($ids) And type=2   "; //AND bucket_id=$attr[bucket_id] 
        $Sql_sp_add = substr_replace(substr($Sql_sp_add, 0, -1), "", -1);

        // echo $Sql_sp_add;  exit;
        //Replace  	Bucket			//Addition Bucket
        if ($attr['confrm_type'] == 1) {
            $rssql_crm_del_bucket = $this->objsetup->CSI($sql_crm_del_bucket);
            $rssql_sp_delete = $this->objsetup->CSI($sql_sp_delete);
        }

        $rssql_crm_add_bucket = $this->objsetup->CSI($sql_crm_add_bucket);
        $rsSql_sp_add = $this->objsetup->CSI($Sql_sp_add);

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not updated';
        }
        return $response;
    }

    function get_sale_baket_customize_list($attr)
    {
        //$this->objGeneral->mysql_clean($attr); 
        $order_by = $where_clause = $result = "";
        //if(!empty($attr['id'])) 	$where_clause .= " AND c.id != '".$attr['id']."' ";
        $response = array();

        $bucketSql = "SELECT  c.id,c.module_id, c.operator_search 
                      FROM  bucket_filters c
                      where  c.status=1  and c.type=2 AND c.company_id=" . $this->arrUser['company_id'] . " ";

        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $bucketSql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                $new_query = $this->objGeneral->save_query_format($Row['operator_search'], 2);
                // echo  $new_query;exit;
                $RS_new = $this->objsetup->CSI($new_query);
                if ($RS_new->RecordCount() > 0) {
                    while ($Row_new = $RS_new->FetchRow()) {
                        if ($attr['id'] === $Row_new['id'])
                            $result .= "'" . $Row['module_id'] . "'" . ',';
                    }
                }
            }

            $result = substr($result, 0, -1);
            // echo 	$result ;exit;
            //echo strlen($result);
        }

        if (strlen($result) > 3) {

            $finalSql = "SELECT   c.* 
                         FROM  bucket c
                         where  c.status=1  AND c.sale_bk_code !='' AND c.company_id=" . $this->arrUser['company_id'] . " AND c.id IN ($result) 
                         order by c.id DESC";

            $finalRS = $this->objsetup->CSI($finalSql);

            if ($finalRS->RecordCount() > 0) {
                while ($Row = $finalRS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['code'] = $Row['sale_bk_code'];
                    $result['name'] = $Row['name'];

                    $result['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
                    $result['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);

                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            }
        } else {
            $response['ack'] = 0;
            $response['response'][] = array();
        }


        return $response;
    }

    //----------------------product filter----------------
    function get_product_filter_list($attr)
    {
        //$this->objGeneral->mysql_clean($attr); 

        $new = '';
        $where_clause = '';
        $where_clause_loc = '';
        if (
            !empty($attr['array_dynamic_filter_product']) && !empty($attr['array_dynamic_filter_product'][0]->normal_filter->field_name) && !empty($attr['array_dynamic_filter_product'][0]->operator_filter->id) && !empty($attr['array_dynamic_filter_product'][0]->operator_search)
        ) {

            $count_location = 0;
            $count_record = 0;
            //print_r($attr[array_dynamic_filter_product]);exit;
            foreach ($attr['array_dynamic_filter_product'] as $item) {

                if ((!empty($item->normal_filter->field_name)) && (!empty($item->operator_filter->id)) && (!empty($item->operator_search))) {

                    $normal_filter = $operator_filter = $operator_search = $logical_filter = '';

                    if (!empty($item->normal_filter->field_name)) {
                        $normal_filter = $item->normal_filter->field_name;

                        // if ($item->normal_filter->id == 1)
                        //     $normal_filter = 'prd.product_code';
                        // else if ($item->normal_filter->id == 2)
                        //     $normal_filter = 'prd.description';    //c.country_id
                        // else if ($item->normal_filter->id == 3)
                        //     $normal_filter = 'cat.name';
                        // else if ($item->normal_filter->id == 4)
                        //     $normal_filter = 'br.brandname';
                        // else if ($item->normal_filter->id == 5)
                        //     $normal_filter = 'ut.title';
                        // else if ($item->normal_filter->id == 6)
                        //     $normal_filter = 'prd.prd_country_origin';
                    }

                    if (!empty($item->operator_filter->id)) {
                        if ($item->operator_filter->id == 1)
                            $operator_filter = 'IN';
                        else if ($item->operator_filter->id == 2)
                            $operator_filter = '=';
                        else if ($item->operator_filter->id == 3)
                            $operator_filter = 'LIKE';
                        else if ($item->operator_filter->id == 4)
                            $operator_filter = '>';
                        else if ($item->operator_filter->id == 5)
                            $operator_filter = '<';
                        else if ($item->operator_filter->id == 6)
                            $operator_filter = '>=';
                        else if ($item->operator_filter->id == 7)
                            $operator_filter = '<=';
                        else if ($item->operator_filter->id == 8)
                            $operator_filter = 'NOT IN';
                    }

                    if (!empty($item->operator_search)) {
                        if (($item->operator_filter->id == 1) || ($item->operator_filter->id == 8)) {

                            $pieces = explode(",", $item->operator_search);
                            foreach ($pieces as $key => $value) {
                                if ($value)
                                    $new .= "'" . $value . "'" . ',';
                            }
                            $new = substr($new, 0, -1);
                            $operator_search = "($new)";
                        } else if ($item->operator_filter->id == 3)
                            $operator_search = " '" . $item->operator_search . "%' ";
                        else
                            $operator_search = "'" . $item->operator_search . "'";
                    }

                    if (!empty($item->logical_filter->id)) {
                        if ($item->logical_filter->id == 1)
                            $logical_filter = ') AND';
                        else if ($item->logical_filter->id == 2)
                            $logical_filter = ') OR';
                    }


                    // if($item->normal_filter->id<=5) 	
                    $count_record++;
                    if (!empty($item->normal_filter->field_name)) {
                        $where_clause = "(" . $where_clause;
                        $where_clause .= " $normal_filter  $operator_filter $operator_search $logical_filter   ";
                    }
                }
            }
            $where_clause = 'AND ' . $where_clause;
            $where_clause .= ")  ";
        }


        if ($count_record == 0 && $attr['page'] != -1) {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
            return $response;
            exit;
        }


        $response = array();
        /* 	
          , ".$this->objGeneral->get_nested_query_list('cat',$this->arrUser['company_id'])."
          , ".$this->objGeneral->get_nested_query_list('brand',$this->arrUser['company_id'])."
          , ".$this->objGeneral->get_nested_query_list('unit',$this->arrUser['company_id'])."
         */

        $Sql = "SELECT product.id,product.product_code,product.description,country.nicename,product.status,product.standard_price,
                        units_of_measure.title as unit_name,category.name as category_name ,brand.brandname as brand_name
                From product
                LEFT JOIN category on category.id=product.category_id 
                LEFT JOIN brand on brand.id=product.brand_id
                LEFT JOIN units_of_measure on units_of_measure.id=product.unit_id  
                LEFT JOIN country on product.prd_country_origin=country.id
                where product.product_code IS NOT NULL AND product.company_id=" . $this->arrUser['company_id'] . " " . $where_clause;

        if ($count_location > 0)
            $Sql .= " " . $where_clause_loc;
        $Sql .= " ";
        //echo $Sql;exit;
        //Group by prd.name   DESC
        //Limit 50  
        //defualt Variable
        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'product');
        //echo $response['q'];exit;		
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['Item No.'] = $Row['product_code'];
                $result['name'] = $Row['description'];
                $result['category'] = $Row['category_name'];
                $result['brand'] = $Row['brand_name'];
                $result['origin'] = $Row['nicename'];
                $result['unit_name'] = $Row['unit_name'];
                $result['standard_price'] = $Row['standard_price'];
                //$result['current_stock'] = $Row['current_stock'];

                //$result['location'] = ($Row['location_count']> 1)?"Yes":"NO"; 
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

    function getBucketFilters($arr_attr)
    {
        $response = array();
        $order_by = "";
        // print_r($arr_attr);exit;
        //	$Sql = "SELECT cust_id FROM crm_sale_bucket_data WHERE module_id = $arr_attr[module_id]  AND type = ".$arr_attr['type']." ";

        $Sql = "SELECT cb.*
                FROM  bucket_filters  cb 
                WHERE cb.bucket_id = " . $arr_attr['bucket_id'] . "  AND cb.type = 1 AND cb.company_id=" . $this->arrUser['company_id'];
        // echo $Sql.'111'; //exit;

        $total_limit = pagination_limit;
        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'cb', $order_by);
        // echo $response['q']; exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';


        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                //$result['id'] = $Row['cust_id'];
                $result['id'] = $Row['id'];
                $result['sort_id'] = $Row['sort_id'];
                $result['operator_search'] = $Row['operator_search'];
                $result['normal_filter'] = $Row['normal_filter'];
                $result['operator_filter'] = $Row['operator_filter'];
                $result['module_id'] = $Row['module_id'];
                $result['logical_filter'] = $Row['logical_filter'];

                $response['response_filter'][] = $result;
            }

            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();


        $response['response_product'][] = array();


        return $response;
    }

    function checkBucketValidity($input_arr, $module_id = null)
    {
        //print_r($input_arr);

        if ($module_id == 40) {

            $Sql = "SELECT  COUNT(1)
                    from sr_crm_listing  c 
                    where ( c.type IN (1) AND c.crm_code IS NOT NULL AND  c.name !='' AND
                        (c.company_id=" . $this->arrUser['company_id'] . " )  AND c.statusp = 'Active' )";
        } else if ($module_id == 48) {

            $Sql = "SELECT  COUNT(1)
                    from sr_crm_listing  c 
                    where (c.type IN (2,3) AND c.customer_code IS NOT NULL AND  c.name !='' AND
                            (c.company_id=" . $this->arrUser['company_id'] . " )   AND c.statusp = 'Active' )";
        }


        /* $Sql = "SELECT  c.id,c.crm_code,c.region,c.statusp,c.segment,c.buying_group,c.name,
                c.primaryc_name,c.primary_city,c.primary_postcode,c.phone,c.type
        from sr_crm_general_sel  c
        where  c.type IN (1,2) AND c.crm_code IS NOT NULL AND  c.name !='' AND
            (c.company_id=" . $this->arrUser['company_id'] . " ) "; */


        $Sql_query = "SELECT DISTINCT sql_filter FROM bucket_filters WHERE bucket_id = $input_arr[bucket_id] AND module_id = $module_id ;";
        //echo $Sql_query;exit;
        $RS = $this->objsetup->CSI($Sql_query);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            $generatedSQL = $Row['sql_filter'];
            $Sql .= " AND " . $generatedSQL . " AND c.id = $input_arr[module_id]";
            //echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $Row = $RS->FetchRow();
            //echo $Sql;exit;
            $response['query'] = trim(str_replace(PHP_EOL, ' ', $Sql));
            $response['valid'] = $Row[0];
        } else {
            $response['valid'] = 0;
        }

        $response['ack'] = 1;
        $response['error'] = null;

        //print_r($response);

        return $response;
    }

    function reverseSalespersonAssignments($bucket_id, $salesPersons, $primarySalesperson)
    {
        // print_r($salesPersons);exit;
        //echo $bucket_id;exit;
        $Sql = "SELECT distinct sql_filter,module_id FROM bucket_filters WHERE bucket_id=$bucket_id";
        // echo $Sql.PHP_EOL;exit;
        $RS = $this->objsetup->CSI($Sql);

        // first of all, previous assignments should be removed
        $DeleteQuery1 = "DELETE FROM crm_bucket WHERE bucket_id = $bucket_id";
        $DeleteQuery2 = "DELETE FROM crm_salesperson WHERE bucket_id = $bucket_id";
        $DeleteResp = $this->objsetup->CSI($DeleteQuery1);
        $DeleteResp = $this->objsetup->CSI($DeleteQuery2);

        //print_r($RS);
        //echo PHP_EOL.$RS->RecordCount();exit;
        if ($RS->RecordCount() > 0) {

            while ($Row = $RS->FetchRow()) {
                //print_r($Row);
                $result = array();
                //print_r($r);
                //$result['id'] = $Row['cust_id'];
                if ($Row['module_id'] == 40) { // crm

                    $crm_bucket_type = 1;
                    $fixedQuery = "from sr_crm_listing  c
                                    where  c.type IN (1) AND statusp = 'Active' AND c.crm_code IS NOT NULL AND  c.name !='' AND
                                        c.company_id=" . $this->arrUser['company_id'] . " ";
                } else if ($Row['module_id'] == 48) { // customer

                    $crm_bucket_type = 2;
                    $fixedQuery = "from sr_crm_listing  c
                                    where  c.type IN (2,3) AND statusp = 'Active' AND c.customer_code IS NOT NULL AND  c.name !='' AND
                                        c.company_id=" . $this->arrUser['company_id'] . " ";
                } else if ($Row['module_id'] == 18) {
                    continue;
                } else if ($Row['module_id'] == 65) {
                    continue;
                } else if ($Row['module_id'] == 24) {
                    continue;
                } else if ($Row['module_id'] == 11) {
                    continue;
                } else if ($Row['module_id'] == 1) {
                    continue;
                }


                $subQueryBucket = "SELECT  c.id, $bucket_id, $crm_bucket_type, 0, " . $this->arrUser['company_id'] . ", " . $this->arrUser['id'] . "," . current_date . "," . $this->arrUser['id'] . "," . current_date . " $fixedQuery ";
                $subQueryBucket .= " AND " . $Row['sql_filter'];

                $deleteSubQueryBucket = "SELECT  c.id $fixedQuery ";
                $deleteSubQueryBucket .= " AND " . $Row['sql_filter'];

                // deleting other buckets from the CRM Record..
                // as only 1 is requirement on this stage
                $deleteBucketSQL = "DELETE FROM crm_bucket WHERE type = $crm_bucket_type AND module_id IN ( SELECT * FROM ($deleteSubQueryBucket) as subquery)";
                //echo $deleteBucketSQL;
                $RS1 = $this->objsetup->CSI($deleteBucketSQL);
                $response[$Row['module_id']]['del_all_buckets_filtered_records'] = $this->Conn->Affected_Rows();

                // deleting all assignments of this bucket in CRMs
                $deleteBucketSQL = "DELETE FROM crm_bucket WHERE type = $crm_bucket_type AND bucket_id = $bucket_id";
                $RS2 = $this->objsetup->CSI($deleteBucketSQL);

                // re-assigning this bucket to all CRMs who are in the filter
                $InsertBucketSql = "INSERT INTO crm_bucket (module_id,bucket_id,type,is_primary,company_id,user_id,start_date,AddedBy,AddedOn)  
                       " . $subQueryBucket . "
                    ";
                $RS3 = $this->objsetup->CSI($InsertBucketSql);
                $response[$Row['module_id']]['add_this_crm_bucket_to_all_records'] = $this->Conn->Affected_Rows();


                // deleting Salespersons from the CRM Record.. if they are not in the updated salespersons list
                $deleteBucketSQL = "DELETE FROM crm_salesperson WHERE module_id IN ( SELECT * FROM ($deleteSubQueryBucket) as subquery)";
                /* if (!empty($salesPersons)){
                        //$deleteBucketSQL .= " AND salesperson_id NOT IN ($salesPersons)";
                    } */
                //echo $deleteBucketSQL;exit;
                $RS4 = $this->objsetup->CSI($deleteBucketSQL);
                $response[$Row['module_id']]['del_prev_salepersons_from_filtered_records'] = $this->Conn->Affected_Rows();


                if (!empty($salesPersons)) {
                    // Adding Employees as Salespersons To the CRM Records
                    $salesPersonsArr = explode(",", $salesPersons);
                    for ($i = 0; $i < sizeof($salesPersonsArr); $i++) {
                        /* $subQuerySalesPerson = "SELECT  c.id, $salesPersonsArr[$i], (SELECT IF(COUNT(cs.is_primary)>0,0,". ($i==0?1:0) .")), ". $this->arrUser['company_id'] .", ". $this->arrUser['id'] .", 2, $bucket_id, ". current_date ."
                            from sr_crm_listing  c
                            LEFT JOIN crm_salesperson cs ON (c.id = cs.module_id)
                            where  c.type IN (1,2) AND c.crm_code IS NOT NULL AND  c.name !='' AND
                                (c.company_id=" . $this->arrUser['company_id'] . " ) "; */
                        $subQuerySalesPerson = "SELECT  c.id, $salesPersonsArr[$i], " . (($salesPersonsArr[$i] == $primarySalesperson) ? 1 : 0) . ", " . $this->arrUser['company_id'] . ", " . $this->arrUser['id'] . ", 2, $bucket_id, " . current_date . "," . $this->arrUser['id'] . "," . current_date . " $fixedQuery ";
                        $subQuerySalesPerson .= " AND " . $Row['sql_filter'] . "; ";

                        $InsertSalespersonSql = "INSERT INTO crm_salesperson (module_id, salesperson_id, is_primary, company_id, user_id, type, bucket_id, start_date, AddedBy, AddedOn)  
                            " . $subQuerySalesPerson . "
                            ";
                        //echo $InsertSalespersonSql. PHP_EOL;
                        $RS5 = $this->objsetup->CSI($InsertSalespersonSql);
                        $response[$Row['module_id']]['add_new_salepersons_to_filtered_records'] = $this->Conn->Affected_Rows();
                    }
                }
            }

            // Resetting Caches for updating listings
            /* $SqlDelete = "Delete FROM crmcache WHERE company_id = '" . $this->arrUser['company_id'] . "'";
            $this->objsetup->CSI($SqlDelete);
            $SqlInsert = "INSERT INTO Crmcache SELECT *,NOW() FROM sr_crm_listing WHERE company_id = '" . $this->arrUser['company_id'] . "'";
            $this->objsetup->CSI($SqlInsert); */
        }

        // codemark 1
        // Sales persons reverse assignments FROM CRM and Customer Filters
        // So, when a bucket is created for CRM where CRM Name equals "ABC"
        // The salesperson should automatically be added for the record "ABC" in the CRM

        return $response;
    }


    // bucket filters results are created here..
    function getFilterResults($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        if (sizeof($attr['array_dynamic_filter_product']) == 0 || sizeof($attr['array_dynamic_filter_product'][0]->operator_search) == 0) {
            $response['response'] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;

            return $response;
        }
        //print_r($attr);exit;
        //echo $attr['module_id'];exit;
        $generatedSQL =  $this->createSQLQueryForFilter($attr);
        //echo $generatedSQL;exit;
        $Sql = "";
        if ($attr['module_id'] == 1) { //HR

            $Sql = "SELECT * 
                    FROM  sr_employee_sel as emp 
                    WHERE emp.user_code IS NOT NULL AND (emp.status =1) AND 
                        emp.company_id=" . $this->arrUser['company_id'] . " ";

            $Sql .= " AND " . $generatedSQL;
            $Sql .= " ORDER by emp.user_code DESC";
            $response['generatedSql'] = $generatedSQL;
            //echo $Sql;exit;
            $result = $this->objGeneral->any_query_exception($Sql);
            if ($result['ack'] == 0) {
                $response['ack'] = 0;
                $response['error'] = $result['error'];
                $response['query'] = $Sql;
                return $response;
            }
            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['Employee No.'] = $Row['user_code'];
                    $result['Employee Name'] = $Row['name'];
                    $result['Department'] = $Row['dname'];
                    $result['Assigned Role'] = $Row['roles'];
                    $result['Line Manager'] = $Row['line_manager_name'];
                    $result['Employment Type'] = $Row['emp_type'];
                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'] = array();
                $response['ack'] = 0;
                $response['error'] = NULL;
            }
        } else if ($attr['module_id'] == 11) { //item

            $Sql = "SELECT * 
                    FROM  sr_product_sel as prd 
                    WHERE prd.product_code IS NOT NULL AND (prd.status = 1 OR prd.status = 0) AND 
                          prd.company_id=" . $this->arrUser['company_id'] . " ";

            $Sql .= " AND " . $generatedSQL;
            $Sql .= " ORDER by prd.id DESC";
            $response['generatedSql'] = $generatedSQL;
            //echo $Sql;exit;
            $result = $this->objGeneral->any_query_exception($Sql);
            if ($result['ack'] == 0) {
                $response['ack'] = 0;
                $response['error'] = $result['error'];
                $response['query'] = $Sql;
                return $response;
            }
            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['Item No.'] = $Row['product_code'];
                    $result['Description'] = $Row['description'];
                    $result['Category'] = $Row['category_name'];
                    $result['Brand'] = $Row['brand_name'];
                    // $result['Base Unit Of Measure'] = $Row['unit_name'];
                    $result['Country of Origin'] = $Row['origin_country_name'];

                    /* $result['Sales_orders'] = '';
                    $result['Items Assigned to Sales Orders'] = '';
                    $result['Sales Orders with Unassigned Items / Stock'] = '';
                    $result['Available Stock'] = '';
                    $result['On Purchase Order'] = '';
                    $result['On Route/ In Transit'] = '';
                    $result['DS'] = ($Row['delete_status'] == 1) ? "1" : "0";
                    $result['DS'] = ($Row['status'] == 0) ? "1" : "0";

                    $result['status'] = $Row['statusp'];
                    $result['current_stock'] = $Row['current_stock'];
                    $result['standard_price'] = $Row['standard_price']; */
                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'] = array();
                $response['ack'] = 0;
                $response['error'] = NULL;
            }
        } else if ($attr['module_id'] == 48) { // customer

            $Sql = "SELECT  c.id,c.customer_code,c.region,c.statusp,c.segment,c.buying_group,c.name,
                            c.primaryc_name,c.primary_city,c.primary_country,c.primary_postcode,c.phone,c.type,c.salesperson_name, c.turnover
                    from sr_crm_listing  c
                    where  c.type IN (2,3) AND c.customer_code IS NOT NULL AND  c.name !='' AND
                        c.company_id=" . $this->arrUser['company_id'] . " ";

            $Sql .= " AND " . $generatedSQL;
            $Sql .= "GROUP BY c.id ORDER by c.id DESC";
            $response['generatedSql'] = $generatedSQL;
            //echo $Sql;exit;
            $result = $this->objGeneral->any_query_exception($Sql);
            if ($result['ack'] == 0) {
                $response['ack'] = 0;
                $response['error'] = $result['error'];
                $response['query'] = $Sql;
                return $response;
            }
            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['Customer No.'] = $Row['customer_code'];
                    $result['Name'] = $Row['name'];
                    $result['City'] = $Row['primary_city'];
                    $result['Postcode'] = $Row['primary_postcode'];
                    $result['Country'] = $Row['primary_country'];
                    $result['Territory'] = $Row['region'];
                    $result['Buying Group'] = $Row['buying_group'];
                    $result['Segment'] = $Row['segment'];
                    $result['Turnover'] = $Row['turnover'];
                    // $result['Location'] = $Row['primary_location'];
                    // $result['person'] = $Row['contact_person'];
                    //$result['person'] = $Row['primaryc_name'];
                    //$result['city'] = $Row['city'];
                    // $result['postcode'] = $Row['postcode'];

                    //$result['Telephone'] = $Row['phone'];
                    $result['Type'] = $Row['type'];
                    //$result['status'] = $Row['statusp'];

                    //if ($Row['status'] == 0)    $result['status_name'] = "Deleted";
                    //$result['status_date'] = $this->objGeneral->convert_unix_into_date($Row['status_date']);

                    $response['response'][] = $result;
                }

                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'] = array();
                $response['ack'] = 0;
                $response['error'] = NULL;
            }
        } else if ($attr['module_id'] == 65) { // G/L
            $Sql = "select * from gl_accountcache gl
                    WHERE gl.company_id='" . $this->arrUser['company_id'] . "'";

            $Sql .= " AND " . $generatedSQL;

            $Sql .= " GROUP BY id ORDER BY glaccountCode ASC";
            /* print_r($generatedSQL);
            echo $Sql;exit; */
            $response['generatedSql'] = $generatedSQL;
            // $result = $this->objGeneral->any_query_exception($Sql);
            //         if ($result['ack'] == 0){
            //             $response['ack'] = 0;
            //             $response['error'] = $result['error'];
            //             $response['query'] = $Sql;
            //             return $response;
            //         }
            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];


                    $Sql2 = "SELECT SR_GetGL_CatSubcat(" . $Row['id'] . "," . $this->arrUser['company_id'] . ")";
                    //echo $Sql2;//exit;
                    $RS2 = $this->objsetup->CSI($Sql2);
                    $catSubCat = $RS2->fields[0];
                    $RS3 = explode("[]", $catSubCat);
                    $result['G/L No.'] = $Row['glaccountCode'];
                    $result['Name'] = $Row['sub_category_name'];
                    //$result['company_ref_gl_id'] = $Row['company_ref_gl_id'];
                    // $result['Category'] = $Row['parentCATname'];
                    // if($Row['glaccountTypeID']!=1)
                    //     $result['Sub-category'] = $Row['sub_category_name'];

                    //$result['typeID'] = $Row['glaccountTypeID'];
                    // $result['Account Type'] = $Row['glaccountType'];

                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'] = array();
                $response['ack'] = 0;
                $response['error'] = NULL;
            }
        } else if ($attr['module_id'] == 40) { // crm

            $Sql = "SELECT  c.id,c.crm_code,c.region,c.statusp,c.segment,c.buying_group,c.name,c.primaryc_name,c.primary_city,c.primary_county,
                            c.primary_country,c.primary_postcode,c.phone,c.type,c.salesperson_name, c.turnover
                    from sr_crm_listing  c 
                    where  c.type IN (1) AND c.crm_code IS NOT NULL AND  c.name !='' AND c.company_id=" . $this->arrUser['company_id'] . "  AND 
                        ( c.statusp = 'Active' OR c.statusp = 'Inactive' )";

            /* $Sql = "SELECT  c.id,c.crm_code,c.region,c.statusp,c.segment,c.buying_group,c.name,
                    c.primaryc_name,c.primary_city,c.primary_postcode,c.phone,c.type
            from sr_crm_general_sel  c
            where  c.type IN (1,2) AND c.crm_code IS NOT NULL AND  c.name !='' AND
                (c.company_id=" . $this->arrUser['company_id'] . " ) "; */

            $Sql .= " AND " . $generatedSQL;
            $Sql .= " ORDER by c.id DESC";
            //echo $Sql;exit;
            $response['generatedSql'] = $generatedSQL;
            $result = $this->objGeneral->any_query_exception($Sql);
            if ($result['ack'] == 0) {
                $response['ack'] = 0;
                $response['error'] = $result['error'];
                $response['query'] = $Sql;
                return $response;
            }
            $RS = $this->objsetup->CSI($Sql);
            //print_r($RS);
            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['CRM No.'] = $Row['crm_code'];
                    $result['Name'] = $Row['name'];
                    $result['City'] = $Row['primary_city'];
                    $result['Location'] = $Row['primary_location'];
                    $result['County'] = $Row['primary_county'];

                    // $result['person'] = $Row['contact_person'];
                    // $result['Primary Contact'] = $Row['primaryc_name'];
                    //$result['city'] = $Row['city'];
                    // $result['postcode'] = $Row['postcode'];
                    $result['Postcode'] = $Row['primary_postcode'];
                    $result['Country'] = $Row['primary_country'];

                    //$result['phone'] = $Row['phone'];
                    // $result['Telephone'] = $Row['phone'];
                    $result['Type'] = $Row['type'];
                    $result['Territory'] = $Row['region'];
                    $result['Buying Group'] = $Row['buying_group'];
                    $result['Segment'] = $Row['segment'];
                    // $result['Status'] = $Row['statusp'];
                    $result['Turnover'] = $Row['turnover'];
                    //if ($Row['status'] == 0)    $result['status_name'] = "Deleted";
                    //$result['status_date'] = $this->objGeneral->convert_unix_into_date($Row['status_date']);

                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'] = array();
                $response['ack'] = 0;
                $response['error'] = NULL;
            }
        } else if ($attr['module_id'] == 18) { // srm

            $Sql = "SELECT  s.* 
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (1) AND 
                            s.srm_code IS NOT NULL AND  
                            s.name !='' AND ( s.status = 1  OR  s.status = 0 ) AND 
                            s.company_id=" . $this->arrUser['company_id'] . " ";

            $Sql .= " AND " . $generatedSQL;
            $Sql .= " ORDER by s.id DESC";
            $response['generatedSql'] = $generatedSQL;
            $result = $this->objGeneral->any_query_exception($Sql);
            if ($result['ack'] == 0) {
                $response['ack'] = 0;
                $response['error'] = $result['error'];
                $response['query'] = $Sql;
                return $response;
            }
            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    $result['SRM No.'] = $Row['srm_code'];
                    $result['Name'] = $Row['name'];
                    $result['City'] = $Row['primary_city'];
                    $result['County'] = $Row['primary_county'];
                    $result['Postcode'] = $Row['primary_postcode'];
                    $result['Country'] = $Row['primary_country_name'];
                    // $result['Contact Person'] = $Row['contact_person'];
                    $result['Territory'] = ucwords($Row['region']);
                    $result['Segment'] = ucwords($Row['segment']);
                    $result['Selling Group'] = ucwords($Row['selling_group']);

                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'] = array();
                $response['ack'] = 0;
                $response['error'] = NULL;
            }
        } else if ($attr['module_id'] == 24) { // supplier

            $Sql = "SELECT  s.*,CONCAT(`purch`.`first_name`,' ',`purch`.`last_name`) AS `purchaser_code` 
                    FROM sr_srm_general_sel as s
                    LEFT JOIN `employees` `purch` ON (`purch`.`id` = `s`.salesperson_id) 
                    WHERE   s.type IN (2,3) AND 
                            s.supplier_code IS NOT NULL AND  
                            s.name !='' AND ( s.status = 1  OR  s.status = 0 ) AND 
                            s.company_id=" . $this->arrUser['company_id'] . " ";

            $Sql .= " AND " . $generatedSQL;
            $Sql .= " ORDER by s.id DESC";
            $response['generatedSql'] = $generatedSQL;
            $result = $this->objGeneral->any_query_exception($Sql);
            if ($result['ack'] == 0) {
                $response['ack'] = 0;
                $response['error'] = $result['error'];
                $response['query'] = $Sql;
                return $response;
            }
            $RS = $this->objsetup->CSI($Sql);

            if ($RS->RecordCount() > 0) {
                while ($Row = $RS->FetchRow()) {
                    $result = array();
                    $result['id'] = $Row['id'];
                    //$result['code'] = $Row['supplier_code'];
                    $result['Supplier No.'] = $Row['supplier_code'];
                    $result['Name'] = $Row['name'];
                    $result['City'] = $Row['primary_city'];
                    $result['County'] = $Row['primary_county'];
                    $result['Postcode'] = $Row['primary_postcode'];
                    $result['Country'] = $Row['primary_country_name'];
                    // $result['Contact Person'] = $Row['contact_person'];
                    $result['Territory'] = ucwords($Row['region']);
                    $result['Segment'] = ucwords($Row['segment']);
                    $result['Selling Group'] = ucwords($Row['selling_group']);
                    /* if ($attr['type'] == '1') {
                            $result['account_payable_id'] = $Row['account_payable_id'];//$Row['account_payable_id'];
                            $result['purchase_code_id'] = $Row['purchase_code_id'];//$Row['purchase_code_id'];
        
                            //$result['purchase_code'] = $Row['purchase_code'];
                            $result['purchase_code'] = $Row['purchaser_code'];
                            $result['county'] = $Row['primary_county'];
                            $result['address_1'] = $Row['primary_address_1'];
                            $result['address_2'] = $Row['primary_address_2'];
                            $result['country_id'] = $Row['country_id'];

                            $result['address_1'] = $Row['primary_address_1'];
                            $result['address_2'] = $Row['primary_address_2'];
                            $result['county'] = $Row['primary_county'];
        
                            $result['anumber'] = $Row['account_payable_number'];
                            $result['pnumber'] = $Row['purchase_code_number'];
                            $result['payment_method'] = $Row['payment_method_id'];
                            $result['payment_term'] = $Row['payment_terms_id'];
                            $result['currency_id'] = $Row['currency_id'];
                            $result['Contact Person'] = $Row['primaryc_name'];
                            //$result['Telephone '] = $Row['phone'];
                            $result['Fax'] = $Row['fax'];
                            $result['Email'] = $Row['email'];
                        } */
                    $response['response'][] = $result;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            } else {
                $response['response'] = array();
                $response['ack'] = 0;
                $response['error'] = NULL;
            }
        }
        $Sql = trim(preg_replace('/\s+/', ' ', $Sql));
        $response['sql'] = $Sql;
        return $response;
    }


    function createSQLQueryForFilter($attr)
    {
        //print_r($attr);exit;
        $new = '';
        $where_clause = '';
        $where_clause_loc = '';
        if (
            !empty($attr['array_dynamic_filter_product']) && !empty($attr['array_dynamic_filter_product'][0]->normal_filter->field_name) && !empty($attr['array_dynamic_filter_product'][0]->operator_filter->id) && (!empty($attr['array_dynamic_filter_product'][0]->operator_search) || $attr['array_dynamic_filter_product'][0]->operator_search == 0)
        ) {

            $count_location = 0;
            $count_record = 0;
            //print_r($attr[array_dynamic_filter_product]);exit;
            foreach ($attr['array_dynamic_filter_product'] as $item) {
                if ((!empty($item->normal_filter->field_name)) && (!empty($item->operator_filter->id)) && (!empty($item->operator_search) || $item->operator_search == 0)) {
                    $normal_filter = $operator_filter = $operator_search = $logical_filter = '';

                    if (!empty($item->normal_filter->foreign_key_name)) {
                        $normal_filter = $item->normal_filter->foreign_key_name;
                    } else {
                        $normal_filter = $item->normal_filter->field_name;
                    }

                    if (!empty($item->operator_filter->id)) {
                        if ($item->operator_filter->id == 1)
                            $operator_filter = 'IN';
                        else if ($item->operator_filter->id == 2)
                            $operator_filter = '=';
                        else if ($item->operator_filter->id == 3)
                            $operator_filter = 'LIKE';
                        else if ($item->operator_filter->id == 4)
                            $operator_filter = '>';
                        else if ($item->operator_filter->id == 5)
                            $operator_filter = '<';
                        else if ($item->operator_filter->id == 6)
                            $operator_filter = '>=';
                        else if ($item->operator_filter->id == 7)
                            $operator_filter = '<=';
                        else if ($item->operator_filter->id == 8)
                            $operator_filter = 'NOT IN';
                    }

                    if (!empty($item->operator_search) || $item->operator_search == 0) {
                        if (($item->operator_filter->id == 1) || ($item->operator_filter->id == 8)) {
                            //echo "1,8";exit;
                            if (!empty($item->normal_filter->foreign_key_id))
                                $normal_filter = $item->normal_filter->foreign_key_id;
                            $pieces = explode(",", $item->operator_search);
                            $new = "";
                            foreach ($pieces as $key => $value) {
                                if (!empty($value) || $value == 0)
                                    $new .= "'" . trim($value) . "'" . ',';
                            }
                            $new = substr($new, 0, -1);
                            $operator_search = "($new)";
                            if ($item->operator_filter->id == 8) {
                                $normal_filter = "(" . $normal_filter;
                                $operator_search =  $operator_search . " OR $normal_filter IS NULL ) ) ";
                            }
                        } else if ($item->operator_filter->id == 3) {
                            //echo "3";exit;
                            $operator_search = " '" . $item->operator_search . "%' ";
                        } else if ($item->operator_filter->id == 2) {
                            //echo "2";exit;
                            $operator_search = "'" . $item->operator_search . "'";
                        } else {
                            //echo "4,5,6,7";exit;
                            // id = 4,5,6,7 less than and greater than stuff...

                            $len = strlen($item->operator_search);
                            if ($item->normal_filter->is_numeric && $item->normal_filter->is_numeric == 1) {
                                $operator_search = " $item->operator_search ";
                                $normal_filter = "$normal_filter";
                            } else {
                                $operator_search = "'" . $item->operator_search . "'";
                                $normal_filter = "(substring($normal_filter,1,$len))";
                            }
                        }
                    }

                    if (!empty($item->logical_filter->id)) {
                        if ($item->logical_filter->id == 1)
                            $logical_filter = ') AND';
                        else if ($item->logical_filter->id == 2)
                            $logical_filter = ') OR';
                    }


                    // if($item->normal_filter->id<=5) 	
                    $count_record++;
                    if (!empty($item->normal_filter->field_name)) {
                        $where_clause = "(" . $where_clause;
                        $where_clause .= " $normal_filter  $operator_filter $operator_search $logical_filter   ";
                    }
                } else {
                    continue;
                }
            }
            $where_clause = '' . $where_clause;
            $where_clause .= ")  ";
        }


        if ($count_record == 0 && $attr['page'] != -1) {
            $response['response'][] = array();
            $response['ack'] = 0;
            $response['error'] = NULL;
            return $response;
            exit;
        }
        $response = array();
        // echo $where_clause;exit;
        return $where_clause;
    }

    function add_sale_bucket_product($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        $generatedSQL =  $this->createSQLQueryForFilter($attr);
        // echo '1 == '.$generatedSQL;
        $generatedSQL = str_replace("\\", "\\\\\\", $generatedSQL);
        // echo '2 == '.$generatedSQL;exit;
        //codemark 2
        $where_clause_loc2 = '';



        $chk = 0;
        $Sqli = "DELETE FROM bucket_filters WHERE module_id = '" . $attr['module_id'] . "' AND bucket_id= '" . $attr['bucket_id'] . "' ";
        // echo $Sqli;exit;
        $RS = $this->objsetup->CSI($Sqli);
        if ($this->Conn->Affected_Rows() > 0)
            $msg = 'Updated';
        else
            $msg = 'Inserted';

        // error_reporting(E_ERROR);

        // echo $msg;
        // echo '<pre>';print_r($attr);exit;

        // if (sizeof($attr['array_dynamic_filter_product']) == 1 && (empty($attr['array_dynamic_filter_product'][0]->normal_filter->field_name) || empty($attr['array_dynamic_filter_product'][0]->normal_filter->field_name)))

        /* if (sizeof($attr['array_dynamic_filter_product']) == 1 && (empty($item->normal_filter->field_name)) || (empty($item->operator_filter->id)) || (empty($item->operator_search))) {
                // means no filter is sent
                $response['ack'] = 1;
                $response['msg'] = 'Record Updated Successfully';
                return $response;
            } */

        $Sql = "INSERT INTO bucket_filters (bucket_id, module_id, sort_id,normal_filter,operator_filter,operator_search,  logical_filter,company_id,user_id,date_created,type,status, sql_filter) VALUES ";

        //print_r($attr[array_dynamic_filter_product]);exit;
        foreach ($attr['array_dynamic_filter_product'] as $item) {
            if ((!empty($item->normal_filter->field_name)) && (!empty($item->operator_filter->id)) && (!empty($item->operator_search) || $item->operator_search == 0)) {
                $Sql .= "('" . $attr['bucket_id'] . "' ,  '" . $attr['module_id'] . "' ,'" . $item->sort_id . "','" . $item->normal_filter->field_name . "','" . $item->operator_filter->id . "','" . $item->operator_search . "','" . $item->logical_filter->id . "','" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "'," . current_date . ",1,1, \"$generatedSQL\"), ";
                $chk++;
            }
        }
        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
        $response['sql'] = trim(preg_replace('/\s+/', ' ', $Sql));
        // echo '3 == '.$Sql;exit;
        $RS = $this->objsetup->CSI($Sql);


        if ($chk > 0) { // multiple filters are added
            // $where_clause = '';
            if (
                !empty($attr['array_dynamic_filter_product']) && !empty($attr['array_dynamic_filter_product'][0]->normal_filter->field_name) && !empty($attr['array_dynamic_filter_product'][0]->operator_filter->id) && !empty($attr['array_dynamic_filter_product'][0]->operator_search)
            ) {

                $where_clause = 'AND (';
                $count_location = 0;
                $count_record = 0;
                $searchFilter = '';

                foreach ($attr['array_dynamic_filter_product'] as $item) {

                    if ((!empty($item->normal_filter->field_name)) && (!empty($item->operator_filter->id)) && (!empty($item->operator_search) || $item->operator_search == 0)) {

                        $normal_filter = $operator_filter = $operator_search = $logical_filter = '';


                        if (!empty($item->operator_filter->id)) {
                            if ($item->operator_filter->id == 1)
                                $operator_filter = 'IN';
                            else if ($item->operator_filter->id == 2)
                                $operator_filter = '=';
                            else if ($item->operator_filter->id == 3)
                                $operator_filter = 'LIKE';
                            else if ($item->operator_filter->id == 4)
                                $operator_filter = '>';
                            else if ($item->operator_filter->id == 5)
                                $operator_filter = '<';
                            else if ($item->operator_filter->id == 6)
                                $operator_filter = '>=';
                            else if ($item->operator_filter->id == 7)
                                $operator_filter = '<=';
                            else if ($item->operator_filter->id == 8)
                                $operator_filter = 'NOT IN';
                        }

                        // echo '<pre>';print_r($item->operator_search);
                        // print_r($item->normal_filter->field_name);
                        // print_r($item->operator_filter->id);
                        // print_r($item->logical_filter);
                        // exit;

                        if (!empty($item->operator_search) || $item->operator_search == 0) {
                            if (($item->operator_filter->id == 1) || ($item->operator_filter->id == 8)) {

                                $pieces = explode(",", $item->operator_search);
                                foreach ($pieces as $key => $value) {
                                    if ($value)
                                        $searchFilter .= "'" . $value . "'" . ',';
                                }
                                $searchFilter = substr($searchFilter, 0, -1);
                                $operator_search = "($searchFilter)";
                            } else if ($item->operator_filter->id == 3)
                                $operator_search = " '" . $item->operator_search . "%' ";
                            else
                                $operator_search = "'" . $item->operator_search . "'";
                        }

                        if (!empty($item->logical_filter->id)) {
                            if ($item->logical_filter->id == 1)
                                $logical_filter = 'AND';
                            else if ($item->logical_filter->id == 2)
                                $logical_filter = 'OR';
                        }

                        // if($item->normal_filter->id<=5) 	
                        $count_record++;
                        // echo '1 == '.$where_clause;
                        // echo '<br> 1a == '.$item->normal_filter->field_name;
                        // echo '<br> 1b == '.$operator_filter;
                        // echo '<br> 1c == '.$operator_search;
                        // echo '<br> 1d == '.$logical_filter;
                        if (isset($item->normal_filter->field_name))
                            $where_clause .= $item->normal_filter->field_name . $operator_filter . $operator_search . $logical_filter;

                        // echo '2 == '.$where_clause; exit;
                    }
                }
                $where_clause .= " )  ";
            }
        }
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['msg'] = 'Record ' . $msg;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not ' . $msg;
        }


        return $response;
    }

    //----------------------sale_person----------------
    function get_crm_salesperson($arr_attr)
    {
        $type = $response = $order_by = "";

        if (!empty($arr_attr['type']))
            $type .= "and c.type = '" . $arr_attr['type'] . "' ";
        if (!empty($arr_attr['bucket_id']))
            $type .= "and c.bucket_id = '" . $arr_attr['bucket_id'] . "' ";


        $Sql = "SELECT c.* FROM crm_salesperson c WHERE c.module_id = '" . $arr_attr['id'] . "'  " . $type . " AND  c.end_date=0 ";


        $total_limit = pagination_limit;
        if ($arr_attr['pagination_limits'])
            $total_limit = $arr_attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($arr_attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
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

    function add_crm_salesperson($arr_attr)
    {

        if (!empty($arr_attr['bucket_id']))
            $type = "and bucket_id = '" . $arr_attr['bucket_id'] . "' ";

        $check = false;
        $Sql = "INSERT INTO crm_salesperson (module_id,salesperson_id,type,is_primary,company_id,  user_id,bucket_id,start_date) VALUES ";
        foreach ($arr_attr['salespersons'] as $item) {

            $Sql .= "(  '" . $arr_attr['id'] . "' ," . $item->id . " ," . $arr_attr['type'] . ",	'" . $item->isPrimary . "'	," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . ",'" . $arr_attr['bucket_id'] . "'	,'" . current_date . "' ), ";

            $check = true;
        }
        $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
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

    function update_crm_salesperson($arr_attr)
    {

        if (!empty($arr_attr['bucket_id']))
            $type = "and bucket_id = '" . $arr_attr['bucket_id'] . "' ";

        // print_r($arr_attr);exit;

        if (!empty($arr_attr['replace_sale_person']) || !empty($arr_attr['pre_sale_person']))
            $ck_value = true;

        //add selected  in bucket
        $check = false;
        $add_new_bucket_sql = "INSERT INTO crm_salesperson (module_id,salesperson_id,type,is_primary,company_id,  user_id,bucket_id,start_date) VALUES ";
        foreach ($arr_attr['salespersons'] as $item) {
            //if($ck_value>0 )
            $add_new_bucket_sql .= "(  '" . $arr_attr['id'] . "' ," . $item->id . " ," . $arr_attr['type'] . ",	'" . $item->isPrimary . "'	," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . ",'" . $arr_attr['bucket_id'] . "'	,'" . current_date . "' ), ";

            $check = true;
        }

        //replace delete sp in bucket
        $presql = "UPDATE crm_salesperson  SET  end_date='" . current_date . "'  
	    WHERE module_id='" . $arr_attr['id'] . "' AND type='" . $arr_attr['type'] . "'  ";
        // AND salesperson_id='". $arr_attr['pre_sale_person']  . "'   Limit 1 
        $this->objsetup->CSI($presql);

        //add new sp in bucket
        $addspsql = "INSERT INTO crm_salesperson (module_id,salesperson_id,type,is_primary,company_id,  user_id,bucket_id,start_date) VALUES (  '" . $arr_attr['id'] . "' ," . $arr_attr['replace_sale_person'] . " ," . $arr_attr['type'] . ",	'0'	," . $this->arrUser['company_id'] . "	," . $this->arrUser['id'] . ",'" . $arr_attr['bucket_id'] . "'	,'" . current_date . "' )  ";
        if ($ck_value > 0)
            $this->objsetup->CSI($addspsql);

        //add new array in bucket sp
        $add_new_bucket_sql = substr_replace(substr($add_new_bucket_sql, 0, -1), "", -1);
        $this->objsetup->CSI($add_new_bucket_sql);


        //replace  delete sp in crm
        $updatecrmsql = "UPDATE crm_salesperson 
                            SET  salesperson_id='" . $arr_attr['replace_sale_person'] . "',is_primary='$arr_attr[primary_sale_id]' 
                         WHERE bucket_id='" . $arr_attr['id'] . "' AND type='2'  AND salesperson_id='" . $arr_attr['pre_sale_person'] . "' AND 
                                salesperson_id!='" . $arr_attr['replace_sale_person'] . "'  AND end_date=0 
                         Limit 1 ";
        if ($ck_value > 0)
            $this->objsetup->CSI($updatecrmsql);


        if ($check) {
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not Insert';
        }
        return $response;
    }

    //----------------------crm_sale_person_bucket ----------------
    function get_sale_person_baket_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $order_by = $where_clause = "";


        if (!empty($attr['bk_id']))
            $where_clause .= "AND c.baket_id='$attr[bk_id]' ";


        $response = array();

        $Sql = "SELECT   c.* FROM  crm_sale_bucket_sp c
		JOIN company on company.id=c.company_id
		 where  c.status=1  
		 AND(c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")		 
		$where_clause
		 ";


        $total_limit = pagination_limit;

        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_by);
        //   echo $response['q'];  exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['baket_name'];

                $result['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
                $result['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);

                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'][] = array();

        return $response;
    }

    function get_sale_person_baket_data_by_id($id)
    {

        $Sql = "SELECT * FROM crm_sale_bucket_sp WHERE id=$id LIMIT 1";
        //	echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key))
                    unset($Row[$key]);
            }

            $Row['starting_date'] = $this->objGeneral->convert_unix_into_date($Row['starting_date']);
            $Row['ending_date'] = $this->objGeneral->convert_unix_into_date($Row['ending_date']);


            $response['response'] = $Row;
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else
            $response['response'] = array();

        //print_r($response);exit;
        return $response;
    }

    function add_sale_person_baket($arr_attr)
    {
        $this->objGeneral->mysql_clean($arr_attr);


        //	print_r($arr_attr);exit;
        $sdate = $this->objGeneral->convert_date($arr_attr['starting_date']);
        $edate = $this->objGeneral->convert_date($arr_attr['ending_date']);

        $id = $arr_attr['id'];

        $update_check = "";

        if ($id > 0)
            $update_check = "  AND tst.id <> '" . $id . "'";

        $data_pass = "  tst.status=1 AND tst.baket_name='" . $arr_attr['baket_name'] . "'
				 AND ((tst.starting_date >= '" . $sdate . "' AND tst.ending_date <= '" . $sdate . "') OR ( tst.starting_date >= '" . $edate . "' AND tst.ending_date <= '" . $edate . "'))
				 $update_check";

        $total = $this->objGeneral->count_duplicate_in_sql('crm_sale_bucket_sp', $data_pass, $this->arrUser['company_id']);


        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

        if ($id == 0) {

            $Sql = "INSERT INTO crm_sale_bucket_sp
						SET  
						baket_id='$arr_attr[baket_id]' ,baket_name='$arr_attr[baket_name]' 	
						,starting_date = '" . $sdate . "',ending_date = '" . $edate . "'
						,company_id='" . $this->arrUser['company_id'] . "'
						,user_id='" . $this->arrUser['id'] . "',created_date='" . current_date . "'	,status=1
						";
            $msg = 'Inserted';
        } else {
            $Sql = "UPDATE crm_sale_bucket_sp 
				SET  baket_id='$arr_attr[baket_id]' ,baket_name='$arr_attr[baket_name]' 
				,starting_date = '" . $sdate . "',ending_date = '" . $edate . "'	WHERE id = $id Limit 1 ";
            $msg = 'Updated';
        }

        //echo $Sql;exit;
        $rs = $this->objsetup->CSI($Sql);
        if ($id == 0)
            $id = $this->Conn->Insert_ID();


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['id'] = $id;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not ' . $msg;
        }
        return $response;
    }
}
