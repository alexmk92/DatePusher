<?php

require_once("../../Database.php");

// Prepare to Insert the new record
$DB = Database::getInstance();


// Once INSERT has finished, return the top 50 results, get all but the latest row
$statement = "SELECT time_id, username, dob FROM aliveTimes ORDER BY time_id DESC LIMIT 50";

try {

    $rows = $DB->run__query($statement);
    $returnData = array();

    // Put the data into a table row to return to AJAX
    foreach($rows as $row) {
        array_push($returnData, array( "name"=>$row['username'],
            "dob"=>$row['dob'],
            "timeId"=>$row['time_id']
        ));
    }


    // Check we have data, if we do then return the JSON encoded return data
    if(sizeof($returnData) > 0) {
        echo json_encode($returnData);
    }

} catch(Exception $e) {

}


