<?php

// JSON request sent in header from home.php, this needs to be read through file_get_contents
// as nothing will be in $_POST or $_GET
$request = file_get_contents("php://input");

if(isset($request)) {

    $json = json_decode($request);

    // Extract details from the array
    $name  = $json->name;
    $dob   = $json->dob;
    $alive = $json->alive;

    // Prepare to Insert the new record



} else {
    echo 'error';
}

