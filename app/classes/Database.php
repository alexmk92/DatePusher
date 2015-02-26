<?php

class Database
{
    private static $instance;
    public         $connection;

    private function __construct() {
        $this->connection = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8', DB_USER, DB_PASS);
    }
}