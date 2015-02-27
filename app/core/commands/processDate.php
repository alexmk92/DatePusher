<?php

require_once("../../Database.php");

// JSON request sent in header from home.php, this needs to be read through file_get_contents
// as nothing will be in $_POST or $_GET
$request = file_get_contents("php://input");

if(isset($request)) {

    $json = json_decode($request);

    // Extract details from the array
    $name  = $json->name;
    $dob   = $json->dob;


    // Prepare to Insert the new record
    $DB = Database::getInstance();
    $statement = "INSERT INTO aliveTimes (username, dob) VALUES(:username, :dob)";


    // Prepare the insert safely
    try {

        $insert = $DB->connection->prepare($statement);

        // Bind the parameters to the executed insert query - convert date to time so it will INSERT a non default val
        $insert->execute(array(
            ":username"=>$name,
            ":dob"=>date("Y-m-d H:i:s", strtotime($dob))
        ));

        $insert->closeCursor();
    } catch(Exception $e) {

    }
}

