<?php require_once("includes.php"); ?>
<?php 
    class Registration{
        public $min_max; public $mail; public $pass; public $phone; public $Email; 

        public function create_recommender(){
                    $response = array("error" => true);

                    $txtEmail = trim($_POST["txtAddEmail"]);
                    $txtPassword = trim($_POST["txtAddPassword"]);
                    $txtFirstName = trim($_POST["txtAddFirstName"]);
                    $txtLastName = trim($_POST["txtAddLastName"]);
                    $table = "recommenders";

                    $this -> Email = $txtEmail;
                    //$this -> Email = $txtEmail; $this -> Phone = $txtPhone;

                    $database = new Database();
                    $validate_registration = new ValidateRegistration();

                    if (!($validate_registration -> validate_email($txtEmail, $table))) {
                        //echo $validate_registration -> error_email_message;
                        $this -> mail = $validate_registration -> error_email_message;
                        $response["error"] = false;
                        $response["error_msg"] = $this -> mail;
                        echo json_encode($response);
                    }elseif (!($validate_registration -> strong_password($txtPassword, $txtPassword))) {
                        //password repeated the same because of the generation process
                        $this -> pass = $validate_registration -> error_pass_message;
                        $response["error"] = false;
                        $response["error_msg"] = $this -> pass;
                        echo json_encode($response);
                    }else{
                        $database = new Database();
                        $safePass = $database -> escape_string($txtPassword);
                        $hashedPass = $database -> encrypt($safePass);
                        $safeEmail = $database -> escape_string($txtEmail);
                        $safeFirstName = $database -> escape_string($txtFirstName);
                        $safeLastName = $database -> escape_string($txtLastName);
                        $success = $database -> register_recommender(
                                                                    $safeFirstName, 
                                                                    $safeLastName, 
                                                                    $safeEmail,
                                                                    $hashedPass
                                                                    );
                        $database -> send_mail($txtEmail, $txtPassword, $table);
                        echo json_encode($response);
                    }

                }

        public function create_secretary(){
                    $response = array("error" => true);

                    $txtEmail = trim($_POST["txtAddEmail"]);
                    $txtPassword = trim($_POST["txtAddPassword"]);
                    $txtFirstName = trim($_POST["txtAddFirstName"]);
                    $txtLastName = trim($_POST["txtAddLastName"]);
                    $table = "admin";

                    $this -> Email = $txtEmail;
                    //$this -> Email = $txtEmail; $this -> Phone = $txtPhone;

                    $database = new Database();
                    $validate_registration = new ValidateRegistration();

                    if (!($validate_registration -> validate_email($txtEmail, $table))) {
                        //echo $validate_registration -> error_email_message;
                        $this -> mail = $validate_registration -> error_email_message;
                        $response["error"] = false;
                        $response["error_msg"] = $this -> mail;
                        echo json_encode($response);
                    }elseif (!($validate_registration -> strong_password($txtPassword, $txtPassword))) {
                        //password repeated the same because of the generation process
                        $this -> pass = $validate_registration -> error_pass_message;
                        $response["error"] = false;
                        $response["error_msg"] = $this -> pass;
                        echo json_encode($response);
                    }else{
                        $database = new Database();
                        $safePass = $database -> escape_string($txtPassword);
                        $hashedPass = $database -> encrypt($safePass);
                        $safeEmail = $database -> escape_string($txtEmail);
                        $safeFirstName = $database -> escape_string($txtFirstName);
                        $safeLastName = $database -> escape_string($txtLastName);
                        $status = "sec";
                        $success = $database -> register_admin(
                                                                    $safeFirstName, 
                                                                    $safeLastName, 
                                                                    $safeEmail,
                                                                    $hashedPass,
                                                                    $status
                                                                    );
                        echo json_encode($response);
                        $database -> send_mail($txtEmail, $txtPassword, $table);
                    }

                }

        public function create_admin(){
                    $response = array("error" => true);

                    $txtEmail = trim($_POST["txtAddEmail"]);
                    $txtPassword = trim($_POST["txtAddPassword"]);
                    $txtFirstName = trim($_POST["txtAddFirstName"]);
                    $txtLastName = trim($_POST["txtAddLastName"]);
                    $table = "admin";

                    $this -> Email = $txtEmail;
                    //$this -> Email = $txtEmail; $this -> Phone = $txtPhone;

                    $database = new Database();
                    $validate_registration = new ValidateRegistration();

                    //first check to ensure that an admin does not already exist
                    $query = "SELECT * FROM admin WHERE category='admin' ";
                    $result = $database -> find_by_query($query);
                    if (mysqli_num_rows($result) == 1) {
                        //admin already exist
                        $response["error"] = false;
                        $response["error_msg"] = "Admin Already Exist";
                        echo json_encode($response);
                    }elseif (!($validate_registration -> validate_email($txtEmail, $table))) {
                        //echo $validate_registration -> error_email_message;
                        $this -> mail = $validate_registration -> error_email_message;
                        $response["error"] = false;
                        $response["error_msg"] = $this -> mail;
                        echo json_encode($response);
                    }elseif (!($validate_registration -> strong_password($txtPassword, $txtPassword))) {
                        //password repeated the same because of the generation process
                        $this -> pass = $validate_registration -> error_pass_message;
                        $response["error"] = false;
                        $response["error_msg"] = $this -> pass;
                        echo json_encode($response);
                    }else{
                        $database = new Database();
                        $safePass = $database -> escape_string($txtPassword);
                        $hashedPass = $database -> encrypt($safePass);
                        $safeEmail = $database -> escape_string($txtEmail);
                        $safeFirstName = $database -> escape_string($txtFirstName);
                        $safeLastName = $database -> escape_string($txtLastName);
                        $status = "admin";
                        $success = $database -> register_admin(
                                                                    $safeFirstName, 
                                                                    $safeLastName, 
                                                                    $safeEmail,
                                                                    $hashedPass,
                                                                    $status
                                                                    );
                        echo json_encode($response);
                    }

                }
    } 

    $registration = new Registration();
?>