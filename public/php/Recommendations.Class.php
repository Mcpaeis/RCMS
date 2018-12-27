<?php 
	class Recommendation extends Database
	{

		public function update_recommender($meter_id){
			
			$query = "UPDATE meter_status SET credit_status = $status WHERE meter_id = $meter_id";
			//die($query);
			$result = mysqli_query($this -> connection, $query);
			$this -> confirm_query($result);
			$num_rows = mysqli_affected_rows($this -> connection);
			if ($num_rows == 1) {
				return true;
			}else{
				
				return false;
			}
		}

		public function authorize_request(){
            $response = array("error" => true);
            # code...
            $txtRequesterReference =  $_POST["txtRequesterReference"];
            $txtAuthorisationId = $_POST["txtAuthorisationId"];
            $txtCategory = $_POST["txtCategory"];
            $txtCopies = trim($_POST["txtNumberOfCopies"]);
            $amount = $this -> calculate_amount($txtCategory, $txtCopies);
            $status = "lo authorized";
            $safeReference = $this -> escape_string($txtRequesterReference);
            $safeCategory = $this -> escape_string($txtCategory);
            $result = $this -> authorize($txtAuthorisationId, $safeReference, $safeCategory, $txtCopies, $amount, $status);
            if (!$result) {
                $response["error"] = false;
                $response["error_msg"] = "Internal Error. Please contact admin";
            }
            echo json_encode($response);

        }

        public function calculate_amount($id, $numberOfCopies){
        	//get the initial limit::get the amount per initial limit
        	//check if the number of copies is less or equal than the initial limit::amount=number of copies * amount per initial limit
        	//if the number of copies is greater than  the initial limit::amount=initial limt * amount per initial limit + (number of copies - initial limt)* amount per additional copy
        	$this -> set_table("fee");
        	$result = $this -> find_by_id($id);
        	$result_array = mysqli_fetch_assoc($result);
        	$category_name = $result_array["fee_category"];
        	if ($category_name=="Reducing Balance") {
        		$initialLimit = $result_array["initial_limit"];
	        	$amountPerInitialLimit = $result_array["amount_per_initial_limit"];
	        	$amountPerAdditionalCopy = $result_array["amount_per_additional_copy"];
	        	if ($numberOfCopies <= $initialLimit) {
	        		return ($numberOfCopies * $amountPerInitialLimit);
	        	}elseif ($numberOfCopies > $initialLimit) {
	        		$initialAmount = $initialLimit * $amountPerInitialLimit;
	        		$additionalAmount = ($numberOfCopies - $initialLimit) * $amountPerAdditionalCopy; 
	        		return ($initialAmount + $additionalAmount);
	        	}
        	}elseif ($category_name=="Flat") {
        		$amountPerCopy = $result_array["amount_per_copy"];
        		return ($numberOfCopies * $amountPerCopy);
        	}
        }

        public function get_fee_category(){
            $response = array('error' => true);
            $query = "SELECT id, category_name FROM fee";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "You've not added any category yet";
                echo json_encode($response);
            }else{
                $response["cat"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $cat = array();
                    $cat["c_id"] = $row["id"];
                    $cat["c_name"] = $row["category_name"];
                    array_push($response["cat"], $cat);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function get_number_recommendations_signed($id){
            //$response = array('error' => true);
            $query = "SELECT COUNT(copies) AS no_copies FROM recommendations WHERE authorisation_id = $id";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                return 0;
            }else{
                return mysqli_fetch_assoc($result)["no_copies"];
            }

        }

        public function get_recommenders(){
            $response = array('error' => true);
            $query = "SELECT * FROM recommenders";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "You've not added any recommender";
                echo json_encode($response);
            }else{
                $response["aut"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $aut = array();
                    $aut["aut_id"] = $row["id"];
                    $no_copies = $this -> get_number_recommendations_signed($row["id"]);
                    $aut["no_signed"] = $no_copies;
                    $name = $this -> get_recommender_name($row["id"]);
                    $aut["aut_name"] = $name;
                    $aut["aut_date"] = $row["date_added"];
                    $aut["aut_status"] = $row["status"];
                    array_push($response["aut"], $aut);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function get_authorized($id){
            $response = array('error' => true);
            $query = "SELECT * FROM recommendations WHERE authorisation_id = $id AND status = 'lo authorized' ";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "You've not authorized any recommendation yet";
                echo json_encode($response);
            }else{
                $response["aut"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $aut = array();
                    $aut["aut_id"] = $row["id"];
                    $aut["req_ref"] = $row["requester_reference"];
                    $aut["aut_date"] = $row["date_requested"];
                    $aut["aut_no"] = $row["copies"];
                    array_push($response["aut"], $aut);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

         public function get_lo_authorized(){
            $response = array('error' => true);
            $query = "SELECT * FROM recommendations WHERE status = 'lo authorized' ";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "No recommendation have been authorized";
                echo json_encode($response);
            }else{
                $response["lo"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $lo = array();
                    $lo["lo_id"] = $row["id"];
                    $recommenderId = $row["authorisation_id"];
                    $recommender = $this -> get_recommender_name($recommenderId);
                    $lo["recommender"] = $recommender;
                    $lo["req_ref"] = $row["requester_reference"];
                    $lo["aut_date"] = $row["date_requested"];
                    $lo["aut_no"] = $row["copies"];
                    $lo["amount"] = $row["amount"];
                    array_push($response["lo"], $lo);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function get_go_issued($id){
            $response = array('error' => true);
            $query = "SELECT * FROM recommendations WHERE status = 'go issued' AND authorisation_id = $id ";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "No recommendation have been issued";
                echo json_encode($response);
            }else{
                $response["lo"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $lo = array();
                    $lo["aut_id"] = $row["id"];
                    $lo["req_ref"] = $row["requester_reference"];
                    $lo["aut_date"] = $row["date_requested"];
                    $lo["aut_no"] = $row["copies"];
                    array_push($response["lo"], $lo);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function get_go_qued(){
            $response = array('error' => true);
            $query = "SELECT * FROM recommendations WHERE status = 'go qued' ";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "No recommendation have been qued";
                echo json_encode($response);
            }else{
                $response["lo"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $lo = array();
                    $lo["aut_id"] = $row["id"];
                    $recommenderId = $row["authorisation_id"];
                    $recommender = $this -> get_recommender_name($recommenderId);
                    $lo["recommender"] = $recommender;
                    $lo["req_ref"] = $row["requester_reference"];
                    $lo["aut_date"] = $row["date_requested"];
                    $lo["aut_no"] = $row["copies"];
                    array_push($response["lo"], $lo);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function get_total_issued($begin_date, $end_date){
            if ($begin_date==null && $end_date==null) {
                //query all recommendations issued
                $query = "SELECT SUM(copies) AS no_issued FROM recommendations WHERE status='lo signed' OR status='go issued'";
                $result = mysqli_query($this -> connection, $query);
                $this -> confirm_query($result);
                if (mysqli_num_rows($result)==0) {
                    return 0;
                }else{
                    return mysqli_fetch_assoc($result)["no_issued"];
                }
            }elseif($begin_date==null && $end_date!=null){
                $query = "SELECT * FROM recommendations WHERE status='lo signed' OR status='go issued'";
                $result = mysqli_query($this -> connection, $query);
                $this -> confirm_query($result);
                if (mysqli_num_rows($result)==0) {
                    return 0;
                }else{
                    $copies = null;
                    while($value=mysqli_fetch_assoc($result)){
                        $comp = preg_split('/\s+/', $value["date_issued"]);
                        if ($comp[0]<= $end_date) {
                            $copies = $copies + $value["copies"]; 
                        }
                    }
                    return $copies==null ? 0 : $copies;
                }
            }elseif ($begin_date!=null && $end_date==null) {
                $query = "SELECT * FROM recommendations WHERE status='lo signed' OR status='go issued'";
                $result = mysqli_query($this -> connection, $query);
                $this -> confirm_query($result);
                if (mysqli_num_rows($result)==0) {
                    return 0;
                }else{
                    $copies = null;
                    while($value=mysqli_fetch_assoc($result)){
                        $comp = preg_split('/\s+/', $value["date_issued"]);
                        if ($comp[0] >= $begin_date) {
                            $copies = $copies + $value["copies"]; 
                        }
                    }
                    return $copies==null ? 0 : $copies;
                }
            }elseif ($begin_date!=null && $end_date !=null) {
                $query = "SELECT * FROM recommendations WHERE status='lo signed' OR status='go issued'";
                $result = mysqli_query($this -> connection, $query);
                $this -> confirm_query($result);
                if (mysqli_num_rows($result)==0) {
                    return 0;
                }else{
                    $copies = null;
                    while($value=mysqli_fetch_assoc($result)){
                        $comp = preg_split('/\s+/', $value["date_issued"]);
                        if ($comp[0]>=$begin_date && $comp[0]<= $end_date) {
                            $copies = $copies + $value["copies"]; 
                        }
                    }
                    return $copies==null ? 0 : $copies;
                }
            }
            
        }

        public function get_total_amount($begin_date, $end_date){
            if ($begin_date==null && $end_date==null) {
                //query all recommendations issued
                $query = "SELECT SUM(amount) AS total_amount FROM recommendations WHERE status='lo signed' OR status='go issued'";
                $result = mysqli_query($this -> connection, $query);
                $this -> confirm_query($result);
                if (mysqli_num_rows($result)==0) {
                    return 0;
                }else{
                    return mysqli_fetch_assoc($result)["total_amount"];
                }
            }elseif($begin_date==null && $end_date!=null){
                $query = "SELECT * FROM recommendations WHERE status='lo signed' OR status='go issued'";
                $result = mysqli_query($this -> connection, $query);
                $this -> confirm_query($result);
                if (mysqli_num_rows($result)==0) {
                    return 0;
                }else{
                    $amount = null;
                    while($value=mysqli_fetch_assoc($result)){
                        $comp = preg_split('/\s+/', $value["date_issued"]);
                        if ($comp[0]<= $end_date) {
                            $amount = $amount + $value["amount"]; 
                        }
                    }
                    return $amount==null ? 0 : $amount;
                }
            }elseif ($begin_date!=null && $end_date==null) {
                $query = "SELECT * FROM recommendations WHERE status='lo signed' OR status='go issued'";
                $result = mysqli_query($this -> connection, $query);
                $this -> confirm_query($result);
                if (mysqli_num_rows($result)==0) {
                    return 0;
                }else{
                    $amount = null;
                    while($value=mysqli_fetch_assoc($result)){
                        $comp = preg_split('/\s+/', $value["date_issued"]);
                        if ($comp[0] >= $begin_date) {
                            $amount = $amount + $value["amount"]; 
                        }
                    }
                    return $amount==null ? 0 : $amount;
                }
            }elseif ($begin_date!=null && $end_date !=null) {
                $query = "SELECT * FROM recommendations WHERE status='lo signed' OR status='go issued'";
                $result = mysqli_query($this -> connection, $query);
                $this -> confirm_query($result);
                if (mysqli_num_rows($result)==0) {
                    return 0;
                }else{
                    $amount = null;
                    while($value=mysqli_fetch_assoc($result)){
                        $comp = preg_split('/\s+/', $value["date_issued"]);
                        if ($comp[0] >= $begin_date && $comp[0]<=$end_date) {
                            $amount = $amount + $value["amount"]; 
                        }
                    }
                    return $amount==null ? 0 : $amount;
                }
            }
        }

        public function get_issued(){
            //for go issued
            $response = array('error' => true);
            $query = "SELECT * FROM recommendations WHERE status = 'go issued' ";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "No recommendation have been issued";
                echo json_encode($response);
            }else{
                $response["lo"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $lo = array();
                    $lo["aut_id"] = $row["id"];
                    $recommenderId = $row["authorisation_id"];
                    $recommender = $this -> get_recommender_name($recommenderId);
                    $txtCategory = $row["category_id"];
                    $txtCopies = $row["copies"];
                    $amount = $this -> calculate_amount($txtCategory, $txtCopies);
                    $lo["amount"] = $amount;
                    $lo["recommender"] = $recommender;
                    $lo["req_ref"] = $row["requester_reference"];
                    $lo["aut_date"] = $row["date_requested"];
                    $lo["aut_no"] = $txtCopies;
                    array_push($response["lo"], $lo);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function get_issued_admin(){
            //for go issued
            $response = array('error' => true);
            $query = "SELECT * FROM recommendations WHERE status = 'go issued' OR status = 'lo signed' ";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "No recommendation have been issued or signed";
                echo json_encode($response);
            }else{
                $response["lo"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $lo = array();
                    $lo["aut_id"] = $row["id"];
                    $recommenderId = $row["authorisation_id"];
                    $recommender = $this -> get_recommender_name($recommenderId);
                    $txtCategory = $row["category_id"];
                    $txtCopies = $row["copies"];
                    $amount = $this -> calculate_amount($txtCategory, $txtCopies);
                    $lo["amount"] = $amount;
                    $lo["recommender"] = $recommender;
                    $lo["req_ref"] = $row["requester_reference"];
                    $lo["aut_date"] = $row["date_requested"];
                    $lo["aut_no"] = $txtCopies;
                    array_push($response["lo"], $lo);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function get_printable(){
            $begin_date = trim($_POST["txtBeginDate"]);
            $end_date = trim($_POST["txtEndDate"]);
            //for go issued
            $total_amount = $this -> get_total_amount($begin_date, $end_date);
            $total_issued = $this -> get_total_issued($begin_date, $end_date);
            $response = array('error' => true, 'total_amount' => $total_amount, 'total_issued' => $total_issued);
            $query = "SELECT * FROM recommendations WHERE status = 'go issued' OR status = 'lo signed' ";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "No recommendation have been issued or signed";
                echo json_encode($response);
            }else{   
                if ($begin_date==null && $end_date==null) {
                    $response["lo"] = array();
                    while ($row = mysqli_fetch_array($result)) {
                        // temp user array
                        $lo = array();
                        $lo["aut_id"] = $row["id"];
                        $recommenderId = $row["authorisation_id"];
                        $recommender = $this -> get_recommender_name($recommenderId);
                        $txtCategory = $row["category_id"];
                        $txtCopies = $row["copies"];
                        $amount = $this -> calculate_amount($txtCategory, $txtCopies);
                        $lo["amount"] = $amount;
                        $lo["recommender"] = $recommender;
                        $lo["req_ref"] = $row["requester_reference"];
                        $lo["aut_date"] = $row["date_requested"];
                        $lo["aut_no"] = $txtCopies;
                        array_push($response["lo"], $lo);
                    }
                    // echoing JSON response
                    echo json_encode($response);      
                }elseif($begin_date==null && $end_date!=null){
                    $count = 0;
                    $response["lo"] = array();
                    while($row=mysqli_fetch_assoc($result)){
                        $comp = preg_split('/\s+/', $row["date_issued"]);
                        if ($comp[0]<= $end_date) {
                            $count  = $count + 1 ;
                            $lo = array();
                            $lo["aut_id"] = $row["id"];
                            $recommenderId = $row["authorisation_id"];
                            $recommender = $this -> get_recommender_name($recommenderId);
                            $txtCategory = $row["category_id"];
                            $txtCopies = $row["copies"];
                            $amount = $this -> calculate_amount($txtCategory, $txtCopies);
                            $lo["amount"] = $amount;
                            $lo["recommender"] = $recommender;
                            $lo["req_ref"] = $row["requester_reference"];
                            $lo["aut_date"] = $row["date_requested"];
                            $lo["aut_no"] = $txtCopies;
                            array_push($response["lo"], $lo);
                        }
                    }
                    if ($count!=0) {
                        // echoing JSON response
                        echo json_encode($response);
                    }else{
                       $response["error"] = false;
                        $response["error_msg"] = "No recommendation have been issued or signed";
                        echo json_encode($response); 
                    }
                }elseif ($begin_date!=null && $end_date==null) {
                    $count = 0;
                    $response["lo"] = array();
                    while($row=mysqli_fetch_assoc($result)){
                        $comp = preg_split('/\s+/', $row["date_issued"]);
                        if ($comp[0] >= $begin_date) {
                            $count  = $count + 1 ;
                            $lo = array();
                            $lo["aut_id"] = $row["id"];
                            $recommenderId = $row["authorisation_id"];
                            $recommender = $this -> get_recommender_name($recommenderId);
                            $txtCategory = $row["category_id"];
                            $txtCopies = $row["copies"];
                            $amount = $this -> calculate_amount($txtCategory, $txtCopies);
                            $lo["amount"] = $amount;
                            $lo["recommender"] = $recommender;
                            $lo["req_ref"] = $row["requester_reference"];
                            $lo["aut_date"] = $row["date_requested"];
                            $lo["aut_no"] = $txtCopies;
                            array_push($response["lo"], $lo);
                        }
                    }
                    if ($count!=0) {
                        // echoing JSON response
                        echo json_encode($response);
                    }else{
                       $response["error"] = false;
                        $response["error_msg"] = "No recommendation have been issued or signed";
                        echo json_encode($response); 
                    }
                }elseif ($begin_date!=null && $end_date !=null) {
                    $count = 0;
                    $response["lo"] = array();
                    while($row=mysqli_fetch_assoc($result)){
                        $comp = preg_split('/\s+/', $row["date_issued"]);
                        if ($comp[0]>=$begin_date && $comp[0]<= $end_date) {
                            $count  = $count + 1 ;
                            $lo = array();
                            $lo["aut_id"] = $row["id"];
                            $recommenderId = $row["authorisation_id"];
                            $recommender = $this -> get_recommender_name($recommenderId);
                            $txtCategory = $row["category_id"];
                            $txtCopies = $row["copies"];
                            $amount = $this -> calculate_amount($txtCategory, $txtCopies);
                            $lo["amount"] = $amount;
                            $lo["recommender"] = $recommender;
                            $lo["req_ref"] = $row["requester_reference"];
                            $lo["aut_date"] = $row["date_requested"];
                            $lo["aut_no"] = $txtCopies;
                            array_push($response["lo"], $lo);
                        }
                    }
                    if ($count!=0) {
                        // echoing JSON response
                        echo json_encode($response);
                    }else{
                        $response["error"] = false;
                        $response["error_msg"] = "No recommendation have been issued or signed";
                        echo json_encode($response); 
                    }
                }
            }
        }

        public function get_lo_signed($id){
            $response = array('error' => true);
            $query = "SELECT * FROM recommendations WHERE status = 'lo signed' AND authorisation_id = $id ";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "No recommendation have been signed";
                echo json_encode($response);
            }else{
                $response["lo"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $lo = array();
                    $lo["aut_id"] = $row["id"];
                    $recommenderId = $row["authorisation_id"];
                    $recommender = $this -> get_recommender_name($recommenderId);
                    $txtCategory = $row["category_id"];
                    $txtCopies = $row["copies"];
                    $amount = $this -> calculate_amount($txtCategory, $txtCopies);
                    $lo["amount"] = $amount;
                    $lo["recommender"] = $recommender;
                    $lo["req_ref"] = $row["requester_reference"];
                    $lo["aut_date"] = $row["date_requested"];
                    $lo["aut_no"] = $txtCopies;
                    array_push($response["lo"], $lo);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function get_authorizedUpdate($id){
            $response = array('error' => true);
            $query = "SELECT * FROM recommendations WHERE id = $id LIMIT 1 ";
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "You've not authorized any recommendation yet";
                echo json_encode($response);
            }else{
                $response["aut"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $aut = array();
                    //$aut["aut_id"] = $row["id"];
                    $aut["req_ref"] = $row["requester_reference"];
                    ///$aut["aut_date"] = $row["date_requested"];
                    $aut["aut_no"] = $row["copies"];
                    array_push($response["aut"], $aut);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function delete_recommendation($id){
            $response = array("error" => true);
            $database = new Database();
            $query = "DELETE FROM recommendations WHERE id = $id LIMIT 1";
            $result = mysqli_query($database -> connection, $query);
            $num_rows = mysqli_affected_rows($database -> connection);
            if ($num_rows == 1) {
                //row was successfully deleted
            }else{
                $response["error"] = false;
                $response["error_msg"] = "Internal Error. Contact admin";
            }
            echo json_encode($response);
        }

        public function update_recommendation($id){
            $response = array("error" => true);
            $txtReference = $this -> escape_string(trim($_POST["txtReference"]));
            $txtCategory = $_POST["txtCategory"];
            $txtCopies = $_POST["txtCopies"];
            $amount = $this -> calculate_amount($txtCategory, $txtCopies);
          
            $query = "UPDATE recommendations SET requester_reference = '{$txtReference}', category_id = $txtCategory, copies = $txtCopies, amount = $amount  WHERE id = $id LIMIT 1";
            //die($query);
            $result = mysqli_query($this -> connection, $query);
            $this -> confirm_query($result);
            $num_rows = mysqli_affected_rows($this -> connection);
            if ($num_rows == 1) {
                //return true;
            }else{
                $response["error"] = false;
                $response["error_msg"] = "Internal Error. Contact admin ";
            }
            echo json_encode($response);
        }

        public function go_qued($id){
            $response = array("error" => true);
            $database = new Database();
            $query = "UPDATE recommendations SET status = 'go qued' WHERE id = $id LIMIT 1";
            $result = mysqli_query($database -> connection, $query);
            $num_rows = mysqli_affected_rows($database -> connection);
            if ($num_rows == 1) {
                //row was successfully updated
            }else{
                $response["error"] = false;
                $response["error_msg"] = "Internal Error. Contact admin";
            }
            echo json_encode($response);
        }

        public function go_issued($id){
            $response = array("error" => true);
            $database = new Database();
            $query = "UPDATE recommendations SET status = 'go issued' WHERE id = $id LIMIT 1";
            $result = mysqli_query($database -> connection, $query);
            $num_rows = mysqli_affected_rows($database -> connection);
            if ($num_rows == 1) {
                //row was successfully updated
            }else{
                $response["error"] = false;
                $response["error_msg"] = "Internal Error. Contact admin";
            }
            echo json_encode($response);
        }

         public function lo_sign($id){
            $response = array("error" => true);
            $database = new Database();
            $query = "UPDATE recommendations SET status = 'lo signed' WHERE id = $id LIMIT 1";
            $result = mysqli_query($database -> connection, $query);
            $num_rows = mysqli_affected_rows($database -> connection);
            if ($num_rows == 1) {
                //row was successfully updated
            }else{
                $response["error"] = false;
                $response["error_msg"] = "Internal Error. Contact admin";
            }
            echo json_encode($response);
        }
	}

	

	$recommendation = new Recommendation();
?>