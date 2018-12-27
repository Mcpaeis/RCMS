<?php include("includes.php"); ?>
<?php
	$cat = $_POST["txtCategory"];
	if ($cat=="Flat") {
    	$settings -> get_flat_fee();
	}elseif($cat == "Reducing Balance"){
		$settings -> get_rd_fee(); 
	}elseif ($cat == "loAll") {
		//get the available categories for dsiplaying in the LO	
		$recommendation -> get_fee_category(); 
	}elseif ($cat=="authorize") {
		$id = $_POST["txtId"];
		$recommendation -> get_authorized($id);
	}elseif ($cat=="authorizeUpdate") {
		$id = $_POST["txtId"];
		$recommendation -> get_authorizedUpdate($id);
	}elseif ($cat=="requestGo"){
		$recommendation -> get_lo_authorized();
	}elseif ($cat=="signing") {
		$id = trim($_POST["txtId"]);
		//this is for the purpose of the lecturer signing
		$recommendation -> get_go_issued($id);
	}elseif ($cat=="goIssue") {
		//$id = trim($_POST["txtId"]);
		//this will be used to manage issue status and manage qued in the go app
		$recommendation -> get_go_qued();
	}elseif ($cat=="issued") {
		$recommendation -> get_issued();
	}elseif ($cat=="loIssued") {
		$id = $_POST["txtId"];
		$recommendation -> get_lo_signed($id);
	}elseif ($cat=="issuedAdmin") {
		$recommendation -> get_issued_admin();
	}elseif ($cat=="manageRecommenders") {
		$recommendation -> get_recommenders();
	}elseif($cat=="issuedAdminPrinting"){
		$recommendation -> get_printable();
	}else{
		echo $recommendation -> get_printable();
	}
?>