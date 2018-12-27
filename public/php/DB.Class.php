<?php require_once("includes.php");  ?>
<?php 
	class Database{
		public $connection;
		protected $table_name;

		public function connect_to_db(){

			$this -> connection = mysqli_connect(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
			if (!$this -> connection) {
				die("Could not estatblish connection. ". mysqli_connect_error());
			}
		}

		public function __construct(){
			//this ensures that my connection property is always available
			$this -> connect_to_db();
		}

		public function confirm_query($result){
			if (!$result) {
				die("Database connetion failed. " . mysqli_error($this -> connection));
			}else{
				return true;
			}
		}

		public function find_by_mail($email){
			$query = "SELECT * FROM users WHERE email_address = '$email' LIMIT 1";
			$result = $this -> find_by_query($query);
			return $result;
		}
		public function get_last_inserted_id($result){
			if ($result) {
			    $last_id = mysqli_insert_id($this -> connection);
			    //echo "New record created successfully. Last inserted ID is: " . $last_id;
			    return $last_id;
			} else {
			    echo "Error: " . $sql . "<br>" . mysqli_error($this -> connection);
			}
		}

		public function set_table($table){
			return $this -> table_name = $table;
		}

		public function get_table(){
			return $this -> set_table($this -> table_name);
		}

		public function find_by_id($id=""){
			//this uses the find by sql method
			$table = $this -> get_table();
			$this -> result = $this -> find_by_sql("id", $id);
			if ($this -> confirm_query($this -> result)) {
				return $this -> result;
			}else{
				die("Database connection failed. " . mysqli_error($this -> connection));
			}
		}

		public function get_first_name($id, $table){
			$this -> set_table($table);
			$response = array("error" => true);
			$result = $this -> find_by_id($id);
			if ($result) {
				$first_name = mysqli_fetch_assoc($result)["first_name"];
				$response["fname"] = $first_name;
			}else{
				$response["error"] = false;
			}
			echo json_encode($response);
		}

		public function get_mail($id, $table){
			$this -> set_table($table);
			$response = array("error" => true);
			$result = $this -> find_by_id($id);
			if ($result) {
				$mail = mysqli_fetch_assoc($result)["email_address"];
				$response["mail"] = $mail;
			}else{
				$response["error"] = false;
				$response["error_msg"] = "Email does not exist";
			}
			echo json_encode($response);
		}

		public function get_recommender_name($id){
			$this -> set_table("recommenders");
			//$response = array("error" => true);
			$result = $this -> find_by_id($id);
			if ($result) {
				$result_array = mysqli_fetch_assoc($result);
				$fname = $result_array["first_name"];
				$lname = $result_array["last_name"];
				return $fname." ".$lname;
			}
		}

		public function find_by_sql($ref, $value){
			$table = $this -> get_table();
			$this -> query = "SELECT * FROM $table WHERE $ref = '{$value}'";
			$this -> result = mysqli_query($this -> connection, $this -> query);
			if ($this -> confirm_query($this -> result)) {
				#everything is good
				return $this -> result;
			}else{
				die("Database connection failed." . mysqli_error($this -> connection));
			}
		}

		public function find_by_query($query){
			$result = mysqli_query($this -> connection, $query);
			if($this -> confirm_query($result)){
				return $result;	
			}
			
		}

		public function user_ip(){
			$clientIp = $_SERVER['HTTP_CLIENT_IP'];
			$xForwardedFor = $_SERVER['HTTP_XFORWADED_FOR'];
			$remoteAddress = $_SERVER['REMOTE_ADDR'];
			if (!empty($clientIp)) {
				$userIp = $clientIp;
			}elseif (!empty($xForwardedFor)) {
				$userIp = $xForwardedFor;
			}else{
				$userIp = $remoteAddress;
			}

			return $userIp;
		}

		public function set_result(){
			return $this -> result; 
		}

		public function get_result(){
			//obtain the result and set it
			return $this -> set_result();
		}

		public function encrypt($password){
			$length = 22;
			$salt = $this -> generate_salt($length);
			$hash_format = '$2y$10$';
			$format_salt = $hash_format.$salt;
			$hashed_password = crypt($password, $format_salt);
			return $hashed_password;
		}

		public function generate_salt($length){
			$unique_random_string = md5(uniqid(mt_rand(), true));
			$base64_string = base64_encode($unique_random_string);
			$modified_base64_string = str_replace('+', '.', $base64_string);
			$salt = substr($modified_base64_string, 0, $length);
			return $salt;
		}

		public function decrypt($password, $existing_hash){
			$hash = crypt($password, $existing_hash);
			if ($hash === $existing_hash) {
				return true;
			}else{
				return false;
			}
		}

		public function escape_string($string){
			return mysqli_real_escape_string($this -> connection, $string);
		}

		public function register_admin($safeFirstName, $safeLastName, $safeEmail,
									  $hashed_pass, $safeCategory){
			$query  = "INSERT INTO  ";
			$query .= "admin (email_address, first_name, last_name, category, password) ";
			$query .= "VALUES ('{$safeEmail}', '{$safeFirstName}', '{$safeLastName}', '{$safeCategory}', '{$hashed_pass}') ";
			$result = mysqli_query($this -> connection, $query);
			return $this -> confirm_query($result);
		}

		public function add_flat($txtCategorySelect, $txtCategoryNameAdd, $txtAmountPerCopy){
			$query  = "INSERT INTO  ";
			$query .= "fee (category_name, fee_category, amount_per_copy) ";
			$query .= "VALUES ('{$txtCategoryNameAdd}', '{$txtCategorySelect}', $txtAmountPerCopy) ";
			$result = mysqli_query($this -> connection, $query);
			return $this -> confirm_query($result);
		}

		public function add_rd($txtCategoryAddSelect, $txtCategoryNameAdd, $txtInitialLimitAdd, $txtAmountPerInitialLimitAdd, $txtAmountPerAdditionalCopyAdd){
			$query  = "INSERT INTO  ";
			$query .= "fee (category_name, fee_category, initial_limit, amount_per_initial_limit, amount_per_additional_copy) ";
			$query .= "VALUES ('{$txtCategoryNameAdd}', '{$txtCategoryAddSelect}', $txtInitialLimitAdd, $txtAmountPerInitialLimitAdd, $txtAmountPerAdditionalCopyAdd) ";
			$result = mysqli_query($this -> connection, $query);
			return $this -> confirm_query($result);
		}

		public function register_recommender($safeFirstName, $safeLastName, $safeEmail,
									  $hashed_pass){
			$query  = "INSERT INTO  ";
			$query .= "recommenders (email_address, password, first_name, last_name) ";
			$query .= "VALUES ('{$safeEmail}', '{$hashed_pass}', '{$safeFirstName}', '{$safeLastName}') ";
			$result = mysqli_query($this -> connection, $query);
			return $this -> confirm_query($result);
		}


		public function update_user($column, $value, $id, $table){
			$this -> set_table($table);
			$t = $this -> get_table();
			$value = $this -> escape_string($value);
			$query = "UPDATE $t SET $column = '{$value}' WHERE id = $id LIMIT 1 ";
			$result = mysqli_query($this -> connection, $query);
			if(!$result){
				die("Database connection failed. " . mysqli_error($this -> connection));
				return false;
			}else{
				return true;
			}
		}

		public function create_reset_record($user_id, $hashed_string){
			$query  = "INSERT INTO  ";
			$query .= "password_reset (hashed_link, user_id) ";
			$query .= "VALUES ('{$hashed_string}', $user_id) ";
			$result = mysqli_query($this -> connection, $query);
			return $this -> confirm_query($result);
			echo $user_id;
			echo $hashed_string;
			die(mysqli_connect_error($database -> connection));
		}

		public function update_reset_record($user_id, $hashed_string){
			$query = "UPDATE password_reset SET hashed_link = '$hashed_string' WHERE user_id = $user_id";
			$result = mysqli_query($this -> connection, $query);
			return $this -> confirm_query($result);
		}

		public function suspend_recommender($user_id){
			$response = array('error' => true);
			$status = "suspended";
			$query = "UPDATE recommenders SET status = '{$status}' WHERE id = $user_id LIMIT 1";
			$result = mysqli_query($this -> connection, $query);
			$this -> confirm_query($result);
			$num_rows = mysqli_affected_rows($this -> connection);
            if ($num_rows == 1) {
                //return true;
            }else{
                $response["error"] = false;
                $response["error_msg"] = "Internal Error. Contact admin";
            }
            echo json_encode($response);
		}

		public function get_number_signed($id){
			$query = "SELECT SUM('copies') AS num FROM recommendations WHERE authorisation_id = $id AND status='signed'";
			$result = mysqli_query($this -> connection, $query);
			$this -> confirm_query($result);
			$val = mysqli_fetch_assoc($result)["num"];
			if (!$val) {
				echo "nope";
			}else{
				echo $val;
			}
		}

		public function get_recommenders(){
            $response = array('error' => true);
            $query  = "SELECT * FROM recommenders";
            $result = mysqli_query($this -> connection, $query);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "You've not added any recommender";
                echo json_encode($response);
            }else{
                $response["rec"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $rec = array();
                    $rd["rec_id"] = $row["id"];
                    $rd["rec_name"] = $row["first_name"]." ".$row["last_name"];
                    $rd["rec_status"] = $row["status"];
                    $rd["no_signed"] = $this -> get_number_signed($row["id"]);
                    $rd["amount_additional"] = $row["amount_per_additional_copy"];
                    array_push($response["rd"], $rd);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function authorize($txtAuthorisationId, $safeReference, $safeCategory, $txtCopies, $amount, $status){
        	$query  = "INSERT INTO  ";
			$query .= "recommendations (authorisation_id, requester_reference, category_id, copies, amount, status) ";
			$query .= "VALUES ($txtAuthorisationId, '{$safeReference}', $safeCategory, $txtCopies, $amount, '{$status}') ";
			//die($query);
			$result = mysqli_query($this -> connection, $query);
			return $this -> confirm_query($result);
        }

		public function delete_recommender($user_id){
			$response = array('error' => true);
			$query = "DELETE FROM recommenders WHERE id = $user_id LIMIT 1";
			$result = mysqli_query($this -> connection, $query);
			$this -> confirm_query($result);
			$num_rows = mysqli_affected_rows($this -> connection);
            if ($num_rows == 1) {
                //return true;
            }else{
                $response["error"] = false;
                $response["error_msg"] = "Internal Error. Contact admin";
            }
            echo json_encode($response);
		}

		public function create_or_update($user_id, $hashed_string){
			$query = "SELECT * FROM password_reset WHERE user_id = $user_id";
			$result = $this -> find_by_query($query);

			if (mysqli_num_rows($result)==0) {
				$this -> create_reset_record($user_id, $hashed_string);
				
			}else{
				# update record already exist
				$this -> update_reset_record($user_id, $hashed_string);
			}
		}

		public function send_mail($txtEmail, $txtPassword, $table){
		    $ref = "email_address"; $value = $txtEmail; $this -> set_table($table);
			$this -> get_table(); $this -> find_by_sql($ref, $value); $this -> set_result();
			$result = $this -> get_result(); $result_array = mysqli_fetch_assoc($result);
			if (mysqli_num_rows($result)==0) {
				return false;
			}else{
				$id = $result_array["id"];
				//$name = $this -> get_first_name($id, "recommenders");
				$result = $this -> find_by_id($id);
				if ($result) {
					$name = mysqli_fetch_assoc($result)["first_name"];
				}else{
					$name = "Recommender";
				}

				$mail_body = '<!DOCTYPE html>
					<html>
					<head>
					<title>Mcpaeis::Password Notification</title>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1">
					<meta http-equiv="X-UA-Compatible" content="IE=edge" />
					<style type="text/css">
					    body, table, td, a{-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}
					    table, td{mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
					    img{-ms-interpolation-mode: bicubic;}

					    img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none;}
					    table{border-collapse: collapse !important;}
					    body{height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;}

					    a[x-apple-data-detectors] {
					        color: inherit !important;
					        text-decoration: none !important;
					        font-size: inherit !important;
					        font-family: inherit !important;
					        font-weight: inherit !important;
					        line-height: inherit !important;
					    }
					    @media screen and (max-width: 525px) {
					        .wrapper {
					          width: 100% !important;
					            max-width: 100% !important;
					        }
					        .logo img {
					          margin: 0 auto !important;
					        }
					        .mobile-hide {
					          display: none !important;
					        }

					        .img-max {
					          max-width: 100% !important;
					          width: 100% !important;
					          height: auto !important;
					        }
					        .responsive-table {
					          width: 100% !important;
					        }
					        .padding {
					          padding: 10px 5% 15px 5% !important;
					        }

					        .padding-meta {
					          padding: 30px 5% 0px 5% !important;
					          text-align: center;
					        }

					        .padding-copy {
					             padding: 10px 5% 10px 5% !important;
					          text-align: center;
					        }

					        .no-padding {
					          padding: 0 !important;
					        }

					        .section-padding {
					          padding: 50px 15px 50px 15px !important;
					        }

					        /* ADJUST BUTTONS ON MOBILE */
					        .mobile-button-container {
					            margin: 0 auto;
					            width: 100% !important;
					        }

					        .mobile-button {
					            padding: 15px !important;
					            border: 0 !important;
					            font-size: 16px !important;
					            display: block !important;
					        }

					    }
					    div[style*="margin: 16px 0;"] { margin: 0 !important; }
					</style>
					</head>
					<body style="margin: 0 !important; padding: 0 !important;">
					<!-- HEADER -->
					<table border="0" cellpadding="0" cellspacing="0" width="100%">
					    <tr>
					        <td bgcolor="#ffffff" align="center">
					            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;" class="wrapper">
					                <tr>
					                    <td align="center" valign="top" style="padding: 15px 0;" class="logo">
					                        <a href="#" target="_blank">
					                            <img alt="Logo" src="https://mathknust.000webhostapp.com/public/php/mail/logo-2.jpg" width="60" height="60" style="display: block; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-size: 16px;" border="0">
					                        </a>
					                    </td>
					                </tr>
					            </table>
					        </td>
					    </tr>
					    <tr>
					        <td bgcolor="#D8F1FF" align="center" style="padding: 70px 15px 70px 15px;" class="section-padding">
					            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px;" class="responsive-table">
					                <tr>
					                    <td>
					                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
					                            <tr>
					                                <td class="padding" align="center">
													Dear '.$name .' Please find below your password for the Mcpaeis recommedation system.<br/><br />
					                                For security resasons, it is advised you commit it to memory and delete this mail.<br /><br />
					                                If you face any challenges accessing the system, please contact the administrator.    
					                                </td>
					                            </tr>
					                            <tr>
					                                <td align="center">
					                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
					                                        <tr>
					                                            <td align="center" style="padding-top: 25px;" class="padding">
					                                                <table border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
					                                                    <tr>
					                                                        <td align="center" style="border-radius: 3px;" bgcolor="#256F9C"><span style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; border-radius: 3px; padding: 15px 25px; border: 1px solid #256F9C; display: inline-block;" class="mobile-button">
					                                                        User Id: '. $txtEmail.'</td>
					                                                    </tr>
					                                                </table>
					                                            </td>
					                                        </tr>
					                                    </table>
					                                    <!-- password table -->
					                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
					                                        <tr>
					                                            <td align="center" style="padding-top: 25px;" class="padding">
					                                                <table border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
					                                                    <tr>
					                                                        <td align="center" style="border-radius: 3px;" bgcolor="#256F9C"><span style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; border-radius: 3px; padding: 15px 25px; border: 1px solid #256F9C; display: inline-block;" class="mobile-button">
					                                                        Password: '. $txtPassword.'<span></td>
					                                                    </tr>
					                                                </table>
					                                            </td>
					                                        </tr>
					                                    </table>
					                                </td>
					                            </tr>
					                        </table>
					                    </td>
					                </tr>
					            </table>
					        </td>
					    </tr>
					</table>
					</body>
					</html>';
				// this will be in the form of an html file
				$subject = "Mcpaeis Password Reset";
				$headers  = 'MIME-Version: 1.0' . "\r\n";
				$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
				$headers .= "From: <math.admin@sdt.com>\r\n ";
				$to = $txtEmail;
				$mail_result  = mail($to, $subject, $mail_body, $headers);
				
				if ($mail_result) {
					#mail sent successfully
					return true;
				}else{
					return false;
				}
			}	
		}

		public function delete_reset_record($user_id){
			$query = "DELETE FROM password_reset WHERE user_id = $user_id LIMIT 1";
			$result = mysqli_query($this -> connection, $query);
			return $this -> confirm_query($result);
		}
		public function close_db(){
			return mysqli_close($this -> connection);
		}

	}
	$database = new Database();
?>