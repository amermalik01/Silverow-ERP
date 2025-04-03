<?php
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/class.phpmailer.php");

class Contact extends Xtreme
{
 
    private $Conn = null;
    private $objGeneral = null;
    private $arrUser = null;

    function __construct($user_info = array())
    {
        parent::__construct();
        $this->Conn = parent::GetConnection();
        $this->objGeneral = new General($user_info);
        $this->arrUser = $user_info;
    }

    function addContact($attr)
    {

        $UserId = $this->arrUser['id'];
        // $this->objGeneral->mysql_clean($attr);

        $contactname = (isset($attr['contactname'])) ? trim(stripslashes(strip_tags($attr['contactname']))) : '';
        $fname = (isset($attr['fname'])) ? trim(stripslashes(strip_tags($attr['fname']))) : '';
        $lname = (isset($attr['lname'])) ? trim(stripslashes(strip_tags($attr['lname']))) : '';
        $knownas = (isset($attr['knownas'])) ? trim(stripslashes(strip_tags($attr['knownas']))) : '';
        $locationname = (isset($attr['locationname'])) ? trim(stripslashes(strip_tags($attr['locationname']))) : '';
        $jobtitle = (isset($attr['jobtitle'])) ? trim(stripslashes(strip_tags($attr['jobtitle']))) : '';
        $organisation = (isset($attr['organisation'])) ? trim(stripslashes(strip_tags($attr['organisation']))) : '';
        $address1 = (isset($attr['address1'])) ? trim(stripslashes(strip_tags($attr['address1']))) : '';
        $saveas = (isset($attr['saveas'])) ? trim(stripslashes(strip_tags($attr['saveas']))) : '';
        $directline = (isset($attr['directline'])) ? trim(stripslashes(strip_tags($attr['directline']))) : '';
        $address2 = (isset($attr['address2'])) ? trim(stripslashes(strip_tags($attr['address2']))) : '';
        $phone = (isset($attr['phone'])) ? $attr['phone'] : '';
        $phoneType = (isset($attr['phoneType'])) ? $attr['phoneType'] : '';
        $city = (isset($attr['city'])) ? trim(stripslashes(strip_tags($attr['city']))) : '';
        $fax = (isset($attr['fax'])) ? trim(stripslashes(strip_tags($attr['fax']))) : '';
        $county = (isset($attr['county'])) ? trim(stripslashes(strip_tags($attr['county']))) : '';
        $mobile = (isset($attr['mobile'])) ? trim(stripslashes(strip_tags($attr['mobile']))) : '';
        $postcode = (isset($attr['postcode'])) ? trim(stripslashes(strip_tags($attr['postcode']))) : '';
        $email = (isset($attr['email'])) ? trim(stripslashes(strip_tags($attr['email']))) : '';
        $mail = (isset($attr['mail'])) ? $attr['mail'] : '';
        $mailType = (isset($attr['mailType'])) ? $attr['mailType'] : '';
        $country = (isset($attr['country'])) ? trim(stripslashes(strip_tags($attr['country']))) : '';
        $photo = (isset($attr['photo'])) ? trim(stripslashes(strip_tags($attr['photo']))) : '';
        $notes = (isset($attr['notes'])) ? trim(stripslashes(strip_tags($attr['notes']))) : '';
        $skypeid = (isset($attr['skypeid'])) ? trim(stripslashes(strip_tags($attr['skypeid']))) : '';
        $linkedinid = (isset($attr['linkedinid'])) ? trim(stripslashes(strip_tags($attr['linkedinid']))) : '';
        $url = (isset($attr['url'])) ? trim(stripslashes(strip_tags($attr['url']))) : '';

        $result = array('isError' => 0, 'errorMessage' => '');


        $data_pass = " tst.email='$email' ";
        $total = $this->objGeneral->count_duplicate_in_sql('contacts', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }

        $Sql = "INSERT INTO contacts (user_id, contactname, fname, lname, knownas, locationname, jobtitle, organisation, address1, directline, saveas, address2, phone, city, fax, county,"
            . " mobile, postcode, email, country, notes, skypeid, linkedinid, url, status) VALUES "
            . "($UserId, '$contactname', '$fname', '$lname', '$knownas', '$locationname', '$jobtitle', '$organisation', '$address1', '$directline', '$saveas', '$address2', '$phone', '$city', '$fax', '$county',"
            . " '$mobile', '$postcode', '$email', '$country', '$notes', '$skypeid', '$linkedinid', '$url', 1);";
        $RS = $this->Conn->Execute($Sql);
        $contactId = $this->Conn->Insert_ID();

        if ($mail) {
            for ($i = 0; $i < COUNT($mail); $i++) {
                $Sql = "INSERT INTO contacts_mails (contact_id, type, email) VALUES "
                    . "($contactId, '$mailType[$i]', '$mail[$i]');";
                $RS = $this->Conn->Execute($Sql);
            }
        }

        if ($phone) {

            for ($i = 0; $i < COUNT($phone); $i++) {
                $Sql = "INSERT INTO contacts_phones (contact_id, type, phone) VALUES "
                    . "($contactId, '$phoneType[$i]', '$phone[$i]');";
                $RS = $this->Conn->Execute($Sql);
            }
        }


        return $result;
    }

