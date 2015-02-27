

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

    // Requests is empty by default
    $scope.requests = {};

    // Initialise the app
    $scope.init = function() {
        $scope.getPosts();
    };

    // Function is executed when the user clicks the fetch button
    $scope.newResult = function() {

        // Catch the inputs and format them
        var userName = $scope.userName;
        var userDob  = $scope.userDob;

        // Check if the type of and value of userName and Dob are undefined, if they are don't progress
        if (!(userName === undefined) && !(userDob === undefined))
        {
            // Script to be called based upon current info set
            $scope.url = './app/core/commands/processDate.php';

            // Set the amount of time the person has been alive
            $scope.getTimeAlive(userDob, true);

            // Format the string before sending to server for processing
            userName.trim();

            // Create POST request to the file in the url, send it to PHP in JSON format
            var callback = $http.post($scope.url, {
                                                      "name"  : userName,
                                                      "dob"   : userDob
                                                  }
                                     );
            // Success callback from server - returns the data from PHP file and the HTTP status
            callback.success(function() {
                $scope.getPosts();
            });
            // Error callback from server - internal error of some sort (normally 404)
            callback.error(function() {
                    alert("Error: Could not connect to the MySQL client, please try again.");
            });
        }
    };

    // Return the time alive based on a given timestamp
    $scope.getTimeAlive = function(userDob, shortString) {

        // Get todays date
        var today = new Date();

        // Ensure the given date or string is in date format
        userDob = new Date(userDob);

        // Set the amount of time the person has been alive
        var timeAlive = Math.abs(userDob - today) / 1000;

        // Start decrementing from the total time alive, setting the appropriate variables with their data
        var yearsAlive = Math.floor(timeAlive / 31536000);
        timeAlive -= yearsAlive * 31536000;

        // 86400 seconds are in a day
        var daysAlive  = Math.floor(timeAlive / 86400);
        timeAlive -= daysAlive * 86400;

        // The remainder out of a day to get hours
        var hoursAlive = Math.floor(timeAlive % 24);

        // Set the output string for each field
        var days  = daysAlive  != 1 ? "days"  : "day";
        var years = yearsAlive != 1 ? "years" : "year";
        var hours = hoursAlive != 1 ? "hours" : "hour";

        // Update the DOM
        if(shortString === true)
            $scope.timeAlive = "Wow, you have been alive for " + yearsAlive + " " + years + ", " + daysAlive + " " + days + " and " + hoursAlive + " " + hours + "!";
        // Output string for the render cards
        else {
            timeAlive = yearsAlive + " " + years + ", " + daysAlive + " " + days + " and " + hoursAlive + " " + hours + " old!";
            return timeAlive;
        }
    };


    // Gets all previous results
    $scope.getPosts = function() {

        // Script to be called based upon current info set, then clear the current requests array
        $scope.url = './app/core/commands/getPosts.php';

        // Create POST request to the file in the url, send it to PHP in JSON format
        var callback = $http.post($scope.url);

        // Success callback from server - returns the data from PHP file and the HTTP status
        callback.success(function(data) {

            var res = {};

            // Build objects to be rendered to the div
            for(var i = 0; i < data.length; i++) {

                var alive = $scope.getTimeAlive(data[i].dob, false);
                var name  = data[i].name;

                res[i] =  { "name": name, "dob": alive } ;
            }

            $scope.requests = res;
        });
        // Error callback from server - internal error of some sort (normally 404)
        callback.error(function() {
            alert("Error: Could not connect to the MySQL client, please try again.");
        });
    };

});

