<?php

//error_reporting(E_ALL);

require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Imap.php");
require_once(SERVER_PATH . "/classes/Setup.php");
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require(SERVER_PATH . "/vendor/sendgrid-php/sendgrid-php.php");
//require_once(SERVER_PATH . "/classes/class.phpmailer.php");
require 'vendor/autoload.php';

//require_once(SERVER_PATH . "/classes/Email.php");

class Mail extends Xtreme
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
        $this->objsetup = new Setup($user_info);
        $this->arrUser = $user_info;
        $this->sendgrid = new \SendGrid('SG.U1fh-cwZQfSPoO8WzzWe0w.0w0gH1UCAQEPbOsnipbF0iU0SPzJpGNU8C1CCPg03h0');


    }

    function getFolders()
    {
        $result = array();
        $isConfig = self::isConfigurationExist();
        if ($isConfig['total'] > 0) {
            $CC = self::getClientConfiguration();
            $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], 'INBOX', $CC['imapport'], 'notls');
            $result = $imap->returnImapMailBoxes();
        }
        return $result;
    }

    function isConfigurationExist()
    {

        $result = array();
        $UserId = $this->arrUser['id'];
        $Sql = "SELECT * FROM client_configuration WHERE user_id=$UserId and  status=1";
        $RS = $this->objsetup->CSI($Sql);

        $sql_total = "SELECT COUNT(*) as total FROM ($Sql) as tabless";
        $rs_count = $this->objsetup->CSI($sql_total);

        $total = $rs_count->fields['total'];
        $result['total'] = $total;

        return $result;
    }

    function isConfigValid()
    {
        $result = array();
        $CC = self::isConfigurationExist();
        if ($CC['total'] == 0) {
            $result['validconfig'] = 0;
        } else {
            $isConfigValid = self::isIMAPConfigValid();
            if ($isConfigValid['valid'] == 0) {
                $result['validconfig'] = 0;
            } else {
                $result['validconfig'] = 1;
            }
        }
        return $result;
    }

    function addClientConfiguration($attr)
    {

        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);

        /* $username = (isset($attr['username'])) ? trim(stripslashes(strip_tags($attr['username']))) : '';
        $mailDomain = (isset($attr['mailDomain'])) ? trim(stripslashes(strip_tags($attr['mailDomain']))) : '';
        $password = (isset($attr['password'])) ? trim(stripslashes(strip_tags($attr['password']))) : '';
        $pop3server = (isset($attr['pop3server'])) ? trim(stripslashes(strip_tags($attr['pop3server']))) : '';
        $pop3port = (isset($attr['pop3port'])) ? trim(stripslashes(strip_tags($attr['pop3port']))) : 'null';
        $pop3ssl = (isset($attr['pop3ssl'])) ? trim(stripslashes(strip_tags($attr['pop3ssl']))) : '';
        $pop3spa = (isset($attr['pop3spa'])) ? trim(stripslashes(strip_tags($attr['pop3spa']))) : '';
        $imapserver = (isset($attr['imapserver'])) ? trim(stripslashes(strip_tags($attr['imapserver']))) : '';
        $imapport = (isset($attr['imapport'])) ? trim(stripslashes(strip_tags($attr['imapport']))) : 'null';
        $imapssl = (isset($attr['imapssl'])) ? trim(stripslashes(strip_tags($attr['imapssl']))) : '';
        $imapspa = (isset($attr['imapspa'])) ? trim(stripslashes(strip_tags($attr['imapspa']))) : '';
        $smtpserver = (isset($attr['smtpserver'])) ? trim(stripslashes(strip_tags($attr['smtpserver']))) : '';
        $smtpport = (isset($attr['smtpport'])) ? trim(stripslashes(strip_tags($attr['smtpport']))) : 'null';
        $smtpssl = (isset($attr['smtpssl'])) ? trim(stripslashes(strip_tags($attr['smtpssl']))) : '';
        $smtpspa = (isset($attr['smtpspa'])) ? trim(stripslashes(strip_tags($attr['smtpspa']))) : '';
        $smtpauth = (isset($attr['smtpauth'])) ? trim(stripslashes(strip_tags($attr['smtpauth']))) : '';
        $alias = (isset($attr['alias'])) ? trim(stripslashes(strip_tags($attr['alias']))) : '';
        $signature = (isset($attr['signature'])) ? $attr['signature'] : ''; */

        $username = $attr['username'];
        $mailDomain = $attr['mailDomain'];
        $password = $attr['password'];
        $pop3server = $attr['pop3server'];
        $pop3port = $this->objGeneral->emptyToZero($attr['pop3port']);
        $pop3ssl = $attr['pop3ssl'];
        $pop3spa = $attr['pop3spa'];
        $imapserver = $attr['imapserver'];
        $imapport = $this->objGeneral->emptyToZero($attr['imapport']);
        $imapssl = $attr['imapssl'];
        $imapspa = $attr['imapspa'];
        $smtpserver = $attr['smtpserver'];
        $smtpport = $this->objGeneral->emptyToZero($attr['smtpport']);
        $smtpssl = $attr['smtpssl'];
        $smtpspa = $attr['smtpspa'];
        $smtpauth = $attr['smtpauth'];
        $alias = $attr['alias'];
        $signature = $attr['signature'];

        $result = array('isError' => 0, 'errorMessage' => '');
        $SqlS = "SELECT * FROM client_configuration WHERE mailDomain='$mailDomain' and status = 1 AND company_id = '" . $this->arrUser['company_id'] . "'";
        $RSS = $this->objsetup->CSI($SqlS);
        // $sql_total = "SELECT COUNT(*) as total FROM ($SqlS) as tabless";
        // $rs_count = $this->objsetup->CSI($sql_total);
        // $total = $rs_count->fields['total'];
        if ($RSS->RecordCount() > 0) {
            $result = array('isError' => 1, 'duplicateCheck' => 1, 'errorMessage' => 'Domain Already Exists.');
        } else {
            $Sql = "INSERT INTO client_configuration (user_id, mailDomain, primaryConfiguration, username, password, pop3server, pop3port, pop3ssl, pop3spa, imapserver, imapport, imapssl, imapspa, smtpserver, smtpport, smtpssl, smtpspa, smtpauth, alias, signature, company_id) VALUES "
                . "($UserId, '$mailDomain', '".$this->objGeneral->emptyToZero($attr['primaryConfiguration'])."', '".$username."', '$password', '".$pop3server."', ".$pop3port.", '$pop3ssl', '$pop3spa', '".$imapserver."', ".$imapport.", '$imapssl', '$imapspa',"
                . " '".$smtpserver."', ".$smtpport.", '$smtpssl', '$smtpspa', '".$smtpauth."', '".$alias."', '".$signature."', '" . $this->arrUser['company_id'] . "' );";
                //echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            $lastId = $this->Conn->Insert_ID();

            if ($lastId > 0){
                if ($attr['primaryConfiguration']){
                    $Sql = "UPDATE client_configuration SET primaryConfiguration = 0 WHERE company_id = '".$this->arrUser['company_id']."' AND id <> $lastId ;";
                    $RS = $this->objsetup->CSI($Sql);
                }
                $result['ack'] = 1;
                $result['error'] = null;
            }
            else{
                $result['ack'] = 0;
                $result['duplicateCheck'] = 1;
                $result['error'] = "Domain Already Exists.";
            }
        }
        


        return $result;
    }

    function updateClientConfiguration($attr)
    {
        $UserId = $this->arrUser['id'];
         $this->objGeneral->mysql_clean($attr);
        //echo '<pre>';print_r($attr);exit;
        /* $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $username = (isset($attr['username'])) ? trim(stripslashes(strip_tags($attr['username']))) : '';
        $mailDomain = (isset($attr['mailDomain'])) ? trim(stripslashes(strip_tags($attr['mailDomain']))) : '';
        $password = (isset($attr['password'])) ? trim(stripslashes(strip_tags($attr['password']))) : '';
        $pop3server = (isset($attr['pop3server'])) ? trim(stripslashes(strip_tags($attr['pop3server']))) : '';
        $pop3port = (isset($attr['pop3port'])) ? trim(stripslashes(strip_tags($attr['pop3port']))) : null;
        $pop3ssl = (isset($attr['pop3ssl'])) ? trim(stripslashes(strip_tags($attr['pop3ssl']))) : '';
        $pop3spa = (isset($attr['pop3spa'])) ? trim(stripslashes(strip_tags($attr['pop3spa']))) : '';
        $imapserver = (isset($attr['imapserver'])) ? trim(stripslashes(strip_tags($attr['imapserver']))) : '';
        $imapport = (isset($attr['imapport'])) ? trim(stripslashes(strip_tags($attr['imapport']))) : null;
        $imapssl = (isset($attr['imapssl'])) ? trim(stripslashes(strip_tags($attr['imapssl']))) : '';
        $imapspa = (isset($attr['imapspa'])) ? trim(stripslashes(strip_tags($attr['imapspa']))) : '';
        $smtpserver = (isset($attr['smtpserver'])) ? trim(stripslashes(strip_tags($attr['smtpserver']))) : '';
        $smtpport = (isset($attr['smtpport'])) ? trim(stripslashes(strip_tags($attr['smtpport']))) : null;
        $smtpssl = (isset($attr['smtpssl'])) ? trim(stripslashes(strip_tags($attr['smtpssl']))) : '';
        $smtpspa = (isset($attr['smtpspa'])) ? trim(stripslashes(strip_tags($attr['smtpspa']))) : '';
        $smtpauth = (isset($attr['smtpauth'])) ? trim(stripslashes(strip_tags($attr['smtpauth']))) : '';
        $alias = (isset($attr['alias'])) ? trim(stripslashes(strip_tags($attr['alias']))) : '';
        $signature = (isset($attr['signature'])) ? $attr['signature'] : ''; */

        $id = $attr['id'];
        $username = $attr['username'];
        $mailDomain = $attr['mailDomain'];
        $password = $attr['password'];
        $pop3server = $attr['pop3server'];
        $pop3port = $this->objGeneral->emptyToZero($attr['pop3port']);
        $pop3ssl = $attr['pop3ssl'];
        $pop3spa = $attr['pop3spa'];
        $imapserver = $attr['imapserver'];
        $imapport = $this->objGeneral->emptyToZero($attr['imapport']);
        $imapssl = $attr['imapssl'];
        $imapspa = $attr['imapspa'];
        $smtpserver = $attr['smtpserver'];
        $smtpport = $this->objGeneral->emptyToZero($attr['smtpport']);
        $smtpssl = $attr['smtpssl'];
        $smtpspa = $attr['smtpspa'];
        $smtpauth = $attr['smtpauth'];
        $alias = $attr['alias'];
        $signature = $attr['signature'];
        $response['result'] = array('isError' => 0, 'errorMessage' => '');

        $SqlS = "SELECT * FROM client_configuration WHERE id <> '$id' and mailDomain='$mailDomain' AND company_id = '" . $this->arrUser['company_id'] . "'";
        $RSS = $this->objsetup->CSI($SqlS);
        if ($RSS->RecordCount() > 0) {
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['duplicateCheck'] = 1;
            $response['error'] = 'Domain Already Exists.';
        } else {
            $Sql = "UPDATE client_configuration SET primaryConfiguration = '".$this->objGeneral->emptyToZero($attr['primaryConfiguration'])."', mailDomain='$mailDomain', username='$username', password='$password', pop3server='$pop3server', pop3port='$pop3port', pop3ssl='$pop3ssl'"
                . ", pop3spa='$pop3spa', imapserver='$imapserver', imapport='$imapport', imapssl='$imapssl', imapspa='$imapspa', smtpserver='$smtpserver', "
                . "smtpport='$smtpport', smtpssl='$smtpssl', smtpspa='$smtpspa', smtpauth='$smtpauth', alias='$alias', signature='$signature' WHERE id=$id";
                //  echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            if ($this->Conn->Affected_Rows() > 0) {
                if ($attr['primaryConfiguration']){
                    $Sql = "UPDATE client_configuration SET primaryConfiguration = 0 WHERE company_id = '".$this->arrUser['company_id']."' AND id <> $id ;";
                    $RS = $this->objsetup->CSI($Sql);
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['error'] = 'Record Updated Successfully';
            }
            else{
                $response['ack'] = 0;
                $response['error'] = NULL;
                $response['error'] = 'Record Updated Successfully';
            }
        }

        return $response;
    }

    function addVirtualEmail($attr){
        $attr = $attr['data'];
        $dupChk = "";
        if ($attr->id){
            $dupChk = "id <> '".$attr->id."' and ";
        }
        $dupChkQuery = "SELECT id FROM virtual_emails WHERE
                                            $dupChk
                                            username = '".addslashes($attr->username)."' ;";
        $RS = $this->objsetup->CSI($dupChkQuery);
        if ($RS->RecordCount() > 0) {
            $response['ack'] = 0;
            $response['duplicate'] = 1;
            $response['error'] = "Virtual Email already exists!";
            return $response;
        }


        if ($attr->id){
            // password = '".$attr->password."',
            // configurationId = '".$attr->mailDomain->id."'
            $Sql = "UPDATE virtual_emails SET
                            alias = '".addslashes($attr->alias)."',
                            username = '".addslashes($attr->username)."'
                        WHERE
                            id = ".$attr->id.";
            ";
        }
        else{
            // password = '".$attr->password."',
            //                     configurationId = '".$attr->mailDomain->id."',
            $Sql = "INSERT INTO virtual_emails SET
                                alias = '".addslashes($attr->alias)."',
                                username = '".addslashes($attr->username)."',
                                company_id = '".$this->arrUser['company_id']."' ;";
            // $Sql = "SELECT id, mailDomain FROM client_configuration WHERE mailDomain <> '' and mailDomain is not null and company_id = " . $this->arrUser['company_id'] .  " ";

        }
        //echo $Sql;exit;
        
        $RS = $this->objsetup->CSI($Sql);

        if ($attr->id){
            if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
            }
            else{
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['message'] = "Record Updated Successfully";
            }
        }
        else{
            $attr->id = $this->Conn->insert_id();
            if ($attr->id){
                $response['ack'] = 1;
                $response['error'] = NULL;
            }
            else{
                $response['ack'] = 0;
                $response['error'] = NULL;
                $response['message'] = "Record not saved!";
            }
        }


        $deleteMembersSql = "DELETE FROM virtual_email_members WHERE virtual_email_id = ".$attr->id." ";
        $RS = $this->objsetup->CSI($deleteMembersSql);

        if ($attr->selectedEmployees){
            $arrSelectedEmployees = explode(",",$attr->selectedEmployees);

            $values = "";
            for ($i = 0; $i < sizeof($arrSelectedEmployees); $i++){
                $values .= ($i > 0) ? "," : "";
                $values .= "($attr->id, $arrSelectedEmployees[$i],".$this->arrUser['company_id'].")" ;
            }

            $insertMembersSql = "INSERT INTO virtual_email_members (virtual_email_id, employee_id, company_id)
                VALUES
                    $values
                
                
                ";
                
            // echo $insertMembersSql;exit;
            $RS = $this->objsetup->CSI($insertMembersSql);
        }
        
        return $response;
    }

    function getVirtualAccounts (){
        $Sql = "SELECT ve.*, GROUP_CONCAT(memb.employee_Id) as selectedEmployees
            FROM virtual_emails ve
            LEFT JOIN virtual_email_members memb ON memb.virtual_email_id = ve.id
         WHERE ve.company_id = '" . $this->arrUser['company_id'] .  "'
            AND memb.employee_id = " . $this->arrUser['id'] . "
         GROUP by ve.id;";
        //  echo $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        // print_r($RS);exit;

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }

                $Row['virtualEmail'] = $Row['username'];
                $response['response'][] = $Row;
            }
        } else {
            $response['response'] = array();
        }

        $primaryConfig = $this->getPrimaryConfiguration();
        $response['primaryConfigValidity'] = $primaryConfig['smtpserver'] && $primaryConfig['smtpport'] ? 1 : 0;
 
        return $response;
    }

    function getAllVirtualEmailsWithConfiguration(){

        $Sql = "SELECT ve.*, cc.*, ve.alias as virtualEmailAlias, ve.company_id as virtualEmailCompanyId, ve.id as virtualEmailId, CONCAT(ve.username, '@', cc.mailDomain) as virtualEmailAddress, ve.password as virtualEmailPassword, (SELECT max(message_id) FROM email_save where virtualEmail = ve.id ) as lastUID
            FROM virtual_emails ve
            LEFT JOIN client_configuration cc ON ve.configurationId = cc.id
         GROUP by ve.id;";
        //  echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
        } else {
            $response['response'][] = array();
        }

        return $response;
    }

    function getVirtualEmailsWithConfiguration(){

        $Sql = "SELECT ve.*, cc.*, ve.alias as virtualEmailAlias, ve.id as virtualEmailId, CONCAT(ve.username, '@', cc.mailDomain) as virtualEmailAddress, ve.password as virtualEmailPassword
            FROM virtual_emails ve
            LEFT JOIN client_configuration cc ON ve.configurationId = cc.id
         WHERE ve.company_id = '" . $this->arrUser['company_id'] .  "'
         GROUP by ve.id;";
        //  echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
        } else {
            $response['response'][] = array();
        }

        return $response;
    }





    function getVirtualEmails(){

        $Sql = "SELECT ve.*, GROUP_CONCAT(memb.employee_Id) as selectedEmployees
            FROM virtual_emails ve
            LEFT JOIN virtual_email_members memb ON memb.virtual_email_id = ve.id
         WHERE ve.company_id = '" . $this->arrUser['company_id'] .  "'
         GROUP by ve.id;";
        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
        } else {
            $response['response'] = array();
        }

        require_once(SERVER_PATH . "/classes/Hr.php");        
            $this->objHr = new Hr($this->arrUser);           

        $allEmployees = $this->objHr->get_employees(array(),1);
        //print_r($result11['response']);exit;
        for ($i = 0; $i < sizeof($allEmployees['response']); $i++){
            foreach($allEmployees['response'][$i] as $key => $value)
            {
                if ($key == "code"){
                    
                    $tempArray = array("Employee No." => $value);
                    $allEmployees['response'][$i] = $tempArray + $allEmployees['response'][$i];
                    unset($allEmployees['response'][$i][$key]);
                }
                
            }
        }
        $response['allEmployees'] = $allEmployees;

        return $response;
    }

    function getDomains(){
        $Sql = "SELECT id, mailDomain FROM client_configuration WHERE status = 1 and mailDomain <> '' and mailDomain is not null and company_id = " . $this->arrUser['company_id'] .  " ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;

    }

    function getClientConfiguration()
    {
        $UserId = $this->arrUser['id'];
        $Sql = "SELECT * FROM client_configuration WHERE user_id = $UserId and  status=1 ORDER BY id DESC";
        $RS = $this->objsetup->CSI($Sql);
        $sql_total = "SELECT COUNT(*) as total FROM ($Sql) as tabless";
        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];
        $results = array();
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $results = array('username' => $row['username'], 'password' => $row['password'], 'pop3server' => $row['pop3server'],
                    'pop3port' => $row['pop3port'], 'pop3ssl' => $row['pop3ssl'], 'pop3spa' => $row['pop3spa'], 'imapserver' => $row['imapserver'],
                    'imapport' => $row['imapport'], 'imapssl' => $row['imapssl'], 'imapspa' => $row['imapspa'], 'smtpserver' => $row['smtpserver'],
                    'smtpport' => $row['smtpport'], 'smtpssl' => $row['smtpssl'], 'smtpspa' => $row['smtpspa'], 'smtpauth' => $row['smtpauth'], 'alias' => $row['alias']);
            }
        }
        return $results;
    }

    function getMailConfigurationById($attr)
    {

        // codemark mail 2
        //$this->objGeneral->mysql_clean($attr);
        $Id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $Sql = "SELECT * FROM client_configuration WHERE id = $Id LIMIT 1"; //and  status=1
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $sql_total = "SELECT COUNT(*) as total FROM ($Sql) as tabless";
        $rs_count = $this->objsetup->CSI($sql_total);
        $total = $rs_count->fields['total'];
        $results = array();
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $results = array('id' => $row['id'], 'mailDomain' => $row['mailDomain'], 'username' => $row['username'], 'password' => $row['password'], 'pop3server' => $row['pop3server'],
                    'pop3port' => $row['pop3port'], 'pop3ssl' => $row['pop3ssl'], 'pop3spa' => $row['pop3spa'], 'imapserver' => $row['imapserver'],
                    'imapport' => $row['imapport'], 'imapssl' => $row['imapssl'], 'imapspa' => $row['imapspa'], 'smtpserver' => $row['smtpserver'],
                    'smtpport' => $row['smtpport'], 'smtpssl' => $row['smtpssl'], 'smtpspa' => $row['smtpspa'], 'smtpauth' => $row['smtpauth'], 'alias' => $row['alias'], 'signature' => $row['signature']);
            }
        }
        return $results;
    }

    function deleteMail($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        $Id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $SqlDel = "Update   client_configuration  SET status=0 WHERE id=$Id";
        // echo $SqlDel;exit;
        $RSdEL = $this->objsetup->CSI($SqlDel);
        $response = [];
        if ($this->Conn->Affected_Rows() > 0) {
                
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['error'] = 'Record Deleted Successfully';
            }
            else{
                $response['ack'] = 0;
                $response['error'] = NULL;
                $response['error'] = 'Record cann\'t be deleted!';
            }

        return $response;
    }

    function deleteVirtualMail($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        $Id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $SqlDel = "DELETE FROM virtual_emails WHERE id=$Id";
        // echo $SqlDel;exit;
        $RSdEL = $this->objsetup->CSI($SqlDel);
        $response = [];
        if ($this->Conn->Affected_Rows() > 0) {

            $SqlDel = "DELETE FROM virtual_email_members WHERE virtual_email_id = $Id;";
            $RSdEL = $this->objsetup->CSI($SqlDel);
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Deleted Successfully';
        }
        else{
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['error'] = 'Record cann\'t be deleted!';
        }

        return $response;
    }

    function isIMAPConfigValid()
    {
        $result = array();
        $isConfig = self::isConfigurationExist();
        if ($isConfig['total'] > 0) {
            $CC = self::getClientConfiguration();
            $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], 'INBOX', $CC['imapport'], 'notls');
            if ($imap->get_is_connected() == 0) {
                $result = array('valid' => 0);
            } else if ($imap->get_is_connected() == 1) {
                $result = array('valid' => 1);
            }
        } else {
            $result = array('valid' => 0);
        }

        return $result;
    }

    function getNewMailCount($attr)
    {
        return; // removing table email_attachments from db as it is not being used
        $path = APP_PATH . '/upload/mail_attachments/';

        $this->objGeneral->mysql_clean($attr);

        $result = array();
        $isConfig = self::isConfigurationExist();

        if ($isConfig['total'] > 0) {

            $UserId = $this->arrUser['id'];
            $companyId = $this->arrUser['company_id'];
            $Sql = "SELECT * FROM client_configuration WHERE company_id = $companyId and user_id = $UserId  and  
            status=1 ORDER BY id DESC limit 100";
            $RS = $this->objsetup->CSI($Sql);

            // get send emails data to update replied reference
            $EmailSaveData = array();
            $SqlE = "SELECT * from email_save  where company_id = $companyId and user_id = $UserId  and message_id !=''";
            //echo $SqlE;
            $RSE = $this->objsetup->CSI($SqlE);
            $EmailSaveData = $RSE->GetRows();
            $msgidArr = array();


            /*  foreach($EmailSaveData as $msgid)
              {
                  $msgidArr[]= $msgid['message_id'];
              }*/
            //print_r($msgidArr); exit;

            $i = 0;
            $valid = 0;
            $results = array();
            $total = 0;
            if ($RS->RecordCount() > 0) {

                while ($row = $RS->FetchRow()) {


                    $unumber = 0;
                    $imap = new Imap($row['imapserver'], $row['username'], $row['password'], 'INBOX', $row['imapport'], 'notls');
                    if ($imap->get_is_connected() == 1) {

                        $MessageArr = [];
                        //only get unseen mails
                        $searchArr = $imap->getIMAPUnseenResults();


                        //$MailBox = $imap->returnMailBoxHeaderArr();

                        //$EmailData = array();
                        foreach ($searchArr as $Mail) {
                            $attach_flag = 0;


                            $MessageArr = $imap->returnEmailMessageArr($Mail);

                            //$newRef = explode(" ", $MessageArr['header']['references']);


                            // print_r($Mail); exit;
                            foreach ($EmailSaveData as $saveData) {

                                if ($MessageArr['header']['in_reply_to'] == $saveData['message_id']) {
                                    if ($saveData['email_parent_id'] != 0)
                                        $parent_id = $saveData['email_parent_id'];
                                    else
                                        $parent_id = $saveData['id'];

                                    //  print_r($MessageArr);
                                    //prevent duplication
                                    //  if(!in_array($MessageArr['header']['message_id'], $msgidArr)) {

                                    //Get email message body
                                    $Sfrom = "";
                                    // $MessageArr = $imap->returnEmailMessageArr($Mail['Msgno']);
                                    foreach ($MessageArr['header']['from'] as $fromEmail)
                                        $Sfrom = $fromEmail['from'];

                                    //$Sfrom = rtrim($Sfrom, ",");

                                    if (count($MessageArr['header']['to']) > 0) {
                                        $Sto = "";

                                        foreach ($MessageArr['header']['to'] as $toEmail)
                                            $Sto .= $toEmail['to'] . ",";

                                        $Sto = rtrim($Sto, ",");


                                    }

                                    if (count($MessageArr['header']['cc']) > 0 && $MessageArr['header']['cc'] != undefined) {
                                        $Scc = "";
                                        // $Scc = serialize($MessageArr['header']['cc']);
                                        foreach ($MessageArr['header']['cc'] as $ccEmail)
                                            $Scc .= $ccEmail['cc'] . ",";

                                        $Scc = rtrim($Scc, ",");
                                    }

                                    if (count($MessageArr['header']['bcc']) > 0 && $MessageArr['header']['bcc'] != undefined) {
                                        $Sbcc = "";
                                        // $Sbcc = serialize($MessageArr['header']['bcc']);
                                        foreach ($MessageArr['header']['bcc'] as $bccEmail)
                                            $Sbcc .= $bccEmail['bcc'] . ",";

                                        $Sbcc = rtrim($Sbcc, ",");
                                    }

                                    if ($MessageArr['header']['Attachment'] == 'A')
                                        $attach_flag = 1;


                                    //print_r($MessageArr);$Mail['Recent'] == 'N' || $Mail['Recent'] == 'R' || $Mail['Unseen'] == 'U'
                                    //  exit;
                                    if ($MessageArr['header']['Recent'] == 'N' || $MessageArr['header']['Recent'] == 'R'
                                        || $MessageArr['header']['Unseen'] == 'U'
                                    ) {

                                        //$tidy = tidy_parse_string($MessageArr['html']);

                                        //$html = tidy_repair_string($tidy);
                                        // print_r($html->value);
                                        $SqlUpdate = "Insert Into email_save SET 
                                            tab_id = '$saveData[tab_id]'
                                            , sender_id = '$saveData[sender_id]'
                                            , module_id = '$saveData[module_id]'
                                            , row_id = '$saveData[row_id]'
                                            , account_id = '$saveData[account_id]'
                                            , module_type = '$saveData[module_type]'
                                            , email_address_from = '$Sfrom'
                                            , email_address_to = '$Sto'
                                            , cc = '$Scc'
                                            , bcc = '$Sbcc'
                                            , email_subject = '" . mysqli_real_escape_string($MessageArr['header']['subject']) . "'
                                            , email_body = '" . mysqli_real_escape_string(trim($MessageArr['html'])) . "'
                                            , message_id = '" . $MessageArr['header']['message_id'] . "'
                                            , email_header = '" . mysqli_real_escape_string(serialize($MessageArr['header'])) . "'
                                            , email_parent_id = '$parent_id'
                                            , date_added = '" . $MessageArr['header']['udate'] . "'
                                            , date_time = '" . $MessageArr['header']['date'] . "'
                                            , company_id = '" . $this->arrUser['company_id'] . "'
                                            , user_id = '" . $this->arrUser['id'] . "'
                                            , status = '3'
                                            , attach_flag = '$attach_flag'
                                            , archive = 'no'";
                                        //echo $SqlUpdate;
                                        $RSU = $this->objsetup->CSI($SqlUpdate);
                                        $lidu = $this->Conn->Insert_ID();
                                        $results['InsertId'] = $lidu;


                                        if ($attach_flag == 1) {
                                            foreach ($MessageArr['attachments'] as $attachments) {
                                                $attach = $imap->saveAttachment($Mail, $attachments['part'], $path);
                                                //  print_r($attach);
                                                if (!empty($attach)) {
                                                    $sqlAtt = "insert into email_attachments set email_id = '$lidu' , 
                                            old_name ='" . $attach['old_name'] . "', new_name = '" . $attach['new_name'] . "'";

                                                    // echo $sqlAtt;
                                                    $RSUP = $this->objsetup->CSI($sqlAtt);
                                                    $lidua = $this->Conn->Insert_ID();
                                                    $results['attachment'][] = $lidua;
                                                    //$results['attachment'] = true;
                                                }
                                            }
                                        }
                                    }

                                }
                            }
                            // exit;
                            //$EmailData['header'][] = $Mail;
                            //  $EmailData['msgDetail'][] = $MessageArr;
                            //if ($Mail['Recent'] == 'N' || $Mail['Recent'] == 'R' || $Mail['Unseen'] == 'U') {
                            $unumber++;
                            $total++;
                            // }
                        }

                        $results[$row['id']] = $unumber;
                    }
                }
            }
            $results['total'] = $total;
        }

        return $results;
    }

    function getEmailInternalListing($attr)
    {
        return; // removing table email_attachments from db as it is not being used
        $this->objGeneral->mysql_clean($attr);

        //print_r($attr); exit;
        $response = array();
        $where2 = "";
        if ($attr['tab_id'] != 0)
            $where2 = " and tab_id = '" . $attr[tab_id] . "' ";
        if (!empty($attr['archive']))
            $where2 .= " and archive = '" . $attr['archive'] . "' ";

        $Sql = "Select c.*  from email_save c where c.company_id = '" . $this->arrUser['company_id'] . "' and c.user_id =
        '" . $this->arrUser['id'] . "' and c.module_id = '$attr[module_id]' and c.module_type =
         '$attr[module_type]' and c.account_id = '$attr[account_id]' and c.status = 2 $where2  ";
        $order_type = "order by c.id DESC";


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        //  echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';

        $Rows = $RS->GetRows();
        $result = array();
        $count = 0;
        if ($RS->RecordCount() > 0) {

            foreach ($Rows as $RowsData) {

                $SqlSender = "select alias from client_configuration where id = '$RowsData[sender_id]'
                limit 1";
                // echo $SqlSender;
                $RSS = $this->objsetup->CSI($SqlSender);
                $sendernamer = $RSS->FetchRow();
                // print_r($sendernamer);

                if ($RowsData['attach_flag'] == 1) {
                    $SqlAttach = "select * from email_attachments where email_id = '$RowsData[id]'";
                    // echo $SqlSender;
                    $RSATT = $this->objsetup->CSI($SqlAttach);
                    $RowsAttach = $RSATT->GetRows();
                }
                // print_r($RowsData);

                $SqlR = "Select es.* from email_save es where es.company_id = '" . $this->arrUser['company_id'] . "' and 
                es.user_id =
        '" . $this->arrUser['id'] . "' and es.email_parent_id = '$RowsData[id]' and (es.status = 3 || es.status = 4) 
        order by es.id desc";
                //echo $SqlR;
                $RSR = $this->objsetup->CSI($SqlR);
                $RowsR = $RSR->GetRows();
//echo html_entity_decode($RowsData['email_body']);


                $result['emails'][$count] = $RowsData;
                /*$result['emails'][$count]['email_body'] = html_entity_decode($RowsData['email_body']);*/
                $result['emails'][$count]['senderName'] = $sendernamer['alias'];

                ///print_r($result['emails']); exit;
                if ($RowsData['attach_flag'] == 1)
                    $result['emails'][$count]['attachments'] = $RowsAttach;


                if (count($RowsR) > 0) {
                    $count2 = 0;
                    foreach ($RowsR as $itemR) {

                        $result['emails'][$count]['reply'][$count2] = $itemR;
                        /* $result['emails'][$count]['reply'][$count2]['email_body'] =html_entity_decode ($itemR['email_body']);*/

                        if ($itemR['attach_flag'] == 1) {
                            $SqlAttachRep = "select * from email_attachments where email_id = '" . $itemR['id'] . "'";
                            //echo $SqlAttachRep;
                            $RSATTR = $this->objsetup->CSI($SqlAttachRep);
                            $RowsAttachRep = $RSATTR->GetRows();
                            $result['emails'][$count]['reply'][$count2]['attachments'] = $RowsAttachRep;
                        }

                        $count2 = $count2 + 1;
                    }

                }


                $count = $count + 1;

            }

        }


        $result['ack'] = 1;
        return $result;
    }

    function getDraftsInternalListing($attr)
    {
        return; // removing table email_attachments from db as it is not being used
        $this->objGeneral->mysql_clean($attr);

        //print_r($attr); exit;
        $where2 = "";
        if ($attr['tab_id'] != 0)
            $where2 = " and tab_id = '" . $attr[tab_id] . "' ";

        $Sql = "Select * from email_save where company_id = '" . $this->arrUser['company_id'] . "' and user_id =
        '" . $this->arrUser['id'] . "' and module_id = '$attr[module_id]' and module_type = 
         '$attr[module_type]' and account_id = '$attr[account_id]' and status = 5 $where2  ";


        $total_limit = pagination_limit;
        
        if (isset($attr['pagination_limits']) && $attr['pagination_limits'])
            $total_limit = $attr['pagination_limits'];

        $response = $this->objGeneral->pagination_genral($attr, $Sql, $response, $total_limit, 'c', $order_type);
        // echo $response['q'];exit;
        $RS = $this->objsetup->CSI($response['q']);
        $response['q'] = '';
        $Rows = $RS->GetRows();
        $result = array();
        $count = 0;
        $to = array();
        if ($RS->RecordCount() > 0) {

            foreach ($Rows as $RowsData) {

                $SqlSender = "select alias from client_configuration where id = '$RowsData[sender_id]'
                limit 1";
                // echo $SqlSender;
                $RSS = $this->objsetup->CSI($SqlSender);
                $sendernamer = $RSS->FetchRow();
                // print_r($sendernamer);

                if ($RowsData['attach_flag'] == 1) {
                    $SqlAttach = "select * from email_attachments where email_id = '$RowsData[id]'";
                    // echo $SqlSender;
                    $RSATT = $this->objsetup->CSI($SqlAttach);
                    $RowsAttach = $RSATT->GetRows();
                }
                // print_r($RowsData);


                $result['emails'][$count] = $RowsData;
                /*$result['emails'][$count]['email_body'] = html_entity_decode($RowsData['email_body']);*/
                $result['emails'][$count]['senderName'] = $sendernamer['alias'];

                // echo $RowsData['email_address_to'];
                if (!empty($RowsData['email_header']))
                    $result['emails'][$count]['custom'] = json_decode($RowsData['email_header']);

                // $result['emails'][$count]['email_address_to'] = json_decode($RowsData['email_address_to']);
                ///print_r($result['emails']); exit;
                if ($RowsData['attach_flag'] == 1)
                    $result['emails'][$count]['attachments'] = $RowsAttach;


                $count = $count + 1;

            }

        }

        // print_r($Rows); exit;


        $result['ack'] = 1;

        // print_r($result);
        // exit;
        // exit;

        return $result;


    }

    function getSignature($attr)
    {

        $this->objGeneral->mysql_clean($attr);
        $Id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';

        $Sql = "SELECT * FROM client_configuration WHERE id = $Id LIMIT 1";
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {

            while ($row = $RS->FetchRow()) {
                $results['html'] = utf8_encode($row['signature']);
            }
        }


        return $results;
    }

    function move_archive_emails($attr)
    {

        //$this->objGeneral->mysql_clean($attr);
        // print_r($attr); exit;
        foreach ($attr['ids'] as $id) {
            $Sql = "update email_save set archive = 'yes' where id = $id";
            // echo $Sql;
            $RS = $this->objsetup->CSI($Sql);
        }

        $results['ack'] = 1;

        return $results;
    }

    function move_inbox_emails($attr)
    {

        //$this->objGeneral->mysql_clean($attr);
        // print_r($attr); exit;
        foreach ($attr['ids'] as $id) {
            $Sql = "update email_save set archive = 'no' where id = $id";
            // echo $Sql;
            $RS = $this->objsetup->CSI($Sql);
        }

        $results['ack'] = 1;

        return $results;
    }

    function delete_emails($attr)
    {

        //$this->objGeneral->mysql_clean($attr);
        // print_r($attr); exit;
        foreach ($attr['ids'] as $id) {
            $Sql = "update email_save set status = '0' where id = $id";
            // echo $Sql;
            $RS = $this->objsetup->CSI($Sql);
        }

        $results['ack'] = 1;

        return $results;
    }

    function getMailsFolders($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $result = array();
        $isConfig = self::isConfigurationExist();

        if ($isConfig['total'] > 0) {

            $UserId = $this->arrUser['id'];
            $Sql = "SELECT * FROM client_configuration WHERE user_id = $UserId ORDER BY id DESC";
            $RS = $this->objsetup->CSI($Sql);
            $i = 0;
            $valid = 0;
            if ($RS->RecordCount() > 0) {

                while ($row = $RS->FetchRow()) {

                    //print_r($row); echo ' - ';


                    $imap = new Imap($row['imapserver'], $row['username'], $row['password'], 'INBOX', $row['imapport'], 'novalidate-cert');
                    // print_r($imap);
                    if ($imap->get_is_connected() == 1) {
                        $result['signatures'][$row['id']] = $row['signature'];
                        $folders2 = $imap->returnImapMailBoxes();
                        $result['mails'][$valid]['folders'] = $folders2;


                        // print_r($folders2);

                        $Folders3 = array();
                        if ($folders2) {
                            ksort($folders2);
                            foreach ($folders2 as $key => $value) {
                                $subArray = explode(".", $key);

                                if (COUNT($subArray) == 2) {
                                    //$Folders3[$subArray[0]][$subArray[1]] = $subArray[1];//array('level' => 2, 'data' => $subArray[1]);
                                    // array_push($Folders3[$subArray[0]], $subArray[1]);
                                    array_push($Folders3[$subArray[0]][$subArray[1]], $subArray[1]);
                                } else if (COUNT($subArray) == 3) {
                                    // $Folders3[$subArray[1]] = array('level' => 3, 'data' => $subArray[2]);
                                    //   $Folders3[$subArray[0]] = $subArray[1];
                                    // array_push($Folders3[$subArray[0]], $subArray[1]);
                                    // array_push($Folders3[$subArray[0]][$subArray[1]], $subArray[2]);
                                    // array_push($Folders3[$subArray[0]][$subArray[1]], $subArray[2]);
                                    array_push($Folders3[$subArray[0]][$subArray[1]][$subArray[2]], $subArray[2]);
                                } else if (COUNT($subArray) == 4) {
                                    //$Folders3[$subArray[1]] = array($subArray[2] => $subArray[2]);
                                    //$Folders3[$subArray[1]][$subArray[2]] = array($subArray[3] => $subArray[3]);
                                    array_push($Folders3[$subArray[0]][$subArray[1]][$subArray[2]][$subArray[3]], $subArray[3]);
                                }
                            }
                        }


                        $result['mails'][$valid]['subfolders'] = $Folders3;
                        $result['mails'][$valid]['dropfolders'] = array();
                        $i = 0;
                        foreach ($folders2 as $key => $value) {
                            if (COUNT(explode(".", $key)) <= 3) {
                                $result1[$key] = $value;
                                $result['mails'][$valid]['dropfolders'] = $result1;
                                $i++;
                            }
                        }

//                        echo "<pre>";
//                        print_r($result['mails'][$valid]['folders2']);
//                        echo "</pre>";
                        $result['mails'][$valid]['info'] = array('id' => $row['id'], 'mail' => $row['username'], 'alias' => $row['alias']);
                        //$folders2
                        $folders3 = array('INBOX' => 'INBOX', 'INBOX.Drafts' => 'INBOX.Drafts', 'INBOX.Sent' => 'INBOX.Sent', 'INBOX.Trash' => 'INBOX.Trash');
                        foreach ($folders3 as $key => $value) {
                            $imapCount = new Imap($row['imapserver'], $row['username'], $row['password'], $key, $row['imapport'], 'notls');
                            if ($imapCount->get_is_connected() == 1) {
                                $un_numbers = 0;
                                $MailBox = $imapCount->returnMailBoxHeaderArr();
                                foreach ($MailBox as $Mail) {
                                    if ($Mail['Recent'] == 'N' || $Mail['Recent'] == 'R' || $Mail['Unseen'] == 'U') {
                                        $un_numbers++;
                                    }
                                }
                                $key1 = str_replace(".", "__", str_replace(" ", "_", $key));
                                $result['mails'][$valid]['counts'][$key] = $un_numbers;
                            }
                        }
                        foreach ($folders2 as $key => $value) {
                            $imapCount = new Imap($row['imapserver'], $row['username'], $row['password'], $key, $row['imapport'], 'notls');
                            if ($imapCount->get_is_connected() == 1) {
                                $un_numbers = 0;
                                $MailBox = $imapCount->returnMailBoxHeaderArr();
                                foreach ($MailBox as $Mail) {
                                    if ($Mail['Recent'] == 'N' || $Mail['Recent'] == 'R' || $Mail['Unseen'] == 'U') {
                                        $un_numbers++;
                                    }
                                }
                                $key2 = str_replace(".", "__", str_replace(" ", "_", $key));
                                $result['mails'][$valid]['counts'][$key] = $un_numbers;
                            }
                        }

                        $valid++;
                    } else if ($imap->get_is_connected() == 0) {

                    }
                }
                $result['total'] = $valid;
            }
        } else {
            $result['total'] = 0;
        }

        return $result;
    }

    function getMailFolders($attr)
    {


        $this->objGeneral->mysql_clean($attr);
        $result = array();
        $id = (isset($attr['id'])) ? $attr['id'] : '';
        $isCC = self::isConfigurationExist();
        if ($isCC['total'] > 0) {
            $CC = self::getMailConfigurationById(array('id' => $id));
            $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], "INBOX", $CC['imapport'], 'notls');
            if ($imap->get_is_connected() == 1) {
                $result['folders'] = $imap->returnImapMailBoxes();
            }
        }

        return $result;
    }

    function getIMAPSearchResults($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $result = array();
        $search = (isset($attr['search'])) ? $attr['search'] : '';
        $id = (isset($attr['id'])) ? $attr['id'] : '';

        $isCC = self::isConfigurationExist();
        if ($isCC['total'] > 0) {
            $CC = self::getMailConfigurationById(array('id' => $id));
            $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], "INBOX", $CC['imapport'], 'notls');
            if ($imap->get_is_connected() == 1) {
                $Inbox = $imap->getIMAPSearchResults($imap->get_stream(), $search);
                if ($Inbox) {
                    foreach ($Inbox as $messageno) {
                        $result['INBOX'][] = $imap->returnEmailHeaderArr($messageno);
                    }
                }
            }
            $CC = self::getMailConfigurationById(array('id' => $id));
            $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], "INBOX.Sent", $CC['imapport'], 'notls');
            if ($imap->get_is_connected() == 1) {
                $Sent = $imap->getIMAPSearchResults($imap->get_stream(), $search);
                if ($Sent) {
                    foreach ($Sent as $messageno) {
                        $result['INBOX.Sent'][] = $imap->returnEmailHeaderArr($messageno);
                    }
                }
            }
        }

        return $result;
    }

    function sendMail($attr)
    {
        echo "dideeididieidieeee";exit;

        $mail = new PHPMailer(true);
        // $mail->IsSMTP();          $mail->SMTPDebug = 0;  $mail->CharSet = 'UTF-8';
        $mail->IsMail();
        //print_r($attr);exit;

        // if email from any module
        if ($attr['emailFromModule'] == 1){
            $to[] = $attr['to'];
            $from = $attr['from'];
            $fromName = $attr['fromName'];
            $body = $attr['body'];
            $subject = $attr['subject'];
            $attachment = $attr['attachmentPath'];
            $attachmentName = $attr['attachmentName'];
            $files[] = $attachmentName;
            $mail->addAttachment($attachment, $attachmentName);
        }
        else{
            $to = $attr['to'];
            $ccAddress = (isset($attr['cc'])) ? $attr['cc'] : '';
            $bccAdress = (isset($attr['bcc'])) ? $attr['bcc'] : '';
            $body = $attr['body'];
            $subject = $attr['subject'];
        }
        // end if email from any module

        if ($from == "") $from = "demo@demoLtd.com";
        if ($fromName == "") $fromName = "Demo Ltd.";
        if ($attachmentName == "" || $attachmentName == NULL) $attachmentName = "File";
//echo $attachment;exit;
        //print_r($attr);exit;

        //codemark mail 1

        $id = $this->arrUser['id'];
        //$id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $type = (isset($attr['type'])) ? trim(stripslashes(strip_tags($attr['type']))) : '';
            $type = "";
        //$to = (isset($attr['to'])) ? $attr['to'] : '';
        //    $to = ["farhan.afzal@silverow.com", "ahmad.hassan@silverow.com"];
        
        //$subject = (isset($attr['subject'])) ? trim(stripslashes(strip_tags($attr['subject']))) : '';
            //$subject = "test Email Sub";
        //$body = (isset($attr['body'])) ? $attr['body'] : '';
        //$files = (isset($attr['files'])) ? $attr['files'] : '';
        if ($id)
        $CC = self::getMailConfigurationById(array('id' => $id));
        //$from = $CC['username'];//. "\n";
        //'mudassir@navsonsoftware.com';//
        //$from = "demo@demoltd.com";
        
        //$mail->AddReplyTo($CC['username'], $this->arrUser['user_name']);
        //$mail->AddReplyTo($from, $from);
        $mail->From = $from;
        $mail->FromName = $fromName;
        $mail->Subject = $subject;
        
        //print_r($mail);exit;
        if ($type == 'reply') {
            if (COUNT(explode(";", $to)) > 0) {
                $toArr = explode(";", $to);
                foreach ($toArr as $toAdr) {
                    if ($toAdr != "") {
                        $mail->AddAddress($toAdr);

                    }
                }
            } else {
                if (trim($to) != "") {
                    $mail->AddAddress($to);
                }
            }
            if (COUNT(explode(";", $ccAddress)) > 0) {
                $CCArr = explode(";", $ccAddress);
                foreach ($CCArr as $CCAdr) {
                    if ($CCAdr != "") {
                        $mail->AddCC($CCAdr);
                    }
                }
            } else {
                if (trim($ccAddress) != "") {
                    $mail->AddCC($ccAddress);
                }
            }
            if (COUNT(explode(";", $bccAdress)) > 0) {
                $BCCArr = explode(";", $bccAdress);
                foreach ($BCCArr as $BCCAdr) {
                    if ($BCCAdr != "") {
                        $mail->AddBCC($BCCAdr);
                    }
                }
            } else {
                if (trim($bccAdress) != "") {
                    $mail->AddBCC($bccAdress);
                }
            }
        } else {
            if ($to) {
                for ($k = 0; $k < COUNT($to); $k++) {
                    $mail->AddAddress($to[$k]);
                    // && (strlen($to[$k])>2))
                    //if ((!empty($attr['module_id']))) {
                        $Sql = "INSERT INTO email_save SET
						 email_address_from='" . $from . "'
						,email_address_to='" . $to[$k] . "'
						,email_subject='" . $subject . "'
						,account_id='" . $id . "'
						,email_body= '" . base64_encode(trim(stripslashes($body))) . "'
						,email_header= 'abc'
						,module_id= '" . $attr['module_id'] . "'
						,module_code= '" . $attr['module_code'] . "'
						,company_id= '" . $this->arrUser['company_id'] . "'
						,user_id='" . $this->arrUser['id'] . "'
                        ,date_added='" . current_date_time . "'";
                        //echo $Sql;exit;
                        // $RS = $this->objsetup->CSI($Sql);

                    //}
                }
            }
            if ($ccAddress) {
                for ($k = 0; $k < COUNT($ccAddress); $k++) {
                    $mail->AddCC($ccAddress[$k]);
                }
            }
            if ($bccAdress) {
                for ($k = 0; $k < COUNT($bccAdress); $k++) {
                    $mail->AddBCC($bccAdress[$k]);
                }
            }
        }

        $mail->WordWrap = 80; // set word wrap
        if ($attr['emailFromModule'] != 1){
            for ($i = 0; $i < count($files); $i++) {
                $path = APP_PATH . '/upload/mail_attachments/' . $files[$i]->newFileName;
                $mail->AddAttachment($path, $files[$i]->fileName);
            }
        }
        $mail->IsHTML(true); // send as HTML

        if ((!empty($attr['module_id']))) {

            $body = $body . "<p><span style=' display:none '>" . $attr['module_code'] . "</span>" . "<span style=' display:none '>" . $attr['module_id'] . "</span>";

            //	. "<input type='hidden' value='".$attr['module_id']."'></p>";
        }
        //echo $body;	exit;

        $mail->MsgHTML($body);

        try {

            //$mail->addHeader('custom-field', '11111111111');
            //$mail->AddCustomHeader("custom-field: 22222222222");

            /* $email = new Email();
            $email->from('admin@navson.com', 'fff'); // change it to yours
             $email->to('ahmad.hassan@silverow.com'); // change it to yours
             $email->subject('test');
             $email->message('hello');


            if ($email->send()) {
                  echo 'Success';
            } else {
                  echo 'Email is Not Sending Server Problem! ';
               // show_error($CI->email->print_debugger());
              //  return false;
            }
            exit; */
            //print_r($mail);exit;
            // codemark mail sent
            $mailFlag = $mail->Send();
            if (!$mailFlag) {
                return array('ack' => 0, 'message' => 'not sent', 'error' => $mail->ErrorInfo);
            } else {

                $folder = "";
                $isCC = self::isConfigurationExist();
                if ($isCC['total'] > 0) {
                    $CC = self::getMailConfigurationById(array('id' => $id));
                    $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], "INBOX.Sent", $CC['imapport'], 'notls');
                    //  $mail_string = $mail->get_mail_string();
                    imap_append($imap->get_stream(), "INBOX.Sent", "Check in Sent");
                }
                return array('ack' => 1, 'message' => 'sent', 'error' => $mailFlag);
            }

        } catch (Exception $e) {
            return array('ack' => 0, 'message' => 'not sent', 'error' => $mail->ErrorInfo, 'errorMessage' => $e->getMessage());
        }

    }

    function getFolderMessage($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        $MessageArr = array();
        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';
        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $messageNumber = (isset($attr['messageNumber'])) ? trim(stripslashes(strip_tags($attr['messageNumber']))) : '';

        $CC = self::getMailConfigurationById(array('id' => $id));
        $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], $folder, $CC['imapport'], 'notls');

        $MessageArr['html'] = utf8_encode($imap->getBody($messageNumber));
        $MessageArr['attachments'] = $imap->getAttachedfiles($messageNumber);
        $MessageArr['header'] = $imap->returnEmailHeaderArr($messageNumber);

        $MessageArr['header2'] = imap_fetchheader($imap, $messageNumber) . imap_body($imap, $messageNumber);


        $MessageArr['header']['date'] = $MessageArr['header']['date'];
        console . log($MessageArr);
        console . log('folder msg');
        //str_replace("+0500", "", $MessageArr['header']['date']);
        //  $arr = array('folder' => $folder, 'messageNumber' => $messageNumber, 'flags' => '\\Seen \\Read', 'method' => 'imap');
        //  self::setFolderMessageFlags($arr);
        //$MessageArr = $imap->returnEmailMessageArr($messageNumber);

        // if( strstr( stripslashes(strip_tags($imap->getBody($messageNumber))) ,"SUPT_53") ) echo 'yes';


        return $MessageArr;
    }

    function getFolder_list($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';
        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $MailBox = array();
        $isCC = self::isConfigurationExist();
        if ($isCC['total'] > 0) {
            $CC = self::getMailConfigurationById(array('id' => $id));
            $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], $folder, $CC['imapport'], 'notls');
            if ($imap->get_is_connected() == 0) {
                $MailBox = array('isconnected' => 0);
            } else if ($imap->get_is_connected() == 1) {
                $MailBox = $imap->returnMailBoxHeaderArr();
                /*  foreach ($MailBox as $Mail) {
              //if ($Mail['Unseen'] == 'U')
              //{
              //  $arr = array('folder' => $folder, 'messageNumber' => $Mail['Msgno'], 'flags' => '\\Seen', 'method' => 'imap');
              //  self::unsetFolderMessageFlags($arr);
              //}
                  }*/
            }
        }

        return $MailBox;
    }

    function getunreadMailCount($attr)
    {
        // $this->objGeneral->mysql_clean($attr);

        $isConfig = self::isConfigurationExist();

        if ($isConfig['total'] > 0) {

            $UserId = $attr['id'];//$this->arrUser['id'];
            $Sql = "SELECT * FROM client_configuration WHERE id = $UserId and status = 1  Limit 1";
            $RS = $this->objsetup->CSI($Sql);
            // echo  $Sql;exit;
            $i = 0;
            $valid = 0;
            $results = array();
            $MailBox = array();
            $new_MailBox = array();
            $total = 0;

            if ($RS->RecordCount() > 0) {
                while ($row = $RS->FetchRow()) {
                    $unumber = 0;
                    $imap = new Imap($row['imapserver'], $row['username'], $row['password'], 'INBOX', $row['imapport'], 'notls');
                    if ($imap->get_is_connected() == 1) {
                        $MailBox = $imap->returnMailBoxHeaderArr();
                        //console.log($MailBox );
                        foreach ($MailBox as $Mail) {
                            $unumber++;
                            if ($unumber < 10) {
                                if ($Mail['Recent'] == 'N' || $Mail['Recent'] == 'R' || $Mail['Unseen'] == 'U') {

                                    // if ( ( strstr( stripslashes(strip_tags($imap->getBody($Mail['Msgno']))) ,"".$attr['module_code']."") ) )
                                    //	{
                                    $total++;
                                    $new_MailBox['header'][] = $imap->returnEmailHeaderArr($Mail['Msgno']);

                                    //console.log($new_MailBox);console.log('getunreadMailCount msg');
                                    //	}
                                }
                                // $results[$row['id']] = $unumber;

                            }
                        }
                    }
                }
            }
            $results['total'] = $total;
        }

        //echo $total;	 print_r($new_MailBox['header']);exit;
        if ($total > 0) return $new_MailBox['header'];// $MailBox;
        else return 0;
    }

    function getFolder($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';
        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $MailBox = array();
        $isCC = self::isConfigurationExist();
        if ($isCC['total'] > 0) {
            $CC = self::getMailConfigurationById(array('id' => $id));
            $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], $folder, $CC['imapport'], 'notls');
            if ($imap->get_is_connected() == 0) {
                $MailBox = array('isconnected' => 0);
            } else if ($imap->get_is_connected() == 1) {
                $MailBox = $imap->returnMailBoxHeaderArr();
                foreach ($MailBox as $Mail) {
//                    if ($Mail['Unseen'] == 'U') {
                    //  $arr = array('folder' => $folder, 'messageNumber' => $Mail['Msgno'], 'flags' => '\\Seen', 'method' => 'imap');
                    //  self::unsetFolderMessageFlags($arr);
                    //                  }
                }
            }
        }


        /*echo "<pre>";
        print_r($MailBox);exit;*/

        return $MailBox;
    }

    function saveMail($attr)
    {
        //print_r($attr);
        $id = (isset($attr['from'])) ? trim(stripslashes(strip_tags($attr['from']))) : '';
        $to = (isset($attr['to'])) ? trim(stripslashes(strip_tags($attr['to']))) : '';
        $subject = (isset($attr['subject'])) ? trim(stripslashes(strip_tags($attr['subject']))) : '';
        $cc = (isset($attr['cc'])) ? trim(stripslashes(strip_tags($attr['cc']))) : '';
        $bcc = (isset($attr['bcc'])) ? trim(stripslashes(strip_tags($attr['bcc']))) : '';
        $body = (isset($attr['body'])) ? trim(stripslashes(strip_tags($attr['body']))) : '';
        $files = (isset($attr['files'])) ? $attr['files'] : '';

        $CC = self::getMailConfigurationById(array('id' => $id));
        // print_r($CC);
        $from = $CC['username'] . "\n";
        $mail = new PHPMailer();
        $mail->AddReplyTo($CC['username'], $this->arrUser['user_name']);
        $mail->AddAddress($to);
        $mail->From = $from;
        $mail->FromName = $this->arrUser['user_name'];
        $mail->Subject = $subject;
        $mail->WordWrap = 80; // set word wrap

        for ($i = 0; $i < count($files); $i++) {
            $path = APP_PATH . '/upload/mail_attachments/' . $files[$i]->newFileName;
            $mail->AddAttachment($path, $files[$i]->fileName);
        }

        $mail->MsgHTML($body);
        $mail->IsHTML(true); // send as HTML
        /*  if (!$mail->Send()) {

              $folder = "";
              $isCC = self::isConfigurationExist();
              if ($isCC['total'] > 0) {

                  $CC = self::getMailConfigurationById(array('id' => $id));
                  $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], "INBOX", $CC['imapport'], 'notls');
                  $mail_string = $mail->GetMailMIME();
                  $mail_string = $mail->get_mail_string();

                  imap_append($imap->get_stream(), "INBOX.Drafts", $mail_string);
              }
              return array('message' => 'save to draft', 'error' => imap_errors());
          } else {
              return array('message' => 'sent');
          }*/
    }

    function SaveMailInternal($attr)
    {
        return; // removing table email_attachments from db as it is not being used
        // print_r($attr); exit;
        $attach_flag = 0;
        $id = (isset($attr['from'])) ? trim(stripslashes(strip_tags($attr['from']))) : '';
        $to = (isset($attr['to'])) ? trim(stripslashes(strip_tags($attr['to']))) : '';
        $subject = (isset($attr['subject'])) ? trim(stripslashes(strip_tags($attr['subject']))) : '';
        $cc = (isset($attr['cc'])) ? trim(stripslashes(strip_tags($attr['cc']))) : '';
        $bcc = (isset($attr['bcc'])) ? trim(stripslashes(strip_tags($attr['bcc']))) : '';
        $body = (isset($attr['body'])) ? $attr['body'] : '';
        $files = (isset($attr['files'])) ? $attr['files'] : '';
        $RefData = (isset($attr['refData'])) ? $attr['refData'] : '';
        if (!empty($files)) $attach_flag = 1;
        //echo $body;

        $CC = self::getMailConfigurationById(array('id' => $id));

        $Sto = "";
        $Scc = "";
        $Sbcc = "";
        // multiple recipients

        $mail = new PHPMailer();

        foreach ($attr['to'] as $toEmail) {

            $Sto .= $toEmail->email . ",";

            $mail->AddAddress(trim($toEmail->email), $toEmail->first_name);

        }

        $Sto = rtrim($Sto, ",");

        if (count($attr['cc']) > 0) {

            foreach ($attr['cc'] as $ccEmail) {

                $Scc .= $ccEmail->email . ",";

                $mail->AddCC(trim($ccEmail->email));
            }
            $Scc = rtrim($Scc, ",");

        }


        if (count($attr['bcc']) > 0) {

            foreach ($attr['bcc'] as $bccEmail) {

                $Sbcc .= $bccEmail->email . ",";

                $mail->AddBCC(trim($bccEmail->email));
            }

            $Sbcc = rtrim($Sbcc, ",");
        }

        // echo $str; exit;
        //print_r($attr['to']);
        // echo (implode("," , $attr['to']));

        /* if(count($attr['to'])>0)
         $Sto = serialize($attr['to']);

         if(count($attr['cc'])>0)
         $Scc = serialize($attr['cc']);

         if(count($attr['bcc'])>0)
         $Sbcc = serialize($attr['bcc']);*/


        //is emails save check is true
        if ($attr['isSave'] == true) {

            /*  $tidy = tidy_parse_string($body);
              $html = tidy_repair_string($tidy);*/


            $Sql = "Insert Into email_save SET
                  tab_id = '$RefData->tab_id'
                , sender_id = '$id'
                , module_id = '$RefData->module_id'
                , row_id = '$RefData->row_id'
                , account_id = '$RefData->account_id'
                , module_type = '$RefData->module_type'
                , email_address_from = '$CC[username]'
                , email_address_to = ' $Sto'
                , cc = '$Scc'
                , bcc = '$Sbcc'
                , email_subject = '" . mysqli_real_escape_string($subject) . "'
                , email_body = '" . mysqli_real_escape_string(trim($body)) . "'
                , email_header = ''
                , company_id = '" . $this->arrUser['company_id'] . "'
                , user_id = '" . $this->arrUser['id'] . "'
                , status = '1'
                , attach_flag = '$attach_flag'
                , archive = 'no'
                , date_time = '" . date("r") . "'
                , date_added = '" . $this->objGeneral->convert_date(date('Y-m-d')) . "'";

            // echo $Sql;
            $RS = $this->objsetup->CSI($Sql);
            //print_r($this->Conn->errorInfo());
            $lid = $this->Conn->Insert_ID();
            // echo $lid;


            if ($attach_flag == 1 && $lid > 0) {
                for ($i = 0; $i < count($files); $i++) {
                    $Sqlf = "Insert into email_attachments SET email_id = '$lid', old_name = '" . $files[$i]->fileName . "',
                new_name = '" . $files[$i]->newFileName . "'";
                    $RSF = $this->objsetup->CSI($Sqlf);
                }


            }

            $response['saveid'] = $lid;

            // print_r($response['saveid']);
            // exit;
        }

        // exit;


        $from = $CC['username'] . "\n";

        // exit;
        //   $mail = new PHPMailer();
        $mail->addCustomHeader('X-custom-header', $response['saveid']);
        // $mail->addCustomHeader('system_mail', $response['saveid']);
        $mail->Priority = 1;
        /*        $mail->IsSMTP();

                $mail->Host = 'mail3.gridhost.co.uk'; //$CC['smtpserver'];
                $mail->SMTPAuth = true;
                $mail->Port = 465; //$CC['smtpport'];
                $mail->Username = 'rizwan.aslam@silverow.com'; //$CC['username'];
                $mail->Password = 'Isb11397'; //$CC['password'];

                $mail->SMTPDebug   = 2;
                $mail->Debugoutput = 'html';*/

        $mail->IsSendmail();

        $mail->AddReplyTo($CC['username'], $CC['alias']);


        $mail->From = $from;
        $mail->FromName = $CC['alias'];
        $mail->Subject = $subject;
        $mail->WordWrap = 80; // set word wrap
        //$mail->AddCC('mirza.webmaster@gmail.com', 'Mirza Rizwan');


        //for ($i = 0; $i < count($files); $i++) {

        for ($i = 0; $i < count($files); $i++) {
            $path = APP_PATH . '/upload/mail_attachments/' . $files[$i]->newFileName;
            $mail->AddAttachment($path, $files[$i]->fileName);

            //echo ($files[$i]->fileName);
        }


        /*if($files) {
            $path = APP_PATH . '/upload/mail_attachments/' . $files->newFileName;
            $mail->AddAttachment($path, $files->fileName);
        }*/
        //}

        $mail->MsgHTML($body);
        $mail->IsHTML(true); // send as HTML

        // print_r($mail); exit;
        //return $response['mailObject'] = $mail;


        if (!$mail->Send()) {

            $response['errorMail'] = $mail->ErrorInfo;
            $response['mailStatus'] = 'Not Sent';
            $response['ack'] = 0;


        } else {

            $response['messageid'] = $mail->getLastMessageID();
            $response['ack'] = 1;

            //update email statuses
            if ($attr['isSave'] == true) {

                $SqlUpdate = "Update email_save set status = 2 , message_id = '$response[messageid]' where id = $lid";
                $RSF = $this->objsetup->CSI($SqlUpdate);

                $response['isSave'] = $attr['isSave'];
            }


            $response['mailStatus'] = 'Sent';

        }


        return $response;

    }

    function ReplyMailInternal($attr)
    {
        return; // removing table email_attachments from db as it is not being used
        // print_r($attr); exit;
        $attach_flag = 0;
        $from = (isset($attr['from'])) ? trim(stripslashes(strip_tags($attr['from']))) : '';
        $to = (isset($attr['to'])) ? trim(stripslashes(strip_tags($attr['to']))) : '';
        $subject = (isset($attr['subject'])) ? trim(stripslashes(strip_tags($attr['subject']))) : '';
        $cc = (isset($attr['cc'])) ? trim(stripslashes(strip_tags($attr['cc']))) : '';
        $bcc = (isset($attr['bcc'])) ? trim(stripslashes(strip_tags($attr['bcc']))) : '';
        $body = (isset($attr['body'])) ? $attr['body'] : '';
        $files = (isset($attr['files'])) ? $attr['files'] : '';
        $RefData = (isset($attr['refData'])) ? $attr['refData'] : '';
        if (!empty($files)) $attach_flag = 1;
        //echo $body;

        //$CC = self::getMailConfigurationById(array('id' => $id));

        $Sto = "";
        $Scc = "";
        $Sbcc = "";
        // multiple recipients

        $mail = new PHPMailer();

        foreach ($attr['to'] as $toEmail) {

            $Sto .= $toEmail->email . ",";

            $mail->AddAddress(trim($toEmail->email), $toEmail->first_name);

        }

        $Sto = rtrim($Sto, ",");

        $mail->AddAddress($attr['to']);

        if (count($attr['cc']) > 0) {

            foreach ($attr['cc'] as $ccEmail) {

                $Scc .= $ccEmail->email . ",";

                $mail->AddCC(trim($ccEmail->email));
            }
            $Scc = rtrim($Scc, ",");

        }


        if (count($attr['bcc']) > 0) {

            foreach ($attr['bcc'] as $bccEmail) {

                $Sbcc .= $bccEmail->email . ",";

                $mail->AddBCC(trim($bccEmail->email));
            }

            $Sbcc = rtrim($Sbcc, ",");
        }

        // echo $str; exit;
        //print_r($attr['to']);
        // echo (implode("," , $attr['to']));

        /* if(count($attr['to'])>0)
         $Sto = serialize($attr['to']);

         if(count($attr['cc'])>0)
         $Scc = serialize($attr['cc']);

         if(count($attr['bcc'])>0)
         $Sbcc = serialize($attr['bcc']);*/


        //is emails save check is true
        if ($attr['isSave'] == true) {

            /* $tidy = tidy_parse_string($body);
             $html = tidy_repair_string($tidy);*/
            // print_r($html->value);

            $Sql = "Insert Into email_save SET 
                  tab_id = '$RefData->tab_id'
                , sender_id = '$RefData->sender_id'
                , module_id = '$RefData->module_id'
                , row_id = '$RefData->row_id'
                , account_id = '$RefData->account_id'
                , module_type = '$RefData->module_type'
                , email_address_from = '$from'
                , email_address_to = '$Sto'
                , cc = '$Scc'
                , bcc = '$Sbcc'
                , email_parent_id = '$attr[email_parent_id]'
                , email_subject = '" . mysqli_real_escape_string($subject) . "'
                , email_body = '" . mysqli_real_escape_string(trim($body)) . "'
                , email_header = ''
                , company_id = '" . $this->arrUser['company_id'] . "'
                , user_id = '" . $this->arrUser['id'] . "'
                , status = '1'
                , attach_flag = '$attach_flag'
                , archive = 'no'
                , date_time = '" . date("r") . "'
                , date_added = '" . $this->objGeneral->convert_date(date('Y-m-d')) . "'";

           // echo $Sql;   exit;
            $RS = $this->objsetup->CSI($Sql);
            //print_r($this->Conn->errorInfo());
            $lid = $this->Conn->Insert_ID();

            if ($attach_flag == 1 && $lid > 0) {
                for ($i = 0; $i < count($files); $i++) {
                    $Sqlf = "Insert into email_attachments SET email_id = '$lid', old_name = '" . $files[$i]->fileName . "', 
                new_name = '" . $files[$i]->newFileName . "'";
                    $RSF = $this->objsetup->CSI($Sqlf);
                }


            }
            $response['saveid'] = $lid;
        }

        //exit;


        //$from = $from . "\n";

        // exit;
        //   $mail = new PHPMailer();
        $mail->addCustomHeader('X-custom-header', $response['saveid']);
        $mail->AddCustomHeader("In-Reply-To: " . $RefData->message_id);
        // $mail->addCustomHeader('system_mail', $response['saveid']);
        $mail->Priority = 1;
        /*        $mail->IsSMTP();

                $mail->Host = 'mail3.gridhost.co.uk'; //$CC['smtpserver'];
                $mail->SMTPAuth = true;
                $mail->Port = 465; //$CC['smtpport'];
                $mail->Username = 'rizwan.aslam@silverow.com'; //$CC['username'];
                $mail->Password = 'Isb11397'; //$CC['password'];

                $mail->SMTPDebug   = 2;
                $mail->Debugoutput = 'html';*/

        $mail->IsSendmail();

        $mail->AddReplyTo($from);


        $mail->From = $from;
        // $mail->FromName = $CC['alias'];
        $mail->Subject = $subject;
        $mail->WordWrap = 80; // set word wrap
        //$mail->AddCC('mirza.webmaster@gmail.com', 'Mirza Rizwan');


        //for ($i = 0; $i < count($files); $i++) {

        for ($i = 0; $i < count($files); $i++) {
            $path = APP_PATH . '/upload/mail_attachments/' . $files[$i]->newFileName;
            $mail->AddAttachment($path, $files[$i]->fileName);

            //echo ($files[$i]->fileName);
        }


        /*if($files) {
            $path = APP_PATH . '/upload/mail_attachments/' . $files->newFileName;
            $mail->AddAttachment($path, $files->fileName);
        }*/
        //}

        $mail->MsgHTML($body);
        $mail->IsHTML(true); // send as HTML

        // print_r($mail); exit;
        //return $response['mailObject'] = $mail;


        if (!$mail->Send()) {

            $response['errorMail'] = $mail->ErrorInfo;
            $response['mailStatus'] = 'Not Sent';
            $response['ack'] = 0;


        } else {

            $response['messageid'] = $mail->getLastMessageID();
            $response['ack'] = 1;

            //update email statuses
            if ($attr['isSave'] == true) {

                $SqlUpdate = "Update email_save set status = '$attr[status]' , message_id = '$response[messageid]' where id = $lid";
                $RSF = $this->objsetup->CSI($SqlUpdate);

                $response['isSave'] = $attr['isSave'];
            }


            $response['mailStatus'] = 'Sent';

        }


        return $response;

    }

    function SaveDraftlInternal($attr)
    {
        return; // removing table email_attachments from db as it is not being used
        // print_r($attr);
        $attach_flag = 0;
        $customData = array();
        $customDraft = "";
        $id = (isset($attr['from'])) ? trim(stripslashes(strip_tags($attr['from']))) : '';
        $to = (isset($attr['to'])) ? trim(stripslashes(strip_tags($attr['to']))) : '';
        $subject = (isset($attr['subject'])) ? trim(stripslashes(strip_tags($attr['subject']))) : '';
        $cc = (isset($attr['cc'])) ? trim(stripslashes(strip_tags($attr['cc']))) : '';
        $bcc = (isset($attr['bcc'])) ? trim(stripslashes(strip_tags($attr['bcc']))) : '';
        $body = (isset($attr['body'])) ? $attr['body'] : '';
        $files = (isset($attr['files'])) ? $attr['files'] : '';
        $RefData = (isset($attr['refData'])) ? $attr['refData'] : '';
        if (!empty($files)) $attach_flag = 1;


        $CC = self::getMailConfigurationById(array('id' => $id));

        $Sto = "";
        $Scc = "";
        $Sbcc = "";
        // multiple recipients

        //$mail = new PHPMailer();

        if (count($attr['to']) > 0) {
            foreach ($attr['to'] as $toEmail) {

                $Sto .= $toEmail->email . ",";

                // $mail->AddAddress(trim($toEmail->email), $toEmail->first_name);

            }
            $Sto = rtrim($Sto, ",");
            $customData['to'] = $attr['to'];

        }


        if (count($attr['cc']) > 0) {

            foreach ($attr['cc'] as $ccEmail) {

                $Scc .= $ccEmail->email . ",";

                //   $mail->AddCC(trim($ccEmail->email));
            }
            $Scc = rtrim($Scc, ",");
            $customData['cc'] = $attr['cc'];
        }


        if (count($attr['bcc']) > 0) {

            foreach ($attr['bcc'] as $bccEmail) {

                $Sbcc .= $bccEmail->email . ",";

                //   $mail->AddBCC(trim($bccEmail->email));
            }

            $Sbcc = rtrim($Sbcc, ",");
            $customData['bcc'] = $attr['bcc'];
        }

        // echo $str; exit;
        //print_r($attr['to']);


        $customDraft = json_encode($customData);


        //is emails save check is true


        $Sql = "Insert Into email_save SET
                  tab_id = '$RefData->tab_id'
                , sender_id = '$id'
                , module_id = '$RefData->module_id'
                , row_id = '$RefData->row_id'
                , account_id = '$RefData->account_id'
                , module_type = '$RefData->module_type'
                , email_address_from = '$CC[username]'
                , email_address_to = ' $Sto'
                , cc = '$Scc'
                , bcc = '$Sbcc'
                , email_subject = '" . mysqli_real_escape_string($subject) . "'
                , email_body = '" . mysqli_real_escape_string($body) . "'
                , email_header = '$customDraft'
                , company_id = '" . $this->arrUser['company_id'] . "'
                , user_id = '" . $this->arrUser['id'] . "'
                , status = '5' 
                , attach_flag = '$attach_flag'
                , archive = 'no'
                , date_time = '" . date("r") . "'
                , date_added = '" . $this->objGeneral->convert_date(date('Y-m-d')) . "'";

        // echo $Sql;
        $RS = $this->objsetup->CSI($Sql);
        //print_r($this->Conn->errorInfo());
        $lid = $this->Conn->Insert_ID();
        // echo $lid;


        if ($attach_flag == 1 && $lid > 0) {
            for ($i = 0; $i < count($files); $i++) {
                $Sqlf = "Insert into email_attachments SET email_id = '$lid', old_name = '" . $files[$i]->fileName . "',
                new_name = '" . $files[$i]->newFileName . "'";
                $RSF = $this->objsetup->CSI($Sqlf);
            }


        }

        if ($lid > 0) {
            $response['ack'] = 1;
            $response['saveid'] = $lid;
        }


//print_r($response);

        return $response;

    }

    function createMessageBody($files, $html, $from)
    {

        $message = '';
        $headers = '';


        // Generate a boundary string that is unique
        $semi_rand = md5(time());
        $mime_boundary = "==Multipart_Boundary_x{$semi_rand}x";

        $headers .= "\nMIME-Version: 1.0\n" .
            "Content-Type: multipart/alternative;\n" .
            " boundary=\"{$mime_boundary}\"";

        $message .= "--{$mime_boundary}\n" .
            "Content-Type: text/html; charset=\"iso-8859-1\"\n" .
            "Content-Transfer-Encoding: 7bit\n\n" .
            "<font face=Times New Roman>" .
            $html . "\r\n";

        // Add the headers for a file attachment
        $headers .= "\nMIME-Version: 1.0\n" .
            "Content-Type: multipart/mixed;\n" .
            " boundary=\"{$mime_boundary}\"";
        // Base64 encode the file data

        for ($i = 0; $i < count($files); $i++) {
            $path = APP_PATH . '/upload/mail_attachments/' . $files[$i]->newFileName;

            $name = basename($path);
            $fileatt_type = filetype($path);
            $file = fopen($path, 'rb');
            $data = fread($file, filesize($path));
            fclose($file);


            // Add the headers for a file attachment
            $data = chunk_split(base64_encode($data));
            // Add file attachment to the message
//            $message .= "--{$mime_boundary}\n" .
//                    "Content-Type: " . $fileatt_type . "\n" . // {$fileatt_type}
//                    " name=\"{$name}\"\n" .
//                    "Content-Disposition: inline;\n" .
//                    " filename=\"{$name}\"\n" .
//                    "Content-Transfer-Encoding: base64\n\n" .
//                    $data . "\n\n" .
//                    "--{$mime_boundary}--\n";

            $separator = md5(time());

// carriage return type (we use a PHP end of line constant)
            $eol = PHP_EOL;

// attachment name
            $filename = $name; //store that zip file in ur root directory
            $attachment = chunk_split(base64_encode(file_get_contents($path)));

// main header
//            $headers = "From: " . $from . $eol;
//            $headers .= "MIME-Version: 1.0" . $eol;
//            $headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"";
// no more headers after this, we start the body! //
//
//            $message .= "--" . $separator . $eol;
//            $message .= "Content-Transfer-Encoding: 7bit" . $eol . $eol;
//            $message .= "This is a MIME encoded message." . $eol;
// message
//            $message .= "--" . $separator . $eol;
//            $message .= "Content-Type: text/html; charset=\"iso-8859-1\"" . $eol;
//            $message .= "Content-Transfer-Encoding: 8bit" . $eol . $eol;
//            $message .= $message . $eol;
// attachment
            $message .= "--" . $separator . $eol;
            $message .= "Content-Type: application/octet-stream; charset=utf-8;  name=\"" . $filename . "\"" . $eol;
            $message .= "Content-Transfer-Encoding: base64" . $eol;
            $message .= "Content-Disposition: attachment" . $eol . $eol;
            $message .= $attachment . $eol;
            $message .= "--" . $separator . "--";

            $file = $path;
            $name = basename($file);
            $file_size = filesize($file);
            $handle = fopen($file, "r");
            $content = fread($handle, $file_size);
            fclose($handle);
            $content = chunk_split(base64_encode($content));
            $uid = md5(uniqid(time()));
            $headers .= "--" . $uid . "\r\n";
            $headers .= "Content-Type: application/octet-stream; charset=utf-8; name=\"" . $filename . "\"\r\n"; // use different content types here
            $headers .= "Content-Transfer-Encoding: base64\r\n";
            $headers .= "Content-Disposition: attachment; filename=\"" . $filename . "\"\r\n\r\n";
            $headers .= $content . "\r\n\r\n";
        }

        $messageBody = array();
        $messageBody['message'] = $message;
        $messageBody['header'] = $from . " " . $headers;


        return $messageBody;
    }

    function getMailConfigurations($attr=null)
    {
        return 1;
        $this->objGeneral->mysql_clean($attr);

        $response = array();
        // $CC = self::isConfigurationExist();
            $UserId = $this->arrUser['id'];
            $Sql = "SELECT * FROM client_configuration WHERE status = 1 and company_id = '".$this->arrUser['company_id']."'  ORDER BY id DESC";
            // echo $Sql;exit;
            $RS = $this->objsetup->CSI($Sql);
            if ($RS->RecordCount() > 0) {
                while($Row = $RS->FetchRow())
                {
                    foreach ($Row as $key => $value) {
                        if (is_numeric($key))
                        unset($Row[$key]);
                    }
                    $Row['imapport'] = (int)$Row['imapport'];
                    $Row['pop3port'] = (int)$Row['pop3port'];
                    $Row['smtpport'] = (int)$Row['smtpport'];
                    $response['response'][] = $Row;
                }
                $response['ack'] = 1;
                $response['error'] = NULL;
            }
            else{
                $response['total'] = 0;
                $response['ack'] = 0;
                $response['error'] = NULL;
            }
        return $response;
    }


    function deleteMessage($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';
        $messageno = (isset($attr['messageno'])) ? trim(stripslashes(strip_tags($attr['messageno']))) : '';
        $DeleteBox = array();
        $isCC = self::isConfigurationExist();
        if ($isCC['total'] > 0) {
            $CC = self::getMailConfigurationById(array('id' => $id));
            $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], $folder, $CC['imapport'], 'notls');
            if ($imap->get_is_connected() == 1) {
                $deleteMessage = $imap->deleteMessage($imap->get_stream(), $messageno);
                if ($deleteMessage) {
                    $DeleteBox['deleted'] = true;
                } else {
                    $DeleteBox['deleted'] = false;
                }
            }
        }

        return $DeleteBox;
    }

    function moveMessage($attr)
    {

        $this->objGeneral->mysql_clean($attr);

        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';
        $type = (isset($attr['type'])) ? trim(stripslashes(strip_tags($attr['type']))) : '';
        $messageno = (isset($attr['messageno'])) ? trim(stripslashes(strip_tags($attr['messageno']))) : '';
        $DeleteBox = array();
        $isCC = self::isConfigurationExist();
        if ($isCC['total'] > 0) {
            $CC = self::getMailConfigurationById(array('id' => $id));
            $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], $type, $CC['imapport'], 'notls');
            if ($imap->get_is_connected() == 1) {
                $deleteMessage = $imap->moveMessage($imap->get_stream(), $messageno, $folder);
                if ($deleteMessage) {
                    $DeleteBox['moved'] = true;
                } else {
                    $DeleteBox['moved'] = false;
                }
            }
        }
        $DeleteBox['errors'] = $deleteMessage;
        return $DeleteBox;
    }


    function createSubFolder($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';
        $subFolder = (isset($attr['newFolder'])) ? trim(stripslashes(strip_tags($attr['newFolder']))) : '';

        $CC = self::getMailConfigurationById(array('id' => $id));
        $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], "", $CC['imapport'], 'notls');
        $status = $imap->createSubFolder($imap->get_stream(), $folder, $subFolder);

        return array('status' => true);
    }

    function renameFolder($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';
        $lastDotPos = strrpos($folder, ".");
        $newFolder = (isset($attr['newFolder'])) ? trim(stripslashes(strip_tags($attr['newFolder']))) : '';
        $newName = substr($folder, 0, $lastDotPos) . "." . $newFolder;
        $CC = self::getMailConfigurationById(array('id' => $id));
        $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], "INBOX", $CC['imapport'], 'notls');
        $status = $imap->renameFolder($imap->get_stream(), $folder, $newName);

        return array('status' => true);
    }

    function deleteFolder($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';

        $CC = self::getMailConfigurationById(array('id' => $id));
        $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], "INBOX", $CC['imapport'], 'notls');
        $status = $imap->deleteFolder($imap->get_stream(), $folder);

        return array('ack' => true);
    }

    function setFolderMessageFlags($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';
        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $messageNumber = (isset($attr['messageNumber'])) ? trim(stripslashes(strip_tags($attr['messageNumber']))) : '';
        $flags = (isset($attr['flags'])) ? trim(stripslashes(strip_tags($attr['flags']))) : '';
        $method = (isset($attr['method'])) ? trim(stripslashes(strip_tags($attr['method']))) : '';

        $CC = self::getMailConfigurationById(array('id' => $id));
        $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], $folder, $CC['imapport'], 'notls');
        $isSet = $imap->setFolderMessageFlags($messageNumber, $flags);

        return array('flag' => $isSet);
    }

    function unsetFolderMessageFlags($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';
        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $messageNumber = (isset($attr['messageNumber'])) ? trim(stripslashes(strip_tags($attr['messageNumber']))) : '';
        $flags = (isset($attr['flags'])) ? trim(stripslashes(strip_tags($attr['flags']))) : '';
        $method = (isset($attr['method'])) ? trim(stripslashes(strip_tags($attr['method']))) : '';

        $CC = self::getMailConfigurationById(array('id' => $id));
        $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], $folder, $CC['imapport'], 'notls');
        $isunset = $imap->unsetFolderMessageFlags($messageNumber, $flags);

        return array('flag' => $isunset);
    }

    function downloadAttachment($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';
        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $messageNumber = (isset($attr['messageNumber'])) ? trim(stripslashes(strip_tags($attr['messageNumber']))) : '';
        $ano = (isset($attr['ano'])) ? trim(stripslashes(strip_tags($attr['ano']))) : '';
        $enc = (isset($attr['enc'])) ? trim(stripslashes(strip_tags($attr['enc']))) : '';
        $method = (isset($attr['method'])) ? trim(stripslashes(strip_tags($attr['method']))) : '';
        $name = (isset($attr['name'])) ? trim(stripslashes(strip_tags($attr['name']))) : '';
        $partNum = (isset($attr['partNum'])) ? trim(stripslashes(strip_tags($attr['partNum']))) : '';
        $subtype = (isset($attr['subtype'])) ? trim(stripslashes(strip_tags($attr['subtype']))) : '';

        $CC = self::getMailConfigurationById(array('id' => $id));
        $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], $folder, $CC['imapport'], 'notls');
        $path = $imap->downloadAttachment($imap->get_stream(), $messageNumber, $ano);
        // $result = array('path' => $path);
        return $path;
