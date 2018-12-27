<?php include("includes.php"); ?>

<?php 
	class Update{

		public function update_password($txtEmail, $txtOPassword, $txtNPassword, $txtCPassword){
			$response = array("error" => true);
			//echo json_encode($response);
			$txtEmail = trim($txtEmail);
			$txtOPassword = trim($txtOPassword);
			$txtNPassword = trim($txtNPassword);
			$txtCPassword = trim($txtCPassword);
			$validate_registration = new ValidateRegistration();
			$database = new Database();
			if (!($validate_registration -> valid_email($txtEmail))) {
				#intrnal error..user mail could not persist
				$response["error_msg"] = $validate_registration -> error_email_message;
				$response["error"] = false;
				echo json_encode($response);
			}elseif (empty($txtOPassword)) {
				$response["error_msg"] = "Old Password is required!";
				$response["error"] = false;
				echo json_encode($response);
			}elseif (!($validate_registration -> strong_password($txtNPassword, $txtCPassword))) {
				$response["error_msg"] = $validate_registration -> error_pass_message;
				$response["error"] = false;
				echo json_encode($response);
			}else{
				$result = $database -> find_by_mail($txtEmail);
				$result_array = mysqli_fetch_assoc($result);
				$id = $result_array["id"];
				$hashed_pass = $result_array["user_password"];

				if (!($database -> decrypt($txtNPassword, $hashed_pass))) {
				 	#old password is not correct
				 	$response["error_msg"] = "Old Password is not correct. Try again";
				 	$response["error"] = false;
				 	echo json_encode($response);
				 } else{
				 	#old password is correct, proceed to update
				 	$column = "user_password";
				 	$value = $database -> encrypt($txtNPassword);
				 	if ($database -> update_user($column, $value, $id)) {
				 		$response["error"] = true; # no error
				 		echo json_encode($response);
				 	}else{
				 		$response["error_msg"] = "Password update failed. Try again shortly.";
				 		$response["error"] = false;
				 		echo json_encode($response);
				 	}
				 }
			}
		}

		public function update_email($txtOEmail, $txtNEmail, $txtCEmail){
			$response = array("error" => true);
			//echo json_encode($response);
			$txtOEmail = trim($txtOEmail);
			$txtNEmail = trim($txtNEmail);
			$txtCEmail = trim($txtCEmail);

			$validate_registration = new ValidateRegistration();
			$database = new Database();

			if (!($validate_registration -> valid_email($txtOEmail))) {
				#intrnal error..user mail could not persist
				$response["error_msg"] = $validate_registration -> error_email_message;
				$response["error"] = false;
				echo json_encode($response);
			}elseif ($txtNEmail!=$txtCEmail) {
				#emails donot match
				$response["error_msg"] = "Emails do not match.";
				$response["error"] = false;
				echo json_encode($response);
			}elseif(!(filter_var($txtNEmail, FILTER_VALIDATE_EMAIL)) || !(filter_var($txtCEmail, FILTER_VALIDATE_EMAIL))){
				$response["error_msg"] = "New email is not valid!";
				$response["error"] = false;
				echo json_encode($response);
			}elseif(!($validate_registration -> validate_email($txtNEmail))){
				$response["error_msg"] = $validate_registration -> error_email_message;
				$response["error"] = false;
				echo json_encode($response);
			}else{
				$txtEmail = $database -> escape_string($txtOEmail);
				$result = $database -> find_by_mail($txtEmail);
				$result_array = mysqli_fetch_assoc($result);
				$id = $result_array["id"];
				$column = "email_address";
				 	$value = $txtNEmail;
				 	if ($database -> update_user($column, $value, $id)) {
				 		$response["error"] = true; # no error
				 		echo json_encode($response);
				 	}else{
				 		$response["error_msg"] = "Email update failed. Try again shortly.";
				 		$response["error"] = false;
				 		echo json_encode($response);
				 	}
			}
		}
		public function update_mobile($txtEmail, $txtNMobile){
			$response = array("error" => true);
			//echo json_encode($response);
			$txtEmail = trim($txtEmail);
			$txtNMobile = trim($txtNMobile);

			$validate_registration = new ValidateRegistration();
			$database = new Database();

			if (!($validate_registration -> valid_email($txtEmail))) {
				#intrnal error..user mail could not persist
				$response["error_msg"] = "Update Failed, Please Logout and try again.";
				$response["error"] = false;
				echo json_encode($response);
			}elseif (empty($txtNMobile)) {
				#emails donot match
				$response["error_msg"] = "Mobile contact is empty";
				$response["error"] = false;
				echo json_encode($response);
			}else{
				$txtEmail = $database -> escape_string($txtEmail);
				$result = $database -> find_by_mail($txtEmail);
				$result_array = mysqli_fetch_assoc($result);
				$id = $result_array["id"];
				$column = "phone_number";
				 	$value = $txtNMobile;
				 	if ($database -> update_user($column, $value, $id)) {
				 		$response["error"] = true; # no error
				 		echo json_encode($response);
				 	}else{
				 		$response["error_msg"] = "Mobile Contact update failed. Try again shortly.";
				 		$response["error"] = false;
				 		echo json_encode($response);
				 	}
			}
		}

	}
	$update = new Update();
?>