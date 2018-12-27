<?php include("includes.php"); ?>
<?php 

	if (isset($_POST["txtOPassword"]) && isset($_POST["txtNPassword"]) && isset($_POST["txtCPassword"])) {
		#password update request
		$txtEmail = $_POST["txtEmail"];
		$txtOPassword = $_POST["txtOPassword"];
		$txtNPassword = $_POST["txtNPassword"];
		$txtCPassword = $_POST["txtCPassword"];
		$update -> update_password($txtEmail, $txtOPassword, $txtNPassword, $txtCPassword);

	}elseif (isset($_POST["txtOEmail"]) && isset($_POST["txtNEmail"]) && isset($_POST["txtCEmail"])) {
		#email update
		$txtOEmail = $_POST["txtOEmail"];
		$txtNEmail = $_POST["txtNEmail"];
		$txtCEmail = $_POST["txtCEmail"];
		$update -> update_email($txtOEmail, $txtNEmail, $txtCEmail);

	}elseif (isset($_POST["txtNMobile"])&&isset($_POST["txtEmail"])) {
		# contact update
		$txtEmail = $_POST["txtEmail"];
		$txtNMobile = $_POST["txtNMobile"];
		$update -> update_mobile($txtEmail, $txtNMobile);

	}else{
		#do nothing		
	}

?>