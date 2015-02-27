
<section id="mainForm">

    <form>
        <p class="help">Ever wondered how old you are? Just enter your name and Date of Birth below!</p>

        <input id="name" pattern="([A-Za-z]{3,15}[- ]?){1,3}" type="text" ng-model="userName" placeholder="Name..." />
        <input id="dob" type="date" ng-model="userDob" placeholder="1992-11-14" />

        <button type="button" class="fetchBtn" ng-click="newResult()">Get Results</button>
    </form>

    <div id="aliveStats" ng-model="timeAlive">
        <p>{{ timeAlive }}</p>
    </div>

</section>

<aside id="previousFeed">
    <div class="oldEntry" ng-repeat="request in requests">
        <p>{{request.name + " " + request.dob}}</p>
    </div>
</aside>