//        $structure = imap_fetchstructure($this->stream, $messageNumber);
//        $attachments = '';
//        if (isset($structure->parts) && count($structure->parts)) {
//            for ($i = 0; $i < count($structure->parts); $i++) {
//                if (strtoupper($structure->parts[$i]->disposition) == 'ATTACHMENT') {
//
//                    $attachments[$i] = array(
//                        'is_attachment' => false,
//                        'filename' => '',
//                        'name' => '',
//                        'attachment' => '');
//
//                    if ($structure->parts[$i]->ifdparameters) {
//                        foreach ($structure->parts[$i]->dparameters as $object) {
//                            if (strtolower($object->attribute) == 'filename') {
//                                $attachments[$i]['is_attachment'] = true;
//                                $attachments[$i]['filename'] = $object->value;
//                            }
//                        }
//                    }
//
//                    if ($structure->parts[$i]->ifparameters) {
//                        foreach ($structure->parts[$i]->parameters as $object) {
//                            if (strtolower($object->attribute) == 'name') {
//                                $attachments[$i]['is_attachment'] = true;
//                                $attachments[$i]['name'] = $object->value;
//                            }
//                        }
//                    }
//
//                    if ($attachments[$i]['is_attachment']) {
//                        $attachments[$i]['attachment'] = imap_fetchbody($this->stream, $messageNumber, $i + 1);
//                        if ($structure->parts[$i]->encoding == 3) { // 3 = BASE64
//                            $attachments[$i]['attachment'] = base64_decode($attachments[$i]['attachment']);
//                        } elseif ($structure->parts[$i]->encoding == 4) { // 4 = QUOTED-PRINTABLE
//                            $attachments[$i]['attachment'] = quoted_printable_decode($attachments[$i]['attachment']);
//                        }
//                    }
//
//                    $time = time() . "_" . rand(99, 9999);
//                    file_put_contents('directorio/' . $time . $attachments[$i]['filename'], $attachments[$i]['attachment']);
//                    header("Content-Type: application/octet-stream");
//                    header("Content-Transfer-Encoding: Binary");
//                    header("Content-disposition: attachment; filename=\"" . $attachments[$i]['filename'] . "\"");
//                    echo readfile('directorio/' . $time . $attachments[$i]['filename']);
//                }
//            }
//        }
    }

    function getInbox()
    {
        // $imap = new Imap('mail3.gridhost.co.uk', 'mudassir@navsonsoftware.com', 'gpcmm2015', 'INBOX', 143, 'notls');
        $MailBox = array();
        $isCC = self::isConfigurationExist();
        if ($isCC['total'] > 0) {
            $CC = self::getClientConfiguration();
            $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], 'INBOX', $CC['imapport'], 'notls');
            if ($imap->get_is_connected() == 0) {
                $MailBox = array('isconnected' => 0);
            } else if ($imap->get_is_connected() == 1) {
                $MailBox = $imap->returnMailBoxHeaderArr();
                //console.log($MailBox);  console.log('get inbox');
            }
        }

        return $MailBox;
    }

    function getInboxMessage($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $messageNumber = (isset($attr['messageNumber'])) ? trim(stripslashes(strip_tags($attr['messageNumber']))) : '';
        $CC = self::getClientConfiguration();
        $imap = new Imap($CC['imapserver'], $CC['username'], $CC['password'], 'INBOX', $CC['imapport'], 'notls');
        $MessageArr = $imap->returnEmailMessageArr($messageNumber);
        return $MessageArr;
    }

    function getUserInfo($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';

        if (!empty($attr['id'])) $where_clause .= " AND ac.id = '".$attr['id']."' ";

        $result = array();
        $Sql = "SELECT ac.id,ac.alias,ac.username FROM client_configuration   ac
		left JOIN company ON company.id=ac.company_id
		WHERE
		  ac.status=1  
		AND (ac.company_id=" . $this->arrUser['company_id'] . " OR  company.parent_id=" . $this->arrUser['company_id'] . ")	
		 " . $where_clause . "
		 ORDER BY id DESC";
        //echo  $Sql;exit;

        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $result = array('alias' => $row['alias'], 'username' => $row['username'], 'id' => $row['id']);
                break;
            }
        }
        return $result;
    }

    function hasUnreadMails($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $folder = (isset($attr['folder'])) ? trim(stripslashes(strip_tags($attr['folder']))) : '';

        $result = array();
        $isConfig = self::isConfigurationExist();
        $unread = 0;
        if ($isConfig['total'] > 0) {

            $UserId = $this->arrUser['id'];
            $Sql = "SELECT * FROM client_configuration WHERE id = $UserId ORDER BY id DESC";
            $RS = $this->objsetup->CSI($Sql);
            $i = 0;
            $valid = 0;
            $results = array();

            if ($RS->RecordCount() > 0) {

                while ($row = $RS->FetchRow()) {
                    $unumber = 0;
                    $imap = new Imap($row['imapserver'], $row['username'], $row['password'], $folder, $row['imapport'], 'notls');
                    if ($imap->get_is_connected() == 1) {
                        $MailBox = $imap->returnMailBoxHeaderArr();
                        foreach ($MailBox as $Mail) {
                            if ($Mail['Recent'] == 'N' || $Mail['Recent'] == 'R' || $Mail['Unseen'] == 'U') {
                                $unread++;
                            }
                        }
                    }
                }
            }
        }
        $results['unreadMails'] = $unread;
        return $results;
    }
