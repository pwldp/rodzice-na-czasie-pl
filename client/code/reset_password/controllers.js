var resetPassApp = angular.module('resetPassApp', ['ssAngular'])
    .config(function($routeProvider,$locationProvider) {
    $routeProvider.
        when('/coninv', {controller:'convInvitCtrl', templateUrl:'confirm_invitation.html', reloadOnSearch: true}).
        when('/pswdreset/:pswdresetID', {controller:'resetPassCtrl', templateUrl:'change_password.html', reloadOnSearch: true}).
        when('/pswdreset', {controller:'resetPassCtrl', templateUrl:'change_password.html'});
        //otherwise({redirectTo:'/login', templateUrl: 'login.html', reloadOnSearch: false});
    $locationProvider.html5Mode(true);
})
.run( function($rootScope, $location, $routeParams) {
    //console.log($rootScope);
    //console.log($location);
    //console.log($routeParams);
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        //console.log("next.templateUrl="+next.templateUrl);
        //console.log("-------------------");
        //console.log("next");
        //console.log(next);
        //console.log("-------------------");
        //console.log("current");
        //console.log(current);
        //console.log("-------------------");
    });

})










/**************************************************************************************************************************** 

resetPassCtrl 

*****************************************************************************************************************************/

.controller('resetPassCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'rpc', function($scope, $location, $log, $rootScope, $routeParams, rpc) {

    $scope.your_email = $routeParams.e;

    passform = {};
    $scope.resetPassword = function(passform) {
        console.log(passform);
        if(passform.new_pass.length < 8) {
            $.jnotify("Podane hasło jest za krótkie. Hasło musi mieć co najmniej 8 znaków.", "error");
        }
        else if(passform.new_pass != passform.new_pass2) {
            $.jnotify("Podane hasła są różne. Proszę wpisać dwa takie same hasła.", "error");
        }
        else {
            var hash = $routeParams.h;
            var email = $routeParams.e;
            var new_pass = passform.new_pass;
            console.log(hash);
            console.log(email);
            console.log(new_pass);
            var promiseNewPass = rpc('rpc_Registration.pswdResetSubmit', hash, email, new_pass);
            promiseNewPass.then(function(resp) {
                console.log("Wywolalem pswdResetSubmit() i dostalem");
                console.log(resp);
                if(resp.ret == "OK") {
                    if(resp.res.toString() == "true") {
                        $.jnotify("Hasło zostało zmienione. Przejdź na stronę główną, żeby się zalogować.");
                        $("#resetpass_goto_main_button").show();
                    }
                    else
                        $.jnotify("Wystąpił błąd. Nie udało się zmienić hasła.", "error");
                }
                else
                    $.jnotify("Wystąpił błąd. Nie udało się zmienić hasła.", "error");
            });
            
        }
    }


    $scope.redirectToMain = function() {
        var pathArray = window.location.pathname.split( '/' );
        var host = pathArray[2];
        parent.location.href = host + "/login";
    }


}])










/**************************************************************************************************************************** 

convInvitCtrl 

*****************************************************************************************************************************/

.controller('convInvitCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', 'rpc', function($scope, $location, $log, $rootScope, $routeParams, rpc) {

    $scope.type = $routeParams.type;
    $scope.your_email = $routeParams.e;

    
    passform = {};
    $scope.confirmInvitation = function(passform) {
        console.log(passform);
        if(passform.new_pass.length < 8) {
            $.jnotify("Podane hasło jest za krótkie. Hasło musi mieć co najmniej 8 znaków.", "error");
        }
        else if(passform.new_pass != passform.new_pass2) {
            $.jnotify("Podane hasła są różne. Proszę wpisać dwa takie same hasła.", "error");
        }
        else {
            var hash = $routeParams.h;
            var email = $routeParams.e;
            var new_pass = passform.new_pass;
            console.log(hash);
            console.log(email);
            console.log(new_pass);
            var promiseNewPass = rpc('rpc_Registration.pswdResetSubmit', hash, email, new_pass);
            promiseNewPass.then(function(resp) {
                console.log("Wywolalem pswdResetSubmit() i dostalem");
                console.log(resp);
                if(resp.ret == "OK") {
                    if(resp.res.toString() == "true") {
                        $.jnotify("Hasło zostało zmienione. Przejdź na stronę główną, żeby się zalogować.");
                        $("#coninv_goto_main_button").show();
                    }
                    else
                        $.jnotify("Wystąpił błąd. Nie udało się zmienić hasła.", "error");
                }
                else
                    $.jnotify("Wystąpił błąd. Nie udało się zmienić hasła.", "error");
            });
            
        }
    }


    $scope.redirectToMain = function() {
        var pathArray = window.location.pathname.split( '/' );
        var host = pathArray[2];
        parent.location.href = host + "/login";
    }


}]);


