<?php
// error_reporting(E_ERROR);
require_once(SERVER_PATH . "/classes/Xtreme.php");
require_once(SERVER_PATH . "/classes/General.php");
require_once(SERVER_PATH . "/classes/Setup.php");

class Setupsrm extends Xtreme
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
        $this->objsetup = new Setup($user_info);
    }

    // static	
    function delete_update_status($table_name, $column, $id)
    {

<<<<<<< HEAD
        $Sql = "UPDATE $table_name SET $column=".DELETED_STATUS." WHERE id = $id AND SR_CheckTransactionBeforeDelete($id, ".$this->arrUser['company_id'].", 10,0) = 'success'";
=======
        $Sql = "UPDATE $table_name SET $column=" . DELETED_STATUS . " WHERE id = $id AND SR_CheckTransactionBeforeDelete($id, " . $this->arrUser['company_id'] . ", 10,0) = 'success'";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql;exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS = $this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['success'] = 'Record Deleted Successfully';
<<<<<<< HEAD
        } else{
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['ack'] = 0;
            $response['error'] = 'This Payment Method cannot be deleted because it is being used in another record.';
        }
        return $response;
    }

    function delete_payment_term($attr)
    {
        // print_r($attr);exit;
        $this->objGeneral->mysql_clean($attr);
<<<<<<< HEAD
                
        $Sql = "UPDATE srm_payment_terms SET status=".DELETED_STATUS." WHERE id = ".$attr['id']." AND SR_CheckTransactionBeforeDelete(".$attr['id'].", ".$this->arrUser['company_id'].", 11,0) = 'success'";
        
=======

        $Sql = "UPDATE srm_payment_terms SET status=" . DELETED_STATUS . " WHERE id = " . $attr['id'] . " AND SR_CheckTransactionBeforeDelete(" . $attr['id'] . ", " . $this->arrUser['company_id'] . ", 11,0) = 'success'";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // echo $Sql; exit;
        $RS = $this->objsetup->CSI($Sql);

        if ($RS = $this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['success'] = 'Record Deleted Successfully';
        } else {
            $response['ack'] = 0;
            $response['error'] = 'This Payment Term cannot be deleted because it is being used in another record.';
        }
        return $response;
    }


    function get_data_by_id($table_name, $id)
    {
        $Sql = "SELECT *
				FROM $table_name
				WHERE id=$id
				LIMIT 1";
<<<<<<< HEAD
        $RS = $this->objsetup->CSI($Sql,'purchases',sr_ViewPermission);
=======
        $RS = $this->objsetup->CSI($Sql, 'purchases', sr_ViewPermission);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $response['ack'] = 1;
        $response['error'] = NULL;
        if ($RS->RecordCount() > 0) {
            $Row = $RS->FetchRow();
            foreach ($Row as $key => $value) {
                if (is_numeric($key)) unset($Row[$key]);
            }
            $response['response'] = $Row;
        } else {
            $response['response'] = array();
        }
        return $response;
    }

    //----------------- SRM -------------------------------//

    // Shipping Measurment Module
    //------------------------------------------------

    function get_shipment_methods_srm($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
<<<<<<< HEAD
        $limit_clause = "";         
        $response = array();
        
=======
        $limit_clause = "";
        $response = array();

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $Sql = "SELECT   c.* 
                FROM  shipment_methods  c 
                left JOIN company on company.id=c.company_id 
                where   c.status=1 and 
                        c.shipment_type = 2 and 
                        (c.company_id=" . $this->arrUser['company_id'] . " or  
                         company.parent_id=" . $this->arrUser['company_id'] . ")
                order by  c.name DESC "; //c.user_id=".$this->arrUser['id']."     
<<<<<<< HEAD
         
        $RS = $this->objsetup->CSI($Sql);		
        $response['ack'] = 1;
        $response['error'] = NULL; 
		 
=======

        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['code'] = $Row['code'];
                $result['name'] = $Row['name'];
                $result['company_id'] = $Row['company_id'];
                $response['response'][] = $result;
            }
        } else {
            $response['response'][] = array();
        }
        return $response;
    }


    function add_shipment_method_srm($attr)
    {
        $this->objGeneral->mysql_clean($attr);

<<<<<<< HEAD
        if($attr['coment_id']>0)   
            $where_id = " AND tst.id <> '$attr[coment_id]' ";
        
        $data_pass = "  tst.name='" . $arr_attr['name'] . "' ";
=======
        if ($attr['coment_id'] > 0)
            $where_id = " AND tst.id <> '$attr[coment_id]' ";

        $data_pass = "  tst.name='" . $attr['name'] . "' ";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $total = $this->objGeneral->count_duplicate_in_sql('srm_shipment_methods', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
<<<<<<< HEAD
            return $response;exit;
        }

        $doc_id = $attr['coment_id'];
        
        if ($doc_id == 0) {
            $Sql = "INSERT INTO srm_shipment_methods
                                            SET 
                                                name = '".$attr['name']."',
                                                user_id='" . $this->arrUser['id'] . "',
                                                company_id='" . $this->arrUser['company_id'] . "'";
           $RS = $this->objsetup->CSI($Sql);
           $response['id'] = $this->Conn->Insert_ID();
           $response['ack'] = 1;
           $response['error'] = NULL;
           $response['error'] = 'Record Inserted Successfully';
        }
        else {
            $Sql = "UPDATE srm_shipment_methods
									SET 
									    name = '".$attr['name']."' 
									WHERE id = $attr[coment_id] ";
            $RS = $this->objsetup->CSI($Sql);
        }        
=======
            return $response;
            exit;
        }

        $doc_id = $attr['coment_id'];

        if ($doc_id == 0) {
            $Sql = "INSERT INTO srm_shipment_methods
                                            SET 
                                                name = '" . $attr['name'] . "',
                                                user_id='" . $this->arrUser['id'] . "',
                                                company_id='" . $this->arrUser['company_id'] . "'";
            $RS = $this->objsetup->CSI($Sql);
            $response['id'] = $this->Conn->Insert_ID();
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $Sql = "UPDATE srm_shipment_methods
									SET 
									    name = '" . $attr['name'] . "' 
									WHERE id = $attr[coment_id] ";
            $RS = $this->objsetup->CSI($Sql);
        }
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //	  echo $Sql;exit;

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
            $response['msg'] = 'Record  Inserted !';
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }
        return $response;
    }


    // Payment Terms Module 
    //------------------------------------------------

    function get_payment_terms_srm($attr)