/* 
    function getToken($user_name, $password)
    {
        $response = array();
		$password = $this->objGeneral->encrypt_password_1($password);
		//echo $attr['password']; exit;

        $Sql = "SELECT  emp.company_id,
                        emp.id,emp.user_type,
                        emp.user_email,  
                        emp.first_name,emp.last_name 
                 FROM employees as emp
                 JOIN company as comp ON comp.id = emp.user_company
                 LEFT JOIN currency ON currency.id = comp.currency_id
                 WHERE  emp.user_email='" . $user_name . "' 	AND 
                        emp.user_password='" . $password . "' 
                 LIMIT 1";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();

            if ($Row['user_type'] == 0) {
                $response['response'] = 0;
                $response['ack'] = 0;
                $response['error'] = "Invalid login credentials";
                return $response;
            }

            $response['response'] = array(
                "token" => $this->objGeneral->set_token($Row['id']) . "." . $this->objGeneral->set_token($Row['user_email']),
                "id" => $Row['id'],
                "user" => $Row['first_name'] . ' ', //.$Row['last_name'],
                "user_name" => $Row['user_email'],
                "user_type" => $Row['user_type'],
                "deparment" => $Row['department']
            );

        }
        return $response;
    } */

    function unreadStatusUpdate($attr){

        $Sql = "UPDATE email_save SET unreadStatus = $attr[val] WHERE id = ".$attr['id'].";";
        $RS = $this->objsetup->CSI($Sql);

        if ($this->Conn->Affected_Rows() > 0) {
                $response['ack'] = 1;
                $response['error'] = NULL;
                $response['msg'] = 'Record Updated Successfully';
            }
            else{
                $response['ack'] = 0;
                $response['error'] = NULL;
                $response['msg'] = 'Record Updated Successfully';
            }
        return $response;
    }

    function getAllEmployeeEmails(){
        // this will return all employees + configurations regardless of the company
        $Sql = "SELECT emp.id as empId, emp.company_id, emp.user_email, CONCAT(emp.first_name, ' ', emp.last_name) as empAlias, email_password, cc.*, (SELECT max(message_id) FROM email_save where user_id = emp.id ) as lastUID
         FROM employees emp
        LEFT JOIN client_configuration cc on cc.company_id = emp.company_id 
        where (email_password <> '' and email_password is not null) and emp.status <> -1 and  cc.primaryConfiguration = 1 ;";
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function getEmployeeEmails()
    {
        $Sql = "SELECT id, user_email, CONCAT(first_name, ' ', last_name) as alias, email_password FROM employees where company_id = " . $this->arrUser['company_id'] . " and (email_password <> '' and email_password is not null) ;";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }


    function UploadAttachments($attr){

    }

    function UploadEmailCompanyLess($attr)
    {
        $this->objGeneral->mysql_clean($attr);


        $subject = $attr['subject'];
        $body = $attr['body'];
        $from = $attr['sender'][0]->name . " (".$attr['sender'][0]->address . ")";
        $to = $attr['receiverId'];
        $toAddress = $attr['to'];
        $cc = $attr['cc'];
        $alias = $attr['receiverAlias'];
        $uid = $attr['uid'];
        // print_r($attr);exit;

        $additionalColumns = "";
        if (!empty($attr['virtualEmailData']->id)){
				//		,email_address_to='" . $attr['virtualEmailData']->alias . " (".$attr['virtualEmailData']->address.")" . "'
            
            $SqlInsert = "INSERT INTO email_save SET
						 email_address_from='" . $from . "'
						,email_address_to='" . $toAddress . "'
                        ,cc = '" . $cc . "'
						,email_subject='" . $subject . "'
						,message_id='" . $uid . "'
                        ,type = '2'
						,email_body= '" . base64_encode(trim(stripslashes($body))) . "'
						,company_id= '" . $attr['virtualEmailData']->company_id . "'
						,user_id='0'
                        ,date_added='" . current_date_time . "'
                        ,virtualEmail = " . $attr['virtualEmailData']->id . "
                        ";
        }

        else{
				//		,email_address_to='" . $alias . " (".$attr['receiver'].")" . "'
            $SqlInsert = "INSERT INTO email_save SET
						 email_address_from='" . $from . "'
						,email_address_to='" . $toAddress . "'
						,cc='" . $cc . "'
						,email_subject='" . $subject . "'
						,message_id='" . $uid . "'
                        ,type = '2'
						,email_body= '" . base64_encode(trim(stripslashes($body))) . "'
						,company_id= '" . $attr['company_id'] . "'
						,user_id='" . $to . "'
                        ,date_added='" . current_date_time . "'              
                        ";
            
        }
        // echo $SqlInsert.PHP_EOL;exit;
        $RS = $this->objsetup->CSI($SqlInsert);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['id'] = $id;
            if (sizeof($attr['attachments'])){
                $response['fileNames'] = array();
                for ($i = 0; $i < sizeof($attr['attachments']); $i++){
                    // $response['fileNames'][] = $attr['attachments'][$i]->generatedFileName;
                    $response['fileNames'][] = $attr['attachments'][$i]->fileName;
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['sql'] = $SqlInsert;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }


    function UploadEmail($attr)
    {
        // print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);


        $subject = $attr['subject'];
        $body = $attr['body'];
        $from = $attr['sender'][0]->name . " (".$attr['sender'][0]->address . ")";
        $to = $attr['receiverId'];
        $alias = $attr['receiverAlias'];
        // print_r($attr);exit;

        $additionalColumns = "";
        if (!empty($attr['virtualEmailData']->id)){
            $SqlInsert = "INSERT INTO email_save SET
						 email_address_from='" . $from . "'
						,email_address_to='" . $attr['virtualEmailData']->alias . " (".$attr['virtualEmailData']->address.")" . "'
						,email_subject='" . $subject . "'
                        ,type = '2'
						,email_body= '" . base64_encode(trim(stripslashes($body))) . "'
						,company_id= '" . $this->arrUser['company_id'] . "'
						,user_id='0'
                        ,date_added='" . current_date_time . "'
                        ,virtualEmail = " . $attr['virtualEmailData']->id . "
                        ";
        }

        else
            $SqlInsert = "INSERT INTO email_save SET
						 email_address_from='" . $from . "'
						,email_address_to='" . $alias . " (".$attr['receiver'].")" . "'
						,email_subject='" . $subject . "'
                        ,type = '2'
						,email_body= '" . base64_encode(trim(stripslashes($body))) . "'
						,company_id= '" . $this->arrUser['company_id'] . "'
						,user_id='" . $to . "'
                        ,date_added='" . current_date_time . "'              
                        ";
        // echo $SqlInsert.PHP_EOL;exit;
        $RS = $this->objsetup->CSI($SqlInsert);
        $id = $this->Conn->Insert_ID();

        if ($id > 0) {
            $response['id'] = $id;
            if (sizeof($attr['attachments'])){
                $response['fileNames'] = array();
                for ($i = 0; $i < sizeof($attr['attachments']); $i++){
                    $response['fileNames'][] = $attr['attachments'][$i]->generatedFileName;
                }
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record not inserted!';
        }

        return $response;
    }

    function GetAllEmails($attr)
    {
        $this->objGeneral->mysql_clean($attr);

        $Sql = " SELECT * From api_emails ";
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $response['ack'] = 1;
        $response['error'] = NULL;

        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = $Row;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }

    function getAliasByVirtualEmail ($id){
        $Sql = "SELECT ve.username, ve.alias FROM virtual_emails ve WHERE ve.id = $id ;";
        //  echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $results = array();
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $results['alias'] = $row['alias'];
                $results['username'] = $row['username'];
            }
        }
        //print_r($results);exit;
        return $results;
    }

    function getPrimaryConfiguration (){
        // return null;
        // $Sql = "SELECT * FROM client_configuration WHERE company_id = " . $this->arrUser['company_id'] . " AND primaryConfiguration = 1;";
        // //echo $Sql;exit;
        // $RS = $this->objsetup->CSI($Sql);
        // $results = array();
        // if ($RS->RecordCount() > 0) {
        //     while ($row = $RS->FetchRow()) {
        //         $results = array('username' => $row['username'], 'password' => $row['password'], 'pop3server' => $row['pop3server'],
        //             'pop3port' => $row['pop3port'], 'pop3ssl' => $row['pop3ssl'], 'pop3spa' => $row['pop3spa'], 'imapserver' => $row['imapserver'],
        //             'imapport' => $row['imapport'], 'imapssl' => $row['imapssl'], 'imapspa' => $row['imapspa'], 'smtpserver' => $row['smtpserver'],
        //             'smtpport' => $row['smtpport'], 'smtpssl' => $row['smtpssl'], 'smtpspa' => $row['smtpspa'], 'smtpauth' => $row['smtpauth'], 'alias' => $row['alias']);
        //         $results['ack'] = 1;                                
        //     }
        // }
        // else{
        //     $results['ack'] = 0;
        //     $results['error'] = "No primary configuration!";
        // }

        $Sql = "SELECT CONCAT(first_name, ' ', last_name) as name, user_email, email_password FROM employees WHERE id = " . $this->arrUser['id'] . ";";
        $RS = $this->objsetup->CSI($Sql);
        // $results = array();
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $results['alias'] = $row['name'];
                $results['username'] = $row['user_email'];
                // $results['password'] = $row['email_password'];
                /* $results = array('username' => $row['username'], 'password' => $row['password'], 'pop3server' => $row['pop3server'],
                    'pop3port' => $row['pop3port'], 'pop3ssl' => $row['pop3ssl'], 'pop3spa' => $row['pop3spa'], 'imapserver' => $row['imapserver'],
                    'imapport' => $row['imapport'], 'imapssl' => $row['imapssl'], 'imapspa' => $row['imapspa'], 'smtpserver' => $row['smtpserver'],
                    'smtpport' => $row['smtpport'], 'smtpssl' => $row['smtpssl'], 'smtpspa' => $row['smtpspa'], 'smtpauth' => $row['smtpauth'], 'alias' => $row['alias']); */
            }
            $results['ack'] = 1;
        }
        
        // print_r($results);exit;
        return $results;
    }


    function getClientConfigurationByEmail ($email){
        $Sql = "SELECT * FROM client_configuration WHERE username = '$email'";
        //echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);
        $results = array();
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {
                $results = array('username' => $row['username'], 'password' => $row['password'], 'pop3server' => $row['pop3server'],
                    'pop3port' => $row['pop3port'], 'pop3ssl' => $row['pop3ssl'], 'pop3spa' => $row['pop3spa'], 'imapserver' => $row['imapserver'],
                    'imapport' => $row['imapport'], 'imapssl' => $row['imapssl'], 'imapspa' => $row['imapspa'], 'smtpserver' => $row['smtpserver'],
                    'smtpport' => $row['smtpport'], 'smtpssl' => $row['smtpssl'], 'smtpspa' => $row['smtpspa'], 'smtpauth' => $row['smtpauth'], 'alias' => $row['alias']);
            }
        }
        //print_r($results);exit;
        return $results;
    }

    

    function htmlToPlainText($str){
        // $str = str_replace('&nbsp;', ' ', $str);
        // $str = html_entity_decode($str, ENT_QUOTES | ENT_COMPAT , 'UTF-8');
        // $str = html_entity_decode($str, ENT_HTML5, 'UTF-8');
        // $str = html_entity_decode($str);
        // $str = htmlspecialchars_decode($str);
        // $str = strip_tags($str);
        $str = preg_replace('/(<(script|style)\b[^>]*>).*?(<\/\2>)/is', "$1$3", $str);

        $dom = new DOMDocument();
        $dom->loadHTML("<body>" . strip_tags($str, '<b><a><i><div><span><p>') . "</body>");
        $xpath = new DOMXPath($dom);
        $node = $xpath->query('body')->item(0);
        return $node->textContent; // text
    
        // return $str;
    }

    function getInboxEmails($attr){
        // print_r($attr);exit;
        require_once(SERVER_PATH . "/classes/Setup.php");
        $objsetup = new Setup($this->arrUser);
        $where_type_clause = "";
        $where = "";



        if ($attr['module_name']){
            //apply that module's bucket
            if ($attr['module_name'] == 'crm'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%CRM%' ";
                $subQuery = "SELECT  c.id
                    from sr_crm_listing  c 
                    where  c.type IN (1,2) and c.company_id=" . $this->arrUser['company_id'] . " ";
                //$subQuery = $objsetup->whereClauseAppender($subQuery,40);
            }
            else if ($attr['module_name'] == 'srm'){
                $module_type = 2;
                $where_module_name .= "  main_module_name LIKE '%SRM%' ";
                $subQuery = "SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (1,2) AND
                            (s.company_id=" . $this->arrUser['company_id'] . " ) ";
                //$subQuery = $objsetup->whereClauseAppender($subQuery,18);
            }
            else if ($attr['module_name'] == 'customer'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Customer%' ";
                $subQuery = "SELECT  c.id
                    from sr_crm_listing  c 
                    where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
               // $subQuery = $objsetup->whereClauseAppender($subQuery,48);
            }
            else if ($attr['module_name'] == 'sales'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Sales%' ";
                $subQuery = "SELECT orderscache.id FROM orderscache WHERE sell_to_cust_id IN (SELECt c.id
                    from sr_crm_listing  c 
                    where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'credit_note'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Credit Note%' ";
                $subQuery = "SELECT return_orders.id FROM return_orders WHERE sell_to_cust_id IN (SELECt c.id
                    from sr_crm_listing  c 
                    where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'supplier'){
                $module_type = 2;
                $where_module_name .= "  main_module_name LIKE '%Supplier%' ";
                $subQuery = "SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (2,3) AND 
                            s.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $objsetup->whereClauseAppender($subQuery,24);
            }
            else if ($attr['module_name'] == 'purchase'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%purchase%' ";
                $subQuery = "SELECT srm_invoice.id FROM srm_invoice WHERE sell_to_cust_id IN (SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (2,3) AND 
                            s.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'debit_note'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Debit Note%' ";
                $subQuery = "SELECT srm_order_return.id FROM srm_order_return WHERE supplierID IN (SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (2,3) AND 
                            s.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'hr'){
                $module_type = 7;
                $where_module_name .= "  main_module_name LIKE '%HR%' AND user_id = " . $this->arrUser['id'] . " ";
            }
            else if ($attr['module_name'] == 'warehouse'){
                $module_type = 8;
                $where_module_name .= "  main_module_name LIKE '%Warehouse%' AND user_id = " . $this->arrUser['id'] . " ";
            }
            else{
                $where_module_name .= "  main_module_name LIKE '%$attr[module_name]%' AND user_id = " . $this->arrUser['id'] . " ";
            }

            if ($attr['record_id']){
                //apply that module's bucket and that record
                $where = "$where_module_name and es.ass_id = $attr[record_id] ";
            }
            else{
                //apply that module's bucket
                if ($subQuery){
                    $where = "$where_module_name and (es.ass_id IN (".$subQuery.")";
                }
                else{
                    $where = "$where_module_name and (1";
                }
            }
        }
        else{
            //apply buckets for all modules + virtual accounts + directly sent
            $crmSubQuery = "SELECT  c.id
                from sr_crm_listing  c 
                where  c.type IN (1,2) and c.company_id=" . $this->arrUser['company_id'] . " ";
            //$crmSubQuery = $objsetup->whereClauseAppender($crmSubQuery,40);
            $srmSubQuery = "SELECT  s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (1,2) AND
                        (s.company_id=" . $this->arrUser['company_id'] . " ) ";
            //$srmSubQuery = $objsetup->whereClauseAppender($srmSubQuery,18);
            $custSubQuery = "SELECT  c.id
                from sr_crm_listing  c 
                where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
            //$custSubQuery = $objsetup->whereClauseAppender($custSubQuery,48);
            $saleSubQuery = "SELECT orderscache.id FROM orderscache WHERE sell_to_cust_id IN (SELECt c.id
                from sr_crm_listing  c 
                where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
            //$saleSubQuery = $this->objsetup->whereClauseAppender($saleSubQuery,48);
            $saleSubQuery .= " )";
            $creditNoteSubQuery = "SELECT return_orders.id FROM return_orders WHERE sell_to_cust_id IN (SELECt c.id
                from sr_crm_listing  c 
                where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
            //$creditNoteSubQuery = $this->objsetup->whereClauseAppender($creditNoteSubQuery,48);
            $creditNoteSubQuery .= " )";
            $suppSubQuery = "SELECT  s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (2,3) AND 
                        s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$suppSubQuery = $objsetup->whereClauseAppender($suppSubQuery,24);
            $purchaseSubQuery = "SELECT srm_invoicecache.id FROM srm_invoicecache WHERE sell_to_cust_id IN (SELECt s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (2,3) AND 
                        s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$purchaseSubQuery = $this->objsetup->whereClauseAppender($purchaseSubQuery,24);
            $purchaseSubQuery .= " )";
            $debitNoteSubQuery = "SELECT srm_order_returncache.id FROM srm_order_returncache WHERE supplierID IN (SELECt s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (2,3) AND 
                        s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$debitNoteSubQuery = $this->objsetup->whereClauseAppender($debitNoteSubQuery,24);
            $debitNoteSubQuery .= " )";
            $allBucketsQuery =  " (main_module_name is null OR (main_module_name LIKE '%CRM%' and es.ass_id IN ($crmSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%SRM%' and es.ass_id IN ($srmSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%HR%' AND user_id = " . $this->arrUser['id'] . ") OR (main_module_name LIKE '%Warehouse%' AND user_id = " . $this->arrUser['id'] . ") ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Customer%' and es.ass_id IN ($custSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Sale%' and es.ass_id IN ($saleSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Credit Note%' and es.ass_id IN ($creditNoteSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Supplier%' and es.ass_id IN ($suppSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Purchase%' and es.ass_id IN ($purchaseSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Debit Note%' and es.ass_id IN ($debitNoteSubQuery)) ";
            $allBucketsQuery .= " ) ";
            $where = $allBucketsQuery;
        }

        if ($attr['isAll']){
            if ($attr['module_name']){
                $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 2 and $where or
                    (
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                        OR
                        (user_id = ".$this->arrUser['id'].")
                    ))
                    order by id desc; ";

                if ($attr['record_id']){
                    $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 2 and $where
                    order by id desc; ";
                }
                
            }
            else{
                $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 2 and
                    (
                        ($where)
                        OR
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                        OR
                        (user_id = ".$this->arrUser['id'].")
                    )
                    order by id desc; ";
            }
        }
        else if ($attr['selectedAccount']){
            if ($attr['module_name']){
                $Sql = "SELECT * FROM sr_email_save_info es WHERE ass_module = '$attr[module_name]' and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and virtualEmail = $attr[selectedAccount] and
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                    order by id desc; ";

                if ($attr['record_id']){
                    $Sql = "SELECT * FROM sr_email_save_info es WHERE ass_module = '$attr[module_name]' and ass_id = $attr[record_id] and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and virtualEmail = $attr[selectedAccount] and
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                    order by id desc; ";
                }
            }
            else{
                $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 2 and virtualEmail = $attr[selectedAccount] and
                    (
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                    )
                    order by id desc; ";
            }
            // $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and  (es.type = 2 and virtualEmail = $attr[selectedAccount]) order by id desc; ";
        }
        else{
            if ($attr['module_name']){
                $Sql = "SELECT * FROM sr_email_save_info es WHERE virtualEmail = 0 and  company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 2 and $where or
                    (
                        (user_id = ".$this->arrUser['id'].")
                    ))
                    order by id desc; ";

                if ($attr['record_id']){
                    $Sql = "SELECT * FROM sr_email_save_info es WHERE virtualEmail = 0 and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 2 and $where and user_id = ".$this->arrUser['id']."
                    order by id desc; ";
                }
                
            }
            else{
                $Sql = "SELECT * FROM sr_email_save_info es WHERE virtualEmail = 0 and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 2 and
                    ( main_module_name is null or 
                        ($where)
                        and
                        (user_id = ".$this->arrUser['id'].")
                    )
                    order by id desc; ";
            }
            // $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and  (es.type = 2 and user_id = ".$this->arrUser['id'].") order by id desc; ";
        }
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $response['q'] = $Sql;
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $ids = array();
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $ids[] = $Row['id'];
                $Row['date_added'] = $this->objGeneral->convert_unix_into_datetime($Row['date_added']);
                $Row['email_body'] = base64_decode($Row['email_body']);
                $Row['email_body'] = preg_replace('/(<(script|style)\b[^>]*>).*?(<\/\2>)/is', "$1$3", $Row['email_body']);
                $Row['email_body'] = preg_replace('/[^(\x20-\x7F)\x0A\x0D]*/','', $Row['email_body']);
                $Row['email_body_trimmed'] = substr($this->htmlToPlainText($Row['email_body']),0,100) ;
                if (!$Row['email_body_trimmed']){
                    $Row['email_body_trimmed'] = " ";
                }
                if ($Row['ass_id'])
                    $Row['association'][] = array('assName'=>$Row['ass_name'], 'assId'=>$Row['ass_id'], 'assModule'=>$Row['ass_module']);

                $dupChk = 0;
                for ($l = sizeof($response['response']); $l >= 0 ; $l--){
                    if ($response['response'][$l]['id'] == $Row['id']){
                        $dupChk = 1;
                        $response['response'][$l]['association'][] = $Row['association'][0];
                        break;
                    }
                }

                if ($dupChk == 0){
                    $response['response'][] = $Row;
                }
            }
            $ids = implode(",", $ids);
            // print_r($ids);exit;
            $attachments = array();
            $SqlGetAttachments = "SELECT att.*, gen.email_id as email_id FROM attachments att
                                            LEFT JOIN general_email_attachments gen on att.id = gen.attachment_id WHERE gen.email_id IN ($ids) ;";
                                            //echo $SqlGetAttachments;exit;
                $GeneralAttachments = $this->objsetup->CSI($SqlGetAttachments);
                if ($GeneralAttachments->RecordCount() > 0) {
                    while ($Row2 = $GeneralAttachments->FetchRow()) {
                        foreach ($Row2 as $key => $value) {
                            if (is_numeric($key))
                                unset($Row2[$key]);
                        }
                        $Row2['nonGenPath'] = $Row2['path'];
                        $Row2['path'] = WEB_PATH . "/" . explode("//", $Row2['path'])[1];
                        $attachments[] = $Row2;
                    }

                }
                // print_r($attachments);exit;
                for ($i = 0; $i < sizeof($attachments); $i++){
                    for ($j = 0; $j < sizeof($response['response']); $j++){
                        if ($response['response'][$j]['id'] == $attachments[$i]['email_id']){
                            $response['response'][$j]['attachments'][] = $attachments[$i];
                        }
                    }
                }
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    function getDraftEmails($attr){
        // print_r($attr);exit;
        require_once(SERVER_PATH . "/classes/Setup.php");
        $objsetup = new Setup($this->arrUser);
        $where_type_clause = "";
        $where = "";



        if ($attr['module_name']){
            //apply that module's bucket
            if ($attr['module_name'] == 'crm'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%CRM%' ";
                $subQuery = "SELECT  c.id
                    from sr_crm_listing  c 
                    where  c.type IN (1,2) and c.company_id=" . $this->arrUser['company_id'] . " ";
                //$subQuery = $objsetup->whereClauseAppender($subQuery,40);
            }
            else if ($attr['module_name'] == 'srm'){
                $module_type = 2;
                $where_module_name .= "  main_module_name LIKE '%SRM%' ";
                $subQuery = "SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (1,2) AND
                            (s.company_id=" . $this->arrUser['company_id'] . " ) ";
                //$subQuery = $objsetup->whereClauseAppender($subQuery,18);
            }
            else if ($attr['module_name'] == 'customer'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Customer%' ";
                $subQuery = "SELECT  c.id
                    from sr_crm_listing  c 
                    where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $objsetup->whereClauseAppender($subQuery,48);
            }
            else if ($attr['module_name'] == 'sales'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Sales%' ";
                $subQuery = "SELECT orderscache.id FROM orderscache WHERE sell_to_cust_id IN (SELECt c.id
                    from sr_crm_listing  c 
                    where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'credit_note'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Credit Note%' ";
                $subQuery = "SELECT return_orders.id FROM return_orders WHERE sell_to_cust_id IN (SELECt c.id
                    from sr_crm_listing  c 
                    where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'supplier'){
                $module_type = 2;
                $where_module_name .= "  main_module_name LIKE '%Supplier%' ";
                $subQuery = "SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (2,3) AND 
                            s.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $objsetup->whereClauseAppender($subQuery,24);
            }
            else if ($attr['module_name'] == 'purchase'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%purchase%' ";
                $subQuery = "SELECT srm_invoice.id FROM srm_invoice WHERE sell_to_cust_id IN (SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (2,3) AND 
                            s.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'debit_note'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Debit Note%' ";
                $subQuery = "SELECT srm_order_return.id FROM srm_order_return WHERE supplierID IN (SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (2,3) AND 
                            s.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'hr'){
                $module_type = 7;
                $where_module_name .= "  main_module_name LIKE '%HR%' AND user_id = " . $this->arrUser['id'] . " ";
                $subQuery = "SELECT  e.id
                FROM employees as e 
                WHERE   e.status <> -1 AND
                        (e.company_id=" . $this->arrUser['company_id'] . " ) ";
            }
            else if ($attr['module_name'] == 'warehouse'){
                $module_type = 8;
                $where_module_name .= "  main_module_name LIKE '%Warehouse%' AND user_id = " . $this->arrUser['id'] . " ";
                $subQuery = "SELECT  w.id
                FROM warehouse as w 
                WHERE   w.status <> -1 AND
                        (w.company_id=" . $this->arrUser['company_id'] . " ) ";
            }
            else{
                $where_module_name .= "  main_module_name LIKE '%$attr[module_name]%' AND user_id = " . $this->arrUser['id'] . " ";
            }

            if ($attr['record_id']){
                //apply that module's bucket and that record
                $where = $where_module_name ." and es.ass_id = $attr[record_id] ";
            }
            else{
                //apply that module's bucket
                if ($subQuery){
                    $where = $where_module_name." and (es.ass_id IN (".$subQuery.")";
                }
                else{
                    $where = $where_module_name." and (1";
                }
            }
        }
        else{
            //apply buckets for all modules + virtual accounts + directly sent
            $crmSubQuery = "SELECT  c.id
                from sr_crm_listing  c 
                where  c.type IN (1,2) and c.company_id=" . $this->arrUser['company_id'] . " ";
            //$crmSubQuery = $objsetup->whereClauseAppender($crmSubQuery,40);
            $srmSubQuery = "SELECT  s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (1,2) AND
                        (s.company_id=" . $this->arrUser['company_id'] . " ) ";
            //$srmSubQuery = $objsetup->whereClauseAppender($srmSubQuery,18);
            $custSubQuery = "SELECT  c.id
                from sr_crm_listing  c 
                where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
            //$custSubQuery = $objsetup->whereClauseAppender($custSubQuery,48);
            $saleSubQuery = "SELECT orderscache.id FROM orderscache WHERE sell_to_cust_id IN (SELECt c.id
                from sr_crm_listing  c 
                where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
            //$saleSubQuery = $this->objsetup->whereClauseAppender($saleSubQuery,48);
            $saleSubQuery .= " )";
            $creditNoteSubQuery = "SELECT return_orders.id FROM return_orders WHERE sell_to_cust_id IN (SELECt c.id
                from sr_crm_listing  c 
                where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
            //$creditNoteSubQuery = $this->objsetup->whereClauseAppender($creditNoteSubQuery,48);
            $creditNoteSubQuery .= " )";
            $suppSubQuery = "SELECT  s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (2,3) AND 
                        s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$suppSubQuery = $objsetup->whereClauseAppender($suppSubQuery,24);
            $purchaseSubQuery = "SELECT srm_invoicecache.id FROM srm_invoicecache WHERE sell_to_cust_id IN (SELECt s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (2,3) AND 
                        s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$purchaseSubQuery = $this->objsetup->whereClauseAppender($purchaseSubQuery,24);
            $purchaseSubQuery .= " )";
            $debitNoteSubQuery = "SELECT srm_order_returncache.id FROM srm_order_returncache WHERE supplierID IN (SELECt s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (2,3) AND 
                        s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$debitNoteSubQuery = $this->objsetup->whereClauseAppender($debitNoteSubQuery,24);
            $debitNoteSubQuery .= " )";
            $hrSubQuery = "SELECT e.id
                            FROM employees as e
                            WHERE e.status <> -1 ";
            $whSubQuery = "SELECT w.id
                            FROM warehouse as w
                            WHERE w.status <> -1 ";
            $allBucketsQuery =  " (main_module_name is null OR (main_module_name LIKE '%CRM%' and es.ass_id IN ($crmSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%SRM%' and es.ass_id IN ($srmSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%HR%' and es.ass_id IN ($hrSubQuery) AND user_id = " . $this->arrUser['id'] . ") OR (main_module_name LIKE '%Warehouse%'  and es.ass_id IN ($whSubQuery) AND user_id = " . $this->arrUser['id'] . ") ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Customer%' and es.ass_id IN ($custSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Sale%' and es.ass_id IN ($saleSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Credit Note%' and es.ass_id IN ($creditNoteSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Supplier%' and es.ass_id IN ($suppSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Purchase%' and es.ass_id IN ($purchaseSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Debit Note%' and es.ass_id IN ($debitNoteSubQuery)) ";
            $allBucketsQuery .= " ) ";
            $where = $allBucketsQuery;
        }

        if ($attr['isAll']){
            if ($attr['module_name']){
                $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 3 and $where or
                    (
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                        OR
                        (user_id = ".$this->arrUser['id'].")
                    ))
                    order by id desc; ";

                if ($attr['record_id']){
                    $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 3 and $where
                    order by id desc; ";
                }
                
            }
            else{
                $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 3 and
                    (
                        ($where)
                        OR
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                        OR
                        (user_id = ".$this->arrUser['id'].")
                    )
                    order by id desc; ";
            }
        }
        else if ($attr['selectedAccount']){
            if ($attr['module_name']){
                $Sql = "SELECT * FROM sr_email_save_info es WHERE ass_module = '$attr[module_name]' and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and virtualEmail = $attr[selectedAccount] and
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                    order by id desc; ";

                if ($attr['record_id']){
                    $Sql = "SELECT * FROM sr_email_save_info es WHERE ass_module = '$attr[module_name]' and ass_id = $attr[record_id] and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and virtualEmail = $attr[selectedAccount] and
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                    order by id desc; ";
                }
            }
            else{
                $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 3 and virtualEmail = $attr[selectedAccount] and
                    (
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                    )
                    order by id desc; ";
            }
            // $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and  (es.type = 2 and virtualEmail = $attr[selectedAccount]) order by id desc; ";
        }
        else{
            if ($attr['module_name']){
                $Sql = "SELECT * FROM sr_email_save_info es WHERE virtualEmail = 0 and  company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 3 and $where or
                    (
                        (user_id = ".$this->arrUser['id'].")
                    ))
                    order by id desc; ";

                if ($attr['record_id']){
                    $Sql = "SELECT * FROM sr_email_save_info es WHERE virtualEmail = 0 and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 3 and $where and user_id = ".$this->arrUser['id']."
                    order by id desc; ";
                }
                
            }
            else{
                $Sql = "SELECT * FROM sr_email_save_info es WHERE virtualEmail = 0 and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 3 and
                    (
                        ($where)
                        and
                        (user_id = ".$this->arrUser['id'].")
                    )
                    order by id desc; ";
            }
            // $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and  (es.type = 2 and user_id = ".$this->arrUser['id'].") order by id desc; ";
        }
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        $response['q'] = $Sql;
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $SqlGetAttachments = "SELECT att.* FROM attachments att
                                            LEFT JOIN general_email_attachments gen on att.id = gen.attachment_id WHERE gen.email_id = $Row[id] ;";
                                            //echo $SqlGetAttachments;exit;
                $GeneralAttachments = $this->objsetup->CSI($SqlGetAttachments);
                if ($GeneralAttachments->RecordCount() > 0) {
                    while ($Row2 = $GeneralAttachments->FetchRow()) {
                        foreach ($Row2 as $key => $value) {
                            if (is_numeric($key))
                                unset($Row2[$key]);
                        }
                        $Row2['nonGenPath'] = $Row2['path'];
                        $Row2['path'] = WEB_PATH . "/" . explode("//", $Row2['path'])[1];
                        $Row['attachments'][] = $Row2;
                    }

                }
                $Row['date_added'] = $this->objGeneral->convert_unix_into_datetime($Row['date_added']);
                $Row['email_body'] = base64_decode($Row['email_body']);
                $Row['email_body'] = preg_replace('/(<(script|style)\b[^>]*>).*?(<\/\2>)/is', "$1$3", $Row['email_body']);
                $Row['email_body'] = preg_replace('/[^(\x20-\x7F)\x0A\x0D]*/','', $Row['email_body']);
                $Row['email_body_trimmed'] = substr($this->htmlToPlainText($Row['email_body']),0,100) ;
                if (!$Row['email_body_trimmed']){
                    $Row['email_body_trimmed'] = " ";
                }

                if ($Row['ass_id'])
                    $Row['association'][] = array('assName'=>$Row['ass_name'], 'assId'=>$Row['ass_id'], 'assModule'=>$Row['ass_module']);

                $dupChk = 0;
                for ($l = sizeof($response['response']); $l >= 0 ; $l--){
                    if ($response['response'][$l]['id'] == $Row['id']){
                        $dupChk = 1;
                        $response['response'][$l]['association'][] = $Row['association'][0];
                        break;
                    }
                }

                if ($dupChk == 0){
                    $response['response'][] = $Row;
                }
            }
        } else {
            $response['response'] = array();
        }
        return $response;
    }


    function getModuleEmails($attr){
        require_once(SERVER_PATH . "/classes/Setup.php");
        $objsetup = new Setup($this->arrUser);

        $where_type_clause = "";
        $where = "";



        if ($attr['module_name']){
            //apply that module's bucket
            if ($attr['module_name'] == 'crm' || $attr['module_name'] == 'crm_retailer'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%CRM%' ";
                $subQuery = "SELECT  c.id
                    from sr_crm_listing  c 
                    where  c.type IN (1,2,4) and c.company_id=" . $this->arrUser['company_id'] . " ";
                //$subQuery = $objsetup->whereClauseAppender($subQuery,40);
            }
            else if ($attr['module_name'] == 'srm'){
                $module_type = 2;
                $where_module_name .= "  main_module_name LIKE '%SRM%' ";
                $subQuery = "SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (1,2) AND
                            s.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $objsetup->whereClauseAppender($subQuery,18);
            }
            else if ($attr['module_name'] == 'customer'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Customer%' ";
                $subQuery = "SELECT  c.id
                    from sr_crm_listing  c 
                    where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $objsetup->whereClauseAppender($subQuery,48);
            }
            else if ($attr['module_name'] == 'sales'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Sales%' ";
                $subQuery = "SELECT orderscache.id FROM orderscache WHERE sell_to_cust_id IN (SELECt c.id
                    from sr_crm_listing  c 
                    where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'credit_note'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Credit Note%' ";
                $subQuery = "SELECT return_orders.id FROM return_orders WHERE sell_to_cust_id IN (SELECt c.id
                    from sr_crm_listing  c 
                    where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,48);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'supplier'){
                $module_type = 2;
                $where_module_name .= "  main_module_name LIKE '%Supplier%' ";
                $subQuery = "SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (2,3) AND 
                            s.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $objsetup->whereClauseAppender($subQuery,24);
            }
            else if ($attr['module_name'] == 'purchase'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%purchase%' ";
                $subQuery = "SELECT srm_invoice.id FROM srm_invoice WHERE sell_to_cust_id IN (SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (2,3) AND 
                            s.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'debit_note'){
                $module_type = 1;
                $where_module_name .= "  main_module_name LIKE '%Debit Note%' ";
                $subQuery = "SELECT srm_order_return.id FROM srm_order_return WHERE supplierID IN (SELECT  s.id
                    FROM sr_srm_general_sel as s 
                    WHERE   s.type IN (2,3) AND 
                            s.company_id=" . $this->arrUser['company_id'] . "  ";
                //$subQuery = $this->objsetup->whereClauseAppender($subQuery,24);
                $subQuery .= " )";
            }
            else if ($attr['module_name'] == 'hr'){
                $module_type = 7;
                $where_module_name .= "  main_module_name LIKE '%HR%' AND user_id = " . $this->arrUser['id'] . " ";
                $subQuery = "SELECT  e.id
                FROM employees as e 
                WHERE   e.status <> -1 AND
                        (e.company_id=" . $this->arrUser['company_id'] . " ) ";
            }
            else if ($attr['module_name'] == 'warehouse'){
                $module_type = 8;
                $where_module_name .= "  main_module_name LIKE '%Warehouse%' AND user_id = " . $this->arrUser['id'] . " ";
                $subQuery = "SELECT  w.id
                FROM warehouse as w 
                WHERE   w.status <> -1 AND
                        (w.company_id=" . $this->arrUser['company_id'] . " ) ";
            }
            else{
                $where_module_name .= "  main_module_name LIKE '%$attr[module_name]%' AND user_id = " . $this->arrUser['id'] . " ";
            }

            if ($attr['record_id']){
                //apply that module's bucket and that record
                $where = "$where_module_name and es.ass_id = $attr[record_id] ";
            }
            else{
                //apply that module's bucket
                if ($subQuery){
                    $where = "$where_module_name and (es.ass_id IN (".$subQuery.")";
                }
                else{
                    $where = "$where_module_name and (1";
                }
            }
        }
        else{
            //apply buckets for all modules + virtual accounts + directly sent
            $crmSubQuery = "SELECT  c.id
                from sr_crm_listing  c 
                where  c.type IN (1,2) and c.company_id=" . $this->arrUser['company_id'] . " ";
            //$crmSubQuery = $objsetup->whereClauseAppender($crmSubQuery,40);
            $srmSubQuery = "SELECT  s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (1,2) AND
                        (s.company_id=" . $this->arrUser['company_id'] . " ) ";
            //$srmSubQuery = $objsetup->whereClauseAppender($srmSubQuery,18);
            $custSubQuery = "SELECT  c.id
                from sr_crm_listing  c 
                where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
            //$custSubQuery = $objsetup->whereClauseAppender($custSubQuery,48);
            $saleSubQuery = "SELECT orderscache.id FROM orderscache WHERE sell_to_cust_id IN (SELECt c.id
                from sr_crm_listing  c 
                where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
            //$saleSubQuery = $this->objsetup->whereClauseAppender($saleSubQuery,48);
            $saleSubQuery .= " )";
            $creditNoteSubQuery = "SELECT return_orders.id FROM return_orders WHERE sell_to_cust_id IN (SELECt c.id
                from sr_crm_listing  c 
                where  c.type IN (2,3) and c.company_id=" . $this->arrUser['company_id'] . "  ";
            //$creditNoteSubQuery = $this->objsetup->whereClauseAppender($creditNoteSubQuery,48);
            $creditNoteSubQuery .= " )";
            $suppSubQuery = "SELECT  s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (2,3) AND 
                        s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$suppSubQuery = $objsetup->whereClauseAppender($suppSubQuery,24);
            $purchaseSubQuery = "SELECT srm_invoicecache.id FROM srm_invoicecache WHERE sell_to_cust_id IN (SELECt s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (2,3) AND 
                        s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$purchaseSubQuery = $this->objsetup->whereClauseAppender($purchaseSubQuery,24);
            $purchaseSubQuery .= " )";
            $debitNoteSubQuery = "SELECT srm_order_returncache.id FROM srm_order_returncache WHERE supplierID IN (SELECt s.id
                FROM sr_srm_general_sel as s 
                WHERE   s.type IN (2,3) AND 
                        s.company_id=" . $this->arrUser['company_id'] . "  ";
            //$debitNoteSubQuery = $this->objsetup->whereClauseAppender($debitNoteSubQuery,24);
            $debitNoteSubQuery .= " )";
            $hrSubQuery = "SELECT e.id
                            FROM employees as e
                            WHERE e.status <> -1 ";
            $whSubQuery = "SELECT w.id
                            FROM warehouse as w
                            WHERE w.status <> -1 ";
            $allBucketsQuery =  " (main_module_name is null OR (main_module_name LIKE '%CRM%' and es.ass_id IN ($crmSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%SRM%' and es.ass_id IN ($srmSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%HR%' and es.ass_id IN ($hrSubQuery) AND user_id = " . $this->arrUser['id'] . ") OR (main_module_name LIKE '%Warehouse%'          and es.ass_id IN ($whSubQuery) AND user_id = " . $this->arrUser['id'] . ") ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Customer%' and es.ass_id IN ($custSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Sale%' and es.ass_id IN ($saleSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Credit Note%' and es.ass_id IN ($creditNoteSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Supplier%' and es.ass_id IN ($suppSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Purchase%' and es.ass_id IN ($purchaseSubQuery)) ";
            $allBucketsQuery .=  " OR (main_module_name LIKE '%Debit Note%' and es.ass_id IN ($debitNoteSubQuery)) ";
            $allBucketsQuery .= " ) ";
            $where = $allBucketsQuery;
        }

        if ($attr['isAll']){
            if ($attr['module_name']){
                $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and $where or
                    (
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                        OR
                        (user_id = ".$this->arrUser['id'].")
                    ))
                    order by id desc; ";

                if ($attr['record_id']){
                    $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and $where
                    order by id desc; ";
                }
                
            }
            else{
                $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and
                    (
                        ($where)
                        OR
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                        OR
                        (user_id = ".$this->arrUser['id'].")
                    )
                    order by id desc; ";
            }
        }
        else if ($attr['selectedAccount']){
            if ($attr['module_name']){
                $Sql = "SELECT * FROM sr_email_save_info es WHERE ass_module = '$attr[module_name]' and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and virtualEmail = $attr[selectedAccount] and
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                    order by id desc; ";

                if ($attr['record_id']){
                    $Sql = "SELECT * FROM sr_email_save_info es WHERE ass_module = '$attr[module_name]' and ass_id = $attr[record_id] and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and virtualEmail = $attr[selectedAccount] and
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                    order by id desc; ";
                }
                
            }
            else{
                $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and virtualEmail = $attr[selectedAccount] and
                    (
                        (
                            virtualEmail IN (SELECT virtual_email_id FROM virtual_email_members WHERE employee_id=".$this->arrUser['id'] . ")
                        )
                    )
                    order by id desc; ";
            }
            // $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and  (es.type = 2 and virtualEmail = $attr[selectedAccount]) order by id desc; ";
        }
        else{
            if ($attr['module_name']){
                $Sql = "SELECT * FROM sr_email_save_info es WHERE virtualEmail = 0 and  company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and $where or
                    (
                        (user_id = ".$this->arrUser['id'].")
                    ))
                    order by id desc; ";

                if ($attr['record_id']){
                    $Sql = "SELECT * FROM sr_email_save_info es WHERE virtualEmail = 0 and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and $where and user_id = ".$this->arrUser['id']."
                    order by id desc; ";
                }
                
            }
            else{
                $Sql = "SELECT * FROM sr_email_save_info es WHERE virtualEmail = 0 and company_id = " . $this->arrUser['company_id'] . " and 
                    es.type = 1 and
                    (
                        ($where)
                        and
                        (user_id = ".$this->arrUser['id'].")
                    )
                    order by id desc; ";
            }
            // $Sql = "SELECT * FROM sr_email_save_info es WHERE company_id = " . $this->arrUser['company_id'] . " and  (es.type = 2 and user_id = ".$this->arrUser['id'].") order by id desc; ";
        }

        //echo $response['q'];exit;
        $RS = $objsetup->CSI($Sql);
        //$RS = $this->objsetup->CSI($Sql);
        $results = array();
        $response['q'] = $Sql;
        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $ids = array();
            while($Row = $RS->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $ids[] = $Row['id'];
                $Row['date_added'] = $this->objGeneral->convert_unix_into_datetime($Row['date_added']);
                $Row['email_body'] = base64_decode($Row['email_body']);
                $Row['email_body'] = preg_replace('/(<(script|style)\b[^>]*>).*?(<\/\2>)/is', "$1$3", $Row['email_body']);
                $Row['email_body'] = preg_replace('/[^(\x20-\x7F)\x0A\x0D]*/','', $Row['email_body']);
                $Row['email_body_trimmed'] = substr($this->htmlToPlainText($Row['email_body']),0,100) ;
                if (!$Row['email_body_trimmed']){
                    $Row['email_body_trimmed'] = " ";
                }
                if ($Row['ass_id'])
                    $Row['association'][] = array('assName'=>$Row['ass_name'], 'assId'=>$Row['ass_id'], 'assModule'=>$Row['ass_module']);

                $dupChk = 0;
                for ($l = sizeof($response['response']); $l >= 0 ; $l--){
                    if ($response['response'][$l]['id'] == $Row['id']){
                        $dupChk = 1;
                        $response['response'][$l]['association'][] = $Row['association'][0];
                        break;
                    }
                }

                if ($dupChk == 0){
                    $response['response'][] = $Row;
                }
            }
            $ids = implode(",", $ids);
            // print_r($ids);exit;
            $attachments = array();
            $SqlGetAttachments = "SELECT att.*, gen.email_id as email_id FROM attachments att
                                            LEFT JOIN general_email_attachments gen on att.id = gen.attachment_id WHERE gen.email_id IN ($ids) ;";
                                            //echo $SqlGetAttachments;exit;
                $GeneralAttachments = $this->objsetup->CSI($SqlGetAttachments);
                if ($GeneralAttachments->RecordCount() > 0) {
                    while ($Row2 = $GeneralAttachments->FetchRow()) {
                        foreach ($Row2 as $key => $value) {
                            if (is_numeric($key))
                                unset($Row2[$key]);
                        }
                        $Row2['nonGenPath'] = $Row2['path'];
                        $Row2['path'] = WEB_PATH . "/" . explode("//", $Row2['path'])[1];
                        $attachments[] = $Row2;
                    }

                }
                // print_r($attachments);exit;
                for ($i = 0; $i < sizeof($attachments); $i++){
                    for ($j = 0; $j < sizeof($response['response']); $j++){
                        if ($response['response'][$j]['id'] == $attachments[$i]['email_id']){
                            $response['response'][$j]['attachments'][] = $attachments[$i];
                        }
                    }
                }
        } else {
            $response['response'] = array();
        }
        return $response;
    }



    /* Added by Ahmad from Naeem's Repo */

    function saveEmail($attr) {
        // saving email here
        // print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);
        $subject = $attr['subject'];
        $from = $attr['from']->username;
        
        $to = $attr['to'];
        $cc = $attr['cc'];
        $recordId = $attr['recordId'];
        $moduleType = $this->objGeneral->emptyToZero($attr['moduleType']);
        $moduleId = $attr['moduleId'];
        $moduleName = $attr['moduleName'];
        $recordName = $attr['recordName'];


        // $bcc = (isset($attr['bcc'])) ? trim(stripslashes(strip_tags($attr['bcc']))) : '';
        $body = $attr['body'];
        //$privacyStatus = ($attr['privacy']);
        //$deliveryStatus = ($attr['deliveryStatus']);
        //$deliveryTime = ($attr['deliveryTime']);
        $userId = $this->arrUser['id'];
        $companyId = $this->arrUser['company_id'];
        $UniqueKey = $from.$userId;
        // $attachment = ($attr['attachment']);
        //Store email record
        /* $SqlInsert = "INSERT INTO silverow_dev.email
        (UniqueKey, EmailFrom, Subject, Body, PrivacyStatus, DeliveryStatus,ReadStatus, DelieveryTime, userId)
        VALUES ('$UniqueKey', '$from', '$subject', '$body', '$privacyStatus', '$deliveryStatus',1, '$deliveryTime', '$userId')"; */
        //echo $SqlInsert.PHP_EOL;

        
        //echo $to;exit;
        //print_r(implode(';',$to));exit;
        if ($attr['draftEmail'] && $attr['sent'] == 0){
            $type_clause = ",type = 3";
        }
        else{
            $type_clause = ",type = 1";
        }

        if ($attr['isDraft']){
            $SqlInsert = "UPDATE email_save SET
						 email_address_from='" . $from . "'
						,email_address_to='" . $to . "'
						,cc='" . $cc . "'
						,email_subject='" . $subject . "'
                        ,sender_id='" . $userId . "'
                        ,account_id='".$recordId."'
                        ,record_name='".$recordName."'
						,email_body= '" . base64_encode(trim(stripslashes($body))) . "'
						,email_header= 'abc'
                        ,module_id= '" . $moduleId . "'
                        ,module_name= '" . $moduleName . "'
                        ,module_type='" . $moduleType . "'
						,company_id= '" . $this->arrUser['company_id'] . "'
						,user_id='" . $this->arrUser['id'] . "'
                        ,date_added='" . current_date_time . "' 
                        $type_clause
                        WHERE id = $attr[isDraft]";
        }
        else{
        $SqlInsert = "INSERT INTO email_save SET
						 email_address_from='" . $from . "'
						,email_address_to='" . $to . "'
						,cc='" . $cc . "'
						,email_subject='" . $subject . "'
                        ,sender_id='" . $userId . "'
                        ,account_id='".$recordId."'
                        ,record_name='".$recordName."'
						,email_body= '" . base64_encode(trim(stripslashes($body))) . "'
						,email_header= 'abc'
                        ,module_id= '" . $moduleId . "'
                        ,module_name= '" . $moduleName . "'
						,company_id= '" . $this->arrUser['company_id'] . "'
						,user_id='" . $this->arrUser['id'] . "'
                        ,date_added='" . current_date_time . "' 
                        $type_clause
                        ";

        }

                        // echo $SqlInsert;exit;
        if ($attr['from']->id)
            $SqlInsert .= ",virtualEmail = " . $attr['from']->id . " ";

        //echo $SqlInsert.PHP_EOL;exit;
        $RS = $this->objsetup->CSI($SqlInsert);
        $get_last_id = $this->Conn->Insert_ID();
        $emailID = $attr['isDraft'] ? $attr['isDraft'] : $get_last_id;

        if ($attr['draftEmail']){
            $delAssociationsSql = "DELETE FROM document_association WHERE module_type = 'email' and module_id = $emailID;";
            $RSDelAssociation = $this->objsetup->CSI($delAssociationsSql);
            
        }
        if($moduleName){
            $associationsSql = "INSERT INTO document_association
                                        SET
                                            module_type     =   'email',
                                            module_id       =   '$emailID',
                                            record_type     =   '$moduleName',
                                            record_id       =   '$recordId',
                                            record_name     =   '$recordName',
                                            AddedBy         =   '" . $this->arrUser['id'] . "',
                                            AddedOn         =   UNIX_TIMESTAMP (NOW())
                                        ";
                                        // echo $associationsSql;exit;
            $RSAssociation = $this->objsetup->CSI($associationsSql);
        }

        

        $attachmentPath = UPLOAD_PATH . 'attachments' . '/' .$attr['attachment'];
        if (empty($attr['genericEmail']) && file_exists($attachmentPath)){
            $Insert = "INSERT INTO general_email_attachments (email_id, attachment_id) 
                SELECT $emailID, id FROM attachments WHERE path = '$attachmentPath'
                 order by id desc LIMIT 1;";
                 //echo $Insert;exit;
            $RS = $this->objsetup->CSI($Insert);
            $attachmentIds = $this->Conn->Insert_ID();
        }
        else if ($attr['genericEmail'] && $attr['attachment']){
            for ($i = 0; $i < count($attr['attachment']); $i++){
                $att = $attr['attachment'][$i];
                $Insert = "INSERT INTO general_email_attachments (email_id, attachment_id) VALUES ($emailID, $att)
                    ;";
                $RS = $this->objsetup->CSI($Insert);

            }
            $attachmentIds = $this->Conn->Insert_ID();

        }


        

        $response['ack'] = 1;
        $response['error'] = null;
        $response['recordId'] = $emailID;
        $response['attachmentIds'] = $attachmentIds;
        /* for ($k = 0; $k < COUNT($attr['to']); $k++) {
           $to = ($attr['to'][$k]);
           $query = "INSERT INTO silverow_dev.email_recipient
           (email_id, To, SendingType)
           VALUES ('$get_last_id', '$to', 'to')";
           echo $query.PHP_EOL;
           //$RS = $this->objsetup->CSI($query);
        }
  
        for ($k = 0; $k < COUNT($attr['cc']); $k++) {
           $to = ($attr['cc'][$k]);
           $query = "INSERT INTO silverow_dev.email_recipient
           (email_id, To, SendingType)
           VALUES ('$get_last_id', '$to', 'cc')";
           echo $query.PHP_EOL;
           //$RS = $this->objsetup->CSI($query);
        }
        for ($k = 0; $k < COUNT($attr['attachment']); $k++) {
          $attachment = ($attr['attachment'][$k]);
          $query = "INSERT INTO silverow_dev.email_attachment
          (email_id, AttachmentLink)
          VALUES ('$get_last_id', '$attachment')";
          echo $query.PHP_EOL;
          //$RS = $this->objsetup->CSI($query);
        } */
        //echo json_encode(array('status' => 'Saved Successfully'));
        return $response;
      }

    function getAssociations($attr){
        $this->objGeneral->mysql_clean($attr);

        $arr_attr = $attr['record'];
        $associationType = $attr['associationType'];
        $module = $attr['moduleName'];
        /* 
        $associationsSql = "SELECT * FROM document_association
                                        WHERE
                                            module_type     =   '$associationType' and
                                            module_id       =   '" . $attr[associationId] . "' order by AddedOn desc;
                                        "; */

         $associationsSql = "SELECT *, 1 as `rank`  FROM document_association WHERE module_type = '$associationType' and module_id = '$attr[associationId]' and record_type = '$module' UNION 
SELECT *, 2 as `rank`  FROM document_association WHERE module_type = '$associationType' and module_id = '$attr[associationId]' and record_type != '$module' order by `rank`,AddedOn desc";
                                        // echo $associationsSql;exit;
        $RSAssociation = $this->objsetup->CSI($associationsSql);
        if ($RSAssociation->RecordCount() > 0) {
            while($Row = $RSAssociation->FetchRow())
            {
                foreach ($Row as $key => $value) {
                    if (is_numeric($key))
                        unset($Row[$key]);
                }
                $response['response'][] = array('assName'=>$Row['record_name'], 'assId'=>$Row['record_id'], 'assModule'=>$Row['record_type']);
                // $mail->addAttachment($Row['path'], $Row['name']);
            }
        }
        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }


    function unlinkRecord($attr){
        $this->objGeneral->mysql_clean($attr);

        $arr_attr = $attr['record'];
        $associationType = $attr['associationType'];

        $selectSql = "SELECT count(module_id) FROM document_association where module_type = '$associationType' and module_id = '$attr[associationId]'";
        $AssociationCount = $this->objsetup->CSI($selectSql);
        while ($Row = $AssociationCount->FetchRow()) {
            if (!empty($Row[0])){
                if ($Row[0] == 1){
                    $response['ack'] = 0;
                    $response['error'] = 111;
                    $response['msg'] = "Document must be linked to at least 1 record";
                    return $response;
                }
                //print_r($Row);exit;
            }
            
        }

        $associationsSql = "DELETE FROM document_association
                                        WHERE
                                            module_type     =   '$associationType' and
                                            module_id       =   '" . $attr[associationId] . "' and
                                            record_type     =   '" . $arr_attr->assModule . "' and
                                            record_id       =   '" . $arr_attr->assId . "'
                                        ";
        $RSAssociation = $this->objsetup->CSI($associationsSql);

        $response['ack'] = 1;
        $response['error'] = NULL;
        $response['msg'] = 'Record Updated Successfully';
        return $response;
    }

    function updateInboxEmailSender($attr){
        $this->objGeneral->mysql_clean($attr);
        if ($attr['associationType'] && $attr['emailId'] && $attr['moduleName'] && $attr['recordId']){
            $associationsSql = "INSERT INTO document_association
                                            SET
                                                module_type     =   '$attr[associationType]',
                                                module_id       =   '$attr[emailId]',
                                                record_type     =   '$attr[moduleName]',
                                                record_id       =   '$attr[recordId]',
                                                record_name     =   '$attr[recordName]',
                                                additional     =   '$attr[additional]',
                                                AddedBy         =   '" . $this->arrUser['id'] . "',
                                                AddedOn         =   UNIX_TIMESTAMP (NOW())
                                            ";
                                            // echo $associationsSql;exit;
            $RSAssociation = $this->objsetup->CSI($associationsSql);
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['msg'] = 'Record Updated Successfully';
        }
        else{
            $response['ack'] = 0;
            $response['error'] = NULL;
            $response['msg'] = 'Something went wrong';
        }
        return $response;
    }

    function sendEmailFromModule($attr) {

        if ($attr['from']->id === 0){
            $clientConfiguration = $this->getPrimaryConfiguration();
            
            // print_r($clientConfiguration);exit;
            if ($clientConfiguration['ack'] != 1){
                $response['configIssue'] = 1;
                $response['message'] =   "No primary configuration set!"; 
                $response['ack'] = 0;
                return $response;
            }
        }
        else{
            if (empty($attr['from']->id)){
                $response['configIssue'] = 1;
                $response['message'] =   "Virtual Email doesn't exist!"; 
                $response['ack'] = 0;
                return $response;
            }
            $clientConfiguration = $this->getAliasByVirtualEmail($attr['from']->id);
        }
        //print_r($clientConfiguration);exit;
        //echo $attr['to'][0];exit;
        //print_r($attr['to']);exit;
        $emailDetails  = array(
            "to"         => array_unique(explode(';',$attr['to'])),
            "cc"         => array_unique(explode(';',$attr['cc'])),
            "from"       => $clientConfiguration['username'],
            "fromName"   => $clientConfiguration['alias'],
            "subject"    => $attr['subject'],
            "body"       => $attr['body'],
            "attachment" =>$attr['attachment'],
            "attachmentAlias" =>$attr['attachmentAlias']
        );

     

        //error_reporting(E_ALL);
        //Mail object initialization
        $mail = new \SendGrid\Mail\Mail();
        // echo "here after send grid"; exit;
        try {
            //Server settings
            // $mail->SMTPDebug = 1;                                 // Enable verbose debug output
            // $mail->Debugoutput = 'variable';
            // $mail->isSMTP();                                      // Set mailer to use SMTP
            // $mail->Host = $emailDetails['host'];                          // Specify main and backup SMTP servers
            // $mail->SMTPAuth = $emailDetails['smtpAuth'];                  // Enable SMTP authentication
            // $mail->Username = $emailDetails['from'];                      // SMTP username
            // $mail->Password = $emailDetails['password'];                  // SMTP password
            // $mail->SMTPSecure = $emailDetails['smtpSecure'];              // Enable TLS encryption, `ssl` also accepted
            // $mail->Port = $emailDetails['smtpPort'];                          // TCP port to connect to
  
            //Recipients
            $mail->setFrom($emailDetails['from'], $emailDetails['fromName']);
            //print_r($emailDetails['to']);exit;
            for ($k = 0; $k < COUNT($emailDetails['to']); $k++) {
                if ($emailDetails['to'][$k]){
                    $mail->AddTo($emailDetails['to'][$k]);
                }
               
            }
            
            for ($k = 0; $k < COUNT($emailDetails['cc']); $k++) {
                if ($emailDetails['cc'][$k]){
                    $mail->addCC($emailDetails['cc'][$k]);
                }
            }
            //Bcc comment for now
            // for ($k = 0; $k < COUNT($emailDetails['bcc']); $k++) {
            //    $mail->addBCC($emailDetails['bcc'][$k]);
            // }
            // for ($k = 0; $k < COUNT($emailDetails['attachment']); $k++) {
            //    $mail->addAttachment($emailDetails['attachment'][$k]);
            // }
            if(!empty($emailDetails['attachment']))
            {

                if ($attr['genericEmail']){
                    $fileSearch = implode(",",$attr['attachment']);
                    if ($fileSearch){
                        $fileAlias = $attr['attachmentAlias'];
                        $SqlFileSearch = "SELECT * FROM attachments WHERE id IN ($fileSearch)";
                        // echo $SqlFileSearch;exit;
                        $RSFileSearch = $this->objsetup->CSI($SqlFileSearch);
                        if ($RSFileSearch->RecordCount() > 0) {
                            $fileResults = [];
                            while($Row = $RSFileSearch->FetchRow())
                            {
                                foreach ($Row as $key => $value) {
                                    if (is_numeric($key))
                                        unset($Row[$key]);
                                }
                                //$filename = $Row['name'];
                                $filename = $Row['alias'].'.'.$Row['fileType'];
                                $file_encoded = base64_encode(file_get_contents($Row['path']));
                                $attachment = new \SendGrid\Mail\Attachment();
                                $attachment->setType("application/text");
                                $attachment->setContent($file_encoded);
                                $attachment->setDisposition("attachment");
                                $attachment->setFilename($fileAlias ? $fileAlias : $filename);
                                $mail->addAttachment($attachment);
                                // $mail->addAttachment($Row['path'], $Row['name']);
                            }
                        }
                    }
                    // $files = glob(UPLOAD_PATH . 'attachments/*' . $fileSearch . "*");
                    // if(count($files) > 0){
                    //     //echo "File Exists!";
                    //     //print_r($files);exit;
                    //     for ($k = 0; $k < COUNT($files); $k++) {
                    //         $mail->addAttachment($files[$k]);
                    //     }
                    // }
                        
                }
                else{                    
                    $tempPath = UPLOAD_PATH . 'attachments' . '/'.$emailDetails['attachment'];
                    $filename = $emailDetails['attachment'];
                    $fileAlias = $emailDetails['attachmentAlias'];
                    if (file_exists($tempPath)){
                        $file_encoded = base64_encode(file_get_contents($tempPath));
                        $attachment = new \SendGrid\Mail\Attachment();
                        $attachment->setType("application/text");
                        $attachment->setContent($file_encoded);
                        $attachment->setDisposition("attachment");
                        $attachment->setFilename($fileAlias ? $fileAlias : $filename);
                        $mail->addAttachment($attachment);
                        // $mail->addAttachment(UPLOAD_PATH . 'attachments' . '/'.$emailDetails['attachment']);

                        // $file_url = UPLOAD_PATH . 'attachments/'. $emailDetails['attachment']; 
                        $tempPath2 = WEB_PATH . '/upload/attachments' . '/'.$emailDetails['attachment'];

                        // echo $tempPath2;

                        if(file_exists($tempPath)){

                            $key = hash('sha256', SECRET_KEY);
                            $iv = substr(hash('sha256', SECRET_IV), 0, 16);
                            $outputInvName = openssl_encrypt($filename, SECRET_METHOD, $key, 0, $iv);
                            $outputInvName = base64_encode($outputInvName);

                            $outputInvNamePath = WEB_PATH . '/api/setup/document?alpha='.$outputInvName; 
                            $emailDetails['body'] = str_replace('[[View Document]]',"<a target='_blank' href='$outputInvNamePath'> View Document </a>", $emailDetails['body']); 
                            $emailDetails['body'] = str_replace('href="'.$tempPath2.'"'," target='_blank' href='$outputInvNamePath' ", $emailDetails['body']); 
                        }
                        // echo '<pre>'; print_r($emailDetails['body']);exit;
                    }
                    else{
                        $response['noAttachment'] = 1;  
                        $response['attachmentError'] = "File Doesn't Exist! Email not sent..";
                        $response['ack'] = 1;
                        return $response;
                    }
                }           
            }

            
           
            // if(isset($emailDetails['attachment']){
            // }
            //Content
            // $mail->isHTML(true);       
            // Set email format to HTML
            $mail->setSubject($emailDetails['subject']);
            $mail->addContent("text/html",$emailDetails['body']);
        
            //echo "checking on this step 2"; exit;
            // $mail->AltBody = $emailDetails['body'];
            //$mail->send();
            // $mail->CharSet = 'UTF-8'; //before sending it of course
            try {
                $response = $this->sendgrid->send($mail);
                $response =  (array) $response;
                foreach ($response as $key => $value) {
                    if (strpos($key, "statusCode") > -1){
                        $response['statusCode'] = $value;
                    }
                    else if (strpos($key, "body") > -1){
                        $response['body'] = json_decode($value);
                    }
                }
                if ($response['statusCode'] == 202){
                    $response['message'] =  "E-mail sent";
                    $response['ack'] = 1;
                }
                else{
                    $response['mailObj'] = $mail;
                    $response['ack'] = 0;
                    $response['message'] =  $response['body']->errors[0]->message;


                }
            } catch (Exception $e) {
                $response['message'] =  $e->getMessage();
                $response['mailObj'] = $mail;
                $response['ack'] = 0;
                // echo 'Caught exception: '.  $e->getMessage(). "\n";
            }       


        } catch (Exception $e) {
            $response['configIssue'] = 1;
            $response['message'] =   $mail->ErrorInfo;
            $response['mailObj'] = $mail;
            $response['debug'] = $mail->smtp->smtp_errors;  
            $response['ack'] = 0;
            //echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
        }



        return $response;
      }

    function SendSimpleEmail($attr)
    {
    
        // print_r($attr);exit;
        $clientConfiguration = $this->getPrimaryConfiguration();
            if ($clientConfiguration['ack'] != 1){
                $response['configIssue'] = 1;
                $response['message'] =   "No primary configuration set!"; 
                $response['ack'] = 0;
                return $response;
            }
        /* $clientConfiguration['username'] = 'ahmad.hassan@silverow.com';
        $clientConfiguration['password'] = 'Bs2k9fm245'; */
        
        $emailDetails = array(
            "to" => explode(';',$attr['to']),
            "from" => $clientConfiguration['username'],
            "fromName" => $clientConfiguration['alias'],
            "subject" => $attr['subject'],
            "body" => $attr['body'],
            "attachment"=>$attr['attachment'],
            "host"=>$clientConfiguration['smtpserver'],
            "password"=>$clientConfiguration['password'],
            "smtpAuth"=>$clientConfiguration['smtpauth']=="On"?true:false,
            "smtpPort"=>$clientConfiguration['smtpport']
        );
            // print_r($emailDetails);exit;


            //Mail object initialization
        $mail = new \SendGrid\Mail\Mail();        
        try {
            //Server settings
            // $mail->SMTPDebug = 1;                                 // Enable verbose debug output
            // $mail->Debugoutput = 'variable';
            // $mail->isSMTP();                                      // Set mailer to use SMTP
            // $mail->Host = $emailDetails['host'];                          // Specify main and backup SMTP servers
            // $mail->SMTPAuth = $emailDetails['smtpAuth'];                  // Enable SMTP authentication
            // $mail->Username = $emailDetails['from'];                      // SMTP username
            // $mail->Password = $emailDetails['password'];                  // SMTP password
            // $mail->SMTPSecure = $emailDetails['smtpSecure'];              // Enable TLS encryption, `ssl` also accepted
            // $mail->Port = $emailDetails['smtpPort'];                          // TCP port to connect to

            //Recipients
            $mail->setFrom($emailDetails['from'], $emailDetails['fromName']);
            // print_r($emailDetails['to']);exit;
            for ($k = 0; $k < count($emailDetails['to']); $k++) {
                $mail->AddTo($emailDetails['to'][$k]);
            }
            
            //Content
            // $mail->isHTML(true);                                  // Set email format to HTML
            $mail->setSubject($emailDetails['subject']);
            $mail->addContent("text/html",$emailDetails['body']);
            // $mail->AltBody = $emailDetails['body'];
            //$mail->send();
            // $mail->CharSet = 'UTF-8'; //before sending it of course
            
            try {
                $response = $this->sendgrid->send($mail);      
                $response =  (array) $response; 
                $response['message'] =  "E-mail sent";
                $response['mailObj'] = $mail;
                $response['ack'] = 1;
            } catch (Exception $e) {
                $response['message'] =  $e->getMessage();
                $response['mailObj'] = $mail;
                $response['ack'] = 0;
                // echo 'Caught exception: '.  $e->getMessage(). "\n";
            }       
        } catch (Exception $e) {
            $response['configIssue'] = 1;
            $response['message'] =   $mail->ErrorInfo;
            $response['debug'] = $mail->smtp->smtp_errors;  
            $response['ack'] = 0;
            $response['mailerObj'] = $mail;
            //echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;exit;
            return $response;
        }
        return $response;
    }
}
