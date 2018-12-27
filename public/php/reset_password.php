<?php include("includes.php"); ?>
<?php
	$response = array('error'=> true);
	$txtPassword = trim($_POST["txtPassword"]);
	$txtEmail = trim($_POST["txtEmail"]);
	$new_pass = $database -> escape_string($txtPassword);
	$email = $database -> escape_string($txtEmail);
	$user_id = $_POST["txtId"];
	if ($user_id!=null) {
		$query = "SELECT * FROM  recommenders WHERE recommenders.id = $user_id LIMIT 1";
		$result = mysqli_query($database -> connection, $query);
		if (!$result) {	
			$response["error"] = false;
			$response["error_msg"] = "There was a problem confirming your request! Please Try again shortly.";
		}else{
			$table = "recommenders";
			$result_array = mysqli_fetch_assoc($result);
			$existing_mail = $result_array["email_address"];
			$new_mail = $existing_mail == $txtEmail ? true : false;
			if ($new_mail) {
				//existing mail i same as the new mail...only update the password
				$column = "password";
				$value = $database -> encrypt($new_pass);
				if ($database -> update_user($column, $value, $user_id, $table)) {
					//Password was succcessfully updated.";
					//send the mail
					if(!($database -> send_mail($txtEmail, $txtPassword, $table))){
						$response["error"] = false;
						$response["error_msg"] = "Could not send email. Try again shortly";
					}
				}else{
					$response["error"] = false;
					$response["error_msg"] = "There was a problem updating. Try again shortly!";
				}
			}else{
				//update both the email and the password
				$column1 = "email_address";
				$column2 = "password";
				$value1 = $email;
				$value2 = $database -> encrypt($new_pass);
				if ($database -> update_user($column1, $value1, $user_id, $table) && $database -> update_user($column2, $value2, $user_id, $table)) {
					//Email and Password was succcessfully updated.";
					//send the mail
					if(!($database -> send_mail($txtEmail, $txtPassword, $table))){
						$response["error"] = false;
						$response["error_msg"] = "Could not send email. Try again shortly";
					}
				}else{
					$response["error"] = false;
					$response["error_msg"] = "There was a problem updating. Try again shortly!";
				}
			}
			
		}
	}else{
		$response["error"] = false;
		$response["error_msg"] = "Internal error! Please contact admin";
	}	
	echo json_encode($response);	
?>