    function editContact($attr)
    {

        $UserId = $this->arrUser['id'];
        // $this->objGeneral->mysql_clean($attr);

        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';
        $contactname = (isset($attr['contactname'])) ? trim(stripslashes(strip_tags($attr['contactname']))) : '';
        $fname = (isset($attr['fname'])) ? trim(stripslashes(strip_tags($attr['fname']))) : '';
        $lname = (isset($attr['lname'])) ? trim(stripslashes(strip_tags($attr['lname']))) : '';
        $knownas = (isset($attr['knownas'])) ? trim(stripslashes(strip_tags($attr['knownas']))) : '';
        $locationname = (isset($attr['locationname'])) ? trim(stripslashes(strip_tags($attr['locationname']))) : '';
        $jobtitle = (isset($attr['jobtitle'])) ? trim(stripslashes(strip_tags($attr['jobtitle']))) : '';
        $organisation = (isset($attr['organisation'])) ? trim(stripslashes(strip_tags($attr['organisation']))) : '';
        $address1 = (isset($attr['address1'])) ? trim(stripslashes(strip_tags($attr['address1']))) : '';
        $saveas = (isset($attr['saveas'])) ? trim(stripslashes(strip_tags($attr['saveas']))) : '';
        $directline = (isset($attr['directline'])) ? trim(stripslashes(strip_tags($attr['directline']))) : '';
        $address2 = (isset($attr['address2'])) ? trim(stripslashes(strip_tags($attr['address2']))) : '';
        $phone = (isset($attr['phone'])) ? $attr['phone'] : '';
        $phoneType = (isset($attr['phoneType'])) ? $attr['phoneType'] : '';
        $city = (isset($attr['city'])) ? trim(stripslashes(strip_tags($attr['city']))) : '';
        $fax = (isset($attr['fax'])) ? trim(stripslashes(strip_tags($attr['fax']))) : '';
        $county = (isset($attr['county'])) ? trim(stripslashes(strip_tags($attr['county']))) : '';
        $mobile = (isset($attr['mobile'])) ? trim(stripslashes(strip_tags($attr['mobile']))) : '';
        $postcode = (isset($attr['postcode'])) ? trim(stripslashes(strip_tags($attr['postcode']))) : '';
        $email = (isset($attr['email'])) ? trim(stripslashes(strip_tags($attr['email']))) : '';
        $mail = (isset($attr['mail'])) ? $attr['mail'] : '';
        $mailType = (isset($attr['mailType'])) ? $attr['mailType'] : '';
        $country = (isset($attr['country'])) ? trim(stripslashes(strip_tags($attr['country']))) : '';
        $photo = (isset($attr['photo'])) ? trim(stripslashes(strip_tags($attr['photo']))) : '';
        $notes = (isset($attr['notes'])) ? trim(stripslashes(strip_tags($attr['notes']))) : '';
        $skypeid = (isset($attr['skypeid'])) ? trim(stripslashes(strip_tags($attr['skypeid']))) : '';
        $linkedinid = (isset($attr['linkedinid'])) ? trim(stripslashes(strip_tags($attr['linkedinid']))) : '';
        $url = (isset($attr['url'])) ? trim(stripslashes(strip_tags($attr['url']))) : '';

        $result = array('isError' => 0, 'errorMessage' => '');


        if ($attr['id'] > 0) $where_id = " AND tst.id != '".$attr['id']."' ";

        $data_pass = " tst.email='$email' $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('contacts', $data_pass, $this->arrUser['company_id']);


        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
            exit;
        }


