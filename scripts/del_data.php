<?php

require_once '../api/classes/Config.Inc.php';

$company = $_GET['cid'];
if (empty($company)) {
    echo "Define Company";
    exit;
}

exit;

$conn = mysqli_connect(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);
;
if ($conn->connect_error)
    die("Connection failed: " . $conn->connect_error);

/* if ($_SERVER['HTTP_HOST'] == 'localhost') $Sql = "SHOW TABLES FROM navsonso_silver";
  else  $Sql = "SHOW TABLES FROM silverow_live"; */

$chk_arry = array("costing_account_entry", "account_entry", "warehouse_allocation", "srm_invoice", "srm_invoice_detail"
    , "orders", "order_details", "return_orders", "return_order_details", "srm_order_return", "srm_order_return_detail", "gl_journal", "gl_journal_receipt", "gl_journal_receipt_allocation", "gl_journal_receipt_detail", "gl_journal_receipt_person", "gl_journal_receipt_refund");

$Sql = "SHOW TABLES FROM " . DATABASE_NAME;
$RS = $conn->query($Sql);
$count = 0;
if ($RS->num_rows > 0) {
    //$sql_del_new .="DELETE FROM ";
    while ($rsRow = $RS->fetch_assoc()) {
        //$result = array();
        //if ($_SERVER['HTTP_HOST'] == 'localhost') $rname = $rsRow['Tables_in_navsonso_silver'];
        //else  $rname = $rsRow['Tables_in_silverow_live'];
        $rname = $rsRow['Tables_in_' . DATABASE_NAME];

        if (in_array($rname, $chk_arry)) {
            //$sql_del .= "$rname".",";
            $sql_d = " DELETE FROM $rname " . "WHERE  company_id='" . $company . "' ";
            $rs = $conn->query($sql_d);
            if (mysqli_affected_rows($conn) > 0)
                $count++;
        }
        // $sql_del_new .= "$rname]".",";
    }
    //$sql_d = substr($sql_del, 0, -1);
    //echo $sql_d;exit;
    //$rs = $conn->query($sql_d);
    //	if ($rs==true) $count++; 
}

if ($count > 0)
    echo "<br>  $count Table Deleted Successfully";
else
    echo "<br> Error deleting record: " . $conn->error;

$conn->close();
?>