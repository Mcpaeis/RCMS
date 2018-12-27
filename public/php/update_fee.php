<?php include("includes.php"); ?>
<?php
	$id = trim($_POST["idToUpdate"]);
    $settings -> update_fee($id); 
?>