<?php include("includes.php"); ?>
<?php 
	$action = trim($_POST["txtAction"]);
	$user_id = trim($_POST["txtUserId"]);
	if ($action=="suspend") {
		$database -> suspend_recommender($user_id);
	}elseif ($action=="delete") {
		# code...
		$database -> delete_recommender($user_id);
	}
?>