<?php include("includes.php"); ?>
<?php
	$id = trim($_POST["idToIssue"]);
    $recommendation -> go_issued($id); 
?>