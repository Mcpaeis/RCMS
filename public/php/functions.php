<?php

class DB_Functions {
 
    private $conn;
 
    // constructor
    function __construct() {
        require_once 'DB.Class.php';
        // connecting to database
        $db = new Db_Connect();
        $this->conn = $db->connect();
    }
 
    // destructor
    function __destruct() {
         
    }
 
    /**
     * Storing new user
     * returns user details
     */
    public function storeUser($email, $password, $mobile) {
        //$uuid = uniqid('', true);
        $hash = $this->hashSSHA($password);
        $encrypted_password = $hash["encrypted"]; // encrypted password
        $salt = $hash["salt"]; // salt
        
        $query = "INSERT INTO users(email, encrypted_password, phone_number, salt) VALUES('$email', '$encrypted_password', $mobile, '$salt')";
        $result = mysqli_query($this -> conn, $query);
        // check for successful store
        if ($result) {
            $query = "SELECT * FROM users WHERE email = '$email'";
            $result = mysqli_query($this -> conn, $query);
            $num = mysqli_num_rows($result);
        }else{
            mysqli_error($this-> conn);
        }
    }
 
    /**
     * Get user by email and password
     */
    public function getUserByEmailAndPassword($email, $password) {
 
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE email = $email");
 
        $stmt->bind_param("s", $email);
 
        if ($stmt->execute()) {
            $user = $stmt->get_result()->fetch_assoc();
            $stmt->close();
 
            // verifying user password
            $salt = $user['salt'];
            $encrypted_password = $user['encrypted_password'];
            $hash = $this->checkhashSSHA($salt, $password);
            // check for password equality
            if ($encrypted_password == $hash) {
                // user authentication details are correct
                return $user;
            }
        } else {
            return NULL;
        }
    }
 
    /**
     * Check user is existed or not
     */
    public function isUserExisted($email) {
        $stmt = $this->conn->prepare("SELECT email from users WHERE email = {'$email'}");

        if ($stmt) {
            # code...
            $stmt->bind_param("s", $email);
 
            $stmt->execute();
     
            $stmt->store_result();
     
            if ($stmt->num_rows > 0) {
                // user existed 
                $stmt->close();
                return true;
            } else {
                // user not existed
                $stmt->close();
                return false;
            }
        }else{
            echo $stmt;
        }
    }
 
    /**
     * Encrypting password
     * returns salt and encrypted password
     */
    public function hashSSHA($password) {
 
        $salt = sha1(rand());
        $salt = substr($salt, 0, 10);
        $encrypted = base64_encode(sha1($password . $salt, true) . $salt);
        $hash = array("salt" => $salt, "encrypted" => $encrypted);
        return $hash;
    }
 
    /**
     * Decrypting password
     * @param salt, password
     * returns hash string
     */
    public function checkhashSSHA($salt, $password) {
 
        $hash = base64_encode(sha1($password . $salt, true) . $salt);
 
        return $hash;
    }
 
}
 
?>