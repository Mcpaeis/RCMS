<?php include("includes.php"); ?>
<?php
	$id = trim($_POST["txtId"]);
	$recommendation -> update_recommendation($id); 
?>