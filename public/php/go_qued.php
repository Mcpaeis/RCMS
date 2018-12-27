<?php include("includes.php"); ?>
<?php
	$id = trim($_POST["idToQue"]);
    $recommendation -> go_qued($id); 
?>