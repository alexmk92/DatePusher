<div id="mainWrapper">
    <section id="mainForm">

        <section id="centerPanel">
            <form>
                <p class="help">Ever wondered how old you are? Just enter your name and Date of Birth below!</p>

                <input id="name" pattern="([A-Za-z]{3,15}[- ]?){1,3}" type="text" ng-model="userName" placeholder="Name..." />
                <input id="dob" type="date" ng-model="userDob" value="1992-11-14" />

                <button type="button" class="fetchBtn" ng-click="newResult()">Get Results</button>
            </form>

            <div id="aliveStats" ng-model="timeAlive">
                <p>{{ timeAlive }}</p>
            </div>

        </section>
    </section>

    <aside id="previousFeed">
        <div class="userCard" ng-repeat="request in requests" ng-click="setDisplay(request)">
            <div class="accessory"></div>
            <div class="textWrap">
                <p>{{request.name}}</p>
                <p>{{request.dob}}</p>
                <span class="hidden">{{ request.dateString }}</span>
            </div>
        </div>
    </aside>
</div>