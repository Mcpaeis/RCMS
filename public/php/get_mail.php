<?php include("includes.php"); ?>
<?php
	$txtId = $_POST["txtId"];
    $database -> get_mail($txtId, "recommenders"); 
?>