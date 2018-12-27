<?php require_once("includes.php"); ?>
<?php 
    class Settings{
        public $meter;

        public function create_fee(){
            $response = array("error" => true);
            $database = new Database();

            $txtCategoryAddSelect = trim($_POST["txtCategoryAddSelect"]);
            if ($txtCategoryAddSelect=="Flat") {
                # code...
                $txtCategoryNameAdd = $_POST["txtCategoryNameAdd"];
                $txtAmountPerCopyAdd = $_POST["txtAmountPerCopyAdd"];
                $safeName = $database -> escape_string($txtCategoryNameAdd);
                $safeAmount = $database -> escape_string($txtAmountPerCopyAdd);
                $result = $database -> add_flat($txtCategoryAddSelect, $safeName, $safeAmount);
                if (!$result) {
                    $response["error"] = false;
                    $response["error_msg"] = "Internal Error. Please contact admin";
                }

            }elseif ($txtCategoryAddSelect=="Reducing Balance") {
                $txtCategoryNameAdd = $_POST["txtCategoryNameAdd"];
                $txtInitialLimitAdd = $_POST["txtInitialLimitAdd"];
                $txtAmountPerInitialLimitAdd = $_POST["txtAmountPerInitialLimitAdd"];
                $txtAmountPerAdditionalCopyAdd = $_POST["txtAmountPerAdditionalCopyAdd"];
                $result = $database -> add_rd($txtCategoryAddSelect, $txtCategoryNameAdd, $txtInitialLimitAdd, $txtAmountPerInitialLimitAdd, $txtAmountPerAdditionalCopyAdd);
                if (!$result) {
                    $response["error"] = false;
                    $response["error_msg"] = "Internal Error. Please contact admin";
                }
                
            }
            echo json_encode($response);

        }

        public function get_flat_fee(){
            $database = new Database();
            $response = array('error' => true);
            $database -> set_table("fee");
            $ref = "fee_category";
            $value = "Flat";
            $result = $database -> find_by_sql($ref, $value);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "You've not added any flat category";
                echo json_encode($response);
            }else{
                $response["flat"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $flat = array();
                    $flat["c_id"] = $row["id"];
                    $flat["c_name"] = $row["category_name"];
                    $flat["fee"] = $row["amount_per_copy"];
                    array_push($response["flat"], $flat);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function get_rd_fee(){
            $database = new Database();
            $response = array('error' => true);
            $database -> set_table("fee");
            $ref = "fee_category";
            $value = "Reducing Balance";
            $result = $database -> find_by_sql($ref, $value);
            if (mysqli_num_rows($result)==0) {
                $response["error"] = false;
                $response["error_msg"] = "You've not added any reducing balance category";
                echo json_encode($response);
            }else{
                $response["rd"] = array();
                while ($row = mysqli_fetch_array($result)) {
                    // temp user array
                    $rd = array();
                    $rd["c_id"] = $row["id"];
                    $rd["c_name"] = $row["category_name"];
                    $rd["limit"] = $row["initial_limit"];
                    $rd["amount_limit"] = $row["amount_per_initial_limit"];
                    $rd["amount_additional"] = $row["amount_per_additional_copy"];
                    array_push($response["rd"], $rd);
                }            
                // echoing JSON response
                echo json_encode($response);
            }
        }

        public function update_fee($id){
            $response = array("error" => true);
            $database = new Database();
            $fCat = $database -> escape_string(trim($_POST["categoryChangeFlat"]));
            if ($fCat=="Flat") {
                $cName = $database -> escape_string(trim($_POST["txtCategoryNameEditF"]));
                $amount = $database -> escape_string(trim($_POST["txtAmountPerCopyEditF"]));
                $query = "UPDATE fee SET category_name = '{$cName}', fee_category = '{$fCat}', amount_per_copy = $amount WHERE id = $id";
                //die($query);
                $result = mysqli_query($database -> connection, $query);
                $database -> confirm_query($result);
                $num_rows = mysqli_affected_rows($database -> connection);
                if ($num_rows == 1) {
                    //return true;
                }else{
                   $response["error"] = false;
                   $response["error_msg"] = "Internal Error. Contact admin";
                }
                echo json_encode($response);

            }elseif($fCat=="Reducing Balance"){
                $cName = $database -> escape_string(trim($_POST["txtCategoryNameEditF"]));
                $limit = $database -> escape_string(trim($_POST["txtInitialLimitEditF"]));
                $amountLimit = $database -> escape_string(trim($_POST["txtAmountPerInitialLimitEditF"]));
                $amountAdditional = $database -> escape_string(trim($_POST["txtAmountPerAdditionalCopyEditF"]));
                $query = "UPDATE fee SET category_name = '{$cName}', fee_category = '{$fCat}', initial_limit = $limit, amount_per_initial_limit = $amountLimit, amount_per_additional_copy = $amountAdditional  WHERE id = $id";
                //die($query);
                $result = mysqli_query($database -> connection, $query);
                $database -> confirm_query($result);
                $num_rows = mysqli_affected_rows($database -> connection);
                if ($num_rows == 1) {
                    //return true;
                }else{
                    $response["error"] = false;
                    $response["error_msg"] = "Internal Error. Contact admin";
                }
                echo json_encode($response);
            }
        }

        public function delete_fee($id){
            $response = array("error" => true);
            $database = new Database();
            $query = "DELETE FROM fee WHERE id = $id LIMIT 1";
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
    } 

    $settings = new Settings();
?>