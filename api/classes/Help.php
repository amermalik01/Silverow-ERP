<?php

require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/class.phpmailer.php");

class Help extends Xtreme {

    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;

    function __construct($user_info = array()) {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->arrUser = $user_info;
    }

    function getAllParents($attr) {

        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT * FROM help WHERE parent = 0 AND status = 1";
        $RS = $this->Conn->Execute($Sql);
        $sql_total = "SELECT COUNT(*) as total FROM ($Sql) as tabless";
        $rs_count = $this->Conn->Execute($sql_total);
        $total = $rs_count->fields['total'];
        $results = array();
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {

                $SqlChild = "SELECT * FROM help WHERE parent = " . $row['id'] . " AND status = 1";
                $RSChild = $this->Conn->Execute($SqlChild);
                
                $results['parents'][] = array('id' => $row['id'], 'name' => $row['name'], 'description' => $row['description'], 'childs' => $ChildTotal);
                if ($ChildTotal > 0) {
                    $results['childs'][$row['id']] = self::getChild(array('pid' => $row['id']));
                }
            }
        }
        return $results;
    }

    function getChild($attr) {

        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);
        $pid = (isset($attr['pid'])) ? trim(stripslashes(strip_tags($attr['pid']))) : '';

        $Sql = "SELECT * FROM help WHERE parent = " . $pid . " AND status = 1";
        $RS = $this->Conn->Execute($Sql);
        
        $results = array();
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $SqlChild = "SELECT * FROM help WHERE parent = " . $row['id'] . " AND status = 1";
                $RSChild = $this->Conn->Execute($SqlChild);
               /*  $SqlChildTotal = "SELECT COUNT(*) as total FROM ($SqlChild) as tabless";
                $RSChildCount = $this->Conn->Execute($SqlChildTotal);
                $ChildTotal = $RSChildCount->fields['total']; */
                $results[$row['id']] = array('id' => $row['id'], 'name' => $row['name'], 'description' => $row['description'], 'parent' => $pid, 'childs' => $ChildTotal);
                if ($ChildTotal > 0) {
                    $results[$row['id']]['items'] = self::getChild(array('pid' => $row['id']));
                }
            }
        }

        return $results;
    }

    function getSearch($attr) {

        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);
        $keywords = (isset($attr['keywords'])) ? trim(stripslashes(strip_tags($attr['keywords']))) : '';

        $Sql = "SELECT * FROM help WHERE (name LIKE '%$keywords%' OR description LIKE '%$keywords%') AND status = 1";
        $RS = $this->Conn->Execute($Sql);
        
        $results = array();
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $results[] = array('id' => $row['id'], 'name' => $row['name'], 'description' => $row['description'], 'parent' => $pid, 'childs' => $ChildTotal);
            }
        }

        return $results;
    }

    function addHelp($attr) {

        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);
        $name = (isset($attr['name'])) ? trim(stripslashes(strip_tags($attr['name']))) : '';
        $description = (isset($attr['description'])) ? trim(stripslashes(strip_tags($attr['description']))) : '';
        $parent = (isset($attr['parent']) && trim($attr['parent']) != "") ? trim(stripslashes(strip_tags($attr['parent']))) : 0;
        $results = array();
		
		
 		
 $data_pass = " tst.email='$name' ";
        $total = $this->objGeneral->count_duplicate_in_sql('help', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }

		
        $Sql = "INSERT INTO help (name, description, parent, status) VALUES ('$name', '$description', $parent, 1)";
        $RS = $this->Conn->Execute($Sql);
        return $results;
    }

    function getAllItems($attr) {
        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT * FROM help WHERE status = 1";
        $RS = $this->Conn->Execute($Sql);
       
        $results = array();
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $results[] = array('id' => $row['id'], 'name' => $row['name'], 'parent' => $pid);
            }
        }

        return $results;
    }
    
    function deleteHelp($attr){
        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);
        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $results = array();
        $Sql = "UPDATE help SET status=0 WHERE id=$id";
        $RS = $this->Conn->Execute($Sql);
        return $results;
    }
    
    function editHelp($attr){
        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);
        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $name = (isset($attr['name'])) ? trim(stripslashes(strip_tags($attr['name']))) : '';
        $description = (isset($attr['description'])) ? trim(stripslashes(strip_tags($attr['description']))) : '';
        $parent = (isset($attr['parent']) && trim($attr['parent']) != "") ? trim(stripslashes(strip_tags($attr['parent']))) : 0;
        $results = array();
		
		 if($attr['id']>0)   $where_id = " AND tst.id <> '".$attr['id']."' ";
		
 $data_pass = " tst.email='$name' $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('help', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;exit;
        }

        $Sql = "UPDATE help SET name='$name', description='$description', parent=$parent WHERE id=$id";
        $RS = $this->Conn->Execute($Sql);
        return $results;
    }
    
    function getHelp($attr){
        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);
        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';

        $Sql = "SELECT * FROM help WHERE id=$id AND status = 1";
        $RS = $this->Conn->Execute($Sql);
         
        $results = array();
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $results = array('id' => $row['id'], 'name' => $row['name'], 'description' => $row['description'], 'parent' => $row['parent']);
            }
        }
        return $results;
    }

}
