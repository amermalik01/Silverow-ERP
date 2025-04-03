<?php
require_once(SERVER_PATH."/classes/DataBase.php");
class Xtreme{
	private $Conn;
	private $ConnTrace;
	// private $ConnReport;
	
	function __construct(){
		$this->Conn=Database::ConnectDb();
		$this->ConnTrace=Database::ConnectDbTrace();
		// $this->ConnReport=Database::ConnectDbReport();
	}

	/* 
	private $Database;
	
	function __construct($user_info = array()){
		// Database::__construct();
		$this->Database = new Database($user_info);
		$this->Conn=$this->Database::ConnectDb();
		$this->ConnTrace=$this->Database::ConnectDbTrace();
		// $this->ConnReport=Database::ConnectDbReport();
	}
	 */
	function GetConnection()
	{		
		return $this->Conn;	
	}
	function GetTraceConnection()
	{		
		return $this->ConnTrace;	
	}
	/* function GetReportConnection()
	{		
		return $this->ConnReport;	
	} */
}
<<<<<<< HEAD
?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