<<<<<<< HEAD
    {        
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";        
        $response = array();
        
=======
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
        $limit_clause = "";
        $response = array();

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $Sql = "SELECT   c.* 
                FROM  srm_payment_terms  c 
                left JOIN company on company.id=c.company_id
                where  c.status=1 and 
                      (c.company_id=" . $this->arrUser['company_id'] . " or  
                       company.parent_id=" . $this->arrUser['company_id'] . ")
                order by  c.name DESC "; //c.user_id=".$this->arrUser['id']." 
<<<<<<< HEAD
        
        $RS = $this->objsetup->CSI($Sql);		
        $response['ack'] = 1;
        $response['error'] = NULL; 
=======

        $RS = $this->objsetup->CSI($Sql);
        $response['ack'] = 1;
        $response['error'] = NULL;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['days'] = $Row['days'];
                $result['company_id'] = $Row['company_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }


    function get_payment_terms_list_srm($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
<<<<<<< HEAD
        $limit_clause = "";       
        $response = array();
        
=======
        $limit_clause = "";
        $response = array();

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $Sql = "SELECT c.* 
                FROM srm_payment_terms  c 
                left JOIN company on company.id=c.company_id 
                where  c.status=1 and 
                       (c.company_id=" . $this->arrUser['company_id'] . " or  
                        company.parent_id=" . $this->arrUser['company_id'] . ")
                order by  c.days ASC ";
        // echo $Sql;exit;
<<<<<<< HEAD
        $RS = $this->objsetup->CSI($Sql,'purchases',sr_ViewPermission);
		
        $response['ack'] = 1;
        $response['error'] = NULL; 
=======
        $RS = $this->objsetup->CSI($Sql, 'purchases', sr_ViewPermission);

        $response['ack'] = 1;
        $response['error'] = NULL;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['days'] = $Row['days'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }


    function add_payment_term_srm($attr)
    {
        $this->objGeneral->mysql_clean($attr);

<<<<<<< HEAD
        if($attr['id']>0)   
            $where_id = " AND tst.id <> '".$attr['id']."' ";
            
        $data_pass = " tst.name='" . $attr['name'] . "' $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('srm_payment_terms', $data_pass, $this->arrUser['company_id']);

        if ($total >0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }		
		
=======
        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '" . $attr['id'] . "' ";

        $data_pass = " tst.name='" . $attr['name'] . "' $where_id ";
        $total = $this->objGeneral->count_duplicate_in_sql('srm_payment_terms', $data_pass, $this->arrUser['company_id']);

        if ($total > 0) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
            return $response;
        }

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $doc_id = $attr['id'];

        if ($doc_id == 0) {
            $Sql = "INSERT INTO srm_payment_terms
									SET 	
<<<<<<< HEAD
                                        name = '".$attr['name']."',
                                        days = '$attr[days]',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";					

			$RS = $this->objsetup->CSI($Sql,'purchases',sr_ViewPermission);
            $response['id'] = $this->Conn->Insert_ID();
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';  
        } 
		else {
            $Sql = "UPDATE srm_payment_terms
								SET 
									name = '".$attr['name']."',
=======
                                        name = '" . $attr['name'] . "',
                                        days = '$attr[days]',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";

            $RS = $this->objsetup->CSI($Sql, 'purchases', sr_ViewPermission);
            $response['id'] = $this->Conn->Insert_ID();
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $Sql = "UPDATE srm_payment_terms
								SET 
									name = '" . $attr['name'] . "',
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    days = '$attr[days]' 
								WHERE id = $doc_id ";

            $RS = $this->objsetup->CSI($Sql);
        }
        //  echo $Sql;exit;
        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
<<<<<<< HEAD
            $response['id'] = $id;
=======
            $response['id'] = $doc_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['msg'] = 'Record  Inserted !';
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }
        return $response;
    }


    //--------Payment Methods Module SRM----------------------------------------

    function get_payment_methods_srm($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
<<<<<<< HEAD
        $limit_clause = "";     
        $response = array(); 

         $Sql = "SELECT   c.* 
=======
        $limit_clause = "";
        $response = array();

        $Sql = "SELECT   c.* 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                 FROM  srm_payment_methods  c
                 left JOIN company on company.id=c.company_id 
                 where  c.status=1 and 
                        (c.company_id=" . $this->arrUser['company_id'] . " or 
                         company.parent_id=" . $this->arrUser['company_id'] . ")
                 order by  c.name DESC "; //c.user_id=".$this->arrUser['id']." 
<<<<<<< HEAD
      
        $RS = $this->objsetup->CSI($Sql);		 
=======

        $RS = $this->objsetup->CSI($Sql);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $result['company_id'] = $Row['company_id'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }


    function get_payment_methods_list_srm($attr)
    {
        $this->objGeneral->mysql_clean($attr);
        //print_r($attr);
<<<<<<< HEAD
        $limit_clause = "";         
        $response = array();
        
=======
        $limit_clause = "";
        $response = array();

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $Sql = "SELECT   c.* 
                FROM  srm_payment_methods  c 
                left JOIN company on company.id=c.company_id 
                where  c.status=1 and 
                      (c.company_id=" . $this->arrUser['company_id'] . " or  
                       company.parent_id=" . $this->arrUser['company_id'] . ")
                order by  c.name ASC "; //c.user_id=".$this->arrUser['id']." 
<<<<<<< HEAD
     
        $RS = $this->objsetup->CSI($Sql,'purchases',sr_ViewPermission); 
=======

        $RS = $this->objsetup->CSI($Sql, 'purchases', sr_ViewPermission);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($RS->RecordCount() > 0) {
            while ($Row = $RS->FetchRow()) {
                $result = array();
                $result['id'] = $Row['id'];
                $result['name'] = $Row['name'];
                $response['response'][] = $result;
            }
            $response['ack'] = 1;
            $response['error'] = NULL;
        } else {
            $response['response'][] = array();
        }
        return $response;
    }


    function add_payment_method_srm($attr)
    {
        $this->objGeneral->mysql_clean($attr);
<<<<<<< HEAD
        
        if($attr['id']>0)   
            $where_id = " AND tst.id <> '".$attr['id']."' ";
        
=======

        if ($attr['id'] > 0)
            $where_id = " AND tst.id <> '" . $attr['id'] . "' ";

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $data_pass = " tst.name='" . $attr['name'] . "' ";
        $total = $this->objGeneral->count_duplicate_in_sql('srm_payment_methods', $data_pass, $this->arrUser['company_id']);

        if ($total == 1) {
            $response['ack'] = 0;
            $response['error'] = 'Record Already Exists.';
<<<<<<< HEAD
            return $response;exit;
        }		
=======
            return $response;
            exit;
        }
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // print_r($attr);exit;

        $doc_id = $attr['id'];
        if ($doc_id == 0) {
            $Sql = "INSERT INTO srm_payment_methods
                                    SET 	
<<<<<<< HEAD
                                        name = '".$attr['name']."',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";
            
            $RS = $this->objsetup->CSI($Sql);
            $response['id'] = $this->Conn->Insert_ID(); 
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        }
        else {
            $Sql = "UPDATE srm_payment_methods
									SET
                                        name = '".$attr['name']."' 
=======
                                        name = '" . $attr['name'] . "',
                                        user_id='" . $this->arrUser['id'] . "',
                                        company_id='" . $this->arrUser['company_id'] . "'";

            $RS = $this->objsetup->CSI($Sql);
            $response['id'] = $this->Conn->Insert_ID();
            $response['ack'] = 1;
            $response['error'] = NULL;
            $response['error'] = 'Record Inserted Successfully';
        } else {
            $Sql = "UPDATE srm_payment_methods
									SET
                                        name = '" . $attr['name'] . "' 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
									WHERE id = $doc_id ";
            $RS = $this->objsetup->CSI($Sql);
        }
        // echo $Sql;exit;

        if ($this->Conn->Affected_Rows() > 0) {
            $response['ack'] = 1;
<<<<<<< HEAD
            $response['id'] = $id;
=======
            $response['id'] = $doc_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $response['msg'] = 'Record  Inserted !';
            $response['error'] = NULL;
        } else {
            $response['ack'] = 0;
            $response['error'] = 'Record is Not updated!';
        }
        return $response;
    }

    //------------------------------------------------

    /*   Order by ranking to CRM order status        */

    //------------------------------------------------


    function sort_crm_order_stages($arr_attr)
    {
        $count = 1;

        foreach ($arr_attr['record'] as $value) {
            $Sql = "UPDATE ref_crm_order_stages 
                                    SET 
                                    `rank` = $count 
                                    WHERE id =  $value->id";
            // echo "<hr />".$Sql;
            $RS = $this->objsetup->CSI($Sql);
            $count++;
        }
        $response['ack'] = 1;
        $response['error'] = NULL;
        return $response;
    }
}
<<<<<<< HEAD

?>
=======
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
