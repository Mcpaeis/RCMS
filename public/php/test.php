<?php include("includes.php"); ?>
<?php 
	if (isset($_POST["txtRegisterUser"])) {
			$registration -> create_user();
			//$failure = $response["error"];
			//echo $failure;
		}	
?>

<?php 
	if (isset($_POST["txtLoginUser"])) {
			$login -> login_user();
		}	

?>
<?php 
	if (isset($_POST["txtGetMeters"])) {
		$meter -> get_user_meters();
	}
?>
<?php 
	
	//test the credit buying
	if (isset($_POST["txtCreateMeter"])) {
		$meter -> create_meter();
	}

	if (isset($_POST["txtBuyCredit"])) {
		# code...
		$txtMeterNumber = $_POST["txtMeterNumber"];
		$txtMeterId = $_POST["txtMeterId"];
		$txtUserId = $_POST["txtUserId"];
		$credit -> load_credit($txtMeterId, $txtUserId, $txtMeterNumber);
	}
	if (isset($_POST["txtUpdatePassword"])) {
		# code...
		$txtEmail = $_POST["txtEmail"];
		$txtOPassword = $_POST["txtOPassword"];
		$txtNPassword = $_POST["txtNPassword"];
		$txtCPassword = $_POST["txtCPassword"];
		$update -> update_password($txtEmail, $txtOPassword, $txtNPassword, $txtCPassword);
	}
	//$credit -> initialise_wallet($user_id=1, $meter_id=1, $meter_number="0501384064b");
?>
<html>
	<body><br /><br />
		<form action="test.php" method="post">
			<input type="text" name="txtEmail" placeholder="Type Email"><br /><br />
			<input type="password" name="txtPassword" placeholder="Type Pasword"><br /><br />
			<input type="password" name="txtPasswordC" placeholder="Confirm Pasword"><br /><br />
			<input type="text" name="txtPhone" placeholder="Type Mobile"><br /><br />
			<input type="submit" name="txtRegisterUser" value="Register">
		</form>

		<br /><br /><br /><br />

		<form action="test.php" method="post">
			<input type="text" name="txtEmail" placeholder="Type Email"><br /><br />
			<input type="password" name="txtPassword" placeholder="Type Pasword"><br /><br />
			<input type="submit" name="txtLoginUser" value="Login">
		</form>

		<br /><br /><br /><br />
		<form action="test.php" method="post">
			<input type="text" name="txtMeterNumber" placeholder="Type meter number"><br /> <br />
			<input type="text" name="txtUserId" placeholder="Typer user id"><br /><br />
			<input type="submit" name="txtCreateMeter" value="Create Meter">
		</form>

		<br /><br /><br /><br />
		<form action="test.php" method="post">
			<input type="text" name="txtMeterNumber" placeholder="Type meter number"><br /> <br />
			<input type="text" name="txtUserId" placeholder="Type user id"><br /><br />
			<input type="text" name="txtMeterId" placeholder="Type meter id"><br /><br />
			<input type="submit" name="txtBuyCredit" value="Buy Credit">
		</form>
		<br /><br /><br /><br />
		<form action="test.php" method="post">
			<input type="text" name="txtUserId" placeholder="Type use id"><br /><br />
			<input type="submit" name="txtGetMeters" value="Get Meters">
		</form>
		<br /><br /><br /><br />
		<form action="update.php" method="post">
			<input type="text" name="txtEmail" placeholder="Type email"><br /><br />
			<input type="text" name="txtOPassword" placeholder="Type old password"><br /><br />
			<input type="text" name="txtNPassword" placeholder="Type new password"><br /><br />
			<input type="text" name="txtCPassword" placeholder="confirm password"><br /><br />
			<input type="submit" name="txtUpdatePassword" value="Update Password">
		</form>
		<br /><br /><br /><br />
		<form action="update.php" method="post">
			<input type="text" name="txtOEmail" placeholder="Type old email"><br /><br />
			<input type="text" name="txtNEmail" placeholder="Type new email"><br /><br />
			<input type="text" name="txtCEmail" placeholder="confirm email"><br /><br />
			<input type="submit" name="txtUpdateEmail" value="Update Password">
		</form>
		<form action="update.php" method="post">
			<input type="text" name="txtEmail" placeholder="Type email"><br /><br />
			<input type="text" name="txtNMobile" placeholder="Type mobile number"><br /><br />
			<input type="submit" name="txtUpdateContact" value="Update Contact">
		</form>
	</body>
</html>