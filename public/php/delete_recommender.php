<?php include("includes.php"); ?>
<?php
	$id = trim($_POST["idToDelete"]);
    $database -> delete_recommender($id); 
?>