<?php include("includes.php"); ?>
<?php
	$id = trim($_POST["idToDelete"]);
    $recommendation -> delete_recommendation($id); 
?>