<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Any meta data -->
    <meta charset="UTF-8">

    <title>Date Pusher - Impress your friends!</title>

    <!-- CSS Links -->
    <link rel="stylesheet" type="text/css" href="<?php echo CSS_DIR . "main.css" ?>" />

    <!-- Using Angular JS to build this application -->
    <script type="text/javascript" src="<?php echo LIB_DIR . "angular.min.js" ?>" ></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0rc1/angular-route.min.js" ></script>
    <script type="text/javascript" src="<?php echo LIB_DIR . "controllers.js" ?>" ></script>

</head>

<!--
    Define the name of the app here and set the main controller, all child nodes
    of body will use FetchUserCtrl until a new controller is specified.

    data-ng-init: Will call the init function of FetchUserCtrl to initialise the side bar
-->
<body ng-app="DatePusher" ng-controller="FetchUserCtrl" data-ng-init="init()">