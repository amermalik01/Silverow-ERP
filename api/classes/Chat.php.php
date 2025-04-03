<?php
require_once(SERVER_PATH."/classes/Xtreme.php");
require_once(SERVER_PATH."/classes/General.php");

//require_once(SERVER_PATH."/classes/Auth.php");

class Chat extends Xtreme{ 

	private $Conn = null;
	private $objGeneral = null;
	private $arrUser = null;
	
	function __construct($user_info=array()){
		parent::__construct();
		$this->Conn = parent::GetConnection();
		$this->objGeneral = new General($user_info);
		$this->arrUser = $user_info;
		
	}
	
	
	function get_admin_user($attr) {
		
        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);

		$Sql = "SELECT es.id,es.first_name,es.last_name
		from employees es 
		left JOIN company on company.id=es.user_company 
		where es.status=1 and  es.id!= $UserId
		and (es.user_company=" . $this->arrUser['company_id'] . " 	or  company.parent_id=" . $this->arrUser['company_id'] . ")
		ORDER BY es.id ASC";
		//echo $Sql;exit;
        $RSEmployees = $this->Conn->Execute($Sql);
        if ($RSEmployees->RecordCount() > 0) {
            while ($rowEmployee = $RSEmployees->FetchRow()) {
                
					$result['name']  = $rowEmployee['first_name'] . " " . $rowEmployee['last_name'];
					$result['name1']  = $rowEmployee['first_name'] ;
					$response['response'][] = $result; 
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        }
		else   $response['response'][] = array();
       
		
		
		return $response;
    }
	
	
	
	
	
	
		
}