<?php
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/libraries/simplexlsx.class.php");


class Migration extends Xtreme
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

    function makedirs($path, $mode = 0777)
    {
        return is_dir($path) || mkdir($path, $mode, true);
    }

    //$file_name = preg_replace('/\\.[^.\\s]{3,4}$/', '', $file_name);

    //----------------*******************--------------------------
    //----------------   Warehouses      --------------------------
    //----------------*******************--------------------------

    //---------------- Warehouses --------------------------

    function import_Warehouses($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);


            $path = APP_PATH . '/upload/migration_file/Warehouses';
            $sitepath = WEB_PATH . '/upload/migration_file/Warehouses';


            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);

            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "Warehouses/" . $file_name . '.xls';

            $new_excel =  'Warehouse Name ' . "\t" 
                                . 'Previous Warehouse code ' . "\t" 
                                . 'Address' . "\t" 
                                . 'Address 2' . "\t" 
                                . 'City' . "\t" 
                                . 'County' . "\t" 
                                . 'Postcode' . "\t" 
                                . 'Warehouse Storage Type' . "\t" 
                                . 'Contact Person' . "\t" 
                                . 'Job Title' . "\t" 
                                . 'Direct Line' . "\t" 
                                . 'Mobile' . "\t" 
                                . 'Telephone' . "\t" 
                                . 'Fax' . "\t" 
                                . 'Email' . "\t" 
                                . 'Country' . "\t" 
                                . ' Error Status' . "\n";


            list($cols,) = $xlsx->dimension();

            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $code_attr = array('tb' => 'warehouse', 'no' => 'wrh_no');

                    $code_find = array();
                    $code_find = $this->getCode($code_attr);

                    if ($code_find['ack'] == 0) {
                        $response['ack'] = 0;
                        $response['error'] = $code_find['error'];
                        return $response;
                    }

                    $warehouse_name = $this->objGeneral->clean_single_variable($r[0]);
                    $warehouse_name_length = strlen($warehouse_name);

                    $prev_code = $this->objGeneral->clean_single_variable($r[1]);
                    $prev_code_length = strlen($prev_code);

                    $address = $this->objGeneral->clean_single_variable($r[2]);
                    $address_length = strlen($address);

                    $address2 = $this->objGeneral->clean_single_variable($r[3]);
                    $address2_length = strlen($address2);

                    $city = $this->objGeneral->clean_single_variable($r[4]);
                    $city_length = strlen($city);

                    $county = $this->objGeneral->clean_single_variable($r[5]);
                    $county_length = strlen($county);

                    $postcode = $this->objGeneral->clean_single_variable($r[6]);
                    $postcode_length = strlen($postcode);

                    $warehouse_storage_type = $this->objGeneral->clean_single_variable($r[7]);
                    $warehouse_storage_type_length = strlen($warehouse_storage_type);

                    $contact_person = $this->objGeneral->clean_single_variable($r[8]);
                    $contact_person_length = strlen($contact_person);

                    $job_title = $this->objGeneral->clean_single_variable($r[9]);
                    $job_title_length = strlen($job_title);

                    $direct_line = $this->objGeneral->clean_single_variable($r[10]);
                    $direct_line_length = strlen($direct_line);

                    $mobile = $this->objGeneral->clean_single_variable($r[11]);
                    $mobile_length = strlen($mobile);

                    $telephone = $this->objGeneral->clean_single_variable($r[12]);
                    $telephone_length = strlen($telephone);

                    $fax = $this->objGeneral->clean_single_variable($r[13]);
                    $fax_length = strlen($fax);

                    $email = $this->objGeneral->clean_single_variable($r[14]);
                    $email_length = strlen($email);

                    $country = $this->objGeneral->clean_single_variable($r[15]);
                    $country_length = strlen($country);

                    $status = $this->objGeneral->clean_single_variable($r[16]);
                    $status_length = strlen($status);

                    $country_id = $this->get_data_by_id('country', 'iso', $country);
                    $warehouse_storage_type_id = $this->get_data_by_id('warehouse_storage_type', 'title', $warehouse_storage_type);


                    if ($warehouse_name_length > 150) {

                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Warehouse Name Length Exceeds Than Limit 150' . "\n";
                        $error_counter++;

                    } elseif ($prev_code_length > 255 || $prev_code_length == 0) {
                        
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($address_length > 255) {
                        
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Address 1 Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($address2_length > 255) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Address 2 Length Exceeds Than Limit 255' . "\n";                      
                        $error_counter++;

                    } elseif ($city_length > 50) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'City Length Exceeds Than Limit 50' . "\n";                      
                        $error_counter++;

                    } elseif ($county_length > 50) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'County Length Exceeds Than Limit 50' . "\n";                      
                        $error_counter++;

                    } elseif ($postcode_length > 50) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Postcode Length Exceeds Than Limit 50' . "\n";                      
                        $error_counter++;

                    } elseif ($warehouse_storage_type_id == 0) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Invalid Warehouse Storage Type' . "\n";                      
                        $error_counter++;

                    } elseif ($contact_person_length > 150) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Contact person Length Exceeds Than Limit 150' . "\n";                      
                        $error_counter++;

                    } elseif ($job_title_length > 50) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Job Title Length Exceeds Than Limit 150' . "\n";                      
                        $error_counter++;

                    } elseif ($direct_line_length > 50) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Direct Line Length Exceeds Than Limit 50' . "\n";                      
                        $error_counter++;

                    } elseif ($mobile_length > 50) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Mobile Length Exceeds Than Limit 50' . "\n";                      
                        $error_counter++;

                    } elseif ($telephone_length > 50) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Telephone Length Exceeds Than Limit 50' . "\n";                      
                        $error_counter++;

                    } elseif ($fax_length > 50) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Fax Length Exceeds Than Limit 50' . "\n";                      
                        $error_counter++;

                    } elseif ($email_length > 50 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Email is not valid' . "\n";                      
                        $error_counter++;

                    } elseif ($country_id == 0 && $country_length > 0) {
                        $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Email is not valid' . "\n";                      
                        $error_counter++;

                    } else {

                        $warehouse_code = $code_find["code"];


                        /*$sql_total = "SELECT   count(c.id) as total	FROM  warehouse  c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.prev_code='" . $prev_code . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                        //echo $sql_total;exit; and c.wrh_code='" . $warehouse_code . "'
                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  tst.name='" . $warehouse_name . "' ";

                        $total = $this->objGeneral->count_duplicate_in_sql('warehouse', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO warehouse SET
                                                                wrh_code='" . $warehouse_code . "',
                                                                name='" . $warehouse_name . "' ,
                                                                prev_code='" . $prev_code . "',
                                                                address_1='" . $address . "',
                                                                address_2='" . $address2 . "',
                                                                city='" . $city . "',
                                                                county='" . $county . "',
                                                                postcode='" . $postcode . "',
                                                                type='" . $warehouse_storage_type_id . "',
                                                                contact_person='" . $contact_person . "',                                                                
                                                                job_title='" . $job_title . "',
                                                                direct_line='" . $direct_line . "',
                                                                mobile='" . $mobile . "',
                                                                phone='" . $telephone . "',
                                                                fax='" . $fax . "',
                                                                email='" . $email . "',
                                                                country_id='" . $country_id . "',
                                                                status='1',
                                                                company_id='" . $this->arrUser['company_id'] . "',
                                                                user_id='" . $this->arrUser['id'] . "',
                                                                AddedBy='" . $this->arrUser['id'] . "',
                                                                AddedOn='" . current_date . "',
                                                                DM_check=1,
                                                                DM_file='" . $DM_file . "'
                                                                ";
                                                                // echo $Sql; exit;

                            $RS = $this->Conn->Execute($Sql);

                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {
                                $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . '' . "\n";                      
                                $success_counter++;

                            } else {
                                $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Error in Database Query' . "\n";                      
                                $error_counter++;
                            }

                        } else {
                            $new_excel .= $warehouse_name . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $warehouse_storage_type . "\t" . $contact_person . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $telephone . "\t" . $fax . "\t" . $email . "\t" . $country . "\t" . 'Duplicate warehouse Name' . "\n";                      
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {//&& $this->Conn->Affected_Rows() > 0

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Warehouses_import");
        //$path = APP_PATH.'/upload/migration_file/Warehouses/' . $file_name . '.xls';
        $path = APP_PATH . '/upload/migration_file/Warehouses/' . $file_name . '.xls';


        /*$path = APP_PATH.'/upload/migration_file/Warehouses';
        $sitepath = WEB_PATH.'/upload/migration_file/Warehouses';*/
        // echo $filepath;exit;

        file_put_contents($path, $new_excel);


        return $response;
    }
    
    function import_warehouses_storage_location($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);


            $path = APP_PATH . '/upload/migration_file/Warehouses_storage_location';
            $sitepath = WEB_PATH . '/upload/migration_file/Warehouses_storage_location';


            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);

            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "Warehouses_storage_location/" . $file_name . '.xls';

            $new_excel =  'Previous Storage code ' . "\t" 
                                . 'Location' . "\t" 
                                . 'Parent Storage Location' . "\t" 
                                . 'Currency' . "\t" 
                                . 'Cost' . "\t" 
                                . 'Unit of Measure' . "\t" 
                                . 'Cost Frequency' . "\t" 
                                . 'Start Date' . "\t" 
                                . 'Comments' . "\t" 
                                . ' Error Status' . "\n";


            list($cols,) = $xlsx->dimension();

            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prev_code_length = strlen($prev_code);

                    $location = $this->objGeneral->clean_single_variable($r[1]);
                    $location_length = strlen($location);

                    $parent_storage_location = $this->objGeneral->clean_single_variable($r[2]);
                    $parent_storage_location_length = strlen($parent_storage_location);

                    $currency = $this->objGeneral->clean_single_variable($r[3]);
                    $currency_length = strlen($currency);

                    $cost = $this->objGeneral->clean_single_variable($r[4]);
                    $cost_length = strlen($cost);

                    $unit_of_measure = $this->objGeneral->clean_single_variable($r[5]);
                    $unit_of_measure_length = strlen($unit_of_measure);

                    $cost_frequency = $this->objGeneral->clean_single_variable($r[6]);
                    $cost_frequency_length = strlen($cost_frequency);

                    $start_date = $this->objGeneral->clean_single_variable($r[7]);
                    $start_date_length = strlen($start_date);

                    $validate_start_date = $this->validateDate($start_date);

                    if (!($validate_start_date > 0)) {
                        $unixDateVal = $xlsx->unixstamp($start_date);
                        $start_date = date('d/m/Y', $unixDateVal);
                        $validate_start_date = $this->validateDate($start_date);
                    }

                    $comments = $this->objGeneral->clean_single_variable($r[8]);
                    $comments_length = strlen($comments);

                    //if ($parent_storage_location_length > 0) {
                        $parent_id = $this->get_data_by_id('warehouse_bin_location', 'prev_code', $parent_storage_location);
                    //}
                    $currency_id = $this->get_data_by_id('currency', 'name', $currency);
                    $unit_of_measure_id = $this->get_data_by_id('units_of_measure', 'title', $unit_of_measure);
                    


                    if ($prev_code_length > 255 || $prev_code_length == 0) {

                        $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Previous Code Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($location_length > 255) {
                        $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Location Length Exceeds Than Limit 255' . "\n";                        
                        $error_counter++;

                    } elseif ($parent_id == 0 && $parent_storage_location_length > 0) {
                        $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Invalid Parent Location' . "\n";                        
                        $error_counter++;

                    } elseif ($currency_id == 0 && $currency_length > 0) {
                        $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Invalid Currency' . "\n";                                                
                        $error_counter++;

                    } elseif (!is_numeric($cost)) {
                        $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Cost must be a Numeric Value' . "\n";                                                
                        $error_counter++;

                    } elseif ($unit_of_measure_id == 0 && $unit_of_measure_length > 0) {
                        $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Invalid Units of Measure' . "\n";                                                
                        $error_counter++;

                    } elseif ($cost_frequency_length > 0 && $cost_frequency != 1 && $cost_frequency != 2 && $cost_frequency != 3 && $cost_frequency != 4 && $cost_frequency != 5) {
                        $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Invalid Cost Frequency' . "\n";                                                                        
                        $error_counter++;

                    } elseif ($comments_length > 255) {
                        $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Comments Length is greater than 255' . "\n";                                                                        
                        $error_counter++;

                    } else {

                        if ($validate_start_date > 0) {
                            $converted_start_date = $this->objGeneral->convert_date($start_date);
                        }   else {
                                $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Invalid Date Format' . "\n";
                                $error_counter++;
                                $rec_error_counter++;
                                continue;
                            }

                        $data_pass = "  tst.prev_code='" . $prev_code . "' ";
                        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_bin_location', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO warehouse_bin_location SET
                                                                prev_code='" . $prev_code . "',
                                                                title='" . $location . "',
                                                                parent_id='" . $parent_id . "' ,
                                                                currency_id='" . $currency_id . "',
                                                                bin_cost='" . $cost . "',
                                                                dimensions_id='" . $unit_of_measure_id . "',
                                                                cost_type_id='" . $cost_frequency . "',
                                                                description='" . $comments . "',
                                                                warehouse_loc_sdate='" . $converted_start_date . "',
                                                                status='1',
                                                                company_id='" . $this->arrUser['company_id'] . "',
                                                                user_id='" . $this->arrUser['id'] . "',
                                                                AddedBy='" . $this->arrUser['id'] . "',
                                                                AddedOn='" . current_date . "',
                                                                DM_check=1,
                                                                DM_file='" . $DM_file . "'
                                                                ";
                                                                // echo $Sql; exit;

                            $RS = $this->Conn->Execute($Sql);

                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {
                                $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . '' . "\n";                                                                        
                                $success_counter++;

                            } else {
                                $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Error in Database Query' . "\n";                                                                        
                                $error_counter++;
                            }

                        } else {
                            $new_excel .= $prev_code . "\t" . $location . "\t" . $parent_storage_location . "\t" . $currency . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Duplicate warehouse Name' . "\n";                                                                        
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {//&& $this->Conn->Affected_Rows() > 0

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Warehouses_storage_location_import");
        //$path = APP_PATH.'/upload/migration_file/Warehouses/' . $file_name . '.xls';
        $path = APP_PATH . '/upload/migration_file/Warehouses_storage_location/' . $file_name . '.xls';


        /*$path = APP_PATH.'/upload/migration_file/Warehouses';
        $sitepath = WEB_PATH.'/upload/migration_file/Warehouses';*/
        // echo $filepath;exit;

        file_put_contents($path, $new_excel);


        return $response;
    }

    function import_warehousesStorageLocAddCost($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);


            $path = APP_PATH . '/upload/migration_file/Warehouses_storage_loc_add_cost';
            $sitepath = WEB_PATH . '/upload/migration_file/Warehouses_storage_loc_add_cost';


            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);

            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "Warehouses_storage_loc_add_cost/" . $file_name . '.xls';

            $new_excel =  'Previous Storage code ' . "\t" 
                                . 'Title' . "\t" 
                                . 'Cost' . "\t" 
                                . 'Unit of Measure' . "\t" 
                                . 'Cost Frequency' . "\t" 
                                . 'Start Date' . "\t" 
                                . 'Comments' . "\t" 
                                . ' Error Status' . "\n";


            list($cols,) = $xlsx->dimension();

            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prev_code_length = strlen($prev_code);

                    $title = $this->objGeneral->clean_single_variable($r[1]);
                    $title_length = strlen($title);

                    $cost = $this->objGeneral->clean_single_variable($r[2]);
                    $cost_length = strlen($cost);

                    $unit_of_measure = $this->objGeneral->clean_single_variable($r[3]);
                    $unit_of_measure_length = strlen($unit_of_measure);

                    $cost_frequency = $this->objGeneral->clean_single_variable($r[4]);
                    $cost_frequency_length = strlen($cost_frequency);

                    $start_date = $this->objGeneral->clean_single_variable($r[5]);
                    $start_date_length = strlen($start_date);

                    $validate_start_date = $this->validateDate($start_date);

                    if (!($validate_start_date > 0)) {
                        $unixDateVal = $xlsx->unixstamp($start_date);
                        $start_date = date('d/m/Y', $unixDateVal);
                        $validate_start_date = $this->validateDate($start_date);
                    }

                    $comments = $this->objGeneral->clean_single_variable($r[6]);
                    $comments_length = strlen($comments);

                    $unit_of_measure_id = $this->get_data_by_id('units_of_measure', 'title', $unit_of_measure);
                    $currency_id = $this->get_data_by_id('currency', 'name', $currency);
                    

                    if ($prev_code_length > 255 || $prev_code_length == 0) {

                        $new_excel .= $prev_code . "\t" . $title . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Previous Code Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($title_length > 255) {
                        $new_excel .= $prev_code . "\t" . $title . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'title Length Exceeds Than Limit 255' . "\n";                        
                        $error_counter++;

                    } elseif ($currency_id == 0 && $currency_length > 0) {
                        $new_excel .= $prev_code . "\t" . $title . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Invalid Currency' . "\n";                                                
                        $error_counter++;

                    } elseif ($cost == 0 && !is_numeric($cost)) {
                        $new_excel .= $prev_code . "\t" . $title . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Cost must be a Numeric Value' . "\n";                                                
                        $error_counter++;

                    } elseif ($unit_of_measure_id == 0 && $unit_of_measure_length > 0) {
                        $new_excel .= $prev_code . "\t" . $title . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Invalid Units of Measure' . "\n";                                                
                        $error_counter++;

                    } elseif ($cost_frequency_length > 0 && $cost_frequency != 1 && $cost_frequency != 2 && $cost_frequency != 3 && $cost_frequency != 4 && $cost_frequency != 5) {
                        $new_excel .= $prev_code . "\t" . $title . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Invalid Cost Frequency' . "\n";                                                                        
                        $error_counter++;

                    } elseif ($comments_length > 255) {
                        $new_excel .= $prev_code . "\t" . $title . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Comments Length is greater than 255' . "\n";                                                                        
                        $error_counter++;

                    } else {

                        if ($validate_start_date > 0) {
                            $converted_start_date = $this->objGeneral->convert_date($start_date);
                        }   else {
                                $new_excel .= $prev_code . "\t" . $title . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Invalid Date Format' . "\n";
                                $error_counter++;
                                $rec_error_counter++;
                                continue;
                            }

                        $data_pass = "  tst.prev_code='" . $prev_code . "' ";
                        $total = $this->objGeneral->count_duplicate_in_sql('warehouse_loc_additional_cost', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO warehouse_loc_additional_cost SET
                                                                prev_code='" . $prev_code . "',
                                                                title='" . $title . "',
                                                                cost='" . $cost . "' ,
                                                                dimensions_id='" . $unit_of_measure_id . "',
                                                                cost_type_id='" . $cost_frequency . "',
                                                                start_date='" . $converted_start_date . "',
                                                                description='" . $comments . "',
                                                                status='1',
                                                                company_id='" . $this->arrUser['company_id'] . "',
                                                                user_id='" . $this->arrUser['id'] . "',
                                                                AddedBy='" . $this->arrUser['id'] . "',
                                                                AddedOn='" . current_date . "',
                                                                DM_check=1,
                                                                DM_file='" . $DM_file . "'
                                                                ";
                                                                // echo $Sql; exit;

                            $RS = $this->Conn->Execute($Sql);

                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {
                                $new_excel .= $prev_code . "\t" . $title . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . '' . "\n";                                                                        
                                $success_counter++;

                            } else {
                                $new_excel .= $prev_code . "\t" . $title . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Error in Database Query' . "\n";                                                                        
                                $error_counter++;
                            }

                        } else {
                            $new_excel .= $prev_code . "\t" . $title . "\t" . $cost . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $start_date . "\t" . $comments . "\t" . $status . "\t" . 'Duplicate Title Name' . "\n";                                                                        
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {//&& $this->Conn->Affected_Rows() > 0

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Warehouses_storage_loc__add_cost_import");
        //$path = APP_PATH.'/upload/migration_file/Warehouses/' . $file_name . '.xls';
        $path = APP_PATH . '/upload/migration_file/Warehouses_storage_loc_add_cost/' . $file_name . '.xls';


        /*$path = APP_PATH.'/upload/migration_file/Warehouses';
        $sitepath = WEB_PATH.'/upload/migration_file/Warehouses';*/
        // echo $filepath;exit;

        file_put_contents($path, $new_excel);


        return $response;
    }

    


    //----------------*******************--------------------------
    //----------------   General Ledger  --------------------------
    //----------------*******************--------------------------

    //---------------- General Ledger --------------------------


    function import_GL($arr, $input)
    {

        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);


            $path = APP_PATH . '/upload/migration_file/GL';
            $sitepath = WEB_PATH . '/upload/migration_file/GL';


            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);

            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "GL/" . $file_name . '.xls';

            $new_excel = 'Code ' . "\t" . 'Name ' . "\t" . 'Parent Category' . "\t" . 'Sub-Category ' . "\t" . 'Account Type' . "\t" . 'Allow Posting' . "\t" . 'Sum of Ranges' . "\t" . 'VAT Rate' . "\t" . 'Transaction' . "\t" . ' Error Status' . "\n";


            list($cols,) = $xlsx->dimension();

            $counter = 0;
            $parent_account_id = "";


            foreach ($xlsx->rows() as $k => $r) {

                $gl_code = "";
                $gl_account_name = "";
                $parent_catid = "";
                $sub_catid = "";
                $account_type = "";
                $allow_posting = "";
                $sum_of_ranges = "";
                $vat_id = "";
                $transaction = "";


                if ($counter > 0 && !empty($r[0])) {
                    // print_r($r);
                    $gl_code = $this->objGeneral->clean_single_variable($r[0]);
                    $gl_code_length = strlen($gl_code);

                    $gl_account_name = $this->objGeneral->clean_single_variable($r[1]);
                    $gl_account_name_length = strlen($gl_account_name);

                    $parent_catid = $this->objGeneral->clean_single_variable($r[2]);
                    $sub_catid = $this->objGeneral->clean_single_variable($r[3]);
                    $account_type = $this->objGeneral->clean_single_variable($r[4]);
                    $allow_posting = $this->objGeneral->clean_single_variable($r[5]);
                    $sum_of_ranges = $this->objGeneral->clean_single_variable($r[6]);
                    $vat_id = $this->objGeneral->clean_single_variable($r[7]);
                    $transaction = $this->objGeneral->clean_single_variable($r[8]);

                    $sum_of_ranges_array = explode(";", $sum_of_ranges);

                    $sum_of_ranges_array_start = $sum_of_ranges_array[0];
                    $sum_of_ranges_array_start_length = strlen($sum_of_ranges_array_start);

                    $sum_of_ranges_array_end = $sum_of_ranges_array[1];
                    $sum_of_ranges_array_end_length = strlen($sum_of_ranges_array_end);


                    $parent_cat_array = array('1', '4', '5', '6', '11');
                    $sub_cat_array = array('2', '3', '7', '10', '8', '9', '12', '13', '14', '15');
                    $vat_array = array('1', '2', '3', '4', '5', '6', '7', '8');
                    $transaction_array = array('1', '2', '3');
                    $allow_posting_array = array('0', '1');
                    $account_type_array = array('1', '2', '3');

        // $vat_array = ['1', '2', '3', '4', '5', '6', '7', '8'];

                    if ($gl_account_name_length > 100) {

                        $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Account Name Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } elseif ($gl_code_length > 11) {

                        $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Account Code Length Exceeds Than Limit 11' . "\n";
                        $error_counter++;

                    } elseif ($sum_of_ranges_array_start_length > 11) {

                        $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Sum of Ranges Start Code Length Exceeds Than Limit 11' . "\n";
                        $error_counter++;

                    } elseif ($sum_of_ranges_array_end_length > 11) {

                        $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Sum of Ranges End Code Length Exceeds Than Limit 11' . "\n";
                        $error_counter++;

                    } elseif (!in_array($parent_catid, $parent_cat_array)) {

                        $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Invalid Parent Category ID' . "\n";
                        $error_counter++;

                    } elseif (!in_array($sub_catid, $sub_cat_array) && $sub_catid > 0) {

                        $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Invalid SUB Category ID' . "\n";
                        $error_counter++;

                    } elseif (!in_array($vat_id, $vat_array) && $vat_id > 0) {

                        $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Invalid VAT ID' . "\n";
                        $error_counter++;

                    } elseif (!in_array($transaction, $transaction_array) && $transaction > 0) {

                        $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Invalid Transaction ID' . "\n";
                        $error_counter++;

                    } elseif (!in_array($allow_posting, $allow_posting_array) && $allow_posting > 0) {

                        $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Invalid Allow Posting ID' . "\n";
                        $error_counter++;

                    } elseif (!in_array($account_type, $account_type_array) && $account_type > 0) {

                        $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Invalid Account Type ID' . "\n";
                        $error_counter++;
                    } else {

                        $data_pass = "  (tst.account_code='" . $gl_code . "'  )";//or tst.name='" . $gl_account_name . "'

                        $total = $this->objGeneral->count_duplicate_in_sql('company_gl_accounts', $data_pass, $this->arrUser['company_id']);

                        if ($sub_catid > 0) {

                            $code_sql_total = "SELECT  count(gl.id) as total
                                           FROM company_gl as gl
                                           left  JOIN company on company.id=gl.company_id
                                           where gl.ref_gl_id='" . $sub_catid . "'
                                                 and  gl.company_id=" . $this->arrUser['company_id'] . "
                                                 and  $gl_code BETWEEN gl.code_range_from AND gl.code_range_to  ";

                        } else {

                            $code_sql_total = "SELECT  count(gl.id) as total
                                           FROM company_gl as gl
                                           left  JOIN company on company.id=gl.company_id
                                           where gl.ref_gl_id='" . $parent_catid . "'
                                                 and  gl.company_id=" . $this->arrUser['company_id'] . "
                                                 and  $gl_code BETWEEN gl.code_range_from AND gl.code_range_to  ";
                        }
                        //echo $code_sql_total;exit;
                        $code_rs_count = $this->Conn->Execute($code_sql_total);
                        $codetotal = $code_rs_count->fields['total'];

                        if ($codetotal == 0) {

                            $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Code Number Not Exists in GL Category!' . "\n";
                            $error_counter++;

                        } else {

                            if ($total == 0) {

                                $Sql = "INSERT INTO company_gl_accounts
                                            SET
                                                parent_cat_id='" . $parent_catid . "',
                                                subcat_id='" . $sub_catid . "',
                                                name='" . $gl_account_name . "',
                                                account_code='" . $gl_code . "',
                                                vat_rate_id='" . $vat_id . "',
                                                transcation='" . $transaction . "',
                                                parent_id='" . $parent_account_id . "',
                                                allow_posting='" . $allow_posting . "',
                                                total_start_range_code='" . $sum_of_ranges_array_start . "',
                                                total_end_range_code='" . $sum_of_ranges_array_end . "',
                                                account_type='" . $account_type . "',
                                                status=1,
                                                user_id= '" . $this->arrUser['id'] . "',
                                                company_id= '" . $this->arrUser['company_id'] . "',
                                                date_added='" . current_date . "',
                                                AddedBy='" . $this->arrUser['id'] . "',
                                                AddedOn='" . current_date . "'";
        //echo $Sql; exit;
                                $RS = $this->Conn->Execute($Sql);

                                $last_insert_id = $this->Conn->Insert_ID();

                                if ($last_insert_id > 0) {

                                    $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . '' . "\n";
                                    $success_counter++;

                                } else {

                                    $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Error in Database Query' . "\n";
                                    $error_counter++;
                                }


                                if ($account_type == 3) {
                                    $parent_account_id = $last_insert_id;
                                }

                            } else {

                                $new_excel .= $gl_code . "\t" . $gl_account_name . "\t" . $parent_catid . "\t" . $sub_catid . "\t" . $account_type . "\t" . $allow_posting . "\t" . $sum_of_ranges . "\t" . $vat_id . "\t" . $transaction . "\t" . 'Duplicate Account Code' . "\n";
                                $error_counter++;
                            }
                        }
                    }
                }

                $counter++;
            }
        }

        if ($error_counter == 0) {//&& $this->Conn->Affected_Rows() > 0

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $del_sql = "DELETE FROM company_gl_accounts WHERE company_id= '" . $this->arrUser['company_id'] . "'";
            $this->Conn->Execute($del_sql);

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $del_sql2 = "DELETE FROM company_gl_accounts WHERE company_id= '" . $this->arrUser['company_id'] . "'";
            $this->Conn->Execute($del_sql2);

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=GL_import");

        $path = APP_PATH . '/upload/migration_file/GL/' . $file_name . '.xls';


        file_put_contents($path, $new_excel);


        return $response;
    }

    //----------------*******************--------------------------
    //----------------    Inventory      --------------------------
    //----------------*******************--------------------------

    //----------------Category--------------------------

    function import_category($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Categories';
            $sitepath = WEB_PATH . '/upload/migration_file/Categories';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Categories/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();

            $counter = 0;
            //$response['error'] = '';
            $new_excel = 'Name' . "\t" . 'Description' . "\t" . 'Previous Code' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $name = $this->objGeneral->clean_single_variable($r[0]);
                    $name_length = strlen($name);

                    $description = $this->objGeneral->clean_single_variable($r[1]);
                    $desc_length = strlen($description);

                    $prev_code = $this->objGeneral->clean_single_variable($r[2]);
                    $prev_code_length = strlen($prev_code);

                    

                    if ($name_length > 50) {

                        $new_excel .= $name . "\t" . $description . "\t" . $prev_code . "\t" . 'Category Name Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($desc_length > 255) {

                        $new_excel .= $name . "\t" . $description . "\t" . $prev_code . "\t" . 'Category Description Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($prev_code_length > 25) {

                        $new_excel .= $name . "\t" . $description . "\t" . $prev_code . "\t" . 'Previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } else {

                        /*$sql_total = "SELECT   count(c.id) as total	FROM  category  c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.name='" . $name . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                        //echo $sql_total; exit;
                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  tst.name='" . $name . "' AND description='" . $description . "' AND prev_code='" . $prev_code . "' ";
                        $total = $this->objGeneral->count_duplicate_in_sql('category', $data_pass, $this->arrUser['company_id']);

                        if ($total == 0) {
                            
                            $Sql = "INSERT INTO category SET 
                                                            name='" . $name . "',
                                                            description='" . $description . "',                                                             
                                                            prev_code='" . $prev_code . "',
                                                            status='1', 
                                                            company_id='" . $this->arrUser['company_id'] . "', 
                                                            AddedOn='" . current_date . "', 
                                                            user_id='" . $this->arrUser['id'] . "',
                                                            DM_check='1',
                                                            DM_file='" . $DM_file . "'";
                            
                            // echo $Sql;exit;
                            $RS = $this->Conn->Execute($Sql);

                            $new_excel .= $name . "\t" . $description . "\t" . $prev_code . "\t" . "\n";
                            $success_counter++;

                        } else {
                            $new_excel .= $name . "\t" . $description . "\t" . $prev_code . "\t" . 'Duplicate Category Name' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }

            

        }

        if ($error_counter == 0 && $this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=category_import");
        $path = APP_PATH . '/upload/migration_file/Categories/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }

    //----------------Brand--------------------------

    function import_brand($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Brands';
            $sitepath = WEB_PATH . '/upload/migration_file/Brands';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Brands/" . $file_name . '.xls';


            list($cols,) = $xlsx->dimension();
            
            $data = $xlsx->rows();

            print_r($data);exit;

            $counter = 0;

            $new_excel = 'Name' . "\t" . 'Brand Code' . "\t" . 'Previous code' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {

                

                if ($counter > 0 && !empty($r[0])) {

                    $name = $this->objGeneral->clean_single_variable($r[0]);
                    $name_length = strlen($name);

                    $brand_code = $this->objGeneral->clean_single_variable($r[1]);
                    $brand_code_length = strlen($brand_code);

                    $prev_code = $this->objGeneral->clean_single_variable($r[2]);
                    $prev_code_length = strlen($prev_code);

                    $prev_code_id = $this->get_data_by_id('category', 'prev_code', $prev_code);
                    

                    if ($name_length > 30) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . 'Brand Name Length Exceeds Than Limit 30' . "\n";
                        $error_counter++;

                    } elseif ($brand_code_length > 20) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . 'Brand code Length Exceeds Than Limit 20' . "\n";
                        $error_counter++; 

                    } elseif ($prev_code_id == 0) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . 'Previous code is invalid' . "\n";
                        $error_counter++;

                    } else {

                        /*$sql_total = "SELECT   count(c.id) as total	FROM  brand  c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.brandname='" . $name . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  tst.brandname='" . $name . "' AND prev_code='" . $prev_code . "' ";
                        $total = $this->objGeneral->count_duplicate_in_sql('brand', $data_pass, $this->arrUser['company_id']);

                        if ($total == 0) {
                            $Sql = "INSERT INTO brand SET 
                                                        brandname='" . $name . "' , 
                                                        brandcode='" . $brand_code . "' , 
                                                        prev_code='" . $prev_code . "', 
                                                        status='1', 
                                                        company_id='" . $this->arrUser['company_id'] . "', 
                                                        AddedOn='" . current_date . "', 
                                                        user_id='" . $this->arrUser['id'] . "',
                                                        DM_check='1',
                                                        DM_file='" . $DM_file . "'";
                            // echo  $Sql;exit;
                            $RS = $this->Conn->Execute($Sql);
                            
                            $new_excel .= $name . "\t" . $prev_code . "\n";
                            $success_counter++;
                        } else {
                            $new_excel .= $name . "\t" . $prev_code . "\t" . 'Duplicate Brand Name' . "\n";
                            $error_counter++;
                        }
                    }

                }
                $counter++;
            }

            
        }


        if ($error_counter == 0 && $this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Brands_import");
        $file = APP_PATH . '/upload/migration_file/Brands/' . $file_name . '.xls';
        file_put_contents($file, $new_excel);

        return $response;
    }
    //----------------Brand Category Mapping--------------------------

    function import_brandCategory($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/brandCategory';
            $sitepath = WEB_PATH . '/upload/migration_file/brandCategory';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "brandCategory/" . $file_name . '.xls';


            list($cols,) = $xlsx->dimension();
            

            $counter = 0;

            $new_excel = 'Name' . "\t" . 'Brand Name' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $cat_name = $this->objGeneral->clean_single_variable($r[0]);
                    $brand_name = $this->objGeneral->clean_single_variable($r[1]);
                    
                    $cat_id = $this->get_data_by_id('category', 'name', $cat_name);
                    $brand_id = $this->get_data_by_id('brand', 'brandname', $brand_name);


                    if (!($cat_id > 0)) {

                        $new_excel .= $cat_name . "\t" . $brand_name . "\t" . 'Invalid Category' . "\n";
                        $error_counter++;

                    } elseif (!($brand_id > 0)) {

                        $new_excel .= $cat_name . "\t" . $brand_name . "\t" . 'Invalid Brand' . "\n";
                        $error_counter++; 

                    } else {

                        /*$sql_total = "SELECT   count(c.id) as total	FROM  brand  c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.brandname='" . $name . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  tst.categoryID='" . $cat_id . "' AND brandID='" . $brand_id . "' ";
                        $total = $this->objGeneral->count_duplicate_in_sql('brandcategorymap', $data_pass, $this->arrUser['company_id']);

                        if ($total == 0) {
                            $Sql = "INSERT INTO brandcategorymap SET 
                                                        brandID='" . $brand_id . "' , 
                                                        categoryID='" . $cat_id . "',
                                                        user_id='" . $this->arrUser['id'] . "', 
                                                        company_id='" . $this->arrUser['company_id'] . "', 
                                                        AddedOn='" . current_date . "', 
                                                        Addedby='" . $this->arrUser['id'] . "',
                                                        ChangedOn='" . current_date . "', 
                                                        Changedby='" . $this->arrUser['id'] . "', 
                                                        DM_check='1',
                                                        DM_file='" . $DM_file . "'";

                            
                            // echo  $Sql;exit;
                            $RS = $this->Conn->Execute($Sql);
                            
                            $new_excel .= $cat_name . "\t" . $brand_name . "\n";
                            $success_counter++;
                        } else {
                            $new_excel .= $cat_name . "\t" . $brand_name . "\t" . 'Duplicate Brand Category Mapping' . "\n";
                            $error_counter++;
                        }
                    }

                }
                $counter++;
            }

            
        }


        if ($error_counter == 0 && $this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=brandCategory_import");
        $file = APP_PATH . '/upload/migration_file/brandCategory/' . $file_name . '.xls';
        file_put_contents($file, $new_excel);

        return $response;
    }


    //----------------Unit--------------------------

    function import_unit($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Unit_of_measure';
            $sitepath = WEB_PATH . '/upload/migration_file/Unit_of_measure';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Unit_of_measure/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();

            $counter = 0;
            $new_excel = 'Name' . "\t" . 'Previous Code' . "\t" . ' Error Status' . "\n";


            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $name = $this->objGeneral->clean_single_variable($r[0]);
                    $name_length = strlen($name);

                    $prev_code = $this->objGeneral->clean_single_variable($r[1]);
                    $prev_code_length = strlen($prev_code);

                    if ($name_length > 50) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . 'Units of measure Name Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($prev_code_length > 25) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . 'Previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } else {

                        /*$sql_total = "SELECT   count(c.id) as total	FROM  units_of_measure  c
                        LEFT JOIN company on company.id=c.company_id
                        where  	c.title='" . $name . "'
                        AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                        limit 1";
                        //echo $sql_total;exit;
                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  tst.title='" . $name . "' AND prev_code='" . $prev_code . "'  ";
                        $total = $this->objGeneral->count_duplicate_in_sql('units_of_measure', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO units_of_measure SET 
                                                            title='" . $name . "', 
                                                            prev_code='" . $prev_code . "', 
                                                            user_id='" . $this->arrUser['id'] . "',                                                            
                                                            status='1',
                                                            company_id='" . $this->arrUser['company_id'] . "', 
                                                            AddedOn='" . current_date . "', 
                                                            Addedby='" . $this->arrUser['id'] . "',
                                                            ChangedOn='" . current_date . "', 
                                                            Changedby='" . $this->arrUser['id'] . "', 
                                                            DM_check='1',
                                                            DM_file='" . $DM_file . "'";                                                        

                            // echo  $Sql;exit;
                            $RS = $this->Conn->Execute($Sql);
                            
                            $new_excel .= $name . "\t" . $prev_code . "\n";
                            $success_counter++;

                        } else {
                            $error_counter++;
                            $new_excel .= $name . "\t" . $prev_code . "\t" . 'Duplicate Unit of measure Name' . "\n";
                        }
                    }
                }
                $counter++;
            }

            

        }


        if ($error_counter == 0 && $this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Unit_of_measure_import");
        $path = APP_PATH . '/upload/migration_file/Unit_of_measure/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }

    //----------------Dimention--------------------------

    function import_dimention($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Dimention';
            $sitepath = WEB_PATH . '/upload/migration_file/Dimention';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Dimention/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();

            $counter = 0;
            $new_excel = 'Name' . "\t" . 'Code' . "\t" . 'Type' . "\t" . 'Previous Code' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $name = $this->objGeneral->clean_single_variable($r[0]);
                    $name_length = strlen($name);

                    $code = $this->objGeneral->clean_single_variable($r[1]);
                    $code_length = strlen($code);
                    $code_lcase = strtolower($code);

                    $type = $this->objGeneral->clean_single_variable($r[2]);
                    $type_lcase = strtolower($type);
                    $type_length = strlen($type);

                    $prev_code = $this->objGeneral->clean_single_variable($r[3]);
                    $prev_code_length = strlen($prev_code);


                    if ($name_length > 255) {

                        $new_excel .= $name . "\t" . $code . "\t" . $type . "\t" . $prev_code . "\t" . 'Dimension Name Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($code_length > 255) {

                        $new_excel .= $name . "\t" . $code . "\t" . $type . "\t" . $prev_code . "\t" . 'Dimension Code Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($type_length == 0) {

                        $new_excel .= $name . "\t" . $code . "\t" . $type . "\t" . $prev_code . "\t" . 'Dimension Type is Mandatory' . "\n";
                        $error_counter++;

                    } elseif ($prev_code_length > 25) {

                        $new_excel .= $name . "\t" . $code . "\t" . $type . "\t" . $prev_code . "\t" . 'Previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } else {

                        if ($type_lcase == "unit") {

                            $type_value = 0;

                        } elseif ($type_lcase == "weight") {

                            $type_value = 1;

                        } elseif ($type_lcase == "volume") {

                            $type_value = 2;

                        } else {

                            $new_excel .= $name . "\t" . $code . "\t" . $type . "\t" . $prev_code . "\t" . 'Dimension Type is invalid' . "\n";
                            $error_counter++;
                            continue;
                        }

                        /*$sql_total = "SELECT   count(c.id) as total	FROM  dimentions  c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	LCASE(c.code)='" . $code_lcase . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                        //echo $sql_total;exit;
                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  LCASE(tst.code)='" . $code_lcase . "'  ";
                        $total = $this->objGeneral->count_duplicate_in_sql('dimentions', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {
                            $Sql = "INSERT INTO dimentions SET 
                                                        code='" . $code . "',
                                                        type='" . $type_value . "', 
                                                        name='" . $name . "', 
                                                        prev_code='" . $prev_code . "', 
                                                        status='1', 
                                                        user_id='" . $this->arrUser['id'] . "',
                                                        company_id='" . $this->arrUser['company_id'] . "', 
                                                        AddedOn='" . current_date . "', 
                                                        Addedby='" . $this->arrUser['id'] . "',
                                                        ChangedOn='" . current_date . "', 
                                                        Changedby='" . $this->arrUser['id'] . "', 
                                                        DM_check='1',
                                                        DM_file='" . $DM_file . "'";
                            
                            // echo  $Sql;exit;
                            $RS = $this->Conn->Execute($Sql);

                            $new_excel .= $name . "\t" . $code . "\t" . $type . "\t" . $prev_code . "\t" . '' . "\n";
                            $success_counter++;
                        } else {
                            $error_counter++;
                            $new_excel .= $name . "\t" . $code . "\t" . $type . "\t" . $prev_code . "\t" . 'Duplicate Dimension Code' . "\n";
                        }
                    }
                }
                $counter++;

            }

            

        }


        if ($error_counter == 0 && $this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Dimention_import");
        $path = APP_PATH . '/upload/migration_file/Dimention/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }


    //----------------*******************--------------------------
    //----------------      Item         --------------------------
    //----------------*******************--------------------------


    //----------------Item General--------------------------

    function import_item($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Item';
            $sitepath = WEB_PATH . '/upload/migration_file/Item';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Item/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();                                                                                              

            $counter = 0;
            $new_excel = ' Item Previous Code' . 
                            "\t" . 'Description' . 
                            "\t" . 'Category' . 
                            "\t" . 'Brand' . 
                            "\t" . 'Commodity Code' . 
                            "\t" . 'Country Code' . 
                            "\t" . 'Status' . 
                            "\t" . 'Reason for Status' . 
                            "\t" . 'Date of Status' . 
                            "\t" . 'Base UOM' . 
                            "\t" . 'Reorder Point Qty' . 
                            "\t" . 'Min order Qty' . 
                            "\t" . 'Max order Qty' . 
                            "\t" . 'VAT Rate' . 
                            "\t" . 'Stock Allocation Req (0 for No / 1 for yes)' . 
                            "\t" . 'Item Costing Method' . 
                            "\t" . 'Standard Purchase Cost' . 
                            "\t" . 'Purchase Cost Start Date' . 
                            "\t" . 'Purchase Cost End Date' . 
                            "\t" . 'Confidential (0 for No / 1 for Yes)' . 
                            "\t" . 'Sales Price Start Date' . 
                            "\t" . 'Sales Price End Date' . 
                            "\t" . 'Standard Price' . 
                            "\t" . 'Minimum Sales Price' . 
                            "\t" . 'Minimum Order Qty' . 
                            "\t" . 'Maximum Order Qty' . 
                            "\t" . 'Error Status' . "\n";
 
            $response['ack'] = 0;

            $response['error'] = 'Record Not Inserted ';

            foreach ($xlsx->rows() as $k => $r) {

                $rec_error_counter = 0;

                if ($counter > 0 && !empty($r[0])) {
                    $code_attr = array('tb' => 'product', 'no' => 'product_no');

                    $code_find = array();
                    $code_find = $this->getCode($code_attr);

                    // print_r($code_find);

                    if ($code_find['ack'] == 0) {
                        $response['ack'] = 0;
                        $response['error'] = $code_find['error'];
                        return $response;
                        exit;
                    }
                    // exit;

                    //$description = strtolower($this->objGeneral->clean_single_variable($r[0]));

                    $old_code = $this->objGeneral->clean_single_variable($r[0]);
                    $old_code_length = strlen($old_code);

                    $description = $this->objGeneral->clean_single_variable($r[1]);
                    $description_length = strlen($description);

                    $cat_name = $this->objGeneral->clean_single_variable($r[2]);
                    $cat_name_length = strlen($cat_name); 

                    $brand_name = $this->objGeneral->clean_single_variable($r[3]);
                    $brand_name_length = strlen($brand_name); 

                    $commodity_code = $this->objGeneral->clean_single_variable($r[4]);
                    $commodity_code_length = strlen($commodity_code);

                    $country_name = $this->objGeneral->clean_single_variable($r[5]);
                    $country_name_length = strlen($country_name); 

                    /* $link_to_sub_items = $this->objGeneral->clean_single_variable($r[6]);
                    $link_to_sub_items_length = strlen($link_to_sub_items); */

                    $status = $this->objGeneral->clean_single_variable($r[6]);
                    $status_length = strlen($status);

                    $status_message = $this->objGeneral->clean_single_variable($r[7]);
                    $status_message_length = strlen($status_message);

                    $date_of_status = $this->objGeneral->clean_single_variable($r[8]); //ChangedOn
                    /* $date_of_status_length = strlen($date_of_status); */
                    $validate_date_of_status = $this->validateDate($date_of_status);

                    if ($validate_date_of_status > 0) {

                    } else {
                        $unixDateVal = $xlsx->unixstamp($date_of_status);
                        $date_of_status = date('d/m/Y', $unixDateVal);
                        $validate_date_of_status = $this->validateDate($date_of_status);
                    }

                    $unit_name = $this->objGeneral->clean_single_variable($r[9]);
                    $unit_name_length = strlen($unit_name); 

                    $reorder_qty = $this->objGeneral->clean_single_variable($r[10]);
                    $min_ord_qty = $this->objGeneral->clean_single_variable($r[11]);
                    $max_ord_qty = $this->objGeneral->clean_single_variable($r[12]);

                    $vat_rate = $this->objGeneral->clean_single_variable($r[13]);
                    $vat_rate_length = strlen($vat_rate);

                    $stock_alloc = $this->objGeneral->clean_single_variable($r[14]);
                    $stock_alloc_length = strlen($stock_alloc);

                    $item_costing_method = $this->objGeneral->clean_single_variable($r[15]);
                    $item_costing_method_length = strlen($item_costing_method);

                    $standard_purchase_cost = $this->objGeneral->clean_single_variable($r[16]);
                    $standard_purchase_cost_length = strlen($standard_purchase_cost);

                    /* $overall_item_cost = $this->objGeneral->clean_single_variable($r[16]);
                    $overall_item_cost_length = strlen($overall_item_cost); */

                    $purchase_cost_sdate = $this->objGeneral->clean_single_variable($r[17]);
                    $validate_purchase_cost_sdate = $this->validateDate($purchase_cost_sdate);

                    if ($validate_purchase_cost_sdate > 0) {

                    } else {
                        $unixDateVal = $xlsx->unixstamp($purchase_cost_sdate);
                        $purchase_cost_sdate = date('d/m/Y', $unixDateVal);
                        $validate_purchase_cost_sdate = $this->validateDate($purchase_cost_sdate);
                    }

                    $purchase_cost_edate = $this->objGeneral->clean_single_variable($r[18]);
                    $validate_purchase_cost_edate = $this->validateDate($purchase_cost_edate);

                    if ($validate_purchase_cost_edate > 0) {

                    } else {
                        $unixDateVal = $xlsx->unixstamp($purchase_cost_edate);
                        $purchase_cost_edate = date('d/m/Y', $unixDateVal);
                        $validate_purchase_cost_edate = $this->validateDate($purchase_cost_edate);
                    }

                    $confidential = $this->objGeneral->clean_single_variable($r[19]);
                    $confidential_length = strlen($confidential);

                    $sales_cost_sdate = $this->objGeneral->clean_single_variable($r[20]);
                    $validate_sales_cost_sdate = $this->validateDate($sales_cost_sdate);

                    if ($validate_sales_cost_sdate > 0) {

                    } else {
                        $unixDateVal = $xlsx->unixstamp($sales_cost_sdate);
                        $sales_cost_sdate = date('d/m/Y', $unixDateVal);
                        $validate_sales_cost_sdate = $this->validateDate($sales_cost_sdate);
                    }

                    $sales_cost_edate = $this->objGeneral->clean_single_variable($r[21]);
                    $validate_sales_cost_edate = $this->validateDate($sales_cost_edate);

                    if ($validate_sales_cost_edate > 0) {

                    } else {
                        $unixDateVal = $xlsx->unixstamp($sales_cost_edate);
                        $sales_cost_edate = date('d/m/Y', $unixDateVal);
                        $validate_sales_cost_edate = $this->validateDate($sales_cost_edate);
                    }

                    $comp_s_date = str_replace('/', '-', $purchase_cost_sdate);
                    $purchase_cost_start_date = date("Y-m-d", strtotime($comp_s_date));

                    $comp_e_date = str_replace('/', '-', $purchase_cost_edate);
                    $purchase_cost_end_date = date("Y-m-d", strtotime($comp_e_date));

                    $temp_s_date = str_replace('/', '-', $sales_cost_sdate);
                    $sales_cost_start_date = date("Y-m-d", strtotime($temp_s_date));

                    $temp_e_date = str_replace('/', '-', $sales_cost_edate);
                    $sales_cost_end_date = date("Y-m-d", strtotime($temp_e_date));

                    $pur_s_datetime = strtotime($purchase_cost_start_date);
                    $pur_e_datetime = strtotime($purchase_cost_end_date);

                    $sales_s_datetime = strtotime($sales_cost_start_date);
                    $sales_e_datetime = strtotime($sales_cost_end_date);

                    $standard_price = $this->objGeneral->clean_single_variable($r[22]);
                    $standard_price_length = strlen($standard_price);

                    $maximum_sales_price = $this->objGeneral->clean_single_variable($r[23]);
                    $maximum_sales_price_length = strlen($maximum_sales_price);

                    $minimum_order_qty = $this->objGeneral->clean_single_variable($r[24]);
                    $minimum_order_qty_length = strlen($minimum_order_qty);

                    $maximum_order_qty = $this->objGeneral->clean_single_variable($r[25]);
                    $maximum_order_qty_length = strlen($maximum_order_qty);

                    /* $warehouse_name = $this->objGeneral->clean_single_variable($r[27]);
                     $warehouse_length = strlen($warehouse_names); 

                    $default_warehouse = $this->objGeneral->clean_single_variable($r[27]);
                    $default_warehouse_length = strlen($default_warehouse);

                    $storage_location = $this->objGeneral->clean_single_variable($r[28]);
                     $storage_location = strlen($storage_location);  */

                    /* $std_purchase_cost = $this->objGeneral->clean_single_variable($r[14]);
                    $std_purchase_cost_length = strlen($std_purchase_cost);

                    $std_sale_price = $this->objGeneral->clean_single_variable($r[17]);
                    $std_sale_price_length = strlen($std_sale_price);

                    $min_sale_price = $this->objGeneral->clean_single_variable($r[18]);
                    $min_sale_price_length = strlen($min_sale_price);

                    $min_sale_price = $this->objGeneral->clean_single_variable($r[18]);
                    $min_sale_price_length = strlen($min_sale_price);

                    $status = $this->objGeneral->clean_single_variable($r[19]);
                    $status_length = strlen($status); */


                    $cat_id = $this->get_data_by_id('category', 'name', $cat_name);
                    $brand_id = $this->get_data_by_id('brand', 'brandname', $brand_name);
                    $unit_id = $this->get_data_by_id('units_of_measure', 'title', $unit_name);
                    $country_id = $this->get_data_by_id('country', 'iso', $country_name);


                    /* if ($warehouse_length > 0) {
                        $warehouse_sql = "SELECT  c.id as warehouseid	FROM  warehouse  c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.prev_code='" . $warehouse . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                        //echo $sql_total;exit;
                        $warehouse_rs_count = $this->Conn->Execute($warehouse_sql);
                        $warehouse_id = $warehouse_rs_count->fields['warehouseid'];
                    } */


                    //all other checks for each entry in order
                    
                    if  ($old_code_length > 255) {

                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method . "\t" . $standard_purchase_cost ."\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Previous Code Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif ($description_length > 255) {
                        
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method . "\t" . $standard_purchase_cost ."\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Description Length Exceeds Than Limit 255' . "\n";                        
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif ($commodity_code_length > 11) {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method . "\t" . $standard_purchase_cost . "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Commodity Code Length Exceeds Than Limit 11' . "\n";                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif ($status_length > 11 && $status != 1 && $status != 2) {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method . "\t" . $standard_purchase_cost ."\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Status Length Exceeds Than Limit 255' . "\n";                        
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif ($status_message_length > 255) {
                        
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method . "\t" . $standard_purchase_cost . "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Status Message Length Exceeds Than Limit 255' . "\n";                        
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif ($vat_rate_length > 0 && $vat_rate != 1 && $vat_rate != 2 && $vat_rate != 3 && $vat_rate != 4) {

                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method ."\t" . $standard_purchase_cost . "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item VAT rate is invalid' . "\n";                        
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif ($stock_alloc_length > 0 && $stock_alloc != 0 && $stock_alloc != 1) {

                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method ."\t" . $standard_purchase_cost . "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Stock Allocation Req is invalid' . "\n";                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif ($item_costing_method_length > 0 && $item_costing_method != 1 && $item_costing_method != 2 && $item_costing_method != 4) {
                        
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method ."\t" . $standard_purchase_cost . "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item costing method is invalid' . "\n";                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif ($confidential_length > 0 && $confidential != 0 && $confidential != 1) {
                        
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method ."\t" . $standard_purchase_cost . "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Confidentail is invalid' . "\n";                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif (!is_numeric($standard_price)) {

                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method ."\t" . $standard_purchase_cost . "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Standard Sales Price is not a number' . "\n";                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif (!is_numeric($maximum_sales_price)) {

                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method . "\t" . $standard_purchase_cost ."\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Maximum Sales Price is not a number' . "\n";                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif ($minimum_order_qty_length > 11 && !is_numeric($minimum_order_qty)){

                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method . "\t" . $standard_purchase_cost ."\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Minimum Sales Order Quantity is not valid' . "\n";                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    } elseif ($maximum_order_qty_length > 11 && !is_numeric($maximum_order_qty)) {
                        
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method ."\t" . $standard_purchase_cost . "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Maximum Sales Order Quantity is no valid' . "\n";                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }

                    //Quantity validations start

                    //-----General------//
                    if (!is_numeric($reorder_qty)){
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method . "\t" . $standard_purchase_cost ."\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'General Re-order Quantity is not numeric' . "\n";
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }

                    if (!is_numeric($min_ord_qty)){
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method ."\t" . $standard_purchase_cost . "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'General Maximum Order Quantity is not numeric' . "\n";
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }

                    if (!is_numeric($max_ord_qty)){
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method . "\t" . $standard_purchase_cost . "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'General Minimum Order Quantity is not numeric' . "\n";
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }
                    //-----General------//

                    //Quantity validations end

                    //Dates Validation start

                    //-----Purchase------//
                    if ($validate_purchase_cost_sdate > 0) {
                        $converted_purchase_cost_sdate = $this->objGeneral->convert_date($purchase_cost_sdate);
                    } else {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method . "\t" . $standard_purchase_cost . "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Purchase Invalid Start Date Format' . "\n";                        
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }

                    if ($validate_purchase_cost_edate > 0) {
                        $converted_purchase_cost_edate = $this->objGeneral->convert_date($purchase_cost_edate);
                    } else {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Purchase Invalid End Date Format' . "\n";                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }
                    //-----Purchase------//

                    //-----Sales------//
                    if ($validate_sales_cost_sdate > 0) {
                        $converted_sales_cost_sdate = $this->objGeneral->convert_date($sales_cost_sdate);
                    } else {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Sales Invalid Start Date Format' . "\n";                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }

                    if ($validate_sales_cost_edate > 0) {
                        $converted_sales_cost_edates = $this->objGeneral->convert_date($sales_cost_edate);
                    } else {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Sales Invalid End Date Format' . "\n";                                                                        
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }
                    //-----Sales------//

                    //-----Date of Status------//

                    if ($validate_date_of_status > 0) {
                        $converted_date_of_status = $this->objGeneral->convert_date($date_of_status);
                    } else {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Status Invalid Date Format' . "\n";                                                                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }

                    //-----Date of Status------//
                    

                    //-----Start date is before end date------//

                    if ($pur_s_datetime > $pur_e_datetime) {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Purchase End Date is smaller than start date' . "\n";                                                                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }

                    if ($sales_s_datetime > $sales_e_datetime) {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Sales End Date is smaller than start date' . "\n";                                                                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }

                    //Dates Validation end



                    //id validation
                    if ($cat_id == 0 && $cat_name_length > 0) {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Invalid Category Name' . "\n";                                                                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }

                    if ($brand_id == 0 && $brand_name_length > 0) {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Invalid Brand Name' . "\n";                                                                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }

                    if ($unit_id == 0 && $unit_name_length > 0) {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Invalid Unit of measure Name' . "\n";                                                                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;
                    }

                    if ($country_id == 0 && $country_name_length > 0) {
                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Country of Origin is Invalid' . "\n";                                                                                                
                        $error_counter++;
                        $rec_error_counter++;
                        continue;

                    }

                    if ($rec_error_counter == 0) {

                        /*$sql_total = "SELECT   count(c.id) as total	FROM  product  c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	(c.old_code='" . $old_code . "' or c.description='" . $description . "')
                                    AND c.product_code IS NOT NULL
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";

                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  (tst.old_code='" . $old_code . "' or tst.description='" . $description . "') AND tst.product_code IS NOT NULL ";
                        $total = $this->objGeneral->count_duplicate_in_sql('product', $data_pass, $this->arrUser['company_id']);

                        if ($total == 0) {

                            $Sql = "INSERT INTO product 
                                                    SET 
                                                old_code='" . $old_code . "',
                                                description='" . $description . "',
                                                category_id='" . $cat_id . "',
                                                brand_id='" . $brand_id . "',
                                                prd_country_origin='" . $country_id . "',
                                                prd_comidity_code='" . $commodity_code . "',
                                                status='" . $status . "'  ,                                                        
                                                status_message='" . $status_message . "'  ,                                                        
                                                ChangedOn='" . $converted_date_of_status . "'  ,                                                        
                                                unit_id='" . $unit_id . "',
                                                reorder_quantity='" . $reorder_qty . "',
                                                min_quantity='" . $min_ord_qty . "',
                                                max_quantity='" . $max_ord_qty . "',
                                                vat_rate_id='" . $vat_rate . "',
                                                stock_check='" . $stock_alloc . "'  ,
                                                costing_method_id='" . $item_costing_method . "',
                                                standard_purchase_cost='" . $standard_purchase_cost . "',                                                        
                                                avg_cost_sdate='" . $converted_purchase_cost_sdate . "',
                                                avg_cost_edate='" . $converted_purchase_cost_edate . "',
                                                confidential='" . $confidential . "',
                                                margin_start_date='" . $converted_sales_cost_sdate . "',
                                                margin_end_date='" . $converted_sales_cost_edates . "',
                                                standard_price='" . $standard_price . "',
                                                absolute_minimum_price='" . $maximum_sales_price . "',
                                                minSaleQty='" . $minimum_order_qty . "',
                                                maxSaleQty='" . $maximum_order_qty . "',
                                                product_code='" . $code_find['code'] . "'  ,
                                                product_no='" . $code_find['nubmer'] . "'  ,
                                                code_type='2', 
                                                code_internal_external='0', 
                                                company_id='" . $this->arrUser['company_id'] . "',
                                                date_added='" . current_date . "',
                                                user_id='" . $this->arrUser['id'] . "' ,
                                                AddedBy='" . $this->arrUser['id'] . "' ,
                                                AddedOn='" . current_date . "' ,
                                                DM_check=1,
                                                DM_file='" . $DM_file . "'"; 


                            // echo $Sql; exit;
                            $rs1 = $this->Conn->Execute($Sql);
                            $product_id = $this->Conn->Insert_ID();
                            $response['pid'] = $product_id;

                            if ($product_id > 0) {
                                $set_up_array_attr = array('product_code' => $code_find['code'], 'product_id' => $product_id, 'unit_ids' => $unit_id,);
                                $unit_setup_id = $this->add_product_unit($set_up_array_attr, $DM_file);
                                $response['unit_setup_id'] = $unit_setup_id;

                                if ($unit_setup_id > 0) {
                                    $Sql2 = "UPDATE product SET reoder_point_unit_id = $unit_setup_id,min_order_unit_id = $unit_setup_id,max_order_unit_id = $unit_setup_id  WHERE id =  $product_id";
                                    //echo $Sql2; exit;
                                    $RS = $this->Conn->Execute($Sql2);

                                    if ($this->Conn->Affected_Rows() > 0) {
                                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . '' . "\n";                                                                                                
                                        $success_counter++;
                                    } else {
                                        $error_counter++;
                                        $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item unit of measure Insertion Failed' . "\n";                                                                                                                                        
                                    }
                                }
                            } else {
                                //$Sql3 = "DELETE FROM product WHERE id =  $product_id"; $this->Conn->Execute($Sql2);
                                $error_counter++;
                                $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name ."\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Item Insertion Failed' . "\n";                                                                                                  
                            }
                        } else {
                            $error_counter++;
                            $new_excel .= $old_code . "\t" . $description . "\t" . $cat_name . "\t" . $brand_name . "\t" . $commodity_code . "\t" . $country_name . "\t" . $status . "\t" . $status_message . "\t" . $date_of_status . "\t" . $unit_name . "\t" . $reorder_qty . "\t" . $min_ord_qty . "\t" . $max_ord_qty . "\t" . $vat_rate . "\t" . $stock_alloc . "\t" . $item_costing_method .  "\t" . $standard_purchase_cost .  "\t" . $purchase_cost_sdate . "\t" . $purchase_cost_edate . "\t" . $confidential . "\t" . $sales_cost_sdate . "\t" . $sales_cost_edate . "\t" . $standard_price . "\t" . $maximum_sales_price . "\t" . $minimum_order_qty . "\t" . $maximum_order_qty . "\t" . 'Duplicate Item Previous Code' . "\n";                                                                                                                  
                        }
                    }
                }
                $counter++;
            }

        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Item_import");
        $path = APP_PATH . '/upload/migration_file/Item/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }

    //----------------Item Unit of Measure--------------------------

    function import_item_unit_of_measure($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Item_unit_of_measure';
            $sitepath = WEB_PATH . '/upload/migration_file/Item_unit_of_measure';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Item_unit_of_measure/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();
            $Sql = "INSERT INTO units_of_measure_setup (product_code,company_id,date_added, status, user_id,record_id,product_id,unit_id,ref_unit_id,ref_quantity,quantity,cat_id,AddedBy,AddedOn,DM_check,DM_file) VALUES ";

            $counter = 0;
            $counter2 = 0;
            $counter3 = 0;
            $new_excel = array();

            $new_excel[0] = 'Product Previous Code' . "\t" . 'Unit of Measure' . "\t" . 'Qunatity' . "\t" . 'Ref UOM' . "\t" . 'Base Quantity' . "\t" . ' Error Status' . "\n";

            $unit_of_measure_array = array();
            $prod_prev_code_array = array();
            $qty_array = array();
            $ref_uom_array = array();

            foreach ($xlsx->rows() as $k2 => $r2) {

                if ($counter2 > 0 && !empty($r2[0])) {

                    $prod_prev_code_array[] = $this->objGeneral->clean_single_variable($r2[0]);
                    $unit_of_measure_array[] = $this->objGeneral->clean_single_variable($r2[1]);
                    $qty_array[] = $this->objGeneral->clean_single_variable($r2[2]);
                    $ref_uom_array[] = $this->objGeneral->clean_single_variable($r2[3]);
                    $base_checking[] = $this->objGeneral->clean_single_variable($r2[4]);

                    if (strtolower($base_checking) == "base") {
                        //$base_check_array[][$counter2] = $base_checking;
                        $base_check_array[] = $base_checking;
                    }
                }
                $counter2++;
            }


            arsort($base_check_array);

            $base_check_array2 = array_filter($base_checking);

            foreach ($base_check_array2 as $x => $x_value) {


                $prod_prev_code = $this->objGeneral->clean_single_variable($xlsx->rows()[$x + 1][0]);
                $prod_prev_code_length = strlen($prod_prev_code);

                $unit_of_measure = $this->objGeneral->clean_single_variable($xlsx->rows()[$x + 1][1]);
                $unit_of_measure_length = strlen($unit_of_measure);

                $qty = $this->objGeneral->clean_single_variable($xlsx->rows()[$x + 1][2]);


                $ref_uom = $this->objGeneral->clean_single_variable($xlsx->rows()[$x + 1][3]);
                $ref_uom_length = strlen($ref_uom);

                $base_check = $this->objGeneral->clean_single_variable($xlsx->rows()[$x + 1][4]);
                $base_check_length = strlen($base_check);
                $lc_base_check = strtolower($base_check);


                if ($prod_prev_code_length > 0) {

                    $tbl_name = "product";
                    $find_value = "count(c.id) as total,c.id,c.product_code,c.unit_id";
                    $condition = "c.old_code='" . $prod_prev_code . "' AND c.product_code IS NOT NULL";

                    $res = $this->get_selected_rec($tbl_name, $find_value, $condition);

                    $total_oldcode = $res['total'];


                    if ($total_oldcode > 0) {
                        $product_id = $res['id'];
                        $product_code = $res['product_code'];
                        $product_unit_id = $res['unit_id'];
                    } else {
                        $new_excel[$x + 1] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Product Previous Code is not valid' . "\n";
                        $error_counter++;
                        continue;
                    }
                } else {
                    $new_excel[$x + 1] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Product Previous Code is not valid' . "\n";
                    $error_counter++;
                    continue;
                }


                if ($unit_of_measure_length > 0 && $unit_of_measure_length < 51) {

                    $lc_uom = strtolower($unit_of_measure);

                    $tbl_name = "units_of_measure";
                    $find_value = "count(c.id) as total,c.id";
                    $condition = "LCASE(c.title)='" . $lc_uom . "'";

                    $res = $this->get_selected_rec($tbl_name, $find_value, $condition);

                    $total_uom = $res['total'];
                    $uom_id = $res['id'];

                    if ($total_uom == 0) {
                        $new_excel[$x + 1] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Unit of Measure is not valid' . "\n";
                        $error_counter++;
                        continue;
                    }

                } else {
                    $new_excel[$x + 1] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Unit of Measure is not valid' . "\n";
                    $error_counter++;
                    continue;
                }

                if ($qty == 0) {
                    $new_excel[$x + 1] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Quantity is not valid' . "\n";
                    $error_counter++;
                    continue;
                }

                $ref_qty = $qty * 1;

                if (floatval($ref_qty) == 0) {
                    $new_excel[$x + 1] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Quantity is not valid' . "\n";
                    $error_counter++;
                    continue;
                }


                if ($ref_uom_length > 0 && $ref_uom_length < 51) {

                    $lc_ref_uom = strtolower($ref_uom);

                    $tbl_name = "units_of_measure";
                    $find_value = "count(c.id) as total,c.id";
                    $condition = "LCASE(c.title)='" . $lc_ref_uom . "'";

                    $res = $this->get_selected_rec($tbl_name, $find_value, $condition);

                    $total_ref_uom = $res['total'];
                    $ref_uom_id = $res['id'];

                    if ($total_ref_uom == 0) {
                        $new_excel[$x + 1] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Unit of Measure is not valid' . "\n";
                        $error_counter++;
                        continue;
                    }

                } else {
                    $new_excel[$x + 1] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Unit of Measure is not valid' . "\n";
                    $error_counter++;
                    continue;
                }

                if ($base_check_length > 0 && $lc_base_check == "base") {

                    $Sqli = "DELETE FROM units_of_measure_setup WHERE product_id= '" . $product_id . "' && 	product_code= '" . $product_code . "'";// && base_uom=1
                    $RS = $this->Conn->Execute($Sqli);
                }

                /*$sql_total = "SELECT count(ef.id) as total
                                FROM units_of_measure_setup ef
                                JOIN company ON company.id = ef.company_id
                                WHERE  	quantity='" . $qty . "' AND  unit_id='" . $product_unit_id . "'
                                AND  cat_id='" . $uom_id . "'
                                AND product_code='" . $product_code . "'
                                AND product_id='" . $product_id . "'
                                AND (ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                ";


                $rs_count = $this->Conn->Execute($sql_total);
                $total=$rs_count->fields['total']*/

                $data_pass = "  tst.quantity='" . $qty . "' AND  tst.unit_id='" . $product_unit_id . "'
                                AND  tst.cat_id='" . $uom_id . "'
                                AND tst.product_code='" . $product_code . "'
                                AND tst.product_id='" . $product_id . "'";

                $total = $this->objGeneral->count_duplicate_in_sql('units_of_measure_setup', $data_pass, $this->arrUser['company_id']);

                if ($total == 0) {
                    $Sql = "INSERT INTO units_of_measure_setup SET 
                                                                product_id='" . $product_id . "',
                                                                product_code='" . $product_code . "', 
                                                                unit_id='" . $product_unit_id . "' , 
                                                                record_id='" . $uom_id . "',
                                                                ref_unit_id='" . $ref_uom_id . "',
                                                                check_id='1', 
                                                                quantity='" . $qty . "', 
                                                                cat_id='" . $uom_id . "' ,
                                                                company_id='" . $this->arrUser['company_id'] . "', 
                                                                date_added='" . current_date . "', 
                                                                user_id='" . $this->arrUser['id'] . "' ,
                                                                ref_quantity='" . $ref_qty . "',
                                                                AddedBy='" . $this->arrUser['id'] . "',
                                                                AddedOn='" . current_date . "',
                                                                DM_check='1',
                                                                DM_file='" . $DM_file . "',
                                                                base_uom='1'";
                    $RS = $this->Conn->Execute($Sql);
                    $record = $this->Conn->Affected_Rows();
                    $success_counter++;
                } else {
                    $new_excel[$x + 1] .= $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Duplicate Record' . "\n";
                    $error_counter++;
                    continue;
                }
            }

            $i = 0;

            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $prod_prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prod_prev_code_length = strlen($prod_prev_code);

                    $unit_of_measure = $this->objGeneral->clean_single_variable($r[1]);
                    $unit_of_measure_length = strlen($unit_of_measure);

                    $qty = $this->objGeneral->clean_single_variable($r[2]);


                    $ref_uom = $this->objGeneral->clean_single_variable($r[3]);
                    $ref_uom_length = strlen($ref_uom);

                    $base_check = $this->objGeneral->clean_single_variable($r[4]);
                    $base_check_length = strlen($base_check);
                    $lc_base_check = strtolower($base_check);

                    if ($lc_base_check != "base") {


                        if ($prod_prev_code_length > 0) {

                            $tbl_name = "product";
                            $find_value = "count(c.id) as total,c.id,c.product_code,c.unit_id";
                            $condition = "c.old_code='" . $prod_prev_code . "' AND c.product_code IS NOT NULL";

                            $res = $this->get_selected_rec($tbl_name, $find_value, $condition);

                            $total_oldcode = $res['total'];


                            if ($total_oldcode > 0) {
                                $product_id = $res['id'];
                                $product_code = $res['product_code'];
                                $product_unit_id = $res['unit_id'];
                            } else {
                                $new_excel .= $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Product Previous Code is not valid' . "\n";
                                $error_counter++;
                                $i++;
                                continue;
                            }
                        } else {
                            $new_excel[$i] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Product Previous Code is not valid' . "\n";
                            $error_counter++;
                            $i++;
                            continue;
                        }

                        if ($unit_of_measure_length > 0 && $unit_of_measure_length < 51) {

                            $lc_uom = strtolower($unit_of_measure);

                            $tbl_name = "units_of_measure";
                            $find_value = "count(c.id) as total,c.id";
                            $condition = "LCASE(c.title)='" . $lc_uom . "'";

                            $res = $this->get_selected_rec($tbl_name, $find_value, $condition);

                            $total_uom = $res['total'];
                            $uom_id = $res['id'];

                            if ($total_uom == 0) {
                                $new_excel .= $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Unit of Measure is not valid' . "\n";
                                $error_counter++;
                                $i++;
                                continue;
                            }

                        } else {
                            $new_excel[$i] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Unit of Measure is not valid' . "\n";
                            $error_counter++;
                            $i++;
                            continue;
                        }

                        if ($qty == 0) {
                            $new_excel[$i] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Quantity is not valid' . "\n";
                            $error_counter++;
                            $i++;
                            continue;
                        }


                        if ($ref_uom_length > 0 && $ref_uom_length < 51) {

                            $lc_ref_uom = strtolower($ref_uom);

                            $tbl_name = "units_of_measure";
                            $find_value = "count(c.id) as total,c.id";
                            $condition = "LCASE(c.title)='" . $lc_ref_uom . "'";

                            $res = $this->get_selected_rec($tbl_name, $find_value, $condition);

                            $total_ref_uom = $res['total'];
                            $ref_uom_id = $res['id'];

                            if ($total_ref_uom == 0) {
                                $new_excel .= $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Unit of Measure is not valid' . "\n";
                                $error_counter++;
                                $i++;
                                continue;
                            }

                            $tbl_name = "units_of_measure_setup";
                            $find_value = "c.id,c.quantity";
                            $condition = "c.cat_id='" . $ref_uom_id . "' AND  c.unit_id='" . $product_unit_id . "' AND c.product_code='" . $product_code . "' AND c.product_id='" . $product_id . "' ";//AND c.base_uom=1


                            $res2 = $this->get_selected_rec($tbl_name, $find_value, $condition);

                            $prev_ref_quantity = $res2['quantity'];

                            if ($prev_ref_quantity > 0) {

                            } else {
                                $new_excel[$i] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Unit of Measure is not Defined' . "\n";
                                $error_counter++;
                                $i++;
                                continue;
                            }


                        } else {
                            $new_excel[$i] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Unit of Measure is not valid' . "\n";
                            $error_counter++;
                            $i++;
                            continue;
                        }


                        $ref_qty = $qty * $prev_ref_quantity;

                        if (floatval($ref_qty) == 0) {
                            $new_excel[$i] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Quantity is not valid' . "\n";
                            $error_counter++;
                            $i++;
                            continue;
                        }

                        /*$sql_total = "SELECT count(ef.id) as total
                                FROM units_of_measure_setup ef
                                JOIN company ON company.id = ef.company_id
                                WHERE  	quantity='" . $qty . "' AND  unit_id='" . $product_unit_id . "'
                                AND  cat_id='" . $uom_id . "'
                                AND product_code='" . $product_code . "'
                                AND product_id='" . $product_id . "'
                                AND (ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                ";

                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total']*/

                        $data_pass = "  tst.quantity='" . $qty . "' AND  tst.unit_id='" . $product_unit_id . "'
                                AND  tst.cat_id='" . $uom_id . "'
                                AND tst.product_code='" . $product_code . "'
                                AND tst.product_id='" . $product_id . "'";

                        $total = $this->objGeneral->count_duplicate_in_sql('units_of_measure_setup', $data_pass, $this->arrUser['company_id']);

                        if ($total == 0) {
                            $Sql = "INSERT INTO units_of_measure_setup 
                                                                    SET product_id='" . $product_id . "',
                                                                    product_code='" . $product_code . "', 
                                                                    unit_id='" . $product_unit_id . "' , 
                                                                    record_id='" . $uom_id . "',
                                                                    ref_unit_id='" . $ref_uom_id . "',
                                                                    check_id='1', 
                                                                    quantity='" . $qty . "',, 
                                                                    cat_id='" . $uom_id . "' ,
                                                                    company_id='" . $this->arrUser['company_id'] . "', 
                                                                    date_added='" . current_date . "', 
                                                                    user_id='" . $this->arrUser['id'] . "' ,
                                                                    ref_quantity='" . $ref_qty . "',
                                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                                    AddedOn='" . current_date . "',
                                                                    DM_check='1',
                                                                    DM_file= '" . $DM_file . "'";
                            $RS = $this->Conn->Execute($Sql);
                            $success_counter++;
                        } else {
                            $error_counter++;

                            $new_excel[$i] = $prod_prev_code . "\t" . $unit_of_measure . "\t" . $qty . "\t" . $ref_uom . "\t" . $base_check . "\t" . ' Duplicate Record' . "\n";
                        }
                    }
                }
                $counter++;
                $i++;
            }
        }

        ksort($new_excel);

        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }
        $new_excel2 = "";

        foreach ($new_excel as $simple_excel) {
            $new_excel2 .= $simple_excel;
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Item_unit_of_measure_import");
        $path = APP_PATH . '/upload/migration_file/Item_unit_of_measure/' . $file_name . '.xls';

        file_put_contents($path, $new_excel2);

        return $response;
    }

    //----------------Item Warehouse Location and Cost--------------------------

    function import_item_warehouses_loc_cost($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);


            $path = APP_PATH . '/upload/migration_file/Item_warehouse_loc_cost';
            $sitepath = WEB_PATH . '/upload/migration_file/Item_warehouse_loc_cost';


            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);

            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "Item_warehouse_loc_cost/" . $file_name . '.xls';

            $new_excel =  'Previous code ' . "\t" 
                                . 'Item Previous Code' . "\t" 
                                . 'Warehouse Previous Code' . "\t" 
                                . 'Warehouse Storage Location Previous Code' . "\t" 
                                . 'Start Date' . "\t" 
                                . 'Comments' . "\t" 
                                . 'Unit of Measure' . "\t" 
                                . 'Cost Frequency' . "\t" 
                                . 'Currency' . "\t" 
                                . 'Cost' . "\t" 
                                . 'Default' . "\t" 
                                . ' Error Status' . "\n";


            list($cols,) = $xlsx->dimension();

            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prev_code_length = strlen($prev_code);

                    $item_prev_code = $this->objGeneral->clean_single_variable($r[1]);
                    $item_prev_code_length = strlen($item_prev_code);

                    $warehouse_prev_code = $this->objGeneral->clean_single_variable($r[2]);
                    $warehouse_prev_code_length = strlen($warehouse_prev_code);

                    $warehouse_storage_location_prev_code = $this->objGeneral->clean_single_variable($r[3]);
                    $warehouse_prev_code_length = strlen($warehouse_storage_location_prev_code);

                    $start_date = $this->objGeneral->clean_single_variable($r[4]);
                    $start_date_length = strlen($start_date);

                    $validate_start_date = $this->validateDate($start_date);

                    if (!($validate_start_date > 0)) {
                        $unixDateVal = $xlsx->unixstamp($start_date);
                        $start_date = date('d/m/Y', $unixDateVal);
                        $validate_start_date = $this->validateDate($start_date);
                    }

                    $comments = $this->objGeneral->clean_single_variable($r[5]);
                    $comments_length = strlen($comments);
                    
                    $unit_of_measure = $this->objGeneral->clean_single_variable($r[6]);
                    $unit_of_measure_length = strlen($unit_of_measure);

                    $cost_frequency = $this->objGeneral->clean_single_variable($r[7]);
                    $cost_frequency_length = strlen($cost_frequency);

                    $currency = $this->objGeneral->clean_single_variable($r[8]);
                    $currency_length = strlen($currency);

                    $cost = $this->objGeneral->clean_single_variable($r[9]);
                    $cost_length = strlen($cost);

                    $default = $this->objGeneral->clean_single_variable($r[10]);
                    $default_length = strlen($default);

                    $item_id = $this->get_data_by_id('product', 'old_code', $item_prev_code);
                    $warehouse_id = $this->get_data_by_id('warehouse', 'prev_code', $warehouse_prev_code);
                    $warehouse_loc_id = $this->get_data_by_id('warehouse_bin_location', 'prev_code', $warehouse_storage_location_prev_code);
                    $unit_of_measure_id = $this->get_data_by_id('units_of_measure', 'title', $unit_of_measure);
                    $currency_id = $this->get_data_by_id('currency', 'name', $currency);
                    

                    if ($prev_code_length > 255 || $prev_code_length == 0) {
                        $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Previous Code Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($item_id == 0) {
                        $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Invalid Item' . "\n";
                        $error_counter++;

                    } elseif ($warehouse_id == 0) {
                        $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Invalid Warehouse' . "\n";
                        $error_counter++;

                    } elseif ($warehouse_loc_id == 0) {
                        $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Invalid Warehouse Storage Location' . "\n";
                        $error_counter++;

                    } elseif ($comments_length > 255) {
                        $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Comments Length is greater than 255' . "\n";
                        $error_counter++;

                    } elseif ($unit_of_measure_id == 0 && $unit_of_measure_length > 0) {
                        $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Invalid Units of Measure' . "\n";
                        $error_counter++;

                    } elseif ($cost_frequency_length > 0 && $cost_frequency != 1 && $cost_frequency != 2 && $cost_frequency != 3 && $cost_frequency != 4 && $cost_frequency != 5) {
                        $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Invalid Cost Frequency' . "\n";
                        $error_counter++;

                    } elseif ($currency_id == 0 && $currency_length > 0) {
                        $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Invalid Currency' . "\n";
                        $error_counter++;

                    } elseif ($cost_length == 0 && !is_numeric($cost)) {
                        $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Cost must be a Numeric Value' . "\n";
                        $error_counter++;

                    } elseif ($default_length > 0 && $default != 0 && $default != 1) {
                        $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Invalid Default Value' . "\n";
                        $error_counter++;

                    } else {

                        if ($validate_start_date > 0) {
                            $converted_start_date = $this->objGeneral->convert_date($start_date);
                        }   else {
                                $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Invalid Date Format' . "\n";
                                $error_counter++;
                                $rec_error_counter++;
                                continue;
                            }

                        $data_pass = "  tst.prev_code='" . $prev_code . "' ";
                        $total = $this->objGeneral->count_duplicate_in_sql('product_warehouse_location', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO product_warehouse_location SET
                                                                prev_code='" . $prev_code . "',
                                                                item_id='" . $item_id . "',
                                                                warehouse_id='" . $warehouse_id . "',
                                                                warehouse_loc_id='" . $warehouse_loc_id . "',
                                                                warehouse_loc_sdate='" . $converted_start_date . "',
                                                                description='" . $comments . "',
                                                                uom_id='" . $unit_of_measure_id . "',
                                                                cost_type_id='" . $cost_frequency . "',
                                                                currency_id='" . $currency_id . "',
                                                                cost='" . $cost . "' ,
                                                                default_warehouse='" . $default . "' ,
                                                                status='1',
                                                                company_id='" . $this->arrUser['company_id'] . "',
                                                                user_id='" . $this->arrUser['id'] . "',
                                                                AddedBy='" . $this->arrUser['id'] . "',
                                                                AddedOn='" . current_date . "',
                                                                DM_check=1,
                                                                DM_file='" . $DM_file . "'
                                                                ";
                                                                // echo $Sql; exit;

                            $RS = $this->Conn->Execute($Sql);

                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {
                                $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . '' . "\n";
                                $success_counter++;

                            } else {
                                $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {
                                $new_excel .= $prev_code . "\t" . $item_prev_code . "\t" . $warehouse_prev_code . "\t" . $warehouse_storage_location_prev_code . "\t" . $start_date . "\t" . $comments . "\t" . $unit_of_measure . "\t" . $cost_frequency . "\t" . $currency . "\t" . $cost . "\t" . $default . "\t" . 'Duplicate Warehouse Location' . "\n";
                                $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {//&& $this->Conn->Affected_Rows() > 0

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Item_warehouse_loc_cost_import");
        //$path = APP_PATH.'/upload/migration_file/Warehouses/' . $file_name . '.xls';
        $path = APP_PATH . '/upload/migration_file/Item_warehouse_loc_cost/' . $file_name . '.xls';


        /*$path = APP_PATH.'/upload/migration_file/Warehouses';
        $sitepath = WEB_PATH.'/upload/migration_file/Warehouses';*/
        // echo $filepath;exit;

        file_put_contents($path, $new_excel);


        return $response;
    }



    function get_currency_conversion_rate($lc_currency)
    {
        $this->objGeneral->mysql_clean($lc_currency);
        $current_date = date('Y-m-d');
        $Sql = "SELECT *
					FROM currency
					WHERE LCASE(name)='" . $lc_currency . "' AND status = 1 and ('" . $current_date . "' between start_date and end_date)
					ORDER BY id DESC
					LIMIT 1";

        /*echo $Sql.'<hr/>';exit;*/
        $RS = $this->Conn->Execute($Sql);

        return $RS->fields;
    }

    function check_base_currency($lc_currency)
    {

        $Sql = "SELECT count(c.id) as total FROM company c LEFT JOIN currency on currency.id=c.currency_id
                                        where  	LCASE(currency.name)='" . $lc_currency . "'
                                        AND (c.id=" . $this->arrUser['company_id'] . ") LIMIT 1";

        //echo $Sql.'<hr/>';exit;
        $RS = $this->Conn->Execute($Sql);

        return $RS->fields;
    }

    function get_selected_rec($tbl_name, $find_value, $condition, $limit_qry)
    {
        if (!isset($limit_qry)) {
            $limit_qry = "limit 1";
        }

        $sql = "SELECT   " . $find_value . "	FROM " . $tbl_name . " c
                                        LEFT JOIN company on company.id=c.company_id
                                        where  	" . $condition . "
                                        AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                        " . $limit_qry;


        // echo $sql; echo "<hr/>";exit;


        $rs = $this->Conn->Execute($sql);
        return $rs->fields;
    }

    function get_all_rec($tbl_name, $find_value, $condition, $limit_qry)
    {
        if (!isset($limit_qry)) $limit_qry = "limit 1";

        $sql = "SELECT   " . $find_value . "	FROM " . $tbl_name . " c
                                        LEFT JOIN company on company.id=c.company_id
                                        where  	" . $condition . "
                                        AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                        " . $limit_qry;

        $rs = $this->Conn->Execute($sql);

        return $rs;
    }

    function validateDate($date, $format = 'd/m/Y')
    {
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) == $date;
    }

    function getCode($attr)
    {
        $table = $attr['tb'];
        if ($table != 'product') {

            if($attr['brand']=="")
            $attr['brand']=0;

            if($attr['category']=="")
            $attr['category']=0;

            // $table = base64_encode($attr['tb']);

            /*======= Query for MYSQL FUNCTION start */

            $MYSQL_FUNCTION_Sql = "SELECT  SR_GetNextSeq('" . $table . "','" . $this->arrUser['company_id'] . "','" . $attr['brand'] . "' ,'" . $attr['category'] . "') ";
            // echo $MYSQL_FUNCTION_Sql;exit;

            $code = $this->Conn->Execute($MYSQL_FUNCTION_Sql);

            /* echo "<pre>";
            print_r($code);
            exit; */

            $SR_GetNextseqcode = $code->fields[0];

            /*======= Query for MYSQL FUNCTION  end */

            if ($SR_GetNextseqcode == "MaxReached" || $SR_GetNextseqcode == "NoValueSet") {
                $response['ack'] = 0;
                $response['error'] = $SR_GetNextseqcode;

            } elseif ($SR_GetNextseqcode != "") {

                $response['code'] = $SR_GetNextseqcode;
                $response['ack'] = 1;
                $response['error'] = 'Code Generated Successfully';
            } else {
                $response['ack'] = 0;
                $response['error'] = 'Code not Generated';
            }
            return $response;

            /*=================  end =================*/
        }

        $module_id = $attr['m_id'];
        $no = $attr['no'];
        $where = "";

        $prefix = $range_from = $range_to = $warning = $number = $record_not_found = $record_genric = 0;


        if (!empty($attr['module_category_id'])) $where .= " AND mv.module_category_id = $attr[module_category_id] ";

        if (!empty($attr['brand'])) $where .= " AND mv.brand_id= $attr[brand] ";

        if (empty($attr['brand'])) {
            if (!empty($attr['category'])) {
                $where .= " AND mv.category_id= $attr[category] ";
            }
        }

        if (($no == 'supplier_no')) $table = 'supplier';
        if (($no == 'order_no')) $table = 'srm_order';
        if (($no == 'invoice_no')) $table = 'srm_invoice';
        if (($no == 'customer_no')) $table = 'customer';
        if (($no == 'sale_invioce_no')) $table = 'invoices';

        $Sql1 = "SELECT mv.id,mv.prefix,mv.range_from,mv.range_to,mv.type
		FROM ref_module_category_value mv
		LEFT JOIN company on company.id=mv.company_id 
		JOIN ref_module_table rmt on rmt.id=mv.module_code_id 
		WHERE rmt.name='" . $table . "'  and mv.status=1 
		and  (mv.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
		" . $where . "
		ORDER BY mv.id DESC";
        //mv.module_code_id='" . $table . "'  // Now table name from ref_module_table

        // echo $Sql1;exit;
        $RS = $this->Conn->Execute($Sql1);
        $record_brand = $RS->fields['id'];

        if ((empty($record_brand)) && (empty($attr['category'])) && (empty($attr['brand'])) && ($table == 'product')) {
            $response['ack'] = 0;
            $response['error'] = "Please define $table code in setup";
            return $response;
        }

        if (!empty($attr['brand'])) {
            $record_brand_count = 0;
            $record_cat_count = 0;
            $record_genric_count = 0;

            if (!empty($record_brand)) $record_brand_count++;

        } else $record_genric++;

        if (empty($attr['brand'])) {
            if (($attr['category'] > 0)) {

                $record_brand_count = 0;
                $record_cat_count = 0;
                $record_genric = 0;
                if (!empty($record_brand)) $record_cat_count++;

            } else $record_genric++;
        }

        $where_code_number = $attr['module_category_id'];
        if ((empty($record_brand)) && ($table != 'product')) {
            $response['ack'] = 0;
            $response['error'] = "Please define $table code in setup";
            return $response;
        }

        if ((empty($record_brand)) && ($table == 'product')) {
            //brand
            if (!empty($attr['category'])) {

                $Sql2 = "SELECT mv.id,mv.prefix,mv.range_from,mv.range_to,mv.type
                        FROM ref_module_category_value mv
                        LEFT JOIN company on company.id=mv.company_id
                        JOIN ref_module_table rmt on rmt.id=mv.module_code_id
                        WHERE rmt.name='" . $table . "'  and mv.status=1
                        and  (mv.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                        AND mv.module_category_id = 3 AND mv.category_id= $attr[category]
                        ORDER BY mv.id DESC";
                // echo $Sql2;exit;
                $RS = $this->Conn->Execute($Sql2);
                $record_cat = $RS->fields['id'];
                $where_clause = '';
                $where_code_number = 3;

                $record_brand_count = 0;
                $record_cat_count = 0;
                $record_genric_count = 0;


                if (!empty($record_cat)) $record_cat_count++;

                if (empty($record_cat)) {

                    $where_clause = '';
                    $where_code_number = 2;
                    $where3 = "";

                    $Sql3 = "SELECT mv.id,mv.prefix,mv.range_from,mv.range_to,mv.type
                            FROM ref_module_category_value mv
                            LEFT JOIN company on company.id=mv.company_id
                            JOIN ref_module_table rmt on rmt.id=mv.module_code_id
                            WHERE rmt.name='" . $table . "'  and mv.status=1
                            and  (mv.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                            AND mv.module_category_id = 2
                            " . $where3 . "
                            ORDER BY mv.id DESC";
                    	// echo $Sql3;exit;
                    $RS = $this->Conn->Execute($Sql3);
                    $record_genric = $RS->fields['id'];

                    $record_brand_count = 0;
                    $record_cat_count = 0;
                    $record_genric_count = 0;
                    if (!empty($record_genric)) $record_genric_count++;


                    if ($table == 'product') {
                        $where_code_type = " AND ef.code_type =2 ";

                    }

                }

            } else {
                //category
                $Sql3 = "SELECT mv.id,mv.prefix,mv.range_from,mv.range_to,mv.type
                        FROM ref_module_category_value mv
                        LEFT JOIN company on company.id=mv.company_id
                        WHERE mv.module_code_id='" . $table . "'  and mv.status=1
                        and  (mv.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                        AND mv.module_category_id = 2
                        ORDER BY mv.id DESC";
                	// echo $Sql3;exit;
                $RS = $this->Conn->Execute($Sql3);
                $record_genric = $RS->fields['id'];
                $where_clause = '';
                $where_code_number = 2;

                $record_brand_count = 0;
                $record_cat_count = 0;
                $record_genric_count = 0;
                if (!empty($record_genric)) $record_genric_count++;

                /*	if($table=='product') {$where_code_type = " AND ef.code_type =2 ";
            $where_clause=''; 	 $where_code_number=2;
            }*/
            }
        }

        // $record_found=0;
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {

                if ($Row['type'] == 0) {
                    $prefix = $Row['prefix'];
                    $range_from = $Row['range_from'];
                    $range_to = $Row['range_to'];
                    $type = $Row['type'];
                    /// $record_found++;
                } else if ($Row['type'] == 1) {
                    $type = $Row['type'];
                }
            }
        }

        $table = $attr['tb'];
        //	if($record_found>0){
        if ($type == 0) {

            if ($table == 'product') {

                if (($record_brand_count > 0)) {
                    $where_clause .= " AND ef.brand_id= $attr[brand] ";
                    $where_clause .= " AND ef.code_type =1 ";
                } else if ($record_cat_count > 0) {
                    $where_clause .= " AND ef.category_id =$attr[category] ";
                    $where_clause .= " AND ef.code_type =3 ";
                } else if ($record_genric_count > 0) {
                    $where_clause .= " AND ef.code_type =2 ";
                }
            }

            if (!empty($attr['type'])) $where_clause .= " AND ef.type IN(".$attr['type'].") ";

            if ($table == 'product') $where_clause .= " AND ef.product_code IS NOT NULL ";
            if ($table == 'product') $where_clause .= " AND ef.code_internal_external =0 ";

            //if(!empty($attr['status'])) $where_clause .= " AND ef.status !=18   ";
            //else  $where_clause .= " AND ef.status =1   ";


            $Sql = "SELECT max(ef.$no) as count
                    FROM $table ef
                    JOIN company ON company.id = ef.company_id
                    WHERE
                    (ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                    " . $where_clause . "
                    ";
            // echo $Sql;exit;
            $srm = $this->Conn->Execute($Sql)->FetchRow();
            $nubmer = $range_from;

            if (($srm['count'] >= $range_from) && ($srm['count'] <= $range_to)) {
                $nubmer = $srm['count'] + 1;
            }

            if ($nubmer > $range_to) {
                $warning = 1;
                $msg_err = 'Code Limit Exceed';
            } else $warning = 0;

            $code = $prefix . sprintf("%'" . $range_from[0] . "" . strlen($range_from) . "d", $nubmer);
            $code_internal_external = 0;
        } //}

        else if ($type == 1) {
            $warning = 0;
            $where_code_types = 0;
            $code_internal_external = 1;
        } else {
            $msg_err = "Please define $table code in setup";
            $warning = 1;
        }

        //echo $type ;echo $code ;exit;

        if ($warning == 0) {
            $response['code'] = $code;
            $response['nubmer'] = $nubmer;
            $response['code_internal_external'] = $code_internal_external;
            $response['type'] = $type;
            $response['code_type'] = $where_code_number;
            $response['ack'] = 1;
            $response['error'] = 'Code Generated Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = $msg_err;
        }
        return $response;


    }

    function add_product_unit($attr, $DM_file)
    {
        $Sql = "INSERT Into units_of_measure_setup 
                                            SET
                                                product_id='" . $attr['product_id'] . "'
                                                ,product_code='" . $attr['product_code'] . "'
                                                ,unit_id='" . $attr['unit_ids'] . "'
                                                ,record_id='" . $attr['unit_ids'] . "'
                                                ,ref_unit_id='" . $attr['unit_ids'] . "'
                                                ,ref_quantity=1
                                                ,check_id=1
                                                ,quantity=1
                                                ,cat_id= '" . $attr['unit_ids'] . "'
                                                ,company_id='" . $this->arrUser['company_id'] . "'
                                                ,date_added='" . current_date . "'
                                                ,user_id='" . $this->arrUser['id'] . "'
                                                ,status= 1
                                                ,AddedBy='" . $this->arrUser['id'] . "'
                                                ,AddedOn='" . current_date . "'
                                                ,DM_check=1
                                                ,DM_file='" . $DM_file . "'";
        //echo $Sql; exit;
        $rs = $this->Conn->Execute($Sql);
        $setup_id = $this->Conn->Insert_ID();

        return $setup_id;
    }

    function get_data_by_id($table_name, $column, $column_name, $type)
    {
        $Sql = "SELECT id 
                FROM $table_name 	
                WHERE $column='$column_name' $type
                LIMIT 1";
        // echo $Sql;exit;
        $rs_count = $this->Conn->Execute($Sql);

        if ($rs_count->RecordCount() > 0)
            return $rs_count->fields['id'];
        else
            return 0;
    }

    function get_data_by_id_company($table_name, $column, $column_name, $type)
    {

        $Sql = "SELECT id 
                FROM $table_name
 	            WHERE $column='$column_name' and company_id='" . $this->arrUser['company_id'] . "' $type
		        LIMIT 1";

        /*echo $Sql;
        exit;*/

        $rs_count = $this->Conn->Execute($Sql);

        if ($rs_count->RecordCount() > 0)
            return $rs_count->fields['id'];
        else
            return 0;
    }


    //----------------*******************--------------------------
    //----------------      CRM           -------------------------
    //----------------*******************--------------------------

    //----------------CRM General---------------------------

    function import_CRM_Gen($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/CRM_Gen';
            $sitepath = WEB_PATH . '/upload/migration_file/CRM_Gen';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "CRM_Gen/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();


            $counter = 0;

            $new_excel =       'CRM Previous Code' . 
                        "\t" . 'Name'  . 
                        "\t" . 'Web Address' . 
                        "\t" . 'Credit Rating' . 
                        "\t" . 'Trading Currency' . 
                        "\t" . 'Ownership Type' . 
                        "\t" . 'No. of Employees' . 
                        "\t" . 'Turnover' . 
                        "\t" . 'Segment' . 
                        "\t" . 'Territory' . 
                        "\t" . 'Buying Group' . 
                        "\t" . 'Source Of CRM' . 
                        "\t" . 'CRM Classification' . 
                        "\t" . 'Social Media 1 - Name' . 
                        "\t" . 'Social Media 1 � ID' . 
                        "\t" . 'Social Media 2 - Name' . 
                        "\t" . 'Social Media 2 � ID' . 
                        "\t" . 'Social Media 3 - Name' . 
                        "\t" . 'Social Media 3 � ID' . 
                        "\t" . 'Social Media 4 - Name' . 
                        "\t" . 'Social Media 4 � ID' . 
                        "\t" . 'Social Media 5 - Name' . 
                        "\t" . 'Social Media 5 � ID' . 
                        "\t" . ' Error Status' . "\n";


            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prev_code_length = strlen($prev_code);

                    $name = $this->objGeneral->clean_single_variable($r[1]);
                    $name_length = strlen($name);

                    /* $address = $this->objGeneral->clean_single_variable($r[2]);
                    $address_length = strlen($address);

                    $address2 = $this->objGeneral->clean_single_variable($r[3]);
                    $address2_length = strlen($address2);

                    $city = $this->objGeneral->clean_single_variable($r[4]);
                    $city_length = strlen($city);

                    $county = $this->objGeneral->clean_single_variable($r[5]);
                    $county_length = strlen($county);

                    $postcode = $this->objGeneral->clean_single_variable($r[6]);
                    $postcode_length = strlen($postcode);

                    $country = $this->objGeneral->clean_single_variable($r[7]);
                    $country_length = strlen($country);

                    $telephone = $this->objGeneral->clean_single_variable($r[8]);
                    $telephone_length = strlen($telephone);

                    $fax = $this->objGeneral->clean_single_variable($r[9]);
                    $fax_length = strlen($fax);
 */
                    $webadd = $this->objGeneral->clean_single_variable($r[2]);
                    $webadd_length = strlen($webadd);

                    $credit_rating = $this->objGeneral->clean_single_variable($r[3]);
                    $credit_rating_length = strlen($credit_rating);

                    $trading_currency = $this->objGeneral->clean_single_variable($r[4]);
                    $trading_currency_length = strlen($trading_currency);

                    $ownership_type = $this->objGeneral->clean_single_variable($r[5]);
                    $ownership_type_length = strlen($ownership_type);
                    
                    $no_of_emp = $this->objGeneral->clean_single_variable($r[6]);
                    $no_of_emp_length = strlen($no_of_emp);
                    
                    $turnover = $this->objGeneral->clean_single_variable($r[7]);
                    $turnover_length = strlen($turnover);

                    $segment = $this->objGeneral->clean_single_variable($r[8]);
                    $segment_length = strlen($segment);

                    $territory = $this->objGeneral->clean_single_variable($r[9]);
                    $territory_length = strlen($territory);

                    $buying_grp = $this->objGeneral->clean_single_variable($r[10]);
                    $buying_grp_length = strlen($buying_grp);

                    $source_crm = $this->objGeneral->clean_single_variable($r[11]);
                    $source_crm_length = strlen($source_crm);

                    $classification = $this->objGeneral->clean_single_variable($r[12]);
                    $classification_length = strlen($classification);

                    $social_media1 = $this->objGeneral->clean_single_variable($r[13]);
                    $socialMediaValue1 = $this->objGeneral->clean_single_variable($r[14]);
                    $socialMediaValue1_length = strlen($socialMediaValue1);

                    $social_media2 = $this->objGeneral->clean_single_variable($r[15]);
                    $socialMediaValue2 = $this->objGeneral->clean_single_variable($r[16]);
                    $socialMediaValue2_length = strlen($socialMediaValue2);

                    $social_media3 = $this->objGeneral->clean_single_variable($r[17]);
                    $socialMediaValue3 = $this->objGeneral->clean_single_variable($r[18]);
                    $socialMediaValue3_length = strlen($socialMediaValue3);

                    $social_media4 = $this->objGeneral->clean_single_variable($r[19]);
                    $socialMediaValue4 = $this->objGeneral->clean_single_variable($r[20]);
                    $socialMediaValue4_length = strlen($socialMediaValue4);

                    $social_media5 = $this->objGeneral->clean_single_variable($r[21]);
                    $socialMediaValue5 = $this->objGeneral->clean_single_variable($r[22]);
                    $socialMediaValue5_length = strlen($socialMediaValue5);

                    $segment_type = " and segment_type=1";
                    $buying_group_type = " and crm_buying_group_type='1'";
                    $source_of_crm_type = " and type='SOURCES_OF_CRM'";
                    $classification_type = " and type=1'";

                    $country_id = $this->get_data_by_id('country', 'iso', $country);                  

                    $segment_id = $this->get_data_by_id('crm_segment', 'title', $segment, $segment_type);

                    $credit_rating_id = $this->get_data_by_id('crm_credit_rating', 'title', $credit_rating);
                    $ownership_type_id = $this->get_data_by_id('crm_owner', 'title', $ownership_type);
                    $trading_currency_id = $this->get_data_by_id_company('currency', 'code', $trading_currency);
                    $credit_rating_id = $this->get_data_by_id_company('crm_credit_rating', 'title', $credit_rating);
                    $ownership_type_id = $this->get_data_by_id_company('crm_owner', 'title', $ownership_type);
                    $territory_id = $this->get_data_by_id_company('crm_region', 'title', $territory);
                    $source_crm_id = $this->get_data_by_id('site_constants', 'title', $source_crm, $source_of_crm_type);
                    
                    $buying_grp_id = $this->get_data_by_id('crm_buying_group', 'title', $buying_grp, $buying_group_type);
                    $region_id = $this->get_data_by_id('crm_region', 'title', $region);
                    $classification_id = $this->get_data_by_id('ref_classification', 'name', $classification);
                    //$classification_id = $this->get_data_by_id('crm_classification', 'title', $classification);

                    $social_media1_id = $this->get_data_by_id('ref_social_media', 'name', $social_media1);
                    $social_media2_id = $this->get_data_by_id('ref_social_media', 'name', $social_media2);
                    $social_media3_id = $this->get_data_by_id('ref_social_media', 'name', $social_media3);
                    $social_media4_id = $this->get_data_by_id('ref_social_media', 'name', $social_media4);
                    $social_media5_id = $this->get_data_by_id('ref_social_media', 'name', $social_media5);

                    /* $Sql_source_crm = "SELECT id FROM site_constants WHERE title='" . $source_crm . "' && type='SOURCES_OF_CRM' LIMIT 1";
                    //echo $Sql;exit;
                    $rs_count_source_crm = $this->Conn->Execute($Sql_source_crm);
                    $source_crm_id = $rs_count_source_crm->fields['id'];
 */
                    /*$Sql_segment = "SELECT id FROM site_constants WHERE title='".$segment."' && type='SEGMENT' LIMIT 1";
                    //echo $Sql;exit;
                    $rs_count_segment = $this->Conn->Execute($Sql_segment);
                    $segment_id=$rs_count_segment->fields['id'];*/

                    // echo $address; exit;

                    if ($prev_code_length > 25) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    }  elseif ($name_length == 0 || $name_length > 150) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Name Length Exceeds Than Limit 150 or Name is empty' . "\n";
                        $error_counter++;

                    } elseif ($webadd_length > 100) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Web Address Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } elseif ($credit_rating_id == 0 && $credit_rating_length > 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Credit Rating is invalid' . "\n";
                        $error_counter++;

                    } elseif ($trading_currency_length > 0 && $trading_currency_id == 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Trading Currency is invalid or empty' . "\n";
                        $error_counter++;

                    } elseif ($ownership_type_id == 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Ownership Type is invalid' . "\n";
                        $error_counter++;

                    } elseif (!is_numeric($no_of_emp)) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'No. of Employees is not a numeric value' . "\n";
                        $error_counter++;

                    } elseif (!is_numeric($turnover)) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'No. of Turnover is not a numeric value' . "\n";
                        $error_counter++;

                    } elseif ($segment_id == 0 && $segment_length > 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Segment is invalid' . "\n";
                        $error_counter++;

                    } elseif ($territory_id == 0 && $territory_length > 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Territory is invalid' . "\n";
                        $error_counter++;

                    } elseif ($buying_grp_length > 0 && $buying_grp_id == 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Buying group is invalid' . "\n";
                        $error_counter++;

                    } elseif ($source_crm_length > 0 && $source_crm_id == 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Source of CRM is invalid' . "\n";
                        $error_counter++;

                    } elseif ($classification_length > 0 && $classification_id == 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Classification is invalid' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue1_length > 50) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 1 Value Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue1_length > 0 && $social_media1_id == 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 1 is Empty or Invalid' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue1_length == 0 && $social_media1_id > 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 1 Value is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue2_length > 50) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 2 Value Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue2_length > 0 && $social_media2_id == 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 2 is Empty or Invalid' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue2_length == 0 && $social_media2_id > 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 2 Value is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue3_length > 50) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 3 Value Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue3_length > 0 && $social_media3_id == 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 3 is Empty or Invalid' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue3_length == 0 && $social_media3_id > 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 3 Value is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue4_length > 50) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 4 Value Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue4_length > 0 && $social_media4_id == 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 4 is Empty or Invalid' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue4_length == 0 && $social_media4_id > 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 4 Value is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue5_length > 50) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 5 Value Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue5_length > 0 && $social_media5_id == 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 5 is Empty or Invalid' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue5_length == 0 && $social_media5_id > 0) {
                        $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Social Media 5 Value is Empty' . "\n";
                        $error_counter++;

                    } else {

                        $data_pass = "  (tst.name='" . $name . "' OR tst.prev_code='" . $prev_code . "') AND tst.status=1 AND tst.type =1 ";

                        $total = $this->objGeneral->count_duplicate_in_sql('crm', $data_pass, $this->arrUser['company_id']);

                        $code_attr = array('tb' => 'crm', 'no' => 'crm_no');

                        $code_find = array();
                        $code_find = $this->getCode($code_attr);

                        if ($code_find['ack'] == 0) {
                            $response['ack'] = 0;
                            $response['error'] = $code_find['error'];
                            return $response;
                        }

                        if ($total == 0) {
                            $Sql = "INSERT INTO crm 
                                            SET
                                        crm_code='" . $code_find['code'] . "',
                                        prev_code='" . $prev_code . "',
                                        name='" . $name . "',
                                        web_address='" . $webadd . "',
                                        credit_rating='" . $credit_rating_id . "',
                                        currency_id='" . $trading_currency_id . "',
                                        ownership_type='" . $ownership_type_id . "',
                                        emp_no='" . $no_of_emp . "',
                                        turnover='" . $turnover . "',
                                        crm_segment_id='" . $segment_id . "',
                                        region_id='" . $territory_id . "',
                                        buying_grp='" . $buying_grp_id . "',
                                        source_of_crm='" . $source_crm_id . "',
                                        crm_classification='" . $classification_id . "',
                                        status='1',
                                        type='1',
                                        socialmedia1='" . $social_media1_id . "',
                                        socialmedia1_value='" . $socialMediaValue1 . "',
                                        socialmedia2='" . $social_media2_id . "',
                                        socialmedia2_value='" . $socialMediaValue2 . "',
                                        socialmedia3='" . $social_media3_id . "',
                                        socialmedia3_value='" . $socialMediaValue3 . "',
                                        socialmedia4='" . $social_media4_id . "',
                                        socialmedia4_value='" . $socialMediaValue4 . "',
                                        socialmedia5='" . $social_media5_id . "',
                                        socialmedia5_value='" . $socialMediaValue5 . "',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "',
                                        AddedBy='" . $this->arrUser['id'] . "',
                                        AddedOn='" . current_date . "',
                                        DM_check=1,
                                        DM_file='" . $DM_file . "'
                                        ";

                            // echo $Sql;exit;
                            $RS = $this->Conn->Execute($Sql);
                            $new_crm_id = $this->Conn->Insert_ID();


                            if ($new_crm_id > 0) {
                                if ($segment_id > 0) {
                                    $Sql_segment = "INSERT INTO crm_selected_segment
                                                                        SET
                                                                            crm_id='" . $new_crm_id . "',
                                                                            segment_id='" . $segment_id . "',
                                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                                            user_id='" . $this->arrUser['id'] . "'";

                                    $RS2 = $this->Conn->Execute($Sql_segment);

                                    //$last_insert_id = $this->Conn->Insert_ID();
                                }
                                $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . '' . "\n";
                                $success_counter++;


                            } else {
                                $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {
                            $new_excel .=  $prev_code . "\t" . $name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $webadd . "\t" . $credit_rating . "\t" . $trading_currency . "\t" . $ownership_type . "\t" . $no_of_emp . "\t" . $turnover . "\t" . $segment . "\t" . $territory . "\t" . $buying_grp . "\t" . $source_crm . "\t" . $currency . "\t" . $classification . "\t" . $social_media1 . "\t" . $socialMediaValue1 . "\t" . $social_media2 . "\t" . $socialMediaValue2 . "\t" . $social_media3 . "\t" . $socialMediaValue3 . "\t" . $social_media4 . "\t" . $socialMediaValue4 . "\t" . $social_media5 . "\t" . $socialMediaValue5 . "\t" . 'Duplicate Name' . "\n";                            
                            $error_counter++;

                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {//&& $this->Conn->Affected_Rows() > 0

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=CRM_Gen_import");

        /*$file = 'people.txt';
        $current = file_get_contents($file);*/


        $path = APP_PATH . '/upload/migration_file/CRM_Gen/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }


    //----------------CRM Ownership Type--------------------

    function import_CRM_Ownership_Type($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"]))
            $seg_type = $input["tp"];

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "crm") {

                $path = APP_PATH . '/upload/migration_file/CRM_Ownership_Type';
                $sitepath = WEB_PATH . '/upload/migration_file/CRM_Ownership_Type';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();
                /// $unique_code="";

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "CRM_Ownership_Type/" . $file_name . '.xls';

            } elseif ($seg_type == "CUST") {

                $path = APP_PATH . '/upload/migration_file/Customer_Ownership_Type';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_Ownership_Type';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_Ownership_Type/" . $file_name . '.xls';
            }

            list($cols,) = $xlsx->dimension();
            $counter = 0;

            $new_excel = 'Title' . "\t" . 'Description' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $title = $this->objGeneral->clean_single_variable($r[0]);
                    $title_length = strlen($title);

                    $desc = $this->objGeneral->clean_single_variable($r[1]);

                    if ($title_length > 25) {

                        $new_excel .= $title . "\t" . $desc . "\t" . 'Title Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;
                    } else {

                        $data_pass = "  tst.title='" . $title . "'  ";
                        $total = $this->objGeneral->count_duplicate_in_sql('crm_owner', $data_pass, $this->arrUser['company_id']);

                        if ($total == 0) {

                            $Sql = "INSERT INTO crm_owner
                                                SET
                                                    title='" . $title . "',
                                                    description='" . $desc . "',
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    status=1,
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    created_date='" . current_date . "',
                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                    AddedOn='" . current_date . "',
                                                    DM_check=1,
                                                    DM_file='" . $DM_file . "'";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $title . "\t" . $desc . "\t" . '' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $title . "\t" . $desc . "\t" . 'Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {
                            $error_counter++;
                            $new_excel .= $title . "\t" . $desc . "\t" . 'Duplicate Title Name' . "\n";
                        }
                    }
                }
                $counter++;
            }
        }

        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "crm") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=CRM_Ownership_Type_import");
            $path = APP_PATH . '/upload/migration_file/CRM_Ownership_Type/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($seg_type == "CUST") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_Ownership_Type_import");
            $path = APP_PATH . '/upload/migration_file/Customer_Ownership_Type/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }


    //----------------CRM Segment---------------------------

    function import_CRM_Segments($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"]))
            $seg_type = $input["tp"];

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "crm") {

                $path = APP_PATH . '/upload/migration_file/CRM_Segments';
                $sitepath = WEB_PATH . '/upload/migration_file/CRM_Segments';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "CRM_Segments/" . $file_name . '.xls';

            } elseif ($seg_type == "CUST") {

                $path = APP_PATH . '/upload/migration_file/Customer_segment';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_segment';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_segment/" . $file_name . '.xls';
            }

            list($cols,) = $xlsx->dimension();
            $counter = 0;
            $new_excel = 'Title' . "\t" . 'Description' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $title = $this->objGeneral->clean_single_variable($r[0]);
                    $title_length = strlen($title);

                    $desc = $this->objGeneral->clean_single_variable($r[1]);

                    if ($title_length > 25 || $title_length == 0) {

                        $new_excel .= $title . "\t" . $desc . "\t" . 'Title Length Exceeds Than Limit 25 OR Title is empty' . "\n";
                        $error_counter++;

                    } else {

                        $data_pass = "  tst.title='" . $title . "'  ";
                        $total = $this->objGeneral->count_duplicate_in_sql('crm_segment', $data_pass, $this->arrUser['company_id']);

                        if ($total == 0) {

                            $Sql = "INSERT INTO crm_segment
                                                SET
                                                    title='" . $title . "',
                                                    description='" . $desc . "',
                                                    segment_type='" . CRM_ID . "',
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    status=1,
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                    AddedOn='" . current_date . "',
                                                    DM_check=1,
                                                    DM_file='" . $DM_file . "'";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $title . "\t" . $desc . "\t" . '' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $title . "\t" . $desc . "\t" . 'Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {
                            $error_counter++;
                            $new_excel .= $title . "\t" . $desc . "\t" . 'Duplicate Title Name' . "\n";
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "crm") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=CRM_Segments_import");
            $path = APP_PATH . '/upload/migration_file/CRM_Segments/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($seg_type == "CUST") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_segment_import");
            $path = APP_PATH . '/upload/migration_file/Customer_segment/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }


    //----------------CRM Buying_Group----------------------

    function import_CRM_Buying_Group($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"]))
            $seg_type = $input["tp"];

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "crm") {

                $path = APP_PATH . '/upload/migration_file/CRM_Buying_Group';
                $sitepath = WEB_PATH . '/upload/migration_file/CRM_Buying_Group';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "CRM_Buying_Group/" . $file_name . '.xls';

            } elseif ($seg_type == "CUST") {

                $path = APP_PATH . '/upload/migration_file/Customer_Buying_Group';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_Buying_Group';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_Buying_Group/" . $file_name . '.xls';
            }


            list($cols,) = $xlsx->dimension();
            $counter = 0;
            $new_excel = 'Title' . "\t" . 'Description' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $title = $this->objGeneral->clean_single_variable($r[0]);
                    $title_length = strlen($title);

                    $desc = $this->objGeneral->clean_single_variable($r[1]);

                    if ($title_length > 25 || $title_length == 0) {

                        $new_excel .= $title . "\t" . $desc . "\t" . 'Title Length Exceeds Than Limit 25 or Title is empty' . "\n";
                        $error_counter++;

                    } else {

                        $data_pass = "  tst.title='" . $title . "'  ";
                        $total = $this->objGeneral->count_duplicate_in_sql('crm_buying_group', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO crm_buying_group
                                                SET
                                                    title='" . $title . "',
                                                    description='" . $desc . "',
                                                    crm_buying_group_type='" . CRM_ID . "',
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    status=1,
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                    AddedOn='" . current_date . "',
                                                    DM_check=1,
                                                    DM_file='" . $DM_file . "'";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $title . "\t" . $desc . "\t" . '' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $title . "\t" . $desc . "\t" . 'Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {
                            $error_counter++;
                            $new_excel .= $title . "\t" . $desc . "\t" . 'Duplicate Title Name' . "\n";
                        }
                    }
                }
                $counter++;
            }
        }

        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "crm") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=CRM_Buying_Group_import");
            $path = APP_PATH . '/upload/migration_file/CRM_Buying_Group/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($seg_type == "CUST") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_Buying_Group_import");
            $path = APP_PATH . '/upload/migration_file/Customer_Buying_Group/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }


    //----------------CRM Region----------------------------

    function import_CRM_Region($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"]))
            $seg_type = $input["tp"];

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "crm") {

                $path = APP_PATH . '/upload/migration_file/CRM_Region';
                $sitepath = WEB_PATH . '/upload/migration_file/CRM_Region';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "CRM_Region/" . $file_name . '.xls';

            } elseif ($seg_type == "CUST") {

                $path = APP_PATH . '/upload/migration_file/Customer_Region';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_Region';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_Region/" . $file_name . '.xls';
            }


            list($cols,) = $xlsx->dimension();
            $counter = 0;
            $new_excel = 'Title' . "\t" . 'Description' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $title = $this->objGeneral->clean_single_variable($r[0]);
                    $title_length = strlen($title);

                    $desc = $this->objGeneral->clean_single_variable($r[1]);

                    if ($title_length > 25 || $title_length == 0) {

                        $new_excel .= $title . "\t" . $desc . "\t" . 'Title Length Exceeds Than Limit 25 or Title is empty' . "\n";
                        $error_counter++;
                    } else {

                        $data_pass = "  tst.title='" . $title . "'  ";
                        $total = $this->objGeneral->count_duplicate_in_sql('crm_region', $data_pass, $this->arrUser['company_id']);

                        if ($total == 0) {

                            $Sql = "INSERT INTO crm_region
                                                SET
                                                    title='" . $title . "',
                                                    description='" . $desc . "',
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    status=1,
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                    AddedOn='" . current_date . "',
                                                    DM_check=1,
                                                    DM_file='" . $DM_file . "'";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $title . "\t" . $desc . "\t" . '' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $title . "\t" . $desc . "\t" . 'Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {
                            $error_counter++;
                            $new_excel .= $title . "\t" . $desc . "\t" . 'Duplicate Title Name' . "\n";
                        }
                    }
                }
                $counter++;
            }
        }

        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "crm") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=CRM_Region_import");
            $path = APP_PATH . '/upload/migration_file/CRM_Region/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($seg_type == "CUST") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_Region_import");
            $path = APP_PATH . '/upload/migration_file/Customer_Region/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }


    //----------------CRM Sources --------------------------

    function import_CRM_Source($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);


            $path = APP_PATH . '/upload/migration_file/CRM_Source';
            $sitepath = WEB_PATH . '/upload/migration_file/CRM_Source';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "CRM_Source/" . $file_name . '.xls';


            list($cols,) = $xlsx->dimension();
            $counter = 0;
            $new_excel = 'Title' . "\t" . 'Description' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $title = $this->objGeneral->clean_single_variable($r[0]);
                    $title_length = strlen($title);

                    $desc = $this->objGeneral->clean_single_variable($r[1]);
                    //$desc_length = strlen($desc);

                    if ($title_length > 25 || $title_length == 0) {

                        $new_excel .= $title . "\t" . $desc . "\t" . 'Title Length Exceeds Than Limit 25 or Title is Empty' . "\n";
                        $error_counter++;
                    } else {
                        $data_pass = "  tst.name='" . $title . "' AND tst.type= 'SOURCES_OF_CRM'";
                        $total = $this->objGeneral->count_duplicate_in_sql('site_constants', $data_pass, $this->arrUser['company_id']);

                        if ($total == 0) {

                            $Sql = "INSERT INTO site_constants
                                                SET
                                                    type='" . SOURCES_OF_CRM . "',
                                                    name='" . $title . "',
                                                    description='" . $desc . "',
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    status=1,
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                    AddedOn='" . current_date . "',
                                                    DM_check=1,
                                                    DM_file='" . $DM_file . "'";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $title . "\t" . $desc . "\t" . '' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $title . "\t" . $desc . "\t" . 'Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {
                            $error_counter++;
                            $new_excel .= $title . "\t" . $desc . "\t" . 'Duplicate Title Name' . "\n";
                        }

                    }
                }
                $counter++;

            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Records Inserted';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=CRM_Source_import");
        $path = APP_PATH . '/upload/migration_file/CRM_Source/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);


        return $response;
    }


    //----------------CRM Classification--------------------

    function import_CRM_Classification($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);


            $path = APP_PATH . '/upload/migration_file/CRM_Classification';
            $sitepath = WEB_PATH . '/upload/migration_file/CRM_Classification';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "CRM_Classification/" . $file_name . '.xls';


            list($cols,) = $xlsx->dimension();
            $counter = 0;
            $new_excel = 'Title' . "\t" . 'Description' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $title = $this->objGeneral->clean_single_variable($r[0]);
                    $title_length = strlen($title);

                    $desc = $this->objGeneral->clean_single_variable($r[1]);

                    if ($title_length > 25 || $title_length == 0) {

                        $new_excel .= $title . "\t" . $desc . "\t" . 'Title Length Exceeds Than Limit 25 or Title is empty' . "\n";
                        $error_counter++;
                    } else {

                        $data_pass = "  tst.title='" . $title . "'  ";
                        $total = $this->objGeneral->count_duplicate_in_sql('crm_classification', $data_pass, $this->arrUser['company_id']);

                        if ($total == 0) {

                            $Sql = "INSERT INTO crm_classification
                                                SET
                                                    title='" . $title . "',
                                                    description='" . $desc . "',
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    status=1,
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    created_date='" . current_date . "',
                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                    AddedOn='" . current_date . "',
                                                    DM_check=1,
                                                    DM_file='" . $DM_file . "'";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $title . "\t" . $desc . "\t" . '' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $title . "\t" . $desc . "\t" . 'Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {
                            $error_counter++;
                            $new_excel .= $title . "\t" . $desc . "\t" . 'Duplicate Title Name' . "\n";
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=CRM_Classification_import");
        $path = APP_PATH . '/upload/migration_file/CRM_Classification/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);


        return $response;
    }

    /*Duplication function change checked*/
    //----------------CRM Contacts--------------------------

    function import_CRM_Contacts($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"]))
            $seg_type = $input["tp"];        


        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "crm") {

                $path = APP_PATH . '/upload/migration_file/CRM_Contacts';
                $sitepath = WEB_PATH . '/upload/migration_file/CRM_Contacts';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "CRM_Contacts/" . $file_name . '.xls';

                $new_excel = 'CRM Previous Code ' . 
                        "\t" . 'Contact Previous Code' . 
                        "\t" . 'Is Primary' . 
                        "\t" . 'Name' . 
                        "\t" . 'Job title' . 
                        "\t" . 'Direct Line' . 
                        "\t" . 'Mobile' . 
                        "\t" . 'Email' . 
                        "\t" . 'Telephone' .
                        "\t" . 'Fax' . 
                        "\t" . 'Pref. Method Of Comm.' . 
                        "\t" . 'Social Media 1 � ID' . 
                        "\t" . 'Social Media 1 - Name' . 
                        "\t" . 'Social Media 2 � ID' . 
                        "\t" . 'Social Media 2 - Name' . 
                        "\t" . 'Social Media 3 � ID' . 
                        "\t" . 'Social Media 3 - Name' . 
                        "\t" . 'Social Media 4 � ID' . 
                        "\t" . 'Social Media 4 - Name' . 
                        "\t" . 'Social Media 5 � ID' . 
                        "\t" . 'Social Media 5 - Name' . 
                        "\t" . 'Notes' .
                        "\t" . ' Error Status' . "\n";


            } elseif ($seg_type == "CUST") {

                $path = APP_PATH . '/upload/migration_file/Customer_Contacts';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_Contacts';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_Contacts/" . $file_name . '.xls';

                $new_excel = 'Contact Name ' . "\t" . 'Customer Previous Code' . "\t" . 'Contact Previous Code' . "\t" . 'Job title' . "\t" . 'Direct Line' . "\t" . 'Mobile' . "\t" . 'Email' . "\t" . 'Telephone' . "\t" . 'Fax' . "\t" . 'Pref. Method Of Comm.' . "\t" . 'Is Primary' . "\t" . 'Notes' . "\t" . 'Social Media 1 � ID' . "\t" . 'Social Media 1 - Name' . "\t" . 'Social Media 2 � ID' . "\t" . 'Social Media 2 - Name' . "\t" . 'Social Media 3 � ID' . "\t" . 'Social Media 3 - Name' . "\t" . 'Social Media 4 � ID' . "\t" . 'Social Media 4 - Name' . "\t" . 'Social Media 5 � ID' . "\t" . 'Social Media 5 - Name' . "\t" . ' Error Status' . "\n";
            }

            list($cols,) = $xlsx->dimension();

            $counter = 0;
            $primary_prev_code = array();

            foreach ($xlsx->rows() as $k => $a) {

                if (in_array($a[1], $primary_prev_code) && strtolower($a[10]) == 'yes') {
                    $response['ack'] = 0;
                    $response['error'] = "There should be only one Primary against each CRM, " . $a[1] . " CRM code has multiple primary.";
                    return $response;
                }

                if (strtolower($a[10]) == 'yes')
                    array_push($primary_prev_code, $a[1]);
            }
            //return $primary_prev_code;
            /* foreach ($xlsx->rows() as $k => $r){
                 if (array_filter($r))
                    {echo "<pre>"; print_r($r);} 
                   // echo "<pre>"; print_r($r);
            }
            exit;*/

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && array_filter($r)) {//!empty($r)

                    $crm_prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $crm_prev_code_length = strlen($crm_prev_code);

                    $contact_prev_code = $this->objGeneral->clean_single_variable($r[1]);
                    $contact_prev_code_length = strlen($contact_prev_code);

                    $is_primary = $this->objGeneral->clean_single_variable($r[2]);

                    if (strtolower($is_primary) == 'yes')
                        $is_primary = 1;
                    else
                        $is_primary = 0;

                    $name = $this->objGeneral->clean_single_variable($r[3]);
                    $name_length = strlen($name);

                    $job_title = $this->objGeneral->clean_single_variable($r[4]);
                    $job_title_length = strlen($job_title);

                    $direct_line = $this->objGeneral->clean_single_variable($r[5]);
                    $direct_line_length = strlen($direct_line);

                    $mobile = $this->objGeneral->clean_single_variable($r[6]);
                    $mobile_length = strlen($mobile);

                    $email = $this->objGeneral->clean_single_variable($r[7]);
                    $email_length = strlen($email);

                    $telephone = $this->objGeneral->clean_single_variable($r[8]);
                    $telephone_length = strlen($telephone);

                    $fax = $this->objGeneral->clean_single_variable($r[9]);
                    $fax_length = strlen($fax);

                    $pref_comm_method = $this->objGeneral->clean_single_variable($r[10]);
                    $pref_comm_method_length = strlen($pref_comm_method);
                    
                    $social_media1 = $this->objGeneral->clean_single_variable($r[11]);
                    $socialMediaValue1 = $this->objGeneral->clean_single_variable($r[12]);
                    $socialMediaValue1_length = strlen($socialMediaValue1);

                    $social_media2 = $this->objGeneral->clean_single_variable($r[13]);
                    $socialMediaValue2 = $this->objGeneral->clean_single_variable($r[14]);
                    $socialMediaValue2_length = strlen($socialMediaValue2);

                    $social_media3 = $this->objGeneral->clean_single_variable($r[15]);
                    $socialMediaValue3 = $this->objGeneral->clean_single_variable($r[16]);
                    $socialMediaValue3_length = strlen($socialMediaValue3);

                    $social_media4 = $this->objGeneral->clean_single_variable($r[17]);
                    $socialMediaValue4 = $this->objGeneral->clean_single_variable($r[18]);
                    $socialMediaValue4_length = strlen($socialMediaValue4);

                    $social_media5 = $this->objGeneral->clean_single_variable($r[19]);
                    $socialMediaValue5 = $this->objGeneral->clean_single_variable($r[20]);
                    $socialMediaValue5_length = strlen($socialMediaValue5);

                    $notes = $this->objGeneral->clean_single_variable($r[21]);
                    $notes_length = strlen($notes);

                    $crm_pref_method_of_communiction_id = $this->get_data_by_id('crm_pref_method_of_communiction', 'title', $pref_comm_method);
                    $crm_id = $this->get_data_by_id('crm', 'prev_code', $prev_code);
                    
                    $social_media1_id = $this->get_data_by_id('ref_social_media', 'name', $social_media1);
                    $social_media2_id = $this->get_data_by_id('ref_social_media', 'name', $social_media2);
                    $social_media3_id = $this->get_data_by_id('ref_social_media', 'name', $social_media3);
                    $social_media4_id = $this->get_data_by_id('ref_social_media', 'name', $social_media4);
                    $social_media5_id = $this->get_data_by_id('ref_social_media', 'name', $social_media5);

                    // echo $crm_id; exit;
                    if ($crm_id == 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Crm Previous code is invalid' . "\n";
                        $error_counter++;

                    } elseif ($contact_prev_code_length > 25) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Contact Previous code Exceeds Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($is_primary != 0 && $is_primary != 1) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Is Primary is invalid' . "\n";
                        $error_counter++;

                    } elseif ($name == 0 && $name_length > 50) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Name Length Exceeds Than Limit 50 or is empty' . "\n";
                        $error_counter++;

                    } elseif ($job_title_length > 50) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Job Title Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($direct_line_length > 50) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Direct Line Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($mobile_length > 50) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Mobile Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($phone_length > 50) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Phone Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($fax_length > 50) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Fax Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($email_length > 50 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Email is not valid' . "\n";
                        $error_counter++;

                    } elseif ($pref_comm_method_length > 0 && $crm_pref_method_of_communiction_id == 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Pref Method of Communication is not valid' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue1_length > 50) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 1 Value Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue1_length > 0 && $social_media1_id == 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 1 is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue1_length == 0 && $social_media1_id > 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 1 Value is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue2_length > 50) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 2 Value Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue2_length > 0 && $social_media2_id == 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 2 is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue2_length == 0 && $social_media2_id > 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 2 Value is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue3_length > 50) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 3 Value Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue3_length > 0 && $social_media3_id == 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 3 is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue3_length == 0 && $social_media3_id > 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 3 Value is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue4_length > 50) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 4 Value Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue4_length > 0 && $social_media4_id == 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 4 is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue4_length == 0 && $social_media4_id > 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 4 Value is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue5_length > 50) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 5 Value Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue5_length > 0 && $social_media5_id == 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 5 is Empty' . "\n";
                        $error_counter++;

                    } elseif ($socialMediaValue5_length == 0 && $social_media5_id > 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Social Media 5 Value is Empty' . "\n";
                        $error_counter++;

                    } elseif ($notes_length > 255) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Notes Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } else {

                        $CRM_sql_total = "SELECT  count(c.id) as total,c.id as crm_id
                                          FROM crm c
                                          LEFT JOIN company on company.id=c.company_id
                                          where c.prev_code='" . $prev_code . "' AND
                                                (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                          limit 1";

                        //echo $CRM_sql_total;

                        $crm_rs_count = $this->Conn->Execute($CRM_sql_total);
                        $crm_total = $crm_rs_count->fields['total'];
                        $crm_id = $crm_rs_count->fields['crm_id'];

                        if ($crm_total > 0) {

                            $data_pass_primary = "  tst.is_primary='1' and tst.acc_id='" . $crm_id . "' and tst.module_type='1' ";
                            $total_primary = $this->objGeneral->count_duplicate_in_sql('alt_contact', $data_pass_primary, $this->arrUser['company_id']);
                            $total_primary == 0;

                            if ($is_primary == 1 && $total_primary > 0) {
                                $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Primary already set.' . "\n";
                                $error_counter++;
                            } else {

                                $data_pass = "  tst.contact_name='" . $name . "' and tst.acc_id='" . $crm_id . "' and tst.module_type='1'";
                                $total = $this->objGeneral->count_duplicate_in_sql('alt_contact', $data_pass, $this->arrUser['company_id']);


                                if ($total == 0) {
                                    $Sql = "INSERT INTO alt_contact
                                                        SET
                                                            acc_id='" . $crm_id . "',
                                                            module_type='1',
                                                            contact_code='" . $contact_prev_code . "',
                                                            is_primary='" . $is_primary . "',
                                                            contact_name='" . $name . "',
                                                            job_title='" . $job_title . "',
                                                            direct_line='" . $direct_line . "',
                                                            mobile='" . $mobile . "',
                                                            phone='" . $phone . "',
                                                            fax='" . $fax . "',
                                                            email='" . $email . "',
                                                            pref_method_of_communication='" . $crm_pref_method_of_communiction_id . "',
                                                            notes='" . $notes . "',
                                                            booking_instructions='" . $notes . "',
                                                            socialmedia1='" . $social_media1_id . "',
                                                            socialmedia1_value='" . $socialMediaValue1 . "',
                                                            socialmedia2='" . $social_media2_id . "',
                                                            socialmedia2_value='" . $socialMediaValue2 . "',
                                                            socialmedia3='" . $social_media3_id . "',
                                                            socialmedia3_value='" . $socialMediaValue3 . "',
                                                            socialmedia4='" . $social_media4_id . "',
                                                            socialmedia4_value='" . $socialMediaValue4 . "',
                                                            socialmedia5='" . $social_media5_id . "',
                                                            socialmedia5_value='" . $socialMediaValue5 . "',
                                                            status='1',
                                                            company_id='" . $this->arrUser['company_id'] . "',
                                                            user_id='" . $this->arrUser['id'] . "',
                                                            AddedBy='" . $this->arrUser['id'] . "',
                                                            AddedOn='" . current_date . "',
                                                            DM_check=1,
                                                            DM_file='" . $DM_file . "'";

                                    // echo $Sql; exit;
                                    $RS = $this->Conn->Execute($Sql);

                                    $last_insert_id = $this->Conn->Insert_ID();

                                    if ($last_insert_id > 0) {
                                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . '' . "\n";
                                        $success_counter++;

                                        if ($is_primary > 0) {

                                            $CRMPrimarydepot_sql_total = "SELECT  c.id as primary_depot_id
                                                                                     FROM alt_depot c
                                                                                     LEFT JOIN company on company.id=c.company_id
                                                                                     where c.acc_id='" . $crm_id . "' AND c.module_type='1' AND c.is_primary='1' AND c.status='1' AND
                                                                                          (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                                                     limit 1";

                                            //echo $CRMPrimarydepot_sql_total;
                                            $CRMPrimarydepotrs_count = $this->Conn->Execute($CRMPrimarydepot_sql_total);
                                            $primary_depot_id = $CRMPrimarydepotrs_count->fields['primary_contact_id'];

                                            if ($primary_depot_id > 0) {
                                                $primarySql = "INSERT INTO alt_depot_contact
                                                                                   SET
                                                                                      acc_id='" . $crm_id . "',
                                                                                      module_type='1',
                                                                                      location_id='" . $primary_depot_id . "',
                                                                                      contact_id='" . $last_insert_id . "',
                                                                                      status='1',
                                                                                      company_id='" . $this->arrUser['company_id'] . "',
                                                                                      user_id='" . $this->arrUser['id'] . "',
                                                                                      date_created='" . current_date . "'";

                                                $this->Conn->Execute($primarySql);
                                            }
                                        }

                                    } else {
                                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Error in Database Query' . "\n";
                                        $error_counter++;
                                    }
                                } else {
                                    $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Duplicate Contact Name' . "\n";
                                    $error_counter++;
                                }
                            }
                        } else {
                            $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" . 'Previous code is not valid' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }

        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "crm") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=CRM_Contacts_import");
            $path = APP_PATH . '/upload/migration_file/CRM_Contacts/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($seg_type == "CUST") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_Contacts_import");
            $path = APP_PATH . '/upload/migration_file/Customer_Contacts/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }


    //----------------CRM Location--------------------------

    function import_CRM_Location($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"]))
            $seg_type = $input["tp"];


        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "crm") {

                $path = APP_PATH . '/upload/migration_file/CRM_Location';
                $sitepath = WEB_PATH . '/upload/migration_file/CRM_Location';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "CRM_Location/" . $file_name . '.xls';

                $new_excel = 'Location Name ' . 
                "\t" . 'CRM Previous Code' . 
                "\t" . 'Location Previous Code' . 
                "\t" . 'Address Line 1' . 
                "\t" . 'Address Line 2' . 
                "\t" . 'City' . 
                "\t" . 'County' . 
                "\t" . 'Postcode' . 
                "\t" . 'Country Code' . 
                "\t" . 'Is Primary' . 
                "\t" . 'Notes' . 
                "\t" . 'Address Type - Billing' . 
                "\t" . 'Address Type - Payment' . 
                "\t" . 'Address Type - Delivery' . 
                "\t" . 'Delivery Contact Code' . 
                "\t" . 'Monday Start Time' . 
                "\t" . 'Monday End Time' . 
                "\t" . 'Monday Comments' . 
                "\t" . 'Tuesday Start Time' . 
                "\t" . 'Tuesday End Time' . 
                "\t" . 'Tuesday Comments' . 
                "\t" . 'Wednesday Start Time' . 
                "\t" . 'Wednesday End Time' . 
                "\t" . 'Wednesday Comments' .
                "\t" . 'Thursday Start Time' . 
                "\t" . 'Thursday End Time' . 
                "\t" . 'Thursday Comments' . 
                "\t" . 'Friday Start Time' . 
                "\t" . 'Friday End Time' . 
                "\t" . 'Friday Comments' . 
                "\t" . 'Saturday Start Time' . 
                "\t" . 'Saturday End Time' . 
                "\t" . 'Saturday Comments' . 
                "\t" . 'Sunday Start Time' . 
                "\t" . 'Sunday End Time' . 
                "\t" . 'Sunday Comments' . 
                "\t" . ' Error Status' . "\n";

            } elseif ($seg_type == "CUST") {

                $path = APP_PATH . '/upload/migration_file/Customer_Location';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_Location';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_Location/" . $file_name . '.xls';

                $new_excel = 'Location Name ' . 
                "\t" . 'Customer Previous Code' . 
                "\t" . 'Location Previous Code' . 
                "\t" . 'Address Line 1' . 
                "\t" . 'Address Line 2' . 
                "\t" . 'City' . 
                "\t" . 'County' . 
                "\t" . 'Postcode' . 
                "\t" . 'Country Code' . 
                "\t" . 'Is Primary' . 
                "\t" . 'Notes' . 
                "\t" . 'Address Type - Billing' . 
                "\t" . 'Address Type - Payment' . 
                "\t" . 'Address Type - Delivery' . 
                "\t" . 'Delivery Contact Code' . 
                "\t" . 'Monday Start Time' . 
                "\t" . 'Monday End Time' . 
                "\t" . 'Monday Comments' . 
                "\t" . 'Tuesday Start Time' . 
                "\t" . 'Tuesday End Time' . 
                "\t" . 'Tuesday Comments' . 
                "\t" . 'Wednesday Start Time' . 
                "\t" . 'Wednesday End Time' . 
                "\t" . 'Wednesday Comments' . 
                "\t" . 'Thursday Start Time' . 
                "\t" . 'Thursday End Time' . 
                "\t" . 'Thursday Comments' . 
                "\t" . 'Friday Start Time' . 
                "\t" . 'Friday End Time' . 
                "\t" . 'Friday Comments' . 
                "\t" . 'Saturday Start Time' . 
                "\t" . 'Saturday End Time' . 
                "\t" . 'Saturday Comments' . 
                "\t" . 'Sunday Start Time' . 
                "\t" . 'Sunday End Time' . 
                "\t" . 'Sunday Comments' . 
                "\t" . ' Error Status' . "\n";

            }

            list($cols,) = $xlsx->dimension();

            $counter = 0;
            $primary_prev_code = array();
            $billing_prev_code = array();
            $payment_prev_code = array();


            foreach ($xlsx->rows() as $k => $a) {

                if (in_array($a[1], $primary_prev_code) && strtolower($a[9]) == 'yes') {
                    $response['ack'] = 0;
                    $response['error'] = "There should be only one Primary against each CRM, " . $a[1] . " CRM code has multiple primary.";
                    return $response;
                }

                if (in_array($a[1], $billing_prev_code) && strtolower($a[11]) == 'yes') {
                    $response['ack'] = 0;
                    $response['error'] = "There should be only one Billing Address against each CRM, " . $a[1] . " CRM code has multiple Billing Address.";
                    return $response;
                }

                if (in_array($a[1], $payment_prev_code) && strtolower($a[12]) == 'yes') {
                    $response['ack'] = 0;
                    $response['error'] = "There should be only one Payment Address against each CRM, " . $a[1] . " CRM code has multiple Payment Address.";
                    return $response;
                }

                if (strtolower($a[9]) == 'yes')
                    array_push($primary_prev_code, $a[1]);

                if (strtolower($a[11]) == 'yes')
                    array_push($billing_prev_code, $a[1]);

                if (strtolower($a[12]) == 'yes')
                    array_push($payment_prev_code, $a[1]);
            }

            foreach ($xlsx->rows() as $k => $r) {

                /*if ($counter > 0 && !empty($r)) {
                    print_r($r); print_r($r[2]);exit;
                }
                if ($counter > 1) {
                    print_r($r);exit;
                }*/
                if ($counter > 0 && array_filter($r)) { //!empty($r)  

                    $loc = $this->objGeneral->clean_single_variable($r[0]);
                    $loc_length = strlen($loc);

                    $prev_code = $this->objGeneral->clean_single_variable($r[1]);
                    $prev_code_length = strlen($prev_code);

                    $loc_code = $this->objGeneral->clean_single_variable($r[2]);
                    $loc_code_length = strlen($loc_code);

                    $address = $this->objGeneral->clean_single_variable($r[3]);
                    $address_length = strlen($address);

                    $address2 = $this->objGeneral->clean_single_variable($r[4]);
                    $address2_length = strlen($address2);

                    $city = $this->objGeneral->clean_single_variable($r[5]);
                    $city_length = strlen($city);

                    $county = $this->objGeneral->clean_single_variable($r[6]);
                    $county_length = strlen($county);

                    $postcode = $this->objGeneral->clean_single_variable($r[7]);
                    $postcode_length = strlen($postcode);

                    $country = $this->objGeneral->clean_single_variable($r[8]);
                    $country_length = strlen($country);

                    $is_primary = $this->objGeneral->clean_single_variable($r[9]);

                    if (strtolower($is_primary) == 'yes')
                        $is_primary = 1;
                    else
                        $is_primary = 0;

                    $notes = $this->objGeneral->clean_single_variable($r[10]);
                    $notes_length = strlen($notes);

                    $is_billing = $this->objGeneral->clean_single_variable($r[11]);
                    if (strtolower($is_billing) == 'yes')
                        $is_billing = 1;
                    else
                        $is_billing = 0;

                    $is_payment = $this->objGeneral->clean_single_variable($r[12]);

                    if (strtolower($is_payment) == 'yes')
                        $is_payment = 1;
                    else
                        $is_payment = 0;

                    $is_delivery = $this->objGeneral->clean_single_variable($r[13]);
                    if (strtolower($is_delivery) == 'yes')
                        $is_delivery = 1;
                    else
                        $is_delivery = 0;


                    $delivery_contact_code = $this->objGeneral->clean_single_variable($r[14]);
                    $delivery_contact_code_length = strlen($delivery_contact_code);

                    $mondayStartTime = $this->objGeneral->clean_single_variable($r[15]);
                    $mondayStartTime_length = strlen($mondayStartTime);

                    $mondayEndTime = $this->objGeneral->clean_single_variable($r[16]);
                    $mondayEndTime_length = strlen($mondayEndTime);

                    $mondaycomment = $this->objGeneral->clean_single_variable($r[17]);
                    //$mondaycomment_length = strlen($mondaycomment);

                    $tuesdayStartTime = $this->objGeneral->clean_single_variable($r[18]);
                    $tuesdayStartTime_length = strlen($tuesdayStartTime);

                    $tuesdayEndTime = $this->objGeneral->clean_single_variable($r[19]);
                    $tuesdayEndTime_length = strlen($tuesdayEndTime);

                    $tuesdaycomment = $this->objGeneral->clean_single_variable($r[20]);
                    //$tuesdaycomment_length = strlen($tuesdaycomment);

                    $wednessdayStartTime = $this->objGeneral->clean_single_variable($r[21]);
                    $wednessdayStartTime_length = strlen($wednessdayStartTime);

                    $wednessdayEndTime = $this->objGeneral->clean_single_variable($r[22]);
                    $wednessdayEndTime_length = strlen($wednessdayEndTime);

                    $wednessdaycomment = $this->objGeneral->clean_single_variable($r[23]);
                    //$wednessdaycomment_length = strlen($wednessdaycomment);

                    $thursdayStartTime = $this->objGeneral->clean_single_variable($r[24]);
                    $thursdayStartTime_length = strlen($thursdayStartTime);

                    $thursdayEndTime = $this->objGeneral->clean_single_variable($r[25]);
                    $thursdayEndTime_length = strlen($thursdayEndTime);

                    $thursdaycomment = $this->objGeneral->clean_single_variable($r[26]);
                    //$thursdaycomment_length = strlen($thursdaycomment);

                    $fridayStartTime = $this->objGeneral->clean_single_variable($r[27]);
                    $fridayStartTime_length = strlen($fridayStartTime);

                    $fridayEndTime = $this->objGeneral->clean_single_variable($r[28]);
                    $fridayEndTime_length = strlen($fridayEndTime);

                    $fridaycomment = $this->objGeneral->clean_single_variable($r[29]);
                    //$fridaycomment_length = strlen($fridaycomment);

                    $saturdayStartTime = $this->objGeneral->clean_single_variable($r[30]);
                    $saturdayStartTime_length = strlen($saturdayStartTime);

                    $saturdayEndTime = $this->objGeneral->clean_single_variable($r[31]);
                    $saturdayEndTime_length = strlen($saturdayEndTime);

                    $saturdaycomment = $this->objGeneral->clean_single_variable($r[32]);
                    //$saturdaycomment_length = strlen($saturdaycomment);

                    $sundayStartTime = $this->objGeneral->clean_single_variable($r[33]);
                    $sundayStartTime_length = strlen($sundayStartTime);

                    $sundayEndTime = $this->objGeneral->clean_single_variable($r[34]);
                    $sundayEndTime_length = strlen($sundayEndTime);

                    $sundaycomment = $this->objGeneral->clean_single_variable($r[35]);
                    //$sundaycomment_length = strlen($sundaycomment);


                    $country_id = $this->get_data_by_id('country', 'iso', $country);

                    if ($loc_length > 150) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Location Name Length Exceeds Than Limit 150' . "\n";
                        $error_counter++;

                    } elseif ($loc_length == 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Location Name is empty' . "\n";
                        $error_counter++;

                    } elseif ($prev_code_length > 25) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($loc_code > 25) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Location Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($address_length > 255) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Address 1 Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($address2_length > 255) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Address 2 Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($city_length > 150) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'City Length Exceeds Than Limit 150' . "\n";
                        $error_counter++;

                    } elseif ($county_length > 150) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'County Length Exceeds Than Limit 150' . "\n";
                        $error_counter++;

                    } elseif ($postcode_length > 50 || $postcode_length == 0) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Postcode Length Exceeds Than Limit 50 or Postcode is empty' . "\n";
                        $error_counter++;

                    } elseif ($country_length > 0 && $country_id == "") {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Country is not valid' . "\n";
                        $error_counter++;

                    } elseif ($notes_length > 255) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Notes Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($delivery_contact_code_length > 25) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Delivery Contact Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($mondayStartTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Monday Start Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($tuesdayStartTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Tuesday Start Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($wednessdayStartTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Wednessday Start Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($thursdayStartTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Thursday Start Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($fridayStartTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Friday Start Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($saturdayStartTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Saturday Start Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($sundayStartTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Sunday Start Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($mondayEndTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Monday EndEnd Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($tuesdayEndTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Tuesday End Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($wednessdayEndTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Wednessday End Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($thursdayEndTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Thursday End Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($fridayEndTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Friday End Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($saturdayEndTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Saturday End Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } elseif ($sundayEndTime_length > 20) {

                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Sunday End Time Exceeds than limit 20' . "\n";
                        $error_counter++;

                    } else {

                        $CRM_sql_total = "SELECT  count(c.id) as total,c.id as crm_id	FROM crm c
                                          LEFT JOIN company on company.id=c.company_id
                                          where c.prev_code='" . $prev_code . "'AND
                                                (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                          limit 1";
                        //echo $SRM_sql_total;
                        $crm_rs_count = $this->Conn->Execute($CRM_sql_total);
                        $crm_total = $crm_rs_count->fields['total'];
                        $crm_id = $crm_rs_count->fields['crm_id'];

                        if ($crm_total > 0) {

                            $CRMcontact_sql_total = "SELECT  c.id as delivery_contact_id
                                                     FROM alt_contact c
                                                     LEFT JOIN company on company.id=c.company_id
                                                     where c.contact_code='" . $delivery_contact_code . "' AND c.acc_id='" . $crm_id . "' AND c.module_type='1' AND c.status='1' AND
                                                          (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                     limit 1";

                            //echo $CRMcontact_sql_total;
                            $CRMcontactrs_count = $this->Conn->Execute($CRMcontact_sql_total);
                            $delivery_contact_id = $CRMcontactrs_count->fields['delivery_contact_id'];

                            $data_pass_primary = "  tst.is_primary='1' and tst.acc_id='" . $crm_id . "' and tst.module_type='1' ";
                            $total_primary = $this->objGeneral->count_duplicate_in_sql('alt_depot', $data_pass_primary, $this->arrUser['company_id']);

                            if ($is_primary == 1 && $total_primary > 0) {

                                $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Primary already set.' . "\n";
                                $error_counter++;

                            } else {

                                $data_pass_billing = "  tst.is_billing_address='1' and tst.acc_id='" . $crm_id . "' and tst.module_type='1' ";
                                $total_billing = $this->objGeneral->count_duplicate_in_sql('alt_depot', $data_pass_billing, $this->arrUser['company_id']);

                                if ($is_billing == 1 && $total_billing > 0) {

                                    $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Address Type Billing is already set.' . "\n";
                                    $error_counter++;

                                } else {
                                    $data_pass_payment = "  tst.is_invoice_address='1' and tst.acc_id='" . $crm_id . "' and tst.module_type='1'";

                                    $total_payment = $this->objGeneral->count_duplicate_in_sql('alt_depot', $data_pass_payment, $this->arrUser['company_id']);

                                    if ($is_payment == 1 && $total_payment > 0) {

                                        $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Address Type Payment is already set.' . "\n";
                                        $error_counter++;

                                    } else {

                                        $data_pass = "  tst.depot='" . $loc . "' and tst.acc_id='" . $crm_id . "' and tst.module_type='1'";
                                        $total = $this->objGeneral->count_duplicate_in_sql('alt_depot', $data_pass, $this->arrUser['company_id']);

                                        if ($total == 0) {

                                            $Sql = "INSERT INTO alt_depot
                                                                  SET
                                                                      depot='" . $loc . "',
                                                                      locCode='" . $loc_code . "',
                                                                      module_type='1',
                                                                      address='" . $address . "',
                                                                      address_2='" . $address2 . "',
                                                                      city='" . $city . "',
                                                                      county='" . $county . "',
                                                                      country='" . $country_id . "',
                                                                      postcode='" . $postcode . "',
                                                                      acc_id='" . $crm_id . "',
                                                                      alt_contact_id='" . $delivery_contact_id . "',
                                                                      booking_instructions='" . $notes . "',
                                                                      is_primary='" . $is_primary . "',
                                                                      is_billing_address='" . $is_billing . "',
                                                                      is_delivery_collection_address='" . $is_delivery . "',
                                                                      is_invoice_address='" . $is_payment . "',
                                                                      monday_start_time='" . $mondayStartTime . "',
                                                                      monday_end_time='" . $mondayEndTime . "',
                                                                      monday_notes='" . $mondaycomment . "',
                                                                      tuesday_start_time='" . $tuesdayStartTime . "',
                                                                      tuesday_end_time='" . $tuesdayEndTime . "',
                                                                      tuesday_notes='" . $tuesdaycomment . "',
                                                                      wednesday_start_time='" . $wednessdayStartTime . "',
                                                                      wednesday_end_time='" . $wednessdayEndTime . "',
                                                                      wednesday_notes='" . $wednessdaycomment . "',
                                                                      thursday_start_time='" . $thursdayStartTime . "',
                                                                      thursday_end_time='" . $thursdayEndTime . "',
                                                                      thursday_notes='" . $thursdaycomment . "',
                                                                      friday_start_time='" . $fridayStartTime . "',
                                                                      friday_end_time='" . $fridayEndTime . "',
                                                                      friday_notes='" . $fridaycomment . "',
                                                                      saturday_start_time='" . $saturdayStartTime . "',
                                                                      saturday_end_time='" . $saturdayEndTime . "',
                                                                      saturday_notes='" . $saturdaycomment . "',
                                                                      sunday_start_time='" . $sundayStartTime . "',
                                                                      sunday_end_time='" . $sundayEndTime . "',
                                                                      sunday_notes='" . $sundaycomment . "',
                                                                      status='1',
                                                                      company_id='" . $this->arrUser['company_id'] . "',
                                                                      user_id='" . $this->arrUser['id'] . "',
                                                                      AddedBy='" . $this->arrUser['id'] . "',
                                                                      AddedOn='" . current_date . "',
                                                                      DM_check=1,
                                                                      DM_file='" . $DM_file . "'";

                                            //echo $Sql; exit;

                                            $RS = $this->Conn->Execute($Sql);
                                            $loc_last_insert_id = $this->Conn->Insert_ID();

                                            if ($loc_last_insert_id > 0) {

                                                if ($is_primary > 0) {

                                                    $CRMPrimaryContact_sql_total = "SELECT  c.id as primary_contact_id
                                                                                     FROM alt_contact c
                                                                                     LEFT JOIN company on company.id=c.company_id
                                                                                     where c.acc_id='" . $crm_id . "' AND c.module_type='1' AND c.is_primary='1' AND c.status='1' AND
                                                                                          (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                                                     limit 1";

                                                    //echo $CRMPrimaryContact_sql_total;
                                                    $CRMPrimaryContactrs_count = $this->Conn->Execute($CRMPrimaryContact_sql_total);
                                                    $primary_contact_id = $CRMPrimaryContactrs_count->fields['primary_contact_id'];

                                                    if ($primary_contact_id > 0) {
                                                        $primarySql = "INSERT INTO alt_depot_contact
                                                                                   SET
                                                                                      acc_id='" . $crm_id . "',
                                                                                      module_type='1',
                                                                                      location_id='" . $loc_last_insert_id . "',
                                                                                      contact_id='" . $primary_contact_id . "',
                                                                                      status='1',
                                                                                      company_id='" . $this->arrUser['company_id'] . "',
                                                                                      user_id='" . $this->arrUser['id'] . "',
                                                                                      date_created='" . current_date . "'";

                                                        $this->Conn->Execute($primarySql);
                                                    }
                                                }

                                                $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . '' . "\n";

                                            } else {
                                                $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Error in Database Query' . "\n";
                                                $error_counter++;
                                            }

                                        } else {

                                            $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Duplicate Location Name' . "\n";
                                            $error_counter++;
                                        }
                                    }
                                }
                            }
                        } else {

                            $new_excel .= $r[0] . "\t" . $r[1] . "\t" . $r[2] . "\t" . $r[3] . "\t" . $r[4] . "\t" . $r[5] . "\t" . $r[6] . "\t" . $r[7] . "\t" . $r[8] . "\t" . $r[9] . "\t" . $r[10] . "\t" . $r[11] . "\t" . $r[12] . "\t" . $r[13] . "\t" . $r[14] . "\t" . $r[15] . "\t" . $r[16] . "\t" . $r[17] . "\t" . $r[18] . "\t" . $r[19] . "\t" . $r[20] . "\t" . $r[21] . "\t" .  $r[22] . "\t" .  $r[23] . "\t" .  $r[24] . "\t" .  $r[25] . "\t" .  $r[26] . "\t" .  $r[27] . "\t" .  $r[28] . "\t" .  $r[29] . "\t" .  $r[30] . "\t" .  $r[31] . "\t" .  $r[32] . "\t" .  $r[33] . "\t" .  $r[34] . "\t" .  $r[35] . "\t" . 'Previous code is not valid' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;

            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "crm") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=CRM_Location_import");
            $path = APP_PATH . '/upload/migration_file/CRM_Location/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($seg_type == "CUST") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_Location_import");
            $path = APP_PATH . '/upload/migration_file/Customer_Location/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }


    //----------------CRM Contact Location Mapping ---------

    function import_CRM_ContactLocationMap($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"]))
            $seg_type = $input["tp"];


        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "crm") {

                $path = APP_PATH . '/upload/migration_file/CRM_ContactLocationMap';
                $sitepath = WEB_PATH . '/upload/migration_file/CRM_ContactLocationMap';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "CRM_ContactLocationMap/" . $file_name . '.xls';

                $new_excel = 'CRM Previous Code' . "\t" . 'Location Previous Code' . "\t" . 'Contact Previous Code' . "\t" . ' Error Status' . "\n";

            } elseif ($seg_type == "CUST") {

                $path = APP_PATH . '/upload/migration_file/Customer_ContactLocationMap';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_ContactLocationMap';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_ContactLocationMap/" . $file_name . '.xls';

                $new_excel = 'Customer Previous Code' . "\t" . 'Location Previous Code' . "\t" . 'Contact Previous Code' . "\t" . ' Error Status' . "\n";

            }

            list($cols,) = $xlsx->dimension();

            $counter = 0;

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0]) && !empty($r[1]) && !empty($r[2])) {

                    $prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prev_code_length = strlen($prev_code);

                    $loc_code = $this->objGeneral->clean_single_variable($r[1]);
                    $loc_code_length = strlen($loc_code);

                    $contact_code = $this->objGeneral->clean_single_variable($r[2]);
                    $contact_code_length = strlen($contact_code);

                    if ($prev_code_length > 25) {

                        $new_excel .= $prev_code . "\t" . $loc_code . "\t" . $contact_code . "\t" . 'Previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($prev_code_length == 0) {

                        $new_excel .= $prev_code . "\t" . $loc_code . "\t" . $contact_code . "\t" . 'Previous Code is empty' . "\n";
                        $error_counter++;

                    } elseif ($loc_code_length > 25) {

                        $new_excel .= $prev_code . "\t" . $loc_code . "\t" . $contact_code . "\t" . 'Location Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($loc_code_length == 0) {

                        $new_excel .= $prev_code . "\t" . $loc_code . "\t" . $contact_code . "\t" . 'Location Code is empty' . "\n";
                        $error_counter++;

                    } elseif ($contact_code_length > 25) {

                        $new_excel .= $prev_code . "\t" . $loc_code . "\t" . $contact_code . "\t" . 'Contact Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($contact_code_length == 0) {

                        $new_excel .= $prev_code . "\t" . $loc_code . "\t" . $contact_code . "\t" . 'Contact Code is empty' . "\n";
                        $error_counter++;

                    } else {

                        $CRM_sql_total = "SELECT  count(c.id) as total,c.id as crm_id	FROM crm c
                                          LEFT JOIN company on company.id=c.company_id
                                          where c.prev_code='" . $prev_code . "'AND
                                                (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                          limit 1";
                        //echo $SRM_sql_total;
                        $crm_rs_count = $this->Conn->Execute($CRM_sql_total);
                        $crm_total = $crm_rs_count->fields['total'];
                        $crm_id = $crm_rs_count->fields['crm_id'];

                        if ($crm_total > 0) {

                            $CRMLocation_sql_total = "SELECT  d.id as location_id
                                                      FROM alt_depot d
                                                      LEFT JOIN company on company.id=d.company_id
                                                      where d.locCode='" . $loc_code . "' AND d.acc_id='" . $crm_id . "' AND d.module_type='1' AND d.status='1' AND
                                                           (d.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                      limit 1";

                            //echo $CRMLocation_sql_total;
                            $CRMLocationrs_count = $this->Conn->Execute($CRMLocation_sql_total);
                            $Location_id = $CRMLocationrs_count->fields['location_id'];

                            if ($Location_id > 0) {

                                $CRMcontact_sql_total = "SELECT  c.id as contact_id
                                                     FROM alt_contact c
                                                     LEFT JOIN company on company.id=c.company_id
                                                     where c.contact_code='" . $contact_code . "' AND c.acc_id='" . $crm_id . "' AND c.module_type='1' AND c.status='1' AND
                                                          (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                                     limit 1";

                                //echo $CRMcontact_sql_total;
                                $CRMcontactrs_count = $this->Conn->Execute($CRMcontact_sql_total);
                                $contact_id = $CRMcontactrs_count->fields['contact_id'];

                                if ($contact_id > 0) {

                                    $data_pass = "  tst.acc_id='" . $crm_id . "' and tst.module_type='1' and tst.location_id='" . $Location_id . "' and tst.contact_id='" . $contact_id . "'";
                                    $total = $this->objGeneral->count_duplicate_in_sql('alt_depot_contact', $data_pass, $this->arrUser['company_id']);

                                    if ($total == 0) {
                                        $Sql2 = "INSERT INTO alt_depot_contact
                                                                       SET
                                                                          acc_id='" . $crm_id . "',
                                                                          module_type='1',
                                                                          location_id='" . $Location_id . "',
                                                                          contact_id='" . $contact_id . "',
                                                                          status='1',
                                                                          company_id='" . $this->arrUser['company_id'] . "',
                                                                          user_id='" . $this->arrUser['id'] . "',
                                                                          date_created='" . current_date . "'";

                                        $RS = $this->Conn->Execute($Sql2);

                                        $new_excel .= $prev_code . "\t" . $loc_code . "\t" . $contact_code . "\t" . '' . "\n";

                                    } else {
                                        $new_excel .= $prev_code . "\t" . $loc_code . "\t" . $contact_code . "\t" . 'Duplicate Link between Contact and Location already exists.' . "\n";
                                        $error_counter++;
                                    }

                                } else {

                                    $new_excel .= $prev_code . "\t" . $loc_code . "\t" . $contact_code . "\t" . 'Contact Previous code is not valid' . "\n";
                                    $error_counter++;
                                }

                            } else {

                                $new_excel .= $prev_code . "\t" . $loc_code . "\t" . $contact_code . "\t" . 'Location Previous code is not valid' . "\n";
                                $error_counter++;
                            }

                        } else {

                            $new_excel .= $prev_code . "\t" . $loc_code . "\t" . $contact_code . "\t" . 'Previous code is not valid' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "crm") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=CRM_ContactLocationMap_import");
            $path = APP_PATH . '/upload/migration_file/CRM_ContactLocationMap/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($seg_type == "CUST") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_ContactLocationMap_import");
            $path = APP_PATH . '/upload/migration_file/Customer_ContactLocationMap/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }


    //----------------CRM Social Media not using any more---

    function import_CRM_social_media($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"])) {
            $seg_type = $input["tp"];

            if ($seg_type == "crm") {

            } elseif ($seg_type == "CUST") {

            }
        }


        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "crm") {

                $path = APP_PATH . '/upload/migration_file/CRM_Socialmedia';
                $sitepath = WEB_PATH . '/upload/migration_file/CRM_Socialmedia';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "CRM_Socialmedia/" . $file_name . '.xls';

                $new_excel = 'CRM Previous Code' . "\t" . 'Social Media' . "\t" . 'Address' . "\t" . ' Error Status' . "\n";

            } elseif ($seg_type == "CUST") {

                $path = APP_PATH . '/upload/migration_file/Customer_Socialmedia';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_Socialmedia';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_Socialmedia/" . $file_name . '.xls';

                $new_excel = 'Customer Previous Code' . "\t" . 'Social Media' . "\t" . 'Address' . "\t" . ' Error Status' . "\n";
            }

            list($cols,) = $xlsx->dimension();
            $Sql = "INSERT INTO crm_social_media (crm_id, media_id,address,company_id,user_id,status,date_created,AddedBy,AddedOn,DM_check,DM_file) VALUES ";

            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prev_code_length = strlen($prev_code);

                    $media = $this->objGeneral->clean_single_variable($r[1]);
                    $media_length = strlen($media);

                    $media_id = $this->get_data_by_id('ref_social_media', 'name', $media);

                    $address = $this->objGeneral->clean_single_variable($r[2]);
                    $address_length = strlen($address);

                    if ($prev_code_length > 25) {

                        $new_excel .= $prev_code . "\t" . $media . "\t" . $address . "\t" . 'Previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($media_length > 250 || $media_length < 1) {

                        $new_excel .= $prev_code . "\t" . $media . "\t" . $address . "\t" . 'Media is invalid' . "\n";
                        $error_counter++;

                    } elseif ($address_length > 255) {

                        $new_excel .= $prev_code . "\t" . $media . "\t" . $address . "\t" . 'Address Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } else {


                        if ($media_length > 0 && $media_id == "") {

                            $Sql2 = "INSERT INTO ref_social_media (name, company_id, user_id,status,date_created) VALUES (  '" . $media . "','" . $this->arrUser['company_id'] . "','" . $this->arrUser['id'] . "', 1,'" . current_date . "')";

                            $RS2 = $this->Conn->Execute($Sql2);
                            $media_id = $this->Conn->Insert_ID();
                        }


                        $CRM_sql_total = "SELECT  count(c.id) as total,c.id as crm_id	FROM crm c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.prev_code='" . $prev_code . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                        //echo $SRM_sql_total;
                        $crm_rs_count = $this->Conn->Execute($CRM_sql_total);
                        $crm_total = $crm_rs_count->fields['total'];
                        $crm_id = $crm_rs_count->fields['crm_id'];

                        if ($crm_total > 0) {

                            $Sql .= "(  '" . $crm_id . "','" . $media_id . "','" . $address . "','" . $this->arrUser['company_id'] . "'," . "'" . $this->arrUser['id'] . "', 1,'" . current_date . "','" . $this->arrUser['id'] . "','" . current_date . "','1','" . $DM_file . "')  , ";
                            $new_excel .= $prev_code . "\t" . $media . "\t" . $address . "\t" . '' . "\n";
                            $success_counter++;

                        } else {
                            $new_excel .= $prev_code . "\t" . $media . "\t" . $address . "\t" . 'Previous code is not valid' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;

            }

            $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
            /*echo $Sql;
            exit;*/
            $RS = $this->Conn->Execute($Sql);

        }


        if ($error_counter == 0 && $this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "crm") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=CRM_Socialmedia_import");
            $path = APP_PATH . '/upload/migration_file/CRM_Socialmedia/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($seg_type == "CUST") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_Socialmedia_import");
            $path = APP_PATH . '/upload/migration_file/Customer_Socialmedia/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }

    //----------------CRM Competitors-----------------------

    function import_CRM_Competitors($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"]))
            $seg_type = $input["tp"];


        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "crm") {

                $path = APP_PATH . '/upload/migration_file/CRM_Competitors';
                $sitepath = WEB_PATH . '/upload/migration_file/CRM_Competitors';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "CRM_Competitors/" . $file_name . '.xls';

                $new_excel = 'CRM Previous Code' . "\t" . 'Supplier Name' . "\t" . 'Category' . "\t" . 'Brand' . "\t" . 'Name' . "\t" . 'Unit of Measure' . "\t" . 'Purchase Price' . "\t" . 'Wholesale Price' . "\t" . 'Volume' . "\t" . 'Volume unit' . "\t" . 'Order Frequency' . "\t" . 'Order Frequency rate' . "\t" . 'Notes' . "\t" . ' Error Status' . "\n";

            } elseif ($seg_type == "CUST") {

                $path = APP_PATH . '/upload/migration_file/Customer_Competitors';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_Competitors';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_Competitors/" . $file_name . '.xls';

                $new_excel = 'Customer Previous Code' . "\t" . 'Supplier Name' . "\t" . 'Category' . "\t" . 'Brand' . "\t" . 'Name' . "\t" . 'Unit of Measure' . "\t" . 'Purchase Price' . "\t" . 'Wholesale Price' . "\t" . 'Volume' . "\t" . 'Volume unit' . "\t" . 'Order Frequency' . "\t" . 'Order Frequency rate' . "\t" . 'Notes' . "\t" . ' Error Status' . "\n";

            }

            list($cols,) = $xlsx->dimension();
            $counter = 0;

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prev_code_length = strlen($prev_code);

                    /*$cat_type = $this->objGeneral->clean_single_variable($r[1]);
                    $cat_type_length = strlen($cat_type);*/

                    $supplier = $this->objGeneral->clean_single_variable($r[1]);
                    $supplier_length = strlen($supplier);

                    $category = $this->objGeneral->clean_single_variable($r[2]);
                    $category_length = strlen($category);

                    $brand = $this->objGeneral->clean_single_variable($r[3]);
                    $brand_length = strlen($brand);

                    $item_name = $this->objGeneral->clean_single_variable($r[4]);
                    $item_name_length = strlen($item_name);

                    $unit_name = $this->objGeneral->clean_single_variable($r[5]);
                    $unit_name_length = strlen($unit_name);

                    $pur_price = $this->objGeneral->clean_single_variable($r[6]);
                    $pur_price_length = strlen($pur_price);

                    $wholesale_price = $this->objGeneral->clean_single_variable($r[7]);
                    $wholesale_price_length = strlen($wholesale_price);

                    $volume = $this->objGeneral->clean_single_variable($r[8]);
                    $volume_length = strlen($volume);

                    $volume_unit = $this->objGeneral->clean_single_variable($r[9]);
                    $volume_unit_length = strlen($volume_unit);

                    $order_freq = $this->objGeneral->clean_single_variable($r[10]);

                    $order_freq_rate = $this->objGeneral->clean_single_variable($r[11]);
                    $order_freq_rate_length = strlen($order_freq_rate);

                    $comment = $this->objGeneral->clean_single_variable($r[12]);

                    $unit_id = $this->get_data_by_id('units_of_measure', 'title', $unit_name);
                    $volume_unit_id = $this->get_data_by_id('units_of_measure', 'title', $volume_unit);
                    //$lead_id = $this->get_data_by_id('crm_competitor_volume', 'title', $order_freq_rate);
                    $cat_id = $this->get_data_by_id('category', 'name', $category);


                    if ($prev_code_length == 0 || $prev_code_length > 25) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Previous Code Length Exceeds Than Limit 25 or Previous Code is Empty' . "\n";
                        $error_counter++;

                    } elseif ($supplier_length > 50) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Supplier Name Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($category_length == 0) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Category is Empty' . "\n";
                        $error_counter++;

                    } elseif ($brand_length > 50) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Brand Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($item_name_length > 255) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Name Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($pur_price_length > 20) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Purchase Price Length Exceeds Than Limit 20' . "\n";
                        $error_counter++;

                    } elseif ($wholesale_price_length > 250) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Wholesale Price Length Exceeds Than Limit 250' . "\n";
                        $error_counter++;

                    } elseif ($volume_length > 30) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Volume Length Exceeds Than Limit 250' . "\n";
                        $error_counter++;

                    } elseif ($cat_id == 0) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Category is Invalid' . "\n";
                        $error_counter++;

                    } elseif ($unit_id == 0 && $unit_name_length > 0) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'U.O.M  is invalid' . "\n";
                        $error_counter++;

                    } elseif ($volume_unit_id == 0 && $volume_unit_length > 0) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Volume Unit is invalid' . "\n";
                        $error_counter++;

                    } elseif (($order_freq_rate != 1 && $order_freq_rate != 2 && $order_freq_rate != 3 && $order_freq_rate != 4) && $order_freq_rate_length > 0) {

                        $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Order Frequency is invalid' . "\n";
                        $error_counter++;

                    } else {

                        $CRM_sql_total = "SELECT  count(c.id) as total,c.id as crm_id
                                          FROM crm c
                                          LEFT JOIN company on company.id=c.company_id
                                          where c.prev_code='" . $prev_code . "' AND
                                                (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                          limit 1";

                        $crm_rs_count = $this->Conn->Execute($CRM_sql_total);
                        $crm_total = $crm_rs_count->fields['total'];
                        $crm_id = $crm_rs_count->fields['crm_id'];

                        //$todaydate = date("Y/m/d");

                        if ($crm_total > 0) {

                            $Sql = "INSERT INTO crm_competitor
                                                SET
                                                    crm_id='" . $crm_id . "',
                                                    category_id='" . $cat_id . "',
                                                    category_type='1',
                                                    brand='" . $brand . "',
                                                    unit_id='" . $unit_id . "',
                                                    price='" . $pur_price . "',
                                                    sale_price='" . $wholesale_price . "',
                                                    volume='" . $volume . "',
                                                    vol_unit='" . $volume_unit_id . "',
                                                    note='" . $comment . "',
                                                    item_notes='" . $item_name . "',
                                                    lead_time='" . $order_freq . "',
                                                    lead_type='" . $order_freq_rate . "',
                                                    status='1',
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    created_date='" . current_date . "',
                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                    AddedOn='" . current_date . "',
                                                    DM_check=1,
                                                    DM_file='" . $DM_file . "'";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . '' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {
                            $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Previous code is not valid' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "crm") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=CRM_Competitors_import");
            $path = APP_PATH . '/upload/migration_file/CRM_Competitors/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($seg_type == "CUST") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_Competitors_import");
            $path = APP_PATH . '/upload/migration_file/Customer_Competitors/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }

    //----------------CRM Price Offer-----------------------

    function import_CRM_PriceOffer($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"]))
            $seg_type = $input["tp"];

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "crm") {

                $path = APP_PATH . '/upload/migration_file/CRM_PriceOffer';
                $sitepath = WEB_PATH . '/upload/migration_file/CRM_PriceOffer';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "CRM_PriceOffer/" . $file_name . '.xls';

                $new_excel = 'Price Offer Previous Code' . "\t" . 'CRM Previous Code' . "\t" . 'Item Previous Code' . "\t" . 'Unit of Measure' . "\t" . 'Currency Code' . "\t" . 'Price' . "\t" . 'Offered By Employee Previous Code' . "\t" . 'Offer Method' . "\t" . 'Min. Order Qty' . "\t" . 'Max. Order Qty' . "\t" . 'Start Date (DD/MM/YYYY)' . "\t" . 'End Date (DD/MM/YYYY)' . "\t" . ' Error Status' . "\n";

            } elseif ($seg_type == "CUST") {

                $path = APP_PATH . '/upload/migration_file/Customer_PriceOffer';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_PriceOffer';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_PriceOffer/" . $file_name . '.xls';

                $new_excel = 'Price Offer Previous Code' . "\t" . 'Customer Previous Code' . "\t" . 'Item Previous Code' . "\t" . 'Unit of Measure' . "\t" . 'Currency Code' . "\t" . 'Price' . "\t" . 'Offered By Employee Previous Code' . "\t" . 'Offer Method' . "\t" . 'Min. Order Qty' . "\t" . 'Max. Order Qty' . "\t" . 'Start Date (DD/MM/YYYY)' . "\t" . 'End Date (DD/MM/YYYY)' . "\t" . ' Error Status' . "\n";

            }

            list($cols,) = $xlsx->dimension();
            $counter = 0;

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $priceoffer_prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $priceoffer_prev_code_length = strlen($priceoffer_prev_code);

                    $crm_prev_code = $this->objGeneral->clean_single_variable($r[1]);
                    $crm_prev_code_length = strlen($crm_prev_code);

                    $item_prev_code = $this->objGeneral->clean_single_variable($r[2]);
                    $item_prev_code_length = strlen($item_prev_code);

                    $uom = $this->objGeneral->clean_single_variable($r[3]);
                    $uom_length = strlen($uom);

                    $currency = $this->objGeneral->clean_single_variable($r[4]);
                    $currency_length = strlen($currency);

                    $price = $this->objGeneral->clean_single_variable($r[5]);
                    $price_length = strlen($price);

                    $emp_prev_code = $this->objGeneral->clean_single_variable($r[6]);
                    $emp_prev_code_length = strlen($emp_prev_code);

                    $offer_method = $this->objGeneral->clean_single_variable($r[7]);
                    $offer_method_length = strlen($offer_method);

                    $min_order_qty = $this->objGeneral->clean_single_variable($r[8]);
                    $min_order_qty_length = strlen($min_order_qty);

                    $max_order_qty = $this->objGeneral->clean_single_variable($r[9]);
                    $max_order_qty_length = strlen($max_order_qty);

                    $start_date = $this->objGeneral->clean_single_variable($r[10]);
                    $start_date_length = strlen($start_date);

                    $end_date = $this->objGeneral->clean_single_variable($r[11]);
                    $end_date_length = strlen($end_date);

                    /*$unit_id = $this->get_data_by_id('units_of_measure', 'title', $unit_name);
                    $volume_unit_id = $this->get_data_by_id('units_of_measure', 'title', $volume_unit);
                    //$lead_id = $this->get_data_by_id('crm_competitor_volume', 'title', $order_freq_rate);
                    $cat_id = $this->get_data_by_id('category', 'name', $category);*/


                    if ($priceoffer_prev_code_length == 0 || $priceoffer_prev_code_length > 25) {

                        $new_excel .= $priceoffer_prev_code . "\t" . $crm_prev_code . "\t" . $item_prev_code . "\t" . $uom . "\t" . $currency . "\t" .
                            $price . "\t" . $emp_prev_code . "\t" . $offer_method . "\t" . $min_order_qty . "\t" . $max_order_qty . "\t" .
                            $start_date . "\t" . $end_date . "\t" . 'Price Offer Previous Code Length Exceeds Than Limit 25 or Previous Code is Empty' . "\n";
                        $error_counter++;

                    } elseif ($crm_prev_code_length == 0 || $crm_prev_code_length > 25) {

                        $new_excel .= $priceoffer_prev_code . "\t" . $crm_prev_code . "\t" . $item_prev_code . "\t" . $uom . "\t" . $currency . "\t" .
                            $price . "\t" . $emp_prev_code . "\t" . $offer_method . "\t" . $min_order_qty . "\t" . $max_order_qty . "\t" .
                            $start_date . "\t" . $end_date . "\t" . 'CRM Previous Code Length Exceeds Than Limit 25 or CRM Previous Code is Empty' . "\n";
                        $error_counter++;

                    } elseif ($item_prev_code == 0 || $item_prev_code > 25) {

                        $new_excel .= $priceoffer_prev_code . "\t" . $crm_prev_code . "\t" . $item_prev_code . "\t" . $uom . "\t" . $currency . "\t" .
                            $price . "\t" . $emp_prev_code . "\t" . $offer_method . "\t" . $min_order_qty . "\t" . $max_order_qty . "\t" .
                            $start_date . "\t" . $end_date . "\t" . 'Item Previous Code Length Exceeds Than Limit 25 or Item Previous Code is Empty' . "\n";
                        $error_counter++;

                    } elseif ($emp_prev_code_length == 0 || $emp_prev_code_length > 25) {

                        $new_excel .= $priceoffer_prev_code . "\t" . $crm_prev_code . "\t" . $item_prev_code . "\t" . $uom . "\t" . $currency . "\t" .
                            $price . "\t" . $emp_prev_code . "\t" . $offer_method . "\t" . $min_order_qty . "\t" . $max_order_qty . "\t" .
                            $start_date . "\t" . $end_date . "\t" . 'Employee Previous Code Length Exceeds Than Limit 25 or Employee Previous Code is Empty' . "\n";
                        $error_counter++;

                    } else {

                        $CRM_sql_total = "SELECT  count(c.id) as total,c.id as crm_id
                                          FROM crm c
                                          LEFT JOIN company on company.id=c.company_id
                                          where c.prev_code='" . $crm_prev_code . "' AND
                                                (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                          limit 1";

                        $crm_rs_count = $this->Conn->Execute($CRM_sql_total);
                        $crm_total = $crm_rs_count->fields['total'];
                        $crm_id = $crm_rs_count->fields['crm_id'];

                        //$todaydate = date("Y/m/d");

                        /*if ($crm_total > 0) {

                            $Sql = "INSERT INTO crm_competitor
                                                SET
                                                    crm_id='" . $crm_id . "',
                                                    category_id='" . $cat_id . "',
                                                    category_type='1',
                                                    brand='" . $brand . "',
                                                    unit_id='" . $unit_id . "',
                                                    price='" . $pur_price . "',
                                                    sale_price='" . $wholesale_price . "',
                                                    volume='" . $volume . "',
                                                    vol_unit='" . $volume_unit_id . "',
                                                    note='" . $comment . "',
                                                    item_notes='" . $item_name . "',
                                                    lead_time='" . $order_freq . "',
                                                    lead_type='" . $order_freq_rate . "',
                                                    status='1',
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    created_date='" . current_date . "',
                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                    AddedOn='" . current_date . "',
                                                    DM_check=1,
                                                    DM_file='" . $DM_file . "'";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . '' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {
                            $new_excel .= $prev_code . "\t" . $supplier . "\t" . $category . "\t" . $brand . "\t" . $item_name . "\t" . $unit_name . "\t" . $pur_price . "\t" . $wholesale_price . "\t" . $volume . "\t" . $volume_unit . "\t" . $order_freq . "\t" . $order_freq_rate . "\t" . $comment . "\t" . 'Previous code is not valid' . "\n";
                            $error_counter++;
                        }*/
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "crm") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=CRM_PriceOffer_import");
            $path = APP_PATH . '/upload/migration_file/CRM_PriceOffer/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($seg_type == "CUST") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_PriceOffer_import");
            $path = APP_PATH . '/upload/migration_file/Customer_PriceOffer/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }

    //----------------CRM Promotion-------------------------

    function import_CRM_Promotion($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"])) {
            $seg_type = $input["tp"];
        }


        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "crm") {

                $path = APP_PATH . '/upload/migration_file/CRM_Promotion';
                $sitepath = WEB_PATH . '/upload/migration_file/CRM_Promotion';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "CRM_Promotion/" . $file_name . '.xls';

                $new_excel = 'CRM Previous Code' . "\t" . 'Name' . "\t" . 'Discount Type ' . "\t" . 'Start Date (DD/MM/YYYY)' . "\t" . 'End Date (DD/MM/YYYY)' . "\t" . 'Description' . "\t" . 'Discount' . "\t" . ' Error Status' . "\n";

            } elseif ($seg_type == "CUST") {

                $path = APP_PATH . '/upload/migration_file/Customer_Promotion';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_Promotion';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_Promotion/" . $file_name . '.xls';

                $new_excel = 'Customer Previous Code' . "\t" . 'Name' . "\t" . 'Discount Type ' . "\t" . 'Start Date (DD/MM/YYYY)' . "\t" . 'End Date (DD/MM/YYYY)' . "\t" . 'Description' . "\t" . 'Discount' . "\t" . ' Error Status' . "\n";

            }

            list($cols,) = $xlsx->dimension();
            $counter = 0;

            foreach ($xlsx->rows() as $k => $r) {
                $rec_error_counter = 0;

                if ($counter > 0 && !empty($r[0])) {

                    $prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prev_code_length = strlen($prev_code);

                    $name = $this->objGeneral->clean_single_variable($r[1]);
                    $name_length = strlen($name);

                    $discount_type = $this->objGeneral->clean_single_variable($r[2]);
                    $discount_type_length = strlen($discount_type);

                    $s_date = $this->objGeneral->clean_single_variable($r[3]);
                    $validate_s_date = $this->validateDate($s_date);

                    if ($validate_s_date > 0) {
                        //$s_date= $validate_s_date;
                    } else {
                        $unixDateVal = $xlsx->unixstamp($s_date);
                        $s_date = date('d/m/Y', $unixDateVal);
                        $validate_s_date = $this->validateDate($s_date);
                    }


                    $e_date = $this->objGeneral->clean_single_variable($r[4]);
                    $validate_e_date = $this->validateDate($e_date);

                    if ($validate_e_date > 0) {
                        //$validate_e_date= $validate_e_date;
                    } else {
                        $unixDateVal = $xlsx->unixstamp($e_date);
                        $e_date = date('d/m/Y', $unixDateVal);
                        $validate_e_date = $this->validateDate($e_date);
                    }


                    $comp_s_date = str_replace('/', '-', $s_date);
                    $start_date = date("Y-m-d", strtotime($comp_s_date));

                    $comp_e_date = str_replace('/', '-', $e_date);
                    $end_date = date("Y-m-d", strtotime($comp_e_date));

                    $e_datetime = strtotime($end_date);
                    $s_datetime = strtotime($start_date);

                    $description = $this->objGeneral->clean_single_variable($r[5]);

                    $discount = $this->objGeneral->clean_single_variable($r[6]);
                    $discount_length = strlen($discount);


                    if ($prev_code_length == 0 || $prev_code_length > 25) {

                        $new_excel .= $prev_code . "\t" . $name . "\t" . $discount_type . "\t" . $r[3] . "\t" . $r[4] . "\t" . $description . "\t" . $discount . "\t" . ' Previous Code Length Exceeds Than Limit 25 or Previous Code is Empty' . "\n";
                        $error_counter++;

                    } elseif ($name_length == 0 || $name_length > 50) {

                        $new_excel .= $prev_code . "\t" . $name . "\t" . $discount_type . "\t" . $r[3] . "\t" . $r[4] . "\t" . $description . "\t" . $discount . "\t" . ' Name Length Exceeds Than Limit 25 or Name is Empty' . "\n";
                        $error_counter++;

                    } elseif ($discount_type_length == 0 || ($discount_type != 1 && $discount_type != 2)) {

                        $new_excel .= $prev_code . "\t" . $name . "\t" . $discount_type . "\t" . $r[3] . "\t" . $r[4] . "\t" . $description . "\t" . $discount . "\t" . ' Discount Type is invalid' . "\n";
                        $error_counter++;

                    } elseif ($discount_length == 0 || $discount_length > 20) {

                        $new_excel .= $prev_code . "\t" . $name . "\t" . $discount_type . "\t" . $r[3] . "\t" . $r[4] . "\t" . $description . "\t" . $discount . "\t" . ' Discount Length Exceeds Than Limit 20 or Discount is Empty' . "\n";
                        $error_counter++;

                    } else {

                        if ($validate_s_date > 0) {
                            $converted_sdate = $this->objGeneral->convert_date($s_date);
                        } else {
                            $new_excel .= $prev_code . "\t" . $name . "\t" . $discount_type . "\t" . $r[3] . "\t" . $r[4] . "\t" . $description . "\t" . $discount . "\t" . ' Invalid Start Date Format' . "\n";
                            $error_counter++;
                            continue;
                        }

                        if ($validate_e_date > 0) {
                            $converted_edate = $this->objGeneral->convert_date($e_date);
                        } else {
                            $new_excel .= $prev_code . "\t" . $name . "\t" . $discount_type . "\t" . $r[3] . "\t" . $r[4] . "\t" . $description . "\t" . $discount . "\t" . ' Invalid End Date Format' . "\n";
                            $error_counter++;
                            continue;
                        }

                        if ($s_datetime > $e_datetime) {
                            $new_excel .= $prev_code . "\t" . $name . "\t" . $discount_type . "\t" . $r[3] . "\t" . $r[4] . "\t" . $description . "\t" . $discount . "\t" . ' End Date is smaller than start date' . "\n";
                            $error_counter++;
                            continue;
                        }


                        $CRM_sql_total = "SELECT  count(c.id) as total,c.id as crm_id
                                          FROM crm c
                                          LEFT JOIN company on company.id=c.company_id
                                          where  c.prev_code='" . $prev_code . "' AND
                                                (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                          limit 1";

                        $crm_rs_count = $this->Conn->Execute($CRM_sql_total);
                        $crm_total = $crm_rs_count->fields['total'];
                        $crm_id = $crm_rs_count->fields['crm_id'];

                        $discount_type2 = "";

                        if ($discount_type == 1)
                            $discount_type2 = "Value";
                        elseif ($discount_type == 2)
                            $discount_type2 = "Percentage";

                        if ($crm_total > 0) {

                            $Sql = "INSERT INTO crm_promotions
                                                  SET
                                                    crm_id='" . $crm_id . "',
                                                    name='" . $name . "',
                                                    starting_date='" . $converted_sdate . "',
                                                    ending_date='" . $converted_edate . "',
                                                    discount_type='" . $discount_type2 . "',
                                                    discount='" . $discount . "',
                                                    description='" . $description . "',
                                                    status='1',
                                                    company_id='" . $this->arrUser['company_id'] . "',
                                                    user_id='" . $this->arrUser['id'] . "',
                                                    AddedBy='" . $this->arrUser['id'] . "',
                                                    AddedOn='" . current_date . "',
                                                    DM_check=1,
                                                    DM_file='" . $DM_file . "'";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {
                                $new_excel .= $prev_code . "\t" . $name . "\t" . $discount_type . "\t" . $r[3] . "\t" . $r[4] . "\t" . $description . "\t" . $discount . "\t" . '' . "\n";
                                $success_counter++;

                            } else {
                                $new_excel .= $prev_code . "\t" . $name . "\t" . $discount_type . "\t" . $r[3] . "\t" . $r[4] . "\t" . $description . "\t" . $discount . "\t" . ' Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {
                            $new_excel .= $prev_code . "\t" . $name . "\t" . $discount_type . "\t" . $r[3] . "\t" . $r[4] . "\t" . $description . "\t" . $discount . "\t" . ' Previous code is not valid' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "crm") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=CRM_Promotion_import");
            $path = APP_PATH . '/upload/migration_file/CRM_Promotion/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($seg_type == "CUST") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_Promotion_import");
            $path = APP_PATH . '/upload/migration_file/Customer_Promotion/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }


    //----------------*******************--------------------------
    //----------------      Customer           --------------------
    //----------------*******************--------------------------

    //----------------Customer General--------------------------

    function import_Customer_Gen($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Customer_General';
            $sitepath = WEB_PATH . '/upload/migration_file/Customer_General';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Customer_General/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();


            $counter = 0;

            $new_excel = 'Name' . "\t" . 'Customer Previous Code' . "\t" . 'Address' . "\t" . 'Address 2' . "\t" . 'City' . "\t" . 'County' . "\t" . 'Postcode' . "\t" . 'Country Code' . "\t" . 'Credit Rating' . "\t" . 'Ownership Type' . "\t" . 'Address Type' . "\t" . 'Web Address' . "\t" . 'Currency' . "\t" . 'Turnover' . "\t" . 'SEGMENT' . "\t" . 'Buying Group' . "\t" . 'Region' . "\t" . 'Credit Limit' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $code_attr = array('tb' => 'crm', 'no' => 'customer_no');

                    $code_find = array();
                    $code_find = $this->getCode($code_attr);

                    if ($code_find['ack'] == 0) {
                        $response['ack'] = 0;
                        $response['error'] = $code_find['error'];
                        return $response;
                        exit;
                    }
                    //echo $code_find['code'] . "'  ,'" . $code_find['nubmer'];


                    //$name = strtolower($this->objGeneral->clean_single_variable($r[0]));
                    $name = $this->objGeneral->clean_single_variable($r[0]);
                    $name_length = strlen($name);

                    $prev_code = $this->objGeneral->clean_single_variable($r[1]);
                    $prev_code_length = strlen($prev_code);

                    $address1 = $this->objGeneral->clean_single_variable($r[2]);
                    $address1_length = strlen($address1);

                    $address2 = $this->objGeneral->clean_single_variable($r[3]);
                    $address2_length = strlen($address2);

                    $city = $this->objGeneral->clean_single_variable($r[4]);
                    $city_length = strlen($city);

                    $county = $this->objGeneral->clean_single_variable($r[5]);
                    $county_length = strlen($county);

                    $postcode = $this->objGeneral->clean_single_variable($r[6]);
                    $postcode_length = strlen($postcode);

                    $country = $this->objGeneral->clean_single_variable($r[7]);


                    $credit_rating = $this->objGeneral->clean_single_variable($r[8]);
                    $credit_rating_length = strlen($credit_rating);

                    $ownership_type = $this->objGeneral->clean_single_variable($r[9]);
                    $ownership_type_length = strlen($ownership_type);

                    $address_type = $this->objGeneral->clean_single_variable($r[10]);
                    $address_type_length = strlen($address_type);
                    $address_type_array = explode(",", $address_type);


                    $webadd = $this->objGeneral->clean_single_variable($r[11]);
                    $webadd_length = strlen($webadd);

                    $currency = $this->objGeneral->clean_single_variable($r[12]);
                    $currency_length = strlen($currency);

                    $turnover = $this->objGeneral->clean_single_variable($r[13]);
                    $turnover_length = strlen($turnover);

                    $segment = $this->objGeneral->clean_single_variable($r[14]);
                    $segment_length = strlen($segment);

                    $buying_grp = $this->objGeneral->clean_single_variable($r[15]);
                    $buying_grp_length = strlen($buying_grp);

                    $region = $this->objGeneral->clean_single_variable($r[16]);
                    $region_length = strlen($region);

                    $credit_limit = $this->objGeneral->clean_single_variable($r[17]);
                    $credit_limit_length = strlen($credit_limit);

                    $country_id = $this->get_data_by_id('country', 'iso', $country);
                    $credit_rating_id = $this->get_data_by_id('crm_credit_rating', 'title', $credit_rating);
                    $ownership_type_id = $this->get_data_by_id('crm_owner', 'title', $ownership_type);
                    $currency_id = $this->get_data_by_id('currency', 'code', $currency);
                    $buying_grp_id = $this->get_data_by_id('crm_buying_group', 'title', $buying_grp);
                    $region_id = $this->get_data_by_id('crm_region', 'title', $region);

                    //$segment_id = $this->get_data_by_id('site_constants', 'name', $segment);
                    $Sql_segment = "SELECT id FROM site_constants WHERE title='" . $segment . "' && type='SEGMENT' LIMIT 1";
                    //echo $Sql;exit;
                    $rs_count_segment = $this->Conn->Execute($Sql_segment);
                    $segment_id = $rs_count_segment->fields['id'];


                    if ($name_length == 0 || $name_length > 150) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Name Length Exceeds Than Limit 150 or Name is empty' . "\n";
                        $error_counter++;

                    } elseif ($prev_code_length > 25) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($address1_length > 255) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Address 1 Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($address2_length > 255) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Address 2 Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($city_length > 50) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'City Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($county_length > 50) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'County Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($postcode_length > 50) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Postcode Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    }/* elseif ($credit_rating_id == "" && $credit_rating_length > 0) {
                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Credit rating is Invalid' . "\n";
                        $error_counter++;

                    } elseif ($ownership_type_id == "" && $ownership_type_length > 0) {
                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Ownership Type is Invalid' . "\n";
                        $error_counter++;

                    }*/ elseif ($address_type_length > 10) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Address Types are invalid' . "\n";
                        $error_counter++;

                    } elseif ($turnover_length > 11) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Turnover Length Exceeds Than Limit 11' . "\n";
                        $error_counter++;

                    } elseif ($webadd_length > 100) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Web Address Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } elseif ($credit_limit_length > 30) {

                        $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Credit Limit Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } else {

                        $invalid_address_type = 0;

                        if ($address_type_length > 0) {

                            $number_of_address_type_array = count($address_type_array);

                            for ($i = 0; $i < $number_of_address_type_array; $i++) {

                                if ($address_type_array[$i] != 1 && $address_type_array[$i] != 2 && $address_type_array[$i] != 3) $invalid_address_type = 1;
                            }
                        }

                        if ($invalid_address_type > 0) {
                            $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Invalid Address Type' . "\n";
                            $error_counter++;
                            continue;
                        }


                        $data_pass = "  (tst.name='" . $name . "' OR tst.prev_code='" . $prev_code . "') AND tst.status=1 AND tst.type =3 ";

                        $total = $this->objGeneral->count_duplicate_in_sql('crm', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {
                            $Sql = "INSERT INTO crm SET
                                        prev_code='" . $prev_code . "'
                                        ,customer_no='" . $code_find['nubmer'] . "'
                                        ,customer_code='" . $code_find['code'] . "'
                                        ,name='" . $name . "'
                                        ,address_1='" . $address1 . "'
                                        ,address_2='" . $address2 . "'
                                        ,city='" . $city . "'
                                        ,county='" . $county . "'
                                        ,postcode='" . $postcode . "'
                                        ,country_id='" . $country_id . "'
                                        ,turnover='" . $turnover . "'
                                        ,status='1'
                                        ,web_address='" . $webadd . "'
                                        ,buying_grp='" . $buying_grp_id . "'
                                        ,credit_limit='" . $credit_limit . "'
                                        ,currency_id='" . $currency_id . "'
                                        ,type='3'
                                        ,company_id='" . $this->arrUser['company_id'] . "'
                                        ,user_id='" . $this->arrUser['id'] . "'
                                        ,region_id='" . $region_id . "'
                                        ,ownership_type='" . $ownership_type_id . "'
                                        ,address_type='" . $address_type . "'
                                        ,credit_rating='" . $credit_rating_id . "'
                                        ,AddedBy='" . $this->arrUser['id'] . "'
                                        ,AddedOn='" . current_date . "'
                                        ,DM_check=1
                                        ,DM_file='" . $DM_file . "'
                                        ";


                            $RS = $this->Conn->Execute($Sql);
                            //echo $Sql; exit;
                            $new_crm_id = $this->Conn->Insert_ID();

                            if ($new_crm_id > 0) {
                                if ($segment_id > 0) {
                                    $Sql_segment = "INSERT INTO crm_selected_segment SET
                                        crm_id='" . $new_crm_id . "'
                                        ,segment_id='" . $segment_id . "'
                                        ,company_id='" . $this->arrUser['company_id'] . "'
                                        ,user_id='" . $this->arrUser['id'] . "'
                                        ";
                                    $RS2 = $this->Conn->Execute($Sql_segment);
                                }
                                $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . '' . "\n";
                                $success_counter++;

                            } else {
                                $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Error in query' . "\n";
                                $error_counter++;
                            }

                        } else {

                            $new_excel .= $name . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $credit_rating . "\t" . $ownership_type . "\t" . $address_type . "\t" . $webadd . "\t" . $currency . "\t" . $turnover . "\t" . $segment . "\t" . $buying_grp . "\t" . $region . "\t" . $credit_limit . "\t" . 'Duplicate Name' . "\n";
                            $error_counter++;

                        }
                    }
                }
                $counter++;

            }
        }


        if ($error_counter == 0) {//&& $this->Conn->Affected_Rows() > 0

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Customer_General_import");
        $path = APP_PATH . '/upload/migration_file/Customer_General/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }


    //----------------Customer Finance--------------------------

    function import_Customer_Finance($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Customer_Finance';
            $sitepath = WEB_PATH . '/upload/migration_file/Customer_Finance';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "Customer_Finance/" . $file_name . '.xls';

            $new_excel = 'Customer Previous Code' . "\t" . 'Contact Person' . "\t" . 'Email' . "\t" . 'Telephone' . "\t" . 'Fax' . "\t" . 'Alt. Contact Person' . "\t" . 'Alt. Contact Email' . "\t" . 'E-Generate' . "\t" . 'Payable Bank' . "\t" . 'Payment Terms' . "\t" . 'Payment Method' . "\t" . 'Finance Charges (0.00%)' . "\t" . 'Insurance Charges (0.00%)' . "\t" . 'VAT Number' . "\t" . 'VAT Bus. Group ' . "\t" . 'Customer Group ' . "\t" . 'Company Reg. No.' . "\t" . 'Account Receivable' . "\t" . 'Sale Account' . "\t" . 'Customer Account name' . "\t" . 'Customer Sort Code' . "\t" . 'Customer Account No' . "\t" . 'Customer Bank Name' . "\t" . 'Customer Swift/BIC' . "\t" . 'Customer IBAN' . "\t" . ' Error Status' . "\n";

            list($cols,) = $xlsx->dimension();
            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prev_code_length = strlen($prev_code);

                    $person_name = $this->objGeneral->clean_single_variable($r[1]);
                    $person_name_length = strlen($person_name);

                    $email = $this->objGeneral->clean_single_variable($r[2]);
                    $email_length = strlen($email);

                    $phone = $this->objGeneral->clean_single_variable($r[3]);
                    $phone_length = strlen($phone);

                    $fax = $this->objGeneral->clean_single_variable($r[4]);
                    $fax_length = strlen($fax);

                    $alt_person_name = $this->objGeneral->clean_single_variable($r[5]);
                    $alt_person_name_length = strlen($alt_person_name);

                    $alt_person_email = $this->objGeneral->clean_single_variable($r[6]);
                    $alt_person_email_length = strlen($alt_person_email);

                    $e_gen = $this->objGeneral->clean_single_variable($r[7]);
                    $e_gen_length = strlen($e_gen);
                    $e_gen_array = explode(";", $e_gen);

                    $pay_bank = $this->objGeneral->clean_single_variable($r[8]);
                    $pay_bank_length = strlen($pay_bank);

                    $pay_terms = $this->objGeneral->clean_single_variable($r[9]);
                    $pay_terms_length = strlen($pay_terms);

                    $pay_method = $this->objGeneral->clean_single_variable($r[10]);
                    $pay_method_length = strlen($pay_method);

                    $fin_charges = $this->objGeneral->clean_single_variable($r[11]);
                    $fin_charges_length = strlen($fin_charges);

                    $incurance_charges = $this->objGeneral->clean_single_variable($r[12]);
                    $incurance_charges_length = strlen($incurance_charges);

                    $vat_num = $this->objGeneral->clean_single_variable($r[13]);
                    $vat_num_length = strlen($vat_num);

                    $vat_bus_grp = $this->objGeneral->clean_single_variable($r[14]);
                    $vat_bus_grp_length = strlen($vat_bus_grp);

                    $cust_grp = $this->objGeneral->clean_single_variable($r[15]);
                    $cust_grp_length = strlen($cust_grp);

                    $comp_reg = $this->objGeneral->clean_single_variable($r[16]);
                    $comp_reg_length = strlen($comp_reg);

                    $account_rec = $this->objGeneral->clean_single_variable($r[17]);
                    $account_rec_length = strlen($account_rec);

                    $sale_account = $this->objGeneral->clean_single_variable($r[18]);
                    $sale_account_length = strlen($sale_account);

                    $cust_account_name = $this->objGeneral->clean_single_variable($r[19]);
                    $cust_account_name_length = strlen($cust_account_name);

                    $cust_sortcode = $this->objGeneral->clean_single_variable($r[20]);
                    $cust_sortcode_length = strlen($cust_sortcode);

                    $cust_accountno = $this->objGeneral->clean_single_variable($r[21]);
                    $cust_accountno_length = strlen($cust_accountno);

                    $cust_bankname = $this->objGeneral->clean_single_variable($r[22]);
                    $cust_bankname_length = strlen($cust_bankname);

                    $cust_swiftcode = $this->objGeneral->clean_single_variable($r[23]);
                    $cust_swiftcode_length = strlen($cust_swiftcode);

                    $cust_IBAN = $this->objGeneral->clean_single_variable($r[24]);
                    $cust_IBAN_length = strlen($cust_IBAN);


                    //$bank_id = $this->get_data_by_id('bank_account', 'account_name', $pay_bank);
                    $bank_id = $this->get_data_by_id('bank_account', 'name', $pay_bank);
                    $payment_terms_id = $this->get_data_by_id('payment_terms', 'name', $pay_terms);
                    $pay_method_id = $this->get_data_by_id('payment_methods', 'name', $pay_method);

                    //$fin_charges_id = $this->get_data_by_id('charges', 'value', $fin_charges);
                    $Sql_fin_charges = "SELECT id FROM charges WHERE value='" . $fin_charges . "' && type=1 LIMIT 1";
                    $rs_fin_charges = $this->Conn->Execute($Sql_fin_charges);
                    $fin_charges_id = $rs_fin_charges->fields['id'];

                    //$incurance_charges_id = $this->get_data_by_id('charges', 'value', $incurance_charges);
                    $Sql_incurance_charges = "SELECT id FROM charges WHERE value='" . $incurance_charges . "' && type=2 LIMIT 1";
                    $rs_incurance_charges = $this->Conn->Execute($Sql_incurance_charges);
                    $incurance_charges_id = $rs_incurance_charges->fields['id'];


                    $Sql_vat_bus_grp = "SELECT id FROM site_constants WHERE title='" . $vat_bus_grp . "' && type='VAT_BUS_POSTING_GROUP' LIMIT 1";
                    $rs_vat_bus_grp = $this->Conn->Execute($Sql_vat_bus_grp);
                    $vat_bus_grp_id = $rs_vat_bus_grp->fields['id'];


                    $Sql_cust_grp = "SELECT id FROM site_constants WHERE title='" . $cust_grp . "' && type='CUST_POSTING_GROUP' LIMIT 1";
                    $rs_cust_grp = $this->Conn->Execute($Sql_cust_grp);
                    $cust_grp_id = $rs_cust_grp->fields['id'];


                    if ($prev_code_length == 0 || $prev_code_length > 25) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Previous Code Length Exceeds Than Limit 25 or Previous Code is Empty' . "\n";
                        $error_counter++;

                    } elseif ($email_length > 50 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Email is not valid' . "\n";
                        $error_counter++;

                    } elseif ($alt_person_email_length > 50 || !filter_var($alt_person_email, FILTER_VALIDATE_EMAIL)) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Alt.person Email is not valid' . "\n";
                        $error_counter++;

                    } elseif ($person_name_length > 100) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Person Name Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } elseif ($alt_person_name_length > 100) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Alt.person Name Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } elseif ($phone_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Phone Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($vat_num_length > 255) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' VAT Number Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($fax_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Fax Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($phone_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Phone Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($e_gen_length > 10) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Invalid E-Generate' . "\n";
                        $error_counter++;

                    } elseif ($comp_reg_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Company Reg Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($account_rec_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Account Receivable Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($sale_account_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Sale Account Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($bank_id == 0 && $pay_bank_length > 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Bank Account is invalid' . "\n";
                        $error_counter++;

                    } elseif ($payment_terms_id == 0 && $pay_terms_length > 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Payment Terms is invalid' . "\n";
                        $error_counter++;

                    } elseif ($pay_method_id == 0 && $pay_method_length > 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Payment Method is invalid' . "\n";
                        $error_counter++;

                    } elseif ($fin_charges_id == 0 && $fin_charges_length > 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Finance Charges is invalid' . "\n";
                        $error_counter++;

                    } elseif ($incurance_charges_id == 0 && $incurance_charges_length > 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Insurance Charges is invalid' . "\n";
                        $error_counter++;

                    } elseif ($vat_bus_grp_id == 0 || $vat_bus_grp_length == 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' VAT Bus. Group is invalid' . "\n";
                        $error_counter++;

                    } elseif ($cust_grp_id == 0 || $cust_grp_length == 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Customer Group is invalid' . "\n";
                        $error_counter++;

                    } elseif ($cust_account_name_length > 200) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Customer Account Name Length Exceeds Than Limit 200' . "\n";
                        $error_counter++;

                    } elseif ($cust_accountno_length > 200) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Customer Account No Length Exceeds Than Limit 200' . "\n";
                        $error_counter++;

                    } elseif ($cust_sortcode_length > 200) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Customer Sort Code Length Exceeds Than Limit 200 ' . "\n";
                        $error_counter++;

                    } elseif ($cust_bankname_length > 255) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Customer Bank Name Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($cust_swiftcode_length > 100) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Customer Swift Code / BIC Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } elseif ($cust_IBAN_length > 100) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Customer IBAN Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } else {

                        $invalid_e_gen = 0;

                        if ($e_gen_length > 0) {

                            $number_of_e_gen_array = count($e_gen_array);

                            for ($i = 0; $i < $number_of_e_gen_array; $i++) {

                                if ($e_gen_array[$i] != 1 && $e_gen_array[$i] != 2 && $e_gen_array[$i] != 3) $invalid_e_gen = 1;
                            }
                        }

                        if ($invalid_e_gen > 0) {

                            $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Invalid E-Generate' . "\n";
                            $error_counter++;
                            continue;
                        }


                        $Customer_sql_total = "SELECT  count(c.id) as total,c.customer_code,c.id as customer_id	FROM crm c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.prev_code='" . $prev_code . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";

                        $Customer_rs_count = $this->Conn->Execute($Customer_sql_total);
                        $Customer_total = $Customer_rs_count->fields['total'];
                        $Customer_id = $Customer_rs_count->fields['customer_id'];
                        $customer_code = $Customer_rs_count->fields['customer_code'];

                        /*$finance_sql_total = "SELECT  count(id) as total FROM  finance  where customer_id='" . $Customer_id . "' && type='customer' && company_id='" . $this->arrUser['company_id'] . "' && user_id='" . $this->arrUser['id'] . "'";

                        $finance_rs_count = $this->Conn->Execute($finance_sql_total);
                        $finance_total = $finance_rs_count->fields['total'];*/

                        $data_pass = "  tst.customer_id='" . $Customer_id . "' && tst.type='customer'";
                        $finance_total = $this->objGeneral->count_duplicate_in_sql('finance', $data_pass, $this->arrUser['company_id']);

                        if ($finance_total > 0) {

                            $finance_sql_delete = "DELETE FROM finance  where customer_id='" . $Customer_id . "' && type='customer' && company_id='" . $this->arrUser['company_id'] . "' && user_id='" . $this->arrUser['id'] . "'";
                            $finance_del = $this->Conn->Execute($finance_sql_delete);
                        }

                        if ($Customer_total > 0) {

                            $Sql = "INSERT INTO finance SET
                                        customer_id='" . $Customer_id . "'
                                        ,contact_person='" . $person_name . "'
                                        ,bill_to_customer='" . $customer_code . "'
                                        ,alt_contact_person='" . $alt_person_name . "'
                                        ,alt_contact_email='" . $alt_person_email . "'
                                        ,email='" . $email . "'
                                        ,phone='" . $phone . "'
                                        ,fax='" . $fax . "'                                        
                                        
                                        ,payment_terms_id='" . $payment_terms_id . "'
                                        ,payment_method_id='" . $pay_method_id . "'
                                        ,bank_account_id='" . $bank_id . "'
                                        ,generate='" . $e_gen . "'
                                        ,finance_charges_id='" . $fin_charges_id . "'
                                        ,insurance_charges_id='" . $incurance_charges_id . "'  
                                        ,vat_number='" . $vat_num . "'
                                        ,vat_bus_posting_group='" . $vat_bus_grp_id . "'
                                        ,customer_posting_group='" . $cust_grp_id . "'
                                        ,company_reg_no='" . $comp_reg . "'
                                        ,account_payable_number='" . $account_rec . "'
                                        ,purchase_code_number='" . $sale_account . "' 
                                        
                                        ,account_name='" . $cust_account_name . "'
                                        ,sort_code='" . $cust_sortcode . "'
                                        ,account_no='" . $cust_accountno . "'
                                        ,bill_bank_name='" . $cust_bankname . "'
                                        ,swift_no='" . $cust_swiftcode . "'
                                        ,iban='" . $cust_IBAN . "'
                                                                                 
                                        ,status='1'
                                        ,type='customer'
                                        ,company_id='" . $this->arrUser['company_id'] . "'
                                        ,user_id='" . $this->arrUser['id'] . "'
                                        ,AddedBy='" . $this->arrUser['id'] . "'
                                        ,AddedOn='" . current_date . "'
                                        ,DM_check=1
                                        ,DM_file='" . $DM_file . "'
                                        ";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' ' . "\n";
                                $success_counter++;
                            } else {

                                $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {

                            $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $e_gen . "\t" . $pay_bank . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $fin_charges . "\t" . $incurance_charges . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $cust_grp . "\t" . $comp_reg . "\t" . $account_rec . "\t" . $sale_account . "\t" . $cust_account_name . "\t" . $cust_sortcode . "\t" . $cust_accountno . "\t" . $cust_bankname . "\t" . $cust_swiftcode . "\t" . $cust_IBAN . "\t" . ' Previous code is not valid' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Customer_Finance_import");
        $path = APP_PATH . '/upload/migration_file/Customer_Finance/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);


        return $response;
    }


    //----------------Payable Bank------------------------------

    function import_Payable_bank($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Payable_bank';
            $sitepath = WEB_PATH . '/upload/migration_file/Payable_bank';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "Payable_bank/" . $file_name . '.xls';

            $new_excel = 'Account Name' . "\t" . 'Account No' . "\t" . 'Sort Code' . "\t" . 'Swift Code / BIC' . "\t" . 'IBAN' . "\t" . 'Currency' . "\t" . 'GL Posting' . "\t" . 'Bank Name ' . "\t" . 'Address' . "\t" . 'Address 2' . "\t" . 'City' . "\t" . 'County' . "\t" . 'Postcode' . "\t" . 'Country Code' . "\t" . 'Telephone' . "\t" . 'Fax' . "\t" . 'Contact' . "\t" . 'Mobile' . "\t" . 'Email' . "\t" . ' Error Status' . "\n";

            list($cols,) = $xlsx->dimension();
            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $account_name = $this->objGeneral->clean_single_variable($r[0]);
                    $account_name_length = strlen($account_name);

                    $account_num = $this->objGeneral->clean_single_variable($r[1]);
                    $account_num_length = strlen($account_num);

                    $sort_code = $this->objGeneral->clean_single_variable($r[2]);
                    $sort_code_length = strlen($sort_code);

                    $swift_code = $this->objGeneral->clean_single_variable($r[3]);
                    $swift_code_length = strlen($swift_code);

                    $iban = $this->objGeneral->clean_single_variable($r[4]);
                    $iban_length = strlen($iban);

                    $currency = $this->objGeneral->clean_single_variable($r[5]);
                    $currency_length = strlen($currency);

                    $gl_posting = $this->objGeneral->clean_single_variable($r[6]);
                    $gl_posting_length = strlen($gl_posting);

                    $bank_name = $this->objGeneral->clean_single_variable($r[7]);
                    $bank_name_length = strlen($bank_name);

                    $address = $this->objGeneral->clean_single_variable($r[8]);
                    $address_length = strlen($address);

                    $address2 = $this->objGeneral->clean_single_variable($r[9]);
                    $address2_length = strlen($address2);

                    $city = $this->objGeneral->clean_single_variable($r[10]);
                    $city_length = strlen($city);

                    $county = $this->objGeneral->clean_single_variable($r[11]);
                    $county_length = strlen($county);

                    $postcode = $this->objGeneral->clean_single_variable($r[12]);
                    $postcode_length = strlen($postcode);

                    $country = $this->objGeneral->clean_single_variable($r[13]);

                    $phone = $this->objGeneral->clean_single_variable($r[14]);
                    $phone_length = strlen($phone);

                    $fax = $this->objGeneral->clean_single_variable($r[15]);
                    $fax_length = strlen($fax);

                    $contact = $this->objGeneral->clean_single_variable($r[16]);
                    $contact_length = strlen($contact);

                    $mobile = $this->objGeneral->clean_single_variable($r[17]);
                    $mobile_length = strlen($mobile);

                    $email = $this->objGeneral->clean_single_variable($r[18]);
                    $email_length = strlen($email);

                    $country_id = $this->get_data_by_id('country', 'iso', $country);

                    if ($currency_length > 0) {
                        $lc_currency = strtolower($currency);
                        $CURR_sql = "SELECT  id	FROM currency where  	LCASE(name)='" . $lc_currency . "' AND company_id=" . $this->arrUser['company_id'];
                        $CURR_rs = $this->Conn->Execute($CURR_sql);
                        $currency_id = $CURR_rs->fields['id'];
                    }


                    if ($account_name_length == 0 || $account_name_length > 255) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Account Name  Length Exceeds Than Limit 255 or Account Name is Empty' . "\n";
                        $error_counter++;

                    } elseif ($account_num_length == 0 || $account_num_length > 50) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Account No Length Exceeds Than Limit 50 or Account No is Empty' . "\n";
                        $error_counter++;

                    } elseif ($sort_code_length == 0 || $sort_code_length > 150) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Sort Code Length Exceeds Than Limit 150 or Sort Code is Empty' . "\n";
                        $error_counter++;

                    } elseif ($swift_code_length > 20) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Swift Code / BIC Length Exceeds Than Limit 20' . "\n";
                        $error_counter++;

                    } elseif ($iban_length > 20) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' IBAN Length Exceeds Than Limit 20' . "\n";
                        $error_counter++;

                    } elseif ($gl_posting_length == 0 || $gl_posting_length > 20) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' GL Posting Length Exceeds Than Limit 20 or GL Posting is Empty' . "\n";
                        $error_counter++;

                    } elseif ($bank_name_length == 0 || $bank_name_length > 100) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Bank Name  Length Exceeds Than Limit 100 or Bank Name is Empty' . "\n";
                        $error_counter++;

                    } elseif ($address_length > 200) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Address Length Exceeds Than Limit 200' . "\n";
                        $error_counter++;

                    } elseif ($address2_length > 200) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Address 2 Length Exceeds Than Limit 200' . "\n";
                        $error_counter++;

                    } elseif ($city_length > 150) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' City Length Exceeds Than Limit 150' . "\n";
                        $error_counter++;

                    } elseif ($county_length > 150) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' County Length Exceeds Than Limit 150' . "\n";
                        $error_counter++;

                    } elseif ($postcode_length > 25) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Postcode Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($fax_length > 50) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Fax Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($phone_length > 50) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Telephone Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($email_length > 50 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Email is invalid' . "\n";
                        $error_counter++;

                    } elseif ($contact_length > 100) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Contact Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } elseif ($mobile_length > 50) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Mobile Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($country_id == 0 || $country_id == "") {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Country is not valid' . "\n";
                        $error_counter++;

                    } elseif (($currency_length > 0) && ($currency_id == 0 || $currency_id == "")) {

                        $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Currency is not valid' . "\n";
                        $error_counter++;

                    } else {


                        /*$sql_total = "SELECT  count(c.id) as total	FROM bank_account c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	(c.account_name='" . $account_name . "' OR c.account_no='" . $account_num . "')
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";

                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  (tst.account_name='" . $account_name . "' OR tst.account_no='" . $account_num . "')";
                        $total = $this->objGeneral->count_duplicate_in_sql('bank_account', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO bank_account SET
                                        account_name='" . $account_name . "'
                                        ,name='" . $bank_name . "'
                                        ,address='" . $address . "'
                                        ,address_2='" . $address2 . "'
                                        ,city='" . $city . "'
                                        ,county='" . $county . "'
                                        ,postcode='" . $postcode . "'
                                        ,country_id='" . $country_id . "'                                        
                                        
                                        ,phone_no='" . $phone . "'
                                        ,mobile='" . $mobile . "'
                                        ,contact='" . $contact . "'
                                        ,sort_code='" . $sort_code . "'
                                        ,account_no='" . $account_num . "'
                                        ,fax='" . $fax . "'  
                                        ,email='" . $email . "'
                                        
                                        ,currency_id='" . $currency_id . "'
                                        
                                        ,gl_posting='" . $gl_posting . "'
                                        ,swift_code='" . $swift_code . "'
                                        ,iban='" . $iban . "'
                                         
                                        ,status='1'
                                        ,company_id='" . $this->arrUser['company_id'] . "'
                                        ,user_id='" . $this->arrUser['id'] . "'
                                        ,AddedBy='" . $this->arrUser['id'] . "'
                                        ,AddedOn='" . current_date . "'
                                        ,DM_check=1
                                        ,DM_file='" . $DM_file . "'
                                        ";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . '' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {

                            $new_excel .= $account_name . "\t" . $account_num . "\t" . $sort_code . "\t" . $swift_code . "\t" . $iban . "\t" . $currency . "\t" . $gl_posting . "\t" . $bank_name . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $phone . "\t" . $fax . "\t" . $contact . "\t" . $mobile . "\t" . $email . "\t" . ' Record Already Exists' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Payable_bank_import");
        $path = APP_PATH . '/upload/migration_file/Payable_bank/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);


        return $response;
    }


    //----------------Payment Terms-----------------------------

    function import_Payment_Terms($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Payment_Terms';
            $sitepath = WEB_PATH . '/upload/migration_file/Payment_Terms';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "Payment_Terms/" . $file_name . '.xls';

            $new_excel = 'Days' . "\t" . 'Description' . "\t" . ' Error Status' . "\n";

            list($cols,) = $xlsx->dimension();
            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $days = $this->objGeneral->clean_single_variable($r[0]);
                    $days_length = strlen($days);

                    $description = $this->objGeneral->clean_single_variable($r[1]);
                    $description_length = strlen($description);

                    if ($days_length == 0 || $days_length > 10) {

                        $new_excel .= $days . "\t" . $description . "\t" . ' Days Length Exceeds Than Limit 10 or Days is Empty' . "\n";
                        $error_counter++;

                    } elseif ($description_length == 0 || $description_length > 255) {

                        $new_excel .= $days . "\t" . $description . "\t" . ' Description Length Exceeds Than Limit 255 or Description is Empty' . "\n";
                        $error_counter++;

                    } else {
                        /*$sql_total = "SELECT  count(c.id) as total	FROM payment_terms c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.name='" . $description . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";

                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  tst.name='" . $description . "' ";
                        $total = $this->objGeneral->count_duplicate_in_sql('payment_terms', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO payment_terms SET
                                        days='" . $days . "'
                                        ,name='" . $description . "'
                                        ,company_id='" . $this->arrUser['company_id'] . "'
                                        ,user_id='" . $this->arrUser['id'] . "'                                          
                                        ,status='1'
                                        ,AddedBy='" . $this->arrUser['id'] . "'
                                        ,AddedOn='" . current_date . "'
                                        ,DM_check=1
                                        ,DM_file='" . $DM_file . "'
                                        ";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $days . "\t" . $description . "\t" . ' ' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $days . "\t" . $description . "\t" . ' Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {

                            $new_excel .= $days . "\t" . $description . "\t" . ' Record Already Exists' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Payment_Terms_import");
        $path = APP_PATH . '/upload/migration_file/Payment_Terms/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);


        return $response;
    }

    //----------------Payment Method----------------------------

    function import_Payment_Method($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Payment_Method';
            $sitepath = WEB_PATH . '/upload/migration_file/Payment_Method';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "Payment_Method/" . $file_name . '.xls';

            $new_excel = 'Name' . "\t" . ' Error Status' . "\n";

            list($cols,) = $xlsx->dimension();
            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $method_name = $this->objGeneral->clean_single_variable($r[0]);
                    $method_name_length = strlen($method_name);

                    if ($method_name_length == 0 || $method_name_length > 30) {

                        $new_excel .= $method_name . "\t" . ' Payment Method Name Length Exceeds Than Limit 30 or Payment Method Name is Empty' . "\n";
                        $error_counter++;

                    } else {

                        /*$sql_total = "SELECT  count(c.id) as total	FROM payment_methods c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.name='" . $method_name . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";

                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  tst.name='" . $method_name . "' ";
                        $total = $this->objGeneral->count_duplicate_in_sql('payment_methods', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO payment_terms SET
                                        name='" . $method_name . "'
                                        ,company_id='" . $this->arrUser['company_id'] . "'
                                        ,user_id='" . $this->arrUser['id'] . "'                                          
                                        ,status='1'
                                        ,AddedBy='" . $this->arrUser['id'] . "'
                                        ,AddedOn='" . current_date . "'
                                        ,DM_check=1
                                        ,DM_file='" . $DM_file . "'
                                        ";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $method_name . "\t" . ' ' . "\n";
                                $success_counter++;
                            } else {

                                $new_excel .= $method_name . "\t" . ' Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {

                            $new_excel .= $method_name . "\t" . ' Record Already Exists' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Payment_Method_import");
        $path = APP_PATH . '/upload/migration_file/Payment_Method/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);


        return $response;
    }


    //----------------Finance & Insurance Charges---------------

    function import_Finance_Charges($arr, $input)
    {
        $charges_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["charges_tp"])) {

            $charges_type = $input["charges_tp"];

            if ($charges_type == "crm") {

                $_type = 1;

            } elseif ($charges_type == "CUST") {
                $_type = 2;
            }
        }

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);


            if ($charges_type == "fin") {

                $path = $_SERVER["DOCUMENT_ROOT"] . '/silverow/upload/migration_file/Finance_Charges';
                $sitepath = APP_PATH . '/silverow/upload/migration_file/Finance_Charges';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Finance_Charges/" . $file_name . '.xls';

                $new_excel = 'Name' . "\t" . 'Values' . "\t" . 'Discount type' . "\t" . ' Error Status' . "\n";

            } elseif ($charges_type == "insurance") {

                $path = $_SERVER["DOCUMENT_ROOT"] . '/silverow/upload/migration_file/Insurance_Charges';
                $sitepath = APP_PATH . '/silverow/upload/migration_file/Insurance_Charges';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Insurance_Charges/" . $file_name . '.xls';

                $new_excel = 'Name' . "\t" . 'Values' . "\t" . 'Discount type' . "\t" . ' Error Status' . "\n";
            }


            list($cols,) = $xlsx->dimension();
            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $charges_name = $this->objGeneral->clean_single_variable($r[0]);
                    $charges_name_length = strlen($charges_name);

                    $charges_values = $this->objGeneral->clean_single_variable($r[1]);
                    $charges_values_length = strlen($charges_values);

                    $charges_discount_type = $this->objGeneral->clean_single_variable($r[2]);

                    if ($charges_name_length == 0 || $charges_name_length > 30) {

                        $new_excel .= $charges_name . "\t" . $charges_values . "\t" . $charges_discount_type . "\t" . ' Name Length Exceeds Than Limit 30 or Name is Empty' . "\n";
                        $error_counter++;

                    } elseif ($charges_values_length == 0) {

                        $new_excel .= $charges_name . "\t" . $charges_values . "\t" . $charges_discount_type . "\t" . ' Value is Empty' . "\n";
                        $error_counter++;

                    } elseif ($charges_discount_type != 1 && $charges_discount_type != 2) {

                        $new_excel .= $charges_name . "\t" . $charges_values . "\t" . $charges_discount_type . "\t" . ' Discount type is Invalid' . "\n";
                        $error_counter++;

                    } else {

                        /*$sql_total = "SELECT  count(c.id) as total	FROM charges c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.value='" . $charges_values . "' AND c.type='" . $_type . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";

                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  tst.value='" . $charges_values . "' AND tst.type='" . $_type . "'";
                        $total = $this->objGeneral->count_duplicate_in_sql('charges', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO charges SET
                                        name='" . $charges_name . "'
                                        ,value='" . $charges_values . "'
                                        ,type='" . $_type . "'
                                        ,company_id='" . $this->arrUser['company_id'] . "'
                                        ,user_id='" . $this->arrUser['id'] . "'                                          
                                        ,status='1'
                                        ,AddedBy='" . $this->arrUser['id'] . "'
                                        ,AddedOn='" . current_date . "'
                                        ,DM_check=1
                                        ,DM_file='" . $DM_file . "'
                                        ";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $charges_name . "\t" . $charges_values . "\t" . $charges_discount_type . "\t" . ' ' . "\n";
                                $success_counter++;
                            } else {

                                $new_excel .= $charges_name . "\t" . $charges_values . "\t" . $charges_discount_type . "\t" . ' Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {

                            $new_excel .= $charges_name . "\t" . $charges_values . "\t" . $charges_discount_type . "\t" . ' Record Already Exists' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($charges_type == "fin") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Finance_Charges_import");
            $path = $_SERVER["DOCUMENT_ROOT"] . '/silverow/upload/migration_file/Finance_Charges/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($charges_type == "insurance") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Insurance_Charges_import");
            $path = $_SERVER["DOCUMENT_ROOT"] . '/silverow/upload/migration_file/Insurance_Charges/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }

    //----------------Site Constants for VAT Bussiness Group & Customer Group--------------------------

    function import_site_constants($arr, $input)
    {
        $grp_tp = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["grp_tp"])) {

            $grp_tp = $input["grp_tp"];

            if ($grp_tp == "Bussiness_grp") {

                $_type = 1;
                $constant_type = "VAT_BUS_POSTING_GROUP";

            } elseif ($grp_tp == "Customer_grp") {
                $_type = 2;
                $constant_type = "CUST_POSTING_GROUP";
            }
        }

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);


            if ($grp_tp == "Bussiness_grp") {

                $path = APP_PATH . '/upload/migration_file/VAT_Bussiness_Groups';
                $sitepath = WEB_PATH . '/upload/migration_file/VAT_Bussiness_Groups';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "VAT_Bussiness_Groups/" . $file_name . '.xls';

            } elseif ($grp_tp == "Customer_grp") {

                $path = APP_PATH . '/upload/migration_file/Customer_Group';
                $sitepath = WEB_PATH . '/upload/migration_file/Customer_Group';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Customer_Group/" . $file_name . '.xls';
            }

            $new_excel = 'Name' . "\t" . 'Description' . "\t" . ' Error Status' . "\n";


            list($cols,) = $xlsx->dimension();
            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $constant_name = $this->objGeneral->clean_single_variable($r[0]);
                    $constant_name_length = strlen($constant_name);

                    $constant_desc = $this->objGeneral->clean_single_variable($r[1]);

                    if ($constant_name_length == 0 || $constant_name_length > 50) {

                        $new_excel .= $constant_name . "\t" . $constant_desc . "\t" . ' Name Length Exceeds Than Limit 50 or Name is Empty' . "\n";
                        $error_counter++;

                    } else {

                        /*$sql_total = "SELECT  count(c.id) as total	FROM site_constants c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.name='" . $constant_name . "' AND c.type='" . $constant_type . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";

                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  tst.name='" . $constant_name . "' AND tst.type='" . $constant_type . "'";
                        $total = $this->objGeneral->count_duplicate_in_sql('site_constants', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO site_constants SET
                                        name='" . $constant_name . "'
                                        ,description='" . $constant_desc . "'
                                        ,type='" . $constant_type . "'
                                        ,company_id='" . $this->arrUser['company_id'] . "'
                                        ,user_id='" . $this->arrUser['id'] . "'                                          
                                        ,status='1'
                                        ,AddedBy='" . $this->arrUser['id'] . "'
                                        ,AddedOn='" . current_date . "'
                                        ,DM_check=1
                                        ,DM_file='" . $DM_file . "'
                                        ";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $constant_name . "\t" . $constant_desc . "\t" . ' ' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $constant_name . "\t" . $constant_desc . "\t" . ' Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {

                            $new_excel .= $constant_name . "\t" . $constant_desc . "\t" . ' Record Already Exists' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($grp_tp == "Bussiness_grp") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=VAT_Bussiness_Groups_import");
            $path = APP_PATH . '/upload/migration_file/VAT_Bussiness_Groups/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);

        } elseif ($grp_tp == "Customer_grp") {

            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Customer_Group_import");
            $path = APP_PATH . '/upload/migration_file/Customer_Group/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }



    //----------------*******************--------------------------
    //----------------      SRM           -------------------------
    //----------------*******************--------------------------

    //----------------SRM General--------------------------

    function import_SRM_Gen($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/SRM_Gen';
            $sitepath = WEB_PATH . '/upload/migration_file/SRM_Gen';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "SRM_Gen/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();


            $counter = 0;

            $new_excel = 'SRM Name' . "\t" . 'SRM Previous Code' . "\t" . 'Address' . "\t" . 'Address 2' . "\t" . 'City' . "\t" . 'County' . "\t" . 'Postcode' . "\t" . 'Country Code' . "\t" . 'Web Address' . "\t" . 'SEGMENT' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $code_attr = array('tb' => 'srm', 'no' => 'srm_no');
                    //print_r($code_attr);
                    $code_find = array();
                    $code_find = $this->getCode($code_attr);
                    /*print_r($code_find);
                    exit;*/
                    if ($code_find['ack'] == 0) {
                        $response['ack'] = 0;
                        $response['error'] = $code_find['error'];
                        return $response;
                        exit;
                    }
                    //echo $code_find['code'] . "'  ,'" . $code_find['nubmer'];


                    // $suppliername = strtolower($this->objGeneral->clean_single_variable($r[0]));
                    $suppliername = $this->objGeneral->clean_single_variable($r[0]);
                    $suppliername_length = strlen($suppliername);

                    $prev_code = $this->objGeneral->clean_single_variable($r[1]);
                    $prev_code_length = strlen($prev_code);

                    $address1 = $this->objGeneral->clean_single_variable($r[2]);
                    $address1_length = strlen($address1);

                    $address2 = $this->objGeneral->clean_single_variable($r[3]);
                    $address2_length = strlen($address2);

                    $city = $this->objGeneral->clean_single_variable($r[4]);
                    $city_length = strlen($city);

                    $county = $this->objGeneral->clean_single_variable($r[5]);
                    $county_length = strlen($county);

                    $postcode = $this->objGeneral->clean_single_variable($r[6]);
                    $postcode_length = strlen($postcode);

                    $country = $this->objGeneral->clean_single_variable($r[7]);
                    //$name_length = strlen($name);

                    $webadd = $this->objGeneral->clean_single_variable($r[8]);
                    $webadd_length = strlen($webadd);

                    $segment = $this->objGeneral->clean_single_variable($r[9]);
                    $segment_length = strlen($segment);

                    $country_id = $this->get_data_by_id('country', 'iso', $country);

                    $segment_id = $this->get_data_by_id_company('crm_segment', 'title', $segment,' AND segment_type=2');
                    
                    /* //$segment_id = $this->get_data_by_id('site_constants', 'name', $segment);
                    $Sql_segment = "SELECT id FROM site_constants WHERE title='" . $segment . "' && type='SEGMENT' LIMIT 1";
                    //echo $Sql;exit;
                    $rs_count_segment = $this->Conn->Execute($Sql_segment);
                    $segment_id = $rs_count_segment->fields['id']; */


                    if ($suppliername_length > 150) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Supplier Name Length Exceeds Than Limit 150' . "\n";
                        $error_counter++;

                    } elseif ($prev_code_length > 25) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Supplier previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($address1_length > 255) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Address 1 Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($address2_length > 255) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Address 2 Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($city_length > 50) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'City Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($county_length > 50) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'County Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($postcode_length > 50) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Postcode Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($webadd_length > 200) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Web Address Length Exceeds Than Limit 200' . "\n";
                        $error_counter++;

                    } else {
                        /*$sql_total = "SELECT count(ef.id) as total
                                    FROM srm ef
                                    JOIN company ON company.id = ef.company_id
                                    WHERE (ef.name='" . $suppliername . "' OR ef.prev_code='" . $prev_code . "') AND ef.status=1 AND ef.type =1
                                    and (ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    ";

                        //echo $sql_total;
                        //exit;
                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/


                        $data_pass = "  (tst.name='" . $suppliername . "' OR tst.prev_code='" . $prev_code . "') AND tst.status=1 AND tst.type =1 ";

                        $total = $this->objGeneral->count_duplicate_in_sql('srm', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO srm SET
                                        prev_code='" . $prev_code . "'
                                        ,supplier_code='" . $code_find['code'] . "'
                                        ,name='" . $suppliername . "'
                                        ,type='1'
                                        ,address_1='" . $address1 . "'
                                        ,address_2='" . $address2 . "'
                                        ,city='" . $city . "'
                                        ,county='" . $county . "'
                                        ,postcode='" . $postcode . "'
                                        ,country_id='" . $country_id . "'
                                        ,unique_id='0'
                                        ,segment_id='" . $segment_id . "'
                                        ,status='1'
                                        ,company_id='" . $this->arrUser['company_id'] . "'
                                        ,web_address='" . $webadd . "'
                                        ,user_id='" . $this->arrUser['id'] . "'
                                        ,DM_check=1
                                        ,DM_file='" . $DM_file . "'
                                        ";

                            $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . '' . "\n";
                            $RS = $this->Conn->Execute($Sql);
                            $success_counter++;

                        } else {
                            $error_counter++;
                            $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address1 . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Duplicate Supplier Name' . "\n";

                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=SRM_Gen_import");
        $path = APP_PATH . '/upload/migration_file/SRM_Gen/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }

    //----------------SRM Segment--------------------------

    function import_SRM_Segments($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"])) {
            $seg_type = $input["tp"];

            if ($seg_type == "srm") {

            } elseif ($seg_type == "supp") {

            }
        }

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "srm") {
                $path = APP_PATH . '/upload/migration_file/SRM_Segments';
                $sitepath = WEB_PATH . '/upload/migration_file/SRM_Segments';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "SRM_Segments/" . $file_name . '.xls';
            } elseif ($seg_type == "supp") {
                $path = APP_PATH . '/upload/migration_file/Supplier_Segments';
                $sitepath = WEB_PATH . '/upload/migration_file/Supplier_Segments';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Supplier_Segments/" . $file_name . '.xls';
            }


            list($cols,) = $xlsx->dimension();

            $Sql = "INSERT INTO site_constants (type,name, description, company_id, status, user_id,DM_check,DM_file) VALUES ";


            $counter = 0;
            $new_excel = 'Title' . "\t" . 'Description' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $title = $this->objGeneral->clean_single_variable($r[0]);
                    $title_length = strlen($title);

                    $desc = $this->objGeneral->clean_single_variable($r[1]);
                    //$desc_length = strlen($desc);

                    if ($title_length > 25) {

                        $new_excel .= $title . "\t" . $desc . "\t" . 'Title Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;
                    } else {

                        /*$sql_total = "SELECT count(c.id) as total	FROM site_constants c
                        LEFT JOIN company on company.id=c.company_id
                                    where  	c.name='" . $title . "' AND c.type= 'SEGMENT'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ") limit 1";
                        //echo $sql_total;exit;
                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/

                        $data_pass = "  tst.name='" . $title . "' AND tst.type= 'SEGMENT'";
                        $total = $this->objGeneral->count_duplicate_in_sql('site_constants', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {
                            $Sql .= "(  'SEGMENT','" . $title . "','" . $desc . "','" . $this->arrUser['company_id'] . "', 1," . "'" . $this->arrUser['id'] . "','1','" . $DM_file . "')  , ";
                            $new_excel .= $title . "\t" . $desc . "\t" . '' . "\n";
                            $success_counter++;

                        } else {
                            $error_counter++;
                            $new_excel .= $title . "\t" . $desc . "\t" . 'Duplicate Title Name' . "\n";
                        }
                    }
                }
                $counter++;

            }

            $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
            //	echo  $Sql;exit;
            $RS = $this->Conn->Execute($Sql);

        }


        if ($error_counter == 0 && $this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "srm") {
            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=SRM_Segments_import");
            $path = APP_PATH . '/upload/migration_file/SRM_Segments/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        } elseif ($seg_type == "supp") {
            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Supplier_Segments_import");
            $path = APP_PATH . '/upload/migration_file/Supplier_Segments/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }

    //----------------SRM Contacts--------------------------

    function import_SRM_Contacts($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"])) {
            $seg_type = $input["tp"];

            if ($seg_type == "srm") {

            } elseif ($seg_type == "supp") {

            }
        }


        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "srm") {
                $path = APP_PATH . '/upload/migration_file/SRM_Contacts';
                $sitepath = WEB_PATH . '/upload/migration_file/SRM_Contacts';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "SRM_Contacts/" . $file_name . '.xls';

                $new_excel = 'Contact Name ' . "\t" . 'SRM Previous Code' . "\t" . 'Job title' . "\t" . 'Direct Line' . "\t" . 'Mobile' . "\t" . 'Phone' . "\t" . 'Fax' . "\t" . 'Email' . "\t" . ' Error Status' . "\n";

            } elseif ($seg_type == "supp") {
                $path = APP_PATH . '/upload/migration_file/Supplier_Contacts';
                $sitepath = WEB_PATH . '/upload/migration_file/Supplier_Contacts';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Supplier_Contacts/" . $file_name . '.xls';

                $new_excel = 'Contact Name ' . "\t" . 'Supplier Previous Code' . "\t" . 'Job title' . "\t" . 'Direct Line' . "\t" . 'Mobile' . "\t" . 'Phone' . "\t" . 'Fax' . "\t" . 'Email' . "\t" . ' Error Status' . "\n";

            }

            list($cols,) = $xlsx->dimension();

            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $contact = $this->objGeneral->clean_single_variable($r[0]);
                    $contact_length = strlen($contact);

                    $prev_code = $this->objGeneral->clean_single_variable($r[1]);
                    $prev_code_length = strlen($prev_code);

                    $job_title = $this->objGeneral->clean_single_variable($r[2]);
                    $job_title_length = strlen($job_title);

                    $direct_line = $this->objGeneral->clean_single_variable($r[3]);
                    $direct_line_length = strlen($direct_line);

                    $mobile = $this->objGeneral->clean_single_variable($r[4]);
                    $mobile_length = strlen($mobile);

                    $phone = $this->objGeneral->clean_single_variable($r[5]);
                    $phone_length = strlen($phone);

                    $fax = $this->objGeneral->clean_single_variable($r[6]);
                    $fax_length = strlen($fax);

                    $email = $this->objGeneral->clean_single_variable($r[7]);
                    $email_length = strlen($email);


                    if ($contact_length > 50) {

                        $new_excel .= $contact . "\t" . $prev_code . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $phone . "\t" . $fax . "\t" . $email . "\t" . 'Contact Name Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($prev_code_length > 25) {

                        $new_excel .= $contact . "\t" . $prev_code . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $phone . "\t" . $fax . "\t" . $email . "\t" . 'Previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($job_title_length > 50) {

                        $new_excel .= $contact . "\t" . $prev_code . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $phone . "\t" . $fax . "\t" . $email . "\t" . 'Job Title Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($direct_line_length > 20) {

                        $new_excel .= $contact . "\t" . $prev_code . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $phone . "\t" . $fax . "\t" . $email . "\t" . 'Direct Line Length Exceeds Than Limit 20' . "\n";
                        $error_counter++;

                    } elseif ($mobile_length > 20) {

                        $new_excel .= $contact . "\t" . $prev_code . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $phone . "\t" . $fax . "\t" . $email . "\t" . 'Mobile Length Exceeds Than Limit 20' . "\n";
                        $error_counter++;

                    } elseif ($phone_length > 20) {

                        $new_excel .= $contact . "\t" . $prev_code . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $phone . "\t" . $fax . "\t" . $email . "\t" . 'Phone Length Exceeds Than Limit 20' . "\n";
                        $error_counter++;

                    } elseif ($fax_length > 20) {

                        $new_excel .= $contact . "\t" . $prev_code . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $phone . "\t" . $fax . "\t" . $email . "\t" . 'Fax Length Exceeds Than Limit 20' . "\n";
                        $error_counter++;

                    } elseif ($email_length > 30 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {

                        $new_excel .= $contact . "\t" . $prev_code . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $phone . "\t" . $fax . "\t" . $email . "\t" . 'Email is not valid' . "\n";
                        $error_counter++;

                    } else {


                        $SRM_sql_total = "SELECT  count(c.id) as total,c.id as srm_id	FROM srm c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.prev_code='" . $prev_code . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                        //echo $SRM_sql_total;
                        $srm_rs_count = $this->Conn->Execute($SRM_sql_total);
                        $srm_total = $srm_rs_count->fields['total'];
                        $srm_id = $srm_rs_count->fields['srm_id'];

                        if ($srm_total > 0) {


                            /*$sql_total = "SELECT   count(c.id) as total	FROM  srm_alt_contact  c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.contact_name='" . $contact . "' 	 and srm_id='" . $srm_id . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                            //echo $sql_total;exit;
                            $rs_count = $this->Conn->Execute($sql_total);
                            $total = $rs_count->fields['total'];*/

                            $data_pass = "  tst.contact_name='" . $contact . "' and tst.acc_id='" . $srm_id . " AND tst.module_type='2'";
                            $total = $this->objGeneral->count_duplicate_in_sql('alt_contact', $data_pass, $this->arrUser['company_id']);


                            if ($total == 0) {

                                $Sql = "INSERT INTO alt_contact SET 
                                                            acc_id='" . $srm_id . "', 
                                                            module_type='2', 
                                                            contact_name='" . $contact . "',
                                                            prev_code='" . $prev_code . "',
                                                            job_title='" . $job_title . "',
                                                            direct_line='" . $direct_line . "',
                                                            mobile='" . $mobile . "',
                                                            phone='" . $phone . "',
                                                            fax='" . $fax . "',
                                                            email='" . $email . "',
                                                            company_id='" . $this->arrUser['company_id'] . "', 
                                                            status='1', 
                                                            user_id='" . $this->arrUser['id'] . "',
                                                            AddedOn='" . current_date . "', 
                                                            Addedby='" . $this->arrUser['id'] . "',
                                                            ChangedOn='" . current_date . "', 
                                                            Changedby='" . $this->arrUser['id'] . "', 
                                                            DM_check='1',
                                                            DM_file='" . $DM_file . "'";

                                /*echo $Sql;
                                exit;*/
                                $RS = $this->Conn->Execute($Sql);
                                
                                $new_excel .= $contact . "\t" . $prev_code . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $phone . "\t" . $fax . "\t" . $email . "\t" . '' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $contact . "\t" . $prev_code . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $phone . "\t" . $fax . "\t" . $email . "\t" . 'Duplicate Contact Name' . "\n";
                                $error_counter++;
                            }
                        } else {
                            $new_excel .= $contact . "\t" . $prev_code . "\t" . $job_title . "\t" . $direct_line . "\t" . $mobile . "\t" . $phone . "\t" . $fax . "\t" . $email . "\t" . 'Previous code is not valid' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;

            }

            

        }


        if ($error_counter == 0 && $this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "srm") {
            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=SRM_Contacts_import");
            $path = APP_PATH . '/upload/migration_file/SRM_Contacts/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        } elseif ($seg_type == "supp") {
            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Supplier_Contacts_import");
            $path = APP_PATH . '/upload/migration_file/Supplier_Contacts/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }

    //----------------SRM Location--------------------------

    function import_SRM_Location($arr, $input)
    {
        $seg_type = "";
        $error_counter = 0;
        $success_counter = 0;

        if (isset($input["tp"])) {
            $seg_type = $input["tp"];

            if ($seg_type == "srm") {

            } elseif ($seg_type == "supp") {

            }
        }


        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            if ($seg_type == "srm") {
                $path = APP_PATH . '/upload/migration_file/SRM_Location';
                $sitepath = WEB_PATH . '/upload/migration_file/SRM_Location';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "SRM_Location/" . $file_name . '.xls';
            } elseif ($seg_type == "supp") {
                $path = APP_PATH . '/upload/migration_file/Supplier_Location';
                $sitepath = WEB_PATH . '/upload/migration_file/Supplier_Location';

                $this->makedirs($path);
                $unique_code = $this->objGeneral->get_unique_id_from_db();

                $file_name = $_FILES['file']['name'];
                $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
                $file_name = $file_name . "_" . $unique_code;

                $DM_file = "Supplier_Location/" . $file_name . '.xls';
            }

            list($cols,) = $xlsx->dimension();

            $counter = 0;
            $new_excel = 'Location Name' . "\t" . 'Previous Code' . "\t" . 'Address' . "\t" . 'Address 2' . "\t"  . 'City' . "\t" . 'County' . "\t" . 'Postcode' . "\t" . 'Country' . "\t" . ' Error Status' . "\n";


            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $depot = $this->objGeneral->clean_single_variable($r[0]);
                    $depot_length = strlen($depot);

                    $prev_code = $this->objGeneral->clean_single_variable($r[1]);
                    $prev_code_length = strlen($prev_code);

                    $address = $this->objGeneral->clean_single_variable($r[2]);
                    $address_length = strlen($address);

                    $address_2 = $this->objGeneral->clean_single_variable($r[3]);
                    $address_2_length = strlen($address_2);

                    $city = $this->objGeneral->clean_single_variable($r[4]);
                    $city_length = strlen($city);

                    $county = $this->objGeneral->clean_single_variable($r[5]);
                    $county_length = strlen($county);

                    $postcode = $this->objGeneral->clean_single_variable($r[6]);
                    $postcode_length = strlen($postcode);

                    $country = $this->objGeneral->clean_single_variable($r[7]);
                    $country_length = strlen($country);

                    $country_id = $this->get_data_by_id('country', 'name', $country);


                    if ($depot_length > 150) {

                        $new_excel .= $depot . "\t" . $prev_code . "\t" . $address . "\t" . $address_2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . 'Location Name Length Exceeds Than Limit 150' . "\n";
                        $error_counter++;

                    } elseif ($prev_code_length > 25) {

                        $new_excel .= $depot . "\t" . $prev_code . "\t" . $address . "\t" . $address_2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . 'Previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($address_length > 255) {

                        $new_excel .= $depot . "\t" . $prev_code . "\t" . $address . "\t" . $address_2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . 'Address 1 Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($address_2_length > 255) {

                        $new_excel .= $depot . "\t" . $prev_code . "\t" . $address . "\t" . $address_2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . 'Address 2 Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($city_length > 150) {

                        $new_excel .= $depot . "\t" . $prev_code . "\t" . $address . "\t" . $address_2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . 'City Length Exceeds Than Limit 150' . "\n";
                        $error_counter++;

                    } elseif ($county_length > 150) {

                        $new_excel .= $depot . "\t" . $prev_code . "\t" . $address . "\t" . $address_2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . 'County Length Exceeds Than Limit 150' . "\n";
                        $error_counter++;

                    } elseif ($postcode_length > 50) {

                        $new_excel .= $depot . "\t" . $prev_code . "\t" . $address . "\t" . $address_2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . 'Postcode Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($country_length > 0 && $country_id == "") {

                        $new_excel .= $depot . "\t" . $prev_code . "\t" . $address . "\t" . $address_2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . 'Country is not valid' . "\n";
                        $error_counter++;

                    } else {


                        $SRM_sql_total = "SELECT  count(c.id) as total,c.id as srm_id	FROM srm c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.prev_code='" . $prev_code . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                        //echo $SRM_sql_total;
                        $srm_rs_count = $this->Conn->Execute($SRM_sql_total);
                        $srm_total = $srm_rs_count->fields['total'];
                        $srm_id = $srm_rs_count->fields['srm_id'];

                        if ($srm_total > 0) {


                            /*$sql_total = "SELECT   count(c.id) as total	FROM  srm_alt_depot  c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.depot='" . $depot . "' 	 and srm_id='" . $srm_id . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                            //echo $sql_total;exit;
                            $rs_count = $this->Conn->Execute($sql_total);
                            $total = $rs_count->fields['total'];*/

                            $data_pass = "  tst.depot='" . $depot . "'and tst.acc_id='" . $srm_id . " AND tst.module_type='2'";
                            $total = $this->objGeneral->count_duplicate_in_sql('alt_depot', $data_pass, $this->arrUser['company_id']);

                            if ($total == 0) {
                                $Sql = "INSERT INTO alt_depot SET
                                                        acc_id='" . $srm_id . "', 
                                                        module_type='2',
                                                        prev_code='" . $prev_code . "',
                                                        depot='" . $depot . "',
                                                        address='" . $address . "',
                                                        address_2='" . $address_2 . "',
                                                        city='" . $city . "',
                                                        county='" . $county . "',
                                                        postcode='" . $postcode . "',
                                                        country='" . $country_id . "',
                                                        company_id='" . $this->arrUser['company_id'] . "', 
                                                        status='1', 
                                                        user_id='" . $this->arrUser['id'] . "',
                                                        AddedOn='" . current_date . "', 
                                                        Addedby='" . $this->arrUser['id'] . "',
                                                        ChangedOn='" . current_date . "', 
                                                        Changedby='" . $this->arrUser['id'] . "',  
                                                        DM_check='1',
                                                        DM_file='" . $DM_file . "'";
                                
                                /*   echo $Sql;
                                exit;   */
                                $RS = $this->Conn->Execute($Sql);

                                $new_excel .= $depot . "\t" . $prev_code . "\t" . $address . "\t" . $address_2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . '' . "\n";
                                $success_counter++;

                            } else {
                                $new_excel .= $depot . "\t" . $prev_code . "\t" . $address . "\t" . $address_2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . 'Duplicate Location Name' . "\n";
                                $error_counter++;
                            }
                        } else {
                            $new_excel .= $depot . "\t" . $prev_code . "\t" . $address . "\t" . $address_2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . 'Previous code is not valid' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;

            }

            

        }


        if ($error_counter == 0 && $this->Conn->Affected_Rows() > 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        if ($seg_type == "srm") {
            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=SRM_Location_import");
            $path = APP_PATH . '/upload/migration_file/SRM_Location/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        } elseif ($seg_type == "supp") {
            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=Supplier_Location_import");
            $path = APP_PATH . '/upload/migration_file/Supplier_Location/' . $file_name . '.xls';
            file_put_contents($path, $new_excel);
        }

        return $response;
    }



    //----------------*******************--------------------------
    //----------------      Supplier           --------------------
    //----------------*******************--------------------------

    //----------------Supplier General--------------------------
    function import_Supplier_Gen($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Supplier_Gen';
            $sitepath = WEB_PATH . '/upload/migration_file/Supplier_Gen';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Supplier_Gen/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();

            $counter = 0;
            $response['error'] = '';
            $new_excel =                  'Supplier Previous Code' . "\t" 
                                        . 'Supplier Name' . "\t" 
                                        . 'Address' . "\t" 
                                        . 'Address 2' . "\t" 
                                        . 'City' . "\t" 
                                        . 'County' . "\t" 
                                        . 'Postcode' . "\t" 
                                        . 'Country' . "\t" 
                                        . 'Telephone' . "\t" 
                                        . 'Fax' . "\t" 
                                        . 'Web' . "\t" 
                                        . 'Location Type' . "\t" 
                                        . 'Purchaser Code' . "\t" 
                                        . 'Classification' . "\t" 
                                        . 'Segment' . "\t" 
                                        . 'Selling Group' . "\t" 
                                        . 'Territory' . "\t" 
                                        . 'Currency' . "\t" 
                                        . 'Last PO Date' . "\t" 
                                        . 'Social Media' . "\t" 
                                        . 'Social Media 1 - Name' . "\t" 
                                        . 'Social Media 1 � ID' . "\t" 
                                        . 'Social Media 2 - Name' . "\t" 
                                        . 'Social Media 2 � ID' . "\t" 
                                        . 'Social Media 3 - Name' . "\t" 
                                        . 'Social Media 3 � ID' . "\t" 
                                        . 'Social Media 4 - Name' . "\t" 
                                        . 'Social Media 4 � ID' . "\t" 
                                        . 'Social Media 5 - Name' . "\t" 
                                        . 'Social Media 5 � ID' . "\t" 
                                        . ' Error Status' .  "\n";

            //echo "<pre>";print_r($xlsx->rows());exit;

            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $code_attr = array('tb' => 'supplier', 'no' => 'supplier_no');

                    $code_find = array();
                    $code_find = $this->getCode($code_attr);
                    /* print_r($code_find);
                    exit; */
                    if ($code_find['ack'] == 0) {
                        $response['ack'] = 0;
                        $response['error'] = $code_find['error'];
                        return $response;
                        // exit;
                    }
                    //echo $code_find['code'] . "'  ,'" . $code_find['nubmer'];

                    //$suppliername = strtolower($this->objGeneral->clean_single_variable($r[0]));

                    $prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prev_code_length = strlen($prev_code);

                    $suppliername = $this->objGeneral->clean_single_variable($r[1]);
                    $suppliername_length = strlen($suppliername);

                    $address = $this->objGeneral->clean_single_variable($r[2]);
                    $address_length = strlen($address);

                    $address2 = $this->objGeneral->clean_single_variable($r[3]);
                    $address2_length = strlen($address2);

                    $city = $this->objGeneral->clean_single_variable($r[3]);
                    $city_length = strlen($city);

                    $county = $this->objGeneral->clean_single_variable($r[3]);
                    $county_length = strlen($county);

                    $postcode = $this->objGeneral->clean_single_variable($r[3]);
                    $postcode_length = strlen($postcode);

                    $country = $this->objGeneral->clean_single_variable($r[3]);
                    $country_length = strlen($country);

                    $telephone = $this->objGeneral->clean_single_variable($r[4]);
                    $telephone_length = strlen($telephone);

                    $fax = $this->objGeneral->clean_single_variable($r[5]);
                    $fax_length = strlen($fax);

                    $web = $this->objGeneral->clean_single_variable($r[6]);
                    $web_length = strlen($web);

                    /* $location_type = $this->objGeneral->clean_single_variable($r[7]);
                    $location_type_length = strlen($location_typename); */

                    /* $purchaser_code = $this->objGeneral->clean_single_variable($r[8]);
                    $purchaser_code_length = strlen($purchaser_code); */

                    $classification = $this->objGeneral->clean_single_variable($r[12]);
                    $classification_length = strlen($classification);

                    $segment = $this->objGeneral->clean_single_variable($r[9]);
                    $segment_length = strlen($segment);
                    
                    $selling_group = $this->objGeneral->clean_single_variable($r[8]);
                    $selling_group_length = strlen($selling_group);

                    $territory = $this->objGeneral->clean_single_variable($r[8]);
                    $territory_length = strlen($territory);

                    $currency = $this->objGeneral->clean_single_variable($r[8]);
                    $currency_length = strlen($currency);

                    $last_po_date = $this->objGeneral->clean_single_variable($r[8]);
                    $validate_last_po_date = $this->validateDate($last_po_date);

                    if ($validate_last_po_date > 0) {

                    } else {
                        $unixDateVal = $xlsx->unixstamp($last_po_date);
                        $last_po_date = date('d/m/Y', $unixDateVal);
                        $validate_last_po_date = $this->validateDate($last_po_date);
                    }

                    $social_media1 = $this->objGeneral->clean_single_variable($r[13]);
                    $socialMediaValue1 = $this->objGeneral->clean_single_variable($r[14]);
                    $socialMediaValue1_length = strlen($socialMediaValue1);

                    $social_media2 = $this->objGeneral->clean_single_variable($r[15]);
                    $socialMediaValue2 = $this->objGeneral->clean_single_variable($r[16]);
                    $socialMediaValue2_length = strlen($socialMediaValue2);

                    $social_media3 = $this->objGeneral->clean_single_variable($r[17]);
                    $socialMediaValue3 = $this->objGeneral->clean_single_variable($r[18]);
                    $socialMediaValue3_length = strlen($socialMediaValue3);

                    $social_media4 = $this->objGeneral->clean_single_variable($r[19]);
                    $socialMediaValue4 = $this->objGeneral->clean_single_variable($r[20]);
                    $socialMediaValue4_length = strlen($socialMediaValue4);

                    $social_media5 = $this->objGeneral->clean_single_variable($r[21]);
                    $socialMediaValue5 = $this->objGeneral->clean_single_variable($r[22]);
                    $socialMediaValue5_length = strlen($socialMediaValue5);

                    $segment_type = " and segment_type=1";

                    $classification_id = $this->get_data_by_id('ref_classification', 'name', $classification);
                    $country_id = $this->get_data_by_id('country', 'iso', $country);
                    $region_id = $this->get_data_by_id('country', 'iso', $selling_group);
                    $currency_id = $this->get_data_by_id_company('currency', 'code', $currency);
                    $segment_id = $this->get_data_by_id_company('crm_segment', 'title', $segment,' AND segment_type=2');
                    $selling_group_id = $this->get_data_by_id_company('crm_segment', 'title', $segment,' AND segment_type=2');
                    $social_media1_id = $this->get_data_by_id('ref_social_media', 'name', $social_media1);
                    $social_media2_id = $this->get_data_by_id('ref_social_media', 'name', $social_media2);
                    $social_media3_id = $this->get_data_by_id('ref_social_media', 'name', $social_media3);
                    $social_media4_id = $this->get_data_by_id('ref_social_media', 'name', $social_media4);
                    $social_media5_id = $this->get_data_by_id('ref_social_media', 'name', $social_media5);

                    /* $Sql_segment = "SELECT id FROM crm WHERE title='" . $segment . "' && type='SEGMENT' LIMIT 1";
                    //echo $Sql;exit;
                    $rs_count_segment = $this->Conn->Execute($Sql_segment);
                    $segment_id = $rs_count_segment->fields['id']; */

                    if ($prev_code_length > 25) {

                        $new_excel .= $prev_code . "\t" . $suppliername . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $telephone . "\t" . $fax . "\t" . $web . "\t" . $purchaser_code . "\t" . $classification . "\t" . $segment . "\t" . $selling_group . "\t" . $territory . "\t" . $currency . "\t" . $last_po_date . "\t" . 'Supplier previous Code Length Exceeds Than Limit 25' . "\n";
                        $error_counter++;

                    } elseif ($suppliername_length > 150) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Supplier Name Length Exceeds Than Limit 150' . "\n";
                        $error_counter++;

                    } elseif ($address_length > 255) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Address 1 Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($address2_length > 255) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Address 2 Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($city_length > 50) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'City Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($county_length > 50) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'County Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($postcode_length > 50) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Postcode Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($webadd_length > 200) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Web Address Length Exceeds Than Limit 200' . "\n";
                        $error_counter++;

                    } elseif ($classification_length > 200) {

                        $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Web Address Length Exceeds Than Limit 200' . "\n";
                        $error_counter++;

                    } else {


                        /*$sql_total = "SELECT count(ef.id) as total
                                    FROM srm ef
                                    JOIN company ON company.id = ef.company_id
                                    WHERE (ef.name='" . $suppliername . "' OR ef.prev_code='" . $prev_code . "') AND ef.status=1 AND ef.type =3
                                    and (ef.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    ";
                       // echo $sql_total;
                       // exit;
                        $rs_count = $this->Conn->Execute($sql_total);
                        $total = $rs_count->fields['total'];*/


                        $data_pass = "  (tst.name='" . $suppliername . "' OR tst.prev_code='" . $prev_code . "') AND tst.status=1 AND tst.type =3";
                        $total = $this->objGeneral->count_duplicate_in_sql('srm', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {


                            $Sql = "INSERT INTO srm SET
                                        prev_code='" . $prev_code . "'
                                        ,supplier_code='" . $code_find['code'] . "'
                                        ,name='" . $suppliername . "'
                                        ,address_1='" . $address . "'
                                        ,address_2='" . $address2 . "'
                                        ,city='" . $city . "'
                                        ,county='" . $county . "'
                                        ,postcode='" . $postcode . "'
                                        ,country_id='" . $country_id . "'
                                        ,phone='" . $telephone . "'
                                        ,fax='" . $fax . "'
                                        ,web_address='" . $web . "'
                                        ,status='1'
                                        ,srm_classification='" . $classification . "'
                                        ,segment_id='" . $segment_id . "'
                                        ,selling_grp_id='" . $selling_group_id . "'
                                        ,region_id='" . $region_id . "'
                                        ,type='3'
                                        ,unique_id='0'
                                        ,company_id='" . $this->arrUser['company_id'] . "'
                                        ,user_id='" . $this->arrUser['id'] . "'
                                        ,DM_check=1
                                        ,DM_file='" . $DM_file . "'
                                        ";
                            // echo  $Sql;exit;
                            $RS = $this->Conn->Execute($Sql);


                            $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . '' . "\n";
                            $success_counter++;

                        } else {
                            $error_counter++;
                            $new_excel .= $suppliername . "\t" . $prev_code . "\t" . $address . "\t" . $address2 . "\t" . $city . "\t" . $county . "\t" . $postcode . "\t" . $country . "\t" . $webadd . "\t" . $segment . "\t" . 'Duplicate Supplier Name' . "\n";

                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Supplier_Gen_import");
        $path = APP_PATH . '/upload/migration_file/Supplier_Gen/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }

    //----------------Rebate------------------------------------

    function import_Rebate($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Rebate';
            $sitepath = WEB_PATH . '/upload/migration_file/Rebate';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "Rebate/" . $file_name . '.xls';

            $new_excel = 'Rebate Name' . "\t" . 'Rebate Charge (Without Percentage sign)' . "\t" . ' Error Status' . "\n";

            list($cols,) = $xlsx->dimension();
            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $rebate_name = $this->objGeneral->clean_single_variable($r[0]);
                    $rebate_name_length = strlen($rebate_name);

                    $rebate_value = $this->objGeneral->clean_single_variable($r[1]);
                    $rebate_value_length = strlen($rebate_value);

                    if ($rebate_value_length == 0) {

                        $new_excel .= $rebate_name . "\t" . $rebate_value . "\t" . ' Rebate Charge is Empty' . "\n";
                        $error_counter++;

                    } elseif ($rebate_name_length > 50) {

                        $new_excel .= $rebate_name . "\t" . $rebate_value . "\t" . ' Rebate Name Length Exceeds than Limit 50' . "\n";
                        $error_counter++;

                    } else {

                        /* $sql_total = "SELECT  count(c.id) as total	FROM overrider c
                                     LEFT JOIN company on company.id=c.company_id
                                     where  	c.name='" . $rebate_name . "' && c.value='" . $rebate_value . "'
                                     AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                     limit 1";

                         $rs_count = $this->Conn->Execute($sql_total);
                         $total = $rs_count->fields['total'];*/

                        $data_pass = "  tst.name='" . $rebate_name . "' && tst.value='" . $rebate_value . "' ";
                        $total = $this->objGeneral->count_duplicate_in_sql('overrider', $data_pass, $this->arrUser['company_id']);


                        if ($total == 0) {

                            $Sql = "INSERT INTO overrider SET
                                        name='" . $rebate_name . "'
                                        ,value='" . $rebate_value . "'
                                        ,company_id='" . $this->arrUser['company_id'] . "'
                                        ,user_id='" . $this->arrUser['id'] . "'                                          
                                        ,status='1'
                                        ,AddedBy='" . $this->arrUser['id'] . "'
                                        ,AddedOn='" . current_date . "'
                                        ,DM_check=1
                                        ,DM_file='" . $DM_file . "'
                                        ";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $rebate_name . "\t" . $rebate_value . "\t" . ' ' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $rebate_name . "\t" . $rebate_value . "\t" . ' Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {

                            $new_excel .= $rebate_name . "\t" . $rebate_value . "\t" . ' Record Already Exists' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Payment_Method_import");
        $path = APP_PATH . '/upload/migration_file/Payment_Method/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);


        return $response;
    }

    //----------------Supplier Finance--------------------------

    function import_Supplier_Finance($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Supplier_Finance';
            $sitepath = WEB_PATH . '/upload/migration_file/Supplier_Finance';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;

            $DM_file = "Supplier_Finance/" . $file_name . '.xls';

            $new_excel = 'Supplier Previous Code' . "\t" . 'Contact Person' . "\t" . 'Email' . "\t" . 'Telephone' . "\t" . 'Fax' . "\t" . 'Alt. Contact Person' . "\t" . 'Alt. Contact Email' . "\t" . 'Payment Terms' . "\t" . 'Payment Method' . "\t" . 'Supplier Group ' . "\t" . 'Rebate' . "\t" . 'Company Reg. No.' . "\t" . 'VAT Number' . "\t" . 'VAT Bus. Group ' . "\t" . 'Payable Bank' . "\t" . 'Bill to Supplier' . "\t" . 'Account Payable' . "\t" . 'Purchase Account' . "\t" . 'Supplier Account name' . "\t" . 'Supplier Sort Code' . "\t" . 'Supplier Account No' . "\t" . 'Supplier Bank Name' . "\t" . 'Supplier Swift/BIC' . "\t" . 'Supplier IBAN' . "\t" . ' Error Status' . "\n";

            list($cols,) = $xlsx->dimension();
            $counter = 0;


            foreach ($xlsx->rows() as $k => $r) {

                if ($counter > 0 && !empty($r[0])) {

                    $prev_code = $this->objGeneral->clean_single_variable($r[0]);
                    $prev_code_length = strlen($prev_code);

                    $person_name = $this->objGeneral->clean_single_variable($r[1]);
                    $person_name_length = strlen($person_name);

                    $email = $this->objGeneral->clean_single_variable($r[2]);
                    $email_length = strlen($email);

                    $phone = $this->objGeneral->clean_single_variable($r[3]);
                    $phone_length = strlen($phone);

                    $fax = $this->objGeneral->clean_single_variable($r[4]);
                    $fax_length = strlen($fax);

                    $alt_person_name = $this->objGeneral->clean_single_variable($r[5]);
                    $alt_person_name_length = strlen($alt_person_name);

                    $alt_person_email = $this->objGeneral->clean_single_variable($r[6]);
                    $alt_person_email_length = strlen($alt_person_email);

                    $pay_terms = $this->objGeneral->clean_single_variable($r[7]);
                    $pay_terms_length = strlen($pay_terms);

                    $pay_method = $this->objGeneral->clean_single_variable($r[8]);
                    $pay_method_length = strlen($pay_method);

                    $supp_grp = $this->objGeneral->clean_single_variable($r[9]);
                    $supp_grp_length = strlen($supp_grp);

                    $rebate = $this->objGeneral->clean_single_variable($r[10]);
                    $rebate_length = strlen($rebate);

                    $comp_reg = $this->objGeneral->clean_single_variable($r[11]);
                    $comp_reg_length = strlen($comp_reg);

                    $vat_num = $this->objGeneral->clean_single_variable($r[12]);
                    $vat_num_length = strlen($vat_num);

                    $vat_bus_grp = $this->objGeneral->clean_single_variable($r[13]);
                    $vat_bus_grp_length = strlen($vat_bus_grp);

                    $pay_bank = $this->objGeneral->clean_single_variable($r[14]);
                    $pay_bank_length = strlen($pay_bank);

                    $bill_to_supp = $this->objGeneral->clean_single_variable($r[15]);
                    $bill_to_supp_length = strlen($bill_to_supp);

                    $account_payable = $this->objGeneral->clean_single_variable($r[16]);
                    $account_payable_length = strlen($account_payable);

                    $pur_account = $this->objGeneral->clean_single_variable($r[17]);
                    $pur_account_length = strlen($pur_account);

                    /*====================*/

                    $supp_account_name = $this->objGeneral->clean_single_variable($r[18]);
                    $supp_account_name_length = strlen($supp_account_name);

                    $supp_sortcode = $this->objGeneral->clean_single_variable($r[19]);
                    $supp_sortcode_length = strlen($supp_sortcode);

                    $supp_accountno = $this->objGeneral->clean_single_variable($r[20]);
                    $supp_accountno_length = strlen($supp_accountno);

                    $supp_bankname = $this->objGeneral->clean_single_variable($r[21]);
                    $supp_bankname_length = strlen($supp_bankname);

                    $supp_swiftcode = $this->objGeneral->clean_single_variable($r[22]);
                    $supp_swiftcode_length = strlen($supp_swiftcode);

                    $supp_IBAN = $this->objGeneral->clean_single_variable($r[23]);
                    $supp_IBAN_length = strlen($supp_IBAN);


                    /*====================*/

                    $bank_id = $this->get_data_by_id('bank_account', 'account_name', $pay_bank);
                    $payment_terms_id = $this->get_data_by_id('payment_terms', 'name', $pay_terms);
                    $pay_method_id = $this->get_data_by_id('payment_methods', 'name', $pay_method);
                    $rebate_id = $this->get_data_by_id('overrider', 'value', $rebate);


                    $Sql_vat_bus_grp = "SELECT id FROM site_constants WHERE title='" . $vat_bus_grp . "' && type='VAT_BUS_POSTING_GROUP' LIMIT 1";
                    $rs_vat_bus_grp = $this->Conn->Execute($Sql_vat_bus_grp);
                    $vat_bus_grp_id = $rs_vat_bus_grp->fields['id'];


                    $Sql_supp_grp = "SELECT id FROM site_constants WHERE title='" . $supp_grp . "' && type='CUST_POSTING_GROUP' LIMIT 1";
                    $rs_supp_grp = $this->Conn->Execute($Sql_supp_grp);
                    $supp_grp_id = $rs_supp_grp->fields['id'];


                    $bill_to_supp_sql_total = "SELECT  c.id as supplier_id	FROM srm c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.prev_code='" . $bill_to_supp . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";

                    $bill_to_supp_rs_count = $this->Conn->Execute($bill_to_supp_sql_total);
                    $bill_to_supp_id = $bill_to_supp_rs_count->fields['supplier_id'];


                    if ($prev_code_length == 0 || $prev_code_length > 25) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Previous Code Length Exceeds Than Limit 25 or Previous Code is Empty' . "\n";
                        $error_counter++;

                    } elseif ($email_length > 50 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Email is not valid' . "\n";
                        $error_counter++;

                    } elseif ($alt_person_email_length > 50 || !filter_var($alt_person_email, FILTER_VALIDATE_EMAIL)) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Alt.person Email is not valid' . "\n";
                        $error_counter++;

                    } elseif ($person_name_length > 100) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Person Name Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } elseif ($alt_person_name_length > 100) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Alt.person Name Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } elseif ($phone_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Phone Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($vat_num_length > 255) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' VAT Number Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($fax_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Fax Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($phone_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Phone Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($comp_reg_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Company Reg Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($account_payable_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Account Payable Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($pur_account_length > 50) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Purchase Account Length Exceeds Than Limit 50' . "\n";
                        $error_counter++;

                    } elseif ($bank_id == 0 && $pay_bank_length > 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Bank Account is invalid' . "\n";
                        $error_counter++;

                    } elseif ($rebate_id == 0 && $rebate_length > 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Rebate is invalid' . "\n";
                        $error_counter++;

                    } elseif ($bill_to_supp_id == 0 && $bill_to_supp_length > 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Bill to Supplier Previous code is invalid' . "\n";
                        $error_counter++;

                    } elseif ($payment_terms_id == 0 && $pay_terms_length > 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Payment Terms is invalid' . "\n";
                        $error_counter++;

                    } elseif ($pay_method_id == 0 && $pay_method_length > 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Payment Method is invalid' . "\n";
                        $error_counter++;

                    } elseif ($vat_bus_grp_id == 0 || $vat_bus_grp_length == 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' VAT Bus. Group is invalid' . "\n";
                        $error_counter++;

                    } elseif ($supp_grp_id == 0 && $supp_grp_length > 0) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Supplier Group is invalid' . "\n";
                        $error_counter++;

                    } elseif ($supp_account_name_length > 200) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Supplier Account Name Length Exceeds Than Limit 200' . "\n";
                        $error_counter++;

                    } elseif ($supp_accountno_length > 200) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Supplier Account No Length Exceeds Than Limit 200' . "\n";
                        $error_counter++;

                    } elseif ($supp_sortcode_length > 200) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Supplier Sort Code Length Exceeds Than Limit 200' . "\n";
                        $error_counter++;

                    } elseif ($supp_bankname_length > 255) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Supplier Bank Name Length Exceeds Than Limit 255' . "\n";
                        $error_counter++;

                    } elseif ($supp_swiftcode_length > 100) {

                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Supplier Swift Code / BIC Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } elseif ($supp_IBAN_length > 100) {
                        $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Supplier IBAN Length Exceeds Than Limit 100' . "\n";
                        $error_counter++;

                    } else {


                        $supplier_sql_total = "SELECT  count(c.id) as total,c.supplier_code,c.id as supplier_id	FROM srm c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.prev_code='" . $prev_code . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";

                        $supplier_rs_count = $this->Conn->Execute($supplier_sql_total);
                        $supplier_total = $supplier_rs_count->fields['total'];
                        $supplier_id = $supplier_rs_count->fields['supplier_id'];
                        $supplier_code = $supplier_rs_count->fields['supplier_code'];


                        /*$finance_sql_total = "SELECT  count(id) as total FROM  srm_finance  where supplier_id='" . $supplier_id . "' && company_id='" . $this->arrUser['company_id'] . "' && user_id='" . $this->arrUser['id'] . "'";

                        $finance_rs_count = $this->Conn->Execute($finance_sql_total);
                        $finance_total = $finance_rs_count->fields['total'];*/

                        $data_pass = "  tst.supplier_id='" . $supplier_id . "' ";
                        $finance_total = $this->objGeneral->count_duplicate_in_sql('srm_finance', $data_pass, $this->arrUser['company_id']);

                        if ($finance_total > 0) {

                            $finance_sql_delete = "DELETE FROM srm_finance  where supplier_id='" . $supplier_id . "' && company_id='" . $this->arrUser['company_id'] . "' && user_id='" . $this->arrUser['id'] . "'";
                            $finance_del = $this->Conn->Execute($finance_sql_delete);
                        }


                        if ($supplier_total > 0) {


                            $Sql = "INSERT INTO srm_finance SET
                                        supplier_id='" . $supplier_id . "',
                                        contact_person='" . $person_name . "',
                                        bill_to_customer='" . $bill_to_supp_id . "',
                                        alt_contact_person='" . $alt_person_name . "',
                                        alt_contact_email='" . $alt_person_email . "',
                                        email='" . $email . "',
                                        phone='" . $phone . "',
                                        fax='" . $fax . "',
                                        
                                        payment_terms_id='" . $payment_terms_id . "',
                                        payment_method_id='" . $pay_method_id . "',
                                        bank_account_id='" . $bank_id . "',
                                        bank_name='" . $pay_bank . "',
                                        generate='',
                                        finance_charges_id='',
                                        insurance_charges_id='',
                                        
                                        vat_number='" . $vat_num . "',
                                        vat_bus_posting_group='" . $vat_bus_grp_id . "',
                                        customer_posting_group='" . $supp_grp_id . "',
                                        company_reg_no='" . $comp_reg . "',
                                        account_payable_number='" . $account_payable . "',
                                        purchase_code_number='" . $pur_account . "',
                                        
                                        account_name='" . $supp_account_name . "',
                                        sort_code='" . $supp_sortcode . "',
                                        account_no='" . $supp_accountno . "',
                                        bill_bank_name='" . $supp_bankname . "',
                                        swift_no='" . $supp_swiftcode . "',
                                        iban='" . $supp_IBAN . "',
                                        
                                        status='1',
                                        type='1',
                                        company_id='" . $this->arrUser['company_id'] . "',
                                        user_id='" . $this->arrUser['id'] . "',
                                        AddedBy='" . $this->arrUser['id'] . "',
                                        AddedOn='" . current_date . "',
                                        DM_check=1,
                                        DM_file='" . $DM_file . "'
                                        ";

                            $RS = $this->Conn->Execute($Sql);
                            $last_insert_id = $this->Conn->Insert_ID();

                            if ($last_insert_id > 0) {

                                $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' ' . "\n";
                                $success_counter++;

                            } else {

                                $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Error in Database Query' . "\n";
                                $error_counter++;
                            }

                        } else {

                            $new_excel .= $prev_code . "\t" . $person_name . "\t" . $email . "\t" . $phone . "\t" . $fax . "\t" . $alt_person_name . "\t" . $alt_person_email . "\t" . $pay_terms . "\t" . $pay_method . "\t" . $supp_grp . "\t" . $rebate . "\t" . $comp_reg . "\t" . $vat_num . "\t" . $vat_bus_grp . "\t" . $pay_bank . "\t" . $bill_to_supp . "\t" . $account_payable . "\t" . $pur_account . "\t" . $supp_account_name . "\t" . $supp_sortcode . "\t" . $supp_accountno . "\t" . $supp_bankname . "\t" . $supp_swiftcode . "\t" . $supp_IBAN . "\t" . ' Previous code is not valid' . "\n";
                            $error_counter++;
                        }
                    }
                }
                $counter++;
            }
        }


        if ($error_counter == 0) {

            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';

        } elseif ($error_counter == 1) {

            $response['ack'] = 0;
            $response['error'] = 'One Record Is Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';

        } else {

            $response['ack'] = 0;
            $response['error'] = $error_counter . ' Records Are Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }


        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Supplier_Finance_import");
        $path = APP_PATH . '/upload/migration_file/Supplier_Finance/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);


        return $response;
    }


    //----------------*******************--------------------------
    //----------------      HR           --------------------------
    //----------------*******************--------------------------

    function import_depratment($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Depratment';
            $sitepath = WEB_PATH . '/upload/migration_file/Depratment';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Depratment/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();
            $Sql = "INSERT INTO config_departments (name,code, status, company_id, AddedOn, user_id,DM_check,DM_file) VALUES () ";

            $counter = 0;
            $new_excel = 'Name' . "\t" . 'Code' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0) {

                    $name = $this->objGeneral->clean_single_variable($r[0]);
                    $code = $this->objGeneral->clean_single_variable($r[1]);


                    /*$sql_total = "SELECT   count(c.id) as total	FROM  departments  c
                            LEFT JOIN company on company.id=c.company_id
                            where  	c.name='" . $name . "'
                            AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                            limit 1";
                    //echo $sql_total;exit;
                    $rs_count = $this->Conn->Execute($sql_total);
                    $total = $rs_count->fields['total'];*/

                    $data_pass = "  tst.name='" . $name . "'";
                    $total = $this->objGeneral->count_duplicate_in_sql('departments', $data_pass, $this->arrUser['company_id']);

                    if ($total == 0) {
                        $Sql .= "(  '" . $name . "', '" . $code . "', 1,'" . $this->arrUser['company_id'] . "','" . current_date . "'," . "'" . $this->arrUser['id'] . "','1','" . $DM_file . "')  , ";
                        $new_excel .= $name . "\t" . $code . "\n";
                        $success_counter++;
                    } else {
                        //$response['error'] .= '"' . $name . '" Record Rejected. <br></br><br /> \n \r\n ';
                        $new_excel .= $name . "\t" . $code . "\t" . 'Duplicate Department Name' . "\n";
                    }
                }
                $counter++;

            }

            $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
            //echo  $Sql;exit;
            $RS = $this->Conn->Execute($Sql);

        }


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }
        // echo $path.'/'.$file_name;

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Depratment_import");
        $path = APP_PATH . '/upload/migration_file/Depratment/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }

    function import_emplyeetype($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Employee_Type';
            $sitepath = WEB_PATH . '/upload/migration_file/Employee_Type';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Employee_Type/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();
            $Sql = "INSERT INTO employee_type (name,code, status, user_id, company_id,DM_check,DM_file) VALUES ";

            $counter = 0;
            $new_excel = 'Name' . "\t" . 'Code' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $name = $this->objGeneral->clean_single_variable($r[0]);
                    $code = $this->objGeneral->clean_single_variable($r[1]);


                    /*$sql_total = "SELECT   count(c.id) as total	FROM  employee_type  c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	c.name='" . $name . "'
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                    //echo $sql_total;exit;
                    $rs_count = $this->Conn->Execute($sql_total);
                    $total = $rs_count->fields['total'];*/

                    $data_pass = "  tst.name='" . $name . "' ";
                    $total = $this->objGeneral->count_duplicate_in_sql('employee_type', $data_pass, $this->arrUser['company_id']);

                    if ($total == 0) {
                        $Sql .= "(  '" . $name . "', '" . $code . "', 1,'" . $this->arrUser['id'] . "','" . $this->arrUser['company_id'] . "','1','" . $DM_file . "')  , ";
                        $new_excel .= $name . "\t" . $code . "\n";
                        $success_counter++;

                    } else {
                        //$response['error'] .= '"' . $name . '" Record Rejected. <br></br><br /> \n \r\n ';
                        $new_excel .= $name . "\t" . $code . "\t" . 'Duplicate Employee Type Name' . "\n";
                    }
                }
                $counter++;

            }

            $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
            //echo  $Sql;exit;
            $RS = $this->Conn->Execute($Sql);

        }


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }
        // echo $path.'/'.$file_name;

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Employee_Type_import");
        $path = APP_PATH . '/upload/migration_file/Employee_Type/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }

    function import_religion($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);

            $path = APP_PATH . '/upload/migration_file/Religion';
            $sitepath = WEB_PATH . '/upload/migration_file/Religion';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Religion/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();
            $Sql = "INSERT INTO employee_religion (name, status,user_id, company_id, code,DM_check,DM_file) VALUES ";

            $counter = 0;
            $new_excel = 'Name' . "\t" . 'Code' . "\t" . ' Error Status' . "\n";

            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $name = $this->objGeneral->clean_single_variable($r[0]);
                    $code = $this->objGeneral->clean_single_variable($r[1]);


                    /*$sql_total = "SELECT   count(c.id) as total	FROM  employee_religion  c
                                LEFT JOIN company on company.id=c.company_id
                                where  	c.name='" . $name . "'
                                AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                limit 1";
                    //echo $sql_total;exit;
                    $rs_count = $this->Conn->Execute($sql_total);
                    $total = $rs_count->fields['total'];*/

                    $data_pass = "  tst.name='" . $name . "' ";
                    $total = $this->objGeneral->count_duplicate_in_sql('employee_religion', $data_pass, $this->arrUser['company_id']);

                    if ($total == 0) {
                        $Sql .= "(  '" . $name . "', 1,'" . $this->arrUser['id'] . "'," . $this->arrUser['company_id'] . "','" . $code . "','1','" . $DM_file . "' )  , ";
                        $new_excel .= $name . "\t" . $code . "\n";
                        $success_counter++;

                    } else {

                        //$response['error'] .= '"' . $name . '" Record Rejected. <br></br><br /> \n \r\n ';
                        $new_excel .= $name . "\t" . $code . "\t" . 'Duplicate Religion Name' . "\n";
                        $error_counter++;
                    }
                }
                $counter++;

            }

            $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
            //echo  $Sql;exit;
            $RS = $this->Conn->Execute($Sql);

        }


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Religion_import");
        $path = APP_PATH . '/upload/migration_file/Religion/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }

    function import_hr($arr, $input)
    {
        $error_counter = 0;
        $success_counter = 0;

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);


            $path = APP_PATH . '/upload/migration_file/Employees';
            $sitepath = WEB_PATH . '/upload/migration_file/Employees';

            $this->makedirs($path);
            $unique_code = $this->objGeneral->get_unique_id_from_db();

            $file_name = $_FILES['file']['name'];
            $file_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $file_name);
            $file_name = $file_name . "_" . $unique_code;//time();

            $DM_file = "Employees/" . $file_name . '.xls';

            list($cols,) = $xlsx->dimension();


            $Sql = "INSERT INTO employees (user_code,user_password,user_email,user_type,job_title,first_name,middle_name,last_name,
                    known_as,department,line_manager_name,start_date,employee_type,address_1,address_2,city,country,post_code, internal_extention,work_phone,
                    mobile_phone,home_phone,personal_email,work_email,skype_id,	linked_id,date_of_birth,insurance_number,entitle_holiday,ethical_origin,religion,
                    next_of_kin,next_of_kin_phone,next_of_kin_email,next_of_kin_mobile,relation_kin,salary,salary_type,over_time_rate,bonus,commission,salary_date,
                    salary_date_review,ee_pention,ee_start_date,ee_change_date,ee_end_date,
                    status,company_id, date_added, user_id,DM_check,DM_file) VALUES ";

            $counter = 0;
            $new_excel = 'Employee Code' . "\t" . 'Email' . "\t" . 'Password' . "\t" . 'Job Title' . "\t" . 'First Name' . "\t" . 'Middle name' . "\t" . 'last name' . "\t" . 'Known as' . "\t" . 'Department' . "\t" . 'line_manager_name' . "\t" . 'start_date' . "\t" . 'Employment Type' . "\t" . 'Active Date' . "\t" . 'Address 1' . "\t" . 'Address 2' . "\t" . 'city' . "\t" . 'county' . "\t" . 'postcode' . "\t" . 'country' . "\t" . 'Internal Extension' . "\t" . 'work Telephone' . "\t" . 'mobile phone' . "\t" . 'Home phone' . "\t" . 'Personal email' . "\t" . 'work_email' . "\t" . 'skype_id' . "\t" . 'Linkedin ID' . "\t" . 'date_of_birth' . "\t" . 'National Insurance No.' . "\t" . 'Entitled Holidays' . "\t" . 'Ethnic Origin' . "\t" . 'Religion' . "\t" . 'Next of Kin Name' . "\t" . 'Next of Kin Relation' . "\t" . 'Next of Kin Home Phone' . "\t" . 'Next of Kin Mobile Phone' . "\t" . 'Next of Kin Email' . "\t" . 'salary' . "\t" . 'Salary Type' . "\t" . 'Overtime Rate' . "\t" . 'bonus' . "\t" . 'Commission' . "\t" . 'Salary Effective Start Date' . "\t" . 'Salary Review End Date' . "\t" . 'EE Pension Contribution %' . "\t" . 'EE Pension Start Date' . "\t" . 'EE Pension Change Date' . "\t" . 'EE Pension End Date' . "\t" . ' Error Status' . "\n";


            foreach ($xlsx->rows() as $k => $r) {


                if ($counter > 0 && !empty($r[0])) {

                    $employe_code = $this->objGeneral->clean_single_variable($r[0]);
                    $employe_email = $this->objGeneral->clean_single_variable($r[1]);
                    $employe_pwd = $this->objGeneral->clean_single_variable($r[2]);
                    $job_ttl = $this->objGeneral->clean_single_variable($r[3]);
                    $fname = strtolower($this->objGeneral->clean_single_variable($r[4]));
                    $midname = strtolower($this->objGeneral->clean_single_variable($r[5]));
                    $lname = strtolower($this->objGeneral->clean_single_variable($r[6]));
                    $known_as = $this->objGeneral->clean_single_variable($r[7]);
                    $department = $this->objGeneral->clean_single_variable($r[8]);
                    $line_manager_name = $this->objGeneral->clean_single_variable($r[9]);
                    $start_date = $this->objGeneral->clean_single_variable($r[10]);
                    $employee_type = $this->objGeneral->clean_single_variable($r[11]);
                    $active_date = $this->objGeneral->clean_single_variable($r[12]);


                    $address_1 = $this->objGeneral->clean_single_variable($r[13]);
                    $address_2 = $this->objGeneral->clean_single_variable($r[14]);
                    $city = $this->objGeneral->clean_single_variable($r[15]);
                    $county = $this->objGeneral->clean_single_variable($r[16]);
                    $postcode = $this->objGeneral->clean_single_variable($r[17]);
                    $country = $this->objGeneral->clean_single_variable($r[18]);
                    $internal_ext = $this->objGeneral->clean_single_variable($r[19]);

                    $work_phone = $this->objGeneral->clean_single_variable($r[20]);
                    $mobile_phone = $this->objGeneral->clean_single_variable($r[21]);
                    $home_phone = $this->objGeneral->clean_single_variable($r[22]);
                    $personal_email = $this->objGeneral->clean_single_variable($r[23]);
                    $work_email = $this->objGeneral->clean_single_variable($r[24]);
                    $skype_id = $this->objGeneral->clean_single_variable($r[25]);
                    $linkedin_id = $this->objGeneral->clean_single_variable($r[26]);

                    $date_of_birth = $this->objGeneral->clean_single_variable($r[27]);
                    $ni_num = $this->objGeneral->clean_single_variable($r[28]);
                    $holidays = $this->objGeneral->clean_single_variable($r[29]);
                    $ethnic_origin = $this->objGeneral->clean_single_variable($r[30]);
                    $religion = $this->objGeneral->clean_single_variable($r[31]);
                    $next_of_kin_name = $this->objGeneral->clean_single_variable($r[32]);
                    $relation_kin = $this->objGeneral->clean_single_variable($r[33]);
                    $next_of_kin_phone = $this->objGeneral->clean_single_variable($r[34]);
                    $next_of_kin_mobile = $this->objGeneral->clean_single_variable($r[35]);
                    $next_of_kin_email = $this->objGeneral->clean_single_variable($r[36]);


                    $salary = $this->objGeneral->clean_single_variable($r[37]);
                    $salary_type = $this->objGeneral->clean_single_variable($r[38]);
                    $overtime_rate = $this->objGeneral->clean_single_variable($r[39]);
                    $bonus = $this->objGeneral->clean_single_variable($r[40]);
                    $commission = $this->objGeneral->clean_single_variable($r[41]);
                    $salary_effect_startdate = $this->objGeneral->clean_single_variable($r[42]);
                    $salary_review_enddate = $this->objGeneral->clean_single_variable($r[43]);
                    $ee_penshion_cont = $this->objGeneral->clean_single_variable($r[44]);
                    $ee_penshion_startdate = $this->objGeneral->clean_single_variable($r[45]);
                    $ee_penshion_changedate = $this->objGeneral->clean_single_variable($r[46]);
                    $ee_penshion_enddate = $this->objGeneral->clean_single_variable($r[47]);


                    /*$sql_total = "SELECT   count(c.id) as total	FROM  employees  c
                                    LEFT JOIN company on company.id=c.company_id
                                    where  	(c.user_email='" . $employe_email . "' OR (c.first_name='" . $fname . "' and c.middle_name='" . $midname . "' and c.last_name='" . $lname . "' )
                                    AND (c.company_id=" . $this->arrUser['company_id'] . " or  company.parent_id=" . $this->arrUser['company_id'] . ")
                                    limit 1";
                    //echo $sql_total;exit;
                    $rs_count = $this->Conn->Execute($sql_total);
                    $total = $rs_count->fields['total'];*/


                    $data_pass = "  tst.user_email='" . $employe_email . "' OR (tst.first_name='" . $fname . "' and tst.middle_name='" . $midname . "' and tst.last_name='" . $lname . "' )";
                    $total = $this->objGeneral->count_duplicate_in_sql('employees', $data_pass, $this->arrUser['company_id']);

                    if ($total == 0) {
                        $Sql .= "(  '" . $employe_code . "', '" . $employe_pwd . "','" . $employe_email . "',3,'" . $job_ttl . "','" . $fname . "','" . $midname . "','" . $lname . "',
                        '" . $known_as . "','" . $department . "','" . $line_manager_name . "','" . $start_date . "','" . $employee_type . "','" . $address_1 . "','" . $address_2 . "',
                        '" . $city . "','" . $country . "','" . $postcode . "','" . $internal_ext . "','" . $work_phone . "','" . $mobile_phone . "','" . $home_phone . "','" . $personal_email . "',
                        '" . $work_email . "','" . $skype_id . "','" . $linkedin_id . "','" . $date_of_birth . "','" . $ni_num . "','" . $holidays . "','" . $ethnic_origin . "','" . $religion . "',
                        '" . $next_of_kin_name . "','" . $next_of_kin_phone . "','" . $next_of_kin_email . "','" . $next_of_kin_mobile . "','" . $relation_kin . "','" . $salary . "',
                        '" . $salary_type . "','" . $overtime_rate . "','" . $bonus . "','" . $commission . "','" . $salary_effect_startdate . "','" . $salary_review_enddate . "','" . $ee_penshion_cont . "',
                        '" . $ee_penshion_startdate . "','" . $ee_penshion_changedate . "','" . $ee_penshion_enddate . "',1,
                        '" . $this->arrUser['company_id'] . "','" . current_date . "'," . "'" . $this->arrUser['id'] . "','1','" . $DM_file . "')  , ";

                        $new_excel .= $employe_code . "\t" . $employe_email . "\t" . $employe_pwd . "\t" . $job_ttl . "\t" . $fname . "\t" .
                            $midname . "\t" . $lname . "\t" . $known_as . "\t" . $department . "\t" . $line_manager_name . "\t" . $start_date
                            . "\t" . $employee_type . "\t" . $active_date . "\t" . $address_1 . "\t" . $address_2 . "\t" . $city . "\t" . $county
                            . "\t" . $postcode . "\t" . $country . "\t" . $internal_ext . "\t" . $work_phone . "\t" . $mobile_phone . "\t" .
                            $home_phone . "\t" . $personal_email . "\t" . $work_email . "\t" . $skype_id . "\t" . $linkedin_id . "\t" . $date_of_birth
                            . "\t" . $ni_num . "\t" . $holidays . "\t" . $ethnic_origin . "\t" . $religion . "\t" . $next_of_kin_name . "\t" .
                            $relation_kin . "\t" . $next_of_kin_phone . "\t" . $next_of_kin_mobile . "\t" . $next_of_kin_email . "\t" . $salary .
                            "\t" . $salary_type . "\t" . $overtime_rate . "\t" . $bonus . "\t" . $commission . "\t" . $salary_effect_startdate .
                            "\t" . $salary_review_enddate . "\t" . $ee_penshion_cont . "\t" . $ee_penshion_startdate . "\t" . $ee_penshion_changedate .
                            "\t" . $ee_penshion_enddate . "\t" . '' . "\n";
                        $success_counter++;

                    } else {
                        //$response['error'] .= '"' . $employe_email . '" Record Rejected. <br></br><br /> \n \r\n ';
                        $new_excel .= $employe_code . "\t" . $employe_email . "\t" . $employe_pwd . "\t" . $job_ttl . "\t" . $fname . "\t" .
                            $midname . "\t" . $lname . "\t" . $known_as . "\t" . $department . "\t" . $line_manager_name . "\t" . $start_date
                            . "\t" . $employee_type . "\t" . $active_date . "\t" . $address_1 . "\t" . $address_2 . "\t" . $city . "\t" . $county
                            . "\t" . $postcode . "\t" . $country . "\t" . $internal_ext . "\t" . $work_phone . "\t" . $mobile_phone . "\t" .
                            $home_phone . "\t" . $personal_email . "\t" . $work_email . "\t" . $skype_id . "\t" . $linkedin_id . "\t" . $date_of_birth
                            . "\t" . $ni_num . "\t" . $holidays . "\t" . $ethnic_origin . "\t" . $religion . "\t" . $next_of_kin_name . "\t" .
                            $relation_kin . "\t" . $next_of_kin_phone . "\t" . $next_of_kin_mobile . "\t" . $next_of_kin_email . "\t" . $salary .
                            "\t" . $salary_type . "\t" . $overtime_rate . "\t" . $bonus . "\t" . $commission . "\t" . $salary_effect_startdate .
                            "\t" . $salary_review_enddate . "\t" . $ee_penshion_cont . "\t" . $ee_penshion_startdate . "\t" . $ee_penshion_changedate .
                            "\t" . $ee_penshion_enddate . "\t" . 'Duplicate Employee Email' . "\n";
                    }
                }
                $counter++;

            }

            $Sql = substr_replace(substr($Sql, 0, -1), "", -1);
            //echo  $Sql;exit;
            $RS = $this->Conn->Execute($Sql);

        }


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = $success_counter . ' Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record Not Inserted';
            $response['link'] = $sitepath . '/' . $file_name . '.xls';
        }

        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment; filename=Employees_import");
        $path = APP_PATH . '/upload/migration_file/Employees/' . $file_name . '.xls';
        file_put_contents($path, $new_excel);

        return $response;
    }

    //----------------  Import Stock Allocation    --------------

    function import_stock_alloc($arr, $input)
    {

        if (isset($_FILES['file'])) {

            $xlsx = new SimpleXLSX($_FILES['file']['tmp_name']);


            list($cols,) = $xlsx->dimension();


            $counter = 0;
            $counter2 = 0;
            $response['error'] = '';
            $ttl_qty = 0;
            foreach ($xlsx->rows() as $k => $r) {
                if ($counter > 0) {
                    $ttl_qty = $ttl_qty + $this->objGeneral->clean_single_variable($r[5]);
                }
                $counter++;
            }

            $item_qty = $_POST["po_data"]["item_qty"];

            if ($ttl_qty < 1) {
                $response['ack'] = 0;
                $response['error'] = 'Quantity Should be Greater then 0 !';
                return $response;
            } elseif ($ttl_qty > $item_qty) {
                $response['ack'] = 0;
                $response['error'] = 'Quantity exceeds the Limit !';
                return $response;
            }

            $rec = $_POST['po_data'];

            $Sql = "INSERT INTO warehouse_allocation (purchase_return_status, status, container_no, purchase_status, bl_shipment_no, quantity, prod_date, date_received, use_by_date, batch_no, order_id, product_id,
                        warehouse_id, type, supplier_id, order_date, unit_measure, primary_unit_id, primary_unit_name, primary_unit_qty, unit_measure_id, unit_measure_name, unit_measure_qty, user_id, company_id) VALUES ";


                /*$sql_total = "SELECT  count(warehouse_allocation.id) as total	FROM warehouse_allocation  JOIN company ON company.id = warehouse_allocation.company_id
            WHERE warehouse_allocation.type=1 and warehouse_allocation.status=1 and warehouse_allocation.order_id='" . $rec['order_id'] . "' and warehouse_allocation.product_id='" . $rec['product_id'] . "'  AND (warehouse_allocation.company_id=".$this->arrUser['company_id']." or  company.parent_id=".$this->arrUser['company_id'].")"; //and  company_id='" . $this->arrUser['company_id'] . "'

            $rs_count = $this->Conn->Execute($sql_total);
            $total = $rs_count->fields['total'];*/


                /*and warehouse_id='" . $rec['warehouses_id'] . "'*/

                /* if ($total > 0) {
                    $response['ack'] = 0;
                    $response['error'] = 'Record Already Exit!';
                    return $response;
                } else {*/


            foreach ($xlsx->rows() as $k => $r) {


                if ($counter2 > 0 && !empty($r[0])) {

                    $container_no = $this->objGeneral->clean_single_variable($r[0]);
                    $batch_no = $this->objGeneral->clean_single_variable($r[1]);
                    $prod_date = $this->objGeneral->convert_date($this->objGeneral->clean_single_variable($r[2]));
                    $date_received = $this->objGeneral->convert_date($this->objGeneral->clean_single_variable($r[3]));
                    $use_by_date = $this->objGeneral->convert_date($this->objGeneral->clean_single_variable($r[4]));
                    $qty = $this->objGeneral->clean_single_variable($r[5]);
                    if ($container_no != "" && $container_no != " ") {

                        $Sql .= "( 0,1, '" . $container_no . "',0,'" . $rec['bl_shipment_no'] . "', '" . $qty . "', '" . $prod_date . "', '" . $date_received . "', '" . $use_by_date . "', '" . $batch_no . "','" . $rec['order_id'] . "','" . $rec['product_id'] . "',
                    '" . $rec['warehouses_id'] . "','" . $rec['type'] . "','" . $rec['supplier_id'] . "','" . $rec['order_date'] . "','" . $rec['unit_of_measure_name'] . "','" . $rec['primary_unit_id'] . "','" . $rec['primary_unit_name'] . "','" . $rec['primary_unit_qty'] . "','" . $rec['unit_of_measure_id'] . "','" . $rec['unit_of_measure_name'] . "','" . $rec['unit_of_measure_qty'] . "','" . $this->arrUser[id] . "','" . $this->arrUser['company_id'] . "')  , ";

                    } else {
                        $response['ack'] = 0;
                        $response['error'] .= '"' . $batch_no . '" - "' . $qty . '"  Record Rejected. <br></br><br /> \n \r\n ';
                    }
                }
                $counter2++;

            }


            $Sql = substr_replace(substr($Sql, 0, -1), "", -1);

            $RS = $this->Conn->Execute($Sql);
            // }

        }


        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] .= 'Record Inserted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] .= 'Record Not Inserted';
        }

        return $response;
    }

}

?>