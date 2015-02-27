

angular.module("DatePusher", ['ngRoute'])

/*
 |--------------------------------------------------------------------------
 | Fetch Controller
 |--------------------------------------------------------------------------
 |
 | Main controller for this app, handles all communication with PHP files to
 | transact with the server.
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
        $scope.longPoll();
    };

    /*
     |--------------------------------------------------------------------------
     | New Result
     |--------------------------------------------------------------------------
     |
     | Triggered when a click event is fired from the client, this function
     | will sanitise the userName and userDob parameters sent in the $scope before
     | sending them to the server to INSERT the new record.
     |
     | @callback success : Fire a call to $scope.getPosts(); to update the list
     |                     of results
     | @callback error   : Prompts to the user that we couldn't connect to MySQL
     |                     the record was not INSERTED, but user can see updates
     |
     */
    $scope.newResult = function() {

        // Catch the inputs and format them
        var userName = $scope.userName;
        var userDob  = $scope.userDob;

        // Check if the type of and value of userName and Dob are undefined, if they are don't progress
        if (!(userName === undefined) && !(userDob === undefined))
        {
            // Script to be called based upon current info set
            $scope.url = './app/core/commands/processDate.php';

            // Set the amount of time the person has been alive, catch the Boolean return value,
            // an age greather than 110 is anticipated as invalid
            var isValidAge = $scope.getTimeAlive(userDob, true);

            // If the user provided a valid age, then update the system
            if(isValidAge)
            {
                // Format the string before sending to server for processing
                userName.trim();

                // Create POST request to the file in the url, send it to PHP in JSON format
                var callback = $http.post($scope.url, {
                        "name": userName,
                        "dob": userDob
                    }
                );
                // Success callback from server - returns the data from PHP file and the HTTP status
                callback.success(function () {
                    $scope.getPosts();
                });
                // Error callback from server - internal error of some sort (normally 404)
                callback.error(function () {
                    alert("Error: Could not connect to the MySQL client, please try again.");
                });
            }
        } else {
            $scope.timeAlive = "Hey, you forgot to enter information into the Name and Date fields, fill those out and try again.";
        }
    };

    /*
     |--------------------------------------------------------------------------
     | Get Time Alive
     |--------------------------------------------------------------------------
     |
     | Returns one of two formatted strings dependent on the users date of birth.
     | when called, this method will create a new date object from the provided
     | string, and then calculate the time difference between the two dates.
     |
     | @param userDob     : The users date of birth, either a string or date, both
     |                     are valid as a date can be reimplemented with new Date()
     |
     | @param longString  : (BOOL) - determines whether the full string or short
     |                      string should be returned, a short string is used for
     |                      cards which are rendered to the front end, whereas a
     |                      long string is used for the main prompt message
     |
     | @return Bool       : True if the age is valid, false if age is too large
     |
     | @return String     : Short formatted string for shortString requests
     |
     */
    $scope.getTimeAlive = function(userDob, longString) {

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
        var hoursAlive = Math.floor((timeAlive / (60 * 60)) % 24);

        // Set the output string for each field
        var days  = daysAlive  != 1 ? "days"  : "day";
        var years = yearsAlive != 1 ? "years" : "year";
        var hours = hoursAlive != 1 ? "hours" : "hour";

        // Update the DOM
        if(longString === true) {
            if (yearsAlive < 110) {
                $scope.timeAlive = "Wow, you have been alive for " + yearsAlive + " " + years + ", " + daysAlive + " " + days + " and " + hoursAlive + " " + hours + "!";
                return true;
            } else {
                $scope.timeAlive = "You're " + yearsAlive + " " + years + " old? I think somebody is telling porkies! How about you try again :)";
                return false;
            }
        }
        // Output string for the render cards
        else {
            timeAlive = yearsAlive + " " + years + ", " + daysAlive + " " + days + " and " + hoursAlive + " " + hours + " old!";
            return timeAlive;
        }
    };

    /*
     |--------------------------------------------------------------------------
     | Get Posts
     |--------------------------------------------------------------------------
     |
     | Returns all of the latest results back from the server, receives a JSON
     | object from getPosts.php on a successful callback
     |
     | @callback success : Update the page with the previous result
     |
     | @callback error   : Prompts to the user that we couldn't connect to MySQL
     |                     the record was not INSERTED, but user can see updates
     |
     */
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

                res[i] =  { "name": name, "dob": alive, "dateString": data[i].dob, "timeId": data[i].timeId } ;
            }

            $scope.requests = res;
        });
        // Error callback from server - internal error of some sort (normally 404)
        callback.error(function() {
            alert("Error: Could not connect to the MySQL client, please try again.");
        });
    };

    $scope.deletePost = function(request) {

        // Script to be called based upon current info set, then clear the current requests array
        $scope.url = './app/core/commands/deletePost.php';

        // Create POST request to the file in the url, send it to PHP in JSON format
        var callback = $http.post($scope.url, request.timeId);

        // Success callback from server - refresh the view
        callback.success(function() {
            $scope.getPosts();
        });
        // Error callback from server - internal error of some sort (normally 404)
        callback.error(function() {
            alert("Error: Could not connect to the MySQL client, please try again.");
        });
    };

    /*
     |--------------------------------------------------------------------------
     | Long Poll
     |--------------------------------------------------------------------------
     |
     | Refreshes the feed every 10 seconds, this shows when new users add who
     | are not on the host PC add their values - works by recursively calling
     | itself every x seconds.
     |
     */
    $scope.longPoll = function() {
        $scope.getPosts();
        setTimeout(function() {
            $scope.longPoll();
        }, (30000));
    };

    /*
     |--------------------------------------------------------------------------
     | Set Display
     |--------------------------------------------------------------------------
     |
     | Sets the name, dob and output message for the current user
     |
     */
    $scope.setDisplay = function(request) {
        $scope.userName = request.name;

        // Build the datepicker date
        var d = new Date(request.dateString);
        var date = d.toISOString().substring(0,10);

        // Set the date picker value
        var datePicker = document.querySelector('#dob');
        datePicker.value = date;

        // Update the GUI
        $scope.getTimeAlive(d, true);

    };

});

