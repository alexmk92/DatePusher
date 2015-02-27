<?php

/*
|--------------------------------------------------------------------------
| Config
|--------------------------------------------------------------------------
|
| Require the configuration constants to connect to the db, 
| DB_HOST, DB_NAME, DB_USER, DB_PASS
|
*/

require_once('config.php');

/*
|--------------------------------------------------------------------------
| Database class
|--------------------------------------------------------------------------
|
| Builds a PDO database object, adopting the singleton pattern to allow only one
| instanciation to improve performance.
|
*/

class Database
{

/*
|--------------------------------------------------------------------------
| Local vars
|--------------------------------------------------------------------------
|
| Declare any local variable which the class should access
| $instance   - the single instanciated instance of the class (signleton)
| $connection - the connection to the database
|
*/

private static $instance;
public         $connection;

/*
|--------------------------------------------------------------------------
| Construct
|--------------------------------------------------------------------------
|
| Builds the database and sets the connection, applying the singleton
| pattern to allow one open instaciation socket to the DB
|
*/

private function __construct()
{
    $this -> connection = new PDO('mysql:host='.DB_HOST.'; dbname='.DB_NAME.';charset=utf8', DB_USER, DB_PASS);
}


/*
|--------------------------------------------------------------------------
| Get instance
|--------------------------------------------------------------------------
|
| Returns the set instance to ensure only one socket stays open.
|
*/

public static function getInstance()
{
    $object = __CLASS__;

    !isset(self::$instance) ? self::$instance = new $object : false;

    return self::$instance;
}

/*
|--------------------------------------------------------------------------
| Run query
|--------------------------------------------------------------------------
|
| Runs a given query and returns a JSON formatted array containing the
| result set
|
*/

public function run__query($statement) {

    // Open the connection
    $DB = Database::getInstance();
    $DB->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    try {
        // Prepare an execute the statement
        $query = $DB->connection->prepare($statement);
        $query->execute();

        // Check we got rows back and return the json object
        if($query->rowCount() > 0) {
            return $query->fetchAll();
        } else {
            return false;
        }
    } catch (Exception $e) {

    }
}

}