<?php include("includes.php"); ?>
<?php
	$id = trim($_POST["idToSign"]);
    $recommendation -> lo_sign($id); 
?>