<?php include("includes.php"); ?>
<?php
	$id = trim($_POST["idToDelete"]);
    $settings -> delete_fee($id); 
?>