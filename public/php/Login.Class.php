<?php require_once("includes.php"); ?>

<?php 
    
    class Login {

        public $Email; public $Password; public $userMail; public $reset_error;

        public function login_admin(){
            $response = array("error" => true);

            $txtEmail = $_POST["txtStaffId"];
            $txtPassword = $_POST["txtPassword"];
            $this -> userMail = $txtEmail;

            $validate_login = new ValidateLogin();
            #that is been taken care of by the validate class
            if ($validate_login -> login_admin($txtEmail, $txtPassword)) {
                $user_id = $validate_login -> get_userid();
                //$_SESSION["logged_user_id"] = $user_id;
                //check to see cookie does not already exist
                $response["user_id"] = $user_id; 
                echo json_encode($response);
                $this -> userMail = "";
                //return true;
            }elseif(!$validate_login -> login_admin($txtEmail, $txtPassword)){
                $this -> Email  = $validate_login -> error_mail_message;
                $this -> Password = $validate_login -> error_pass_message;
                $response["error"] = false;
                if (is_null($this -> Email) && !is_null($this -> Password)) {
                    $response["error_msg"] = $this -> Password;
                     echo json_encode($response);
                }elseif (is_null($this -> Password) && !is_null($this -> Email)) {
                    $response["error_msg"] = $this -> Email;   
                     echo json_encode($response);
                }
               
            }
        }
        public function login_sec(){
            $response = array("error" => true);

            $txtEmail = $_POST["txtStaffId"];
            $txtPassword = $_POST["txtPassword"];
            $this -> userMail = $txtEmail;

            $validate_login = new ValidateLogin();
            #that is been taken care of by the validate class
            if ($validate_login -> login_sec($txtEmail, $txtPassword)) {
                $user_id = $validate_login -> get_userid();
                //$_SESSION["logged_user_id"] = $user_id;
                //check to see cookie does not already exist
                $response["user_id"] = $user_id; 
                echo json_encode($response);
                $this -> userMail = "";
                //return true;
            }elseif(!$validate_login -> login_sec($txtEmail, $txtPassword)){
                $this -> Email  = $validate_login -> error_mail_message;
                $this -> Password = $validate_login -> error_pass_message;
                $response["error"] = false;
                if (is_null($this -> Email) && !is_null($this -> Password)) {
                    $response["error_msg"] = $this -> Password;
                     echo json_encode($response);
                }elseif (is_null($this -> Password) && !is_null($this -> Email)) {
                    $response["error_msg"] = $this -> Email;   
                     echo json_encode($response);
                }
               
            }
        }

        public function login_rec(){
            $response = array("error" => true);

            $txtEmail = $_POST["txtStaffId"];
            $txtPassword = $_POST["txtPassword"];
            $this -> userMail = $txtEmail;

            $validate_login = new ValidateLogin();
            #that is been taken care of by the validate class
            if ($validate_login -> login_rec($txtEmail, $txtPassword)) {
                $user_id = $validate_login -> get_userid();
                //$_SESSION["logged_user_id"] = $user_id;
                //check to see cookie does not already exist
                $response["user_id"] = $user_id; 
                echo json_encode($response);
                $this -> userMail = "";
                //return true;
            }elseif(!$validate_login -> login_rec($txtEmail, $txtPassword)){
                $this -> Email  = $validate_login -> error_mail_message;
                $this -> Password = $validate_login -> error_pass_message;
                $response["error"] = false;
                if (is_null($this -> Email) && !is_null($this -> Password)) {
                    $response["error_msg"] = $this -> Password;
                     echo json_encode($response);
                }elseif (is_null($this -> Password) && !is_null($this -> Email)) {
                    $response["error_msg"] = $this -> Email;   
                     echo json_encode($response);
                }
               
            }
        }

        public function reset_password(){
            $txtEmail = $_POST["textRegisteredEmail"];
            $_SESSION["textRegisteredEmail"] = $txtEmail;
            $database = new Database();
            if(empty($txtEmail)){
                $this -> reset_error = "Email is empty!";
                return false;
            }elseif (!(filter_var($txtEmail, FILTER_VALIDATE_EMAIL))) {
                $this -> reset_error = "Email not valid!";
                return false;
            }else{
                // check to ensure the mail does not already exist
                $ref = "email_address";
                $value = $txtEmail;
                $database -> set_table("members");
                $database -> get_table();
                $database -> find_by_sql($ref, $value);
                $database -> set_result();
                $result = $database -> get_result();
                if (mysqli_num_rows($result)==0) {
                    $this -> reset_error = "Email Address Not Registered in Our System.";
                    return false;
                }else{
                    redirect_to("rSuccess.php");
                }
            }
        }

    }

    $login = new Login();

?>