<?php

require_once("../../Database.php");

// Prepare to Insert the new record
$DB = Database::getInstance();


// Once INSERT has finished, return the top 50 results, get all but the latest row
$statement = "SELECT username, dob FROM aliveTimes
              WHERE time_id < (SELECT MAX(time_id) FROM aliveTimes)
              ORDER BY time_id DESC
              LIMIT 50";

try {

    $rows = $DB->run__query($statement);
    $returnData = array();

    // Put the data into a table row to return to AJAX
    foreach($rows as $row) {
        array_push($returnData, array( "name"=>$row['username'],
            "dob"=>$row['dob']
        ));
    }

    // Check we have data, if we do then return the JSON encoded return data
    if(sizeof($returnData) > 0) {
        echo json_encode($returnData);
    }

} catch(Exception $e) {

}

