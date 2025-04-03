<?php

require_once '../api/classes/Config.Inc.php'; 

$conn = mysqli_connect(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);
;
if ($conn->connect_error)
    die("Connection failed: " . $conn->connect_error); 
 
$Sql = "SHOW TABLES FROM " . DATABASE_NAME;
$RS = $conn->query($Sql);
$count = 0;
if ($RS->num_rows > 0) { 
    while ($rsRow = $RS->fetch_assoc()) { 
        $rname = $rsRow['Tables_in_' . DATABASE_NAME];  
            $sql_d = " DELETE FROM $rname  ;"; 
    }
	  $rs = $conn->query($sql_d);
            if (mysqli_affected_rows($conn) > 0)   $count++; 
}

if ($count > 0)
    echo "<br>  $count Table Deleted Successfully";
else
    echo "<br> Error deleting record: " . $conn->error;

$conn->close();
?>