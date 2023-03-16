<?php
//echo "<pre>";  print_r($_SERVER); exit;
error_reporting(E_ALL);
try {
    if ($_SERVER['HTTP_HOST'] == 'localhost') {
        $conn = new PDO("mysql:host=localhost;dbname=navson_ng", 'root', 'Digital');
        $path = "http://" . $_SERVER['HTTP_HOST'] . "/projects/navson/";
        $filpath = $_SERVER['DOCUMENT_ROOT'] . '/projects/navson/upload/sales/crm/';
    } else {
        $conn = new PDO("mysql:host=10.168.1.92;dbname=navsonco_ng", 'navsonco_ng', 'NgDb@Navson321/');
        $path = "http://" . $_SERVER['HTTP_HOST'] . "/navson/";
        $filpath = $_SERVER['DOCUMENT_ROOT'] . '/navson/upload/sales/crm/';
    }

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit;
}

$Sql = "SELECT * FROM document
				WHERE id='$_REQUEST[id]'
				LIMIT 1";
//echo $Sql; exit;
$stmt = $conn->prepare($Sql);
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);

$file = $row['name'];
?>
<script type='text/javascript' src="<?= $path ?>app/vendor/jquery-1.10.2.min.js"></script>
<?php if (!empty($file) && is_file($filpath . $file)) { ?>
    <div id="test"
         style="position:absolute; width:51px; height:47px;top:0px;background:none repeat scroll 0 0 #F5F5F5; right:2px;"></div>

    <iframe src="http://docs.google.com/gview?url=<?= $path . 'upload/sales/crm/' . $file ?>&embedded=true"
            style="border-style:none;overflow:scroll; height:660px;" id="myIframe"></iframe>
    <?php
} else {
    ?>
    <div style="font-size:24px; color:#F00; text-align:center;">No File Found</div>
    <?
}

?>
<script language="javascript" type="text/javascript">
    $('#myIframe').width('100%');
    var f = document.getElementById('myIframe');
    f.src = f.src;
    f.reload();
</script>
<style>
    * {
        padding: 0px;
        margin: 0px;
    }
</style>