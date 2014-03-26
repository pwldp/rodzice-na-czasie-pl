angular.module('kidsApp', ['ssAngular'])
.config(function(authProvider,$routeProvider,$locationProvider) {
    authProvider.authServiceModule('authorization');	// server/rpc/authorization
    authProvider.loginPath('/login');
    $routeProvider.
	when('/login', {controller:'AuthCtrl', templateUrl:'login.html'}). 
	//when('/home', {controller:'homeCtrl', templateUrl:'base.html'}).
    otherwise({redirectTo:'/'});
    $locationProvider.html5Mode(true);
})
.run( function($rootScope, $location) {
	// register listener to watch route changes
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
	    console.log("current.templateUrl="+current.templateUrl);
	    console.log("next.templateUrl="+next.templateUrl);
    	    if ( $rootScope.loggedUser == null ) {
    		console.log("LISTENER: USER NOT LOGGED IN");
    	    
        	// no logged user, we should be going to #login
                if ( next.templateUrl == "login.html" ) {
            	    // already going to #login, no redirect needed
                } else {
            	    // not going to #login, we should redirect now
                    $location.path( "/loginTEST" );
                }
            
	    } else {
		console.log("LISTENER: USER LOGGED IN");
	    }
	})
})
.controller('AuthCtrl',['$scope', '$location', '$log', 'auth', function($scope, $location, $log, auth) {

    $scope.processAuth = function() {
	console.log("processAuth()");
        $scope.showError = false;
        var promise = auth.login($scope.user, $scope.password);
        promise.then(function(reason) {
            $log.log(reason);
            var newPath = '/home';
            if($scope.redirectPath) {
                newPath = $scope.redirectPath;
            }
            $location.path(newPath);
        }, function(reason) {
            $log.log(reason);
            $scope.showError = true;
            $scope.errorMsg = "Invalid login. The username and pass for the example app is user/pass";
        });
    };
           
    $scope.onFacebookLogin = function () {
	console.log("onFacebookLogin");
	window.location = "/auth/facebook";
    };
    
    $scope.onGoogleLogin = function () {
	console.log("onGoogleLogin");
	window.location = "/auth/google";
    };
}]);