        $Sql = "UPDATE contacts SET contactname='$contactname', fname='$fname', lname='$lname', knownas='$knownas', locationname='$locationname', "
            . "jobtitle='$jobtitle', organisation='$organisation', address1='$address1', "
            . "directline='$directline', saveas='$saveas', address2='$address2', city='$city', fax='$fax', county='$county', mobile='$mobile',"
            . "postcode='$postcode', country='$country', photo='$photo', notes='$notes', skypeid='$skypeid', linkedinid='$linkedinid', url='$url' WHERE id=$id";
        $RS = $this->Conn->Execute($Sql);
        if ($mail) {
            $this->Conn->Execute("DELETE FROM contacts_mails WHERE contact_id=$id");
            for ($i = 0; $i < COUNT($mail); $i++) {
                $SqlMail = "INSERT INTO contacts_mails (contact_id, type, email) VALUES "
                    . "($id, '$mailType[$i]', '$mail[$i]');";
                $RSMail = $this->Conn->Execute($SqlMail);
            }


            if ($phone) {
                $this->Conn->Execute("DELETE FROM contacts_phones WHERE contact_id=$id");
                for ($i = 0; $i < COUNT($phone); $i++) {
                    $SqlPhone = "INSERT INTO contacts_phones (contact_id, type, phone) VALUES "
                        . "($id, '$phoneType[$i]', '$phone[$i]');";
                    $RS = $this->Conn->Execute($SqlPhone);
                }
            }

        } else {
            $result['isError'] = 1;
            $result['errorMessage'] = "Please enter all required fields.";
        }

