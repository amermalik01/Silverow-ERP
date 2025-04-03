<?
require_once("adodb/adodb.inc.php");
require_once("adodb/adodb-errorhandler.inc.php");
/**
 * This Class Works As Bridge Between AdoDb Connection and Other Classes
 *
 */

class Database{
	
	private $DbHost;
	private $DbName;
	private $DbUser;
	private $DbPwd;
	private $DbType;	
	static  $Counter=0;
	private $Conn;
	private $ConnTrace;
	// private $ConnReport;
	static  $SelfInstance;

	/**
	 * Constructor of the Class
	 * This Will also set ADODB Connection Object in its Property
	 *
	 */
 	public function __construct(){  	
 		
	  	$this->DbHost=DATABASE_HOST;
	  	$this->DbName=DATABASE_NAME;
	  	$this->DbUser=DATABASE_USER;
	  	$this->DbPwd=DATABASE_PASSWORD;
	  	$this->DbType=DATABASE_TYPE;
		$this->Conn = ADONewConnection($this->DbType);			
		$this->Conn->Connect($this->DbHost, $this->DbUser, $this->DbPwd, $this->DbName);
		/* $this->Conn->execute("GRANT ALL PRIVILEGES ON `ebdb`.* TO `ulvm5uotocpbe`@`aafwl3rulabis.cggfbf9xic5k.us-east-1.rds.amazonaws.com` IDENTIFIED BY PASSWORD 'dbwmqgzwoqralw' WITH GRANT OPTION");
		
		// $this->Conn->execute("CREATE USER 'ulvm5uotocpbe'@'aafwl3rulabis.cggfbf9xic5k.us-east-1.rds.amazonaws.com' IDENTIFIED BY 'dbwmqgzwoqralw'");
		// $this->Conn->execute("GRANT ALL ON `ebdb`.* TO 'ulvm5uotocpbe'@'*'");
		// $this->Conn->execute('GRANT ALL PRIVILEGES ON `silverow_silverowuk`.* TO `silverow_silverowuk`@`localhost`');
		$this->Conn->execute('SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED');
		$this->Conn->execute('SET GlOBAL TRANSACTION ISOLATION LEVEL READ UNCOMMITTED'); */
		$this->ConnTrace = ADONewConnection($this->DbType);			
		$this->ConnTrace->Connect($this->DbHost, $this->DbUser, $this->DbPwd, $this->DbName);

		$this->ConnReport = ADONewConnection($this->DbType);			
		$this->ConnReport->PConnect($this->DbHost, $this->DbUser, $this->DbPwd, $this->DbName);

		$this->Conn->debug=false;
		// $this->ConnTrace->debug=false;
		// $this->ConnReport->debug=false;
		self::$Counter++;
		// print "<li>Connection: Open ".self::$Counter."</li>";
	}
  
	/**
	 * This function Check if there is an instance of this class already avaialable
	 * Then return ADODB connection Object from that instance.
	 * Otherwise try to create new instance and return ADODB connection
	 *
	 * @return ADODB Connection Object
	 */
	
	static function ConnectDb(){   
        //print "<li>Attemp To Open Connection</li>";   
        if (!isset(self::$SelfInstance)) {
            $c = __CLASS__;
            self::$SelfInstance = new $c;           
        } // if
 		return self::$SelfInstance->Conn;
	}
	static function ConnectDbTrace(){   
        //print "<li>Attemp To Open Connection</li>";   
        if (!isset(self::$SelfInstance)) {
            $d = __CLASS__;
            self::$SelfInstance = new $d;           
        } // if
 		return self::$SelfInstance->ConnTrace;
	}
	/* static function ConnectDbReport(){    
        if (!isset(self::$SelfInstance)) {
            $e = __CLASS__;
            self::$SelfInstance = new $e;           
        } // if
 		return self::$SelfInstance->ConnReport;
	} */
	
	/**
	 * Desctruct of the database class
	 *
	 */
	public function __destruct(){
		unset($this->DbHost);
		unset($this->DbName);
		unset($this->DbUser);
		unset($this->DbPwd);
		unset($this->DbType);
	  	
		if (isset($this->Conn)){
			$this->Conn->Close();
			     
        // $this->Conn->execute('SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ');
			//print "<li>Connection Closed</li>";
		}  	
		if (isset($this->ConnTrace)){
			$this->ConnTrace->Close();
		}
		/* if (isset($this->ConnReport)){
			$this->ConnReport->Close();
		} */
	}

}
?>