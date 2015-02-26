

angular.module("DatePusher", ['ngRoute'])

/*
 |--------------------------------------------------------------------------
 | Fetch Controller
 |--------------------------------------------------------------------------
 |
 | Return the users total time alive
 |
 | @param $scope - Passed by Angular, contains set values including the DoB
 |                 and name that the user sent.
 |
 | @param $http  - The http request to be served to the browser
 |
 */

.controller("FetchUserCtrl", function($scope, $http) {

    // Script to be called based upon current info set
    $scope.url = './app/core/commands/processDate.php';

    // Requests is empty by default
    $scope.requests = [];

    // Function is executed when the user clicks the fetch button
    $scope.newResult = function() {

        // Catch the inputs and format them
        var userName = $scope.userName;
        var userDob  = $scope.userDob;

        // Get todays date
        var today    = new Date();

        // Check if the type of and value of userName and Dob are undefined, if they are don't progress
        if (!(userName === undefined) && !(userDob === undefined))
        {
            // Set the amount of time the person has been alive (60*60*1000 converts ms to hours (milli*sec*1000=1hr)
            var timeAlive = Math.abs(userDob - today) / (60 * 60 * 1000);

            // Format the string before sending to server for processing
            userName.trim();

            // Create POST request to the file in the url, send it to PHP in JSON format
            var callback = $http.post($scope.url, {
                                                      "name"  : userName,
                                                      "dob"   : userDob,
                                                      "alive" : timeAlive
                                                  }
                                     );
            // Success callback from server - returns the data from PHP file and the HTTP status
            callback.success(function(data, status) {
                    $scope.status = status;

            });
            // Error callback from server - internal error of some sort (normally 404)
            callback.error(function(data, status) {
                    $scope.status = status;

            });
        }
    };
});