        return $result;
    }

    function deleteContact($attr)
    {

        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);

        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';

        $result = array('isError' => 0, 'errorMessage' => '');

        if ($id != "") {
            $Sql = "UPDATE contacts SET status = 0 WHERE id=$id";
            $RS = $this->Conn->Execute($Sql);
        } else {
            $result['isError'] = 1;
            $result['errorMessage'] = "";
        }

        return $result;
    }

    function getContacts($attr)
    {


        $this->objGeneral->mysql_clean($attr);
        $Sql = "SELECT * FROM contacts WHERE user_id=" . $this->arrUser[id] . " AND status = 1  ORDER BY id DESC  limit 100";
        $RS = $this->Conn->Execute($Sql);

        $results['contacts'] = array();
        $results['contacts']['a'] = array();
        $results['contacts']['b'] = array();
        $results['contacts']['c'] = array();
        $results['contacts']['d'] = array();
        $results['contacts']['e'] = array();
        $results['contacts']['f'] = array();
        $results['contacts']['g'] = array();
        $results['contacts']['h'] = array();
        $results['contacts']['i'] = array();
        $results['contacts']['j'] = array();
        $results['contacts']['k'] = array();
        $results['contacts']['l'] = array();
        $results['contacts']['m'] = array();
        $results['contacts']['n'] = array();
        $results['contacts']['o'] = array();
        $results['contacts']['p'] = array();
        $results['contacts']['q'] = array();
        $results['contacts']['r'] = array();
        $results['contacts']['s'] = array();
        $results['contacts']['t'] = array();
        $results['contacts']['u'] = array();
        $results['contacts']['v'] = array();
        $results['contacts']['w'] = array();
        $results['contacts']['x'] = array();
        $results['contacts']['y'] = array();
        $results['contacts']['z'] = array();
        $results['contacts']['_0'] = array();
        $results['contacts']['_1'] = array();
        $results['contacts']['_2'] = array();
        $results['contacts']['_3'] = array();
        $results['contacts']['_4'] = array();
        $results['contacts']['_5'] = array();
        $results['contacts']['_6'] = array();
        $results['contacts']['_7'] = array();
        $results['contacts']['_8'] = array();
        $results['contacts']['_9'] = array();
        $results['total'] = $total;
        if ($RS->RecordCount() > 0) {

            while ($row = $RS->FetchRow()) {

                $photo = "";
                if ($row['photo'] == "") {
                    $photo = "profile.jpg";
                } else {
                    $photo = $row['photo'];
                }
                $mails = array();
                $mailsType = array();
                $phones = array();
                $phonesType = array();
                $contactId = $row['id'];
                $SqlMails = "SELECT * FROM contacts_mails WHERE contact_id=" . $contactId . " ORDER BY id DESC limit 10";
                $RSMails = $this->Conn->Execute($SqlMails);
                if ($RSMails->RecordCount() > 0) {
                    while ($rowMail = $RSMails->FetchRow()) {

                        if ($rowMail['email'] != "") {
                            $mails[] = $rowMail['email'];
                            $mailsType[] = $rowMail['type'];
                        }
                    }
                }
                $SqlPhones = "SELECT * FROM contacts_phones WHERE contact_id=" . $contactId . " ORDER BY id DESC limit 10";
                $RSPhones = $this->Conn->Execute($SqlPhones);
                if ($RSPhones->RecordCount() > 0) {
                    while ($rowPhone = $RSPhones->FetchRow()) {

                        if ($rowPhone['phone'] != "") {
                            $phones[] = $rowPhone['phone'];
                            $phonesType[] = $rowPhone['type'];
                        }
                    }
                }
//                $contactname = "";
//                //echo $contactId . "::saves::" . $row['saveas'] . ", knownas::" . $row['knownas'] . ", fname::" . $row['fname'] . ", lname::" . $row['lname']."<br/>";
//                if (trim($row['saveas']) != "") {
//                    $contactname = $row['saveas'];
//                    // echo "save";
//                } else if (trim($row['knownas']) != "") {
//                    $contactname = $row['knownas'];
//                    // echo "known";
//                } else if (trim($row['fname'] != "") && trim($row['lname']) != "") {
//                    $contactname = $row['fname'] . " " . $row['lname'];
//                    //  echo "name";
//                } else if (trim($row['lname']) != "") {
//                    $contactname = $row['lname'];
//                    //echo "lname";
//                } else if (trim($row['fname']) != "") {
//                    $contactname = $row['fname'];
//                    // echo "fname";
//                }

                $contactname = trim($row['saveas']);
                $contactAlpha = "";
                if ($contactname[0] >= '0' && $contactname[0] <= '9') {
                    $contactAlpha = "_" . $contactname[0];
                } else {
                    $contactAlpha = strtolower($contactname[0]);
                }

                $results['contacts'][$contactAlpha][] = array('id' => $row['id'], 'contactname' => $contactname, 'fname' => $row['fname'], 'lname' => $row['lname'], 'knownas' => $row['knownas'], 'locationname' => $row['locationname'],
                    'jobtitle' => $row['jobtitle'], 'organisation' => $row['organisation'], 'address1' => $row['address1'], 'saveas' => $row['saveas'], 'directline' => $row['directline'], 'address2' => $row['address2'],
                    'phone' => $phones, 'phoneType' => $phonesType, 'city' => $row['city'], 'fax' => $row['fax'], 'county' => $row['county'], 'mobile' => $row['mobile'],
                    'postcode' => $row['postcode'], 'email' => $row['email'], 'mail' => $mails, 'mailType' => $mailsType, 'country' => $row['country'], 'photo' => $photo, 'notes' => $row['notes'],
                    'skypeid' => $row['skypeid'], 'linkedinid' => $row['linkedinid'], 'url' => $row['url']);
            }
        }

        return $results;
    }

    function getSmartContacts($attr)
    {


        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);

        $Sql = "SELECT * FROM contacts WHERE user_id=$UserId AND status = 1  ORDER BY id DESC limit 100";
        $RS = $this->Conn->Execute($Sql);


        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {

                $contactname = $row['saveas'];
                $mails = array();
                $contactId = $row['id'];
                $SqlMails = "SELECT * FROM contacts_mails WHERE contact_id=" . $contactId . " ORDER BY id DESC  limit 10";
                $RSMails = $this->Conn->Execute($SqlMails);
                if ($RSMails->RecordCount() > 0) {
                    while ($rowMail = $RSMails->FetchRow()) {
                        if ($rowMail['email'] != "") {


                                $smartResults[] = array('email' => $rowMail['email'], 'first_name' => $contactname,
                                    'last_name' => '');

                        }
                    }
                }
            }
        }

        $smartResults[] = self::getEMPcontacts($attr);
        $smartResults[] = self::getSRMcontacts($attr);
        $smartResults[] = self::getCRMcontacts($attr);

        $smartResults = array_unique($smartResults);
        return $smartResults;
    }

    function getEMPcontacts($attr){

        $where2 = "";
       if(!empty($attr['id']))
           $where2 = " and employees.id = '".$attr['id']."' ";

        $SqlEmployees = "SELECT employees.id,employees.first_name,employees.last_name,employees.user_email,employees.personal_email,employees.work_email,employees.next_of_kin_email from employees left JOIN company on company.id=employees.user_company 
where employees.status=1 and (employees.user_company=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") $where2 ORDER BY employees.id ASC  limit 100";
        $RSEmployees = $this->Conn->Execute($SqlEmployees);
        if ($RSEmployees->RecordCount() > 0) {
            while ($rowEmployee = $RSEmployees->FetchRow()) {
                if ($rowEmployee['user_email'] != "") {

                        $contactname = "";
                        if (trim($rowEmployee['known_as']) != "") {
                            $contactname = $rowEmployee['knownas'];
                        } else if (trim($rowEmployee['first_name'] != "") && trim($rowEmployee['last_name']) != "") {
                            $contactname = $rowEmployee['first_name'] . " " . $rowEmployee['last_name'];
                        } else if (trim($rowEmployee['last_name']) != "") {
                            $contactname = $rowEmployee['last_name'];
                        } else if (trim($rowEmployee['first_name']) != "") {
                            $contactname = $rowEmployee['first_name'];
                        } else if (trim($rowEmployee['middle_name']) != "") {
                            $contactname = $rowEmployee['middle_name'];
                        } else {
                            $contactname = $rowEmployee['name'];
                        }
                        if (trim($rowEmployee['user_email']) != "") {
                            $results[] = array('email' => $rowEmployee['user_email'], 'first_name' => $contactname, 'last_name' => '');
                        }
                        if (trim($rowEmployee['personal_email']) != "") {
                            $results[] = array('email' => $rowEmployee['personal_email'], 'first_name' => $contactname, 'last_name' => '');
                        }
                        if (trim($rowEmployee['work_email']) != "") {
                            $results[] = array('email' => $rowEmployee['work_email'], 'first_name' => $contactname, 'last_name' => '');
                        }
                        if (trim($rowEmployee['next_of_kin_email']) != "") {
                            $results[] = array('email' => $rowEmployee['next_of_kin_email'], 'first_name' => $contactname, 'last_name' => '');
                        }

                }
            }
        }
        return $results;

    }

    function getSRMcontacts($attr)
    {

        $where2 = "";
        $whereAlt= "";
        if(!empty($attr['id'])) {
            $where2 = " and  srm.id = '" . $attr['id'] . "' ";
            $whereAlt = " and  srm_alt_contact.srm_id = '" . $attr['id'] . "' ";
        }

        $SqlSRM = "SELECT srm.id,srm.name,srm.email
from srm 
left JOIN company on company.id=srm.company_id 
where srm.status=1 and
(srm.company_id=" . $this->arrUser['company_id'] . " 
or  company.parent_id=" . $this->arrUser['company_id'] . ") $where2
ORDER BY srm.id ASC limit 100";

        //echo  $SqlSRM;
        $RSSRM = $this->Conn->Execute($SqlSRM);
        if ($RSSRM->RecordCount() > 0) {
            while ($rowSRM = $RSSRM->FetchRow()) {
                if ($rowSRM['email'] != "") {

                        $contactname = $rowSRM['name'];
                        $results[] = array('email' => $rowSRM['email'], 'first_name' => $contactname, 'last_name' => '');

                }
            }
        }

        $SqlACRM = "SELECT srm_alt_contact.id,srm_alt_contact.contact_name,srm_alt_contact.email
from srm_alt_contact 
left JOIN company on company.id=srm_alt_contact.company_id 
where srm_alt_contact.status=1 and
(srm_alt_contact.company_id=" . $this->arrUser['company_id'] . " 
or  company.parent_id=" . $this->arrUser['company_id'] . ") $whereAlt
ORDER BY srm_alt_contact.id ASC limit 100";
        $RSASRM = $this->Conn->Execute($SqlACRM);
        if ($RSASRM->RecordCount() > 0) {
            while ($rowASRM = $RSASRM->FetchRow()) {
                if ($rowASRM['email'] != "") {
                    if (!in_array($rowASRM['email'], $results)) {
                        $contactname = $rowASRM['contact_name'];
                        $results[] = array('email' => $rowASRM['email'], 'first_name' => $contactname, 'last_name' => '');
                    }
                }
            }
        }

       // echo $SqlACRM; exit;
        return $results;

}

    function getCRMcontacts($attr){

        $where2 = "";
        $whereAlt= "";
        if(!empty($attr['id'])) {
            $where2 = " and  crm.id = '" . $attr['id'] . "' ";
            $whereAlt = " and  crm_alt_contact.crm_id = '" . $attr['id'] . "' ";
        }

    $SqlCRM = "SELECT crm.id,crm.name,crm.email from crm left JOIN company on company.id=crm.company_id 
where crm.status=1 and (crm.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") $where2 ORDER BY crm.id ASC limit 100";
    $RSCRM = $this->Conn->Execute($SqlCRM);
    if ($RSCRM->RecordCount() > 0) {
        while ($rowCRM = $RSCRM->FetchRow()) {
            if ($rowCRM['email'] != "") {

                    $contactname = $rowCRM['name'];
                    $results[] = array('email' => $rowCRM['email'], 'first_name' => $contactname, 'last_name' => '');

            }
        }
    }

    $SqlACRM = "SELECT crm_alt_contact.id,crm_alt_contact.contact_name,crm_alt_contact.email
from crm_alt_contact 
left JOIN company on company.id=crm_alt_contact.company_id 
where crm_alt_contact.status=1 and
(crm_alt_contact.company_id=" . $this->arrUser['company_id'] . " 
or  company.parent_id=" . $this->arrUser['company_id'] . ") $whereAlt
ORDER BY crm_alt_contact.id ASC limit 100";
    $RSACRM = $this->Conn->Execute($SqlACRM);
    if ($RSACRM->RecordCount() > 0) {
        while ($rowACRM = $RSACRM->FetchRow()) {
            if ($rowACRM['email'] != "") {
                if (!in_array($rowACRM['email'], $results)) {
                    $contactname = $rowACRM['contact_name'];
                    $results[] = array('email' => $rowACRM['email'], 'first_name' => $contactname, 'last_name' => '');
                }
            }
        }
    }

        return $results;
}


        function getEmployeeSmartContacts($attr) {

        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);

       $SqlEmployees = "SELECT employees.id,employees.first_name,employees.last_name,employees.user_email,employees.personal_email,employees.work_email,employees.next_of_kin_email
from employees 
left JOIN company on company.id=employees.user_company 
where employees.status=1 and
(employees.user_company=" . $this->arrUser['company_id'] . " 
or  company.parent_id=" . $this->arrUser['company_id'] . ")
ORDER BY employees.id ASC limit 100";
        $RSEmployees = $this->Conn->Execute($SqlEmployees);
        if ($RSEmployees->RecordCount() > 0) {
            while ($rowEmployee = $RSEmployees->FetchRow()) {
                if ($rowEmployee['user_email'] != "") {
                    if (!in_array($rowEmployee['user_email'], $results)) {
                        $contactname = "";
                        if (trim($rowEmployee['known_as']) != "") {
                            $contactname = $rowEmployee['knownas'];
                        } else if (trim($rowEmployee['first_name'] != "") && trim($rowEmployee['last_name']) != "") {
                            $contactname = $rowEmployee['first_name'] . " " . $rowEmployee['last_name'];
                        } else if (trim($rowEmployee['last_name']) != "") {
                            $contactname = $rowEmployee['last_name'];
                        } else if (trim($rowEmployee['first_name']) != "") {
                            $contactname = $rowEmployee['first_name'];
                        } else if (trim($rowEmployee['middle_name']) != "") {
                            $contactname = $rowEmployee['middle_name'];
                        } else {
                            $contactname = $rowEmployee['name'];
                        }
                        if (trim($rowEmployee['user_email']) != "") {
                            $results[] = array('email' => $rowEmployee['user_email'], 'first_name' => $contactname, 'last_name' => '');
                        }
                        if (trim($rowEmployee['personal_email']) != "") {
                            $results[] = array('email' => $rowEmployee['personal_email'], 'first_name' => $contactname, 'last_name' => '');
                        }
                        if (trim($rowEmployee['work_email']) != "") {
                            $results[] = array('email' => $rowEmployee['work_email'], 'first_name' => $contactname, 'last_name' => '');
                        }
                        if (trim($rowEmployee['next_of_kin_email']) != "") {
                            $results[] = array('email' => $rowEmployee['next_of_kin_email'], 'first_name' => $contactname, 'last_name' => '');
                        }
                    }
                }
            }
        }

        return $results;
    }

    function getContact($attr) {

        $UserId = $this->arrUser['id'];
        $this->objGeneral->mysql_clean($attr);

        $id = (isset($attr['id'])) ? trim(stripslashes(strip_tags($attr['id']))) : '';

        $Sql = "SELECT * FROM contacts WHERE id=$id AND status = 1 LIMIT 1";
        $RS = $this->Conn->Execute($Sql);
        
        $results = array();
        if ($RS->RecordCount() > 0) {
            while ($row = $RS->FetchRow()) {

                $photo = "";
                if ($row['photo'] == "") {
                    $photo = "profile.jpg";
                } else {
                    $photo = $row['photo'];
                }
                $mails = array();
                $mailsType = array();
                $phones = array();
                $phonesType = array();
                $SqlMails = "SELECT * FROM contacts_mails WHERE contact_id=" . $id . " ORDER BY id DESC";
                $RSMails = $this->Conn->Execute($SqlMails);
                if ($RSMails->RecordCount() > 0) {
                    while ($rowMail = $RSMails->FetchRow()) {
                        if ($rowMail['email'] != "") {
                            $mails[] = $rowMail['email'];
                            $mailsType[] = $rowMail['type'];
                        }
                    }
                }
                $SqlPhones = "SELECT * FROM contacts_phones WHERE contact_id=" . $id . " ORDER BY id DESC";
                $RSPhones = $this->Conn->Execute($SqlPhones);
                if ($RSPhones->RecordCount() > 0) {
                    while ($rowPhone = $RSPhones->FetchRow()) {
                        if ($rowPhone['phone'] != "") {
                            $phones[] = $rowPhone['phone'];
                            $phonesType[] = $rowPhone['type'];
                        }
                    }
                }
                $results['contact'] = array('id' => $row['id'], 'contactname' => $row['contactname'], 'fname' => $row['fname'], 'lname' => $row['lname'],
                    'knownas' => $row['knownas'], 'locationname' => $row['locationname'], 'jobtitle' => $row['jobtitle'], 'organisation' => $row['organisation'],
                    'address1' => $row['address1'], 'directline' => $row['directline'], 'saveas' => $row['saveas'], 'address2' => $row['address2'],
                    'phone' => $phones, 'phoneType' => $phonesType, 'city' => $row['city'], 'fax' => $row['fax'], 'county' => $row['county'],
                    'mobile' => $row['mobile'], 'postcode' => $row['postcode'], 'email' => $row['email'],
                    'mail' => $mails, 'mailType' => $mailsType,
                    'country' => $row['country'], 'photo' => $photo, 'notes' => $row['notes'], 'skypeid' => $row['skypeid'], 'linkedinid' => $row['linkedinid'], 'url' => $row['url']);
                break;
            }
        }
        return $results;
    }

}
