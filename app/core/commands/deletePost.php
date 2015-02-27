<?php

require_once("../../Database.php");

$deleteKey = file_get_contents("php://input");

if(isset($deleteKey)) {

    var_dump($deleteKey);

    $DB = Database::getInstance();

    $statement = "DELETE FROM aliveTimes WHERE time_id = :deleteKey";

    $delete = $DB->connection->prepare($statement);

    $delete->execute(array(
        "deleteKey"=>$deleteKey
    ));

    $delete->closeCursor();
}
